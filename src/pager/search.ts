import type { Line } from "../render/types";
import type { Span } from "../style";
import { FULL_FOLDS } from "./case-folds";

export interface Match {
  line: number;
  /** Character offsets into the line's plain text. */
  start: number;
  end: number;
}

/**
 * Find all literal substring matches.
 *
 * Matching semantics (the contract the tests pin down):
 * 1. Smartcase: the search is case-insensitive unless the query contains an
 *    uppercase (\p{Lu}) or titlecase (\p{Lt}) letter; then it is an exact
 *    substring match.
 * 2. Caseless matching uses Unicode FULL case folding (CaseFolding.txt C+F,
 *    generated table in case-folds.ts), applied per character to both
 *    sides. Turkic (T) folds are excluded (locale-dependent).
 * 3. No normalization beyond folding: compatibility characters (NBSP,
 *    superscripts) do not fold, and canonically-equivalent composed vs
 *    decomposed spellings match only when case folding itself decomposes.
 * 4. Offsets always refer to the original string. A match that touches any
 *    part of a fold expansion (e.g. "s" in "ß") covers the whole original
 *    character, and each original range is reported at most once.
 * 5. Matches are non-overlapping, scanning left to right.
 */
export function findMatches(lines: Line[], query: string): Match[] {
  if (!query) return [];
  const caseSensitive = /[\p{Lu}\p{Lt}]/u.test(query);
  const matches: Match[] = [];
  if (caseSensitive) {
    lines.forEach((line, lineNo) => {
      let from = 0;
      for (;;) {
        const at = line.plain.indexOf(query, from);
        if (at === -1) break;
        matches.push({ line: lineNo, start: at, end: at + query.length });
        from = at + query.length;
      }
    });
    return matches;
  }
  const needle = foldCase(query).folded;
  lines.forEach((line, lineNo) => {
    const { folded, starts, ends } = foldCase(line.plain);
    let from = 0;
    for (;;) {
      const at = folded.indexOf(needle, from);
      if (at === -1) break;
      const start = starts[at]!;
      const end = ends[at + needle.length - 1]!;
      const prev = matches[matches.length - 1];
      // Two folded positions inside one expansion map to the same original
      // range ("s" twice in the fold of "ß"): report it once.
      if (!(prev && prev.line === lineNo && prev.start === start && prev.end === end)) {
        matches.push({ line: lineNo, start, end });
      }
      from = at + needle.length;
    }
  });
  return matches;
}

/**
 * Unicode full case fold of one character: the generated CaseFolding.txt
 * table (src/pager/case-folds.ts) for every fold toLowerCase lacks, then
 * toLowerCase. Deliberately NOT compatibility normalization — NBSP,
 * superscripts etc. must not fold.
 */
function foldChar(ch: string): string {
  return FULL_FOLDS.get(ch) ?? ch.toLowerCase();
}

/**
 * Per-character case fold with, for every folded position, the start and
 * end offsets of the original character that produced it.
 */
function foldCase(s: string): { folded: string; starts: number[]; ends: number[] } {
  let folded = "";
  const starts: number[] = [];
  const ends: number[] = [];
  let pos = 0;
  for (const ch of s) {
    const f = foldChar(ch);
    for (let k = 0; k < f.length; k++) {
      starts.push(pos);
      ends.push(pos + ch.length);
    }
    folded += f;
    pos += ch.length;
  }
  return { folded, starts, ends };
}

/**
 * In-session search history browsed with up/down in the search prompt.
 * Deliberately not persisted: writing a history file would be this
 * program's first fs-write capability (see tests/capabilities.test.ts).
 */
export class SearchHistory {
  private entries: string[] = [];
  private index = -1; // -1 = not browsing
  private draft = ""; // input stashed when browsing starts

  /** Record a committed query and stop browsing. */
  push(query: string): void {
    if (query && this.entries[this.entries.length - 1] !== query) {
      this.entries.push(query);
      if (this.entries.length > 100) this.entries.shift();
    }
    this.reset();
  }

  reset(): void {
    this.index = -1;
    this.draft = "";
  }

  /** Typing edits the input: whatever is shown becomes the new draft. */
  touch(): void {
    this.index = -1;
  }

  /** Up arrow: older entry, stashing `current` on first press. Null = no-op. */
  back(current: string): string | null {
    if (this.entries.length === 0) return null;
    if (this.index === -1) {
      this.draft = current;
      this.index = this.entries.length;
    }
    if (this.index === 0) return this.entries[0]!;
    this.index--;
    return this.entries[this.index]!;
  }

  /** Down arrow: newer entry, restoring the draft past the newest. Null = no-op. */
  forward(): string | null {
    if (this.index === -1) return null;
    this.index++;
    if (this.index >= this.entries.length) {
      const draft = this.draft;
      this.reset();
      return draft;
    }
    return this.entries[this.index]!;
  }
}

/**
 * Pick the starting match for a fresh search (matches must be non-empty).
 * Forward (`dir` 1): first match at/below `topLine`, wrapping to the first
 * match in the document. Backward (`dir` -1): last match at/above `topLine`,
 * wrapping to the last match in the document.
 */
export function pickInitialMatch(matches: Match[], topLine: number, dir: 1 | -1): number {
  if (dir === 1) {
    const idx = matches.findIndex((m) => m.line >= topLine);
    return idx === -1 ? 0 : idx;
  }
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i]!.line <= topLine) return i;
  }
  return matches.length - 1;
}

export interface HighlightRange {
  start: number;
  end: number;
  current: boolean;
}

/**
 * Overlay highlight styling onto a line's spans, splitting spans at range
 * boundaries. Offsets are plain-text character indexes. Pure: returns new
 * spans, the input line is untouched.
 */
export function applyHighlights(line: Line, ranges: HighlightRange[]): Span[] {
  if (ranges.length === 0) return line.spans;
  const out: Span[] = [];
  let pos = 0; // char offset of the start of the current span
  for (const span of line.spans) {
    const spanStart = pos;
    const spanEnd = pos + span.text.length;
    pos = spanEnd;
    // Collect boundaries falling inside this span.
    const cuts = new Set<number>([spanStart, spanEnd]);
    for (const r of ranges) {
      if (r.start > spanStart && r.start < spanEnd) cuts.add(r.start);
      if (r.end > spanStart && r.end < spanEnd) cuts.add(r.end);
    }
    const points = [...cuts].sort((a, b) => a - b);
    for (let i = 0; i + 1 < points.length; i++) {
      const from = points[i]!;
      const to = points[i + 1]!;
      const text = span.text.slice(from - spanStart, to - spanStart);
      if (!text) continue;
      const hit = ranges.find((r) => r.start < to && r.end > from);
      if (hit) {
        out.push({
          text,
          style: hit.current
            ? { ...span.style, inverse: true, bold: true }
            : { ...span.style, inverse: true, dim: true },
        });
      } else {
        out.push({ text, style: span.style });
      }
    }
  }
  return out;
}

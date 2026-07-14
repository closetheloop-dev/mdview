import type { Span } from "../style";
import { displayWidth, graphemes } from "../width";

interface Piece {
  text: string;
  style: Span["style"];
}

type Tok = { kind: "word" | "space"; pieces: Piece[]; width: number } | { kind: "break" };

/**
 * Word-wrap styled spans to `width` display columns, preserving styles
 * across split points. "\n" characters force a break. Words wider than the
 * width are hard-broken at grapheme boundaries. Returns at least one
 * (possibly empty) line.
 *
 * Adjacent fragments with no whitespace between them are one word even when
 * they come from different spans (e.g. punctuation hugging a code span), so
 * a line never breaks at a pure style boundary.
 */
export function wrapSpans(spans: Span[], maxWidth: number): Span[][] {
  const width = Math.max(1, maxWidth);
  const lines: Span[][] = [];
  let current: Span[] = [];
  let currentWidth = 0;
  let pending: { pieces: Piece[]; width: number } | null = null; // space run

  const push = (piece: Piece) => {
    const last = current[current.length - 1];
    if (last && last.style === piece.style) last.text += piece.text;
    else current.push({ text: piece.text, style: piece.style });
  };

  const flushLine = () => {
    lines.push(current);
    current = [];
    currentWidth = 0;
    pending = null;
  };

  for (const tok of tokenize(spans)) {
    if (tok.kind === "break") {
      flushLine();
      continue;
    }
    if (tok.kind === "space") {
      if (current.length > 0) {
        // Merge consecutive space runs; drop spaces at the start of a line.
        if (pending) {
          pending.pieces.push(...tok.pieces);
          pending.width += tok.width;
        } else {
          pending = { pieces: [...tok.pieces], width: tok.width };
        }
      }
      continue;
    }
    const spaceWidth = pending?.width ?? 0;
    if (currentWidth + spaceWidth + tok.width <= width) {
      if (pending) for (const p of pending.pieces) push(p);
      currentWidth += spaceWidth;
      pending = null;
      for (const p of tok.pieces) push(p);
      currentWidth += tok.width;
      continue;
    }
    // Doesn't fit: break the line (dropping the pending spaces)...
    if (current.length > 0) flushLine();
    if (tok.width <= width) {
      for (const p of tok.pieces) push(p);
      currentWidth = tok.width;
      continue;
    }
    // ...and hard-break a word wider than the whole line, keeping each
    // grapheme's style.
    for (const p of tok.pieces) {
      let buf = "";
      for (const g of graphemes(p.text)) {
        const w = displayWidth(g);
        if (currentWidth + w > width && currentWidth > 0) {
          if (buf) {
            push({ text: buf, style: p.style });
            buf = "";
          }
          flushLine();
        }
        buf += g;
        currentWidth += w;
      }
      if (buf) push({ text: buf, style: p.style });
    }
  }
  if (current.length > 0 || lines.length === 0) lines.push(current);
  return lines;
}

/** Cut spans so their total display width fits `max` columns. */
export function truncateSpansToWidth(spans: Span[], max: number): Span[] {
  let total = 0;
  for (const s of spans) total += displayWidth(s.text);
  if (total <= max) return spans;
  const out: Span[] = [];
  let used = 0;
  for (const span of spans) {
    const w = displayWidth(span.text);
    if (used + w <= max) {
      out.push(span);
      used += w;
      continue;
    }
    let text = "";
    for (const g of graphemes(span.text)) {
      const gw = displayWidth(g);
      if (used + gw > max) break;
      text += g;
      used += gw;
    }
    if (text) out.push({ text, style: span.style });
    break;
  }
  return out;
}

/**
 * Split spans into word / space-run / hard-break tokens. A word's pieces can
 * come from several spans when nothing separates them.
 */
function tokenize(spans: Span[]): Tok[] {
  const toks: Tok[] = [];
  let word: Piece[] = [];
  let wordWidth = 0;
  const endWord = () => {
    if (word.length > 0) {
      toks.push({ kind: "word", pieces: word, width: wordWidth });
      word = [];
      wordWidth = 0;
    }
  };
  for (const span of spans) {
    for (const piece of span.text.split(/(\n| +)/)) {
      if (!piece) continue;
      if (piece === "\n") {
        endWord();
        toks.push({ kind: "break" });
      } else if (/^ +$/.test(piece)) {
        endWord();
        toks.push({
          kind: "space",
          pieces: [{ text: piece, style: span.style }],
          width: piece.length,
        });
      } else {
        word.push({ text: piece, style: span.style });
        wordWidth += displayWidth(piece);
      }
    }
  }
  endWord();
  return toks;
}

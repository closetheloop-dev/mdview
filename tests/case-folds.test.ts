import { describe, expect, test } from "bun:test";
import { FULL_FOLDS } from "../src/pager/case-folds";
import { findMatches } from "../src/pager/search";
import { mkLine } from "../src/render/types";

const line = (text: string) => mkLine([{ text, style: {} }]);
const hasUpper = (s: string) => /[\p{Lu}\p{Lt}]/u.test(s);

/**
 * Independently re-derives the divergent-fold table from the pinned Unicode
 * data file and compares it to the generated, shipped table. A deliberately
 * separate parser from scripts/generate-case-folds.ts: both implementations
 * must agree for this to pass.
 */
const raw = await Bun.file(new URL("../data/CaseFolding.txt", import.meta.url)).text();

const expected = new Map<string, string>();
const seen = new Set<number>();
for (const rawLine of raw.split("\n")) {
  if (rawLine.startsWith("#") || rawLine.trim() === "") continue;
  const [codeField, statusField, mappingField] = rawLine.split(";").map((f) => f?.trim());
  if (!codeField || !statusField) continue;
  const cp = Number.parseInt(codeField, 16);
  seen.add(cp);
  if (statusField !== "C" && statusField !== "F") continue;
  const ch = String.fromCodePoint(cp);
  const fold = mappingField!
    .split(/\s+/)
    .map((c) => String.fromCodePoint(Number.parseInt(c, 16)))
    .join("");
  if (fold !== ch.toLowerCase()) expected.set(ch, fold);
}
// No fold entry at all = folds to itself; identity entries are required
// wherever toLowerCase would move the character (e.g. uppercase Cherokee).
for (let cp = 0; cp <= 0x10ffff; cp++) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue;
  if (seen.has(cp)) continue;
  const ch = String.fromCodePoint(cp);
  if (ch.toLowerCase() !== ch) expected.set(ch, ch);
}

describe("generated case-fold table", () => {
  test("matches the pinned CaseFolding.txt exactly", () => {
    expect(FULL_FOLDS.size).toBe(expected.size);
    for (const [ch, fold] of expected) {
      expect(FULL_FOLDS.get(ch)).toBe(fold);
    }
  });

  test("spot checks: expansions, sigma, ligatures, long s", () => {
    expect(FULL_FOLDS.get("ß")).toBe("ss");
    expect(FULL_FOLDS.get("ς")).toBe("σ");
    expect(FULL_FOLDS.get("ﬃ")).toBe("ffi");
    expect(FULL_FOLDS.get("ſ")).toBe("s"); // long s, missed by the old hand table
    expect(FULL_FOLDS.get("ǰ")).toBe("ǰ");
  });

  test("contains no compatibility mappings", () => {
    expect(FULL_FOLDS.has("\u00a0")).toBe(false); // NBSP
    expect(FULL_FOLDS.has("²")).toBe(false);
    expect(FULL_FOLDS.has("①")).toBe(false);
  });
});

/**
 * Property tests over the ENTIRE fold table: instead of case-by-case
 * examples, every entry must satisfy the invariants of the matching
 * contract documented on findMatches. New Unicode versions are covered
 * automatically on regeneration.
 */
describe("fold-table matching invariants (all entries)", () => {
  test("folding is idempotent: fold(fold(x)) === fold(x)", () => {
    const fold = (s: string) => [...s].map((c) => FULL_FOLDS.get(c) ?? c.toLowerCase()).join("");
    for (const [, folded] of FULL_FOLDS) {
      expect(fold(fold(folded))).toBe(fold(folded));
    }
  });

  test("the folded form as query matches the original, exactly once, covering it", () => {
    for (const [ch, folded] of FULL_FOLDS) {
      if (hasUpper(folded)) continue; // smartcase would flip to exact matching
      const m = findMatches([line(`x${ch}y`)], folded);
      expect(m).toEqual([{ line: 0, start: 1, end: 1 + ch.length }]);
    }
  });

  test("a lowercase original as query matches its own folded spelling", () => {
    for (const [ch, folded] of FULL_FOLDS) {
      if (hasUpper(ch) || hasUpper(folded)) continue;
      const m = findMatches([line(folded)], ch);
      expect(m.length).toBeGreaterThanOrEqual(1);
      expect(m[0]!.start).toBe(0);
    }
  });

  test("each character of an expansion yields at most one match per original character", () => {
    for (const [ch, folded] of FULL_FOLDS) {
      if (folded.length <= ch.length) continue; // only expansions
      for (const piece of new Set([...folded])) {
        if (hasUpper(piece)) continue;
        const m = findMatches([line(ch)], piece);
        expect(m.length).toBeLessThanOrEqual(1);
        if (m.length === 1) {
          expect(m[0]).toEqual({ line: 0, start: 0, end: ch.length });
        }
      }
    }
  });

  test("offsets from fold matches always lie within the original string", () => {
    for (const [ch, folded] of FULL_FOLDS) {
      if (hasUpper(folded)) continue;
      const text = `a${ch}b${ch}`;
      for (const m of findMatches([line(text)], folded)) {
        expect(m.start).toBeGreaterThanOrEqual(0);
        expect(m.end).toBeGreaterThan(m.start);
        expect(m.end).toBeLessThanOrEqual(text.length);
      }
    }
  });
});

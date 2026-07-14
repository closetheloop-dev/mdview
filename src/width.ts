const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** Split a string into grapheme clusters (user-perceived characters). */
export function graphemes(s: string): string[] {
  const out: string[] = [];
  for (const g of segmenter.segment(s)) out.push(g.segment);
  return out;
}

/** Display width of a string in terminal columns (CJK/emoji aware). */
export function displayWidth(s: string): number {
  return Bun.stringWidth(s, { countAnsiEscapeCodes: false });
}

/**
 * Truncate a string so its display width is at most `max`.
 * If truncation happens and `ellipsis` is given, it is appended and its
 * width counted against the budget.
 */
export function truncateToWidth(s: string, max: number, ellipsis = ""): string {
  if (displayWidth(s) <= max) return s;
  // An ellipsis wider than the whole budget would itself overflow: drop it.
  if (displayWidth(ellipsis) > max) ellipsis = "";
  const budget = Math.max(0, max - displayWidth(ellipsis));
  let out = "";
  let used = 0;
  for (const g of graphemes(s)) {
    const w = displayWidth(g);
    if (used + w > budget) break;
    out += g;
    used += w;
  }
  return out + ellipsis;
}

// Regenerates src/pager/case-folds.ts from the pinned Unicode data:
//   bun run scripts/generate-case-folds.ts
//
// Emits every C- and F-status full case fold that differs from what
// String.prototype.toLowerCase already produces (T/Turkic entries are
// locale-dependent and deliberately excluded; S/simple entries are the
// alternative to F, not additions). tests/case-folds.test.ts re-derives
// the same table with an independent parser and compares.
export {};

const SOURCE = "data/CaseFolding.txt";
const TARGET = "src/pager/case-folds.ts";

const text = await Bun.file(new URL(`../${SOURCE}`, import.meta.url)).text();
const versionLine = text.split("\n")[0]?.trim().replace(/^#\s*/, "") ?? "unknown";

const entries: { cp: number; ch: string; fold: string; name: string }[] = [];
const hasFoldEntry = new Set<number>();
for (const line of text.split("\n")) {
  const m = line.match(/^([0-9A-F]+); ([CFST]); ([0-9A-F ]+);\s*#\s*(.*)$/);
  if (!m) continue;
  const cp = Number.parseInt(m[1]!, 16);
  hasFoldEntry.add(cp);
  if (m[2] !== "C" && m[2] !== "F") continue; // T is locale-dependent, S is the alternative to F
  const ch = String.fromCodePoint(cp);
  const fold = m[3]!
    .trim()
    .split(/\s+/)
    .map((c) => String.fromCodePoint(Number.parseInt(c, 16)))
    .join("");
  if (fold === ch.toLowerCase()) continue; // toLowerCase already covers it
  entries.push({ cp, ch, fold, name: m[4]! });
}

// Characters with NO fold entry fold to themselves — but for some of those
// toLowerCase still moves them (Cherokee uppercase: folding targets the
// uppercase block). They need explicit identity entries or the toLowerCase
// fallback would mis-fold them.
for (let cp = 0; cp <= 0x10ffff; cp++) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue; // surrogates
  if (hasFoldEntry.has(cp)) continue;
  const ch = String.fromCodePoint(cp);
  if (ch.toLowerCase() !== ch) {
    entries.push({ cp, ch, fold: ch, name: "identity fold; toLowerCase would move it" });
  }
}
entries.sort((a, b) => a.cp - b.cp);

const esc = (s: string) =>
  [...s].map((c) => `\\u{${c.codePointAt(0)!.toString(16).padStart(4, "0")}}`).join("");

const lines = entries.map(({ ch, fold, name }) => `  ["${esc(ch)}", "${esc(fold)}"], // ${name}`);

const out = `// GENERATED FILE — do not edit. Regenerate with:
//   bun run scripts/generate-case-folds.ts
// Source: ${SOURCE} (${versionLine})
//
// Unicode full case folds (C- and F-status) that differ from
// String.prototype.toLowerCase. Turkic (T) folds are locale-dependent and
// excluded. Keys and values use escapes: several entries are invisible or
// have look-alike precomposed forms.

/** Full case folds not covered by toLowerCase (see file header). */
export const FULL_FOLDS = new Map<string, string>([
${lines.join("\n")}
]);
`;

await Bun.write(new URL(`../${TARGET}`, import.meta.url), out);
console.log(`wrote ${TARGET}: ${entries.length} entries (${versionLine})`);

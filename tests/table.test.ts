import { describe, expect, test } from "bun:test";
import { marked } from "marked";
import { renderBlocks } from "../src/render/render";
import { displayWidth } from "../src/width";

const TABLE = `| Left | Center | Right |
|:-----|:------:|------:|
| a | bb | 12345 |
| longer cell | c | 1 |`;

const plains = (md: string, width = 80) =>
  renderBlocks(marked.lexer(md), width).map((l) => l.plain);

describe("renderTable", () => {
  test("box drawing structure", () => {
    const lines = plains(TABLE);
    expect(lines[0]!.startsWith("┌")).toBe(true);
    expect(lines[0]!.endsWith("┐")).toBe(true);
    expect(lines[2]!.startsWith("├")).toBe(true);
    expect(lines[5]!.startsWith("└")).toBe(true);
    // all rows same width
    const widths = new Set(lines.map((l) => displayWidth(l)));
    expect(widths.size).toBe(1);
  });

  test("alignment padding", () => {
    const lines = plains(TABLE);
    const row = lines[3]!; // | a | bb | 12345 |
    const cells = row.split("│").slice(1, -1);
    expect(cells[0]).toMatch(/^ a +$/); // left aligned
    expect(cells[1]).toMatch(/^ +bb +$/); // centered
    expect(cells[2]).toMatch(/^ +12345 $/); // right aligned
  });

  test("header is bold", () => {
    const lines = renderBlocks(marked.lexer(TABLE), 80);
    const header = lines[1]!;
    const headerText = header.spans.filter((s) => s.text.trim().length > 0 && s.text !== "│");
    expect(headerText.length).toBeGreaterThan(0);
    for (const s of headerText) expect(s.style.bold).toBe(true);
  });

  test("wide table is shrunk to terminal width with ellipsis", () => {
    const wide = `| ${"a".repeat(60)} | ${"b".repeat(60)} |\n|---|---|\n| x | y |`;
    const lines = plains(wide, 40);
    for (const l of lines) expect(displayWidth(l)).toBeLessThanOrEqual(40);
    expect(lines[1]).toContain("…");
  });

  test("cjk cells measured by display width", () => {
    const md = `| h |\n|---|\n| 日本語 |`;
    const lines = plains(md);
    const widths = new Set(lines.map((l) => displayWidth(l)));
    expect(widths.size).toBe(1);
  });

  test("table does not exceed a very narrow render width", () => {
    const lines = plains("| h |\n|---|\n| x |", 1);
    for (const line of lines) {
      expect(displayWidth(line)).toBeLessThanOrEqual(1);
    }
  });
});

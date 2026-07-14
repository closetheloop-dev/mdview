import { describe, expect, test } from "bun:test";
import { wrapSpans } from "../src/render/wrap";
import type { Span } from "../src/style";

const plain = (lines: Span[][]) => lines.map((l) => l.map((s) => s.text).join(""));

describe("wrapSpans", () => {
  test("no wrap when it fits", () => {
    expect(plain(wrapSpans([{ text: "hello world", style: {} }], 20))).toEqual(["hello world"]);
  });

  test("greedy wrap at word boundary, break spaces dropped", () => {
    expect(plain(wrapSpans([{ text: "aaa bbb ccc", style: {} }], 7))).toEqual(["aaa bbb", "ccc"]);
  });

  test("style preserved across split", () => {
    const lines = wrapSpans(
      [
        { text: "plain ", style: {} },
        { text: "boldword another", style: { bold: true } },
      ],
      12,
    );
    expect(plain(lines)).toEqual(["plain", "boldword", "another"]);
    expect(lines[1]![0]!.style.bold).toBe(true);
    expect(lines[2]![0]!.style.bold).toBe(true);
  });

  test("hard-breaks an unbreakable long word", () => {
    const url = "x".repeat(50);
    const lines = plain(wrapSpans([{ text: `see ${url}`, style: {} }], 20));
    expect(lines[0]).toBe("see");
    expect(lines.slice(1).join("")).toBe(url);
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(20);
  });

  test("newline forces a break", () => {
    expect(plain(wrapSpans([{ text: "a\nb", style: {} }], 20))).toEqual(["a", "b"]);
  });

  test("empty input yields one empty line", () => {
    expect(plain(wrapSpans([], 10))).toEqual([""]);
  });

  test("punctuation glued to a styled span never dangles at a wrap point", () => {
    // Renders like: aa bb cc (`dd ee`).
    const spans: Span[] = [
      { text: "aa bb cc (", style: {} },
      { text: "dd ee", style: { fg: 1 } },
      { text: ").", style: {} },
    ];
    expect(plain(wrapSpans(spans, 16))).toEqual(["aa bb cc (dd", "ee)."]);
    expect(plain(wrapSpans(spans, 10))).toEqual(["aa bb cc", "(dd ee)."]);
  });

  test("glued word keeps each fragment's style", () => {
    const spans: Span[] = [
      { text: "aa bb cc (", style: {} },
      { text: "dd ee", style: { fg: 1 } },
      { text: ").", style: {} },
    ];
    const line = wrapSpans(spans, 10)[1]!; // "(dd ee)."
    expect(line.map((s) => s.text)).toEqual(["(", "dd ee", ")."]);
    expect(line[0]!.style.fg).toBeUndefined();
    expect(line[1]!.style.fg).toBe(1);
    expect(line[2]!.style.fg).toBeUndefined();
  });

  test("hard-break of a glued over-long word preserves styles", () => {
    const lines = wrapSpans(
      [
        { text: "abc", style: { bold: true } },
        { text: "defg", style: {} },
      ],
      4,
    );
    expect(plain(lines)).toEqual(["abcd", "efg"]);
    expect(lines[0]!.map((s) => [s.text, s.style.bold ?? false])).toEqual([
      ["abc", true],
      ["d", false],
    ]);
    expect(lines[1]![0]!.style.bold).toBeUndefined();
  });

  test("wraps on display width for CJK", () => {
    // each char is 2 cols; width 4 fits two chars
    const lines = plain(wrapSpans([{ text: "日本語文字", style: {} }], 4));
    expect(lines).toEqual(["日本", "語文", "字"]);
  });
});

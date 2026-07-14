import { describe, expect, test } from "bun:test";
import { displayWidth, graphemes, truncateToWidth } from "../src/width";

describe("displayWidth", () => {
  test("ascii", () => expect(displayWidth("hello")).toBe(5));
  test("empty", () => expect(displayWidth("")).toBe(0));
  test("accented", () => expect(displayWidth("héllo")).toBe(5));
  test("cjk is double width", () => expect(displayWidth("日本語")).toBe(6));
  test("family emoji is one cell pair", () => expect(displayWidth("👨‍👩‍👧")).toBe(2));
});

describe("graphemes", () => {
  test("splits family emoji as one unit", () => {
    expect(graphemes("a👨‍👩‍👧b")).toEqual(["a", "👨‍👩‍👧", "b"]);
  });
  test("combining accent stays attached", () => {
    expect(graphemes("éx")).toEqual(["é", "x"]);
  });
});

describe("truncateToWidth", () => {
  test("no-op when it fits", () => expect(truncateToWidth("abc", 5)).toBe("abc"));
  test("cuts at width", () => expect(truncateToWidth("abcdef", 3)).toBe("abc"));
  test("ellipsis counted in budget", () => expect(truncateToWidth("abcdef", 4, "…")).toBe("abc…"));
  test("never splits a wide char", () => {
    // 日=2 cols; width 3 fits only one full char
    expect(truncateToWidth("日本語", 3)).toBe("日");
  });

  test("never returns an ellipsis wider than the budget", () => {
    const truncated = truncateToWidth("abcdef", 1, "...");
    expect(displayWidth(truncated)).toBeLessThanOrEqual(1);
  });
});

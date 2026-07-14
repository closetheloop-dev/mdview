import { describe, expect, test } from "bun:test";
import { paintSpans } from "../src/style";

describe("paintSpans", () => {
  test("does not pass terminal control sequences through from span text", () => {
    const painted = paintSpans([{ text: "safe\x1b]0;spoofed\x07text", style: {} }]);
    expect(painted).not.toContain("\x1b]0;spoofed\x07");
  });

  test("does not pass terminal tabs through from span text", () => {
    const painted = paintSpans([{ text: "a\tb", style: {} }]);
    expect(painted).not.toContain("\t");
  });

  test("does not pass C1 terminal controls through from span text", () => {
    const painted = paintSpans([{ text: "safe\u009b2Jmiddle\u0085text", style: {} }]);

    expect(painted).not.toContain("\u009b");
    expect(painted).not.toContain("\u0085");
  });
});

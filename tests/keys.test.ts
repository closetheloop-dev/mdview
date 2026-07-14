import { describe, expect, test } from "bun:test";
import { decodeKeys, KeyDecoder } from "../src/pager/keys";

describe("decodeKeys", () => {
  test("printable chars", () => {
    expect(decodeKeys("jq/")).toEqual([
      { name: "char", ch: "j" },
      { name: "char", ch: "q" },
      { name: "char", ch: "/" },
    ]);
  });

  test("arrow keys", () => {
    expect(decodeKeys("\x1b[A\x1b[B")).toEqual([{ name: "up" }, { name: "down" }]);
  });

  // Split sequences require state across reads, so these use a KeyDecoder
  // instance (the pager's usage); one-shot decodeKeys flushes at the end,
  // which is why a lone "\x1b" decodes as Escape in the test below.
  test("arrow key split across input chunks is decoded once complete", () => {
    const decoder = new KeyDecoder();
    const keys = [decoder.decode("\x1b"), decoder.decode("[A")].flat();
    expect(keys).toEqual([{ name: "up" }]);
  });

  test("UTF-8 character split across input chunks is decoded once complete", () => {
    const decoder = new KeyDecoder();
    const encoded = Buffer.from("é");
    const keys = [
      decoder.decode(encoded.subarray(0, 1)),
      decoder.decode(encoded.subarray(1)),
    ].flat();

    expect(keys).toEqual([{ name: "char", ch: "é" }]);
  });

  test("supplementary Unicode character is emitted as one key", () => {
    const decoder = new KeyDecoder();
    expect(decoder.decode(Buffer.from("😀"))).toEqual([{ name: "char", ch: "😀" }]);
  });

  test("CSI split mid-sequence is decoded once complete", () => {
    const decoder = new KeyDecoder();
    const keys = [decoder.decode("\x1b["), decoder.decode("5~q")].flat();
    expect(keys).toEqual([{ name: "pageup" }, { name: "char", ch: "q" }]);
  });

  test("buffered lone escape flushes as an Escape key", () => {
    const decoder = new KeyDecoder();
    expect(decoder.decode("\x1b")).toEqual([]);
    expect(decoder.hasPending).toBe(true);
    expect(decoder.flush()).toEqual([{ name: "escape" }]);
    expect(decoder.hasPending).toBe(false);
  });

  test("page and home/end sequences", () => {
    expect(decodeKeys("\x1b[5~\x1b[6~\x1b[H\x1b[F")).toEqual([
      { name: "pageup" },
      { name: "pagedown" },
      { name: "home" },
      { name: "end" },
    ]);
  });

  test("application-mode cursor keys (SS3)", () => {
    expect(decodeKeys("\x1bOA")).toEqual([{ name: "up" }]);
  });

  test("bare escape", () => {
    expect(decodeKeys("\x1b")).toEqual([{ name: "escape" }]);
  });

  test("control keys", () => {
    expect(decodeKeys("\r\x7f\x03\x15")).toEqual([
      { name: "enter" },
      { name: "backspace" },
      { name: "ctrl-c" },
      { name: "ctrl-u" },
    ]);
  });

  test("mixed buffer: escape sequence followed by chars", () => {
    expect(decodeKeys("\x1b[Bnq")).toEqual([
      { name: "down" },
      { name: "char", ch: "n" },
      { name: "char", ch: "q" },
    ]);
  });

  test("unknown CSI sequence is skipped, following keys survive", () => {
    // \x1b[1;5C is ctrl-right — unmapped, must not corrupt the stream
    expect(decodeKeys("\x1b[1;5Cq")).toEqual([{ name: "char", ch: "q" }]);
  });
});

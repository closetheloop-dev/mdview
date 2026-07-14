import { describe, expect, test } from "bun:test";
import { marked } from "marked";
import { Pager } from "../src/pager/pager";
import {
  applyHighlights,
  findMatches,
  type Match,
  pickInitialMatch,
  SearchHistory,
} from "../src/pager/search";
import { type Line, mkLine } from "../src/render/types";

const line = (text: string): Line => mkLine([{ text, style: {} }]);

describe("findMatches", () => {
  test("multiple matches on one line", () => {
    const m = findMatches([line("foo bar foo")], "foo");
    expect(m).toEqual([
      { line: 0, start: 0, end: 3 },
      { line: 0, start: 8, end: 11 },
    ]);
  });

  test("case-insensitive for lowercase query", () => {
    expect(findMatches([line("Hello HELLO hello")], "hello")).toHaveLength(3);
  });

  test("smartcase: uppercase in query makes it case-sensitive", () => {
    expect(findMatches([line("Hello hello")], "Hello")).toHaveLength(1);
  });

  test("smartcase: non-ASCII uppercase also triggers case sensitivity", () => {
    expect(findMatches([line("Éclair éclair")], "Éclair")).toHaveLength(1);
    expect(findMatches([line("Москва москва")], "Москва")).toHaveLength(1);
  });

  test("smartcase: Unicode titlecase query is case-sensitive", () => {
    expect(findMatches([line("ǅ ǆ")], "ǅ")).toEqual([{ line: 0, start: 0, end: 1 }]);
  });

  test("smartcase: accented lowercase query stays case-insensitive", () => {
    expect(findMatches([line("Café CAFÉ café")], "café")).toHaveLength(3);
  });

  test("case folding that expands text preserves original-string offsets", () => {
    expect(findMatches([line("İx")], "x")).toEqual([{ line: 0, start: 1, end: 2 }]);
  });

  test("case-insensitive search handles expanding Unicode case folds", () => {
    expect(findMatches([line("İstanbul")], "i")).toEqual([{ line: 0, start: 0, end: 1 }]);
  });

  test("case-insensitive search handles contextual Greek sigma folding", () => {
    expect(findMatches([line("ΟΣ")], "ος")).toEqual([{ line: 0, start: 0, end: 2 }]);
  });

  test("case-insensitive search handles full Unicode expansion folds", () => {
    expect(findMatches([line("Straße oﬃce")], "strasse office")).toEqual([
      { line: 0, start: 0, end: 11 },
    ]);
  });

  test("case-insensitive search does not apply non-case compatibility mappings", () => {
    expect(findMatches([line("x\u00a0y")], " ")).toEqual([]);
    expect(findMatches([line("²")], "2")).toEqual([]);
  });

  test("case-insensitive search handles decomposing full case folds", () => {
    expect(findMatches([line("ǰ")], "j\u030c")).toEqual([{ line: 0, start: 0, end: 1 }]);
  });

  test("case-insensitive search handles common folds that lowercase omits", () => {
    expect(findMatches([line("ſ ϐ ϑ")], "s β θ")).toEqual([{ line: 0, start: 0, end: 5 }]);
  });

  test("fold expansions produce one logical match per original range", () => {
    expect(findMatches([line("ß")], "s")).toHaveLength(1);
    expect(findMatches([line("ﬃ")], "f")).toHaveLength(1);
  });

  test("across lines, ordered", () => {
    const m = findMatches([line("a x"), line("no"), line("x a")], "a");
    expect(m.map((x) => x.line)).toEqual([0, 2]);
  });

  test("empty query matches nothing", () => {
    expect(findMatches([line("abc")], "")).toEqual([]);
  });
});

describe("pickInitialMatch", () => {
  const at = (...lines: number[]): Match[] => lines.map((line) => ({ line, start: 0, end: 1 }));

  test("forward picks first match at/below the top line", () => {
    expect(pickInitialMatch(at(2, 5, 9), 4, 1)).toBe(1);
    expect(pickInitialMatch(at(2, 5, 9), 5, 1)).toBe(1); // exactly on top line
  });

  test("forward wraps to the first match when all are above", () => {
    expect(pickInitialMatch(at(2, 5, 9), 10, 1)).toBe(0);
  });

  test("backward picks last match at/above the top line", () => {
    expect(pickInitialMatch(at(2, 5, 9), 7, -1)).toBe(1);
    expect(pickInitialMatch(at(2, 5, 9), 5, -1)).toBe(1); // exactly on top line
  });

  test("backward wraps to the last match when all are below", () => {
    expect(pickInitialMatch(at(2, 5, 9), 1, -1)).toBe(2);
  });
});

describe("SearchHistory", () => {
  test("up recalls newest first, then older, and sticks at oldest", () => {
    const h = new SearchHistory();
    h.push("first");
    h.push("second");
    expect(h.back("")).toBe("second");
    expect(h.back("")).toBe("first");
    expect(h.back("")).toBe("first"); // oldest: stays
  });

  test("down returns toward newest and then restores the draft", () => {
    const h = new SearchHistory();
    h.push("first");
    h.push("second");
    expect(h.back("draft")).toBe("second");
    expect(h.back("draft")).toBe("first");
    expect(h.forward()).toBe("second");
    expect(h.forward()).toBe("draft"); // past newest: draft restored
    expect(h.forward()).toBeNull(); // not browsing anymore
  });

  test("down without browsing is a no-op", () => {
    const h = new SearchHistory();
    h.push("x");
    expect(h.forward()).toBeNull();
  });

  test("up with empty history is a no-op", () => {
    expect(new SearchHistory().back("typed")).toBeNull();
  });

  test("typing exits browsing; draft of next browse is the edited text", () => {
    const h = new SearchHistory();
    h.push("first");
    expect(h.back("")).toBe("first");
    h.touch(); // user edits the recalled entry
    expect(h.forward()).toBeNull();
    expect(h.back("first-edited")).toBe("first");
    expect(h.forward()).toBe("first-edited");
  });

  test("consecutive duplicates and empty queries are not recorded", () => {
    const h = new SearchHistory();
    h.push("same");
    h.push("same");
    h.push("");
    expect(h.back("")).toBe("same");
    expect(h.back("")).toBe("same"); // only one entry
  });
});

describe("applyHighlights", () => {
  test("splits a single span, only the match inverted", () => {
    const spans = applyHighlights(line("say hello now"), [{ start: 4, end: 9, current: true }]);
    expect(spans.map((s) => s.text)).toEqual(["say ", "hello", " now"]);
    expect(spans[0]!.style.inverse).toBeUndefined();
    expect(spans[1]!.style.inverse).toBe(true);
    expect(spans[1]!.style.bold).toBe(true);
    expect(spans[2]!.style.inverse).toBeUndefined();
  });

  test("match spanning two spans highlights both parts", () => {
    const l: Line = mkLine([
      { text: "abcd", style: { bold: true } },
      { text: "efgh", style: {} },
    ]);
    const spans = applyHighlights(l, [{ start: 2, end: 6, current: false }]);
    expect(spans.map((s) => s.text)).toEqual(["ab", "cd", "ef", "gh"]);
    expect(spans[1]!.style.inverse).toBe(true);
    expect(spans[1]!.style.bold).toBe(true); // original style kept
    expect(spans[2]!.style.inverse).toBe(true);
    expect(spans[3]!.style.inverse).toBeUndefined();
  });

  test("non-current match is dim, current is bold", () => {
    const spans = applyHighlights(line("aXbXc"), [
      { start: 1, end: 2, current: false },
      { start: 3, end: 4, current: true },
    ]);
    const hits = spans.filter((s) => s.style.inverse);
    expect(hits[0]!.style.dim).toBe(true);
    expect(hits[1]!.style.bold).toBe(true);
  });

  test("no ranges returns original spans", () => {
    const l = line("abc");
    expect(applyHighlights(l, [])).toBe(l.spans);
  });
});

describe("Pager search state", () => {
  test("autoreload restores a valid current match after matches reappear", () => {
    const pager = new Pager(marked.lexer("match"), "test.md") as unknown as {
      setDocument(tokens: ReturnType<typeof marked.lexer>): void;
      render(): void;
      paint(): void;
      query: string | null;
      matches: Match[];
      current: number;
    };
    pager.paint = () => {};
    pager.render();
    pager.query = "match";
    pager.matches = [{ line: 0, start: 0, end: 5 }];
    pager.current = 0;

    pager.setDocument(marked.lexer("absent"));
    pager.setDocument(marked.lexer("match"));

    expect(pager.current).toBe(0);
  });
});

describe("Pager status bar", () => {
  test("does not pass terminal control sequences through from the filename", () => {
    const pager = new Pager([], "safe\x1b]0;spoofed\x07.md") as unknown as {
      cols: number;
      statusBar(): string;
    };
    pager.cols = 120;

    const status = pager.statusBar();

    expect(status).not.toContain("\x1b]0;spoofed\x07");
  });

  test("does not pass newlines through from the filename", () => {
    const pager = new Pager([], "first line\nspoofed line.md") as unknown as {
      cols: number;
      statusBar(): string;
    };
    pager.cols = 120;

    const status = pager.statusBar();

    expect(status).not.toContain("\n");
  });
});

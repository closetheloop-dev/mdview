import { describe, expect, test } from "bun:test";
import { marked } from "marked";
import { renderBlocks } from "../src/render/render";
import { displayWidth } from "../src/width";

const render = (md: string, width = 80) => renderBlocks(marked.lexer(md), width);
const plains = (md: string, width = 80) => render(md, width).map((l) => l.plain);

const fixture = await Bun.file(new URL("./fixtures/kitchen-sink.md", import.meta.url)).text();

describe("renderBlocks invariants (kitchen sink)", () => {
  for (const width of [80, 40, 20]) {
    test(`no line exceeds width ${width}`, () => {
      for (const line of render(fixture, width)) {
        expect(displayWidth(line.plain)).toBeLessThanOrEqual(width);
      }
    });
  }

  test("plain equals span concatenation", () => {
    for (const line of render(fixture)) {
      expect(line.plain).toBe(line.spans.map((s) => s.text).join(""));
    }
  });
});

describe("blocks", () => {
  test("heading is styled and separated by blank lines", () => {
    const lines = render("para\n\n# Title\n\npara2");
    const idx = lines.findIndex((l) => l.plain === "Title");
    expect(idx).toBeGreaterThan(0);
    expect(lines[idx]!.spans[0]!.style.bold).toBe(true);
    expect(lines[idx - 1]!.plain).toBe("");
    expect(lines[idx + 1]!.plain).toBe("");
  });

  test("h3 gets a ### prefix", () => {
    expect(plains("### Sub")[0]).toBe("### Sub");
  });

  test("nested list indentation", () => {
    const lines = plains("- one\n  - two\n    - three");
    expect(lines).toEqual(["• one", "  • two", "    • three"]);
  });

  test("ordered list numbering respects start", () => {
    expect(plains("3. a\n4. b")).toEqual(["3. a", "4. b"]);
  });

  test("task list checkboxes", () => {
    expect(plains("- [x] done\n- [ ] todo")).toEqual(["• [x] done", "• [ ] todo"]);
  });

  test("list item wrapping indents continuation lines", () => {
    const lines = plains(`- ${"word ".repeat(10).trim()}`, 30);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]!.startsWith("• ")).toBe(true);
    for (const cont of lines.slice(1)) expect(cont.startsWith("  ")).toBe(true);
  });

  test("blockquote bar on every line including wraps", () => {
    const lines = plains(`> ${"word ".repeat(15).trim()}`, 30);
    expect(lines.length).toBeGreaterThan(1);
    for (const l of lines) expect(l.startsWith("│ ")).toBe(true);
  });

  test("code block preserved verbatim and indented", () => {
    const lines = plains("```\nconst x = 1;\n  indented\n```");
    expect(lines).toEqual(["  const x = 1;", "    indented"]);
  });

  test("long code lines truncated, not wrapped", () => {
    const code = "x".repeat(100);
    const lines = plains(`\`\`\`\n${code}\n\`\`\``, 40);
    expect(lines.length).toBe(1);
    expect(lines[0]!.endsWith("…")).toBe(true);
    expect(displayWidth(lines[0]!)).toBeLessThanOrEqual(40);
  });

  test("hr spans the width", () => {
    expect(plains("---", 30)[0]).toBe("─".repeat(30));
  });

  test("hard break splits a paragraph line", () => {
    expect(plains("line A  \nline B")).toEqual(["line A", "line B"]);
  });

  test("soft break becomes a space", () => {
    expect(plains("line A\nline B")).toEqual(["line A line B"]);
  });

  test("link shows url next to text", () => {
    expect(plains("[text](https://x.dev)")[0]).toBe("text (https://x.dev)");
  });

  test("autolink does not repeat url", () => {
    expect(plains("<https://x.dev>")[0]).toBe("https://x.dev");
  });

  test("empty document renders no lines", () => {
    expect(render("")).toEqual([]);
  });

  test("structural prefixes do not exceed very narrow render widths", () => {
    for (const md of ["> x", "- x", "```\nx\n```"]) {
      const lines = renderBlocks(marked.lexer(md), 1);
      for (const line of lines) {
        expect(displayWidth(line.plain)).toBeLessThanOrEqual(1);
      }
    }
  });
});

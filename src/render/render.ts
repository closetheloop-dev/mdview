import type { Token, Tokens } from "marked";
import { type Span, type Style, sanitizeText, theme } from "../style";
import { displayWidth, truncateToWidth } from "../width";
import { renderInline } from "./inline";
import { renderTable } from "./table";
import { BLANK_LINE, type Line, mkLine } from "./types";
import { truncateSpansToWidth, wrapSpans } from "./wrap";

/** Render a marked block-token stream to display lines wrapped at `width`. */
export function renderBlocks(tokens: Token[], width: number): Line[] {
  const w = Math.max(1, width);
  // Hard guarantee that no line exceeds the requested width, even at widths
  // narrower than structural prefixes (quote bars, bullets, table minimums).
  return renderBlockSeq(tokens, w, "blank").map((line) =>
    displayWidth(line.plain) > w ? mkLine(truncateSpansToWidth(line.spans, w)) : line,
  );
}

/** Render a sequence of blocks, joined by a blank line or nothing (tight lists). */
function renderBlockSeq(tokens: Token[], width: number, join: "blank" | "none"): Line[] {
  const out: Line[] = [];
  for (const token of tokens) {
    if (token.type === "space") continue;
    const lines = renderBlock(token, width);
    if (lines.length === 0) continue;
    if (out.length > 0 && join === "blank") out.push(BLANK_LINE);
    out.push(...lines);
  }
  return out;
}

function renderBlock(token: Token, width: number): Line[] {
  switch (token.type) {
    case "heading":
      return renderHeading(token as Tokens.Heading, width);
    case "paragraph":
      return wrapToLines(renderInline((token as Tokens.Paragraph).tokens), width);
    case "text": {
      const t = token as Tokens.Text;
      return wrapToLines(renderInline(t.tokens ?? [t]), width);
    }
    case "code":
      return renderCode(token as Tokens.Code, width);
    case "blockquote":
      return renderBlockquote(token as Tokens.Blockquote, width);
    case "list":
      return renderList(token as Tokens.List, width);
    case "table":
      return renderTable(token as Tokens.Table, width);
    case "hr":
      return [mkLine([{ text: "─".repeat(width), style: { fg: theme.border } }])];
    case "html":
      return (token as Tokens.HTML).text
        .replace(/\n+$/, "")
        .split("\n")
        .map((line) =>
          mkLine([{ text: truncateToWidth(sanitizeText(line), width, "…"), style: { dim: true } }]),
        );
    case "def":
      return [];
    default:
      if ("tokens" in token && token.tokens?.length) {
        return wrapToLines(renderInline(token.tokens), width);
      }
      if ("text" in token && typeof token.text === "string") {
        return wrapToLines([{ text: token.text, style: {} }], width);
      }
      return [];
  }
}

function wrapToLines(spans: Span[], width: number): Line[] {
  return wrapSpans(spans, width).map(mkLine);
}

function renderHeading(token: Tokens.Heading, width: number): Line[] {
  const styles: Record<number, Style> = {
    1: { bold: true, underline: true, fg: theme.heading },
    2: { bold: true, fg: theme.heading },
  };
  const style = styles[token.depth] ?? { bold: true };
  const prefix = token.depth >= 3 ? `${"#".repeat(token.depth)} ` : "";
  const spans = renderInline(token.tokens, style);
  if (prefix) spans.unshift({ text: prefix, style: { ...style, dim: true } });
  return wrapToLines(spans, width);
}

function renderCode(token: Tokens.Code, width: number): Line[] {
  const indent = "  ";
  return token.text.split("\n").map((raw) =>
    mkLine([
      { text: indent, style: {} },
      {
        text: truncateToWidth(sanitizeText(raw), Math.max(1, width - indent.length), "…"),
        style: { fg: theme.codeBlock },
      },
    ]),
  );
}

function renderBlockquote(token: Tokens.Blockquote, width: number): Line[] {
  const bar: Span = { text: "│ ", style: { fg: theme.border } };
  const inner = renderBlockSeq(token.tokens, Math.max(1, width - 2), "blank");
  return inner.map((line) => mkLine([bar, ...line.spans]));
}

function renderList(token: Tokens.List, width: number): Line[] {
  const out: Line[] = [];
  const start = token.ordered ? (token.start === "" ? 1 : Number(token.start)) : 0;
  token.items.forEach((item, i) => {
    let bullet = token.ordered ? `${start + i}. ` : "• ";
    if (item.task) bullet += item.checked ? "[x] " : "[ ] ";
    const bulletWidth = displayWidth(bullet);
    const pad = " ".repeat(bulletWidth);
    const contentTokens = item.tokens.filter((t) => t.type !== "checkbox");
    const inner = renderBlockSeq(
      contentTokens,
      Math.max(1, width - bulletWidth),
      item.loose ? "blank" : "none",
    );
    if (out.length > 0 && token.loose) out.push(BLANK_LINE);
    if (inner.length === 0) inner.push(BLANK_LINE);
    inner.forEach((line, j) => {
      if (j > 0 && line.plain === "") {
        out.push(BLANK_LINE);
        return;
      }
      const prefix: Span =
        j === 0 ? { text: bullet, style: { bold: true } } : { text: pad, style: {} };
      out.push(mkLine([prefix, ...line.spans]));
    });
  });
  return out;
}

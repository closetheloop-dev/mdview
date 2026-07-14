import type { Tokens } from "marked";
import { type Span, theme } from "../style";
import { displayWidth, graphemes } from "../width";
import { renderInline } from "./inline";
import { type Line, mkLine } from "./types";

const borderStyle = { fg: theme.border } as const;

type Align = "left" | "center" | "right" | null;

interface Cell {
  spans: Span[];
  width: number;
}

const MIN_COL = 3;

export function renderTable(token: Tokens.Table, width: number): Line[] {
  const headerRow = token.header.map(toCell);
  const bodyRows = token.rows.map((row) => row.map(toCell));
  const aligns: Align[] = token.align;
  const ncols = headerRow.length;

  const colWidths = headerRow.map((cell, i) =>
    Math.max(MIN_COL, cell.width, ...bodyRows.map((row) => row[i]?.width ?? 0)),
  );

  // Total rendered width: "│ cell │ cell │" = 1 border + per-column (2 padding + 1 border).
  const total = () => colWidths.reduce((n, w) => n + w, 0) + 3 * ncols + 1;
  while (total() > width) {
    const widest = colWidths.indexOf(Math.max(...colWidths));
    if (colWidths[widest]! <= MIN_COL) break; // narrower than we can go; overflow
    colWidths[widest]!--;
  }

  const lines: Line[] = [];
  lines.push(borderLine(colWidths, "┌", "┬", "┐"));
  lines.push(contentLine(headerRow, colWidths, aligns, true));
  lines.push(borderLine(colWidths, "├", "┼", "┤"));
  for (const row of bodyRows) lines.push(contentLine(row, colWidths, aligns, false));
  lines.push(borderLine(colWidths, "└", "┴", "┘"));
  return lines;
}

function toCell(cell: Tokens.TableCell): Cell {
  // Tables are single-line; collapse any hard breaks to spaces.
  const spans = renderInline(cell.tokens).map((s) => ({
    ...s,
    text: s.text.replace(/\n/g, " "),
  }));
  return { spans, width: displayWidth(spans.map((s) => s.text).join("")) };
}

function borderLine(colWidths: number[], left: string, mid: string, right: string): Line {
  const text = left + colWidths.map((w) => "─".repeat(w + 2)).join(mid) + right;
  return mkLine([{ text, style: borderStyle }]);
}

function contentLine(row: Cell[], colWidths: number[], aligns: Align[], header: boolean): Line {
  const spans: Span[] = [{ text: "│", style: borderStyle }];
  for (let i = 0; i < colWidths.length; i++) {
    const colWidth = colWidths[i]!;
    let cell = row[i] ?? { spans: [], width: 0 };
    if (cell.width > colWidth) cell = truncateCell(cell, colWidth);
    const cellSpans = header
      ? cell.spans.map((s) => ({ ...s, style: { ...s.style, bold: true } }))
      : cell.spans;
    const pad = colWidth - cell.width;
    const [padLeft, padRight] =
      aligns[i] === "right"
        ? [pad, 0]
        : aligns[i] === "center"
          ? [Math.floor(pad / 2), Math.ceil(pad / 2)]
          : [0, pad];
    spans.push({ text: " ".repeat(padLeft + 1), style: {} });
    spans.push(...cellSpans);
    spans.push({ text: " ".repeat(padRight + 1), style: {} });
    spans.push({ text: "│", style: borderStyle });
  }
  return mkLine(spans);
}

function truncateCell(cell: Cell, maxWidth: number): Cell {
  const budget = Math.max(0, maxWidth - 1); // reserve one column for "…"
  const spans: Span[] = [];
  let used = 0;
  outer: for (const span of cell.spans) {
    let text = "";
    for (const g of graphemes(span.text)) {
      const w = displayWidth(g);
      if (used + w > budget) {
        if (text) spans.push({ text, style: span.style });
        break outer;
      }
      text += g;
      used += w;
    }
    if (text) spans.push({ text, style: span.style });
  }
  spans.push({ text: "…", style: { dim: true } });
  return { spans, width: used + 1 };
}

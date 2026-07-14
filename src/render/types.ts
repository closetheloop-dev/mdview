import type { Span } from "../style";

export interface Line {
  spans: Span[];
  /** Concatenation of span texts; used for search and no-color output. */
  plain: string;
}

export interface RenderedDoc {
  lines: Line[];
  /** Terminal width this document was rendered for. */
  width: number;
}

export function mkLine(spans: Span[]): Line {
  return { spans, plain: spans.map((s) => s.text).join("") };
}

export const BLANK_LINE: Line = { spans: [], plain: "" };

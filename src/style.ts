export interface Style {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  dim?: boolean;
  strike?: boolean;
  inverse?: boolean;
  /** 256-color foreground index; undefined = terminal default */
  fg?: number;
}

export interface Span {
  text: string;
  style: Style;
}

export const RESET = "\x1b[0m";

// C0 controls, DEL, and C1 controls (U+0080-U+009F: single-byte CSI, NEL, ...).
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping terminal control bytes is the point
const CONTROL_CHARS = /[\x00-\x08\x0b-\x1f\x7f-\x9f]/g;

/**
 * Strip terminal control bytes (ESC, BEL, ...) so document content and
 * filenames can never inject escape sequences into the terminal; tabs
 * become single spaces so column math stays consistent. "\n" is kept —
 * the wrapper uses it as its hard-break marker.
 */
export function sanitizeText(text: string): string {
  return text.replace(/\t/g, " ").replace(CONTROL_CHARS, "");
}

/** 256-color indexes used across the renderer. */
export const theme = {
  heading: 81, // light blue
  inlineCode: 203, // salmon
  codeBlock: 250, // light gray
  link: 75, // blue
  linkUrl: 244, // gray, shown dim next to link text
  border: 244, // table borders, hr, blockquote bar
} as const;

export function sgr(style: Style): string {
  const codes: number[] = [];
  if (style.bold) codes.push(1);
  if (style.dim) codes.push(2);
  if (style.italic) codes.push(3);
  if (style.underline) codes.push(4);
  if (style.inverse) codes.push(7);
  if (style.strike) codes.push(9);
  if (style.fg !== undefined) codes.push(38, 5, style.fg);
  return codes.length ? `\x1b[${codes.join(";")}m` : "";
}

/** Serialize spans to an ANSI string, resetting styles at the end. */
export function paintSpans(spans: Span[]): string {
  let out = "";
  let styled = false;
  for (const span of spans) {
    const esc = sgr(span.style);
    if (esc) {
      if (styled) out += RESET;
      out += esc;
      styled = true;
    } else if (styled) {
      out += RESET;
      styled = false;
    }
    out += sanitizeText(span.text); // defense in depth; content is also sanitized at ingestion
  }
  if (styled) out += RESET;
  return out;
}

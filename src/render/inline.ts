import type { Token } from "marked";
import { type Span, type Style, sanitizeText, theme } from "../style";

/**
 * Render marked inline tokens to styled spans.
 *
 * Soft line breaks (newlines inside text tokens) become spaces; hard breaks
 * (`br` tokens) become "\n" characters, which the wrapper turns into real
 * line breaks.
 */
export function renderInline(tokens: Token[], base: Style = {}): Span[] {
  const spans: Span[] = [];
  for (const token of tokens) {
    switch (token.type) {
      case "strong":
        spans.push(...renderInline(token.tokens ?? [], { ...base, bold: true }));
        break;
      case "em":
        spans.push(...renderInline(token.tokens ?? [], { ...base, italic: true }));
        break;
      case "del":
        spans.push(...renderInline(token.tokens ?? [], { ...base, strike: true }));
        break;
      case "codespan":
        spans.push({ text: sanitizeText(token.text), style: { ...base, fg: theme.inlineCode } });
        break;
      case "link": {
        spans.push(
          ...renderInline(token.tokens ?? [], { ...base, underline: true, fg: theme.link }),
        );
        if (token.href && token.href !== token.text && token.href !== `mailto:${token.text}`) {
          spans.push({
            text: sanitizeText(` (${token.href})`),
            style: { ...base, fg: theme.linkUrl },
          });
        }
        break;
      }
      case "image":
        spans.push({
          text: sanitizeText(`[image: ${token.text || token.href}]`),
          style: { ...base, dim: true, italic: true },
        });
        break;
      case "br":
        spans.push({ text: "\n", style: base });
        break;
      case "escape":
        spans.push({ text: sanitizeText(token.text), style: base });
        break;
      case "html":
        spans.push({ text: sanitizeText(token.text), style: { ...base, dim: true } });
        break;
      case "text":
        if ("tokens" in token && token.tokens?.length) {
          spans.push(...renderInline(token.tokens, base));
        } else {
          spans.push({ text: sanitizeText(token.text.replace(/\n/g, " ")), style: base });
        }
        break;
      default:
        if ("text" in token && typeof token.text === "string") {
          spans.push({ text: sanitizeText(token.text.replace(/\n/g, " ")), style: base });
        }
        break;
    }
  }
  return spans;
}

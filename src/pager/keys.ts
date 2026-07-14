export interface Key {
  name:
    | "up"
    | "down"
    | "left"
    | "right"
    | "pageup"
    | "pagedown"
    | "home"
    | "end"
    | "enter"
    | "backspace"
    | "escape"
    | "ctrl-c"
    | "ctrl-u"
    | "char";
  ch?: string;
}

const ESC_SEQUENCES: Record<string, Key["name"]> = {
  "[A": "up",
  "[B": "down",
  "[C": "right",
  "[D": "left",
  "[H": "home",
  "[F": "end",
  "[1~": "home",
  "[4~": "end",
  "[5~": "pageup",
  "[6~": "pagedown",
  "[7~": "home",
  "[8~": "end",
  OA: "up",
  OB: "down",
  OC: "right",
  OD: "left",
  OH: "home",
  OF: "end",
};

/**
 * Stateful decoder of raw stdin chunks into key events. An escape sequence
 * split across reads (lone "\x1b", "\x1b[", unfinished CSI — common over
 * slow connections) is buffered until the next chunk completes it; the owner
 * should call flush() after a short delay so a genuine lone Escape press
 * still registers (the same timing trick vim/less use). Unrecognized
 * complete sequences are dropped.
 */
export class KeyDecoder {
  private pending = "";
  // stream:true buffers a multi-byte UTF-8 character split across reads
  // instead of emitting replacement characters for each half.
  private readonly utf8 = new TextDecoder("utf-8");

  get hasPending(): boolean {
    return this.pending !== "";
  }

  decode(buf: Buffer | string): Key[] {
    const text = typeof buf === "string" ? buf : this.utf8.decode(buf, { stream: true });
    const s = this.pending + text;
    this.pending = "";
    const keys: Key[] = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i]!;
      if (c === "\x1b") {
        // Try to match a known escape sequence (longest first: 3 then 2 chars).
        const rest = s.slice(i + 1, i + 4);
        const match = Object.keys(ESC_SEQUENCES).find((seq) => rest.startsWith(seq));
        if (match) {
          keys.push({ name: ESC_SEQUENCES[match]! });
          i += 1 + match.length;
        } else if (rest.startsWith("[") || rest.startsWith("O")) {
          // CSI/SS3: skip to the final byte (0x40-0x7e); if the chunk ends
          // first, the sequence may be split across reads — buffer it.
          let j = i + 2;
          while (j < s.length && !/[@-~]/.test(s[j]!)) j++;
          if (j >= s.length) {
            this.pending = s.slice(i);
            break;
          }
          i = j + 1;
        } else if (i + 1 >= s.length) {
          // Lone ESC at the end of the chunk: might be a split sequence.
          this.pending = s.slice(i);
          break;
        } else {
          keys.push({ name: "escape" });
          i += 1;
        }
        continue;
      }
      i += 1;
      if (c === "\r" || c === "\n") keys.push({ name: "enter" });
      else if (c === "\x7f" || c === "\b") keys.push({ name: "backspace" });
      else if (c === "\x03") keys.push({ name: "ctrl-c" });
      else if (c === "\x15") keys.push({ name: "ctrl-u" });
      else if (c >= " ") {
        // Whole code point, so a supplementary character (surrogate pair in
        // UTF-16) is one key, not two half-key fragments.
        const ch = String.fromCodePoint(s.codePointAt(i - 1)!);
        keys.push({ name: "char", ch });
        i += ch.length - 1;
      }
      // other control chars: ignore
    }
    return keys;
  }

  /** Emit whatever is buffered: a lone ESC becomes an Escape key. */
  flush(): Key[] {
    this.utf8.decode(); // reset streaming state; dangling partial bytes are dropped
    const p = this.pending;
    this.pending = "";
    if (!p) return [];
    const keys: Key[] = [{ name: "escape" }];
    for (const ch of p.slice(1)) {
      if (ch >= " ") keys.push({ name: "char", ch });
    }
    return keys;
  }
}

/** One-shot decode of a complete input (decode + flush on a fresh decoder). */
export function decodeKeys(buf: Buffer | string): Key[] {
  const decoder = new KeyDecoder();
  return [...decoder.decode(buf), ...decoder.flush()];
}

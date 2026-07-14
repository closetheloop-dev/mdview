import type { Token } from "marked";
import { renderBlocks } from "../render/render";
import type { Line } from "../render/types";
import { truncateSpansToWidth } from "../render/wrap";
import { paintSpans, sanitizeText } from "../style";
import { displayWidth, graphemes, truncateToWidth } from "../width";
import { type Key, KeyDecoder } from "./keys";
import { enterScreen, leaveScreen, paintFrame } from "./screen";
import {
  applyHighlights,
  findMatches,
  type HighlightRange,
  type Match,
  pickInitialMatch,
  SearchHistory,
} from "./search";

const MIN_RENDER_WIDTH = 20;

export class Pager {
  private lines: Line[] = [];
  private offset = 0;
  private rows = 24;
  private cols = 80;
  private mode: "view" | "search-input" = "view";
  private searchInput = "";
  private query: string | null = null;
  private matches: Match[] = [];
  private current = -1;
  private message: string | null = null;
  private searchDir: 1 | -1 = 1;
  private readonly history = new SearchHistory(); // shared by / and ?, like less/vim
  private readonly decoder = new KeyDecoder();
  private escTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private tokens: Token[],
    private readonly filename: string,
  ) {}

  /** Replace the document (file changed on disk), keeping scroll position. */
  setDocument(tokens: Token[]): void {
    this.tokens = tokens;
    this.render();
    this.refreshMatches();
    this.scrollTo(this.offset); // clamp against the new document length
    this.paint();
  }

  /** Re-run the active search against re-rendered lines, keeping `current` valid. */
  private refreshMatches(): void {
    if (!this.query) return;
    this.matches = findMatches(this.lines, this.query);
    this.current =
      this.matches.length === 0 ? -1 : Math.max(0, Math.min(this.current, this.matches.length - 1));
  }

  run(): void {
    enterScreen();
    this.measure();
    this.render();
    process.stdin.on("data", (chunk: Buffer) => {
      if (this.escTimer) {
        clearTimeout(this.escTimer);
        this.escTimer = null;
      }
      for (const key of this.decoder.decode(chunk)) {
        this.handleKey(key);
        this.paint();
      }
      // A lone ESC (or split sequence) is buffered; if no continuation
      // arrives shortly, treat it as a real Escape press.
      if (this.decoder.hasPending) {
        this.escTimer = setTimeout(() => {
          this.escTimer = null;
          for (const key of this.decoder.flush()) {
            this.handleKey(key);
            this.paint();
          }
        }, 50);
      }
    });
    process.stdout.on("resize", () => {
      this.onResize();
      this.paint();
    });
    this.paint();
  }

  private measure(): void {
    this.rows = process.stdout.rows || 24;
    this.cols = process.stdout.columns || 80;
  }

  private render(): void {
    this.lines = renderBlocks(this.tokens, Math.max(MIN_RENDER_WIDTH, this.cols));
  }

  private get viewRows(): number {
    return Math.max(1, this.rows - 1);
  }

  private get maxOffset(): number {
    return Math.max(0, this.lines.length - this.viewRows);
  }

  private scrollTo(offset: number): void {
    this.offset = Math.min(this.maxOffset, Math.max(0, offset));
  }

  private onResize(): void {
    const oldLen = this.lines.length || 1;
    const oldOffset = this.offset;
    this.measure();
    this.render();
    this.refreshMatches();
    this.scrollTo(Math.round((oldOffset / oldLen) * this.lines.length));
  }

  private handleKey(key: Key): void {
    this.message = null;
    if (this.mode === "search-input") {
      this.handleSearchInputKey(key);
      return;
    }
    const page = this.viewRows;
    const half = Math.max(1, Math.floor(page / 2));
    if (key.name === "char") {
      switch (key.ch) {
        case "q":
          this.quit();
          return;
        case "j":
          this.scrollTo(this.offset + 1);
          return;
        case "k":
          this.scrollTo(this.offset - 1);
          return;
        case "d":
          this.scrollTo(this.offset + half);
          return;
        case "u":
          this.scrollTo(this.offset - half);
          return;
        case "f":
        case " ":
          this.scrollTo(this.offset + page);
          return;
        case "b":
          this.scrollTo(this.offset - page);
          return;
        case "g":
          this.scrollTo(0);
          return;
        case "G":
          this.scrollTo(this.maxOffset);
          return;
        case "/":
        case "?":
          this.mode = "search-input";
          this.searchInput = "";
          this.searchDir = key.ch === "/" ? 1 : -1;
          this.history.reset();
          return;
        case "n":
          this.gotoMatch(+1); // continues in the search's direction
          return;
        case "N":
          this.gotoMatch(-1);
          return;
        default:
          return;
      }
    }
    switch (key.name) {
      case "down":
        this.scrollTo(this.offset + 1);
        break;
      case "up":
        this.scrollTo(this.offset - 1);
        break;
      case "pagedown":
        this.scrollTo(this.offset + page);
        break;
      case "pageup":
        this.scrollTo(this.offset - page);
        break;
      case "home":
        this.scrollTo(0);
        break;
      case "end":
        this.scrollTo(this.maxOffset);
        break;
      case "escape":
        this.clearSearch();
        break;
      case "ctrl-c":
        this.quit();
        break;
    }
  }

  private handleSearchInputKey(key: Key): void {
    switch (key.name) {
      case "char":
        this.history.touch();
        this.searchInput += key.ch;
        break;
      case "backspace":
        this.history.touch();
        if (this.searchInput.length === 0) {
          this.mode = "view";
        } else {
          this.searchInput = graphemes(this.searchInput).slice(0, -1).join("");
        }
        break;
      case "ctrl-u":
        this.history.touch();
        this.searchInput = "";
        break;
      case "up": {
        const recalled = this.history.back(this.searchInput);
        if (recalled !== null) this.searchInput = recalled;
        break;
      }
      case "down": {
        const recalled = this.history.forward();
        if (recalled !== null) this.searchInput = recalled;
        break;
      }
      case "escape":
        this.mode = "view";
        this.history.reset();
        break;
      case "ctrl-c":
        this.quit();
        break;
      case "enter":
        this.mode = "view";
        this.history.push(this.searchInput);
        this.commitSearch(this.searchInput);
        break;
    }
  }

  private commitSearch(query: string): void {
    if (!query) {
      this.clearSearch();
      return;
    }
    this.query = query;
    this.matches = findMatches(this.lines, query);
    if (this.matches.length === 0) {
      this.message = `Pattern not found: ${query}`;
      this.query = null;
      this.current = -1;
      return;
    }
    this.current = pickInitialMatch(this.matches, this.offset, this.searchDir);
    this.scrollToMatch();
  }

  private clearSearch(): void {
    this.query = null;
    this.matches = [];
    this.current = -1;
  }

  private gotoMatch(dir: 1 | -1): void {
    if (this.matches.length === 0) {
      this.message = this.query === null ? "No search active" : `Pattern not found: ${this.query}`;
      return;
    }
    const step = dir * this.searchDir;
    this.current = (this.current + step + this.matches.length) % this.matches.length;
    this.scrollToMatch();
  }

  private scrollToMatch(): void {
    const match = this.matches[this.current];
    if (!match) return;
    if (match.line < this.offset || match.line >= this.offset + this.viewRows) {
      this.scrollTo(match.line - Math.floor(this.viewRows / 3));
    }
  }

  private quit(): void {
    leaveScreen();
    process.exit(0);
  }

  private paint(): void {
    const rows: string[] = [];
    for (let i = 0; i < this.viewRows; i++) {
      const line = this.lines[this.offset + i];
      if (!line) {
        rows.push("");
        continue;
      }
      let spans = line.spans;
      if (this.query && this.matches.length > 0) {
        const ranges: HighlightRange[] = [];
        this.matches.forEach((m, mi) => {
          if (m.line === this.offset + i) {
            ranges.push({ start: m.start, end: m.end, current: mi === this.current });
          }
        });
        if (ranges.length > 0) spans = applyHighlights(line, ranges);
      }
      rows.push(paintSpans(truncateSpansToWidth(spans, this.cols)));
    }
    rows.push(this.statusBar());
    paintFrame(rows);
  }

  private statusBar(): string {
    let text: string;
    if (this.mode === "search-input") {
      text = `${this.searchDir === 1 ? "/" : "?"}${this.searchInput}▌`;
    } else if (this.message) {
      text = ` ${this.message}`;
    } else {
      const total = this.lines.length;
      const pct =
        total === 0
          ? "(empty)"
          : `${Math.min(100, Math.round(((this.offset + this.viewRows) / total) * 100))}%`;
      const searchInfo =
        this.query && this.matches.length > 0
          ? `  match ${this.current + 1}/${this.matches.length} (n/N)`
          : "";
      const suffix = `  ${pct}${searchInfo}  ·  j/k scroll · / search · q quit`;
      // Keep the tail of a filename that would crowd out the status info.
      const nameBudget = Math.max(1, this.cols - displayWidth(suffix) - 1);
      let name = this.filename;
      if (displayWidth(name) > nameBudget) {
        const tail = graphemes(name);
        while (tail.length > 1 && displayWidth(`…${tail.join("")}`) > nameBudget) tail.shift();
        name = `…${tail.join("")}`;
      }
      text = ` ${name}${suffix}`;
    }
    // The status bar is a single row: newlines (which sanitizeText keeps as
    // the wrapper's hard-break marker) would corrupt the frame.
    const truncated = truncateToWidth(sanitizeText(text).replace(/\n/g, " "), this.cols);
    const padding = " ".repeat(Math.max(0, this.cols - displayWidth(truncated)));
    return `\x1b[7m${truncated}${padding}\x1b[0m`;
  }
}

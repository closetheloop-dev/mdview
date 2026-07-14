import { readFileSync, realpathSync, watch, watchFile } from "node:fs";
import { basename, dirname } from "node:path";
import { marked } from "marked";
import { Pager } from "./pager/pager";
import { renderBlocks } from "./render/render";

// Injected at compile time: bun build --define APP_VERSION='"v1.2.3"'
// (see Dockerfile and scripts/build.ts). Uncompiled runs print "dev".
declare const APP_VERSION: string | undefined;
const VERSION = typeof APP_VERSION !== "undefined" ? APP_VERSION : "dev";

const USAGE = `Usage: mdview <file.md>

Terminal markdown viewer. Opens an interactive pager on a TTY; prints
plain rendered text when piped.

Options:
  -h, --help     Show this help
  -v, --version  Show version

Keys: j/k or arrows scroll · d/u half page · f/b or PgDn/PgUp page
      g/G top/bottom · / search, ? backward (up/down: history)
      n/N next/prev in search direction · Esc clear · q quit`;

function main(): void {
  const args = process.argv.slice(2);
  const positional: string[] = [];
  let optionsEnded = false;
  for (const arg of args) {
    if (optionsEnded || !arg.startsWith("-") || arg === "-") {
      positional.push(arg);
    } else if (arg === "--") {
      optionsEnded = true; // conventional end-of-options: what follows is a filename
    } else if (arg === "-h" || arg === "--help") {
      console.log(USAGE);
      process.exit(0);
    } else if (arg === "-v" || arg === "--version") {
      console.log(`mdview ${VERSION}`);
      process.exit(0);
    } else {
      console.error(`mdview: unknown option ${arg}\n`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  if (positional.length !== 1) {
    console.error(USAGE);
    process.exit(2);
  }
  const path = positional[0]!;

  let source: string;
  try {
    source = readFileSync(path, "utf8");
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`mdview: cannot open ${path}: ${reason}`);
    process.exit(1);
  }

  const tokens = marked.lexer(source);

  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    // Non-interactive: dump plain rendered text and exit.
    const width = Number(process.env.COLUMNS) || 80;
    const lines = renderBlocks(tokens, width);
    process.stdout.write(`${lines.map((l) => l.plain).join("\n")}\n`);
    process.exit(0);
  }

  const pager = new Pager(tokens, path);
  pager.run();
  watchForChanges(path, source, pager);
}

/**
 * Autoreload: watch the file's parent directory (event-driven, and
 * rename-proof against editors that save via write-temp-then-rename, unlike
 * watching the file's inode) and hand the re-parsed document to the pager.
 * Falls back to stat polling on filesystems without change events.
 */
function watchForChanges(path: string, initialSource: string, pager: Pager): void {
  // Watch the file's REAL location: when `path` is a symlink, edits happen
  // in the target's directory, which may be somewhere else entirely.
  // Resolved once at startup; re-pointing the symlink itself afterwards is
  // not followed.
  let target: string;
  try {
    target = realpathSync(path);
  } catch {
    target = path;
  }
  let lastSource = initialSource;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const reload = () => {
    timer = null;
    let source: string;
    try {
      source = readFileSync(target, "utf8");
    } catch {
      return; // mid-atomic-save or deleted; a later event retriggers
    }
    if (source === lastSource) return;
    lastSource = source;
    pager.setDocument(marked.lexer(source));
  };

  // Editors emit several events per save; coalesce them.
  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(reload, 50);
  };

  try {
    const name = basename(target);
    // Rename events can't be filtered by name: Bun's Linux directory watch
    // reports a rename only under the OLD name (observed on 1.3.14: mv
    // tmp -> file yields "rename tmp", never "rename file"), and macOS may
    // pass a null filename. Any rename in the directory triggers the
    // (debounced, content-compared) reload; exact-name filtering applies
    // only to "change" events.
    watch(dirname(target), (event, filename) => {
      if (event === "rename" || filename === null || filename === name) trigger();
    });
  } catch {
    watchFile(target, { interval: 2000 }, trigger);
  }
}

main();

import { writeSync } from "node:fs";

const ENTER_ALT = "\x1b[?1049h\x1b[?25l"; // alternate screen + hide cursor
const LEAVE_ALT = "\x1b[0m\x1b[?25h\x1b[?1049l"; // reset styles, show cursor, main screen

let active = false;

/** Enter the TUI: raw mode + alternate screen. Installs exit-safety hooks. */
export function enterScreen(): void {
  if (active) return;
  active = true;
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdout.write(ENTER_ALT);

  process.on("exit", leaveScreen);
  process.on("SIGINT", onFatalSignal);
  process.on("SIGTERM", onFatalSignal);
  process.on("uncaughtException", onCrash);
}

/** Restore the terminal. Safe to call multiple times. */
export function leaveScreen(): void {
  if (!active) return;
  active = false;
  // Synchronous write: an async stdout write queued from a signal handler
  // is discarded by the immediate process.exit, leaving the terminal stuck
  // in the alternate screen.
  try {
    writeSync(1, LEAVE_ALT);
  } catch {
    process.stdout.write(LEAVE_ALT);
  }
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
}

function onFatalSignal(): void {
  leaveScreen();
  process.exit(130);
}

function onCrash(err: unknown): void {
  leaveScreen();
  console.error(err);
  process.exit(1);
}

/**
 * Paint a full frame: `rows` strings, one per terminal row, top to bottom.
 * Each row is written with clear-to-end-of-line; the whole frame goes out in
 * a single write to avoid flicker.
 */
export function paintFrame(rows: string[]): void {
  const frame = `\x1b[H${rows.map((r) => `${r}\x1b[K`).join("\r\n")}`;
  process.stdout.write(frame);
}

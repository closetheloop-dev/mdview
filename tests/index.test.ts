import { describe, expect, test } from "bun:test";

describe("command-line arguments", () => {
  test("double-dash allows a filename beginning with a dash", () => {
    const entrypoint = new URL("../src/index.ts", import.meta.url).pathname;
    // Two double-dashes: `bun run` consumes the first one itself, so mdview
    // receives `-- -missing.md`. The compiled binary needs only one.
    const result = Bun.spawnSync({
      cmd: [process.execPath, "run", entrypoint, "--", "--", "-missing.md"],
      stdout: "pipe",
      stderr: "pipe",
    });
    const stderr = result.stderr.toString();

    expect(result.exitCode).toBe(1);
    expect(stderr).toContain("mdview: cannot open -missing.md:");
    expect(stderr).not.toContain("Usage: mdview <file.md>");
  });

  test("unknown options are rejected instead of silently ignored", () => {
    const entrypoint = new URL("../src/index.ts", import.meta.url).pathname;
    const fixture = new URL("./fixtures/kitchen-sink.md", import.meta.url).pathname;
    const result = Bun.spawnSync({
      cmd: [process.execPath, "run", entrypoint, "--unknown", fixture],
      stdout: "pipe",
      stderr: "pipe",
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("Usage: mdview <file.md>");
  });
});

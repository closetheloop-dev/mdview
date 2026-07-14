import { describe, expect, test } from "bun:test";

/**
 * Auditability invariant, enforced on every test run:
 *
 * The shipped program (first-party code plus its single runtime dependency,
 * bundled exactly as `bun build --compile` would) must have no capability
 * beyond:
 *   - reading the input file named on the command line (fs readFileSync)
 *   - watching that file's directory for changes, read-only
 *     (fs watch, with fs watchFile stat-polling as fallback)
 *   - reading keystrokes from stdin
 *   - writing ANSI text to stdout/stderr
 *
 * No network, no subprocesses, no dynamic code evaluation, no filesystem
 * writes. A pattern below appearing in the bundle fails the suite; if it is
 * a legitimate new feature, the invariant above must be consciously amended.
 */

const result = await Bun.build({
  entrypoints: [new URL("../src/index.ts", import.meta.url).pathname],
  target: "bun",
  minify: false,
});
expect(result.success).toBe(true);
const bundle = await result.outputs[0]!.text();

const FORBIDDEN: Record<string, RegExp> = {
  "network: fetch": /\bfetch\s*\(/,
  "network: WebSocket": /\bWebSocket\b/,
  "network: XMLHttpRequest": /\bXMLHttpRequest\b/,
  "network: node modules": /["'`]node:(net|http|https|http2|dgram|tls)\b/,
  "network: Bun APIs": /\bBun\.(serve|connect|listen|udpSocket|fetch)\b/,
  "subprocess: child_process": /\bchild_process\b|["'`]node:child_process/,
  "subprocess: Bun.spawn / Bun.$": /\bBun\.(spawn|spawnSync|\$)/,
  "subprocess: worker": /["'`]node:worker_threads|\bnew\s+Worker\b/,
  "dynamic code: eval": /\beval\s*\(/,
  "dynamic code: Function constructor": /\bnew\s+Function\b/,
  "fs writes: write/append": /\b(writeFile|writeFileSync|appendFile|appendFileSync)\b/,
  "fs writes: streams": /\bcreateWriteStream\b/,
  "fs writes: mutation": /\b(unlink|unlinkSync|rmSync|renameSync|mkdirSync|chmodSync|rmdirSync)\b/,
  "fs writes: Bun.write": /\bBun\.write\b/,
};

describe("shipped-bundle capability invariant", () => {
  test("bundle built and contains the expected read capability", () => {
    // Positive control: proves we are scanning the real program, not an
    // empty or failed bundle.
    expect(bundle).toContain("readFileSync");
    expect(bundle).toContain("watchForChanges");
    expect(bundle.length).toBeGreaterThan(10_000);
  });

  for (const [name, pattern] of Object.entries(FORBIDDEN)) {
    test(`no ${name}`, () => {
      const match = bundle.match(pattern);
      if (match) {
        const at = bundle.indexOf(match[0]);
        throw new Error(
          `forbidden capability "${name}" in bundle: ...${bundle.slice(Math.max(0, at - 80), at + 80)}...`,
        );
      }
    });
  }
});

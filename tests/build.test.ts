import { describe, expect, test } from "bun:test";

const dockerfile = await Bun.file(new URL("../Dockerfile", import.meta.url)).text();

describe("Docker build context", () => {
  test("copies pinned Unicode data before running the test suite", () => {
    const copyData = dockerfile.indexOf("COPY data ./data");
    const runTests = dockerfile.indexOf("RUN bun run lint");

    expect(copyData).toBeGreaterThanOrEqual(0);
    expect(runTests).toBeGreaterThan(copyData);
  });
});

describe("release licensing", () => {
  test("THIRD_PARTY_NOTICES exists and covers the bundled components", async () => {
    const notices = await Bun.file(
      new URL("../release/THIRD_PARTY_NOTICES", import.meta.url),
    ).text();
    for (const needle of ["marked", "Unicode", "Bun", "JavaScriptCore", "tinycc", "LGPL"]) {
      expect(notices).toContain(needle);
    }
  });

  test("the full LGPL texts are present for the statically linked runtime", async () => {
    const v2 = await Bun.file(new URL("../release/LGPL-2.0.txt", import.meta.url)).text();
    const v21 = await Bun.file(new URL("../release/LGPL-2.1.txt", import.meta.url)).text();
    expect(v2).toContain("GNU LIBRARY GENERAL PUBLIC LICENSE");
    expect(v21).toContain("GNU LESSER GENERAL PUBLIC LICENSE");
  });

  test("corresponding-source instructions accompany the binary", async () => {
    const doc = await Bun.file(
      new URL("../release/CORRESPONDING_SOURCE.md", import.meta.url),
    ).text();
    // Pinned component commits and the relink entry points must be present.
    expect(doc).toContain("0d9b296af33f2b851fcbf4df3e9ec89751734ba4"); // Bun
    expect(doc).toContain("5488984d20e0dbfe4be2c3ba8fb18eb81a5e0e8b"); // WebKit
    expect(doc).toContain("12882eee073cfe5c7621bcfadf679e1372d4537b"); // TinyCC
    expect(doc).toContain("bun run build:release:local");
  });

  test("packaging script ships every license file in every archive", async () => {
    const script = await Bun.file(
      new URL("../scripts/package-binaries.sh", import.meta.url),
    ).text();
    // Source paths (LICENSE at root, notices in release/) and the flat
    // basenames tarred into each archive.
    expect(script).toContain(
      "NOTICE_SRC=(LICENSE release/THIRD_PARTY_NOTICES release/LGPL-2.0.txt release/LGPL-2.1.txt release/CORRESPONDING_SOURCE.md)",
    );
    // Regex (not a string) so the literal ${...} shell syntax isn't read as
    // a JS template placeholder. Pins the versioned archive name so a dropped
    // $VERSION can't slip through.
    expect(script).toMatch(
      /tar -C "out\/\$p" -czf "assets\/mdview-\$VERSION-\$p\.tar\.gz" mdview "\$\{NOTICE_NAMES\[@\]\}"/,
    );
    // The leading v is stripped so archive names use the bare version (0.1.0).
    expect(script).toMatch(/VERSION="\$\{VERSION#v\}"/);
  });
});

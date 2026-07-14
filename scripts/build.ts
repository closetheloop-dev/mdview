// Local cross-compile of self-contained binaries into dist/.
// CI builds use the Dockerfile (same targets, pinned Bun image) instead;
// keep the target lists in sync. Version comes from package.json here,
// from the git tag in CI.
export {};

const TARGETS = [
  { target: "bun-linux-x64", suffix: "linux-x64" },
  { target: "bun-linux-arm64", suffix: "linux-arm64" },
  { target: "bun-darwin-x64", suffix: "darwin-x64" },
  { target: "bun-darwin-arm64", suffix: "darwin-arm64" },
];

const pkg = (await Bun.file(new URL("../package.json", import.meta.url)).json()) as {
  version: string;
};
const define = `APP_VERSION="v${pkg.version}"`;

for (const { target, suffix } of TARGETS) {
  const outfile = `dist/mdview-${suffix}`;
  console.log(`building ${outfile} (${target})`);
  await Bun.$`bun build src/index.ts --compile --minify --target=${target} --define=${define} --outfile=${outfile}`;
}

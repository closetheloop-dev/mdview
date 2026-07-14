# Cross-compiles mdview for all release platforms with a pinned Bun toolchain.
#
# Used by .github/workflows/{build,release,release-dryrun}.yml, and runnable
# locally:
#   docker buildx build --build-arg VERSION=v0.1.0 --target export \
#     -o type=local,dest=./out .
# drops out/<platform>/mdview onto the host (scratch export stage = binaries
# only, no image to run).
#
# VERSION is baked into the binary via --define APP_VERSION (src/index.ts
# falls back to "dev" when absent). Lint, typecheck, and the full test suite
# (including the capability-invariant scan) gate the compile.

FROM docker.io/oven/bun:1.3.14 AS build
WORKDIR /app

# .gitignore is needed by biome (vcs.useIgnoreFile in biome.jsonc)
COPY package.json bun.lock tsconfig.json biome.jsonc .gitignore ./
RUN bun install --frozen-lockfile

COPY src ./src
COPY tests ./tests
COPY data ./data
# The Dockerfile, packaging script, and license files are under test
# (tests/build.test.ts checks build-context and licensing invariants),
# so the test gate needs them present.
COPY Dockerfile LICENSE ./
COPY release ./release
COPY scripts ./scripts
RUN bun run lint && bun run typecheck && bun test

ARG VERSION=dev
RUN set -eux; \
    DEF="APP_VERSION=\"${VERSION}\""; \
    for t in linux-x64 linux-arm64 darwin-x64 darwin-arm64; do \
      bun build src/index.ts --compile --minify --target=bun-$t \
        --define "$DEF" --outfile "out/$t/mdview"; \
    done

FROM scratch AS export
COPY --from=build /app/out /

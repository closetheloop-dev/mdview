#!/usr/bin/env bash
# Packages the cross-compiled binaries in out/ (produced by the Dockerfile
# export stage) into release assets in assets/: one tar.gz per platform with
# a bare `mdview` inside, plus SHA256SUMS.txt.
# Takes the release version (including the v, e.g. v0.1.0) as its only
# argument; it becomes part of each archive name. Shared by release.yml and
# release-dryrun.yml; runnable locally after a docker buildx export (see
# Dockerfile header).
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:?usage: package-binaries.sh <version>  (e.g. v0.1.0)}"
VERSION="${VERSION#v}" # archive names use the bare version (0.1.0), matching package.json

PLATFORMS=(linux-x64 linux-arm64 darwin-x64 darwin-arm64)

# Every archive must carry the license notices: the binary embeds marked,
# Unicode-derived data, and the Bun runtime, whose statically linked
# JavaScriptCore/WebKit (LGPL-2) and TinyCC (LGPL-2.1) require the full LGPL
# texts to accompany each binary copy (see release/THIRD_PARTY_NOTICES).
# LICENSE lives at the repo root; the rest live in release/. Both land flat
# at the top of every archive, next to the binary.
NOTICE_SRC=(LICENSE release/THIRD_PARTY_NOTICES release/LGPL-2.0.txt release/LGPL-2.1.txt release/CORRESPONDING_SOURCE.md)
NOTICE_NAMES=(LICENSE THIRD_PARTY_NOTICES LGPL-2.0.txt LGPL-2.1.txt CORRESPONDING_SOURCE.md)
for f in "${NOTICE_SRC[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "error: $f missing — required in every release archive" >&2
    exit 1
  fi
done

rm -rf assets
mkdir -p assets
for p in "${PLATFORMS[@]}"; do
  if [[ ! -f "out/$p/mdview" ]]; then
    echo "error: out/$p/mdview missing — build first (see Dockerfile header)" >&2
    exit 1
  fi
  chmod 0755 "out/$p/mdview"
  cp "${NOTICE_SRC[@]}" "out/$p/"
  tar -C "out/$p" -czf "assets/mdview-$VERSION-$p.tar.gz" mdview "${NOTICE_NAMES[@]}"
done
(cd assets && sha256sum mdview-*.tar.gz > SHA256SUMS.txt)

echo "release assets:"
ls -l assets

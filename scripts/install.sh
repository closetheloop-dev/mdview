#!/usr/bin/env bash
# Installs mdview from its prebuilt GitHub release binaries. Detects the
# platform, downloads the matching release archive, verifies its SHA-256
# checksum, and drops the bare `mdview` binary into ~/.local/bin (no sudo).
# Meant to be run via:
#   curl -fsSL https://raw.githubusercontent.com/closetheloop-dev/mdview/main/scripts/install.sh | bash
#
# Environment overrides:
#   MDVIEW_VERSION      tag to install (e.g. v0.1.2); default: latest release
#   MDVIEW_INSTALL_DIR  target directory; default: ~/.local/bin
#
# Only Linux and macOS on x64/arm64 have prebuilt binaries (see
# scripts/package-binaries.sh for the release asset matrix).
set -euo pipefail

REPO="closetheloop-dev/mdview"
INSTALL_DIR="${MDVIEW_INSTALL_DIR:-$HOME/.local/bin}"

err() {
  echo "error: $*" >&2
  exit 1
}

# --- Preflight: required tools ---------------------------------------------
for tool in curl tar; do
  command -v "$tool" >/dev/null 2>&1 || err "$tool is required but not installed"
done

# sha256sum on Linux, shasum on macOS (macOS has no sha256sum by default).
if command -v sha256sum >/dev/null 2>&1; then
  SHACHECK=(sha256sum -c SHA256SUMS.txt --ignore-missing)
elif command -v shasum >/dev/null 2>&1; then
  SHACHECK=(shasum -a 256 -c SHA256SUMS.txt --ignore-missing)
else
  err "need sha256sum or shasum to verify the download"
fi

# --- Detect platform -------------------------------------------------------
case "$(uname -s)" in
  Linux) os="linux" ;;
  Darwin) os="darwin" ;;
  *) err "unsupported OS '$(uname -s)' — prebuilt binaries exist only for Linux and macOS (on Windows, use the linux-x64 binary under WSL)" ;;
esac

case "$(uname -m)" in
  x86_64 | amd64) arch="x64" ;;
  aarch64 | arm64) arch="arm64" ;;
  *) err "unsupported architecture '$(uname -m)' — prebuilt binaries exist only for x64 and arm64" ;;
esac

platform="$os-$arch"

# --- Resolve version -------------------------------------------------------
# The git tag keeps the leading v (v0.1.2); release asset names strip it
# (mdview-0.1.2-...). We need both forms.
tag="${MDVIEW_VERSION:-}"
if [[ -z "$tag" ]]; then
  tag=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" |
    grep '"tag_name"' | head -n1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
  [[ -n "$tag" ]] || err "could not determine the latest release — set MDVIEW_VERSION to a tag (e.g. v0.1.2)"
fi
bare_version="${tag#v}"

archive="mdview-$bare_version-$platform.tar.gz"
base_url="https://github.com/$REPO/releases/download/$tag"

# --- Download --------------------------------------------------------------
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading mdview $tag ($platform)…"
curl -fsSL "$base_url/$archive" -o "$tmp/$archive" ||
  err "failed to download $archive from $base_url (does version $tag have a $platform build?)"
curl -fsSL "$base_url/SHA256SUMS.txt" -o "$tmp/SHA256SUMS.txt" ||
  err "failed to download SHA256SUMS.txt from $base_url"

# --- Verify checksum -------------------------------------------------------
echo "Verifying checksum…"
(cd "$tmp" && "${SHACHECK[@]}") || err "checksum verification failed for $archive"

# --- Smoke test (before touching any existing install) ---------------------
# The checksum proves the download is authentic, but not that it can run on
# this machine (e.g. incompatible glibc). Exercise the new binary in the temp
# dir first; if it can't run, abort without clobbering a working install.
tar -xzf "$tmp/$archive" -C "$tmp" mdview
chmod +x "$tmp/mdview"
if ! version="$("$tmp/mdview" --version 2>/dev/null)"; then
  err "downloaded binary failed to run — leaving any existing install untouched"
fi
case "$version" in
  *"$bare_version"*) ;;
  *) err "downloaded binary reported unexpected version '$version' (expected $bare_version)" ;;
esac

# --- Install (atomic) ------------------------------------------------------
# Rename into place from within the same directory so a failure can never
# leave a half-written binary where a working one used to be.
mkdir -p "$INSTALL_DIR"
staged="$INSTALL_DIR/.mdview.$$"
trap 'rm -rf "$tmp" "$staged"' EXIT
mv "$tmp/mdview" "$staged"
mv "$staged" "$INSTALL_DIR/mdview"

# --- Report ----------------------------------------------------------------
echo "Installed $version to $INSTALL_DIR/mdview"

case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *)
    echo
    echo "note: $INSTALL_DIR is not on your PATH. Add it, e.g.:"
    echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
    ;;
esac

echo "License and third-party notices ship inside the release archive and at"
echo "  https://github.com/$REPO/releases/tag/$tag"

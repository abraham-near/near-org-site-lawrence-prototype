#!/usr/bin/env bash
# Usage: npm run versions [-- <commit> ...]   (FORCE=1 rebuilds copies that already exist)
#
# Builds a frozen, static copy of each committed version listed in src/versions.json (D39) into
# public/versions/<commit>/, so the index at / can open every version beside the live one. The running server
# serves new copies straight away; no rebuild is needed. Each copy is the commit's own code and dependencies,
# exported with basePath /versions/<commit>. Paths basePath doesn't reach are prefixed in that copy's source
# first, and the output is checked for any that got away. The copies are generated, so public/versions is
# git-ignored (and kept out of Dropbox).
set -euo pipefail

SITE="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${VERSIONS_WORK:-${TMPDIR:-/tmp}/near-versions}"
OUT="$SITE/public/versions"
LIST="$SITE/src/versions.json"

if [ "$#" -gt 0 ]; then
  COMMITS=("$@")
else
  # shellcheck disable=SC2207
  COMMITS=($(node -e 'for (const v of require(process.argv[1]).versions) console.log(v.commit)' "$LIST"))
fi

mkdir -p "$WORK" "$OUT"
# The real path: macOS's temp folder sits behind a symlink (/var -> /private/var), and Turbopack refuses a root whose
# build folder resolves outside it
WORK="$(cd "$WORK" && pwd -P)"
xattr -w 'com.apple.fileprovider.ignore#P' 1 "$OUT" 2>/dev/null || true

for c in "${COMMITS[@]}"; do
  [[ "$c" =~ ^[0-9a-f]{7,40}$ ]] || { echo "$c: not a commit hash"; exit 1; }
  if [ -f "$OUT/$c/index.html" ] && [ -z "${FORCE:-}" ]; then
    echo "$c: already built"
    continue
  fi

  # Where the commit's homepage is: / until D39 moved it to /home. versions.json must agree, or the index's
  # "Open homepage" would open that commit's index instead
  home=""
  git -C "$SITE" cat-file -e "$c:src/app/home/page.tsx" 2>/dev/null && home="home"
  listed="$(node -e 'const v = require(process.argv[1]).versions.find((v) => v.commit === process.argv[2]); console.log(v ? v.home : "-")' "$LIST" "$c")"
  [ "$listed" != "-" ] || { echo "$c: add it to src/versions.json first"; exit 1; }
  [ "$listed" = "$home" ] || { echo "$c: set \"home\": \"$home\" for it in src/versions.json"; exit 1; }

  echo "$c: building"
  # Dependencies as locked at that commit, shared by every build that uses the same lockfile; a build folder
  # below them resolves packages by walking up (a clone on APFS when the lockfile matches the site's)
  cd "$WORK"
  lock="$(git -C "$SITE" show "$c:package-lock.json" | shasum | cut -c1-40)"
  if [ "$(cat deps.sha 2>/dev/null || true)" != "$lock" ]; then
    rm -rf ./node_modules ./deps.sha
    if [ "$(shasum < "$SITE/package-lock.json" | cut -c1-40)" = "$lock" ]; then
      cp -cR "$SITE/node_modules" ./node_modules 2>/dev/null || cp -R "$SITE/node_modules" ./node_modules
    else
      git -C "$SITE" show "$c:package.json" > package.json
      git -C "$SITE" show "$c:package-lock.json" > package-lock.json
      npm ci --silent
    fi
    echo "$lock" > deps.sha
  fi

  # A fresh folder for every build, so nothing from another commit leaks in
  rm -rf ./build
  mkdir build
  cd build
  git -C "$SITE" archive "$c" | tar -x -C .
  # Prefix the copy's base path onto paths basePath doesn't reach: public files (in quotes, backticks or CSS url()),
  # and plain <a href> attributes to its own pages (next/link hrefs, written as object fields, get it already). A plain
# link built from data is written href={`/${...}`} so it is caught too
  find src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) -print0 |
    xargs -0 perl -pi -e "s{([\"'\`(])/(images|videos|brand|lab/voices-refs|lab/hero|lab/directions|directions)/}{\$1/versions/$c/\$2/}g; s{href=(\{\`|\")/(lab|system|\\\$\\{)}{href=\$1/versions/$c/\$2}g"
  mv next.config.ts next.config.base.ts
  cat > next.config.ts <<EOF
import type { NextConfig } from "next";
import base from "./next.config.base";

const config: NextConfig = {
  ...base,
  output: "export",
  // Both rely on partial prerendering, which needs a server
  cacheComponents: false,
  partialPrefetching: false,
  basePath: "/versions/$c",
  images: { unoptimized: true },
  turbopack: { ...base.turbopack, root: "$WORK" },
};

export default config;
EOF
  "$WORK/node_modules/.bin/next" build > "$WORK/build-$c.log" 2>&1 || { echo "$c: build failed, see $WORK/build-$c.log"; exit 1; }

  # Every page's own paths must stay inside the copy: no public file or own page left at the site's root (links to
  # the wider site map, like /brand or /blog, may point there), nothing prefixed twice
  # (The copy's own versions index is skipped: its working-copy links point at the live site on purpose)
  escaped="$(grep -rhoE '(href|src|srcset|poster)="[^"]*"' out --include='*.html' --exclude=index.html |
    grep -E '(^|[" ,])(/(images|videos|brand|_next)/|/(lab|system)([/"]|$))|/versions/[0-9a-f]+/versions/' | sort -u || true)"
  [ -z "$escaped" ] || { printf '%s: paths outside the copy:\n%s\n' "$c" "$escaped"; exit 1; }

  mkdir -p "$OUT/$c"
  rsync -a --delete out/ "$OUT/$c/"
  echo "$c: done"
done

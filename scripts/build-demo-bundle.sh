#!/usr/bin/env bash
# Builds a standalone, drag-and-drop deployable copy of the Rockhampton demo
# with the site at the root, for Netlify Drop (app.netlify.com/drop) or any
# static host.
#
#   npm install && npx next build && bash scripts/build-demo-bundle.sh
#
# The pages are written at both the root and their in-repo paths, so every
# internal link resolves to a real file and the bundle needs no redirect rules.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d out ] || { echo "run 'npx next build' first"; exit 1; }

rm -rf dist-rmae
mkdir -p dist-rmae/admin dist-rmae/rockhampton/admin
cp -r out/_next dist-rmae/_next
cp -r out/rmae  dist-rmae/rmae
cp out/rockhampton.html        dist-rmae/index.html
cp out/rockhampton.html        dist-rmae/rockhampton/index.html
cp out/rockhampton/admin.html  dist-rmae/admin/index.html
cp out/rockhampton/admin.html  dist-rmae/rockhampton/admin/index.html

cat > dist-rmae/robots.txt <<'ROBOTS'
# Concept demo, not the live site: keep it out of search results.
User-agent: *
Disallow: /
ROBOTS

echo "dist-rmae ready ($(du -sh dist-rmae | cut -f1))"

#!/usr/bin/env bash
# Builds the static site into ./dist.
#
# The site uses @opendatacapture/react-core, which is not published to npm, so
# this script checks out the OpenDataCapture monorepo (pinned to ODC_REF) into
# .odc/, copies site/ into it as a workspace app, and builds there.
#
# Usage: scripts/build.sh [build|dev|bundle]
#   build   build the site into ./dist (default)
#   dev     start the vite dev server (rerun after editing site/)
#   bundle  only bundle the instruments in the series into public/bundles
#   check   type-check and bundle every instrument (no output files)
#
# Environment:
#   ODC_REF    OpenDataCapture commit (default: a main commit after v2.5.2,
#              because v2.5.2 has no Spanish interface strings)
#   SITE_BASE  URL path the site is served from (default: /yuca-vibe-experiment/)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ODC="${ROOT}/.odc"
ODC_REF="${ODC_REF:-432dec8115722d8316922f0069f0c3b67f09214a}"
APP="${ODC}/apps/yuca-site"
MODE="${1:-build}"

if [[ "$(git -C "${ODC}" rev-parse HEAD 2>/dev/null)" != "${ODC_REF}" ]]; then
  rm -rf "${ODC}"
  git init -q "${ODC}"
  git -C "${ODC}" fetch -q --depth 1 https://github.com/DouglasNeuroInformatics/OpenDataCapture "${ODC_REF}"
  git -C "${ODC}" -c advice.detachedHead=false checkout -q FETCH_HEAD
fi

mkdir -p "${APP}"
rsync -a --delete --exclude node_modules --exclude dist --exclude public/bundles "${ROOT}/site/" "${APP}/"

cd "${ODC}"
# The copied site app is not in ODC's lockfile, so the lockfile must be updated
# (CI defaults to --frozen-lockfile). The change stays inside .odc/.
pnpm install --no-frozen-lockfile --filter "@yuca/site..."
# Build the workspace packages the site needs (runtime-core, runtime-v1, ...).
if [[ ! -d "${ODC}/runtime/v1/dist" ]]; then
  pnpm -r --filter "@yuca/site^..." run build
fi

export YUCA_INSTRUMENTS_DIR="${ROOT}/instruments"

case "${MODE}" in
  build)
    pnpm --filter @yuca/site run build
    rm -rf "${ROOT}/dist"
    cp -r "${APP}/dist" "${ROOT}/dist"
    echo "Site written to ${ROOT}/dist"
    ;;
  dev)
    pnpm --filter @yuca/site run dev
    ;;
  bundle)
    pnpm --filter @yuca/site run bundle
    ;;
  check)
    # The runtime types allow only open licenses when they find the ODC repo's
    # package.json two levels up. These instruments are not part of the ODC repo,
    # so type-check against a copy of the runtime types outside .odc/.
    TYPES="${ROOT}/.odc-types"
    mkdir -p "${TYPES}/runtime/v1"
    rsync -a --delete "${ODC}/runtime/v1/dist/" "${TYPES}/runtime/v1/dist/"
    cp "${ODC}/runtime/v1/env.d.ts" "${ODC}/runtime/v1/global.d.ts" "${TYPES}/runtime/v1/"
    echo '{ "private": true }' > "${TYPES}/package.json"
    "${ODC}/node_modules/.bin/tsc" -p "${ROOT}/instruments/tsconfig.json"
    pnpm --filter @yuca/site run bundle --check
    ;;
  *)
    echo "Unknown mode: ${MODE}" >&2
    exit 1
    ;;
esac

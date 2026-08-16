#!/usr/bin/env bash
#
# Everything that can fail without a browser, in the order that fails fastest.
#
# Typecheck first because it's seconds and catches most of it. Tests next.
# The production build last and always: webpack's production mode drops modules
# the dev server happily serves, so "it looked fine on 5273" is not evidence a
# build works.
#
# Run from anywhere; paths resolve against the repo root.

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$root"

step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }

step "Typecheck (server + web)"
npm run typecheck

step "Tests (server + web)"
npm test

step "Production build"
npm run build

printf '\n\033[32m✓ typecheck, tests and build all clean\033[0m\n'
printf '  Now look at it: dev server on http://localhost:5273, and check 375px too.\n'

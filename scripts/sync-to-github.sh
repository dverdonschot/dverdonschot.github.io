#!/usr/bin/env bash
# scripts/sync-to-github.sh
#
# Mirror the source of truth (Forgejo) to GitHub Pages.
#
# GitHub Pages serves this repository, so the site has to exist on
# GitHub. The code is maintained on Forgejo (ADR-0008: Forgejo is the
# only git host the agents use), and this script is the one-way
# mirror that keeps the Pages deployment in step.
#
# The mirror is one way on purpose: Forgejo wins. Anything pushed to
# GitHub by hand is overwritten by the next sync, so work happens in
# the Forgejo clone or in the Forgejo web UI.
#
# Usage:
#   bash scripts/sync-to-github.sh            # sync main
#   bash scripts/sync-to-github.sh --dry-run  # show what would be pushed
#
# Env:
#   ORIGIN_REMOTE   source of truth (default: origin)
#   GITHUB_REMOTE   the Pages repo (default: github)
#   BRANCH          branch to mirror (default: main)

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORIGIN_REMOTE="${ORIGIN_REMOTE:-origin}"
GITHUB_REMOTE="${GITHUB_REMOTE:-github}"
BRANCH="${BRANCH:-main}"

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

log() { printf '[sync] %s\n' "$*"; }
die() { printf '[sync] ERROR: %s\n' "$*" >&2; exit 1; }

cd "$REPO"

git remote get-url "$ORIGIN_REMOTE" >/dev/null 2>&1 \
  || die "no remote '$ORIGIN_REMOTE' (the Forgejo source of truth)"
git remote get-url "$GITHUB_REMOTE" >/dev/null 2>&1 \
  || die "no remote '$GITHUB_REMOTE' (the GitHub Pages repo)"

log "fetching $ORIGIN_REMOTE/$BRANCH"
git fetch -q "$ORIGIN_REMOTE" "$BRANCH"

git checkout -q "$BRANCH"
if ! git merge --ff-only "$ORIGIN_REMOTE/$BRANCH"; then
  die "local $BRANCH has commits that are not on $ORIGIN_REMOTE; resolve by hand"
fi

behind=$(git rev-list --count "$GITHUB_REMOTE/$BRANCH..$BRANCH" 2>/dev/null || echo "?")
log "$GITHUB_REMOTE/$BRANCH is $behind commit(s) behind $BRANCH"

if [ "$DRY_RUN" -eq 1 ]; then
  log "dry run: would push $BRANCH to $GITHUB_REMOTE"
  git log --oneline "$GITHUB_REMOTE/$BRANCH..$BRANCH" 2>/dev/null | head -10
  exit 0
fi

git push "$GITHUB_REMOTE" "$BRANCH:$BRANCH"
log "pushed to $GITHUB_REMOTE"
log "the GitHub Actions workflow now builds the site and redeploys Pages"

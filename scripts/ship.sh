#!/usr/bin/env bash
#
# npm run ship — deploy the current branch to production.
#
# Production deploys from `main`. Rather than point Vercel at a feature branch
# (which leaves `main` a dead, confusing branch), this fast-forwards `main` to
# whatever branch you're on and pushes it — Vercel then builds production.
#
# Safe by design: refuses on a dirty tree or when the move isn't a clean
# fast-forward. Commit your work first, then: npm run ship
#
set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch" = "main" ]; then
  echo "You're on main — just run: git push origin main"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Uncommitted changes — commit them first, then run: npm run ship"
  git status --short
  exit 1
fi

echo "→ fetching origin/main …"
git fetch origin main --quiet

if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "✗ origin/main is not an ancestor of '$branch' — not a fast-forward."
  echo "  Rebase/merge origin/main into '$branch' first, then re-run."
  exit 1
fi

head_short=$(git rev-parse --short HEAD)
echo "→ pushing '$branch' → origin/$branch …"
git push origin "$branch"

echo "→ fast-forwarding origin/main → $head_short …"
git push origin "$branch:main"
git branch -f main origin/main >/dev/null 2>&1 || true

echo ""
echo "✓ Shipped. Production (main) now = $head_short."
echo "  Vercel will build & deploy it. Verify in ~1–2 min:"
echo "    curl -s -o /dev/null -w '%{http_code}\\n' https://www.abhaglobaleducare.com/"

#!/usr/bin/env bash
# Apply all .patch files from patches/ dir in numerical order.
#
# Usage: scripts/apply-patches.sh [patches-dir]
#   patches-dir  Path to the patches directory (default: patches)
#
# Exit code: 0 = all patches applied cleanly, 1 = one or more failed.
#
# Validates each patch with `git apply --check` before applying.
# Reports which patches applied and which failed; continues past
# failures to collect the full list before exiting.

set -uo pipefail

PATCHES_DIR="${1:-patches}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

cd "$REPO_ROOT"

if [[ ! -d "$PATCHES_DIR" ]]; then
  echo "ERROR: patches directory not found: $PATCHES_DIR" >&2
  exit 1
fi

# Collect patches in sorted order (numerical: 001, 003, 004, ...)
mapfile -t PATCHES < <(find "$PATCHES_DIR" -maxdepth 1 -name '*.patch' -print | sort)

if [[ ${#PATCHES[@]} -eq 0 ]]; then
  echo "No .patch files found in $PATCHES_DIR — nothing to do."
  exit 0
fi

echo "Found ${#PATCHES[@]} patch(es) to apply:"
for p in "${PATCHES[@]}"; do
  echo "  $(basename "$p")"
done
echo ""

FAILED=()
APPLIED=()

for patch in "${PATCHES[@]}"; do
  name="$(basename "$patch")"
  echo "──────────────────────────────────────────"
  echo "Validating: $name"

  # Run check-only pass first; capture stderr so we can show it on failure
  if check_output=$(git apply --check "$patch" 2>&1); then
    echo "  ✓ Check passed — applying"
    if git apply "$patch"; then
      echo "  ✓ Applied: $name"
      APPLIED+=("$name")
    else
      echo "  ✗ Apply failed (check passed but apply errored): $name" >&2
      FAILED+=("$name")
    fi
  else
    echo "  ✗ Check failed (patch does not apply cleanly): $name" >&2
    echo "$check_output" >&2
    FAILED+=("$name")
  fi
  echo ""
done

echo "══════════════════════════════════════════"
echo "Summary"
echo "══════════════════════════════════════════"
printf "  Applied (%d): %s\n" "${#APPLIED[@]}" "${APPLIED[*]:-none}"
printf "  Failed  (%d): %s\n" "${#FAILED[@]}" "${FAILED[*]:-none}"
echo ""

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "ERROR: ${#FAILED[@]} patch(es) failed to apply cleanly:" >&2
  for f in "${FAILED[@]}"; do
    echo "  - $f" >&2
  done
  echo "" >&2
  echo "These patches may need to be regenerated against the current codebase." >&2
  echo "See patches/PATCH-LOG.md for context on each patch." >&2
  exit 1
fi

echo "All ${#APPLIED[@]} patch(es) applied successfully."
exit 0

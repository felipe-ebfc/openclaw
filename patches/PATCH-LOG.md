# OpenClaw Patch Log

> **RULE:** Every local change to openclaw-dev gets logged here AND saved as a .patch file.
> **After any `npm install -g openclaw` or `git pull`, reapply patches:**
> ```bash
> cd /Users/osito/openclaw-dev
> scripts/apply-patches.sh
> ```

---

## Active Patches

*No active patches — all fixes have been incorporated into the codebase via direct commits.*

---

## Retired Patches

### 001 — iMessage Routing Leak Fix (RETIRED)
**File:** `patches/001-imessage-routing-fix.patch` — **DELETED**
**Status:** RETIRED — incorporated into codebase via direct commit (March 2026)
**First patched:** ~January 2026

**What it fixed:**
When a message arrives via iMessage and gets processed through webchat, the reply dispatcher checks `surface` metadata. Without this patch, replies intended for webchat leak back to iMessage, causing duplicate messages or messages sent to the wrong place.

**Incorporated in:**
- `src/auto-reply/reply/dispatch-from-config.ts` — `OriginatingChannel` guard at lines 212, 313

---

### 002 — DEFAULT_CONTEXT_TOKENS 1M (RETIRED)
**Status:** RETIRED — no longer needed
**Why:** Config-level `contextWindow: 1000000` per-model in `~/.openclaw/openclaw.json` overrides the code default. The config approach survives updates without patching.

**Replaced by (in config):**
```json
"models": {
  "anthropic/claude-opus-4-6": { "alias": "opus", "params": { "contextWindow": 1000000 } },
  "anthropic/claude-sonnet-4-6": { "alias": "sonnet", "params": { "contextWindow": 1000000 } }
}
```

---

### 003 — Compaction Warning Visibility Fix (RETIRED)
**File:** `patches/003-compaction-warnings.patch` — **DELETED**
**Status:** RETIRED — incorporated into codebase via direct commit (March 2026)
**Date:** March 5, 2026

**What it fixed:**
Model compact warnings never surfaced due to two root causes:

1. **Compaction safeguard missing-model warning** used raw `console.warn` instead of the subsystem logger.
2. **Context window guard** never warned when model metadata was missing.

**Incorporated in:**
- `src/agents/pi-extensions/compaction-safeguard.ts` — `console.warn` → `log.warn`
- `src/agents/context-window-guard.ts` — `shouldWarnDefaultSource` flag at lines 56, 75
- `src/agents/pi-embedded-runner/run.ts` — emits warning when `shouldWarnDefaultSource` is true

---

### 004 — Bootstrap Budget Zero-Injection Warnings (RETIRED)
**File:** `patches/004-bootstrap-budget-warnings.patch` — **DELETED**
**Status:** RETIRED — incorporated into codebase via direct commit (March 2026)
**Date:** March 5, 2026

**What it fixed:**
When the bootstrap total budget is exhausted, files like MEMORY.md, USER.md, HEARTBEAT.md were silently zero-injected (0 chars allocated) — the agent started a session with missing context and the operator had no idea.

**Incorporated in:**
- `src/agents/pi-embedded-helpers/bootstrap.ts` — zero-injection warning at lines 239, 267
- `src/agents/pi-embedded-runner/run/attempt.ts` — truncation + zero-injection summary logging

---

### 005 — Fresh Page UX (/fresh command + proactive context warnings) (RETIRED)
**File:** `patches/005-fresh-page.patch` — **DELETED**
**Status:** RETIRED — incorporated into codebase via direct commit (March 2026)
**Date:** March 8, 2026
**Origin:** felipe-ebfc's EBFC fork — construction-friendly language for session resets

**What it added:**
1. `/fresh` as an alias for `/new` — registered in command registry, core handler, get-reply, get-reply-run
2. `"fresh page"` and `"start a fresh page"` as natural language triggers
3. Session reset prompt opens with: *"Turning to a fresh page..."*
4. Proactive context fill warnings at 60/75/85% thresholds using a notebook metaphor

**Incorporated in:**
- `src/auto-reply/commands-registry.data.ts` — `/fresh` alias at lines 548, 748
- `src/config/sessions/types.ts` — `DEFAULT_RESET_TRIGGERS` includes `/fresh` at lines 378–379

---

## After Every Update Checklist

```bash
# 1. Pull latest
cd /Users/osito/openclaw-dev
git pull origin main

# 2. No patches to reapply — all fixes are in the codebase

# 3. Rebuild
pnpm install && pnpm build

# 4. Install globally
npm install -g .

# 5. Run doctor (IMPORTANT — blank screen without this!)
openclaw doctor --fix

# 6. Restart
openclaw gateway restart
```

---

## Recovery to Stable (npm)

If dev build is broken:
```bash
openclaw gateway stop
npm install -g openclaw
openclaw gateway start
```

---

## CI/CD

Automated GitHub Actions workflows live in `.github/workflows/`. They build and test on every push — and keep the fork in sync with upstream automatically.

### `patch-and-build.yml`

**Triggers:** push to `main`, pull_request, manual `workflow_dispatch`

Steps:
1. Checkout code
2. Install deps via pnpm (store cached by lockfile hash)
3. `scripts/apply-patches.sh` — skips gracefully when no patches exist
4. `pnpm build`
5. `pnpm test`

### `upstream-sync.yml`

**Triggers:** weekly schedule (Monday 06:00 UTC), manual `workflow_dispatch`

Steps:
1. Fetch `openclaw/openclaw:main`
2. Detect if fork is already up to date (skip if so)
3. Create a `upstream-sync-YYYYMMDD` branch
4. Merge upstream/main — on conflict: **opens a GitHub issue** with details, fails
5. Install deps
6. `scripts/apply-patches.sh` — skips gracefully when no patches exist
7. `pnpm build` + `pnpm test`
8. On full success: **creates a PR** for review

### `scripts/apply-patches.sh`

Standalone script used by both workflows. Can also be run locally.

```bash
# Apply all patches (from repo root):
scripts/apply-patches.sh

# Apply patches from a custom directory:
scripts/apply-patches.sh path/to/patches
```

Behavior:
- Sorts `.patch` files in the directory numerically (`001-`, `003-`, `004-`, ...)
- Exits 0 gracefully when no `.patch` files are found (nothing to do)
- Runs `git apply --check` on each patch before applying
- Continues past failures to collect the full failure list
- Prints a summary table of applied vs failed patches
- Exits 1 if any patch failed; exits 0 if all applied

---

*This file is the source of truth. If it's not here, it didn't happen.*

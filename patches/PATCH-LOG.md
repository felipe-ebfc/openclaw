# OpenClaw Patch Log

> **RULE:** Every local change to openclaw-dev gets logged here AND saved as a .patch file.  
> **After any `npm install -g openclaw` or `git pull`, reapply patches:**
> ```bash
> cd /Users/osito/openclaw-dev
> git apply patches/001-imessage-routing-fix.patch
> ```

---

## Active Patches

### 001 — iMessage Routing Leak Fix ⚠️ CRITICAL
**File:** `patches/001-imessage-routing-fix.patch`  
**Status:** ACTIVE — must be reapplied after every update  
**First patched:** ~January 2026  
**Times re-patched:** 10+ (STOP REDISCOVERING THIS)  

**What it fixes:**  
When a message arrives via iMessage and gets processed through webchat, the reply dispatcher checks `surface` metadata. Without this patch, replies intended for webchat leak back to iMessage, causing duplicate messages or messages sent to the wrong place.

**Files changed:**
- `src/auto-reply/reply/dispatch-from-config.ts` — adds guard: when Surface === originatingChannel, don't route to originating (prevents webchat→iMessage leak)
- `src/auto-reply/reply/dispatch-from-config.test.ts` — regression test with Felipe's phone number

**The actual fix (3 lines in dispatch-from-config.ts):**
```typescript
// Guard: don't route when surface matches originating channel
// This prevents webchat-initiated sessions from leaking replies back to iMessage
if (ctx.Surface === ctx.OriginatingChannel) return;
```

**To reapply:**
```bash
cd /Users/osito/openclaw-dev
git apply patches/001-imessage-routing-fix.patch
```

**To verify it's applied:**
```bash
grep -n "OriginatingChannel" src/auto-reply/reply/dispatch-from-config.ts
# Should show the guard line
```

---

### 002 — DEFAULT_CONTEXT_TOKENS 1M (RETIRED)
**Status:** RETIRED — no longer needed  
**Why:** Config-level `contextWindow: 1000000` per-model in `~/.openclaw/openclaw.json` overrides the code default. The config approach survives updates without patching.

**Was:**
```diff
- export const DEFAULT_CONTEXT_TOKENS = 200_000;
+ export const DEFAULT_CONTEXT_TOKENS = 1_000_000;
```

**Replaced by (in config):**
```json
"models": {
  "anthropic/claude-opus-4-6": { "alias": "opus", "params": { "contextWindow": 1000000 } },
  "anthropic/claude-sonnet-4-6": { "alias": "sonnet", "params": { "contextWindow": 1000000 } }
}
```

---

### 003 — Compaction Warning Visibility Fix
**File:** `patches/003-compaction-warnings.patch`
**Status:** ACTIVE — must be reapplied after every update
**Date:** March 5, 2026
**Author:** Claude Code (Opus 4.6), requested by Osito

**What it fixes:**
Model compact warnings never surfaced due to two root causes:

1. **Compaction safeguard missing-model warning** used raw `console.warn` instead of the subsystem logger, so it bypassed console-level filtering and subsystem routing. Switched both `console.warn` calls (missing model + missing API key) to `log.warn` via the existing `createSubsystemLogger("compaction-safeguard")` instance. The WeakSet dedup is preserved (once per session is fine).

2. **Context window guard** never warned when model metadata was missing because the fallback `DEFAULT_CONTEXT_TOKENS` (200k) dwarfed the 32k warn threshold. Added `shouldWarnDefaultSource` flag to `ContextWindowGuardResult` — set to `true` when `source === "default"`. The runner now emits a subsystem log warning telling the operator the model has no context window metadata and how to silence it (set `models.providers.*.models[].contextWindow` in config).

**Files changed:**
- `src/agents/pi-extensions/compaction-safeguard.ts` — `console.warn` → `log.warn` (2 occurrences)
- `src/agents/context-window-guard.ts` — added `shouldWarnDefaultSource` to guard result type + evaluation
- `src/agents/pi-embedded-runner/run.ts` — emit warning when `shouldWarnDefaultSource` is true
- `src/agents/context-window-guard.test.ts` — 3 new tests covering `shouldWarnDefaultSource` behavior

**How it was diagnosed:**
Code review traced both warning paths. The compaction safeguard used `console.warn` (line 729) instead of the subsystem `log` already declared at line 28. The context window guard's `shouldWarn` threshold (32k) could never trigger because unknown models fall back to `DEFAULT_CONTEXT_TOKENS` (200k+), which is well above the threshold — so even a model with an actual 4k context would silently get a 200k budget.

**To reapply:**
```bash
cd /Users/osito/openclaw-dev
git apply patches/003-compaction-warnings.patch
```

**To verify it's applied:**
```bash
grep -n "shouldWarnDefaultSource" src/agents/context-window-guard.ts
# Should show the flag in the type and evaluation
grep -n "log.warn" src/agents/pi-extensions/compaction-safeguard.ts | grep -i "model\|api key"
# Should show log.warn (not console.warn) for both warnings
```

---

### 004 — Bootstrap Budget Zero-Injection Warnings
**File:** `patches/004-bootstrap-budget-warnings.patch`
**Status:** ACTIVE — must be reapplied after every update
**Date:** March 5, 2026
**Author:** Claude Code (Opus 4.6), requested by Osito

**What it fixes:**
When the bootstrap total budget is exhausted, files like MEMORY.md, USER.md, HEARTBEAT.md get silently zero-injected (0 chars allocated) — the agent starts a session with missing context and the operator has no idea. Two silent scenarios existed:

1. **`remainingTotalChars <= 0`** — files after budget exhaustion were silently skipped with `break`
2. **`clampToBudget` returns empty** — file content clamped to empty string, silently `continue`d
3. **`remainingTotalChars < 64`** — existing warning fired but didn't list which files were skipped

Added a `skippedFiles` tracker that collects zero-injected file names across all three code paths, then emits a single `warn()` after the loop: `"bootstrap zero-injection: USER.md, HEARTBEAT.md received 0 chars (total budget 150000 exhausted); agent is missing this context"`.

Also added summary `log.warn` in `attempt.ts` after `analyzeBootstrapBudget` — emits truncation details and zero-injection alerts to the subsystem logger so operators see them in console/file logs.

**Files changed:**
- `src/agents/pi-embedded-helpers/bootstrap.ts` — added `skippedFiles` tracking + zero-injection warning
- `src/agents/pi-embedded-runner/run/attempt.ts` — added truncation + zero-injection summary logging
- `src/agents/pi-embedded-helpers.buildbootstrapcontextfiles.test.ts` — 3 new tests

**To reapply:**
```bash
cd /Users/osito/openclaw-dev
git apply patches/004-bootstrap-budget-warnings.patch
```

**To verify it's applied:**
```bash
grep -n "zero-injection" src/agents/pi-embedded-helpers/bootstrap.ts
# Should show the skippedFiles warning
grep -n "zero-injection\|bootstrap truncation" src/agents/pi-embedded-runner/run/attempt.ts
# Should show both log.warn calls
```

---

## After Every Update Checklist

```bash
# 1. Pull latest
cd /Users/osito/openclaw-dev
git pull origin main

# 2. Reapply active patches
git apply patches/001-imessage-routing-fix.patch
git apply patches/003-compaction-warnings.patch
git apply patches/004-bootstrap-budget-warnings.patch

# 3. Rebuild
pnpm install && pnpm build

# 4. Install globally
npm install -g .

# 5. Run doctor (IMPORTANT — blank screen without this!)
openclaw doctor --fix

# 6. Verify
grep -n "OriginatingChannel" src/auto-reply/reply/dispatch-from-config.ts
grep -n "zero-injection" src/agents/pi-embedded-helpers/bootstrap.ts

# 7. Restart
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

**⚠️ This loses ALL patches. After stabilizing, re-clone and reapply:**
```bash
cd /Users/osito/openclaw-dev
git checkout main && git pull
git apply patches/001-imessage-routing-fix.patch
git apply patches/003-compaction-warnings.patch
git apply patches/004-bootstrap-budget-warnings.patch
npm install && npm run build
# Then switch back to dev build
```

---

---

## CI/CD

Automated GitHub Actions workflows live in `.github/workflows/`. They eliminate the "lost patch" problem by applying, building, and testing patches on every push — and keeping the fork in sync with upstream automatically.

### `patch-and-build.yml`

**Triggers:** push to `main`, pull_request, manual `workflow_dispatch`

Steps:
1. Checkout code
2. Install deps via pnpm (store cached by lockfile hash)
3. `scripts/apply-patches.sh` — fails loudly if any patch doesn't apply
4. `pnpm build`
5. `pnpm test`

This is the primary safety net: every commit to the fork is verified against all patches.

### `upstream-sync.yml`

**Triggers:** weekly schedule (Monday 06:00 UTC), manual `workflow_dispatch`

Steps:
1. Fetch `openclaw/openclaw:main`
2. Detect if fork is already up to date (skip if so)
3. Create a `upstream-sync-YYYYMMDD` branch
4. Merge upstream/main — on conflict: **opens a GitHub issue** with details, fails
5. Install deps
6. `scripts/apply-patches.sh` — on conflict: **opens a GitHub issue** listing failed patches, fails
7. `pnpm build` + `pnpm test`
8. On full success: **creates a PR** for review

Issue bodies include the full patch application output and manual resolution steps.

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
- Runs `git apply --check` on each patch before applying
- Continues past failures to collect the full failure list
- Prints a summary table of applied vs failed patches
- Exits 1 if any patch failed; exits 0 if all applied

---

*This file is the source of truth. If it's not here, it didn't happen.*

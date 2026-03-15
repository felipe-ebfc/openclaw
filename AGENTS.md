# EBFC AI Platform

## What This Codebase Is

**EBFC AI** is a multi-tenant AI companion platform for construction and AEC (Architecture, Engineering, Construction) professionals. It is a hard fork of OpenClaw, currently tracking `osito-2026.3.3` (5,784 commits from upstream), containerized and adapted for managed SaaS delivery.

- **Fork base:** OpenClaw `osito-2026.3.3` (rebased March 7, 2026 from `ebfc-2026.3.3`)
- **Package version:** `ebfc-2026.3.3` (in `package.json`)
- **Backup branch:** `backup-2026.2.15` (pre-rebase state)
- **Upstream remote:** `remotes/upstream/main` (OpenClaw upstream)
- **Target audience:** AEC practitioners — estimators, project managers, field supers, subcontractor managers
- **Deployment model:** Docker container-per-user; schema-per-user isolation in Supabase pgvector
- **Inference stack:** Kimi K2.5 (Together AI) default; Claude Opus/Sonnet fallback
- **Embeddings:** nomic-embed-text via local Ollama (768-dim; no cloud cost)
- **Memory backend:** Open Brain — `brain-api.ebfc.ai`, Supabase pgvector, per-user schema
- **Pricing:** $49/mo Starter, $79/mo Pro, $745/mo Enterprise — 97% gross margin target
- **Revenue goal:** $1.28M ARR at ~1,100 users
- **Status:** Pre-GA dogfood (one user: Felipe)

This is NOT a general-purpose personal AI OS. It is a vertical SaaS product. Port decisions from upstream OpenClaw should be filtered through the AEC-user lens — macOS-native integrations (iMessage, LaunchAgent, Apple Calendar) are irrelevant in a Docker container.

Upstream OpenClaw conventions (coding style, commit format, PR process, testing, security) apply here unless overridden below.

---

## EBFC-Specific Changes (What This Fork Actually Adds)

Only two commits sit on top of upstream `osito-2026.3.3`. Everything else is inherited.

### Commit `cf110da` — memorySearch + health monitor + Ollama service
- `agents.defaults.memorySearch.provider`: `local` → `ollama`
  - Eliminates ggml-metal ASSERT crash on shutdown from node-llama-cpp Metal GPU cleanup
- `gateway.channelHealthCheckMinutes`: `30` → `60`
  - Reduces false-positive stale-socket restarts on low-traffic channels
- `docker-compose.yml`: Added `ollama` service + `ollama-data` volume
  - Gateway reaches embeddings at `http://ollama:11434` via `models.providers.ollama.baseUrl`

### Commit `b0bd1ee` — Rebase + COMPETITIVE-ANALYSIS.md
- Full source sync from `osito-2026.3.3` (5,784 upstream commits)
- Includes 3 patches from upstream: iMessage routing, compaction warnings, bootstrap budget
- Added `COMPETITIVE-ANALYSIS.md` (Sarah's 3-way analysis)
- Added `CLAUDE.md` and `AGENTS.md` with EBFC platform context

---

## What Is NOT Yet Built (Pre-GA Gaps)

The March 2 CLAUDE.md listed several items as "Already Done" that do not yet exist in the codebase. These are planned but unimplemented:

| Item | Status |
|------|--------|
| Voice pipeline (Dockerfile.voice, speak.py, voice-api.py) | **Not implemented** — planned port of OpenClaw's Kokoro+Whisper |
| Cold-start seeder (templates/cold-start-seed.py) | **Not implemented** — planned Open Brain onboarding flow |
| AEC skill pack (extensions/ebfc-aec/) | **Not implemented** — no directory exists yet |
| Telegram wired to production | **Not implemented** — upstream channel scaffold exists but not production-connected |

Model routing (Kimi K2.5 default, Opus/Sonnet fallback) and heartbeat are upstream OpenClaw features, not EBFC additions.

---

## Docker Architecture

### docker-compose.yml (three services)

```
openclaw-gateway    — Node 22; serves webchat UI + gateway API on :18789/:18790
                      Volumes: OPENCLAW_CONFIG_DIR, OPENCLAW_WORKSPACE_DIR
                      Health check: GET /healthz every 30s
openclaw-cli        — Same image; network_mode="service:openclaw-gateway"
                      Interactive CLI; depends_on openclaw-gateway
ollama              — ollama/ollama:latest; persists models in ollama-data volume
                      Reachable at http://ollama:11434 (internal compose network)
                      Pull embedding model: docker compose exec ollama ollama pull nomic-embed-text
```

### Dockerfile (main image)

- Base: `node:22-bookworm` (pinned digest)
- Bun installed for build scripts; pnpm via corepack
- Build args: `OPENCLAW_INSTALL_BROWSER=1` (+300MB Chromium+Xvfb), `OPENCLAW_INSTALL_DOCKER_CLI=1` (+50MB Docker CLI for sandbox)
- Runs as non-root user `node` (uid 1000)
- Entrypoint: `node openclaw.mjs gateway --allow-unconfigured`
- Health check: `GET /healthz` every 3 minutes

### Render.com deployment (render.yaml)

Docker runtime, starter plan, `/health` check, 1GB persistent disk at `/data`, auto-generated gateway token.

---

## Competitive Landscape

Three products in the competitive frame (Sarah's analysis, March 4, 2026):

| | EBFC AI | OpenClaw 2026.2.15 | Accomplish.ai |
|---|---|---|---|
| Multi-tenant | Yes | No | No |
| Vector memory | Yes (pgvector) | No (file-based) | No |
| Voice | Gap | Yes (Kokoro+Whisper) | No |
| Multi-channel | Gap (webchat only) | 6+ channels | No |
| Mobile/nodes | Gap | Yes (iPhone pairing) | No |
| AEC skills | Gap | N/A | No |
| Windows | Yes (browser) | No | Yes (native) |
| Cost to user | $49-745/mo | ~$20-50/mo | $0 (BYOK) |
| Open source | No | No | Yes (MIT) |

**EBFC's moat:** vector memory + multi-tenancy + AEC vertical focus + managed SaaS (no setup burden).

**OpenClaw** is the benchmark for feature depth (30+ skills, Apple ecosystem, voice, multi-channel, node pairing). We port, not reinvent.

**Accomplish.ai** is the OSS threat (~9,600 GitHub stars in 5 weeks, MIT license, BYOK). Beat it on memory ("Accomplish remembers nothing; EBFC knows your business") and managed hosting. Watch its Notion/Google Drive/scheduling roadmap.

See `COMPETITIVE-ANALYSIS.md` for the full 3-way breakdown.

---

## Pre-GA Gaps — Prioritized

### P1 — Blockers for any beta user beyond Felipe

**1. End-to-end dogfood sprint**
- Container runs but no structured end-to-end test has been completed.
- Run all core workflows (memory store/search, skill execution, browser automation, auth) against a real task session before onboarding beta user 2.
- Success criterion: every core flow completes without manual intervention.

**2. Telegram channel — wire to production**
- Upstream channel scaffold exists (grammy, plugin-sdk/telegram); not production-wired for EBFC.
- Connect bot token, route messages through the container channel layer, validate on iOS and Android.
- AEC users are field-mobile. Webchat-only = desk-only.

### P2 — Needed before wide beta

**3. Voice pipeline**
- Port OpenClaw's Kokoro TTS (`af_heart`, 1.3x speed) + Whisper STT (`ggml-small`) into the container.
- Add `Dockerfile.voice`, `speak.py`, `voice-api.py` (follow OpenClaw's implementation).
- No cloud voice APIs — voice must stay local for cost and privacy.

**4. Cold-start seeder**
- New users start with empty Open Brain memory. First session should seed: name, role, company, active projects, preferences.
- Implement `templates/cold-start-seed.py` that calls `brain-api.ebfc.ai/store` with onboarding context.
- Memory must be warm from session 1.

**5. AEC skill pack (5-10 skills)**
Build in this order — each deepens lock-in. Lives in `extensions/ebfc-aec/` (isolated from root `package.json`):
- `rfi-generator` — draft Requests for Information from project descriptions
- `meeting-minutes` — extract action items from meeting notes into Open Brain
- `subcontractor-tracker` — track subs, contacts, payment status via memory
- `safety-checklist` — OSHA-aligned job site safety review (daily prompt)
- `estimate-assistant` — labor and material estimate scaffolding
- `project-loader` — seed project context into memory at project start

**6. Enterprise review mode**
- Inherited autonomous action model has no approval gates.
- Implement optional `review_mode=true` per-user config; show all actions before execution.
- Default: on for Enterprise tier, off for Starter/Pro.
- Construction companies will not pay $745/mo for AI acting autonomously without gates.

### P3 — Before GA, not blocking beta

**7. Documentation and onboarding UX**
- Quick-start guide (AEC-specific), in-app help, onboarding checklist.
- AEC practitioners are not developers — keep all copy non-technical.

**8. Kimi K2.5 AEC benchmarks**
- Run the default model against: RFI drafting, estimate scaffolding, technical doc summarization.
- If it underperforms, consider Claude Sonnet as default tier.

### Long-horizon watch items

- **Node pairing / mobile companion** — AEC users are mobile-first; companion must reach them in the field
- **Accomplish's integration roadmap** — Notion, Google Drive, scheduling will land in their 0.x cycle
- **Upstream OpenClaw cherry-picks** — track `upstream/main` for skill improvements, memory primitives, MCP updates; port selectively
- **Supabase cost at scale** — validate pgvector costs at 1,100+ users against the 97% margin target

---

## Architecture Decisions

### Container-per-user
Each user runs in an isolated Docker container. Supabase schema isolation (`schema = user_{id}`) is the second isolation layer for memory data. Every new memory write must be scoped to `user_{id}`. No cross-user memory queries, ever.

### Open Brain (memory API)
- Endpoint: `brain-api.ebfc.ai`
- Operations: `store`, `search` (semantic), `recent`, `stats`, `health`
- Embedding: nomic-embed-text via Ollama (768-dim) — served by the `ollama` compose service
- All memory writes go through the API; never write directly to pgvector tables
- memorySearch provider is `ollama` (not `local`) — avoids node-llama-cpp Metal GPU crash on shutdown

### Model routing
- Tier 1 (default): Kimi K2.5 via Together AI — $0.50/$2.80 per 1M tokens
- Tier 2 (fallback): Claude Opus 4-6 — triggered on complexity threshold or explicit skill request
- Tier 3 (fast/cheap): Claude Sonnet 4-6 — for low-stakes tasks
- Do not change routing thresholds without benchmarking cost impact against the 97% margin target

### Channels
- **Active (beta):** webchat
- **Wired but not production-connected for EBFC:** Telegram (upstream scaffold available via grammy/plugin-sdk)
- **Deferred post-GA:** iMessage (macOS-specific), WhatsApp
- Do not port Discord or Signal unless explicitly requested — not relevant for AEC vertical

### Voice pipeline (planned, not implemented)
- TTS: Kokoro (`af_heart` voice, 1.3x speed) — must run inside container
- STT: Whisper CLI (`ggml-small`) — must run inside container
- No cloud voice APIs; voice must stay local for cost and privacy

### Extensions
- AEC skills: `extensions/ebfc-aec/` (workspace package, isolated deps) — **does not exist yet**
- Do not add AEC-specific deps to root `package.json`
- Upstream OpenClaw extensions (open-prose, tlon, zalo, discord, etc.) are inherited — curate which are exposed per AEC persona

---

## Build Instructions

```bash
# Install dependencies
pnpm install

# Type-check
pnpm tsgo

# Build
pnpm build

# Lint + format check
pnpm check

# Format fix
pnpm format:fix

# Run tests
pnpm test

# Low-memory test profile (non-Mac-Studio hosts)
OPENCLAW_TEST_PROFILE=low OPENCLAW_TEST_SERIAL_GATEWAY=1 pnpm test

# Run CLI in dev
pnpm openclaw ...
```

### Container

```bash
# Build image
docker build -t ebfc-ai .

# Run with compose (gateway + CLI + Ollama)
docker compose up

# Pull embedding model on first start
docker compose exec ollama ollama pull nomic-embed-text

# Run single-user container (dev, no compose)
docker run --rm -e USER_ID=felipe -p 18789:18789 ebfc-ai
```

### Optional build args

```bash
# Include Chromium + Xvfb for browser automation (~+300MB)
docker build --build-arg OPENCLAW_INSTALL_BROWSER=1 -t ebfc-ai .

# Include Docker CLI for sandbox isolation (~+50MB)
docker build --build-arg OPENCLAW_INSTALL_DOCKER_CLI=1 -t ebfc-ai .
```

### Key scripts
- `scripts/committer "<msg>" <file...>` — scoped commits (use instead of raw `git add`/`git commit`)
- Runtime baseline: Node 22+; prefer Bun for TypeScript execution (`bun <file.ts>`, `bunx <tool>`)
- Package manager: pnpm 10.23.0 (keep `pnpm-lock.yaml` in sync)

---

## Upstream Sync

```bash
# Fetch upstream changes
git fetch upstream

# See what upstream has that EBFC doesn't
git log HEAD..upstream/main --oneline

# Cherry-pick a specific upstream fix
git cherry-pick <sha>
```

The two EBFC-specific commits (`cf110da`, `b0bd1ee`) sit on top of the upstream tree. When rebasing onto a newer upstream tag, preserve these commits and re-apply the config diffs (memorySearch=ollama, channelHealthCheckMinutes=60).

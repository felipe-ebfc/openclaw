# EBFC AI Platform vs OpenClaw 2026.2.15 vs Accomplish.ai
## 3-Way Competitive Analysis

**Author:** Sarah — Content & Strategy Lead, Changemakers  
**Date:** March 4, 2026  
**Purpose:** Strategic decision-making for EBFC AI Platform GA readiness  
**Classification:** Internal — Felipe Eyes Only

---

## Section 1: Executive Summary

### EBFC AI Platform *(Dogfood — March 4, 2026)*
EBFC AI is Felipe's purpose-built, multi-tenant AI companion platform targeting construction and AEC industry professionals. Built on a forked and containerized OpenClaw architecture, it introduces per-user vector memory (Open Brain via Supabase pgvector), schema-level data isolation, and a "companion, not tool" philosophy designed for deep personal context accumulation over time. Currently in pre-GA dogfood state with one user (Felipe), it is positioned as a vertical SaaS product at $49–$745/mo with a 97% gross margin target via owned inference hardware.

### OpenClaw 2026.2.15 *(Felipe's Personal Instance — Production)*
OpenClaw is the upstream platform EBFC AI is forked from — a single-user, deeply integrated personal AI OS running as a local LaunchAgent on a Mac Mini. It is the most mature and capable configuration in this analysis, with 30+ skills, full Apple ecosystem integration (iMessage, Calendar, Reminders, Email), voice (Kokoro TTS + Whisper STT), node pairing, and multi-channel messaging. It represents what EBFC AI could become for a power user — but it is not multi-tenant and requires hands-on configuration. This is the benchmark EBFC AI must close the gap against.

### Accomplish.ai *(v0.3.8 — Open Source, February 2026)*
Accomplish (formerly Openwork) is a MIT-licensed, open-source desktop AI agent built in a 2-day hackathon that went viral and directly forced Anthropic to reprice Claude Cowork within days of launch. Running entirely locally via Electron, it supports 14+ AI providers (including Ollama for fully offline operation), requires zero subscription cost (BYOK model), and has genuine no-telemetry privacy guarantees verifiable by source code. At ~9,600 GitHub stars in five weeks, it is the fastest-growing competitor in this space. Its primary gaps are integration maturity and the absence of persistent memory / companion intelligence.

---

## Section 2: Detailed Feature Comparison

### 2.1 Architecture

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Deployment model** | Multi-tenant SaaS | Single-user, self-hosted | Single-user, self-hosted |
| **Runtime** | Docker container per user | LaunchAgent (macOS daemon) | Electron desktop app |
| **Tenancy** | One isolated container per user | Single user only | Single user only |
| **Hosting** | Mac Mini (beta) → hybrid cloud (GA) | Mac Mini, local | User's own machine |
| **Data isolation** | Schema-per-user in Supabase | N/A (single user) | N/A (single user) |
| **Cloud dependency** | Partial (Supabase + Together AI) | Partial (Anthropic API) | Optional (BYOK — can go fully local) |
| **Forked from** | OpenClaw | OpenClaw (original) | Independent (built on OpenCode CLI) |
| **Scalability model** | Horizontal (new container per user) | Not applicable | Not applicable |
| **Auth** | Token per container | N/A | API key per provider (OS keychain) |
| **OS requirement** | Any (containerized) | macOS only | macOS, Windows |

---

### 2.2 AI Models

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Default model** | Kimi K2.5 (Together AI) | Claude Opus 4-6 (Anthropic) | User's choice (any configured provider) |
| **Fallback models** | Claude Opus, Claude Sonnet | N/A (single provider primary) | Any of 14+ providers |
| **Local model support** | Yes — Ollama (embeddings + inference) | Yes — Ollama (qwen3:0.6b, gemma2:2b, qwen2.5-coder:7b) | Yes — Ollama, LM Studio |
| **Cloud providers** | Together AI, Anthropic | Anthropic, Together AI | OpenAI, Anthropic, Google, xAI, DeepSeek, Moonshot, Z.AI, MiniMax, AWS Bedrock, Azure, OpenRouter, LiteLLM |
| **Model switching** | Automatic (tier-based routing) | Manual (`/model` command) | Manual (settings per task) |
| **Cost structure** | $0.50/$2.80 per 1M tokens (Kimi); Opus as fallback | Anthropic subscription + API costs | User pays their own API costs; free with local models |
| **Cost optimization** | 97% gross margin via owned hardware | Cost passed to user | BYOK eliminates platform cost entirely |
| **Inference sovereignty** | Partial (cloud fallback for Opus) | Partial | Full (can run 100% local) |

---

### 2.3 Memory & Context

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Long-term memory type** | Vector DB (pgvector, 768-dim) | File-based (MEMORY.md + daily notes) | None (session-only context) |
| **Embedding model** | nomic-embed-text via Ollama (local) | N/A | N/A |
| **Memory backend** | Supabase pgvector, schema-per-user | Local markdown files | None persistent |
| **Memory API** | brain-api.ebfc.ai (store, search, recent, stats, health) | None (file read/write) | None |
| **Context window** | Inherited from model (Kimi K2.5) | 1M token window (Opus) | Inherited from configured model |
| **Cross-session persistence** | ✅ Full (vector recall across sessions) | ✅ Full (file-based, daily notes) | ❌ None (must re-establish context each session) |
| **Memory search** | Semantic (vector similarity) | Full-text (grep / file read) | N/A |
| **Memory growth** | Automatic (stores interactions) | Manual (user writes/agent writes to notes) | N/A |
| **Memory isolation** | Per-user schema (no cross-leakage) | Single user (no isolation needed) | Local filesystem (full isolation by design) |
| **Companion intelligence** | ✅ Core design philosophy — learns over time | ✅ Deep — daily notes capture rich context | ❌ No persistent learning |

---

### 2.4 Interface & Channels

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Webchat** | ✅ (beta interface) | ✅ | ✅ (Electron app UI) |
| **Web lite version** | ❌ | ❌ | ✅ (lite.accomplish.ai) |
| **iMessage** | ❌ (deferred post-beta) | ✅ | ❌ |
| **Telegram** | ❌ (deferred post-beta) | ✅ | ❌ |
| **WhatsApp** | ❌ (deferred post-beta) | ✅ (configurable) | ❌ |
| **Discord** | ❌ | ✅ (configurable) | ❌ |
| **Signal** | ❌ | ✅ (configurable) | ❌ |
| **Email integration** | ❌ | ✅ (Apple Mail via mailctl.sh) | ❌ |
| **Multi-channel** | Single channel (webchat, beta) | 6+ configurable channels | 1 (desktop app only) |
| **Channel expansion plan** | iMessage, Telegram, WhatsApp (post-GA) | Already multi-channel | Not on roadmap |

---

### 2.5 File & Document Management

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **File read/write** | ✅ (workspace per user, Docker volume) | ✅ (full local filesystem) | ✅ |
| **File organization** | ✅ (inherited from OpenClaw) | ✅ | ✅ (core feature — sort, rename, move by rule) |
| **Document creation** | ✅ | ✅ | ✅ (drafts, summaries, rewrites) |
| **Folder access control** | Container-scoped | OS-level | Granular explicit grants by user |
| **Cloud storage** | ❌ | ❌ (local only) | ❌ (Notion, Google Drive, Dropbox — roadmap) |
| **MarkItDown / file conversion** | Not confirmed | ✅ (markitdown, pandoc) | Not confirmed |
| **User isolation** | ✅ (volume per container) | N/A | N/A (single user) |

---

### 2.6 Browser Automation

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Browser automation** | ✅ (inherited from OpenClaw) | ✅ (Chrome profile + managed browser) | ✅ |
| **Automation framework** | OpenClaw browser tool | Playwright via OpenClaw | OpenCode CLI + Playwright |
| **Chrome extension relay** | Inherited capability | ✅ (Browser Relay) | ❌ |
| **Google Docs/Figma support** | Inherited | ✅ | ✅ (agent-core v0.3.2+) |
| **Action approval** | Not specified | Silent (agent acts) | ✅ (requires explicit approval before each action) |
| **Headless/managed browser** | ✅ (inherited) | ✅ | ✅ |

---

### 2.7 Sub-agents / Multi-agent

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Sub-agent support** | ✅ (inherited OpenClaw — Changemakers team) | ✅ (sessions_spawn with model override) | ❌ (single agent only) |
| **Named agent personas** | ✅ (Ed, Sarah, Vega, etc.) | ✅ (same Changemakers team) | ❌ |
| **Parallel agent execution** | ✅ | ✅ | ❌ |
| **Agent orchestration** | Inherited | ✅ (full — push-based completion) | ❌ |
| **Cloud agent integration** | ❌ | ✅ (Claude Code Cowork, ChatGPT via browser) | ❌ |
| **Agent memory sharing** | Via shared Supabase schema (within user) | Via shared files | N/A |

---

### 2.8 Skills / Plugins / Integrations

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Skill system** | ✅ (OpenClaw inherited, curated per persona) | ✅ (30+ skills installed) | ✅ (Skills tab — v0.3.8+, growing) |
| **MCP support** | Inherited | ✅ | ✅ (auto-detected MCP servers) |
| **Apple ecosystem** | ❌ (no macOS-specific integrations in container) | ✅ (Calendar, Reminders, Mail, iMessage, AppleScript) | ❌ |
| **Trello** | ❌ | ✅ (custom trello.sh script) | ❌ |
| **Notion** | ❌ | ❌ | 🔜 (roadmap) |
| **Google Drive** | ❌ | ❌ | 🔜 (roadmap) |
| **Dropbox** | ❌ | ❌ | 🔜 (roadmap) |
| **GitHub** | ❌ | ✅ (via Claude Code MCP) | ❌ |
| **Image generation** | ❌ | ✅ (Nano Banana / Imagen 4) | ❌ |
| **Custom skills** | Via OpenClaw skill files | ✅ (full custom skill authoring) | ✅ (in progress) |
| **Skill breadth** | Moderate (curated subset) | High (30+ mature skills) | Low (early stage) |

---

### 2.9 Scheduling & Automation

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Cron jobs** | ✅ (inherited from OpenClaw) | ✅ (full cron support) | 🔜 (planned — not yet available) |
| **Heartbeat system** | ✅ (inherited) | ✅ (HEARTBEAT.md, background tasks) | ❌ |
| **Reminders / triggers** | ✅ (inherited) | ✅ (Apple Reminders via remindctl) | 🔜 (planned) |
| **Background task execution** | ✅ | ✅ | ❌ |
| **Proactive behavior** | ✅ (design intent) | ✅ (proactive actions, daily OS flow) | ❌ (reactive only) |
| **Event-driven triggers** | ✅ (inherited) | ✅ | 🔜 (roadmap) |

---

### 2.10 Privacy & Security

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Data locality** | Partial (Supabase cloud + local inference) | Full local (files never leave machine) | Full local (verifiable via OSS) |
| **Telemetry** | Not specified | None | ✅ None (verified by source code) |
| **API key handling** | Token per container | Local config | OS keychain (most secure) |
| **Multi-user isolation** | ✅ Schema-per-user (Supabase) | N/A | N/A |
| **User data sharing risk** | Low (isolated schemas) | None (single user) | None (local only) |
| **Auditability** | Not public | N/A (private instance) | ✅ Full (MIT OSS, action logs, approval flow) |
| **Action approval gates** | Not specified | No (agent acts autonomously) | ✅ (required before every action) |
| **Memory security** | pgvector with schema isolation | Local file permissions | N/A (no persistent memory) |
| **Backup / disaster recovery** | Supabase (cloud-backed) | Manual (local files) | None built-in |

---

### 2.11 Voice

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **TTS** | ❌ (not confirmed for beta) | ✅ Kokoro (local, af_heart voice) | ❌ |
| **STT** | ❌ (not confirmed for beta) | ✅ Whisper CLI (local, ggml-small) | ❌ |
| **Voice pipeline** | Deferred | Fully local (no cloud APIs) | Not on roadmap |
| **Voice persona** | N/A | af_heart @ 1.3x speed | N/A |

---

### 2.12 Mobile / Node Pairing

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Node pairing** | ❌ (planned post-beta) | ✅ (iPhone + other devices) | ❌ |
| **Mobile companion** | 🔜 (planned — mobile companion roadmap item) | ✅ (via node pairing) | ❌ |
| **Camera access (mobile)** | ❌ | ✅ (via node pairing) | ❌ |
| **Screen sharing (node)** | ❌ | ✅ (screen_record via nodes) | ❌ |
| **Location awareness** | ❌ | ✅ (location_get via nodes) | ❌ |
| **Push notifications** | ❌ | ✅ (via nodes/notify) | ❌ |

---

### 2.13 Pricing & Cost Model

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Pricing model** | Subscription SaaS | Self-hosted (no license cost) | Free (BYOK) |
| **Starter tier** | $49/mo | N/A | $0 |
| **Pro tier** | $79/mo | N/A | $0 |
| **Enterprise tier** | $745/mo | N/A | $0 (self-hosted) |
| **Inference cost to user** | Included in subscription | Paid by user (Anthropic sub + API) | Paid by user (provider API) or $0 (local) |
| **Platform cost (operator)** | 97% gross margin target | N/A | N/A |
| **Revenue target** | $1.28M ARR @ 1,100 users | N/A | N/A |
| **License** | Proprietary (forked OpenClaw) | Proprietary | MIT open source |
| **Free tier** | ❌ | N/A | ✅ (entire product is free) |
| **Cost floor for user** | $49/mo | ~$20–$50/mo (API costs) | $0 (with local models) |

---

### 2.14 Platform Availability

| Platform | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|----------|-----------------|-------------------|---------------|
| **macOS (Apple Silicon)** | ✅ (via browser/webchat) | ✅ (native) | ✅ |
| **macOS (Intel)** | ✅ (via browser/webchat) | ✅ (native) | ✅ |
| **Windows** | ✅ (browser-based) | ❌ | ✅ |
| **Linux** | ✅ (browser-based) | ❌ | ❌ (not confirmed) |
| **iOS/Android** | ❌ (planned) | Partial (via iMessage channel) | ❌ |
| **Web (browser-only)** | ✅ (primary interface) | ✅ (webchat) | ✅ (lite.accomplish.ai) |
| **Platform-agnostic** | ✅ (Docker = any host) | ❌ (macOS-specific) | ❌ (desktop app) |

---

### 2.15 Maturity & Community

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Versioning** | Pre-GA (dogfood) | 2026.2.15 (production) | v0.3.8 (0.x = early) |
| **Stability** | Untested end-to-end | Stable (daily production use) | Active but 0.x — breaking changes expected |
| **Community** | Private (Felipe + ~10 beta users) | Private (single user) | 9,600+ GitHub stars, 31 contributors, 1,000+ forks |
| **Open source** | ❌ | ❌ | ✅ MIT |
| **Documentation** | Minimal (beta) | Rich (internal — AGENTS.md, TOOLS.md, etc.) | Developing (CONTRIBUTING.md, CLAUDE.md) |
| **Release cadence** | Irregular (dogfood) | Continuous (daily use) | Multiple releases/week (Feb 2026) |
| **Ecosystem health** | Nascent | Mature (for single user) | Rapidly growing |
| **Market validation** | None yet (pre-launch) | Personal validation only | Forced Anthropic pricing change — strong signal |

---

### 2.16 Target Audience

| Dimension | EBFC AI Platform | OpenClaw 2026.2.15 | Accomplish.ai |
|-----------|-----------------|-------------------|---------------|
| **Primary audience** | Construction & AEC professionals | Felipe (personal OS) | Developers, knowledge workers, tech-savvy individuals |
| **Industry vertical** | AEC (Architecture, Engineering, Construction) | N/A (personal) | Horizontal (any) |
| **Technical skill required** | Low (managed SaaS) | High (self-hosted, config-heavy) | Medium (install + BYOK setup) |
| **Use case orientation** | Companion / persistent context / industry tasks | Deep personal productivity OS | Desktop automation, file management, research |
| **Setup burden** | Low for user (managed) | High (Felipe manages everything) | Medium (DMG install + API key config) |
| **Multi-user by design** | ✅ (SaaS from day 1) | ❌ | ❌ |

---

## Section 3: Strategic Analysis

### 3.1 Where EBFC AI Has Unique Advantages

#### ✅ True Vector Memory — The Companion Moat
EBFC AI is the **only product in this comparison with structured, semantic, persistent memory**. Open Brain (pgvector via Supabase) gives each user a personal knowledge store that grows over time, can be searched semantically, and enables the "companion, not tool" positioning. Neither OpenClaw personal edition (file-based only) nor Accomplish (session-only) offers this. This is the most defensible differentiator and the hardest for competitors to replicate quickly.

#### ✅ Multi-Tenant Architecture
EBFC AI is the only product designed to serve multiple users simultaneously. Docker container-per-user + schema-per-user isolation means it can scale to thousands of users while maintaining data privacy — a fundamental architectural advantage for a SaaS business. OpenClaw is architecturally single-user; Accomplish is architecturally single-user. EBFC wins here by design.

#### ✅ Industry Vertical Focus (AEC)
Construction practitioners are an underserved market for AI companions. Generic tools like Accomplish serve all knowledge workers; OpenClaw is a personal OS. EBFC AI can build AEC-specific skills, workflows, and memory structures that deeply embed it into how construction professionals work — estimating, RFIs, project timelines, subcontractor management. Vertical specialization = stickiness.

#### ✅ Cost Structure for the Operator
97% gross margin (via owned Mac Mini hardware + local Ollama embeddings + cheap Kimi K2.5 inference) means EBFC AI can price competitively ($49/mo) while maintaining strong unit economics. This beats what a self-hosted OpenClaw user pays (Anthropic subscription alone is $20–$200/mo) and creates a sustainable business model.

#### ✅ Platform-Agnostic by Architecture
Because EBFC AI is browser-based (Docker container), it works on any OS — Mac, Windows, Linux, iOS, Android. OpenClaw requires macOS. This is a meaningful advantage for AEC users who may be on Windows (common in construction office environments).

---

### 3.2 Where OpenClaw Personal Edition Is Stronger

#### ✅ Integration Depth (Apple Ecosystem)
OpenClaw's integration with the Apple ecosystem is unmatched: iMessage, Calendar, Reminders, Apple Mail, Contacts, AppleScript automation, iPhone node pairing with camera/screen/location access. These integrations represent months of accumulated configuration work. EBFC AI inherits the OpenClaw skill framework but cannot replicate macOS-native integrations in a Docker container running for AEC users on Windows.

#### ✅ Multi-Channel Messaging
OpenClaw serves webchat, iMessage, Telegram, WhatsApp, Discord, Signal — simultaneously. EBFC AI is webchat-only in beta, with iMessage/Telegram deferred. For users who want their AI companion in the channel they already use, OpenClaw wins.

#### ✅ Voice Pipeline
Kokoro TTS + Whisper STT running entirely locally is a sophisticated, production-quality voice stack. EBFC AI has no voice capability confirmed for beta. Voice is increasingly expected in AI companions.

#### ✅ Node Pairing & Mobile
OpenClaw's node pairing with iPhone (camera, screen, location, push notifications) makes it a truly ambient computing companion — present across devices. EBFC AI has this on the roadmap but not in beta.

#### ✅ Production Maturity
OpenClaw has been running in daily production for Felipe for months. Every skill, integration, and workflow has been dogfooded and refined. EBFC AI hasn't completed a single end-to-end test yet. The gap in maturity is significant.

#### ✅ Sub-agent Sophistication
While EBFC AI inherits sub-agents, OpenClaw's Changemakers team (Ed, Sarah, Vega) with model override, parallel execution, and cloud agent integration (Claude Code Cowork, ChatGPT via browser) represents a more refined orchestration system than EBFC's beta state.

---

### 3.3 Where Accomplish Is Stronger

#### ✅ Zero Cost for Users
The BYOK model means Accomplish is genuinely free to use (pay only for API calls, or nothing with local models). At $49/mo minimum, EBFC AI faces an uphill battle against "free." However, this is only a problem if Accomplish serves the same audience — and it doesn't. Accomplish targets developers; EBFC targets AEC practitioners. Still, "free" is a powerful market signal.

#### ✅ Model Flexibility (14+ Providers)
Accomplish's support for OpenAI, Anthropic, Google, xAI, DeepSeek, Moonshot, AWS Bedrock, Azure, OpenRouter, LiteLLM, Ollama, LM Studio, and more is unrivaled. Users can pick the best model for each task and swap without friction. EBFC AI locks users into Kimi K2.5 + Opus/Sonnet fallback (reasonable for AEC, but not maximally flexible).

#### ✅ Open Source Trust Signal
MIT license + auditable source code means Accomplish's privacy claims are verifiable. Construction companies dealing with sensitive project data may actually trust an auditable open-source tool more than a closed-source SaaS. This is a meaningful trust signal EBFC must overcome with reputation and track record.

#### ✅ Action Approval Gates
Accomplish requires explicit user approval before every action. While this creates friction, it builds user trust — especially for enterprise clients nervous about AI acting autonomously. EBFC AI should consider an optional "review mode" for enterprise clients.

#### ✅ Windows Support
Accomplish runs natively on Windows 11. This matters enormously in AEC, where Windows dominates office environments. EBFC AI's Docker/browser architecture gives it Windows compatibility, but Accomplish's native desktop app may feel more polished.

#### ✅ Community Momentum
9,600+ stars, 31 contributors, 1,000+ forks in 5 weeks. The open-source community will add integrations, fix bugs, and extend capabilities at a pace EBFC AI cannot match with a small team. Watch the roadmap: Notion, Google Drive, Dropbox, and scheduling features will close gaps fast.

---

### 3.4 Key Gaps EBFC AI Must Close Before GA

These are listed in priority order:

#### 🔴 Gap 1: End-to-End Testing (CRITICAL)
**Current state:** Container running, User 1 (Felipe) ready — but not yet tested end-to-end.  
**Risk:** Unknown failure modes in memory store/search, auth, browser automation, and skill execution within the containerized environment.  
**Action:** Complete a structured dogfood sprint covering all core workflows before onboarding even 2 beta users.

#### 🔴 Gap 2: Voice Capability
**Current state:** No TTS/STT confirmed for beta.  
**Risk:** Users expect voice in 2026. A "companion" without voice feels incomplete, especially for AEC users who may be on job sites or in the field.  
**Action:** Port OpenClaw's Kokoro + Whisper stack into the container. This is inherited architecture — the gap is configuration, not invention.

#### 🔴 Gap 3: Mobile / Multi-Channel Access
**Current state:** Webchat only. iMessage/Telegram deferred.  
**Risk:** AEC professionals are not desk-bound. A companion that's only accessible via browser is not a companion on a job site.  
**Action:** Prioritize at least Telegram (multi-platform, works on mobile) for beta 2. Defer iMessage (macOS-specific, complex). WhatsApp for international AEC markets.

#### 🟡 Gap 4: AEC-Specific Skills and Memory Schemas
**Current state:** Generic OpenClaw skills inherited, no AEC-specific customization confirmed.  
**Risk:** Generic AI tools don't create switching costs. Industry-specific skills do.  
**Action:** Build AEC skill pack: RFI tracking, project estimating, subcontractor management, safety checklist automation, meeting minutes → action items.

#### 🟡 Gap 5: Action Transparency / Review Mode
**Current state:** Inherited OpenClaw autonomous action model (no approval gates).  
**Risk:** Enterprise construction clients may be uncomfortable with autonomous AI actions on business-critical files and systems.  
**Action:** Implement an optional "review mode" where all actions are shown before execution (à la Accomplish). Offer it as a default-on for Enterprise tier.

#### 🟡 Gap 6: Documentation and Onboarding
**Current state:** Beta, minimal docs.  
**Risk:** AEC practitioners are not developers. They need clear setup, training, and support materials.  
**Action:** Build user onboarding flow, a quick-start guide specific to AEC use cases, and an in-app help system before GA.

#### 🟢 Gap 7: Cold Start Problem (Empty Memory)
**Current state:** Open Brain is the differentiator, but new users start with empty memory.  
**Risk:** The companion is weakest when users are newest. First impressions matter.  
**Action:** Design an onboarding flow that seeds the memory with user context (role, company, active projects, preferences) during setup — make memory "warm" from day 1.

---

## Section 4: Recommendations

*What Felipe should prioritize to make EBFC AI competitive — ordered by impact.*

---

### Priority 1: Dogfood Ruthlessly (Next 2–4 Weeks)
Before anything else — **use EBFC AI as your primary work tool for 2 weeks**. Not alongside OpenClaw. Instead of it. This is the fastest way to discover the gaps that matter. Document every friction point, every failure, every "I wish this worked like OpenClaw." Those friction points are the GA blocklist.

> *"You can't know what's broken until you depend on it."*

---

### Priority 2: Ship Voice (High Impact, Low Lift)
Voice is already solved in OpenClaw (Kokoro + Whisper). Containerize it. This transforms EBFC AI from a chat tool into a companion. For AEC professionals on job sites, voice is the difference between "cool demo" and "daily habit." Do this before beta 2.

---

### Priority 3: Add Telegram Channel (Mobile Gateway)
Telegram works on iOS, Android, Windows, Mac — it's the easiest cross-platform messaging channel to implement. Adding Telegram support (inherited from OpenClaw's architecture) gives EBFC AI mobile reach without native app development. AEC users can text their companion from a job site. This directly competes with the "webchat only" limitation.

---

### Priority 4: Build the AEC Skill Pack
This is the moat-deepening move. Generic AI is a commodity. Construction-specific intelligence is not. Build 5–10 AEC skills:
- **RFI Generator** — Draft Requests for Information from project descriptions
- **Meeting Minutes → Actions** — Extract action items from meeting notes, store in memory
- **Subcontractor Tracker** — Track subs, contacts, payment status via memory
- **Daily Safety Checklist** — OSHA-aligned job site safety review
- **Estimate Assistant** — Labor and material estimate scaffolding
- **Project Context Loader** — Seed project details into memory at project start

These skills turn EBFC AI from "OpenClaw for construction" into "the AI that knows your projects."

---

### Priority 5: Design the Cold-Start Onboarding Flow
New users start with empty memory. The first session should be an onboarding conversation that collects:
- Name, role, company
- Current active projects (name, phase, key parties)
- Communication preferences
- Common tasks they want help with

Store all of this in Open Brain. The companion should "know" the user from the first real session — not after weeks of accumulated context.

---

### Priority 6: Enterprise Review Mode
Before targeting Enterprise tier ($745/mo), implement an optional action approval mode. Construction companies won't pay enterprise pricing for AI that acts autonomously on their files and systems without review gates. Make it configurable: Power users get autonomous mode; Enterprise clients get review mode by default.

---

### Priority 7: Competitive Pricing Anchoring
Against Accomplish (free), EBFC AI must justify its price via the companion model:
- **"Accomplish remembers nothing. EBFC knows your business."**
- **"OpenClaw requires a Mac Mini and an engineering degree to set up. EBFC works in a browser."**

Position the $49/mo Starter tier explicitly against the *hidden cost* of Accomplish: API costs ($20–$50/mo for active use) + zero persistent memory + zero AEC context. The total cost of Accomplish is competitive with EBFC at volume; the total value is not.

---

### Long-Horizon Watch Items

| Item | Why It Matters |
|------|---------------|
| **Node pairing / mobile companion** | AEC users are mobile-first. A job-site companion must reach them in the field. |
| **Accomplish's integration roadmap** | When Notion, Google Drive, and scheduling land, Accomplish becomes a serious horizontal competitor even for AEC. |
| **OpenClaw upstream updates** | EBFC forks from OpenClaw — track upstream changes and cherry-pick improvements selectively. |
| **Kimi K2.5 performance for AEC tasks** | The default model must handle AEC-specific language well. Run benchmarks on RFI drafting, estimate scaffolding, technical document summarization. |
| **Supabase cost scaling** | At 1,100 users with vector operations at scale, validate Supabase pgvector costs don't erode the 97% margin target. |

---

## Appendix: Quick-Reference Summary Matrix

| Feature | EBFC AI | OpenClaw | Accomplish |
|---------|---------|----------|------------|
| Multi-tenant | ✅ | ❌ | ❌ |
| Vector memory | ✅ | ❌ | ❌ |
| Persistent companion | ✅ | ✅ | ❌ |
| Voice | ❌ (gap) | ✅ | ❌ |
| Multi-channel | ❌ (gap) | ✅ | ❌ |
| Mobile / node pairing | ❌ (gap) | ✅ | ❌ |
| Apple ecosystem | ❌ | ✅ | ❌ |
| Windows native | ✅ (browser) | ❌ | ✅ |
| Sub-agents | ✅ | ✅ | ❌ |
| AEC skills | ❌ (gap) | N/A | ❌ |
| Browser automation | ✅ | ✅ | ✅ |
| File management | ✅ | ✅ | ✅ |
| Open source | ❌ | ❌ | ✅ |
| Free tier | ❌ | N/A | ✅ |
| Cost to user | $49–$745/mo | ~$20–$50/mo | $0+ |
| Model flexibility | Low (3 options) | Medium | High (14+) |
| Maturity | Pre-GA | Production | 0.x (early) |
| Setup burden | Low (managed) | High | Medium |

---

*Document prepared by Sarah, Content & Strategy Lead — Changemakers*  
*For strategic use only. Do not distribute externally.*

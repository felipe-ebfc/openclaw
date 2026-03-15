---
name: project-context
description: Seed full project details into memory at project start. Guided conversation collects project name, owner, team, contract, scope, subs, and current phase. All other AEC skills pull from this context automatically.
metadata:
  {
    "openclaw":
      {
        "emoji": "🏛️",
      },
  }
---

# Project Context

**Run this first.** Before using any other EBFC AI skill, set up your project context. This skill walks you through a guided conversation to collect all the key details about your project and stores them in memory so every other skill — RFIs, daily reports, meeting minutes, PPC tracking — knows your project without you having to re-explain it every time.

Think of it as briefing your AI assistant on the job.

## When to Use

USE this skill when:

- You're starting on a new project and want EBFC AI to know the context
- You need to update project details (new super, new sub, phase change)
- A new team member is onboarding and needs to brief the AI
- You want to recall a full project summary quickly
- Someone says "set up my project", "tell the AI about my project", "add a project", "project summary", or "what do we know about [project name]?"

## When NOT to Use

- This is the FIRST skill to run — there's no "when not to use" for initial setup
- Don't skip this skill and expect other skills to know your project details — they won't

---

## Guided Setup — What I'll Ask You

When you say "set up project context" or "add a new project", I will ask you for the following information. You can answer all at once or one question at a time — whatever is easier.

### The Questions

**1. Project Basics**
- What is the project name? (What do you call it internally?)
- Where is the project located? (City, State — or full address if you want it in reports)
- What type of project is this? (Office, Hospital, School, Residential, Industrial, Infrastructure, etc.)

**2. The Contract**
- Who is the Owner? (Company name and key contact if known)
- Who is the GC or CM? (Your company, or the GC if you're a sub)
- What is the contract type? (GMP, Lump Sum, Cost Plus, Design-Build, IPD, etc.)
- What is the contract value? (Approximate is fine — for context only)
- What are the start and end dates? (Scheduled)

**3. Design Team**
- Who is the Architect? (Firm name and PM contact if known)
- Who is the Engineer of Record / Structural? (If applicable)
- Any key specialty designers? (MEP, Civil, etc.)

**4. Key Team Members**
- Project Manager (PM): [Name]
- Superintendent (Super): [Name]
- Project Engineer (PE): [Name]
- Owner's Representative: [Name]
- Any other key contacts?

**5. Scope Description**
- Briefly describe the scope of work. (A few sentences — what is being built, what is your specific scope, what's unique or complex about this project?)

**6. Active Subcontractors**
- List the major subcontractors currently active on the project. (Trade, company name, foreman if known)

**7. Current Phase**
- What phase is the project in right now? (Pre-construction / Foundations / Structure / Enclosure / Interior Rough / Finishes / Closeout)
- What is the approximate percent complete?
- What are the 2–3 most critical things happening in the next 30 days?

---

## What I Store in Memory

Once you've answered the questions, I store a structured project profile in Open Brain memory. Here's the format:

```
type: project_context
project_name: [Full project name]
project_slug: [short-name-for-indexing]
location: [City, State]
project_type: [Office / Hospital / School / etc.]

owner_name: [Company]
owner_contact: [Name, title]
gc_cm: [Company name]
contract_type: [GMP / Lump Sum / Cost Plus / Design-Build / IPD]
contract_value: [$ amount]
start_date: [YYYY-MM-DD]
end_date_scheduled: [YYYY-MM-DD]

architect: [Firm name — PM contact]
structural_engineer: [Firm name]
mep_engineer: [Firm name if applicable]

pm: [Name]
superintendent: [Name]
project_engineer: [Name]
owner_rep: [Name]
other_contacts: [list]

scope_description: [Paragraph]

subcontractors:
  - trade: [Trade]
    company: [Company name]
    foreman: [Name]
  - trade: [Trade]
    company: [Company name]
    foreman: [Name]

current_phase: [Phase name]
percent_complete: [n%]
next_30_days_priorities:
  - [Priority 1]
  - [Priority 2]
  - [Priority 3]

setup_date: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
```

Memory key: `project:[project-slug]`

---

## Project Commands

| What you say | What I do |
|---|---|
| "Set up project context" | Start the guided setup conversation |
| "Project summary" | Display the full stored project profile |
| "What projects do I have?" | List all projects stored in memory |
| "Update the super on [project name]" | Update a specific field |
| "Add a sub to [project name]" | Add a subcontractor to the project |
| "We're in closeout now" | Update the current phase |
| "What do we know about [project name]?" | Display stored context for that project |
| "Archive [project name]" | Mark project as complete in memory |

---

## How Other Skills Use This Context

Once project context is stored, every other EBFC AI skill uses it automatically:

- **rfi-generator** — pulls project name, owner, architect, and contract number for the RFI header
- **meeting-minutes** — knows project, team members, and meeting context
- **daily-report** — pre-fills project name, date, and knows the active trade partners
- **ppc-assistant** — stores PPC data under the project slug; can cross-reference subs

You should not need to re-explain your project every time you use a skill. Set it up once — EBFC AI remembers.

---

## Multi-Project Support

You can have multiple projects in memory at the same time. When you have more than one project, EBFC AI will ask which project you mean if it's not clear from context. You can also say:

- "Switch to the Riverside Medical project"
- "Work on Downtown Office"
- "Which project were we just working on?"

---

## Example: Quick Setup

If you want to brief the AI quickly, you can give it all at once:

> "Set up project context. Project: Riverside Medical Center, Phase 2. Owner: Riverside Health System — contact is Maria Chen, VP Facilities. GC is us — BuildRight Construction. Contract: GMP at $42M. Start Jan 2026, end Nov 2027. Architect: Skidmore & Associates. Our PM is David Torres, super is Mike Reyes. We're doing structural steel, MEP, and interior finishes. Currently in structural phase, about 20% complete. Active subs: Atlas Steel (struct steel, foreman Jake Ruiz), Bergman Electric (electrical, foreman Terry Banks), Northern Mechanical (HVAC/plumbing, foreman Pete Novak). Next 30 days: finish Level 3 steel, start Level 4 decking, begin MEP coordination drawings."

I'll parse that into the full structured profile and store it immediately.

---

## Keeping Context Fresh

Your project changes week to week. Keep the context current:

- **When you hire a new sub:** "Add Precision Glass as the glazing sub for Riverside Medical"
- **When the phase changes:** "Riverside Medical is now in enclosure phase, 35% complete"
- **When key personnel change:** "New super on Downtown Office is Kevin Wright"
- **At project close:** "Mark Riverside Medical as complete"

Current context = better AI assistance. Stale context = generic answers. Update it as the project evolves.

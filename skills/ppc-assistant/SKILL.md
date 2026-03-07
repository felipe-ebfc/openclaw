---
name: ppc-assistant
description: Percent Plan Complete (PPC) tracking and analysis for Last Planner System (LPS) implementation. Analyze weekly PPC, categorize variances, generate constraint logs, and coach teams on lean construction practices.
metadata:
  {
    "openclaw":
      {
        "emoji": "📊",
      },
  }
---

# PPC Assistant

Your guide to Percent Plan Complete (PPC) tracking and the Last Planner System (LPS). Use this skill to analyze weekly PPC data, understand why tasks were missed, categorize variances, generate constraint logs, and improve your team's planning reliability.

> **EBFC PPC Tracker:** The EBFC PPC tracking tool is available at **ppc.theebfcshow.com**

## When to Use

USE this skill when:

- You want to understand your weekly PPC score and what it means
- You need to analyze why tasks were not completed (variance analysis)
- You're facilitating a weekly pull plan or make-ready meeting
- You want to generate a constraint log from make-ready planning
- Someone asks "what's our PPC?", "why are we missing tasks?", "help me with our pull plan", "what constraints do we have?", or "explain Last Planner"
- You're coaching a subcontractor or foreman on reliable promising

## When NOT to Use

- For scheduling look-aheads in the traditional CPM sense — LPS is a complement to the master schedule, not a replacement
- For budget tracking or cost reporting — use daily reports and project management tools for that
- For formal schedule updates to the Owner — PPC data informs the schedule but the schedule update is a separate deliverable

---

## What Is the Last Planner System?

The Last Planner System (LPS) is a production planning and control method developed by the Lean Construction Institute (LCI). It puts planning authority in the hands of the "last planners" — the foremen and superintendents who actually direct the work.

### The Four Planning Horizons

```
MASTER SCHEDULE (the milestone plan)
    ↓
PHASE SCHEDULE (pull planning — 6-12 weeks)
    ↓
MAKE-READY / LOOKAHEAD (3-6 weeks)
    ↓
WEEKLY WORK PLAN (the commitment — this week's tasks)
    ↓
PPC MEASUREMENT (did we do what we said we'd do?)
```

### The Key Principle: Reliable Promising

A task only goes on the weekly work plan if the foreman can say YES to all of these:

1. **Definition** — Is the task clearly defined? Does everyone know exactly what "done" looks like?
2. **Soundness** — Are all prerequisites complete? Is everything in place to do this work?
3. **Sequence** — Is this the right task to do now, given the overall plan?
4. **Size** — Can the crew realistically complete it this week?
5. **Learning** — Are we doing this because we said we would, or because we know it makes sense?

---

## Percent Plan Complete (PPC)

**PPC = (Tasks Completed as Planned ÷ Total Tasks Committed) × 100**

A task is either complete (100%) or not complete (0%). There is no "80% done" in LPS — that's still a missed commitment.

### PPC Benchmarks

| PPC Score | What It Means |
|---|---|
| < 50% | Planning is in crisis — commitments are not reliable |
| 50–65% | Below average — significant improvement needed |
| 65–75% | Average for teams new to LPS |
| 75–85% | Good — reliable, predictable performance |
| 85%+ | Excellent — high-performing LPS team |

Industry target for mature LPS teams: **80–85% sustained**

---

## Standard LCI Variance Categories

When a task is NOT completed, you MUST categorize why. This is what transforms PPC from a score into a tool for improvement.

| Code | Category | Description |
|---|---|---|
| **PW** | Prerequisite Work | A prior task by another trade or your own crew was not done |
| **ME** | Material / Equipment | Material not on site, wrong material delivered, equipment unavailable or broken |
| **LC** | Labor / Crew | Crew not available, crew reassigned, absenteeism, insufficient crew size |
| **RFI** | Information / RFI | Design information missing, RFI not answered, drawing conflict not resolved |
| **WX** | Weather | Work could not proceed due to weather conditions |
| **CP** | Change in Priority | Management redirected crew to a different task |
| **SA** | Space / Access | Couldn't get into the area — another trade in the space, safety barricade, access restriction |
| **RW** | Rework | Work had to be redone due to quality issue (your crew or another trade) |
| **OT** | Other | Doesn't fit above — describe specifically |

---

## How to Use This Skill

**Analyze this week's PPC:**

"Here's our weekly plan — 18 tasks committed, 13 completed. Misses were: crane unavailable (electrical), framing not done in bay 4 (was waiting on inspections), drywall crew called off sick, masonry couldn't get access to the north wall. What's our PPC and how do I categorize the variances?"

**Generate a constraint log from make-ready:**

"Help me build a constraint log for next week's work. We're planning to pour the Level 4 deck, set curtain wall panels on the south face, and start MEP rough-in in zone 3."

**Explain a concept:**

"What's the difference between a make-ready meeting and a weekly work plan meeting?"
"Why do we measure PPC weekly instead of monthly?"

**Coach a foreman:**

"My concrete foreman keeps saying tasks are '90% done' — how do I explain that in LPS, that counts as a miss?"

**Recall past PPC data:**

"What was our PPC for the last four weeks?"
"Show me the most common variance category for this project"

---

## PPC Weekly Analysis Output

When you share your weekly data, I'll produce:

```
═══════════════════════════════════════════════════════════
WEEKLY PPC REPORT
═══════════════════════════════════════════════════════════
Project:          [Project name]
Week Ending:      [Date]
Prepared by:      [Name]

─────────────────────────────────────────────────────────
PPC SCORE
─────────────────────────────────────────────────────────
Tasks Committed:  [n]
Tasks Completed:  [n]
PPC This Week:    [n]%
4-Week Rolling:   [n]%
Trend:            [Improving / Declining / Stable]

─────────────────────────────────────────────────────────
VARIANCE ANALYSIS (Missed Tasks)
─────────────────────────────────────────────────────────
Category         | Count | % of Misses | Root Cause Notes
-----------------|-------|-------------|------------------
Prerequisite Work|  [n]  |    [n]%     | [What was the prereq?]
Material/Equip   |  [n]  |    [n]%     | [What was missing/broken?]
Labor/Crew       |  [n]  |    [n]%     | [Reason]
Information/RFI  |  [n]  |    [n]%     | [Which RFI?]
Weather          |  [n]  |    [n]%     | [Impact description]
Change in Priority|  [n] |    [n]%     | [Who directed?]
Space/Access     |  [n]  |    [n]%     | [What was blocking?]
Rework           |  [n]  |    [n]%     | [What had to be redone?]
Other            |  [n]  |    [n]%     | [Description]

─────────────────────────────────────────────────────────
TOP CONSTRAINT THIS WEEK
─────────────────────────────────────────────────────────
[Identify the single biggest factor limiting completion]

─────────────────────────────────────────────────────────
ACTIONS TO ADDRESS CONSTRAINTS
─────────────────────────────────────────────────────────
[Constraint] → [Who removes it] → [By when]

─────────────────────────────────────────────────────────
TASKS CARRIED TO NEXT WEEK
─────────────────────────────────────────────────────────
[List tasks that are still valid commitments for next week]

═══════════════════════════════════════════════════════════
```

---

## Constraint Log Template

Used during make-ready planning to identify and remove constraints before tasks enter the weekly plan:

```
CONSTRAINT LOG — [Project] — Week of [Date]
─────────────────────────────────────────────────────────
Task              | Constraint          | Owner    | Due
------------------|---------------------|----------|-----
[Pour Level 4 Deck]| RFI #14 not answered| GC PM    | Fri
[Curtain Wall S Face]| Lift drawings needed| Fab Shop | Mon
[MEP Rough Zone 3]| Fire stopping not done| Fireproof sub | Wed
```

Only tasks where **all constraints are removed** go on the weekly work plan. This is "making work ready."

---

## Memory Integration

Weekly PPC data is stored in Open Brain memory:

```
type: ppc_week
project: [project name]
week_ending: [YYYY-MM-DD]
tasks_committed: [n]
tasks_completed: [n]
ppc_score: [n]
variance_summary: {PW: n, ME: n, LC: n, RFI: n, WX: n, CP: n, SA: n, RW: n, OT: n}
top_constraint: [text]
```

Memory key format: `ppc:[project-slug]:[YYYY-MM-DD]`

---

## Key LCI Concepts

**Shielding** — Protecting the weekly work plan from disruption. The superintendent's job is to shield the crew from chaos so they can execute what they promised.

**Making Work Ready** — Removing constraints 3–6 weeks in advance so tasks can flow into the weekly plan without surprises.

**The Conversation of Commitment** — In LPS, a commitment is a speech act with three parts: (1) a clear request, (2) a capable performer who agrees, (3) conditions of satisfaction (what "done" looks like).

**PPC as a Learning Tool** — The point of PPC is not to punish foremen for misses. It's to surface systemic problems (always missing because of RFIs? Fix the RFI process) so the whole team improves.

---

## Resources

- **EBFC PPC Tracker:** ppc.theebfcshow.com
- **Lean Construction Institute:** leanconstruction.org
- **LPS Overview:** "The Last Planner System" by Glenn Ballard (LCI White Paper)
- **Variance Categories:** LCI standard as defined in "Lean Project Delivery and Integrated Practices in Modern Construction" (Abdelhamid, El-Gafy, Salem)

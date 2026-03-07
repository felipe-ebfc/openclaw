---
name: daily-report
description: Build end-of-day construction Daily Reports from field notes. Covers weather, manpower by trade, work performed, materials, equipment, incidents, and delays. Stores reports in memory.
metadata:
  {
    "openclaw":
      {
        "emoji": "🏗️",
      },
  }
---

# Daily Report

Generate a complete, professional Daily Construction Report from your end-of-day field notes. Daily reports are a legal record of project conditions — they protect you in disputes, substantiate delay claims, and document the project as-built.

## When to Use

USE this skill when:

- It's end of day and you need to document what happened on the jobsite
- You want to log weather, crew counts, work performed, or incidents
- You need to generate a report for the Owner or GC's records
- Someone says "write up my daily report", "log today", "document what happened today", or "end of day report"
- You need to recall what happened on a specific past date

## When NOT to Use

- For formal meeting documentation — use the meeting-minutes skill
- For RFIs or clarification requests — use the rfi-generator skill
- For weekly progress updates to the Owner — this is daily field-level documentation

## How to Use

Tell me about your day. I will organize it into the standard Daily Report format. The more you give me, the better the report — but even a voice-memo dump of field notes works.

**You can say things like:**

- "Write up my daily report. Monday, March 7. Cold and sunny, about 38 degrees. Had 12 ironworkers, 4 carpenters, 6 laborers. Set the beams on grid lines C through E. Concrete pour on the deck at level 3 was delayed — pump truck broke down. No incidents."
- "Log today — we had 2 electricians, 8 framers, and a city inspection that passed. High 62, partly cloudy."
- "What was my daily report from last Tuesday?"
- "Show me all daily reports for this week"

---

## Daily Report Output Template

```
═══════════════════════════════════════════════════════════
DAILY CONSTRUCTION REPORT
═══════════════════════════════════════════════════════════
Project:      [Project name]
Date:         [Day, Month DD, YYYY]
Day No.:      [Consecutive day of construction, if tracked]
Report No.:   [Sequential report number]
Prepared by:  [Your name / title]
Submitted to: [Owner / GC — if applicable]

─────────────────────────────────────────────────────────
WEATHER
─────────────────────────────────────────────────────────
Conditions:   [Sunny / Partly Cloudy / Overcast / Rain / Snow / Fog]
Temp (High):  [°F]
Temp (Low):   [°F]
Wind:         [Calm / Light / Moderate / High — and direction if notable]
Precipitation:[None / Light / Heavy — and inches if known]
Ground:       [Normal / Muddy / Frozen / Wet]
Weather Impact on Work: [None / Partial Delay / Full Stoppage — describe]

─────────────────────────────────────────────────────────
MANPOWER ON SITE
─────────────────────────────────────────────────────────
Trade / Company             | Foreman        | Workers | Total
----------------------------|----------------|---------|------
[Concrete — Sub Name]       | [Name]         | [#]     | [#]
[Structural Steel — Sub]    | [Name]         | [#]     | [#]
[Electrical — Sub Name]     | [Name]         | [#]     | [#]
[Framing — Sub Name]        | [Name]         | [#]     | [#]
[GC Superintendent]         | [Name]         | [#]     | [#]
                            | TOTAL ON SITE  |         | [#]

─────────────────────────────────────────────────────────
WORK PERFORMED TODAY
─────────────────────────────────────────────────────────
[Trade / Area]:
  - [Specific work completed — be location-specific]
  - [e.g., "Poured slab on grade, grid A–D, Levels 1–2, approx. 85 CY"]
  - [e.g., "Set W14x48 beams, bays 3 through 6"]

[Trade / Area]:
  - [Work performed]

─────────────────────────────────────────────────────────
MATERIALS DELIVERED
─────────────────────────────────────────────────────────
[ ] [Material — Quantity — Supplier — Ticket/PO No. if noted]
[ ] [Material — Quantity — Supplier]
[ ] No material deliveries today

─────────────────────────────────────────────────────────
EQUIPMENT ON SITE
─────────────────────────────────────────────────────────
[ ] [Equipment type — Size/Capacity — Owner/Rental — Status: Active/Idle]
[ ] [e.g., "Tower Crane TC-1 — 200-ton — RentalCo — Active"]

─────────────────────────────────────────────────────────
SAFETY
─────────────────────────────────────────────────────────
Incidents / Near Misses:  [ ] None  [ ] Yes — describe below
Injuries:                 [ ] None  [ ] Yes — describe below
Toolbox Talk Topic:       [Topic if conducted]
Visitors / Safety Officer:[Name and affiliation if site visit occurred]

[If yes to any above, describe fully:]

─────────────────────────────────────────────────────────
INSPECTIONS
─────────────────────────────────────────────────────────
[ ] No inspections today
[ ] [Inspector Name] — [Agency / Company] — [Type of inspection] — [Result: Pass / Fail / Conditional]

─────────────────────────────────────────────────────────
ISSUES, DELAYS & IMPACTS
─────────────────────────────────────────────────────────
[ ] No issues today
[ ] [Issue description — cause — duration of delay — responsible party]

─────────────────────────────────────────────────────────
VISITORS
─────────────────────────────────────────────────────────
[ ] No visitors
[ ] [Name — Company — Purpose of visit — Time on site]

─────────────────────────────────────────────────────────
PHOTOS TAKEN
─────────────────────────────────────────────────────────
[ ] No photos
[ ] [Brief description of what was photographed and why — location/area]

─────────────────────────────────────────────────────────
NOTES / GENERAL OBSERVATIONS
─────────────────────────────────────────────────────────
[Anything notable that doesn't fit above — upcoming critical
activities, coordination needed, items to follow up on]

═══════════════════════════════════════════════════════════
Superintendent Signature: ____________________  Date: ______
═══════════════════════════════════════════════════════════
```

---

## Daily Report Commands

| What you say | What I do |
|---|---|
| "Write today's daily report" | Generate from your notes |
| "Show my daily report from [date]" | Recall stored report |
| "Show this week's daily reports" | List all reports for current week |
| "What was the crew count on [date]?" | Pull specific field from stored report |
| "Were there any incidents this month?" | Search stored reports for safety events |
| "How many days did we lose to weather this month?" | Summarize weather delays from stored reports |

---

## Memory Integration

Each daily report is stored in Open Brain memory:

```
type: daily_report
project: [project name]
date: [YYYY-MM-DD]
weather_conditions: [conditions string]
total_manpower: [number]
work_summary: [brief text summary]
incidents: [boolean]
delays: [boolean]
delay_description: [text or null]
inspections: [passed/failed/none]
report_number: [sequential number]
```

Memory key format: `daily:[project-slug]:[YYYY-MM-DD]`

---

## Why Daily Reports Matter

Daily reports are not just paperwork — they are **your protection**:

- **Delay claims:** "It rained for 8 days in March" is hard to dispute when you have 8 daily reports documenting weather and crew impact.
- **Change orders:** Documentation that work was performed outside original scope starts with the daily report.
- **Subcontractor disputes:** Who was on site, when, doing what — the daily report is the record.
- **Safety incidents:** OSHA requires written records of work-related injuries. Your daily report is part of that record.
- **As-built documentation:** Courts and arbitrators look at daily reports to reconstruct what actually happened on a project.

**Write them every day, even when nothing significant happens.** A report that says "No issues, work proceeding as planned" is just as valuable as one documenting a problem.

## Tips

- Log manpower counts by trade before the crews leave for the day — counts get fuzzy fast.
- Note delivery ticket numbers. If a dispute arises about what was delivered, you'll have the reference.
- Be factual, not editorial. "The concrete pump was late" is better than "the subcontractor was negligent."
- When in doubt, include it. Over-documentation beats under-documentation in disputes.

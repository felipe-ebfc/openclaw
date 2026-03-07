---
name: meeting-minutes
description: Extract structured meeting minutes and action items from raw notes or transcribed audio. Tracks action items in memory for follow-up.
metadata:
  {
    "openclaw":
      {
        "emoji": "📝",
      },
  }
---

# Meeting Minutes

Turn raw meeting notes — typed, pasted, or transcribed from voice — into structured minutes with clear action items, decisions, and owners. Action items are stored in memory so nothing falls through the cracks.

## When to Use

USE this skill when:

- You have notes from any construction meeting (OAC, subcontractor, safety, design coordination, pull planning)
- You want to extract who promised to do what, by when
- You need formatted minutes to distribute to the project team
- Someone says "write up the meeting", "format my notes", "what were the action items from today's meeting?", or "pull my action items"
- You want to follow up on action items from a previous meeting

## When NOT to Use

- For RFIs or formal document requests — use the rfi-generator skill
- For daily field reports — use the daily-report skill
- For scheduling look-ahead sessions (these have their own Last Planner format) — though action items from those meetings can be captured here

## Meeting Types Supported

| Type | Typical Participants | Focus |
|---|---|---|
| OAC | Owner, Architect, GC PM | Schedule, budget, design decisions, changes |
| Subcontractor Coordination | GC PM, Subs | Scope interface, sequencing, logistics |
| Safety Meeting | Superintendent, Subs | Hazards, toolbox topics, incident review |
| Pull Planning / Look-Ahead | GC + Trade Foremen | Near-term work plan, constraints |
| Design Coordination | A/E team, GC, Subs | Clash resolution, RFI responses |
| Owner Update | Owner, GC PM | Progress, budget, decisions needed |

## How to Use

Paste or describe your meeting notes. The more detail you give, the better. I will identify:

- **Attendees** (who was there)
- **Discussion Points** (key topics covered)
- **Decisions Made** (things that were formally decided)
- **Action Items** (who does what by when)
- **Open Issues / Parking Lot** (unresolved items to carry forward)

**Example prompts:**

- "Here are my OAC meeting notes from today — write them up as minutes: [paste notes]"
- "Format these safety meeting notes and pull out all action items"
- "What action items do I have open from this week's meetings?"
- "Mark the action item about the fire stopping submittal as done"
- "Draft meeting minutes for a subcontractor coordination meeting — here's what we talked about: [notes]"

---

## Minutes Output Template

```
═══════════════════════════════════════════════════════════
MEETING MINUTES
═══════════════════════════════════════════════════════════
Meeting Type: [OAC / Subcontractor Coordination / Safety / etc.]
Project:      [Project name]
Date:         [Date of meeting]
Time:         [Start – End time]
Location:     [Jobsite trailer / Teams / Office / etc.]
Prepared by:  [Your name]
Distributed:  [Date distributed, or "same day"]

─────────────────────────────────────────────────────────
ATTENDEES
─────────────────────────────────────────────────────────
[Name] — [Company] — [Role]
[Name] — [Company] — [Role]
Absent / Regrets: [Names]

─────────────────────────────────────────────────────────
DISCUSSION
─────────────────────────────────────────────────────────
1. [Topic]
   [Summary of what was discussed, factual and concise]

2. [Topic]
   [Summary]

─────────────────────────────────────────────────────────
DECISIONS
─────────────────────────────────────────────────────────
[ ] [Decision — what was agreed upon, by whom]
[ ] [Decision]

─────────────────────────────────────────────────────────
ACTION ITEMS
─────────────────────────────────────────────────────────
#  | Owner       | Action                        | Due
---|-------------|-------------------------------|----------
1  | [Name]      | [What they committed to do]   | [Date]
2  | [Name]      | [Action]                      | [Date]

─────────────────────────────────────────────────────────
OPEN ISSUES / PARKING LOT
─────────────────────────────────────────────────────────
- [Issue that was raised but not resolved — carry to next meeting]
- [Issue]

─────────────────────────────────────────────────────────
NEXT MEETING
─────────────────────────────────────────────────────────
Date/Time: [Next meeting scheduled]
Location:  [Location]

═══════════════════════════════════════════════════════════
NOTE: These minutes are considered approved unless corrections
are submitted within [3] business days of distribution.
═══════════════════════════════════════════════════════════
```

---

## Action Item Commands

| What you say | What I do |
|---|---|
| "Show my open action items" | List all open action items assigned to you across all meetings |
| "Show action items for [name]" | Filter by person |
| "Show action items for [project]" | Filter by project |
| "Mark action item [description] as done" | Update status in memory |
| "What's overdue?" | List action items past their due date |
| "Action item summary for this week's OAC" | Recall action items from a specific meeting |

---

## Memory Integration

Each action item is stored in Open Brain memory:

```
type: action_item
project: [project name]
meeting_type: [OAC / Safety / Sub Coordination / etc.]
meeting_date: [YYYY-MM-DD]
owner: [person's name]
action: [what they need to do]
due_date: [YYYY-MM-DD]
status: Open | Complete | Overdue | Cancelled
completed_date: [YYYY-MM-DD or null]
```

Memory key format: `action:[project-slug]:[meeting-date]:[sequence]`

Full meeting minutes are also stored as a single memory entry so you can recall any prior meeting.

---

## Tips for Better Minutes

- **Distribute within 24 hours.** Memories fade fast on a busy jobsite.
- **One action item = one owner.** If two people share it, one person owns it and coordinates with the other.
- **Always include a due date.** "ASAP" is not a due date.
- **Separate decisions from discussions.** The team needs to know what was *decided*, not just what was *talked about*.
- **State assumptions.** If the minutes don't get corrected, they become the record. Be accurate.

## OAC Meeting Best Practices (LCI-Aligned)

Following Lean Construction Institute guidance for collaborative project delivery:

- Start with safety (even a 60-second topic)
- Review previous action items before adding new ones
- Identify constraints before assigning new tasks
- Close with clear decisions and owners confirmed aloud

---
name: rfi-generator
description: Draft, track, and log Requests for Information (RFIs) for construction projects. Stores RFIs in memory for status tracking and generates a summary log on demand.
metadata:
  {
    "openclaw":
      {
        "emoji": "📋",
      },
  }
---

# RFI Generator

Draft Requests for Information (RFIs) for any construction project. RFIs are the formal mechanism to get clarification from the Architect, Engineer, or Owner when drawings or specs are unclear, conflicting, or missing information.

## When to Use

USE this skill when:

- A drawing or spec section is unclear and you need a formal written question to the design team
- You want to document an existing field condition that conflicts with the drawings
- You need to propose a substitution and get it formally approved
- You want to track all open RFIs for a project and see their status
- Someone says "draft an RFI", "log an RFI", "I need to ask the architect about...", or "write up that RFI"

## When NOT to Use

- For internal questions between your own team — use a meeting or email
- For formal submittals (shop drawings, product data) — use the submittal process
- For change orders or pricing requests — RFIs document questions, not costs
- For safety hazards requiring immediate action — stop work and address the hazard first

## How to Use

Tell me what you need clarified. At minimum I need:

1. **Project name** (will pull from memory if project-context has been run)
2. **Spec section or drawing reference** (e.g., "Section 03 30 00", "Sheet A-201")
3. **The question** — what exactly needs to be clarified?

Optionally you can provide:
- Photos or sketches (describe what they show)
- Your suggested answer/solution
- The impact if the RFI is not answered quickly

**Example prompts:**

- "Draft an RFI for the Downtown Office project — Section 09 91 00 (painting). The spec calls for two coats but the drawings only show one coat in the finish schedule. Which governs?"
- "Log RFI #14 — rebar clearance at the east shear wall doesn't match the structural drawings"
- "Show me all open RFIs for Riverside Medical"
- "Mark RFI #8 as answered"

---

## RFI Output Template

When drafting, I will produce an RFI in this standard format:

```
═══════════════════════════════════════════════════════════
REQUEST FOR INFORMATION
═══════════════════════════════════════════════════════════
RFI No.:      [Auto-assigned or user-specified]
Date:         [Today's date]
Project:      [Project name]
Contract No.: [If known]

TO:           [Architect / Engineer / Owner — specify]
FROM:         [Your company name / your name]
SUBJECT:      [One-line summary of the question]

─────────────────────────────────────────────────────────
DRAWING / SPEC REFERENCE
─────────────────────────────────────────────────────────
Drawing(s):   [Sheet numbers and revision if applicable]
Spec Section: [CSI MasterFormat section number and title]

─────────────────────────────────────────────────────────
DESCRIPTION OF ISSUE
─────────────────────────────────────────────────────────
[Clear, factual description of the conflict, ambiguity,
or missing information. No opinions — just the facts.]

─────────────────────────────────────────────────────────
QUESTION
─────────────────────────────────────────────────────────
[The specific question(s) that need to be answered.
Number them if there are multiple questions.]

─────────────────────────────────────────────────────────
SUGGESTED ANSWER / PROPOSED SOLUTION (if applicable)
─────────────────────────────────────────────────────────
[Your team's proposed resolution. This speeds response
time and shows you've thought it through.]

─────────────────────────────────────────────────────────
SCHEDULE / COST IMPACT IF NOT ANSWERED BY:
─────────────────────────────────────────────────────────
Response needed by: [Date — typically 7–14 calendar days]
Schedule impact:    [Days of delay if answer is late]
Cost impact:        [Estimated cost impact, if any]

─────────────────────────────────────────────────────────
ATTACHMENTS
─────────────────────────────────────────────────────────
[ ] Sketch
[ ] Photo(s)
[ ] Specification excerpt
[ ] Drawing excerpt

═══════════════════════════════════════════════════════════
```

---

## RFI Log Commands

| What you say | What I do |
|---|---|
| "Show open RFIs" | List all RFIs stored in memory with Open status |
| "Show all RFIs for [project]" | Full RFI log for that project |
| "Mark RFI #[n] answered" | Update status in memory to Answered |
| "RFI summary" | Count of Open / Answered / Overdue by project |
| "What RFIs are overdue?" | List RFIs past their response-needed date |

---

## Memory Integration

Each RFI is stored in Open Brain memory with these fields:

```
type: rfi
project: [project name]
rfi_number: [n]
subject: [one-line summary]
spec_ref: [section or drawing]
status: Open | Answered | Void
date_submitted: [YYYY-MM-DD]
response_needed_by: [YYYY-MM-DD]
answered_date: [YYYY-MM-DD or null]
answer_summary: [brief summary of the response]
```

Memory key format: `rfi:[project-slug]:[rfi-number]`

---

## Tips for Effective RFIs

- **One question per RFI.** Multiple questions in one RFI cause delays — reviewers skip the second question.
- **Be specific about the drawing.** Include sheet number, detail number, and revision.
- **Always state the impact.** An RFI with "no response needed by a specific date" gets answered last.
- **Propose a solution.** Design teams respond faster when you give them something to approve or reject.
- **Number sequentially.** Keep one RFI log per project, numbered from 001.

## Construction Terminology Reference

- **CSI MasterFormat:** Standard 6-digit spec numbering system (e.g., 03 30 00 = Cast-in-Place Concrete)
- **A/E:** Architect and Engineer — typically the RFI recipient
- **OAC:** Owner-Architect-Contractor meeting
- **RFI Response Time:** Industry standard is 7–14 calendar days; check your contract spec for the required response period

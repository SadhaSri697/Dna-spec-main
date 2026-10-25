# Feature: Weekly Summary

**Domain**: [../../domains/standups.md](../../domains/standups.md)

## What it does

Generates and sends a weekly summary email to team admins every
Monday, covering the past 7 days.

## Why it exists

The daily digest is tactical ("what's happening today"). Managers
need a strategic view ("what trends over the week").

## Inputs

- The team
- The past 7 days of standup updates
- The team admins

## Outputs

- One email per team admin
- The email contains: total updates submitted, per-member
  participation, top blockers (deduplicated), and a one-paragraph
  auto-generated narrative

## Happy path

1. A scheduled job runs Monday at 09:00 UTC
2. For each team, gather the past 7 days of updates
3. Compute participation (which members submitted, which didn't)
4. Extract blockers (the blockers field from each update,
   deduplicated by exact match)
5. Generate a one-paragraph narrative (e.g., "12 of 15 members
   submitted updates. 3 blockers this week: deploy pipeline,
   staging environment, third-party API latency.")
6. Send to all team admins
7. Log the send

## Edge cases

- Team is brand new (< 7 days old): use available data, note "team
  is {N} days old" in the narrative
- No updates at all: skip sending; admins get a "no activity"
  notice instead
- Member left mid-week: their updates from before they left are
  included; their post-leave absence is noted
- Blockers exceed 50 distinct items: truncate, link to dashboard for
  full list

## Permissions

System-initiated. Email is sent to admins only (not to members).

## Tracked in flows

- [Weekly Review](../../flows/weekly-review.md)

## Implementation notes

- The narrative is templated, not LLM-generated. Determinism matters
  for testing.
- The weekly summary job is idempotent: re-running it for the same
  week produces the same email.
- All admins get the same email — no per-admin customization in v1.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

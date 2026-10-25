# Feature: Submit Update

**Domain**: [../../domains/standups.md](../../domains/standups.md)

## What it does

Lets a team member submit their three-question standup update for
the day.

## Why it exists

The update is the core input to the standup loop. Without it, the
digest is empty.

## Inputs

- The team member
- The current date
- Three text fields: "yesterday", "today", "blockers"
- A one-time token (from the email) OR an authenticated session

## Outputs

- A standup_update record (one per member per day)
- The user sees a confirmation page ("thanks, here's the digest so
  far")

## Happy path

1. User clicks the link in the daily-prompt email (or visits the
   dashboard)
2. User fills in the three fields
3. User submits
4. System creates the standup_update record (one per day, idempotent
   on date+user)
5. User is shown a confirmation with the partial digest

## Edge cases

- User submits twice in a day: the second submission is an edit,
  not a new record
- User submits for yesterday: allowed, but flagged in the digest as
  "late"
- User submits for tomorrow: rejected ("standups are for past or
  current days only")
- User is no longer on the team: form is view-only
- Token from email is expired: prompt login
- Empty blockers field: allowed and rendered as "—" in the digest

## Permissions

Team member (active). Past members cannot submit; admins can submit
on behalf of a member ("proxy update").

## Tracked in flows

- [Daily Standup](../../flows/daily-standup.md)

## Implementation notes

- Updates are soft-editable for 24 hours, then frozen. Frozen
  updates appear in the historical digest exactly as submitted.
- Use a single text area per field; no markdown. Plain text only.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

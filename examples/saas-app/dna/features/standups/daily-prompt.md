# Feature: Daily Prompt

**Domain**: [../../domains/standups.md](../../domains/standups.md)

## What it does

Sends a single email to each team member at the team's standup time,
asking them to submit their update.

## Why it exists

The async standup loop runs on a trigger. Without the prompt, members
would have to remember on their own, and adoption drops.

## Inputs

- The team (id, standup time, timezone, member list)
- The current date in the team's timezone

## Outputs

- One email per active member who hasn't yet submitted for today
- Each email contains a unique link to the submit-update form
- A log entry per email sent

## Happy path

1. A scheduled job runs every 5 minutes
2. For each team whose standup time is "now" (within the 5-minute
   window, in their timezone):
   a. For each active member who hasn't submitted today:
      - Send the daily-prompt email
      - Log the send
3. The job exits

## Edge cases

- Member submitted already: skip
- Member opted out of email: skip (a future feature)
- Email send fails: retry once, then log; the next job run picks up
  the slack
- Standup time is in the past for today: send the prompt immediately
  if the team was just created
- DST transition: a team at "9:00 America/New_York" stays at 9:00
  local time across DST shifts

## Permissions

System-initiated. No user permissions.

## Tracked in flows

- [Daily Standup](../../flows/daily-standup.md)

## Implementation notes

- Use the system's email service; never SMTP directly.
- Each email contains a one-time submit URL (signed token) so the
  user can submit without logging in. Token expires at end of day.
- The 5-minute cron cadence means a standup can be up to 5 minutes
  late; this is acceptable.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

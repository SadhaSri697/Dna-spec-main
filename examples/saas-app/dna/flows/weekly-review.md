# Flow: Weekly Review

## Trigger

The weekly-summary scheduled job fires Monday at 09:00 UTC.

## Goal

Each team admin has received a summary of the past 7 days, with
participation metrics and aggregated blockers, so they can decide
whether the team needs intervention.

## Pre-conditions

- The team has at least one admin
- The team has been around for at least one day (so there's
  something to summarize)

## Steps

1. Scheduled job runs Monday at 09:00 UTC
2. System gathers the past 7 days of standup updates per team
3. System computes per-member participation
4. System aggregates blockers → see [Feature: Weekly Summary](../features/standups/weekly-summary.md)
5. System generates the narrative
6. System sends the summary email to all team admins
7. Admin opens the email, sees the participation chart, the blocker
   list, and the narrative
8. Admin clicks through to the dashboard for a deeper view
9. Admin optionally leaves a comment on the week (visible to other
   admins)

## Alternative paths

- A team that's brand new (< 7 days old): the summary uses whatever
  data is available and notes the team's age
- A team with no activity: the summary is replaced by a "no
  activity this week" notice
- A team where the admin changed mid-week: the new admin receives
  the summary; the old admin does not

## Failure modes

- Email send fails: retry once; log; admins can view the summary
  in the dashboard
- Job is delayed: idempotent — re-running for the same week
  produces the same email
- Team has 0 admins: the summary is still produced but goes to
  the most recent admin's email; the system logs a "no active
  admin" event

## Post-conditions

- Each admin has received a weekly summary
- The week is marked as "summarized" in the system, preventing
  duplicate sends
- Comments (if any) are stored per week

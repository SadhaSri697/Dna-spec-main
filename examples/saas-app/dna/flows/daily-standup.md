# Flow: Daily Standup

## Trigger

The daily-prompt scheduled job detects that a team's standup time
has arrived.

## Goal

Every team member has been prompted, those who responded have their
updates recorded, and the team has received a digest of the day's
updates.

## Pre-conditions

- The team exists and has at least one active member
- The standup time is configured

## Steps

1. Scheduled job fires at the team's standup time → see [Feature: Daily Prompt](../features/standups/daily-prompt.md)
2. System sends the daily-prompt email to each active member who
   hasn't yet submitted
3. Members click the link in the email and submit their update
   → see [Feature: Submit Update](../features/standups/submit-update.md)
4. As updates come in, the partial digest becomes visible in the
   dashboard
5. At the team's "digest time" (standup time + 2 hours), the
   system sends the daily digest email to the whole team
6. The digest contains each member's three fields, with absent
   members marked as "no update"

## Alternative paths

- Time-zone-aware: a team in Tokyo at standup time 09:00 JST gets
  prompted at 09:00 JST regardless of where the server runs
- A team with no members who respond by digest time still gets a
  digest ("0/5 members responded")
- A team that was created today gets a single same-day prompt

## Failure modes

- Email service down: prompts retry on the next job run; if the
  window has passed, prompts are skipped (no late-day nag)
- Update submitted for wrong day: rejected, friendly error
- Member unsubscribes mid-flow: the unsubscribe is honored for the
  next day's prompt
- Digest send fails: retry once; log; admin can manually trigger a
  resend from the dashboard

## Post-conditions

- A daily standup record exists for today (with timestamps)
- All members who submitted have a standup_update record
- The team has received the digest
- The dashboard reflects the day's state

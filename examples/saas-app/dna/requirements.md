# Requirements

> Invariants. If violated, the product is broken.

## Security

- User passwords must be hashed with bcrypt (cost factor ≥ 10) before
  storage. Plaintext passwords must never be written to disk or logs.
- Sessions must expire after 30 days of inactivity.
- The submit-update link from email must be a signed token that
  expires at end-of-day in the user's team timezone.
- API endpoints that mutate data must require an authenticated,
  verified session, except for the submit-update endpoint which
  accepts the signed token.

## Data integrity

- A user can have at most one account per email address. Signup
  attempts for an existing email must not reveal the account's
  existence.
- A standup_update is unique per (user, date) — a user can submit
  exactly one update per day. Re-submission edits the existing
  record within 24 hours.
- A team must always have at least one admin. Removing the last
  admin must be rejected.
- A team's timezone must be a valid IANA timezone string.

## Performance

- Daily prompts must be sent within 5 minutes of the team's
  configured standup time.
- The daily digest must be sent within 5 minutes of the configured
  digest time (standup time + 2 hours).
- The dashboard's "today" view must load in under 1 second for a
  team of 20 members.
- The weekly summary job must complete within 10 minutes for any
  team, regardless of size.

## Privacy

- Standup updates are visible to all members of the same team. They
  are not visible to other teams, to admins of other teams, or to
  anyone outside the team.
- Blockers are aggregated in the weekly summary but the original
  per-update content is not shared outside the team.
- Removed members lose access to all team data on removal. Their
  historical updates remain visible to the team.
- Email addresses are never exposed in API responses except to the
  user who owns the address and to team admins in the member list.

## Reliability

- Daily prompts and digests are at-least-once: the system retries
  transient failures and never silently drops a send.
- The daily-prompt job is idempotent: re-running it for the same
  day produces the same set of emails (no duplicates).
- The weekly summary job is idempotent: re-running for the same
  week produces the same email.
- User data is backed up daily with a 7-day retention window.

## Compliance

- The product must support data export for any user (their account,
  their updates, the teams they're in) within 24 hours of a
  verified request.
- The product must support account deletion: deleting a user
  removes their personal data, anonymizes their standup updates
  ("former member" placeholder), and removes them from teams.
- All email links must support an unsubscribe path, and
  unsubscribe requests must be honored within 24 hours.

## Operational

- All scheduled jobs (daily prompts, digests, weekly summary) must
  emit structured logs including team id, job name, and timing.
- Failed email sends must be retried with exponential backoff up to
  3 attempts, then surfaced to the on-call dashboard.
- The product must be deployable to a fresh environment in under
  30 minutes from a clean checkout (DB migrations + env config
  only).

# Feature: Invite Members

**Domain**: [../../domains/teams.md](../../domains/teams.md)

## What it does

Lets a team admin invite people to join the team via email.

## Why it exists

A team isn't useful with one person. The admin needs a way to add
others.

## Inputs

- Email address(es) of invitees
- (Optional) personal message

## Outputs

- A pending invite record per email
- An invite email sent to each address
- A pending-invites list visible in the team settings

## Happy path

1. Admin visits `/teams/{id}/members/invite`
2. Admin enters one or more email addresses
3. Admin submits
4. System creates a pending invite per email
5. System sends the invite email
6. Admin sees the pending invites in the team settings

## Edge cases

- Invitee already on the team: skip with a note
- Invitee already has a pending invite: skip with a note
- Invitee is already a user of the system: still send the invite;
  signing in lands them on the team page
- Email send fails: mark the invite as "send failed", show in UI
- Resend: admin can resend any pending invite

## Permissions

Team admin only. Members cannot invite.

## Tracked in flows

- [Team Onboarding](../../flows/team-onboarding.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

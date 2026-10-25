# Feature: Create Team

**Domain**: [../../domains/teams.md](../../domains/teams.md)

## What it does

Lets a verified user create a new team and become its admin.

## Why it exists

Every team starts somewhere. A user who signs up needs to create
their team before they can configure a standup schedule.

## Inputs

- Team name (1–60 chars, unique within the system)
- Timezone (IANA timezone string)
- Standup time (HH:MM in the team's timezone)

## Outputs

- A new team record
- The creator's membership in that team with role=admin
- A redirect to the team dashboard

## Happy path

1. User is authenticated and verified
2. User visits `/teams/new`
3. User enters team name, timezone, and standup time
4. User submits
5. System creates the team
6. System creates the user's membership (role=admin)
7. User is redirected to the team dashboard

## Edge cases

- User already has a team: in v1, a user can be in only one team.
  Show a "you're already in {team}" message with a link to leave it
  first.
- Team name taken: inline error
- Invalid timezone: select widget only allows valid IANA names
- Standup time outside 06:00–22:00: warning, allow (some teams
  prefer unusual hours)

## Permissions

Authenticated, verified user. v1: every user can create a team.

## Tracked in flows

- [Team Onboarding](../../flows/team-onboarding.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

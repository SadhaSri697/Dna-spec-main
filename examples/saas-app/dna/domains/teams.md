# Domain: Teams

> Owns team lifecycle and membership. One team per bot in v1.

## Purpose

Group users into teams so the bot knows who to prompt each morning
and which digest to produce.

## Scope

- Team creation
- Inviting members via email
- Member roles (admin, member)
- Removing members
- Team settings (name, timezone, standup time)

## Out of scope

- Multiple teams per user with shared accounts (v1: one user, one team)
- Cross-team collaboration
- Public/private team visibility (v1: all teams are private)

## Depends on

- Auth (a user must exist to create a team)

## Depends on us

- Standups (a standup is scoped to a team)

## Features

- [x] [Create Team](../features/teams/create-team.md)
- [x] [Invite Members](../features/teams/invite-members.md)

## Flows

- [x] [Team Onboarding](../flows/team-onboarding.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

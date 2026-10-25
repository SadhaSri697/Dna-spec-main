# Domain: Auth

> Owns user identity. Email/password and Google OAuth in v1.

## Purpose

Identify users so the bot can attribute standup updates to a person
and restrict team-management actions to the right humans.

## Scope

- Email/password signup and login
- Google OAuth
- Password reset
- Session management
- Email verification

## Out of scope

- SSO / SAML (v2)
- Magic links (v2)
- Multi-factor auth (v2)
- API tokens (v2)

## Depends on

Nothing.

## Depends on us

- Teams (a team is owned by an authenticated user)
- Standups (a standup update is attributed to an authenticated user)

## Features

- [x] [Signup](../features/auth/signup.md)
- [x] [Login](../features/auth/login.md)

## Flows

- [x] [Team Onboarding](../flows/team-onboarding.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

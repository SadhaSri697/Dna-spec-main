# Feature: Login

**Domain**: [../../domains/auth.md](../../domains/auth.md)

## What it does

Lets an existing user authenticate and start a session.

## Why it exists

Returning users need to authenticate to access their team's standup
data and management actions.

## Inputs

- Email
- Password

## Outputs

- A session cookie (httpOnly, secure, sameSite=lax)
- Redirect to the dashboard

## Happy path

1. User visits `/login`
2. User enters email and password
3. User submits the form
4. System verifies the credentials
5. System verifies the user is in "verified" state
6. System creates a session
7. User is redirected to the dashboard

## Edge cases

- Wrong password: generic error ("invalid credentials"), don't
  reveal whether email exists
- Account not verified: redirect to "verify your email" with
  resend option
- Account disabled: generic error
- Rate limited: 5 attempts per 15 minutes per IP

## Permissions

Anyone. Login is for existing users.

## Tracked in flows

- [Team Onboarding](../../flows/team-onboarding.md) (returning
  users skip the team-creation step)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

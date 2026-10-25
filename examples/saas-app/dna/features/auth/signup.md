# Feature: Signup

**Domain**: [../../domains/auth.md](../../domains/auth.md)

## What it does

Lets a new user create an account with email and password.

## Why it exists

The product requires users to be identified so updates can be
attributed and team actions can be authorized.

## Inputs

- Email (must be a valid email format, not already registered)
- Password (min 8 characters, must contain a number)

## Outputs

- A new user record
- A verification email sent to the provided address
- A session for the new user (auto-login after verification)

## Happy path

1. User visits `/signup`
2. User enters email and password
3. User submits the form
4. System creates the user (status: unverified)
5. System sends a verification email
6. User is redirected to a "check your email" page

## Edge cases

- Email already registered: show generic message ("if this email is
  new to us, you'll get a verification link"), don't reveal account
  existence
- Password too weak: inline error
- Email send fails: retry; if still fails, log and show generic
  error
- User clicks verification link after account deletion: friendly
  "link expired" page

## Permissions

Anyone. Signup is open in v1 (no invite-only mode).

## Tracked in flows

- [Team Onboarding](../../flows/team-onboarding.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

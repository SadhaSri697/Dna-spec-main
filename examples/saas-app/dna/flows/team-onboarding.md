# Flow: Team Onboarding

## Trigger

A new user completes signup and clicks the verification link in
their email.

## Goal

The user has a verified account, has created a team, has invited at
least one other person, and the team is configured to start
receiving daily standup prompts the next morning.

## Pre-conditions

- User has just verified their email
- User is not yet a member of any team

## Steps

1. User clicks the verification link → see [Feature: Signup](../features/auth/signup.md)
2. System marks the user as verified
3. System creates a session and redirects to `/welcome`
4. User is presented with the option to create a team
5. User clicks "Create a team" → see [Feature: Create Team](../features/teams/create-team.md)
6. User fills in team name, timezone, and standup time
7. System creates the team and the user's admin membership
8. User is redirected to the team dashboard
9. Dashboard shows a "You're all set" banner with a "Invite your
   first teammate" CTA
10. User clicks the CTA → see [Feature: Invite Members](../features/teams/invite-members.md)
11. User enters teammate emails and submits
12. System sends the invite emails
13. User sees the pending invites in the team settings

## Alternative paths

- User has already signed up and verified, returning: skip steps
  1–4, go directly to step 5 (or to dashboard if they already have
  a team)
- User skips inviting: dashboard shows the CTA persistently until
  they invite or explicitly dismiss

## Failure modes

- Verification link expired: friendly page with resend option
- Team name already taken: inline error
- Invite email send fails: invite still recorded; admin can resend
- User abandons mid-flow: their state is preserved; returning to
  the site resumes from the dashboard

## Post-conditions

- User has a verified account
- User is admin of a team
- Team has a configured standup time
- At least one invite is pending (or the user has explicitly
  dismissed the CTA)
- The team will receive its first daily prompts the next morning at
  the configured standup time

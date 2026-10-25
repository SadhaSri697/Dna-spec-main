# Domain: Standups

> Owns the daily standup cycle and the resulting reports.

## Purpose

Drive the daily standup loop: prompt at standup time, collect
updates, compile a digest, and emit weekly summaries.

## Scope

- Daily prompts (sent via email at the team's standup time)
- Standup update collection (web form, three questions: yesterday,
  today, blockers)
- Daily digest (sent to the team's email distribution)
- Weekly summary (sent to admins, aggregated view)
- Update history (per user, per day, browsable in dashboard)

## Out of scope

- Real-time chat (the bot is async-only in v1)
- Custom question templates (v1: the three questions are fixed)
- Multi-cadence (v1: one standup schedule per team)
- Standup reminders (v1: one prompt per day, no nag mode)

## Depends on

- Auth (a standup update is attributed to a user)
- Teams (a standup is scoped to a team)

## Depends on us

Nothing.

## Features

- [x] [Daily Prompt](../features/standups/daily-prompt.md)
- [x] [Submit Update](../features/standups/submit-update.md)
- [x] [Weekly Summary](../features/standups/weekly-summary.md)

## Flows

- [x] [Daily Standup](../flows/daily-standup.md)
- [x] [Weekly Review](../flows/weekly-review.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

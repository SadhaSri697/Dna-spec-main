# Flow: <Name>

> Level 3. A flow is an end-to-end journey through the product. It crosses
> domains, features, and time. A flow always starts with a user trigger
> and ends with a user-observable state.

## Trigger

<!-- What starts the flow. A user action, a system event, a schedule. -->

## Goal

<!-- The end state. What "done" looks like for this flow. -->

## Pre-conditions

<!-- What must be true before the flow can start. Authenticated, plan
selected, feature flag on, etc. -->

## Steps

<!-- Numbered list. Each step is a single user action or system response.
A step can reference features in the form:
"[Feature: Login](../features/auth/login.md)" -->

1. User does X
2. System does Y → see [Feature: A](../features/<domain>/a.md)
3. User does Z
4. ...

## Alternative paths

<!-- Bullet list. Other ways the flow can complete. -->

- ...

## Failure modes

<!-- Bullet list. How the flow can fail and what the user sees. -->

- ...

## Post-conditions

<!-- What is true after the flow completes (whether successful or not). -->

---

*This file is part of the DNA. Edit it when the journey changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

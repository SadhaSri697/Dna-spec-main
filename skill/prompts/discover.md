# Discovery Phase — Question Bank

Use this file during Phase 1 (Discover). The goal is to produce a complete,
unambiguous DNA through a focused conversation.

## How to use this file

1. Always read existing DNA files first. Re-ask only what's missing.
2. Pick the **lowest unfilled level** and start there. Most projects: 0 → 4.
3. Ask **one question at a time** from the relevant section below.
4. After each answer, **draft the corresponding file** and show the user
   before writing. This is the drafter pattern: user says → you draft →
   user confirms → you write.
5. Commit each file to git as it's written.
6. After all levels are filled, run Plan and Tasks automatically (Phase 2/3).

The drafter pattern is critical. Don't write a file silently. Always show
the proposed content and wait for "go" or edits.

## Level 0 — Vision

Vision is one paragraph. The questions below are the high-leverage ones.
You don't need to ask all of them — ask until you can write the paragraph.

**Opening prompt** (use this if the user is starting cold):

> "Tell me about the product in your own words — what does it do, and why
> does it exist? Imagine you're explaining it to a friend at a coffee shop."

**Targeted questions** (use as follow-ups if the opening answer is thin):

- "What's the one sentence that, if a user read it, would make them say
  'I need this'?"
- "What does this product do that nothing else does? Or do better?"
- "What does this product refuse to do? What's the non-goal that defines
  its shape?"
- "If this product succeeded wildly, what would the world look like?"
- "What's the philosophy that drives your design decisions? What do you
  value over what?"

**Draft the file from the template** at `templates/vision.md`. Fill in:
- Mission (one sentence)
- Goal (one sentence)
- Philosophy (1–3 sentences)
- Non-goals (bullet list)

## Level 1 — Domains

Domains are nouns. Auth, Billing, Content, Search, Notifications. Each
domain owns a coherent set of features. A good domain is:

- A noun, not a verb ("Auth" not "Authenticating")
- Mutually exclusive with other domains (one feature, one home)
- Stable over time (the domain doesn't appear and disappear with
  product pivots)

**Opening prompt**:

> "Looking at the vision, what are the major nouns — the major areas of
> the product? A SaaS might have Auth, Billing, Content. A CLI tool might
> have Config, Plugins, Commands. What are yours?"

**Targeted questions**:

- "If you had to draw boxes around the major product areas, what would
  they be?"
- "Which of these areas need to exist for the product to work? Which
  are nice-to-have?"
- "Which areas depend on which? Auth usually comes first. What else?"
- "Are there any areas you've been avoiding? Sometimes those are the
  most important."
- "Walk me through a user's day. What product areas do they touch?"

**For each domain**, draft `dna/domains/<name>.md` from
`templates/domain.md`. Fill in Purpose, Scope, Out of scope, Depends on,
Depends on us. Leave Features and Flows as placeholders — those fill in
during levels 2 and 3.

## Level 2 — Features

A feature is a single capability inside a domain. Smallest unit of
"thing the user can do." Test: can you describe it in one sentence? If
not, it's a domain.

**Opening prompt**:

> "Pick the first domain. What can a user do inside it? List the verbs."

**Targeted questions**:

- "What does a user do first when they enter this domain?"
- "What's the most common task? The least common?"
- "What are the errors? If the user gets something wrong, what are the
  ways they can mess up?"
- "Is there a feature in this domain that, if removed, would make the
  domain pointless? That's the core feature."
- "What does success look like for this domain? What would you demo to
  show the domain works?"

**For each feature**, draft `dna/features/<domain>/<feature>.md` from
`templates/feature.md`. Fill in: What it does, Why it exists, Inputs,
Outputs, Happy path, Edge cases, Permissions. Implementation notes is
optional — leave it empty for now unless the user volunteers decisions.

## Level 3 — Flows

A flow is an end-to-end journey. It crosses domains, features, and time.
The trigger is always a user action or a system event. The end is always
a user-observable state.

**Opening prompt**:

> "Let's pick a flow. The classic first one is onboarding — what does a
> brand-new user do, from their first visit to their first meaningful
> action? Walk me through it step by step."

**Targeted questions**:

- "What kicks off the flow? What makes the user start it?"
- "What's the success state? What does the user see/feel/have when the
  flow is done?"
- "What's the failure state? If something goes wrong mid-flow, where
  do they end up?"
- "Are there alternative paths? Can this flow branch?"
- "What other flows share steps with this one?"

**For each flow**, draft `dna/flows/<name>.md` from `templates/flow.md`.
Use the form `[Feature: X](../features/<domain>/<x>.md)` to link to
features inside steps. Don't write new features here — if a flow needs
a feature that doesn't exist, go back to level 2 and add it.

## Level 4 — Requirements

Requirements are invariants. They must always be true. "Must" not
"should". If violated, the product is broken.

**Opening prompt**:

> "Let's list the invariants. What are the things about this product
> that, if violated, would mean the product is broken? Not 'we'd
> prefer it didn't' but 'this is a bug'."

**Targeted questions** (use the categories in `templates/requirements.md`):

- "What data must never leak? What auth/authz must always hold?"
- "What data can never be lost? What must be consistent?"
- "What latency must always be met? What throughput?"
- "What data must never be retained? What must always be deleted?"
- "What's the recovery story? What's the worst case that must not
  happen?"
- "What regulatory or compliance rules apply? GDPR, HIPAA, SOC2?"

**Draft `dna/requirements.md`** from the template. One bullet per
invariant. Be ruthless: a list of 5 strong requirements is better than
30 wishy-washy ones.

## When discovery is done

After level 4 is filled, the DNA is complete. Immediately run Phase 2
(Plan) and Phase 3 (Tasks) unless the user says otherwise. The skill's
value compounds when the spec, the plan, and the tasks all exist.

Notify the user. Tell them the build order. Tell them how to invoke
implementation.

## Resuming a partial DNA

If you find an in-progress DNA (some levels filled, some empty):

1. Read AGENTS.md first.
2. Identify the lowest missing level.
3. Confirm with the user: "The spec has vision and auth domain done.
   Next is auth features. Continue from there, or skip ahead?"
4. Pick up where they left off.

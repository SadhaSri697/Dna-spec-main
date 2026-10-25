# Plan Phase — Implementation Planning

Use this file during Phase 2 (Plan). Goal: turn the DNA into a buildable
plan with milestones, dependencies, and exit criteria.

## Inputs

- `dna/vision.md` — the why
- `dna/domains/*.md` — the what exists
- `dna/features/**/*.md` — the what capabilities
- `dna/flows/*.md` — the how it behaves
- `dna/requirements.md` — the invariants

Read all of them end-to-end. If the conversation is long, the file
contents may have fallen out of your context window — re-read.

## Algorithm

1. **Identify the dependency graph between domains.** Auth before
   everything. Billing before paid features. Content before any
   read-only surface. Build a topological order.

2. **Identify cross-cutting requirements.** Read `requirements.md` and
   group by category. Auth, observability, error handling, and logging
   are usually cross-cutting — they belong in an infrastructure
   milestone at the start, not bolted onto each domain.

3. **Group features into milestones.** A milestone is a coherent chunk
   of work that:
   - Has a single clear goal
   - Produces a runnable artifact
   - Has an exit criterion (a test, a deploy, a demo)
   - Lasts a reasonable amount of time (not too small, not too big)

4. **Order milestones by dependency.** M1 must finish before M2 starts
   if M2 depends on M1.

5. **For each milestone, list**:
   - Goal (one sentence)
   - Scope (which domains/features/flows)
   - Depends on (other milestones, or "nothing")
   - Approximate task count
   - Exit criterion (a test, a deploy, a manual demo)

6. **Identify deferred work.** Things in the DNA that we're not building
   this round. Be explicit. Reference the DNA file that contains them.

7. **Identify out-of-scope work.** Reference the vision's non-goals.

## Output

Write `dna/implementation/plan.md` using `templates/plan.md`.

Sections, in order:
- Strategy (one paragraph)
- Build order rationale (one paragraph)
- Milestones (one section each, with goal/scope/depends-on/tasks/exit)
- Cross-cutting concerns
- Deferred
- Out of scope

## Common patterns

**Foundation → Core → Polish**:
- M1: Infrastructure (auth scaffolding, DB, deploy pipeline, observability)
- M2: Core domain #1 (the product's primary reason to exist)
- M3: Core domain #2
- ...
- MN: Polish (admin tools, settings, edge cases)

**Walking skeleton first**:
The "walking skeleton" pattern: M1 is the smallest possible end-to-end
slice. A user can sign up, see a hello world, log out. Everything after
that is feature work. This is good for new products.

**Vertical slice first**:
M1 is one full feature (e.g., login) done properly. M2 is the next
feature. Each milestone produces a shippable increment. Good for
existing products being extended.

**Pick the pattern that fits the project.** A greenfield product
benefits from the walking skeleton. A new feature in an existing
product benefits from a vertical slice.

## Commit and continue

After writing plan.md:
1. Commit with a clear message: `plan: initial implementation plan`
2. Update AGENTS.md
3. Run Phase 3 (Tasks) immediately unless the user wants to review

## Common mistakes

- **Milestone too big**: "Implement auth" is a milestone-sized task, not
  a milestone. Break it down: schema, login API, signup API, session
  middleware, password reset.
- **Milestone too small**: "Create users table" is a task. Three of
  these don't make a milestone.
- **No exit criterion**: if you can't say "M1 is done when X", the
  milestone isn't well-defined.
- **No dependencies**: if every milestone can be done in parallel,
  either the work is too granular or the dependencies weren't found.
- **Re-deriving the spec in the plan**: the plan is *what to build*, the
  DNA is *what's true*. Don't repeat DNA content in the plan — link
  to it.

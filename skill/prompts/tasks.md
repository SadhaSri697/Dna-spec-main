# Tasks Phase — Task Decomposition

Use this file during Phase 3 (Tasks). Goal: decompose the plan into
small, executable tasks. Each task is sized for a single coding agent
to complete independently.

## Inputs

- `dna/implementation/plan.md` — the build order
- The DNA files referenced by each milestone
- `dna/requirements.md` — invariants to satisfy

## Algorithm

For each milestone in plan.md:

1. **List the schema work first.** Database tables, indices, types.
   Most features depend on schema. Schema tasks are easy to size
   because they're concrete.

2. **Then list the API / interface work.** Endpoints, RPC methods,
   CLI commands, GraphQL operations, etc. Each endpoint is usually
   one task.

3. **Then the implementation work.** The actual logic. This is where
   tasks can get big — break further by:
   - Happy path vs edge cases
   - Success states vs error states
   - One branch per alternative path

4. **Then the integration work.** Wiring feature X to feature Y.
   Middleware, glue code, cross-cutting concerns.

5. **Then the test work.** Each requirement in `dna/requirements.md`
   becomes at least one test. Group tests by feature or by
   requirement.

6. **Finally, the deployment work.** Migrations, env vars, feature
   flags, docs.

## Task sizing

A task is too big if:
- You can't describe it in one sentence
- It would take a coding agent more than one focused session
- It depends on a decision that hasn't been made

A task is too small if:
- It's trivial (rename a function)
- It can't be tested or reviewed independently
- It doesn't produce a runnable artifact

**Right size example**: "T-005: Create users table with id (uuid), email
(text unique), password_hash (text), created_at (timestamp), updated_at
(timestamp) columns. Add migration and seed test user."

**Wrong size (too big)**: "T-005: Implement auth"
**Wrong size (too small)**: "T-005: Create the users table name
variable"

## Task format

For each task, include:

- **ID**: T-NNN (zero-padded, stable, monotonic)
- **Title**: one line, imperative ("Create users table", "Add login
  endpoint")
- **Implements**: link to the DNA file(s) this task realizes. This is
  the link back to the spec.
- **Depends on**: list of T-IDs, or "nothing"
- **Files**: list of files the task creates or modifies
- **Notes**: any decisions, edge cases, or pointers

Don't write the implementation in the task. The task is the *what*,
not the *how*. The implementing agent figures out the how.

## Ordering

Tasks are numbered in dependency order. A task depending on a schema
change cannot run before the schema task. Numbering by dependency
means the implementer can work through them sequentially.

When two tasks are independent, number them by the order in which a
human would tackle them.

## Output

Write `dna/implementation/tasks.md` using `templates/tasks.md`.

Use a checkbox list with stable IDs:

```markdown
- [ ] **T-001** — Create users table
  - Implements: [dna/domains/auth.md#features](dna/domains/auth.md)
  - Depends on: nothing
  - Files: db/migrations/0001_users.sql, db/schema/users.ts
  - Notes: email must be unique; use uuid v4 for id
```

## Commit and notify

After writing tasks.md:

1. Commit with a clear message: `tasks: initial task list`
2. Update AGENTS.md with the task summary
3. **Notify the user.** Tell them:
   - How many tasks total
   - The build order
   - The recommended way to invoke implementation (e.g., "Tell me
     'start implementing' and I'll work through T-001 → T-NNN")

The skill does not execute the tasks. It stops here. The user decides
when and how to invoke implementation.

## Common mistakes

- **Tasks without DNA links**: every task must trace back to a DNA
  file. If a task has no DNA link, it's either gold-plating or
  scope creep.
- **Tasks too granular**: "T-001 — import bcrypt" is too small. A task
  should produce a runnable artifact.
- **Tasks too vague**: "T-005 — implement user management" is too big.
  Break it down.
- **Missing tests**: each requirement in `dna/requirements.md` should
  result in at least one test task. Tests aren't optional.
- **Reordering**: don't reorder tasks after they're written. Add new
  tasks at the end with new IDs. The IDs are stable references — agents
  may have already started working on T-005.

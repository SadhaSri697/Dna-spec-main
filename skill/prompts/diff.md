# Diff & Regenerate Phase

Use this file during Phase 4 (Diff & Regenerate). Goal: when the DNA
changes, figure out what's affected, show the user the impact, and
regenerate only the affected tasks.

## When this phase runs

Triggers:

- User said "regenerate", "diff", "what's next", "regen", or similar
- Git working tree has unstaged or uncommitted changes in `dna/`
- `git log dna/` shows commits since the last plan commit
- AGENTS.md's "Current Phase" is "re-spec"

## Step 1 — Detect the change

Choose the right diff source:

```bash
# Uncommitted changes in dna/
git diff dna/

# Last committed change to dna/
git diff HEAD~1 HEAD -- dna/

# All changes since the plan was last regenerated
# (the plan commit message contains "plan: ...")
git log --oneline -- dna/
```

Prefer committed diffs. If there are uncommitted changes, mention them
in the impact report.

## Step 2 — Categorize the diff

Walk the diff and classify each change as one of:

| Change | Detection | Default impact |
|---|---|---|
| **Added** domain | New file in `dna/domains/` | Add new milestone to plan; add new tasks |
| **Removed** domain | File deleted in `dna/domains/` | Ask user: remove milestone and tasks? Or just mark deprecated? |
| **Modified** domain | File changed in `dna/domains/` | Re-examine features and tasks in that domain |
| **Added** feature | New file in `dna/features/` | Add new tasks to the relevant milestone |
| **Removed** feature | File deleted in `dna/features/` | Find tasks implementing it; mark obsolete |
| **Modified** feature | File changed | Find tasks; re-evaluate their scope |
| **Added** flow | New file in `dna/flows/` | Identify which features it touches; ensure tasks exist |
| **Modified** flow | File changed | Re-check the steps; update tasks if logic changed |
| **Added** requirement | New bullet in `dna/requirements.md` | Add a test task |
| **Removed** requirement | Removed bullet | Find related test tasks; mark obsolete |
| **Modified** requirement | Changed bullet | Find related test tasks; review |
| **Vision change** | File changed in `dna/vision.md` | Significant — re-examine plan order, may need full regen |

## Step 3 — Map changes to tasks

For each change, find the affected tasks in `dna/implementation/tasks.md`.

How:

- Tasks have an "Implements:" link back to a DNA file. Match by file.
- A modified feature may have several tasks. Check them all.
- A modified requirement may have one or more test tasks. Find them.

Build a list:

```
Impacts:
  - T-005 (Create users table) — schema may have changed
  - T-014 (Add login endpoint) — feature modified
  - T-022 (Auth tests) — requirement modified
```

## Step 4 — Produce the impact report

Show the user before regenerating. Format:

```
DNA change detected
====================

Changes:
  + Added domain: notifications
  + Added flow: welcome-email
  ~ Modified feature: login (auth/login.md)

Impact:
  + 4 new tasks for notifications (estimated)
  + 2 new tasks for welcome-email flow
  ~ 3 tasks may need revision (T-005, T-014, T-022)

OK to regenerate plan and tasks? (yes/no/review)
```

Wait for confirmation. **Never auto-regenerate without explicit "yes".**

## Step 5 — Regenerate

After confirmation:

1. **Don't touch tasks that aren't impacted.** Stability matters — agents
   may already be working on T-005. Don't renumber.
2. **Add new tasks at the end** with new IDs. Don't reuse IDs.
3. **Mark obsolete tasks explicitly.** Don't delete — add `[OBSOLETE:
   <reason>]` so implementers know not to pick them up.
4. **Revise impacted tasks in place** if the change is minor. If major,
   mark obsolete and add a replacement task.
5. **Update the plan** if milestones are added or removed.
6. **Update AGENTS.md** with the new state.

## Step 6 — Commit and notify

One logical commit per regeneration:

```bash
git add dna/
git commit -m "regen: <short summary of DNA change>"
```

Example messages:
- `regen: add notifications domain`
- `regen: revise login feature for MFA`
- `regen: tighten session-expiry requirement`

After committing, notify the user:

```
DNA regenerated. Changes:
  + 4 new tasks for notifications (T-031 .. T-034)
  + 2 new tasks for welcome-email (T-035 .. T-036)
  ~ T-014 marked obsolete; replaced by T-037

Total tasks: 36 (was 30). Next ready task: T-031.
```

## Common mistakes

- **Auto-regenerating without confirmation**: always show the impact and
  wait. The user might want to revise the spec further.
- **Renumbering existing tasks**: IDs are stable references. Add new
  ones at the end. Never renumber.
- **Deleting obsolete tasks**: mark them `[OBSOLETE]` instead. They
  are part of the spec history.
- **Touching unaffected tasks**: if a task is fine, leave it alone.
  The implementer is working from this list; surprise changes cost time.
- **Skipping the impact report**: the user needs to see what's about
  to change. Don't be silent.

## Special case: full regen

If the vision changed, or the user says "regenerate everything from
scratch":

1. Confirm: "This will rewrite plan.md and tasks.md. Existing task IDs
   may be preserved (if the same task is still needed) or marked
   obsolete. OK?"
2. Regenerate from scratch.
3. Use the same diff/commit flow.

Full regens are rare. Most changes are additive.

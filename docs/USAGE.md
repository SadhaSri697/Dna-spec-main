# Usage

> Detailed walkthrough of running DNA Spec in your project.

## Install

```bash
npx dna-spec
```

The skill is installed to `~/.pi/agent/skills/dna-spec/`. Pi loads
it on the next launch.

To install to a different location:

```bash
PI_SKILLS_DIR=./my-skills npx dna-spec install
```

## First run — new project

Open your project in Pi:

```bash
cd my-project
pi
```

Ask Pi to start a DNA:

> "Start a DNA spec for my project."

Pi will:

1. Detect no `dna/` and no `AGENTS.md` → enter Discover phase
2. Ask you about your product, one question at a time
3. After each answer, draft the corresponding DNA file and show
   it for confirmation
4. Commit each file to git as it's written
5. When all five levels are filled, auto-run Plan → Tasks
6. Update `AGENTS.md`
7. Notify you that tasks are ready

Then you (or another agent) implement the tasks.

## First run — existing project

Same command. The skill detects an existing codebase and asks
whether you want to:

- **Spec the current product** — reverse-engineer the DNA from
  what's there
- **Spec the next version** — capture intent for what's coming
  next, leave the existing code alone

Either way, the DNA captures intent, not code. The current
codebase is the implementation, the DNA is the spec.

## Resuming work

Open the project, ask Pi to "show me where we are" or
"what's next?". Pi reads `AGENTS.md` and tells you:

- Which phase you're in
- Which tasks are done
- Which is the next task
- Whether the spec has uncommitted changes that need a regen

If the spec has uncommitted changes, Pi offers to regenerate
the plan and tasks.

## Updating the spec

There are two ways to update:

1. **Talk to Pi** — "I want to add a password reset flow to the
   auth domain." Pi asks focused questions, drafts the new
   feature file, regenerates the plan and tasks.
2. **Edit the DNA directly** — open `dna/`, edit the files,
   commit. Then ask Pi to "regenerate from the spec". Pi diffs,
   shows impact, regenerates.

Either way, the regen pipeline runs and only the affected
tasks change. Stable task IDs are preserved so any agent
already working on a task isn't surprised.

## The "mini CI/CD pipeline" workflow

The DNA is in git. Every change is a commit. The regen pipeline
treats commits as events:

```
DNA commit
  ↓
git diff dna/
  ↓
impact analysis (which tasks?)
  ↓
show impact to user
  ↓
regenerate plan.md, tasks.md, AGENTS.md
  ↓
commit the regen
  ↓
notify user
```

You can run this manually (ask Pi), or wire it to a git hook
or CI workflow:

```bash
# .git/hooks/post-commit
if git diff --name-only HEAD~1 HEAD | grep -q "^dna/"; then
  echo "DNA changed. Run 'pi regenerate' to update plan and tasks."
fi
```

Or in CI:

```yaml
# .github/workflows/dna-regen.yml
on:
  push:
    paths: ['dna/**']
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "DNA changed. Open a PR or run 'pi regenerate' to update."
```

## Working with multiple agents

The DNA is the contract between agents. Agent A (you, talking
to Pi) writes the spec. Agent B (a coding agent) executes the
tasks. The handoff is the task list.

To hand off:

1. Read `AGENTS.md` to see current state
2. Read `dna/implementation/tasks.md` for the unchecked tasks
3. Tell the implementing agent: "Implement the next unchecked
   task in `dna/implementation/tasks.md`. Link to the DNA
   files for context."

The implementing agent reads the task, reads the linked DNA
files, and builds. The skill doesn't need to be running during
implementation — the DNA is enough.

## When the spec drifts

Sometimes the implementing agent discovers the spec was wrong
or incomplete. They should:

1. Stop the current task
2. Tell you: "I hit a spec issue: <description>"
3. You (with Pi) update the DNA
4. Pi regenerates the plan and tasks
5. The implementing agent resumes the updated task

This is the spec-first loop. The DNA stays the source of truth.

## When the product changes

Product pivots, new requirements, dropped features — they all
go in the DNA. The code is downstream.

1. Edit the relevant DNA files (or talk to Pi)
2. Commit the DNA change
3. Pi regenerates the plan and tasks
4. Implement the changes

If the product change is small (one feature), the regen
touches a few tasks. If the product change is big (a new
domain), the regen adds a milestone and a new batch of tasks.

## Uninstall

```bash
npx dna-spec uninstall
```

The skill files are removed. The DNA and `AGENTS.md` in your
project are untouched — they're your files, not the skill's.

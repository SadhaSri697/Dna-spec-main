# Feature: Run

**Domain**: [../../domains/executor.md](../../domains/executor.md)

## What it does

Runs a named task and all of its dependencies, in the right order,
stopping at the first failure.

## Why it exists

The whole point of `tk` is to run tasks. This is the central
feature.

## Inputs

- The task name (positional arg)
- The `tk.toml` file
- (Optional) `--parallel` flag to run independent tasks in
  parallel
- (Optional) `--jobs N` to limit parallelism (default: number of
  CPU cores)
- (Optional) `--force` to ignore the "already done" check (v1
  always re-runs; this flag is a placeholder for v2 caching)

## Outputs

- The exit code of the target task (or the first failing task)
- Live stdout/stderr from each task
- A summary at the end: "N tasks ran, M succeeded, K failed"

## Happy path

1. User runs `tk run build`
2. System parses the config and builds the dependency graph
3. System computes the topological order
4. System walks the order; for each task:
   a. Print "→ <task_name>"
   b. Spawn the task's command as a child process, inheriting
      stdin/stdout/stderr
   c. Wait for it to exit
   d. If exit code is 0, print "✓ <task_name> (1.2s)" and continue
   e. If exit code is non-zero, print "✗ <task_name> (exit N)" and
      stop the run
5. Print the summary

## Edge cases

- Task not found: print "<name> is not a defined task" and list
  available tasks
- Cycle in the graph: print the cycle (e.g. "cycle: a → b → a") and
  exit non-zero
- Empty task list (no tasks to run): print "nothing to do" and
  exit zero
- User hits Ctrl-C: terminate all running child processes, exit
  non-zero
- Task outputs to stderr: shown in the user's terminal, prefixed
  with the task name

## Permissions

Anyone. Runs commands in the user's environment.

## Tracked in flows

- [First Run](../../flows/first-run.md)
- [Failed Task](../../flows/failed-task.md)

## Implementation notes

- The executor never buffers stdout — output must be live.
- Each task runs in the same working directory as `tk` was
  invoked from.
- Environment variables: `tk` adds `TK_TASK_NAME` to the env so
  tasks can know which task they are.
- In `--parallel` mode, independent tasks run concurrently. The
  default is serial.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

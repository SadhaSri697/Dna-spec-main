# Domain: Executor

> Owns running tasks: spawning processes, capturing output, and
> handling failures.

## Purpose

Actually run the tasks. Spawn the right processes, in the right
order, with the right environment, and report back what happened.

## Scope

- Spawning child processes
- Setting environment variables (`TK_*` prefixed)
- Capturing stdout/stderr (live, to the user's terminal)
- Handling exit codes
- Parallel execution (when the graph allows)
- Stopping the run when a task fails

## Out of scope

- Remote execution (v2)
- Caching (v2)
- Watch mode (v2)
- Task-level timeout (v2)

## Depends on

- Config (reads the parsed config)
- Graph (consumes the topological order)

## Depends on us

Nothing.

## Features

- [x] [Run](../features/executor/run.md)
- [x] [Dry Run](../features/executor/dry-run.md)

## Flows

- [x] [First Run](../flows/first-run.md)
- [x] [Failed Task](../flows/failed-task.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

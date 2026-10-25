# Feature: Dry Run

**Domain**: [../../domains/executor.md](../../domains/executor.md)

## What it does

Shows the user what `tk run` would do — the order, the commands —
without actually running anything.

## Why it exists

A dry run is the cheapest way to verify a config. It catches
typos in command names, wrong dependency order, and accidental
destructive commands.

## Inputs

- The task name (positional arg)
- The `tk.toml` file
- All `tk run` flags (parallel, jobs, etc.) are honored

## Outputs

- A printed list of tasks in execution order, with their
  commands. Output looks like:
  ```
  1. lint (would run: cargo clippy)
  2. test (would run: cargo test)
  3. build (would run: cargo build --release)
  ```
- Exit code 0 (dry runs always "succeed")

## Happy path

1. User runs `tk run build --dry-run`
2. System parses the config and builds the graph
3. System computes the topological order
4. System prints the order, prefixed with the command that would
  run
5. System exits 0 without spawning any process

## Edge cases

- Cycle in the graph: same as `tk run` — print the cycle
- Task not found: same as `tk run`
- `--dry-run` combined with `--parallel`: still prints, with a
  note "(would run in parallel)"

## Permissions

Anyone. Read-only operation.

## Tracked in flows

(none — `tk run --dry-run` is a query)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

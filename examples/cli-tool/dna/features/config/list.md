# Feature: List

**Domain**: [../../domains/config.md](../../domains/config.md)

## What it does

Prints all tasks defined in `tk.toml`, along with their
descriptions and dependencies.

## Why it exists

Users forget what they configured. `tk list` is the cheatsheet.

## Inputs

- The `tk.toml` file
- (Optional) `--json` flag for machine-readable output

## Outputs

- A formatted list of tasks. Default: a table. With `--json`: a
  JSON array.

## Happy path

1. User runs `tk list`
2. System finds and parses `tk.toml`
3. System prints the tasks in declaration order, with their
  descriptions and dependencies

## Edge cases

- No `tk.toml` found: print "no tk.toml found in this directory or
  any parent" and exit non-zero
- Empty config (no tasks): print "(no tasks defined)" and exit
  zero
- Invalid TOML: print the parse error and exit non-zero

## Permissions

Anyone. Read-only operation.

## Tracked in flows

(none — `tk list` is a query, not part of a flow)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

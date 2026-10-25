# Feature: Init

**Domain**: [../../domains/config.md](../../domains/config.md)

## What it does

Creates a starter `tk.toml` in the current directory if one
doesn't already exist.

## Why it exists

New users need a starting point. Hand-writing TOML for the first
time is a barrier. `tk init` removes it.

## Inputs

- The current working directory
- (Optional) `--force` flag to overwrite an existing `tk.toml`

## Outputs

- A new `tk.toml` file in the current directory (unless one
  already exists and `--force` is not set)
- A printed message: "Created tk.toml. Run `tk list` to see
  the tasks."

## Happy path

1. User runs `tk init`
2. System checks if `tk.toml` already exists
3. If not, system writes a starter file with three example tasks
   (`build`, `test`, `lint`)
4. System prints the success message

## Edge cases

- `tk.toml` already exists: print "tk.toml already exists. Use
  --force to overwrite." and exit non-zero
- Current directory is not writable: print the OS error and exit
  non-zero
- Current directory is inside a git repo: still works, no special
  behavior in v1

## Permissions

Anyone. The user owns the directory.

## Tracked in flows

- [First Run](../../flows/first-run.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

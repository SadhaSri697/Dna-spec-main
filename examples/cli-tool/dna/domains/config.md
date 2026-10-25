# Domain: Config

> Owns the `tk.toml` file format and discovery.

## Purpose

Define the syntax and discovery rules for `tk.toml` so the same
config works the same way for every user.

## Scope

- TOML file format
- Discovery (`tk` walks up directories to find `tk.toml`)
- Validation (unknown keys, missing fields, type errors)
- The `init` command (creates a starter `tk.toml`)
- The `list` command (shows configured tasks)

## Out of scope

- JSON / YAML configs (v2)
- Environment variable interpolation in task commands (v2)
- Multiple config files per project (v2: monorepo support)

## Depends on

Nothing.

## Depends on us

- Graph (reads the config to build the task graph)
- Executor (reads the config to know what command to run)

## Features

- [x] [Init](../features/config/init.md)
- [x] [List](../features/config/list.md)

## Flows

- [x] [First Run](../flows/first-run.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

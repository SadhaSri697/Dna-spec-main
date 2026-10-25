# Vision

## Mission

`tk` is a standalone task runner. Define tasks in `tk.toml`, run
them with `tk run <name>`. Dependencies are explicit. The runner
handles ordering and parallel execution.

## Goal

A developer can drop `tk` into any project — Go, Rust, Node, Python,
anything — define their build, test, and lint tasks in a single
config file, and run them without learning a project-specific build
system.

## Philosophy

- One config file. No DSL, no plugins, no project init.
- Dependencies are explicit. The graph is the graph.
- Fail fast, fail loud. If a task fails, stop and tell the user.
- Output is for humans. Use colors. Show what's running, what's
  done, what failed.

## Non-goals

- Remote execution (no running tasks on a build farm)
- Caching (no incremental builds in v1)
- Watch mode (no `tk watch` in v1)
- Plugin system (no custom task types in v1)
- Multi-language support (no JS task files, no Python task files —
  all tasks are shell commands)

---

*When this file is updated, the dna-spec skill regenerates the plan, tasks,
and AGENTS.md. Commit the change to git.*

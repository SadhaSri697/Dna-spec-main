# Domain: Graph

> Owns the task dependency graph: parsing dependencies, detecting
> cycles, and producing topological order.

## Purpose

Translate the user's flat list of tasks-with-dependencies into an
executable order. Detect cycles so the user gets a clear error
instead of an infinite loop.

## Scope

- Build a directed graph from the config
- Detect cycles (with a clear error message pointing at the cycle)
- Produce a topological order
- Render the graph for the `graph` command (text, optionally
  dot/Graphviz)

## Out of scope

- Dynamic dependencies (no "depends on the result of another
  task" in v1)
- Conditional dependencies (no "if X, then Y" in v1)
- Task groups / namespaces (v2)

## Depends on

- Config (reads the parsed config)

## Depends on us

- Executor (consumes the topological order)

## Features

- [x] [Graph](../features/graph/graph.md)

## Flows

(none — graph is an internal step)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

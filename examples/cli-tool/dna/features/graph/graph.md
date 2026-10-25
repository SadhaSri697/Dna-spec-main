# Feature: Graph

**Domain**: [../../domains/graph.md](../../domains/graph.md)

## What it does

Prints the task dependency graph for visualization.

## Why it exists

Tasks in a complex config can be hard to reason about. A
visualization helps the user understand what depends on what.

## Inputs

- The `tk.toml` file
- (Optional) `--format text|dot` flag (default: text)

## Outputs

- A text or Graphviz dot representation of the graph

## Happy path (text)

1. User runs `tk graph`
2. System parses the config and builds the graph
3. System prints each task and its dependencies:
  ```
  build
    └─ test
       └─ lint
  release
    └─ build
  ```

## Happy path (dot)

1. User runs `tk graph --format dot`
2. System prints a Graphviz dot representation:
  ```
  digraph {
    "test" -> "build"
    "lint" -> "test"
    "build" -> "release"
  }
  ```

## Edge cases

- Cycle in the graph: print the cycle and exit non-zero
- Empty config: print "(no tasks defined)" and exit zero
- Unknown format: print "unknown format: <name>" and exit
  non-zero

## Permissions

Anyone. Read-only operation.

## Tracked in flows

(none — graph is a query)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

# Flow: First Run

## Trigger

A new user installs `tk` and wants to try it on a project.

## Goal

The user has a `tk.toml` with at least one task and has run that
task successfully.

## Pre-conditions

- `tk` is installed (`tk --version` works)
- The user is in a project directory
- The project directory is writable

## Steps

1. User runs `tk init` → see [Feature: Init](../features/config/init.md)
2. System creates a starter `tk.toml` with `build`, `test`, `lint`
3. User edits `tk.toml` to fit their project (changes the
   commands)
4. User runs `tk list` → see [Feature: List](../features/config/list.md)
5. System shows the user's tasks
6. User runs `tk run build` → see [Feature: Run](../features/executor/run.md)
7. System runs `build` and its dependencies
8. System prints the summary

## Alternative paths

- User already has a `tk.toml` from another tool: skip `tk init`,
  edit the existing file (or use `--force` to overwrite)
- User wants to preview the run first: `tk run build --dry-run` →
  see [Feature: Dry Run](../features/executor/dry-run.md)
- User wants to see the full graph: `tk graph` → see
  [Feature: Graph](../features/graph/graph.md)

## Failure modes

- `tk.toml` has invalid TOML: parser error, exit non-zero
- Task command fails: see [Failed Task](failed-task.md)
- `tk.toml` is in a parent directory the user didn't expect:
  print the path the file was found at

## Post-conditions

- The user has a `tk.toml` that fits their project
- The user has successfully run at least one task
- The user knows the four core commands: `init`, `list`, `run`,
  `graph`

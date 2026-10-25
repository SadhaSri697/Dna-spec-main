# Requirements

> Invariants. If violated, the product is broken.

## Correctness

- `tk run <name>` must execute `<name>` and every task `<name>`
  depends on, in a valid topological order.
- A cycle in the dependency graph must be detected and reported
  with the cycle path (e.g. "cycle: a → b → a") before any task
  runs.
- `tk run` must stop at the first failing task. No subsequent
  task may run after a failure.
- The exit code of `tk run` must equal the exit code of the
  failing task (or 0 on success).
- `tk run` must never leave child processes running after `tk`
  itself exits.

## Configuration

- `tk` must look for `tk.toml` in the current directory, and
  walk up the directory tree until it finds one or reaches the
  filesystem root.
- The `tk.toml` file must be valid TOML. Parsing errors must be
  reported with the line/column of the syntax error.
- Unknown top-level keys in `tk.toml` must be rejected with a
  clear error message naming the unknown key.
- Task names must be unique within a `tk.toml`. Duplicates must
  be rejected.

## Behavior

- A task's stdout must be passed through to the user's terminal
  in real time, unbuffered.
- A task's stderr must be passed through to the user's terminal
  in real time, unbuffered, prefixed with the task name.
- `tk run --parallel` must execute independent tasks concurrently,
  up to the value of `--jobs` (or the number of CPU cores by
  default).
- When `tk` is interrupted with SIGINT (Ctrl-C), all spawned
  child processes must be terminated, and `tk` must exit with a
  non-zero status.

## Performance

- Parsing `tk.toml` and building the dependency graph for a
  config with up to 1000 tasks must complete in under 100ms.
- `tk run` must add less than 50ms of overhead per task (process
  spawn time excluded).

## Portability

- The `tk` binary must work on macOS, Linux, and Windows.
- Path separators in `tk.toml` commands must work on all
  platforms (no hard-coded `/` or `\` in templates).
- `tk` must produce identical output on all platforms (modulo
  color support).

## Operational

- `tk` must emit a version string on `--version` and on every
  run (as a log line, not in stdout).
- Errors must be printed to stderr, not stdout. This is so `tk`
  can be piped.
- `tk` must never silently swallow an error. Every error path
  must print a message and exit non-zero.

## Security

- `tk` must not execute any task not declared in `tk.toml`. A
  config file is the only source of tasks.
- `tk` must not make network requests. All execution is local.
- `tk` must not write outside the current working directory
  (other than the `tk.toml` created by `tk init`).

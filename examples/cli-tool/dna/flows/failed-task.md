# Flow: Failed Task

## Trigger

A task exits with a non-zero status during `tk run`.

## Goal

The user knows exactly which task failed, why, and how to re-run
just that task.

## Pre-conditions

- `tk run` is in progress
- A task has exited with a non-zero status

## Steps

1. A task exits with non-zero status during a `tk run`
2. System marks the run as failed
3. System prints:
   ```
   ✗ <task_name> (exit <N>)
   stopped: <task_name> failed
   ```
4. System kills any in-flight child processes (in parallel mode)
5. System exits with the failing task's exit code
6. User inspects the failing task
7. User runs `tk run <task_name>` to re-run just the failing task
   and any tasks that depend on it

## Alternative paths

- User wants to continue past the failure: not supported in v1 —
  the run stops on first failure
- User wants to skip the failing task: not supported in v1
- Multiple parallel tasks fail: the system reports all of them
  and exits with the highest non-zero code

## Failure modes

- System itself crashes (signal-killed): all child processes are
  reaped, the user sees a clear "tk was interrupted" message
- Task command is not found (e.g. `cargo: command not found`):
  treated like any other non-zero exit; the OS error is in the
  task's stderr
- Task is killed by SIGTERM (Ctrl-C): same handling as a normal
  failure, but the message is "✗ <task_name> (terminated)"

## Post-conditions

- The run is in a "failed" state
- All child processes have been reaped
- The user can re-run individual tasks without re-running
  already-completed dependencies (in v1, dependencies are always
  re-run — see requirements)
- The user has a clear error message

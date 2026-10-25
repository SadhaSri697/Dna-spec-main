# Architecture

> How DNA Spec fits together — the project, the skill, and what
> happens when a user runs the skill.

## Layer 1 — the npm package

`dna-spec` is published to npm. It contains:

- `bin/dna-spec.mjs` — a Node.js CLI script (shebang, ESM)
- `skill/` — the actual Pi skill files
- `package.json` with `"bin": { "dna-spec": "./bin/dna-spec.mjs" }`

When a user runs `npx dna-spec`, npm fetches the package, finds the
`bin` entry, and runs it. The CLI is the installer.

## Layer 2 — the CLI installer

`bin/dna-spec.mjs` is a small CLI. It parses argv and dispatches to:

- `install` (default) — copy `skill/` to the user's Pi skills dir
- `update` — same as install with `--force`
- `uninstall` — remove the skill dir

The skills dir is resolved by `src/lib/paths.mjs`:

1. `--dir <path>` if given
2. `PI_SKILLS_DIR` env var
3. `~/.pi/agent/skills/` (default)

The `skill/` source is found by walking up from the script's
location until `skill/SKILL.md` is found. This handles:

- Local dev: `bin/dna-spec.mjs` → `../skill/`
- npm pack: `node_modules/dna-spec/bin/dna-spec.mjs` → `../skill/`
- Global npm: `<prefix>/lib/node_modules/dna-spec/bin/...`

The actual copy is done by `src/lib/copy-skill.mjs`, which:

- Recursively copies the source tree
- Skips files that already exist with the same content (no mtime
  churn on user edits)
- Reports copied/skipped/errored

The output is colored by `src/lib/output.mjs`, which auto-disables
color when stdout isn't a TTY or when `NO_COLOR` is set.

## Layer 3 — the skill

`skill/` is the actual deliverable. When installed, it lives at
`~/.pi/agent/skills/dna-spec/`. Pi loads it on demand based on
the description in the YAML frontmatter.

The skill is structured as:

- `SKILL.md` — main entry. Loaded when the skill triggers.
  Contains the philosophy, the phase instructions, the decision
  tree for state detection.
- `AGENTS-TEMPLATE.md` — template for the user-project
  `AGENTS.md`. Copied by the skill, not edited.
- `templates/` — DNA file templates (vision, domain, feature,
  flow, requirements, plan, tasks). The skill uses these as
  scaffolds when writing DNA files.
- `prompts/` — phase-specific prompt files (discover, plan,
  tasks, diff). The skill loads these during the corresponding
  phase. They contain detailed question banks, algorithms, and
  decision rules.
- `references/` — background context. `dna-philosophy.md` for the
  "why", `flow-examples.md` for the "what good looks like".

The skill's main `SKILL.md` tells the agent *when* to load each
phase prompt. The phase prompts tell the agent *how* to do the
phase.

## Layer 4 — the user project

When a user runs the skill in a project, the skill writes:

```
project/
├── AGENTS.md                  # session-memory index
├── dna/                       # the spec
│   ├── vision.md
│   ├── domains/
│   ├── features/
│   ├── flows/
│   ├── requirements.md
│   └── implementation/
│       ├── plan.md
│       └── tasks.md
└── ...                        # user's code (not managed by skill)
```

The DNA is committed to git by the skill as it's written. The
git history is the spec history. The diff/regen pipeline depends
on this.

## The data flow

```
                  ┌─────────────────────────────────────┐
                  │              User                    │
                  └─────────────────────────────────────┘
                              │          ▲
                  conversation│          │DNA edits
                              ▼          │
┌──────────────────────────────────────────────────────────────────┐
│                       Pi + DNA Spec Skill                        │
│                                                                  │
│   1. State detection (read AGENTS.md + dna/ tree)                │
│   2. Pick phase (Discover / Plan / Tasks / Diff)                 │
│   3. Run phase, writing files                                   │
│   4. Update AGENTS.md                                           │
│   5. Commit to git                                              │
│   6. Notify user                                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌──────────────────────────────┐
              │  dna/, AGENTS.md, .git/      │
              │  (the spec, in the project)  │
              └──────────────────────────────┘
                              │
                              │ git diff (when DNA changes)
                              ▼
              ┌──────────────────────────────┐
              │  impact analysis             │
              │  → which tasks change?       │
              │  → new tasks needed?         │
              │  → obsolete tasks?           │
              └──────────────────────────────┘
                              │
                              ▼
              ┌──────────────────────────────┐
              │  regenerated plan.md         │
              │  regenerated tasks.md        │
              │  updated AGENTS.md           │
              └──────────────────────────────┘
```

The agent never executes the implementation. It produces the
spec, the plan, the tasks, and stops. The user (or another
agent) executes when they're ready.

## Why this shape

- **CLI installer** — `npx dna-spec` is a familiar pattern. Zero
  ceremony to try it.
- **Skill file structure** — matches Pi's convention. Loads in Pi
  with no glue code.
- **Templates in the skill** — keeps the spec format consistent
  across projects. The agent drafts from the template; the
  template enforces the shape.
- **Phase prompts as separate files** — keeps `SKILL.md` scannable
  while still having detailed instructions available on demand.
  The agent loads only the prompt it needs.
- **AGENTS.md auto-generated** — the user never has to maintain
  the index by hand. The skill writes it; the user reads it.
- **Git as the spec database** — every change is recoverable.
  Diff/regen is a `git diff` away.
- **Stop after tasks** — keeps the skill a pure spec orchestrator.
  The user is in control of when and how to execute.

## Extension points

The skill is designed to be extended. Common extensions:

- **New DNA file type** — add a template under `templates/` and
  reference it in `SKILL.md` and `prompts/discover.md`.
- **New phase** — add a prompt under `prompts/` and reference it
  in `SKILL.md`'s "Phases" section.
- **Different defaults** — fork `SKILL.md` to change the
  recommended file layout or DNA shape.
- **Custom AGENTS.md fields** — extend `AGENTS-TEMPLATE.md` to
  include project-specific sections.

The skill's contract is: "given a DNA, produce a plan and tasks".
Everything else is conventions, and conventions can be customized.

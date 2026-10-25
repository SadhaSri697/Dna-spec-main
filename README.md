# DNA Spec

> **Specification-driven development for [Pi](https://github.com/earendil-works/pi-coding-agent).**
> Replace prompts with a hierarchical DNA. Conversation → DNA → Plan → Tasks → Code.

Software should not be built from prompts.
Software should be built from a hierarchical DNA specification.

The DNA is the **minimum information** required to reconstruct a production
software system. The DNA is the **source of truth**. All implementation is
derived from the DNA.

## What this is

A Pi skill (and the `npx dna-spec` CLI to install it) that:

1. **Talks to you** about what you want to build, and writes a hierarchical
   DNA spec (vision → domains → features → flows → requirements)
2. **Generates an implementation plan** with milestones, dependencies, and
   exit criteria
3. **Decomposes the plan into tasks** small enough for a coding agent to
   complete independently
4. **Maintains an `AGENTS.md`** in your project as a session-memory index
   so a future agent (or future you) can pick up where the last session
   left off
5. **Watches the DNA in git**. When you change a spec, the skill diffs,
   analyzes impact, and regenerates the affected plan and tasks — like a
   mini CI/CD pipeline for spec-driven development

The skill writes the DNA. The skill writes the plan. The skill writes the
tasks. The skill **stops there**. You (or another agent) execute the tasks
when you're ready.

## Install

**From GitHub:**

```bash
# Clone the repository
git clone https://github.com/sadhasri697/DNA-spec-main.git
cd DNA-spec-main

# Install dependencies
npm install

# Install the skill into Pi
node bin/dna-spec.mjs install
```

**Or with npx (no install needed):**

```bash
npx github:sadhasri697/DNA-spec-main --help
```

**From npm (once published):**

```bash
npx dna-spec
```

The skill lands in `~/.pi/agent/skills/dna-spec/` and Pi picks it up on
the next launch.

Other commands:

```bash
dna-spec install       # default
dna-spec update        # force-reinstall
dna-spec uninstall     # remove
dna-spec --help        # usage
```

The installer respects `PI_SKILLS_DIR` for non-default install locations
(useful in CI):

```bash
PI_SKILLS_DIR=/path/to/skills dna-spec install
```

## DNA Spec Studio (Web Frontend Dashboard)

Launch the interactive web interface:

```bash
npm run web
# Open http://localhost:3000 in your browser
```

Features:
- **Spec Explorer**: Interactive 5-level hierarchy browser (`vision.md` → `domains` → `features` → `flows` → `requirements`) with plan & task decompositions.
- **Spec Wizard**: Step-by-step visual generator to build full DNA specs with automatic invariant tracking.
- **Spec Auditor**: 100% compliance checker validating hierarchy integrity, domain boundaries, and task links.
- **Mini CI/CD Diff**: Live simulator showing how spec edits recalculate downstream tasks.
- **Interactive Terminal**: Run `npm test` (86 Vitest tests) and CLI commands with live output.

## Use

In Pi, with the skill loaded:

> "Start a DNA spec for my project."

The agent walks you through five questions (one per level), drafts each
file as you answer, and writes the DNA. When discovery is done, it auto-
generates the plan and the tasks. Then it tells you to start implementing
when you're ready.

Existing project? Same flow — the skill adapts. The DNA captures *your*
product; the plan and tasks fall out of it.

Want to change the product later? Edit the DNA, commit, and ask Pi to
"regenerate from the spec". The skill diffs, shows you the impact, and
updates only the affected tasks.

## The DNA hierarchy

| Level | Question | File |
|---|---|---|
| 0 — Vision | Why does the system exist? | `dna/vision.md` |
| 1 — Domains | What exists? | `dna/domains/<name>.md` |
| 2 — Features | What capabilities exist? | `dna/features/<domain>/<name>.md` |
| 3 — Flows | How does it behave? | `dna/flows/<name>.md` |
| 4 — Requirements | What must always be true? | `dna/requirements.md` |

Plus auto-generated:

- `dna/implementation/plan.md` — milestones, build order
- `dna/implementation/tasks.md` — small, executable tasks
- `AGENTS.md` — project root: session-memory index

The skill is opinionated about the *shape* of each file. Templates are
bundled with the skill. Use them.

## Examples

Three complete, runnable examples live in `examples/`:

- **[`saas-app`](examples/saas-app/)** — a SaaS standup bot (auth, teams,
  standups, weekly summaries)
- **[`cli-tool`](examples/cli-tool/)** — a `tk` task runner (config, graph,
  executor)
- **[`api-service`](examples/api-service/)** — a short-link API (links,
  redirect, analytics)

Each is a full DNA — read them to see the format, then start your own.

## The fundamental rule

> No code change should occur without a DNA change.

The flow is always:

```
Conversation → DNA → Plan → Tasks → Code
                  ↑
Future change:  Git diff of DNA → impact analysis → new plan/tasks
```

The DNA is authoritative. Code is downstream. If you want to change the
product, change the DNA. The plan and tasks follow.

## Project structure

```
dna-spec/                   # this repo
├── package.json            # npm pkg, npx entry
├── bin/dna-spec.mjs        # CLI: install/uninstall/update
├── src/                    # installer source
│   ├── commands/
│   │   ├── install.mjs
│   │   ├── uninstall.mjs
│   │   └── update.mjs
│   └── lib/
│       ├── copy-skill.mjs
│       ├── paths.mjs
│       └── output.mjs
├── skill/                  # THE SKILL — what gets installed
│   ├── SKILL.md            # main entry
│   ├── AGENTS-TEMPLATE.md  # template for user-project AGENTS.md
│   ├── templates/          # DNA file templates
│   ├── prompts/            # phase-specific instructions
│   └── references/         # philosophy + flow examples
├── examples/               # 3 sample DNAs
├── tests/                  # vitest
└── docs/                   # detailed docs
```

## Develop

```bash
# Install deps
npm install

# Run tests
npm test

# Watch tests
npm run test:watch

# Try the installer locally
node bin/dna-spec.mjs install --dir /tmp/test-skills --dry-run
node bin/dna-spec.mjs install --dir /tmp/test-skills
```

## License

MIT

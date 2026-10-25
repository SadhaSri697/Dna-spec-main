# Example: `tk` (Task Runner CLI)

A complete DNA example for a CLI tool: `tk`, a standalone task
runner. Define tasks in `tk.toml`, then `tk run <name>` runs the
task and its dependencies.

This example shows the same five-level hierarchy as the SaaS
example, but applied to a single-binary CLI with no users, no
teams, no billing. Notice how the DNA stays small because the
product is small — the spec adapts to the project.

- **Vision** in `dna/vision.md` — one paragraph
- **Domains** in `dna/domains/` — 3 (config, graph, executor)
- **Features** in `dna/features/<domain>/` — 5 total
- **Flows** in `dna/flows/` — 2
- **Requirements** in `dna/requirements.md`
- **Plan** in `dna/implementation/plan.md`
- **Tasks** in `dna/implementation/tasks.md`
- **Index** in `AGENTS.md`

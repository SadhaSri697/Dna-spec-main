# Example: Standup Bot (SaaS)

A complete DNA example for a SaaS product: a team standup bot. Async
standups — team members post daily updates, the bot compiles and
distributes them, and managers see weekly summaries.

This example is a **finished** DNA. It demonstrates the full hierarchy
working end-to-end:

- **Vision** in `dna/vision.md`
- **Domains** in `dna/domains/` (auth, teams, standups)
- **Features** in `dna/features/<domain>/` (6 features total)
- **Flows** in `dna/flows/` (3 flows)
- **Requirements** in `dna/requirements.md`
- **Plan** in `dna/implementation/plan.md`
- **Tasks** in `dna/implementation/tasks.md`
- **Index** in `AGENTS.md`

Use this as a reference when writing your own DNA. Notice:

- Each level refines the level above. There's no "implementation
  detail" in the upper levels.
- Files are short. The whole DNA fits on a few screens.
- The drafter pattern produced everything you see here from a
  conversation. The agent didn't invent.
- Requirements are invariants, not wishes. Every one is a test case.

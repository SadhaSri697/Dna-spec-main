# DNA Philosophy

> Reference file. Load when the skill needs to reason about *why* the DNA
> is shaped this way, or when the user pushes back on a structural choice.

## The Linux principle

Linux contains tens of millions of lines of code. The actual design
information required to create Linux is dramatically smaller. A few
hundred pages of design rationale, a small handful of architectural
decisions, and a stable set of invariants (e.g. "the kernel is
preemptible", "user memory can't access kernel memory") reconstruct
the rest.

DNA Spec applies the same compression to any product. The DNA
captures the *minimum* information needed to rebuild the product —
not the product itself.

## Maximum information, minimum tokens

The DNA is judged on two qualities:

1. **How much correct software can be reconstructed from it.** A DNA
   that produces broken code is a bad DNA, no matter how elegant.
2. **How few tokens it takes to express.** A DNA that's 50,000 words
   has failed — it's not compressed.

A good DNA is shorter than the README. Shorter than the docs. Often
shorter than the user's first onboarding doc. The information density
is the point.

## What goes in the DNA

The DNA captures four things:

- **Product intent** — why the product exists (vision)
- **Product structure** — what areas exist (domains), what capabilities
  in each (features)
- **Product behavior** — how users move through the product (flows)
- **Product constraints** — what must always be true (requirements)

These four categories are exhaustive. If something doesn't fit one
of them, it's probably an implementation detail, not a DNA fact.

## What does NOT go in the DNA

- **Generated code** — never. The DNA is upstream of the code.
- **Boilerplate** — package.json contents, env var names, framework
  choices. These are implementation decisions, not spec.
- **Inferable details** — if every domain has a "happy path" section,
  don't write a meta-rule explaining it. Use the template.
- **Time-bound information** — "we'll add X in Q3" is project state,
  not DNA. Use a separate ROADMAP.md if you need to track that.
- **Personal opinions** — "we use tabs" is a style choice. Put it in
  a CONTRIBUTING.md or .editorconfig.

## The hierarchy is a refinement chain

Each level refines the level above:

```
Vision    (why)
  ↓
Domains   (what exists)
  ↓
Features  (what capabilities)
  ↓
Flows     (how behavior chains)
  ↓
Requirements (what must always be true)
```

A level N statement is meaningful only in the context of level N-1. A
feature in a domain that doesn't exist is a typo. A flow that uses a
feature that doesn't exist is a forward reference — fix the feature
first.

## The drafter pattern

The agent's role during discovery is to *draft*, not to *author*. The
user is the authority on the product. The agent:

- Asks the user focused questions
- Drafts the corresponding DNA file from the user's words
- Shows the draft to the user
- Waits for confirmation or edits
- Writes the file
- Commits

The agent never invents requirements. If the user hasn't said it, the
DNA doesn't have it. If the user is vague, the agent asks, doesn't
guess.

## The DNA is a database

Treat `dna/` as a versioned database:

- Every change is committed
- Every change has a reason (the commit message)
- Old versions are recoverable
- The current state is derivable from history + the latest version

The diff/regen pipeline depends on this. If DNA changes are not
committed, the diff is wrong, and the regen produces nonsense.

## The fundamental rule, restated

> No code change should occur without a DNA change.

The reverse is not required — the DNA can be ahead of the code (a
spec for what's not yet built) or behind (a spec being updated to
match what's been built). The asymmetry is intentional. Code without
spec is technical debt. Spec without code is product intent.

## When the DNA is "done"

The DNA is "done" when:

- A new engineer can read it and understand the product
- A new engineer can read it and propose a sensible architecture
- A new engineer can read it and identify which features belong to
  which domains
- A new engineer can read it and know which invariants they cannot
  break

If the DNA achieves all four, the regen pipeline will produce
sensible tasks. If it doesn't, the tasks will be guesswork.

The DNA is never *finished*. Products evolve. The DNA evolves with
them. The diff/regen pipeline is how evolution stays synchronized
with intent.

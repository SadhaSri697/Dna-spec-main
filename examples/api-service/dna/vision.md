# Vision

## Mission

A short-link service. Users register, create short links, share
them, and watch click analytics.

## Goal

A user can shorten a long URL to a 6-character slug, share the
short URL, and see how many clicks it got over time.

## Philosophy

- The redirect must be fast. Anything that adds latency to the
  redirect is a bug.
- The API must be simple. Three resources (users, links,
  clicks), each with a handful of endpoints.
- Stats are eventually consistent. The redirect path is on the
  hot path; the analytics path is not.

## Non-goals

- A web UI (the API is the product; the dashboard is a future
  client)
- Custom slugs (v1: 6 random characters only)
- Link editing (v1: create and delete only)
- Multi-tenant orgs (v1: each user owns their links)
- Link expiration (v2)

---

*When this file is updated, the dna-spec skill regenerates the plan, tasks,
and AGENTS.md. Commit the change to git.*

# Feature: Click Stats

**Domain**: [../../domains/analytics.md](../../domains/analytics.md)

## What it does

Returns aggregate click stats for a link: total clicks, top
referers, top countries.

## Why it exists

The user wants a one-glance summary: "how is this link
performing?"

## Inputs

- A link ID (or slug)
- The authenticated user (must own the link)
- (Optional) Time window: `?since=2026-06-01&until=2026-06-11`
  (default: last 30 days)

## Outputs

- Total clicks in the window
- Top 10 referers (with click counts)
- Top 10 countries (with click counts)
- The window's start and end

## Happy path

1. User authenticates with an API key
2. User GETs `/v1/links/{id}/stats`
3. System queries the analytics store for clicks in the window
4. System aggregates and returns the stats
5. The dashboard renders them

## Edge cases

- Link doesn't exist: 404
- Link exists but is not owned by the user: 404 (not 403, to
  avoid leaking link existence)
- Window is in the future: 400 with a clear error
- Window is more than 1 year: clamped to 1 year
- No clicks in the window: returns zeros, not 404

## Permissions

Authenticated user. Users can only see stats for their own
links.

## Tracked in flows

- [Analytics Deep-Dive](../../flows/analytics-deep-dive.md)

## Implementation notes

- Stats are eventually consistent. There's up to a 5-minute lag
  between a click and its appearance in stats.
- The query is pre-aggregated; the analytics domain materializes
  daily rollups.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

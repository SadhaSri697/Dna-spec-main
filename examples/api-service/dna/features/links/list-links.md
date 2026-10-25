# Feature: List Links

**Domain**: [../../domains/links.md](../../domains/links.md)

## What it does

Lists the authenticated user's links, paginated.

## Why it exists

Users need to find links they've created. Browsing them is the
primary use case for the dashboard.

## Inputs

- The authenticated user (via API key)
- (Optional) Pagination: `?limit=50&cursor=<opaque>`

## Outputs

- A page of link records
- A cursor for the next page (or absent if last page)

## Happy path

1. User authenticates with an API key
2. User GETs `/v1/links?limit=50`
3. System returns up to 50 of the user's most recently created
   links, plus a cursor if there are more

## Edge cases

- User has zero links: returns an empty array (not 404)
- Cursor is invalid or expired: 400 with a clear error
- User has > 10,000 links: pagination still works, but the system
  warns in the response header
- Limit > 100: clamped to 100

## Permissions

Authenticated user. Users can only see their own links.

## Tracked in flows

(none — listing is a query, not part of a user flow)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

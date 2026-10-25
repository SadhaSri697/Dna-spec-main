# Feature: Resolve Link

**Domain**: [../../domains/redirect.md](../../domains/redirect.md)

## What it does

Given a slug, returns a 301 redirect to the long URL.

## Why it exists

The whole product: visitors click `/{slug}`, the service sends
them to the long URL.

## Inputs

- The slug (6 characters, from the URL path)
- HTTP request metadata (used for click tracking, but doesn't
  affect the response)

## Outputs

- A 301 redirect with `Location: <long_url>`
- A click event emitted to the analytics pipeline (see
  [Track Click](track-click.md))

## Happy path

1. Visitor GETs `/{slug}`
2. System looks up the link by slug
3. If found, system returns 301 with the long URL
4. System emits a click event
5. Visitor's browser follows the redirect

## Edge cases

- Slug not found: 404 with a friendly "this link doesn't exist"
  page (HTML, not JSON — the visitor is a browser, not an API
  client)
- Slug was deleted: same 404, with a slightly different message
  ("this link has been removed")
- Long URL is on a blocklist (e.g., the service discovered it's
  hosting malware post-creation): 404 with "this link is no
  longer available"
- Database is unavailable: 503 with retry-after
- Visitor's user-agent is the API's health-check: don't redirect,
  return 200 (so monitors don't follow redirects forever)

## Permissions

Public. Anyone can resolve a slug (that's the point).

## Tracked in flows

- [Link Sharing](../../flows/link-sharing.md)

## Implementation notes

- 301 (not 302) because the long URL is permanent. Caches and
  browsers will remember it.
- The lookup is a single primary-key query. It must be sub-50ms
  in p99.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

# Feature: Track Click

**Domain**: [../../domains/redirect.md](../../domains/redirect.md)

## What it does

Emits a click event for every successful redirect. This is the
input to the analytics domain.

## Why it exists

Stats are the user's way of knowing their links are working.
Without click tracking, the dashboard is empty.

## Inputs

- The slug (so we know which link was clicked)
- HTTP request metadata: user agent, referer, IP (for
  geo-lookup), timestamp

## Outputs

- A click event in the analytics event stream
- (No direct response — this is internal to the redirect path)

## Happy path

1. The redirect path resolves a slug
2. The redirect path emits a click event with the request metadata
3. The event is written to a durable queue (so a queue outage
   doesn't block the redirect)
4. The redirect returns 301

## Edge cases

- The click event queue is unavailable: the redirect still
  returns 301; the click is lost (with a metric for "lost
  clicks" so we can detect this)
- The slug is unknown: no click event is emitted (the redirect
  already 404'd before this feature ran)
- Bot user agents: tracked normally; the analytics domain
  filters bots in queries, not in the write path

## Permissions

System-initiated.

## Tracked in flows

- [Link Sharing](../../flows/link-sharing.md)

## Implementation notes

- The click event is emitted via an in-process queue with a
  100ms buffer. If the buffer fills (e.g. the analytics writer
  is down), clicks are dropped and a counter is incremented.
- The redirect path must NEVER block on click tracking. If the
  tracking is broken, redirects still work.
- IP addresses are stored as-is for 24 hours, then hashed
  (sha256 with a per-day salt) for privacy. The hash is what
  the analytics queries use.

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

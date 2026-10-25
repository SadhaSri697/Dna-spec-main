# Domain: Redirect

> Owns the public redirect endpoint. This is the hot path — every
> short link click goes through it.

## Purpose

Resolve a short slug to its long URL and redirect the visitor.

## Scope

- The public `GET /{slug}` endpoint
- 301 vs 302 choice (301 in v1: the long URL is permanent)
- Click tracking (emit an event to the analytics pipeline)
- Handling missing slugs (404)
- Handling deleted slugs (404, with a "this link has been removed"
  body — but a 301 is wrong here, so we 404)

## Out of scope

- A/B testing redirects (v2)
- Geo-based redirects (v2)
- Device-based redirects (v2)
- Captcha / bot detection (v2)
- Open Graph preview generation (v2)

## Depends on

- Links (needs a link record to redirect to)

## Depends on us

- Analytics (the click event is the analytics domain's input)

## Features

- [x] [Resolve Link](../features/redirect/resolve-link.md)
- [x] [Track Click](../features/redirect/track-click.md)

## Flows

- [x] [Link Sharing](../flows/link-sharing.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

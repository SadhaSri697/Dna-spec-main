# Domain: Links

> Owns the lifecycle of a short link. CRUD with create, list,
> delete. (No update in v1.)

## Purpose

Let users turn long URLs into short, shareable links.

## Scope

- Creating a short link (long URL → short slug)
- Listing a user's links
- Deleting a link
- Generating unique 6-character slugs (with collision retries)

## Out of scope

- Editing a link (v2)
- Custom slugs (v2)
- Bulk operations (v2)
- Link expiration (v2)
- QR code generation (v2)

## Depends on

Nothing (auth is at the API layer, not a domain).

## Depends on us

- Redirect (a link must exist before it can be resolved)
- Analytics (clicks are tracked per link)

## Features

- [x] [Create Link](../features/links/create-link.md)
- [x] [List Links](../features/links/list-links.md)

## Flows

- [x] [Link Sharing](../flows/link-sharing.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

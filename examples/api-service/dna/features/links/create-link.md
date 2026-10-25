# Feature: Create Link

**Domain**: [../../domains/links.md](../../domains/links.md)

## What it does

Lets an authenticated user create a short link from a long URL.

## Why it exists

The product's reason to exist: turning long URLs into short ones.

## Inputs

- The long URL (must be a valid http/https URL)
- The authenticated user (via API key)

## Outputs

- A new link record
- The short URL (full URL: `https://{host}/{slug}`)

## Happy path

1. User authenticates with an API key
2. User POSTs to `/v1/links` with `{"url": "https://..."}`
3. System generates a 6-character slug (random alphanumeric)
4. System checks for collision; on collision, retries (up to 5
   times)
5. System persists the link
6. System returns the link record with the short URL

## Edge cases

- Invalid URL: 400 with a clear error
- URL is on a blocklist (e.g., localhost, internal IPs, the
  service's own domain): 400 with a "URL not allowed" error
- Slug collision after 5 retries: 503 with "could not allocate
  slug, retry"
- User has hit their quota: 429 with a "quota exceeded" error
- URL is longer than 2048 chars: 400 with a "URL too long" error

## Permissions

Authenticated user. Each user has a per-month quota (default:
1000 links/month for free tier).

## Tracked in flows

- [Link Sharing](../../flows/link-sharing.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

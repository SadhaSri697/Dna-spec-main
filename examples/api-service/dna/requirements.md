# Requirements

> Invariants. If violated, the product is broken.

## Correctness

- A slug is exactly 6 characters, drawn from `[a-z0-9]`.
- A slug is unique across the system. On creation, the slug
  generator must retry on collision up to 5 times; on the 6th
  collision, return 503.
- The redirect `GET /{slug}` must return 301 with the link's
  long URL when the link exists.
- The redirect `GET /{slug}` must return 404 when the slug
  doesn't exist or the link was deleted.
- A user can only read, list, or delete their own links. Any
  attempt to access another user's link returns 404, not 403.

## Security

- The redirect endpoint must reject slugs that resolve to URLs
  on the service's own domain (no infinite loops), to private
  IP ranges (RFC 1918), or to localhost. The check happens at
  link creation, not at redirect time.
- API keys must be hashed with bcrypt (cost factor ≥ 10) before
  storage. Plaintext API keys must never be written to disk or
  logs.
- The `Authorization: Bearer <key>` header is the only accepted
  auth method. Query-string keys are rejected.
- IP addresses in click events are hashed within 24 hours
  (sha256 with a per-day salt). The plaintext is never
  retained.
- Rate limit: 100 requests per minute per API key, 10 link
  creations per minute per API key.

## Performance

- The redirect endpoint must have a p99 latency under 50ms.
- The redirect path must not block on click tracking. If the
  click queue is full, the click is dropped and counted; the
  redirect still returns within 50ms.
- The list-links endpoint must return the first page in under
  200ms for users with up to 10,000 links.
- The stats endpoint must return in under 500ms for any
  link with up to 1M clicks.

## Data integrity

- A link's `created_at` and `long_url` are immutable. There is
  no update endpoint in v1.
- Deleting a link must cascade: clicks for that link remain
  (anonymized) for analytics history, but the link is gone
  from `links` and unreachable via the redirect.
- Clicks must be persisted at-least-once. Duplicates are
  acceptable (the analytics pipeline deduplicates by
  `(link_id, timestamp, ip_hash)`).

## Privacy

- User emails are never exposed in API responses. The user
  record is keyed by user ID.
- IP addresses in click events are stored for 24 hours, then
  replaced with their hash. The plaintext is not retained.
- API keys are returned exactly once at creation. There is no
  "view my key" endpoint.

## Reliability

- The redirect endpoint must serve a 200 (with a generic
  message) when the database is unavailable, after a 2-second
  timeout. The product is useless if the redirect is down, so
  we degrade gracefully rather than 5xx.
- Stats queries can return 503 if the analytics store is
  unavailable. Stats are not on the hot path.
- All endpoints must be horizontally scalable. No in-process
  state, no sticky sessions.

## Operational

- The service must emit structured logs including request ID,
  endpoint, status, and latency.
- The service must emit metrics: requests per second, p50/p99
  latency, error rate, queue depth for click events, dropped
  clicks.
- The service must support zero-downtime deploys: new versions
  are rolled out gradually; old versions continue serving
  during rollout.

## Compliance

- The service must support a "user deletes their account" flow
  that removes the user, their links, and their click data
  (anonymized).
- A data export endpoint must return a JSON archive of the
  user's account, links, and click history within 24 hours of
  a verified request.

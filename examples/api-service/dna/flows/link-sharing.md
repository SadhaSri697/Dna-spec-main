# Flow: Link Sharing

## Trigger

A user creates a short link and shares it with someone.

## Goal

The link is short, the recipient clicks it, and the recipient
ends up on the long URL.

## Pre-conditions

- User has an account and an API key
- User is within their monthly quota

## Steps

1. User authenticates with an API key
2. User POSTs to `/v1/links` with the long URL
   → see [Feature: Create Link](../features/links/create-link.md)
3. System creates the short link, returns the short URL
4. User copies the short URL and shares it (in email, on social
   media, in a doc — outside the system)
5. Recipient clicks the short URL
6. Recipient's browser GETs `/{slug}`
   → see [Feature: Resolve Link](../features/redirect/resolve-link.md)
7. System returns 301 to the long URL
8. System emits a click event → see [Feature: Track Click](../features/redirect/track-click.md)
9. Recipient's browser follows the redirect to the long URL
10. Recipient lands on the long URL

## Alternative paths

- Recipient's browser is a privacy-focused one that blocks
  redirects: the system returns the long URL in the body of the
  301 response (some browsers do this)
- Recipient clicks the link on a phone that strips referer: the
  click is tracked with referer=(direct)
- The link was deleted between share and click: 404 (see
  [Resolve Link edge cases](../features/redirect/resolve-link.md))

## Failure modes

- System is down when recipient clicks: 503; the browser retries
  on its own
- Long URL is unreachable when recipient follows: this is a
  problem with the long URL, not the service. The redirect
  succeeded.
- Click event queue is unavailable: the redirect still works;
  the click is dropped (and counted)

## Post-conditions

- The link exists with one new click
- The recipient is on the long URL
- Analytics are eventually consistent (the click will show up
  in stats within 5 minutes)

# Flow Examples

> Reference file. Load when the skill needs to see concrete examples of
> well-formed flows. Use as a model for the user when they're writing
> or reviewing flow files.

A flow is a journey. It always starts with a trigger, ends with a
user-observable state, and crosses multiple features. Below are
worked examples across three product types.

---

## Example 1: SaaS — User Onboarding

A typical SaaS app's most important flow. Triggered by a brand-new
user. The end state is "they've used the product at least once".

### Trigger
A new user signs up (email/password or OAuth).

### Goal
The user has signed up, verified their email, completed any required
profile setup, and performed at least one meaningful action in the
product (a "first value moment").

### Pre-conditions
- The user has no existing account
- The product is reachable

### Steps
1. User visits `/signup` → see [Feature: Signup](../../features/auth/signup.md)
2. User submits email and password
3. System creates the account
4. System sends verification email → see [Feature: Email Verification](../../features/auth/email-verification.md)
5. User clicks the link in the verification email
6. System marks the email as verified
7. System redirects to `/welcome` → see [Feature: Onboarding Wizard](../../features/onboarding/wizard.md)
8. User completes the wizard (workspace name, role, optional avatar)
9. System creates the workspace
10. System redirects to the dashboard
11. User performs one core action (e.g. creates their first project,
    sends their first message, uploads their first file — depends on
    the product)

### Alternative paths
- OAuth signup: skip steps 2-6, use the provider's identity
- Invited user: signup link includes a workspace invite, skip wizard
  if it's a join-existing-workspace flow

### Failure modes
- Email already registered: redirect to login with a friendly message
- Verification link expired: offer to resend
- Wizard abandoned: send reminder email, save partial progress
- First action not taken within N days: trigger re-engagement
  campaign

### Post-conditions
- User has a verified account
- User has at least one workspace
- User has performed at least one action (tracked via analytics)
- User is in the "active" cohort, not "dormant"

---

## Example 2: CLI Tool — Plugin Install

A typical CLI tool's mid-life flow. The user has the tool, they want
to extend it with a plugin.

### Trigger
User runs `<tool> plugin install <name>` or `<tool> plugin add <name>`.

### Goal
The plugin is installed, enabled, and verified to load. The user can
immediately use commands/features added by the plugin.

### Pre-conditions
- The CLI is installed (`<tool> --version` works)
- The plugin name is valid (resolves on the registry)
- The plugin is compatible with the current CLI version
- The user has install permission (some plugins need sudo / global
  state)

### Steps
1. User runs the install command
2. System resolves the plugin name → see [Feature: Plugin Registry](../../features/plugins/registry.md)
3. System checks version compatibility → see [Feature: Plugin Registry](../../features/plugins/registry.md)
4. System downloads the plugin package
5. System verifies the package signature/checksum
6. System installs to the user's plugin directory
7. System registers the plugin in `<tool> plugin list`
8. System loads the plugin in a sandbox
9. System runs the plugin's `verify` hook (if defined)
10. System prints a success message with any new commands

### Alternative paths
- Plugin already installed: update instead of install
- Version incompatible: print error with required version, suggest
  upgrade
- User installs for a project only: install to `./.tool/plugins/` not
  `~/.tool/plugins/`

### Failure modes
- Network error during download: retry with backoff
- Signature invalid: refuse to install, warn the user
- Verify hook fails: roll back the install
- Plugin crashes during load: mark as broken, offer to disable

### Post-conditions
- Plugin is in the install list
- Plugin's commands are available
- Plugin is enabled by default (unless the user passes `--disabled`)
- Telemetry: install event recorded

---

## Example 3: API Service — Webhook Delivery

A backend flow that nobody sees, but is critical. The system has to
deliver a webhook to a customer's endpoint. The customer needs to
trust the delivery.

### Trigger
A domain event occurs in the system (e.g., "payment.succeeded") and
a customer is subscribed to that event.

### Goal
The customer's endpoint received the webhook, returned 2xx, and the
delivery is marked as completed. If the customer's endpoint failed,
the system retries with backoff.

### Pre-conditions
- Customer has registered a webhook URL for this event type
- Customer's URL is reachable (passed initial health check at
  registration time)
- The event payload can be serialized to JSON
- The customer's URL has not been blacklisted (e.g., SSRF protection
  blocks internal IPs)

### Steps
1. System serializes the event to JSON
2. System computes the signature (HMAC-SHA256 with the customer's
   secret)
3. System enqueues the delivery → see [Feature: Webhook Queue](../../features/webhooks/queue.md)
4. Worker dequeues the delivery
5. Worker sends POST to the customer URL with headers:
   `X-Signature`, `X-Event-Type`, `X-Delivery-Id`
6. Worker awaits response
7. If 2xx: mark delivery as completed → see [Feature: Delivery Tracking](../../features/webhooks/tracking.md)
8. If non-2xx: increment attempt count, schedule retry with
   exponential backoff

### Alternative paths
- Customer URL is slow: timeout after 30s, treat as failure
- Customer URL is in test mode: deliver to a test endpoint with
  shorter retries
- Manual replay: customer can re-deliver a past event from the
  dashboard

### Failure modes
- Customer URL returns 5xx: retry with backoff (1m, 5m, 30m, 2h, 12h)
- Customer URL returns 4xx: retry once more, then mark as failed
  (4xx is usually a customer bug, not a transient issue)
- Customer URL is unreachable: mark as failed after 24h
- Customer URL is blacklisted (e.g., points to internal IP):
  immediate failure, security event logged

### Post-conditions
- Delivery is in a terminal state (success or final-failure)
- Customer can see delivery history with request/response
- Failed deliveries are eligible for manual replay
- Telemetry: delivery latency, success rate per customer tracked

---

## Anatomy of a good flow

Looking at the examples above, every flow has:

- A **trigger** that's specific (not "user does something" but "user
  runs `X` command" or "user clicks Y button")
- A **goal** that's observable (not "system processes" but "user
  can now do Z")
- **Pre-conditions** that gate the flow (auth, plan, data state)
- **Steps** that reference features by file link, not by inline
  description
- **Alternative paths** for non-default but valid journeys
- **Failure modes** that say what the user/customer sees
- **Post-conditions** that capture the new invariants after the flow

If a flow is missing any of these sections, the drafter pattern
should catch it during discovery and the user should fill it in.

## Anti-patterns

- **A flow with no clear trigger** — "the system does X" isn't a
  flow, it's a background process. Flows always have a user.
- **A flow that duplicates a feature** — if a flow's only step is
  "user does X", X is a feature, not a flow. The flow should chain
  multiple features.
- **A flow with implementation details** — "the system calls
  `db.users.insert()`" is not a flow step. Reference the feature
  instead.
- **A flow that's actually a state diagram** — flows are sequences,
  not graphs. If you have branches, list them as alternative paths.
- **A flow that doesn't end** — every flow has a goal and a
  post-condition. If yours doesn't, it's not done.

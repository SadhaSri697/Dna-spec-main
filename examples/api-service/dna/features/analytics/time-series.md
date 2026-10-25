# Feature: Time Series

**Domain**: [../../domains/analytics.md](../../domains/analytics.md)

## What it does

Returns daily click counts for a link, ordered by date, for
charting.

## Why it exists

Users want to see trends. A single total doesn't tell you if
clicks are growing, declining, or spiking.

## Inputs

- A link ID
- The authenticated user
- (Optional) Time window: `?since=...&until=...` (default: last
  30 days)
- (Optional) Granularity: `?granularity=day|hour` (default: day)

## Outputs

- An array of `{date, clicks}` pairs in chronological order

## Happy path

1. User authenticates with an API key
2. User GETs `/v1/links/{id}/stats/timeseries?granularity=day`
3. System returns the daily click counts

## Edge cases

- Days with zero clicks are still in the response (with
  `clicks: 0`) — gaps make charting harder
- Hour granularity only available for the last 7 days; older
  data is daily-only
- Window > 1 year: clamped to 1 year
- Granularity=hour with window > 7 days: clamped to 7 days

## Permissions

Authenticated user. Users can only see time series for their
own links.

## Tracked in flows

- [Analytics Deep-Dive](../../flows/analytics-deep-dive.md)

---

*This file is part of the DNA. Edit it when the feature shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

# Domain: Analytics

> Owns click stats. Reads from the click event stream, aggregates
> by time, and exposes them via API.

## Purpose

Let users see how their links are performing over time.

## Scope

- Total clicks per link
- Clicks per day (time series)
- Clicks by referer (top N referers)
- Clicks by country (top N countries)

## Out of scope

- Real-time stats (v1: 5-minute lag is acceptable)
- Per-visitor analytics (v1: anonymous, aggregate only)
- Conversion tracking (v2)
- Funnel analytics (v2)

## Depends on

- Redirect (clicks are produced by the redirect path)

## Depends on us

Nothing.

## Features

- [x] [Click Stats](../features/analytics/click-stats.md)
- [x] [Time Series](../features/analytics/time-series.md)

## Flows

- [x] [Analytics Deep-Dive](../flows/analytics-deep-dive.md)

---

*This file is part of the DNA. Edit it when the domain shape changes. The
dna-spec skill will regenerate plan.md, tasks.md, and AGENTS.md.*

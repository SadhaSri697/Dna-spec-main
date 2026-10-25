# Flow: Analytics Deep-Dive

## Trigger

A user wants to understand how one of their links is performing.

## Goal

The user has a clear picture: total clicks, daily trend, top
referers, top countries.

## Pre-conditions

- User is authenticated
- User has at least one link
- The link has at least one click (or the flow is still useful
  for confirming "no clicks yet")

## Steps

1. User GETs `/v1/links` to find the link of interest
   → see [Feature: List Links](../features/links/list-links.md)
2. System returns the user's links
3. User GETs `/v1/links/{id}/stats`
   → see [Feature: Click Stats](../features/analytics/click-stats.md)
4. System returns the summary stats
5. User GETs `/v1/links/{id}/stats/timeseries?granularity=day`
   → see [Feature: Time Series](../features/analytics/time-series.md)
6. System returns the daily counts
7. User renders a chart and a summary panel

## Alternative paths

- User wants hourly granularity for a recent spike: query
  `?granularity=hour&since=<7 days ago>`
- User wants to compare two links: run the same queries for each
  link, render side-by-side
- User wants to export: query the same endpoints, format as CSV
  or JSON

## Failure modes

- Analytics store is unavailable: the API returns 503; the
  dashboard shows "stats temporarily unavailable"
- The link has zero clicks: stats are all zeros, not 404
- The link was deleted: 404 (the user shouldn't be able to
  see stats for a deleted link)

## Post-conditions

- The user has a clear view of how the link is performing
- The user can make decisions: "should I share this more?",
  "is this clickbait?", "what's working?"

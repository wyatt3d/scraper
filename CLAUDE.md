# Scraper - Web Automation & Structured API Platform

## Overview
Production-grade platform combining Parse.bot's deterministic API generation with Notte's AI-powered browser agent capabilities. Built with Next.js 15 + React 19 + shadcn/ui + Tailwind CSS v4.

## Stack
- **Framework:** Next.js 15 (App Router)
- **UI:** shadcn/ui (new-york style), Tailwind CSS v4, Lucide icons
- **Fonts:** Crimson Text (serif headings), Inter (body)
- **State:** React hooks + URL state
- **Deployment:** Vercel

## Architecture
```
app/
  page.tsx              — Landing page (marketing)
  (auth)/               — Auth pages (sign-in, sign-up)
  (dashboard)/          — Dashboard layout with sidebar
    dashboard/          — Overview
    flows/              — Flow/agent management
    flows/[id]/         — Flow builder/editor
    runs/               — Run history & logs
    api-keys/           — API key management
    settings/           — User/team settings
    monitoring/         — Change detection & alerts
  (docs)/               — Documentation pages
  api/                  — API routes
    flows/              — CRUD for flows
    runs/               — Trigger & list runs
    scrape/             — Scraping endpoint
    extract/            — Structured extraction
lib/
  types.ts              — Core type definitions
  mock-data.ts          — Demo data for UI
  engine/               — Scraping engine abstractions
components/
  ui/                   — shadcn primitives
  dashboard/            — Dashboard-specific components
  landing/              — Landing page sections
  flow-builder/         — Chat-based flow editor
```

## Conventions
- No emojis in code
- No unnecessary comments
- Use `cn()` from lib/utils for class merging
- Blue-600 as primary accent color
- Serif font for headings, sans for body
- All pages must support dark mode

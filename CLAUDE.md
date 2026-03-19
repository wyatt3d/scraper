# Scraper - Web Automation & Structured API Platform

## Overview
Production-grade platform combining Parse.bot's deterministic API generation with Notte's AI-powered browser agent capabilities. Built with Next.js 15 + React 19 + shadcn/ui + Tailwind CSS v4.

## Stack
- **Framework:** Next.js 15 (App Router)
- **UI:** shadcn/ui (new-york style), Tailwind CSS v4, Lucide icons
- **Fonts:** Crimson Text (serif headings), Inter (body)
- **State:** React hooks + URL state
- **Backend:** Supabase (Postgres + Auth), Stripe, Resend
- **Deployment:** Vercel

## Architecture
```
app/
  page.tsx              — Landing page (marketing)
  (auth)/               — Auth pages (sign-in, sign-up)
  (dashboard)/          — Dashboard layout with sidebar (34 pages)
    dashboard/          — Overview + customize
    flows/              — Flow management, builder, generator
    flows/[id]/         — Flow editor with steps, preview, runs, API, settings tabs
    runs/               — Run history, logs, comparison
    monitoring/         — Change detection & alerts
    analytics/          — Usage analytics with charts
    api-keys/           — API key management
    settings/           — User/team/billing settings
    playground/         — Interactive scraping playground
    templates/          — Template gallery
    workflow-builder/   — Visual node-based workflow editor
    marketplace/        — Flow marketplace with ratings
    webhooks/           — Webhook management
    integrations/       — Third-party integrations (Slack, Discord, etc.)
    + 15 more pages (secrets, sessions, proxies, pipelines, etc.)
  (admin)/              — Admin panel (13 pages)
    admin/              — Dashboard, users, teams, roadmap, ops, system health
    admin/red-team/     — Security audit findings
    admin/blue-team/    — Remediation tracking
    admin/ops/          — Automation runbook for Claude Code cron jobs
  (docs)/               — Documentation site
  api/                  — API routes (19 endpoints)
    flows/, runs/       — CRUD for flows and runs
    extract/, generate/ — AI-powered scraping + flow generation
    suggest-selectors/  — AI selector suggestion
    suggest-schema/     — NL-to-extraction-schema
    jobs/               — Job queue management
    keys/, webhooks/    — API keys and webhooks
    + health, audit, analytics, tickets, admin, checkout, email
lib/
  supabase.ts           — Server-side Supabase client (anon key)
  supabase-browser.ts   — Browser Supabase client (@supabase/ssr)
  supabase-middleware.ts — Middleware Supabase client (cookie-based auth)
  auth.ts               — Auth helpers (signIn, signUp, signOut)
  queue.ts              — Supabase-backed job queue with atomic operations
  api-auth.ts           — API key validation (SHA-256 hash verification)
  mappers.ts            — Shared toFlow/toRun data mappers
  format.ts             — Shared formatDuration/timeAgo utilities
  error-tracking.ts     — ErrorTracker with Supabase audit persistence
  types.ts              — Core type definitions
  engine/
    scraper.ts          — Cheerio HTTP scraping engine
    runner.ts           — Flow execution engine (Playwright + fallback)
  stripe.ts, email.ts   — Stripe checkout, Resend email
  mock-data.ts          — Demo data (being replaced with real Supabase)
  schema-complete.sql   — Complete PostgreSQL schema (12 tables + functions)
components/
  ui/                   — shadcn primitives
  dashboard/            — Dashboard components (sidebar, header, data-viewer, etc.)
  landing/              — Landing page sections
  auth/                 — Auth provider + context
  brand/                — Logo components
```

## Conventions
- No emojis in code
- No unnecessary comments
- Use `cn()` from lib/utils for class merging
- Blue-600 as primary accent color
- Serif font for headings, sans for body
- All pages must support dark mode

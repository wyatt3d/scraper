"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Terminal, Clock, Zap, Shield, Paintbrush, Accessibility, Server, FileSearch, RotateCcw } from "lucide-react"

function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          aria-label={`Copy ${label}`}
          onClick={() => {
            navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      <pre className="bg-zinc-950 text-zinc-100 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">{content}</pre>
    </div>
  )
}

const cronJobs = [
  {
    id: "continuous-improvement",
    name: "Continuous Improvement Engine",
    icon: RotateCcw,
    interval: "Every 10 minutes",
    description: "Deploys 2-3 specialized expert agents each cycle to find and fix issues. Rotates focus areas: security, API quality, frontend, performance, dark mode, accessibility. Build-tests, commits, and pushes if green.",
    prompt: `Audit/scrutinize the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper and aggressively improve. Deploy 2-3 specialized expert agents in parallel to find and FIX concrete issues (not just report -- actually write the code). Focus areas rotate each cycle: security hardening, API robustness, frontend quality, performance optimization, dark mode fixes, accessibility. Build-test with \`npx next build\`. If build passes, commit and push with a descriptive message. Update the admin roadmap page at app/(admin)/admin/roadmap/page.tsx to reflect what was fixed. Every cycle must produce a git commit with tangible improvements. Prioritize remaining audit findings: converting client pages to server components, proper RLS policies with user_id columns, missing aria-labels, shared data cache layer, real data replacing mock data, API response consistency.`,
    setup: `/loop 10m Audit/scrutinize the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper and aggressively improve. Deploy 2-3 specialized expert agents in parallel to find and FIX concrete issues (not just report -- actually write the code). Focus areas rotate each cycle: security hardening, API robustness, frontend quality, performance optimization, dark mode fixes, accessibility. Build-test with \`npx next build\`. If build passes, commit and push with a descriptive message. Update the admin roadmap page at app/(admin)/admin/roadmap/page.tsx to reflect what was fixed. Every cycle must produce a git commit with tangible improvements. Prioritize remaining audit findings: converting client pages to server components, proper RLS policies with user_id columns, missing aria-labels, shared data cache layer, real data replacing mock data, API response consistency.`,
  },
  {
    id: "security-sweep",
    name: "Security Sweep",
    icon: Shield,
    interval: "Every 30 minutes",
    description: "Deep security audit focused on auth, injection vectors, SSRF, XSS, and dependency vulnerabilities. Fixes issues in-place.",
    prompt: `You are a senior security engineer. Audit the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Focus on: 1) Auth bypass vectors in middleware.ts and API routes 2) Input validation gaps (XSS, injection) 3) Supabase RLS policy coverage 4) Secrets exposure 5) Dependency CVEs. For each finding, FIX it immediately -- don't just report. Build-test with \`npx next build\`, commit and push if green.`,
    setup: `/loop 30m You are a senior security engineer. Audit the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Focus on: 1) Auth bypass vectors in middleware.ts and API routes 2) Input validation gaps (XSS, injection) 3) Supabase RLS policy coverage 4) Secrets exposure 5) Dependency CVEs. For each finding, FIX it immediately -- don't just report. Build-test with \`npx next build\`, commit and push if green.`,
  },
  {
    id: "frontend-polish",
    name: "Frontend Polish",
    icon: Paintbrush,
    interval: "Every 20 minutes",
    description: "Targets dark mode contrast, accessibility gaps, missing loading states, stale UI patterns, and component quality.",
    prompt: `You are a senior frontend engineer. Improve the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Find and fix dark mode contrast issues (text-blue-600 without dark: variant, hardcoded colors) 2) Add missing aria-labels to icon-only buttons 3) Convert unnecessary "use client" pages to server components 4) Add missing loading.tsx / error.tsx boundaries 5) Replace mock data with real API calls 6) Fix stale mutation patterns (local-only state changes that don't persist). Make the changes, build-test, commit and push.`,
    setup: `/loop 20m You are a senior frontend engineer. Improve the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Find and fix dark mode contrast issues (text-blue-600 without dark: variant, hardcoded colors) 2) Add missing aria-labels to icon-only buttons 3) Convert unnecessary "use client" pages to server components 4) Add missing loading.tsx / error.tsx boundaries 5) Replace mock data with real API calls 6) Fix stale mutation patterns (local-only state changes that don't persist). Make the changes, build-test, commit and push.`,
  },
  {
    id: "api-hardening",
    name: "API Hardening",
    icon: Server,
    interval: "Every 30 minutes",
    description: "Standardizes API error responses, adds input validation, improves type safety, and ensures all endpoints handle edge cases.",
    prompt: `You are a senior backend engineer. Harden the API layer of the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Standardize error response format across all API routes to \`{ error: string }\` with correct HTTP status codes 2) Add Zod input validation to POST/PATCH endpoints 3) Replace \`as unknown as\` type assertions with runtime validation 4) Add rate limiting integration (Upstash Redis) 5) Ensure all mutations call the real Supabase API, not just local state 6) Add user_id column support for multi-tenancy. Make the changes, build-test, commit and push.`,
    setup: `/loop 30m You are a senior backend engineer. Harden the API layer of the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Standardize error response format across all API routes to \`{ error: string }\` with correct HTTP status codes 2) Add Zod input validation to POST/PATCH endpoints 3) Replace \`as unknown as\` type assertions with runtime validation 4) Add rate limiting integration (Upstash Redis) 5) Ensure all mutations call the real Supabase API, not just local state 6) Add user_id column support for multi-tenancy. Make the changes, build-test, commit and push.`,
  },
  {
    id: "perf-optimization",
    name: "Performance Optimization",
    icon: Zap,
    interval: "Every 30 minutes",
    description: "Reduces bundle sizes, optimizes queries, improves caching, converts client components to server components where possible.",
    prompt: `You are a senior performance engineer. Optimize the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Convert static admin pages from "use client" to server components 2) Add explicit .select() field lists to remaining Supabase queries using select("*") 3) Optimize heavy pages (settings 226kB, sign-in 216kB, landing 193kB) by extracting client islands 4) Add dynamic imports for heavy chart/form libraries 5) Improve Supabase query patterns (replace O(N*M) analytics with GROUP BY). Make the changes, build-test, commit and push.`,
    setup: `/loop 30m You are a senior performance engineer. Optimize the scraper.bot codebase at C:\\Users\\wyatt\\Documents\\scraper. Each cycle pick 2-3 of: 1) Convert static admin pages from "use client" to server components 2) Add explicit .select() field lists to remaining Supabase queries using select("*") 3) Optimize heavy pages (settings 226kB, sign-in 216kB, landing 193kB) by extracting client islands 4) Add dynamic imports for heavy chart/form libraries 5) Improve Supabase query patterns (replace O(N*M) analytics with GROUP BY). Make the changes, build-test, commit and push.`,
  },
]

const quickStart = `# Quick Start: Launch All Cron Jobs
# Paste this entire block into Claude Code terminal

${cronJobs.map(j => j.setup).join("\n\n")}`

const singleLoop = `# Quick Start: Single Unified Loop (recommended)
# One loop that covers everything, rotating focus each cycle

${cronJobs[0].setup}`

export default function OpsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Ops Center</h1>
        <p className="text-muted-foreground mt-1">
          Claude Code automation runbook -- copy prompts to start continuous improvement agents
        </p>
      </div>

      <Card className="border-blue-600/30 dark:border-blue-400/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="size-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Quick Start</CardTitle>
          </div>
          <CardDescription>
            Open Claude Code in the scraper project directory and paste one of these to begin.
            Loops are session-only -- they stop when the terminal closes. Auto-expire after 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CopyBlock label="Single Unified Loop (recommended)" content={singleLoop} />
          <CopyBlock label="All Specialized Loops" content={quickStart} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {cronJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <job.icon className="size-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg">{job.name}</CardTitle>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {job.interval}
                </Badge>
              </div>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <CopyBlock label="Slash command" content={job.setup} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileSearch className="size-4 text-blue-600 dark:text-blue-400" />
                1. Audit
              </div>
              <p className="text-sm text-muted-foreground">
                Each cycle, specialized expert agents scan the codebase for issues in their domain --
                security vulnerabilities, performance bottlenecks, accessibility gaps, dead code, etc.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Zap className="size-4 text-blue-600 dark:text-blue-400" />
                2. Fix
              </div>
              <p className="text-sm text-muted-foreground">
                Agents write actual code fixes -- not just reports. Every change is build-tested
                with <code className="text-xs bg-muted px-1 rounded">npx next build</code> before committing.
                If the build fails, fixes are adjusted until it passes.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Accessibility className="size-4 text-blue-600 dark:text-blue-400" />
                3. Ship
              </div>
              <p className="text-sm text-muted-foreground">
                Passing changes are committed with descriptive messages and pushed to origin.
                Vercel auto-deploys. The roadmap page is updated to track progress.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Remaining Audit Findings</CardTitle>
          <CardDescription>Priority items for the continuous improvement engine to address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { category: "Security", items: ["Proper RLS policies with user_id columns on all tables", "Real API key DB validation in route handlers", "CSRF token validation on state-changing routes", "Rate limiting via Upstash Redis (current in-memory is dead on serverless)"] },
              { category: "Architecture", items: ["Convert ~15 static admin pages from client to server components", "Convert landing page to server component with client islands", "Shared data cache layer (SWR/React Query) for cross-page invalidation", "Replace O(N*M) analytics with SQL GROUP BY"] },
              { category: "Frontend", items: ["Replace remaining mock data with real Supabase calls (templates, activity, settings billing)", "Wire mutations to actual API calls (pause flow, acknowledge alert, save settings)", "Add error.tsx boundaries to (admin), (docs), (auth) route groups", "Add ThemeProvider to root layout for global dark mode"] },
              { category: "Quality", items: ["Enable TypeScript strict mode (remove ignoreBuildErrors)", "Enable ESLint during builds (remove ignoreDuringBuilds)", "Standardize API response envelope format across all routes", "Generate Supabase types with supabase gen types typescript"] },
            ].map((group) => (
              <div key={group.category} className="space-y-2">
                <h3 className="font-semibold text-sm">{group.category}</h3>
                <ul className="space-y-1">
                  {group.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/50 mt-0.5">--</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

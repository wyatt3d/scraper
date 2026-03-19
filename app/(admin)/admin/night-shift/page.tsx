"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, FileCode, CheckCircle2, Circle, AlertCircle, GitCommit } from "lucide-react"

type TeamStatus = "COMPLETE" | "IN PROGRESS" | "PLANNED"

interface TeamReport {
  team: string
  division: string
  title: string
  status: TeamStatus
  timestamp?: string
  completed: string[]
  files?: string[]
  notes?: string
}

const statusBadge: Record<TeamStatus, { className: string }> = {
  COMPLETE: { className: "bg-emerald-600 text-white border-emerald-600" },
  "IN PROGRESS": { className: "bg-blue-600 text-white border-blue-600" },
  PLANNED: { className: "bg-gray-500 text-white border-gray-500" },
}

const reports: TeamReport[] = [
  {
    team: "CTO Office",
    division: "Architecture",
    title: "Architecture & Infrastructure",
    status: "COMPLETE",
    timestamp: "10:15 PM EST",
    completed: [
      "Project initialization and GitHub repository setup (wyatt3d/scraper)",
      "Vercel deployment configuration (vercel.json) and production deploy",
      "Core type system (lib/types.ts) - Flow, Run, ApiKey, MonitorAlert, FlowTemplate",
      "Mock data layer (lib/mock-data.ts) with 6 flows, 5 runs, 3 API keys, 4 alerts, 8 templates",
      "Utility functions (lib/utils.ts) with cn() class merger",
      "Domain setup: scraper.bot, www.scraper.bot, admin.scraper.bot configured on Vercel",
    ],
    files: ["lib/types.ts", "lib/mock-data.ts", "lib/utils.ts", "vercel.json", "package.json", "tsconfig.json"],
    notes: "Established Next.js 15 + React 19 + shadcn/ui stack. Removed unused deps (vue, svelte, remix). Fixed GitHub push protection issue with API key prefixes (sk_ -> scr_). Production deploy live.",
  },
  {
    team: "CTO Office",
    division: "Frontend Platform",
    title: "Dashboard Layout & Shell",
    status: "COMPLETE",
    timestamp: "10:35 PM EST",
    completed: [
      "Dashboard layout with collapsible sidebar (SidebarProvider + cookie persistence)",
      "App sidebar with navigation groups: Dashboard, Flows, Runs, Monitoring, API Keys, Settings",
      "Dashboard header with breadcrumb navigation and theme toggle (dark/light)",
      "Notification bell with unread count badge",
      "Responsive mobile sidebar with sheet overlay",
      "SidebarRail for drag-to-collapse support",
      "User dropdown at footer with Settings, Billing, Sign out",
    ],
    files: [
      "app/(dashboard)/layout.tsx",
      "components/dashboard/app-sidebar.tsx",
      "components/dashboard/dashboard-header.tsx",
    ],
    notes: "Sidebar state persists via cookies. Full dark mode support via next-themes ThemeProvider. Active nav state detection via usePathname().",
  },
  {
    team: "CTO Office",
    division: "Frontend Platform",
    title: "Dashboard Overview Page",
    status: "COMPLETE",
    timestamp: "10:37 PM EST",
    completed: [
      "4 stats cards (Active Flows, Total Runs 24h, Success Rate, Data Points Extracted) with trend indicators",
      "7-day usage chart with Recharts area chart (gradient fill, tooltips)",
      "Recent runs table (5 most recent) with color-coded status badges",
      "Active flows list with success rate, run count, and quick action buttons",
      "Alerts section with severity-colored badges (info/warning/critical) and acknowledge",
    ],
    files: ["app/(dashboard)/dashboard/page.tsx"],
  },
  {
    team: "CTO Office",
    division: "Core Engine",
    title: "Flow Management System",
    status: "COMPLETE",
    timestamp: "10:52 PM EST",
    completed: [
      "Flows list page with search, mode filter (Extract/Interact/Monitor), status filter, grid/list toggle",
      "Flow creation wizard - 3-step: mode selection, URL+description input, template gallery",
      "Flow builder with 3-panel ResizablePanelGroup (steps/preview/config)",
      "Flow detail with tabs: Builder, Runs, API (curl/JS/Python code snippets), Settings",
      "Step editor with type-specific config forms (navigate, click, fill, extract, wait, condition, scroll, loop)",
      "Mock browser chrome in preview panel with URL bar and lock icon",
      "Schedule configuration with cron expression, timezone, and retry settings",
    ],
    files: [
      "app/(dashboard)/flows/page.tsx",
      "app/(dashboard)/flows/new/page.tsx",
      "app/(dashboard)/flows/[id]/page.tsx",
    ],
  },
  {
    team: "COO Office",
    division: "Platform Pages",
    title: "Run History, Monitoring, API Keys, Settings",
    status: "COMPLETE",
    timestamp: "10:55 PM EST",
    completed: [
      "Run history page with flow/status filters, paginated table, expandable log viewer with timestamps",
      "Monitoring alerts page with severity color-coding, acknowledge buttons, monitoring rules CRUD",
      "API keys management with create dialog (scope checkboxes), reveal/mask toggle, copy-to-clipboard, revoke with confirmation",
      "Settings page with 5 tabs: Profile, Team (members + invite), Billing (plan + usage bars), Notifications (toggles), Integrations (connect/disconnect)",
    ],
    files: [
      "app/(dashboard)/runs/page.tsx",
      "app/(dashboard)/monitoring/page.tsx",
      "app/(dashboard)/api-keys/page.tsx",
      "app/(dashboard)/settings/page.tsx",
    ],
  },
  {
    team: "CTO Office",
    division: "Backend Engineering",
    title: "API Routes",
    status: "COMPLETE",
    timestamp: "10:50 PM EST",
    completed: [
      "Flows CRUD - GET (list with ?status and ?mode filters), POST (create flow with generated ID)",
      "Flow by ID - GET, PUT (merge update), DELETE",
      "Runs - GET (list with ?flowId and ?status filters), POST (trigger run, queued status)",
      "Run by ID - GET (with full logs array)",
      "Extract endpoint - POST (one-shot structured extraction with URL-based mock matching)",
      "API Keys - GET (returns masked keys), POST (creates key with crypto.randomUUID)",
    ],
    files: [
      "app/api/flows/route.ts",
      "app/api/flows/[id]/route.ts",
      "app/api/runs/route.ts",
      "app/api/runs/[id]/route.ts",
      "app/api/extract/route.ts",
      "app/api/keys/route.ts",
    ],
    notes: "All routes use mock data layer. Response shapes match type definitions. Ready for Supabase/Neon integration.",
  },
  {
    team: "COO Office",
    division: "Frontend & Auth",
    title: "Auth Pages & Landing Page Overhaul",
    status: "COMPLETE",
    timestamp: "11:05 PM EST",
    completed: [
      "Sign in page with email/password + zod validation + social auth buttons (Google, GitHub SVG icons)",
      "Sign up page with name/email/password/confirm + terms checkbox + social sign-up",
      "Auth layout with centered card on gradient background",
      "Landing page complete rewrite: hero with animated terminal mockup showing curl/JSON",
      "How It Works section (3 numbered steps: Describe, Generate, Integrate)",
      "Features grid (8 features in 2x4 layout)",
      "Live demo section with URL input and mock JSON output",
      "Pricing section (Free/Pro/Enterprise tiers)",
      "Updated testimonials focused on API generation and automation",
      "Trust badges, social icons, professional footer with 2026 copyright",
      "Removed old AdminDashboard inline component - page is now a Server Component",
    ],
    files: [
      "app/(auth)/sign-in/page.tsx",
      "app/(auth)/sign-up/page.tsx",
      "app/(auth)/layout.tsx",
      "app/page.tsx",
    ],
  },
  {
    team: "COO Office",
    division: "Documentation",
    title: "Documentation Site",
    status: "COMPLETE",
    timestamp: "10:50 PM EST",
    completed: [
      "Docs layout with left sidebar navigation (6 sections with Lucide icons) and right-side TOC",
      "Overview page with hero, quick links grid, and 5 key concepts explained",
      "Quickstart guide - 5-step walkthrough with code examples (curl, JS, Python)",
      "Full API reference documenting all 10 endpoints with method badges, params, bodies, responses",
      "Code examples with dark code blocks for every endpoint",
    ],
    files: [
      "app/(docs)/layout.tsx",
      "app/(docs)/docs/page.tsx",
      "app/(docs)/docs/quickstart/page.tsx",
      "app/(docs)/docs/api-reference/page.tsx",
    ],
  },
  {
    team: "CEO Office",
    division: "Admin",
    title: "Executive Admin Panel",
    status: "COMPLETE",
    timestamp: "11:30 PM EST",
    completed: [
      "Admin layout with dark top nav and horizontal tab navigation",
      "Platform overview with 5 health stat cards, 30-day growth line chart, 6-service status grid",
      "Night shift engineering report (this page) with team-by-team breakdown",
      "Teams page with executive org chart and engineering team cards with progress bars",
      "Product roadmap with 7 phases, progress bars, and deliverable checklists",
      "System health dashboard with service grid, deploy history, build metrics, error rates, resource usage",
    ],
    files: [
      "app/(admin)/layout.tsx",
      "app/(admin)/admin/page.tsx",
      "app/(admin)/admin/night-shift/page.tsx",
      "app/(admin)/admin/teams/page.tsx",
      "app/(admin)/admin/roadmap/page.tsx",
      "app/(admin)/admin/system/page.tsx",
    ],
  },
  {
    team: "CFO Office",
    division: "Revenue",
    title: "Standalone Pricing Page",
    status: "COMPLETE",
    timestamp: "12:15 AM EST",
    completed: [
      "Full /pricing page with Monthly/Annual toggle (20% annual discount)",
      "3 pricing tier cards (Free $0, Pro $29/mo, Enterprise Custom) with highlighted middle card",
      "Comprehensive feature comparison matrix with 18 features across 3 tiers",
      "Categories: Extraction & Automation, API & Integrations, Platform",
      "Check/X icons and text values in comparison cells",
      "FAQ section with 6 Q&As using Accordion component",
      "CTA section with contact sales button",
      "Server component page.tsx with metadata + client PricingContent component",
    ],
    files: [
      "app/pricing/page.tsx",
      "components/pricing/pricing-content.tsx",
    ],
    notes: "Separated server page (metadata export) from client component (toggle state). Build-verified clean.",
  },
  {
    team: "CFO Office",
    division: "Performance",
    title: "SEO & Meta Tags",
    status: "COMPLETE",
    timestamp: "12:10 AM EST",
    completed: [
      "Root layout.tsx: comprehensive Metadata with title template, description, keywords, OpenGraph, Twitter cards",
      "Set metadataBase to https://scraper.bot",
      "Added metadata exports to docs pages: Overview, Quickstart, API Reference",
      "Added metadata to auth pages (sign-in, sign-up) where possible",
      "Robots: index true, follow true",
    ],
    files: ["app/layout.tsx", "app/(docs)/docs/page.tsx", "app/(docs)/docs/quickstart/page.tsx", "app/(docs)/docs/api-reference/page.tsx"],
  },
  {
    team: "CFO Office",
    division: "Growth",
    title: "Landing Page FAQ Section",
    status: "COMPLETE",
    timestamp: "12:10 AM EST",
    completed: [
      "Added FAQ section with 8 Q&As using shadcn Accordion component",
      "Topics: How it works, No-code usage, Differentiators, Site compatibility, Anti-bot handling, Multi-step workflows, Security, Self-healing",
      "Centered layout (max-w-3xl) with clean accordion styling",
      "Placed before final CTA section for conversion optimization",
    ],
    files: ["app/page.tsx"],
  },
  {
    team: "CFO Office",
    division: "Analytics & Data",
    title: "Export Functionality & Usage Charts",
    status: "COMPLETE",
    timestamp: "12:15 AM EST",
    completed: [
      "Created lib/export.ts with downloadCSV() and downloadJSON() utility functions",
      "Added Export dropdown (CSV/JSON) to Runs page header",
      "Added Export dropdown (CSV/JSON) to Flows page header",
      "Enhanced Settings/Billing tab with 30-day usage analytics area chart (Recharts)",
      "Chart shows daily runs and API calls with dual-color gradient fills",
      "Added billing period label above chart",
    ],
    files: [
      "lib/export.ts",
      "app/(dashboard)/runs/page.tsx",
      "app/(dashboard)/flows/page.tsx",
      "app/(dashboard)/settings/page.tsx",
    ],
  },
]

const completedTodoItems = [
  "SEO meta tags and OpenGraph for all public pages",
  "Standalone pricing page with feature comparison matrix",
  "CSV/JSON export for runs and flows",
  "Usage analytics charts in billing settings",
  "Landing page FAQ section",
]

const todoItems = [
  "Database integration (Supabase or Neon PostgreSQL)",
  "Real authentication (NextAuth.js or Clerk)",
  "AI-powered flow generation (Anthropic Claude API)",
  "Real scraping engine (Playwright / Browserless)",
  "Stripe payment integration",
  "Email notifications (Resend)",
  "WebSocket for real-time run updates",
  "Browser extension for visual selector picking",
  "MCP server integration",
  "Performance optimization (dynamic imports for Recharts)",
  "Playground page (interactive scraping sandbox)",
  "Templates gallery page",
  "Changelog page",
  "Blog with sample articles",
  "Command palette (Cmd+K)",
  "Loading skeletons for dashboard pages",
  "Onboarding wizard for new users",
  "Dark mode audit across all pages",
  "Public status page",
  "Integration setup wizards (Slack, Discord, Google Sheets)",
]

const knownIssues = [
  "Dashboard page first-load JS is 226kB (Recharts heavy) - needs dynamic import",
  "Admin overview and system pages also over 200kB - same Recharts issue",
  "Webpack cache intermittently corrupts on Windows - clean .next/ dir if build fails with JSON parse error",
]

export default function NightShiftReport() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Night Shift Engineering Report</h1>
        <p className="text-muted-foreground mt-1">Comprehensive build report from the night engineering shift</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium">March 18-19, 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Shift</div>
                <div className="font-medium">Night (10:00 PM - 6:00 AM EST)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileCode className="size-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Files Modified</div>
                <div className="font-medium">{reports.reduce((acc, r) => acc + (r.files?.length || 0), 0)}+</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GitCommit className="size-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Commits</div>
                <div className="font-medium">4</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Overall Status</div>
                <Badge className="bg-blue-600 text-white border-blue-600">IN PROGRESS</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold">Team Reports</h2>
        {reports.map((report, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-wider font-semibold">
                    {report.team} / {report.division}
                  </CardDescription>
                  <CardTitle className="mt-1">{report.title}</CardTitle>
                  {report.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1">Completed at {report.timestamp}</p>
                  )}
                </div>
                <Badge className={statusBadge[report.status].className}>{report.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Completed Items</h4>
                <ul className="space-y-1.5">
                  {report.completed.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {report.files && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Files</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {report.files.map((file) => (
                      <code
                        key={file}
                        className="text-xs bg-muted px-2 py-0.5 rounded font-mono"
                      >
                        {file}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {report.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{report.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-emerald-500/30">
        <CardHeader>
          <CardTitle className="text-emerald-600">Completed This Shift</CardTitle>
          <CardDescription>Items moved from TODO to DONE during this shift</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {completedTodoItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-600">Known Issues</CardTitle>
          <CardDescription>Issues discovered during the shift that need attention</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {knownIssues.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <AlertCircle className="size-4 text-amber-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backlog - TODO for Remaining Shift / Next Shift</CardTitle>
          <CardDescription>Prioritized backlog items for continued engineering work</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {todoItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Circle className="size-4 text-muted-foreground shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

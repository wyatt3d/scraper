"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, FileCode, CheckCircle2, Circle, AlertCircle } from "lucide-react"

type TeamStatus = "COMPLETE" | "IN PROGRESS" | "PLANNED"

interface TeamReport {
  team: string
  title: string
  status: TeamStatus
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
    title: "Architecture & Infrastructure",
    status: "COMPLETE",
    completed: [
      "Project initialization and GitHub repository setup",
      "Vercel deployment configuration (vercel.json)",
      "Core type system (lib/types.ts) - Flow, Run, ApiKey, MonitorAlert, FlowTemplate",
      "Mock data layer (lib/mock-data.ts) with 6 flows, 5 runs, 3 API keys, 4 alerts, 8 templates",
      "Utility functions (lib/utils.ts) with cn() class merger",
    ],
    files: ["lib/types.ts", "lib/mock-data.ts", "lib/utils.ts", "vercel.json", "package.json", "tsconfig.json"],
    notes: "Established Next.js 15 + React 19 + shadcn/ui stack. Created comprehensive type definitions for Flows, Runs, API Keys, Monitoring Alerts, and Templates. All mock data is production-realistic.",
  },
  {
    team: "Frontend Engineering",
    title: "Dashboard Layout & Shell",
    status: "COMPLETE",
    completed: [
      "Dashboard layout with collapsible sidebar (SidebarProvider + cookie persistence)",
      "App sidebar with navigation groups: Flows, Runs, API Keys, Monitoring, Settings",
      "Dashboard header with breadcrumb navigation and theme toggle (dark/light)",
      "Notification bell with unread count",
      "Responsive mobile sidebar with sheet overlay",
    ],
    files: [
      "app/(dashboard)/layout.tsx",
      "components/dashboard/app-sidebar.tsx",
      "components/dashboard/dashboard-header.tsx",
    ],
    notes: "Sidebar state persists via cookies. Full dark mode support. Mobile-first responsive design.",
  },
  {
    team: "Frontend Engineering",
    title: "Dashboard Overview Page",
    status: "COMPLETE",
    completed: [
      "4 stats cards (Active Flows, Total Runs, Success Rate, Items Extracted)",
      "7-day usage chart with Recharts area chart (gradient fill)",
      "Recent runs table with status badges and duration",
      "Active flows list with success rate and schedule info",
      "Alerts section with severity-colored badges (info/warning/critical)",
    ],
    files: ["app/(dashboard)/dashboard/page.tsx"],
  },
  {
    team: "Frontend Engineering",
    title: "Flow Management",
    status: "COMPLETE",
    completed: [
      "Flows list page with search, filter by status, and grid/list toggle",
      "Flow creation wizard - 3-step process: mode selection, describe flow, choose template",
      "Flow builder with 3-panel resizable layout (steps panel, preview, config panel)",
      "Flow detail page with tabs: Builder, Runs, API, Settings",
      "Step editor with drag-and-drop ordering support",
    ],
    files: [
      "app/(dashboard)/flows/page.tsx",
      "app/(dashboard)/flows/new/page.tsx",
      "app/(dashboard)/flows/[id]/page.tsx",
    ],
  },
  {
    team: "Frontend Engineering",
    title: "Platform Pages",
    status: "COMPLETE",
    completed: [
      "Run history page with expandable log viewer per run",
      "Monitoring alerts page with severity-based color coding and acknowledge actions",
      "API keys management with create, revoke, and copy-to-clipboard functionality",
      "Settings page with 5 tabs: Profile, Team, Billing, Notifications, Integrations",
    ],
    files: [
      "app/(dashboard)/runs/page.tsx",
      "app/(dashboard)/monitoring/page.tsx",
      "app/(dashboard)/api-keys/page.tsx",
      "app/(dashboard)/settings/page.tsx",
    ],
  },
  {
    team: "Backend Engineering",
    title: "API Routes",
    status: "COMPLETE",
    completed: [
      "Flows CRUD - GET (list with filters), POST (create flow)",
      "Flow by ID - GET, PUT (update), DELETE",
      "Runs - GET (list with flow filter), POST (trigger run)",
      "Run by ID - GET (with logs)",
      "Extract endpoint - POST (one-shot structured extraction)",
      "API Keys - GET (list), POST (create), DELETE (revoke)",
    ],
    files: [
      "app/api/flows/route.ts",
      "app/api/flows/[id]/route.ts",
      "app/api/runs/route.ts",
      "app/api/runs/[id]/route.ts",
      "app/api/extract/route.ts",
      "app/api/keys/route.ts",
    ],
    notes: "All routes use mock data layer. Response shapes match type definitions. Ready for database integration.",
  },
  {
    team: "Frontend Engineering",
    title: "Auth & Landing Page",
    status: "COMPLETE",
    completed: [
      "Sign in page with email/password form and social auth buttons (Google, GitHub)",
      "Sign up page with name, email, password fields and social auth",
      "Form validation with error states",
      "Complete landing page rewrite: hero section, how-it-works, features grid, live demo section, pricing tiers, testimonials carousel, CTA",
    ],
    files: [
      "app/(auth)/sign-in/page.tsx",
      "app/(auth)/sign-up/page.tsx",
      "app/(auth)/layout.tsx",
      "app/page.tsx",
    ],
  },
  {
    team: "Documentation Team",
    title: "Docs Site",
    status: "COMPLETE",
    completed: [
      "Docs layout with sidebar navigation",
      "Overview page with platform introduction",
      "Quickstart guide - 5-step walkthrough from signup to first flow",
      "Full API reference with all endpoints documented",
      "Code examples in both curl and JavaScript for every endpoint",
    ],
    files: [
      "app/(docs)/docs/layout.tsx",
      "app/(docs)/docs/page.tsx",
      "app/(docs)/docs/quickstart/page.tsx",
      "app/(docs)/docs/api-reference/page.tsx",
    ],
  },
  {
    team: "Admin Panel",
    title: "Admin Dashboard",
    status: "IN PROGRESS",
    completed: [
      "Admin layout with horizontal tab navigation",
      "Platform overview with health cards, growth chart, service status",
      "Night shift engineering report (this page)",
      "Teams page with org structure and sprint progress",
      "Product roadmap with phase tracking",
      "System health monitoring dashboard",
    ],
    files: [
      "app/(admin)/layout.tsx",
      "app/(admin)/admin/page.tsx",
      "app/(admin)/admin/night-shift/page.tsx",
      "app/(admin)/admin/teams/page.tsx",
      "app/(admin)/admin/roadmap/page.tsx",
      "app/(admin)/admin/system/page.tsx",
    ],
    notes: "Building during current session. Executive-level reporting for operational visibility.",
  },
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
  "Performance optimization & caching",
]

export default function NightShiftReport() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Night Shift Engineering Report</h1>
        <p className="text-muted-foreground mt-1">Comprehensive build report from the night engineering shift</p>
      </div>

      <Card>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        {reports.map((report, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-wider font-semibold">{report.team}</CardDescription>
                  <CardTitle className="mt-1">{report.title}</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Next Up - TODO for Next Shift</CardTitle>
          <CardDescription>Prioritized backlog items for the day shift engineering team</CardDescription>
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

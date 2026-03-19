import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"

type PhaseStatus = "COMPLETE" | "IN PROGRESS" | "PLANNED"

interface Deliverable {
  name: string
  done: boolean
}

interface Phase {
  number: number
  name: string
  status: PhaseStatus
  completion: number
  eta: string
  deliverables: Deliverable[]
}

const statusBadge: Record<PhaseStatus, string> = {
  COMPLETE: "bg-emerald-600 text-white border-emerald-600",
  "IN PROGRESS": "bg-blue-600 text-white border-blue-600",
  PLANNED: "bg-muted text-muted-foreground border-border",
}

const phases: Phase[] = [
  {
    number: 0,
    name: "Discovery & Audit",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 17",
    deliverables: [
      { name: "Competitive analysis (Parse.bot, Notte, Apify, Browse AI)", done: true },
      { name: "Technical requirements document", done: true },
      { name: "Architecture decision records", done: true },
      { name: "Tech stack selection and validation", done: true },
      { name: "Project scaffolding and tooling", done: true },
    ],
  },
  {
    number: 1,
    name: "Core Architecture",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 18",
    deliverables: [
      { name: "Next.js 15 project with App Router", done: true },
      { name: "Type system (Flow, Run, ApiKey, Alert, Template)", done: true },
      { name: "Mock data layer with realistic sample data", done: true },
      { name: "shadcn/ui component library integration", done: true },
      { name: "Vercel deployment pipeline", done: true },
      { name: "Dark/light theme system", done: true },
    ],
  },
  {
    number: 2,
    name: "Data & Interaction Engine",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 19",
    deliverables: [
      { name: "API route layer (mock data)", done: true },
      { name: "Flows CRUD endpoints", done: true },
      { name: "Runs trigger and management", done: true },
      { name: "One-shot extraction endpoint", done: true },
      { name: "Scraping engine abstractions (observer, stepper, extractor)", done: true },
      { name: "Rate limiting and caching utilities", done: true },
      { name: "Cheerio HTTP scraping engine for static/SSR pages", done: true },
      { name: "Browserless Chrome on Hostinger VPS for JS rendering", done: true },
      { name: "Flow execution engine with Supabase persistence", done: true },
      { name: "Real interactive Playwright flow execution", done: true },
      { name: "Stealth mode anti-bot bypass", done: true },
      { name: "Database schema (PostgreSQL)", done: true },
      { name: "Queue system (Supabase-backed)", done: true },
      { name: "Atomic job claiming (FOR UPDATE SKIP LOCKED)", done: true },
      { name: "Job retry with atomic fail function", done: true },
    ],
  },
  {
    number: 3,
    name: "LLM Integration",
    status: "IN PROGRESS",
    completion: 95,
    eta: "Mar 28",
    deliverables: [
      { name: "Claude API integration for flow generation", done: true },
      { name: "AI-powered flow generation via /api/generate", done: true },
      { name: "Graceful fallback when Claude API has billing issues", done: true },
      { name: "Natural language to extraction schema", done: true },
      { name: "AI-powered selector suggestion", done: true },
      { name: "AI selector suggestion API (/api/suggest-selectors)", done: true },
      { name: "NL-to-schema API (/api/suggest-schema)", done: true },
      { name: "Intelligent error recovery", done: true },
      { name: "Content summarization pipeline", done: false },
    ],
  },
  {
    number: 4,
    name: "Frontend & DX Polish",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 19",
    deliverables: [
      { name: "Dashboard with stats, charts, and alerts", done: true },
      { name: "Flow builder with visual editor", done: true },
      { name: "Visual workflow builder with node canvas and SVG connections", done: true },
      { name: "Run history with log viewer", done: true },
      { name: "API key management UI", done: true },
      { name: "Settings with profile, team, billing tabs", done: true },
      { name: "Landing page with hero, features, pricing, FAQ", done: true },
      { name: "Admin panel for executive reporting", done: true },
      { name: "Standalone pricing page with feature comparison matrix", done: true },
      { name: "CSV/JSON export for runs and flows pages", done: true },
      { name: "Usage analytics charts in billing settings", done: true },
      { name: "Interactive scraping playground with chat UI", done: true },
      { name: "Template gallery with categories and previews", done: true },
      { name: "Command palette (Cmd+K) and keyboard shortcuts", done: true },
      { name: "Loading skeletons (7 variants) and empty states (6 variants)", done: true },
      { name: "Onboarding wizard (4-step with localStorage)", done: true },
      { name: "Toast notifications across dashboard", done: true },
      { name: "Flow import/export as JSON + version history", done: true },
      { name: "Flow marketplace with ratings and reviews", done: true },
      { name: "API playground (Swagger-like tester)", done: true },
      { name: "Community forum with threads and post creation", done: true },
      { name: "Dark mode QA audit (5 fixes applied)", done: true },
      { name: "Webhook management with event config and delivery logs", done: true },
      { name: "Integration setup wizards (Slack, Discord, Sheets, Zapier, Email)", done: true },
      { name: "Analytics dashboard with charts and cost breakdown", done: true },
      { name: "Referral program UI with sharing and history", done: true },
      { name: "Data viewer component (sortable table, charts, JSON)", done: true },
      { name: "Chrome extension landing page with install CTA", done: true },
      { name: "Real-time run viewer with live log streaming", done: true },
      { name: "CSS animations (fade-in, slide-up, scale-in, pulse-slow)", done: true },
      { name: "Mobile responsive fixes for flow builder and workflow builder", done: true },
      { name: "Sales/support chatbot widget", done: true },
      { name: "Text-based logo system (Logo + LogoIcon components)", done: true },
      { name: "Accessibility audit and ARIA labels", done: true },
    ],
  },
  {
    number: 5,
    name: "Production Hardening",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 19",
    deliverables: [
      { name: "Vercel deployment (initial)", done: true },
      { name: "Subdomain routing middleware (8 subdomains)", done: true },
      { name: "API key protection middleware", done: true },
      { name: "Rate limiting utility", done: true },
      { name: "Red Team audit (35 findings)", done: true },
      { name: "Blue Team remediation (9 fixed, both criticals resolved)", done: true },
      { name: "Dynamic imports: dashboard 226kB -> 120kB", done: true },
      { name: "Webhook infrastructure and delivery system", done: true },
      { name: "WebSocket infrastructure for real-time updates", done: true },
      { name: "Error boundary components", done: true },
      { name: "Custom 404 page", done: true },
      { name: "Stripe checkout integration (lib/stripe.ts)", done: true },
      { name: "Resend email integration (lib/email.ts)", done: true },
      { name: "Hostinger VPS deployment (Browserless Chrome)", done: true },
      { name: "Stealth mode anti-bot bypass on Browserless", done: true },
      { name: "Supabase database integration", done: true },
      { name: "Visual bug reporter with element selectors", done: true },
      { name: "Trouble ticket system", done: true },
      { name: "Authentication (Supabase Auth + middleware guards)", done: true },
      { name: "Error tracking (ErrorTracker + Supabase audit)", done: true },
      { name: "Security headers (CSP, X-Frame-Options, nosniff)", done: true },
      { name: "SSRF protection on extract/generate endpoints", done: true },
      { name: "API key SHA-256 hashing", done: true },
      { name: "Middleware auth via @supabase/ssr (cookie-based)", done: true },
      { name: "SSRF URL validation on scraping endpoints", done: true },
      { name: "Playwright script injection prevention (JSON.stringify)", done: true },
      { name: "Flow scheduling (Vercel Cron)", done: true },
      { name: "API pagination on all list endpoints", done: true },
      { name: "Cache-Control headers on GET endpoints", done: true },
      { name: "Zod input validation on POST/PATCH API routes", done: true },
      { name: "API response standardization (proper error codes)", done: true },
      { name: "Authenticated session bypass for dashboard API calls", done: true },
      { name: "Subdomain auth redirect to main domain", done: true },
      { name: "API key SHA-256 DB validation in route handlers", done: true },
      { name: "CSRF origin validation on state-changing routes", done: true },
      { name: "Templates table with RLS (public read, admin write)", done: true },
      { name: "Mock data eliminated (all pages real APIs)", done: true },
      { name: "API Playground wired to real fetch calls", done: true },
      { name: "ESLint enabled during builds (0 errors)", done: true },
      { name: "Proper RLS policies with user_id columns", done: false },
      { name: "Rate limiting via Upstash Redis", done: false },
      { name: "E2E test suite (Playwright)", done: false },
      { name: "Remaining security findings remediation (26 items)", done: false },
    ],
  },
  {
    number: 6,
    name: "Docs & Go-to-Market",
    status: "IN PROGRESS",
    completion: 92,
    eta: "Mar 25",
    deliverables: [
      { name: "Docs site with sidebar navigation", done: true },
      { name: "Platform overview documentation", done: true },
      { name: "Quickstart guide (5 steps)", done: true },
      { name: "Full API reference with code examples", done: true },
      { name: "Concepts documentation page", done: true },
      { name: "SDK documentation (TypeScript + Python)", done: true },
      { name: "Practical guides (3 walkthroughs)", done: true },
      { name: "SEO meta tags and OpenGraph for all public pages", done: true },
      { name: "Blog with 3 launch articles", done: true },
      { name: "Changelog page", done: true },
      { name: "Public status page", done: true },
      { name: "CTA banners in docs for conversion", done: true },
      { name: "Share buttons for flows and templates", done: true },
      { name: "Help tooltips across dashboard pages", done: true },
      { name: "SEO meta tags for changelog, status, and blog pages", done: true },
      { name: "Investor pitch deck (10 slides)", done: true },
      { name: "Go-to-market strategy page", done: true },
      { name: "Competitive analysis page", done: true },
      { name: "Integration guides (Slack, Discord, Sheets)", done: false },
      { name: "Video tutorials", done: false },
    ],
  },
  {
    number: 7,
    name: "Continuous Ops",
    status: "COMPLETE",
    completion: 100,
    eta: "Completed Mar 19",
    deliverables: [
      { name: "Ops Center admin page with automation runbook", done: true },
      { name: "Automated cron-based audit/fix loops", done: true },
      { name: "Dark mode contrast fixes (22 instances)", done: true },
      { name: "Accessibility: aria-labels on icon buttons (15 instances)", done: true },
      { name: "Breadcrumb labels for all 27+ routes", done: true },
      { name: "Dead code cleanup (28 files, -2632 lines)", done: true },
      { name: "Shared utility extraction (formatDuration, timeAgo, mappers)", done: true },
      { name: "Admin pages converted to server components", done: true },
      { name: "API response standardization", done: true },
      { name: "Landing page server component conversion (193kB->131kB)", done: true },
      { name: "Flow editor monolith split (1705->825 lines)", done: true },
      { name: "Mutations wired to real API calls (5 endpoints)", done: true },
      { name: "O(N*M) analytics query replaced with O(N)", done: true },
      { name: "CLAUDE.md fully updated to match architecture", done: true },
      { name: "Activity feed backed by real audit_log data", done: true },
      { name: "Settings deep-link via ?tab= query param", done: true },
      { name: "Admin pages converted to server components (8 pages)", done: true },
      { name: "API response consistency (5 routes fixed)", done: true },
      { name: "Final dark mode sweep (35 instances across 21 files)", done: true },
      { name: "select(*) narrowed to specific fields (6 queries)", done: true },
      { name: "11 additional aria-labels on icon buttons", done: true },
      { name: "Debug console.logs removed from Playwright scripts", done: true },
      { name: "Templates wired to Supabase with seed data", done: true },
      { name: "Mock-data.ts deleted (zero mock imports)", done: true },
      { name: "Convert remaining dashboard pages to server components", done: false },
    ],
  },
  {
    number: 8,
    name: "Browser Recorder",
    status: "IN PROGRESS" as PhaseStatus,
    completion: 90,
    eta: "Apr 10",
    deliverables: [
      { name: "Recorder engine (Browserless script builder + element map)", done: true },
      { name: "API routes (start + action with Zod validation)", done: true },
      { name: "Interactive screenshot panel with element overlays", done: true },
      { name: "Mode toolbar (Select/Click/Fill/Extract)", done: true },
      { name: "Flow builder integration (Record toggle in PreviewPanel)", done: true },
      { name: "Scroll recording support", done: true },
      { name: "Dedicated /recorder page as primary flow creation", done: true },
      { name: "Sidebar navigation (8 items, recorder-first)", done: true },
      { name: "Playground → Save as Flow conversion", done: true },
      { name: "Run results CSV/JSON export", done: true },
      { name: "Multi-page navigation recording", done: true },
      { name: "Recording playback/preview", done: true },
      { name: "Content summarization pipeline via Claude", done: true },
      { name: "Selector refinement with AI suggestions", done: false },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Product Roadmap</h1>
        <p className="text-muted-foreground mt-1">Phased delivery plan for Scraper.bot platform</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {phases.map((phase) => (
          <div key={phase.number} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Phase {phase.number}</div>
            <Progress value={phase.completion} className="h-3" />
            <div className="text-xs font-medium mt-1">{phase.completion}%</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.number}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-wider font-semibold">
                    Phase {phase.number}
                  </CardDescription>
                  <CardTitle className="mt-1">{phase.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {phase.eta}
                  </div>
                  <Badge className={statusBadge[phase.status]}>{phase.status}</Badge>
                </div>
              </div>
              <Progress value={phase.completion} className="mt-3" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                {phase.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {d.done ? (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={d.done ? "" : "text-muted-foreground"}>{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

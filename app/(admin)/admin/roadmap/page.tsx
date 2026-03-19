"use client"

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
  PLANNED: "bg-gray-500 text-white border-gray-500",
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
    status: "IN PROGRESS",
    completion: 60,
    eta: "Mar 22",
    deliverables: [
      { name: "API route layer (mock data)", done: true },
      { name: "Flows CRUD endpoints", done: true },
      { name: "Runs trigger and management", done: true },
      { name: "One-shot extraction endpoint", done: true },
      { name: "Database schema (PostgreSQL)", done: false },
      { name: "Database migrations and ORM setup", done: false },
      { name: "Real scraping engine (Playwright)", done: false },
      { name: "Queue system (BullMQ / Inngest)", done: false },
    ],
  },
  {
    number: 3,
    name: "LLM Integration",
    status: "PLANNED",
    completion: 0,
    eta: "Mar 28",
    deliverables: [
      { name: "Claude API integration for flow generation", done: false },
      { name: "Natural language to extraction schema", done: false },
      { name: "AI-powered selector suggestion", done: false },
      { name: "Intelligent error recovery", done: false },
      { name: "Content summarization pipeline", done: false },
    ],
  },
  {
    number: 4,
    name: "Frontend & DX Polish",
    status: "IN PROGRESS",
    completion: 85,
    eta: "Mar 20",
    deliverables: [
      { name: "Dashboard with stats, charts, and alerts", done: true },
      { name: "Flow builder with visual editor", done: true },
      { name: "Run history with log viewer", done: true },
      { name: "API key management UI", done: true },
      { name: "Settings with profile, team, billing tabs", done: true },
      { name: "Landing page with hero, features, pricing", done: true },
      { name: "Admin panel for executive reporting", done: true },
      { name: "Keyboard shortcuts and power-user features", done: false },
      { name: "Accessibility audit and ARIA labels", done: false },
    ],
  },
  {
    number: 5,
    name: "Production Hardening",
    status: "PLANNED",
    completion: 10,
    eta: "Apr 2",
    deliverables: [
      { name: "Vercel deployment (initial)", done: true },
      { name: "Authentication (NextAuth.js / Clerk)", done: false },
      { name: "Rate limiting and abuse prevention", done: false },
      { name: "Stripe billing integration", done: false },
      { name: "Error tracking (Sentry)", done: false },
      { name: "E2E test suite (Playwright)", done: false },
      { name: "Performance optimization and caching", done: false },
      { name: "Security audit", done: false },
    ],
  },
  {
    number: 6,
    name: "Docs & Go-to-Market",
    status: "IN PROGRESS",
    completion: 70,
    eta: "Mar 25",
    deliverables: [
      { name: "Docs site with sidebar navigation", done: true },
      { name: "Platform overview documentation", done: true },
      { name: "Quickstart guide (5 steps)", done: true },
      { name: "Full API reference with code examples", done: true },
      { name: "Integration guides (Slack, Discord, Sheets)", done: false },
      { name: "Video tutorials", done: false },
      { name: "Blog launch post", done: false },
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

      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
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

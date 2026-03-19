"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Code2, Server, BookOpen, Shield } from "lucide-react"

interface TeamMember {
  initials: string
  name: string
  role: string
  color: string
}

interface Team {
  name: string
  icon: React.ElementType
  members: TeamMember[]
  responsibilities: string[]
  sprintItems: string[]
  completion: number
}

const executives: TeamMember[] = [
  { initials: "CO", name: "Claude Opus", role: "CEO / Architect", color: "bg-blue-600" },
  { initials: "A1", name: "Agent 1", role: "CTO - Infrastructure & System Design", color: "bg-violet-600" },
  { initials: "A2", name: "Agent 2", role: "COO - Product Operations & QA", color: "bg-emerald-600" },
  { initials: "A3", name: "Agent 3", role: "CFO - Cost Optimization & Pricing", color: "bg-amber-600" },
]

const teams: Team[] = [
  {
    name: "Frontend Engineering",
    icon: Code2,
    members: [
      { initials: "FE1", name: "Agent 4", role: "Dashboard Lead", color: "bg-blue-500" },
      { initials: "FE2", name: "Agent 5", role: "Flows Engineer", color: "bg-blue-400" },
      { initials: "FE3", name: "Agent 6", role: "Auth & Landing Lead", color: "bg-blue-300" },
    ],
    responsibilities: [
      "Dashboard UI and all interactive pages",
      "Flow builder and visual editor",
      "Auth flows and landing page",
      "Component library and design system",
    ],
    sprintItems: [
      "Dashboard overview with stats and charts",
      "Flow list, creation wizard, and builder",
      "Run history with log viewer",
      "Settings page with 5 tabs",
      "Admin panel pages",
    ],
    completion: 92,
  },
  {
    name: "Backend Engineering",
    icon: Server,
    members: [
      { initials: "BE1", name: "Agent 7", role: "API Engineer", color: "bg-emerald-500" },
      { initials: "BE2", name: "Agent 8", role: "Scraping Engine Engineer", color: "bg-emerald-400" },
    ],
    responsibilities: [
      "RESTful API routes (CRUD for all entities)",
      "Scraping engine abstraction layer",
      "Queue management and job scheduling",
      "Data extraction and transformation pipeline",
    ],
    sprintItems: [
      "Flows CRUD API routes",
      "Runs API with trigger/list/detail",
      "Extract endpoint for one-shot scraping",
      "API key management endpoints",
      "Database schema design (next sprint)",
    ],
    completion: 75,
  },
  {
    name: "Platform & DevOps",
    icon: Shield,
    members: [
      { initials: "P1", name: "Agent 9", role: "DevOps Engineer", color: "bg-violet-500" },
      { initials: "P2", name: "Agent 10", role: "Testing & Reliability", color: "bg-violet-400" },
    ],
    responsibilities: [
      "CI/CD pipeline and deployment automation",
      "Infrastructure monitoring and alerting",
      "Performance testing and optimization",
      "Security auditing and compliance",
    ],
    sprintItems: [
      "Vercel deployment configuration",
      "Environment variable management",
      "Error tracking setup",
      "Performance benchmarks",
      "Load testing framework",
    ],
    completion: 45,
  },
  {
    name: "Documentation",
    icon: BookOpen,
    members: [
      { initials: "D1", name: "Agent 11", role: "Documentation & Education", color: "bg-amber-500" },
    ],
    responsibilities: [
      "API reference documentation",
      "Getting started guides and tutorials",
      "Architecture decision records",
      "User-facing help content",
    ],
    sprintItems: [
      "Docs site layout and navigation",
      "Platform overview page",
      "5-step quickstart guide",
      "Full API reference with examples",
      "Integration guides (next sprint)",
    ],
    completion: 80,
  },
]

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Team Structure</h1>
        <p className="text-muted-foreground mt-1">Engineering organization and sprint progress</p>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Crown className="size-5 text-amber-500" />
          Executive Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {executives.map((exec) => (
            <Card key={exec.initials}>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`size-10 rounded-full ${exec.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {exec.initials}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{exec.name}</div>
                    <div className="text-xs text-muted-foreground">{exec.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Engineering Teams</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <team.icon className="size-5 text-blue-500" />
                    <CardTitle>{team.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{team.completion}%</Badge>
                </div>
                <CardDescription>Sprint completion</CardDescription>
                <Progress value={team.completion} className="mt-2" />
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member) => (
                      <div key={member.initials} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                        <div className={`size-6 rounded-full ${member.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {member.initials}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-muted-foreground"> - {member.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
                  <ul className="space-y-1">
                    {team.responsibilities.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-muted-foreground mt-1.5 shrink-0">-</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Current Sprint</h4>
                  <ul className="space-y-1">
                    {team.sprintItems.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-1.5 shrink-0">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

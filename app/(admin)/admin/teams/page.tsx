import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Shield, ShieldCheck } from "lucide-react"

const executives = [
  {
    initials: "CEO",
    title: "CEO",
    agent: "Claude Opus",
    scope: "Project direction, architecture decisions, quality gate",
    color: "bg-blue-600",
  },
  {
    initials: "CTO",
    title: "CTO",
    agent: "Agent Team",
    scope: "Infrastructure, features, scraping engine",
    color: "bg-violet-600",
  },
  {
    initials: "COO",
    title: "COO",
    agent: "Agent Team",
    scope: "UX, documentation, QA, onboarding",
    color: "bg-emerald-600",
  },
  {
    initials: "CFO",
    title: "CFO",
    agent: "Agent Team",
    scope: "Performance, analytics, growth, revenue",
    color: "bg-amber-600",
  },
]

const adversarialTeams = [
  {
    name: "Red Team",
    icon: Shield,
    color: "text-red-500",
    scope: "Product criticism, security audit, competitive gap analysis",
    deliverables: [
      "Critical gap analysis across 8 categories",
      "Security vulnerability assessment",
      "Competitive positioning review",
      "UX friction audit",
      "Missing feature inventory",
    ],
  },
  {
    name: "Blue Team",
    icon: ShieldCheck,
    color: "text-blue-500",
    scope: "Bug fixes, remediation, defense score tracking",
    deliverables: [
      "Fixed loading states across all pages",
      "Added error boundaries and fallbacks",
      "Implemented empty state components",
      "Resolved hydration mismatches",
      "Accessibility improvements (ARIA labels, focus states)",
      "Mobile responsive fixes",
    ],
  },
]

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Team Structure</h1>
        <p className="text-muted-foreground mt-1">Actual team roles used during the build</p>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Crown className="size-5 text-amber-500" />
          Executive Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {executives.map((exec) => (
            <Card key={exec.title}>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`size-10 rounded-full ${exec.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {exec.initials}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{exec.title}</div>
                    <div className="text-xs text-muted-foreground">{exec.agent}</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{exec.scope}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Adversarial Teams</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adversarialTeams.map((team) => (
            <Card key={team.name}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <team.icon className={`size-5 ${team.color}`} />
                  <CardTitle>{team.name}</CardTitle>
                  <Badge variant="outline" className="ml-auto">
                    {team.deliverables.length} deliverables
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{team.scope}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {team.deliverables.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

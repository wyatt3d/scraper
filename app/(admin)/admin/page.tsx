import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  FolderOpen,
  GitCommit,
  Code2,
  CheckCircle2,
  Rocket,
  Moon,
  Users,
  Map,
  Activity,
  Shield,
  ShieldCheck,
  Presentation,
  Target,
  Swords,
} from "lucide-react"

const platformStats = [
  { label: "Total Routes", value: "51", icon: Map, color: "text-blue-500" },
  { label: "Total Files", value: "190+", icon: FolderOpen, color: "text-violet-500" },
  { label: "Total Commits", value: "10", icon: GitCommit, color: "text-emerald-500" },
  { label: "Lines of Code", value: "30,000+", icon: Code2, color: "text-amber-500" },
  { label: "Build Status", value: "Clean", icon: CheckCircle2, color: "text-emerald-500" },
  { label: "Deploy", value: "Vercel + GitHub", icon: Rocket, color: "text-blue-500" },
]

const quickLinks = [
  { label: "Night Shift Report", href: "/admin/night-shift", icon: Moon },
  { label: "Teams", href: "/admin/teams", icon: Users },
  { label: "Roadmap", href: "/admin/roadmap", icon: Map },
  { label: "System Health", href: "/admin/system", icon: Activity },
  { label: "Red Team", href: "/admin/red-team", icon: Shield },
  { label: "Blue Team", href: "/admin/blue-team", icon: ShieldCheck },
  { label: "Pitch Deck", href: "/admin/pitch", icon: Presentation },
  { label: "GTM Strategy", href: "/admin/gtm", icon: Target },
  { label: "Competitive Analysis", href: "/admin/competitive", icon: Swords },
]

const recentCommits = [
  "feat: blue team fixes, CEO reports, GTM strategy, competitive analysis",
  "feat: Phase 2 features - webhooks, integrations, analytics, data viz",
  "feat: major feature wave - forum, workflow builder, marketplace, blue team fixes",
  "feat: add official Scraper logo across all pages",
  "feat: add subdomain routing middleware",
  "feat: massive feature drop - playground, templates, blog, infra, UX",
  "docs: update night shift report and roadmap - CEO review 12:30 AM",
  "feat: add executive admin panel with night shift reports",
  "feat: initial Scraper.bot platform - full product build",
]

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Executive summary for Scraper.bot</p>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Platform Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platformStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-0">
                <stat.icon className={`size-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3">
                    <link.icon className="size-5 text-blue-500" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="size-5" />
            Recent Commits
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recentCommits.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Badge variant="outline" className="shrink-0 font-mono text-xs">
                  {i + 1}
                </Badge>
                <span className="text-muted-foreground">{msg}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

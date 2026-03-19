import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  CheckCircle2,
  Code2,
  Crosshair,
  FileText,
  FolderOpen,
  Map,
  Presentation,
  Rocket,
  Route,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react"

const stats = [
  { label: "Total Routes", value: "54", icon: Route, color: "text-blue-500" },
  { label: "Total Files", value: "200+", icon: FolderOpen, color: "text-violet-500" },
  { label: "Lines of Code", value: "32,000+", icon: Code2, color: "text-amber-500" },
  { label: "Build Status", value: "Clean", icon: CheckCircle2, color: "text-emerald-500", badge: true },
]

const quickLinks = [
  {
    label: "Night Shift Report",
    href: "/admin/night-shift",
    icon: FileText,
    description: "View the engineering team's overnight progress",
  },
  {
    label: "Teams",
    href: "/admin/teams",
    icon: Users,
    description: "See the organizational structure and team deliverables",
  },
  {
    label: "Roadmap",
    href: "/admin/roadmap",
    icon: Map,
    description: "Track product development phases and milestones",
  },
  {
    label: "System Health",
    href: "/admin/system",
    icon: Activity,
    description: "Build info, routes, and subdomain configuration",
  },
  {
    label: "Red Team",
    href: "/admin/red-team",
    icon: ShieldAlert,
    description: "Security audit findings and vulnerability assessment",
  },
  {
    label: "Blue Team",
    href: "/admin/blue-team",
    icon: Shield,
    description: "Remediation progress and defense score",
  },
  {
    label: "Pitch Deck",
    href: "/admin/pitch",
    icon: Presentation,
    description: "Investor presentation with traction and business model",
  },
  {
    label: "GTM Strategy",
    href: "/admin/gtm",
    icon: Rocket,
    description: "Go-to-market plan and launch checklist",
  },
  {
    label: "Competitive Analysis",
    href: "/admin/competitive",
    icon: Crosshair,
    description: "Competitor comparison and feature matrix",
  },
]

const recentCommits = [
  { message: "feat: redesign admin panel layout with sidebar navigation", time: "2 hours ago" },
  { message: "feat: blue team fixes, CEO reports, GTM strategy, competitive analysis", time: "1 day ago" },
  { message: "feat: Phase 2 features - webhooks, integrations, analytics, data viz", time: "2 days ago" },
  { message: "feat: major feature wave - forum, workflow builder, marketplace", time: "3 days ago" },
  { message: "feat: add official Scraper logo across all pages", time: "4 days ago" },
]

export default function AdminOverview() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s your platform overview.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`size-5 ${stat.color}`} />
                {stat.badge && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                    Passing
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-0">
                  <link.icon className="size-5 text-blue-500 mb-3" />
                  <div className="text-sm font-semibold mb-1">{link.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {link.description}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
          <div className="space-y-5">
            {recentCommits.map((commit, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[17px] top-1.5 size-2 rounded-full bg-blue-500" />
                <div className="text-sm">{commit.message}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{commit.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

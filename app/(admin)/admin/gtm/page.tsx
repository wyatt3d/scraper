"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Users, BarChart3, Zap } from "lucide-react"

const segments = [
  {
    title: "Developers & Technical Teams",
    tam: "60%",
    icon: Users,
    pain: "Building/maintaining scrapers is tedious",
    solution: "API-first, SDK, playground",
    channels: ["Dev communities", "GitHub", "HackerNews", "Twitter/X"],
    conversion: "Playground \u2192 Free tier \u2192 Pro",
  },
  {
    title: "Data & Analytics Teams",
    tam: "25%",
    icon: BarChart3,
    pain: "No reliable way to get web data into dashboards",
    solution: "Scheduled flows, Google Sheets integration, CSV export",
    channels: ["LinkedIn", "Content marketing", "Case studies"],
    conversion: "Templates \u2192 Free tier \u2192 Team plan",
  },
  {
    title: "Growth & Operations",
    tam: "15%",
    icon: Zap,
    pain: "Manual data entry, no automation",
    solution: "No-code workflow builder, monitoring",
    channels: ["Product Hunt", "AppSumo", "Zapier marketplace"],
    conversion: "Blog \u2192 Onboarding \u2192 Pro",
  },
]

const growthLevers = [
  {
    number: 1,
    title: "Product-Led Growth",
    description: "Free tier with generous limits drives adoption",
  },
  {
    number: 2,
    title: "SEO Content Flywheel",
    description: "Blog + docs + community = organic traffic",
  },
  {
    number: 3,
    title: "Template Marketplace",
    description: "User-generated templates attract new users",
  },
  {
    number: 4,
    title: "Developer Advocacy",
    description: "SDK + API playground + MCP integration",
  },
  {
    number: 5,
    title: "Integration Partners",
    description: "Slack, Discord, Zapier, Google Sheets",
  },
  {
    number: 6,
    title: "Community Forum",
    description: "User-helping-user reduces support cost",
  },
]

const pricingTiers = [
  { name: "Free", detail: "Low barrier, high conversion funnel top" },
  { name: "Pro ($29/mo)", detail: "Sweet spot for individuals and small teams" },
  { name: "Enterprise (custom)", detail: "High-touch sales for large organizations" },
  { name: "Annual discount (20%)", detail: "Reduces churn, improves cash flow" },
]

const launchChecklist = [
  { label: "Landing page with clear value prop", done: true },
  { label: "Documentation with quickstart guide", done: true },
  { label: "Blog with 3 launch articles", done: true },
  { label: "Pricing page with comparison matrix", done: true },
  { label: "Community forum", done: true },
  { label: "Status page", done: true },
  { label: "Product Hunt launch", done: false },
  { label: 'HackerNews "Show HN" post', done: false },
  { label: "Twitter/X launch thread", done: false },
  { label: "Dev.to / Medium articles", done: false },
  { label: "YouTube demo video", done: false },
  { label: "Email launch sequence", done: false },
]

export default function GtmPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Go-to-Market Strategy</h1>
        <p className="text-muted-foreground mt-1">Q2 2026 Plan</p>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Target Market Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {segments.map((seg) => (
            <Card key={seg.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <seg.icon className="size-5 text-blue-500" />
                    <CardTitle className="text-base">{seg.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">{seg.tam} of TAM</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Pain:</span>{" "}
                  {seg.pain}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Solution:</span>{" "}
                  {seg.solution}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Channels:</span>{" "}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {seg.channels.map((ch) => (
                      <Badge key={ch} variant="outline" className="text-xs font-normal">
                        {ch}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Conversion:</span>{" "}
                  {seg.conversion}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Growth Levers</h2>
        <Card>
          <CardContent className="pt-6">
            <ol className="space-y-3">
              {growthLevers.map((lever) => (
                <li key={lever.number} className="flex gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                    {lever.number}
                  </span>
                  <div>
                    <span className="font-medium">{lever.title}:</span>{" "}
                    <span className="text-muted-foreground">{lever.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Pricing Strategy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingTiers.map((tier) => (
            <Card key={tier.name}>
              <CardContent className="pt-6">
                <div className="font-medium text-sm">{tier.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{tier.detail}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Launch Checklist</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
              {launchChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={item.done ? "" : "text-muted-foreground"}>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, X, Minus } from "lucide-react"

type ThreatLevel = "HIGH" | "MEDIUM" | "LOW"

interface Competitor {
  name: string
  note: string
  strengths: string[]
  weaknesses: string[]
  pricing: string
  threat: ThreatLevel
  advantage: string
}

const threatStyles: Record<ThreatLevel, string> = {
  HIGH: "bg-red-600 text-white border-red-600",
  MEDIUM: "bg-yellow-500 text-black border-yellow-500",
  LOW: "bg-emerald-600 text-white border-emerald-600",
}

const competitors: Competitor[] = [
  {
    name: "Parse.bot",
    note: "YC-backed",
    strengths: [
      "Browserless execution (fast)",
      "Deterministic APIs",
      "MCP integration",
      "YC backing",
    ],
    weaknesses: [
      "No visual builder",
      "No monitoring",
      "No community",
      "Code-heavy",
    ],
    pricing: "Unknown (beta)",
    threat: "HIGH",
    advantage: "Visual workflow builder, monitoring, community, marketplace",
  },
  {
    name: "Notte",
    note: "YC S25",
    strengths: [
      "Real browser infrastructure",
      "Agent orchestration",
      "Digital personas",
      "Edge compute",
    ],
    weaknesses: [
      "Complex setup",
      "Python-only SDK",
      "Expensive at scale",
    ],
    pricing: "$0.05/browser hour + $10/GB proxy",
    threat: "HIGH",
    advantage: "Simpler UX, no-code builder, marketplace, better docs",
  },
  {
    name: "Apify",
    note: "",
    strengths: [
      "Mature platform",
      "Large actor marketplace",
      "Robust infrastructure",
    ],
    weaknesses: [
      "Steep learning curve",
      "JavaScript-only",
      "Expensive",
    ],
    pricing: "Starts at $49/mo",
    threat: "MEDIUM",
    advantage: "Natural language flow creation, lower price point, better onboarding",
  },
  {
    name: "Browse AI",
    note: "",
    strengths: [
      "No-code",
      "Good UX",
      "Monitoring built-in",
    ],
    weaknesses: [
      "Limited automation",
      "No API access",
      "Slow",
    ],
    pricing: "Starts at $39/mo",
    threat: "MEDIUM",
    advantage: "API-first, developer SDK, visual workflow builder, faster",
  },
  {
    name: "Bright Data / Oxylabs",
    note: "",
    strengths: [
      "Massive proxy infrastructure",
      "Enterprise-grade",
    ],
    weaknesses: [
      "Infrastructure-only (no automation)",
      "Very expensive",
    ],
    pricing: "$500+/mo",
    threat: "LOW",
    advantage: "Full-stack platform, not just proxies",
  },
]

type FeatureSupport = "yes" | "no" | "partial"

const features = [
  "No-code builder",
  "Visual workflow",
  "API access",
  "SDK",
  "Monitoring",
  "Community",
  "Marketplace",
  "Natural language",
  "Browser automation",
  "Browserless mode",
  "Scheduling",
  "Webhooks",
] as const

type FeatureRow = Record<string, FeatureSupport>

const featureMatrix: Record<string, FeatureRow> = {
  "No-code builder":     { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "no",      "Apify": "no",      "Browse AI": "yes",     "Bright Data": "no" },
  "Visual workflow":     { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "no",      "Apify": "partial", "Browse AI": "partial", "Bright Data": "no" },
  "API access":          { "Scraper.bot": "yes", "Parse.bot": "yes",     "Notte": "yes",     "Apify": "yes",     "Browse AI": "no",      "Bright Data": "yes" },
  "SDK":                 { "Scraper.bot": "yes", "Parse.bot": "yes",     "Notte": "partial", "Apify": "yes",     "Browse AI": "no",      "Bright Data": "yes" },
  "Monitoring":          { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "no",      "Apify": "partial", "Browse AI": "yes",     "Bright Data": "no" },
  "Community":           { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "no",      "Apify": "yes",     "Browse AI": "no",      "Bright Data": "no" },
  "Marketplace":         { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "no",      "Apify": "yes",     "Browse AI": "no",      "Bright Data": "no" },
  "Natural language":    { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "partial", "Apify": "no",      "Browse AI": "no",      "Bright Data": "no" },
  "Browser automation":  { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "yes",     "Apify": "yes",     "Browse AI": "yes",     "Bright Data": "partial" },
  "Browserless mode":    { "Scraper.bot": "yes", "Parse.bot": "yes",     "Notte": "no",      "Apify": "partial", "Browse AI": "no",      "Bright Data": "no" },
  "Scheduling":          { "Scraper.bot": "yes", "Parse.bot": "no",      "Notte": "partial", "Apify": "yes",     "Browse AI": "yes",     "Bright Data": "no" },
  "Webhooks":            { "Scraper.bot": "yes", "Parse.bot": "partial", "Notte": "no",      "Apify": "yes",     "Browse AI": "no",      "Bright Data": "partial" },
}

const compColumns = ["Scraper.bot", "Parse.bot", "Notte", "Apify", "Browse AI", "Bright Data"]

function FeatureIcon({ support }: { support: FeatureSupport }) {
  if (support === "yes") return <Check className="size-4 text-emerald-500 mx-auto" />
  if (support === "partial") return <Minus className="size-4 text-yellow-500 mx-auto" />
  return <X className="size-4 text-red-400 mx-auto" />
}

export default function CompetitivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Competitive Analysis</h1>
        <p className="text-muted-foreground mt-1">Last updated: March 19, 2026</p>
      </div>

      <div className="space-y-4">
        {competitors.map((comp) => (
          <Card key={comp.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{comp.name}</CardTitle>
                  {comp.note && (
                    <Badge variant="outline" className="text-xs font-normal">{comp.note}</Badge>
                  )}
                </div>
                <Badge className={cn("text-xs", threatStyles[comp.threat])}>
                  {comp.threat}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground mb-1">Strengths</div>
                  <ul className="space-y-1">
                    {comp.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground mb-1">Weaknesses</div>
                  <ul className="space-y-1">
                    {comp.weaknesses.map((w) => (
                      <li key={w} className="flex items-start gap-2">
                        <X className="size-3.5 text-red-400 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-sm border-t pt-4 border-border">
                <div>
                  <span className="font-medium text-muted-foreground">Pricing:</span>{" "}
                  {comp.pricing}
                </div>
                <div className="sm:border-l sm:pl-4 border-border">
                  <span className="font-medium text-muted-foreground">Our Advantage:</span>{" "}
                  {comp.advantage}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Feature Comparison Matrix</h2>
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Feature</th>
                  {compColumns.map((col) => (
                    <th
                      key={col}
                      className={cn(
                        "py-2 px-2 text-center font-medium",
                        col === "Scraper.bot" ? "text-blue-500" : "text-muted-foreground"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4">{feature}</td>
                    {compColumns.map((col) => (
                      <td key={col} className="py-2 px-2 text-center">
                        <FeatureIcon support={featureMatrix[feature][col]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

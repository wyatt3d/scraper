import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Changelog",
}

const entries = [
  {
    version: "v0.5.0",
    date: "March 18, 2026",
    badge: "Latest",
    changes: [
      "Added interactive scraping playground with chat interface",
      "Added template gallery with 8 starter templates",
      "Added comprehensive API reference documentation",
      "Added export functionality (CSV/JSON) for runs and flows",
      "Added executive admin panel with night shift reporting",
    ],
  },
  {
    version: "v0.4.0",
    date: "March 15, 2026",
    badge: null,
    changes: [
      "Added standalone pricing page with feature comparison matrix",
      "Added FAQ sections to landing page and pricing",
      "Added cost calculator on pricing page",
      "SEO optimization with OpenGraph and Twitter cards",
    ],
  },
  {
    version: "v0.3.0",
    date: "March 10, 2026",
    badge: null,
    changes: [
      "Added monitoring and alerts system with severity levels",
      "Added API key management with scoped permissions",
      "Added settings page with team, billing, and integrations",
      "Added notification configuration (email, Slack, Discord, webhook)",
    ],
  },
  {
    version: "v0.2.0",
    date: "March 5, 2026",
    badge: null,
    changes: [
      "Added flow builder with 3-panel resizable layout",
      "Added flow creation wizard with AI-powered generation",
      "Added run history with expandable log viewer",
      "Added scheduling with cron expressions",
    ],
  },
  {
    version: "v0.1.0",
    date: "March 1, 2026",
    badge: "Initial Release",
    changes: [
      "Platform launch with landing page",
      "Dashboard with overview stats and charts",
      "Basic flow management (create, edit, delete)",
      "Authentication pages (sign in, sign up)",
      "Documentation site with quickstart guide",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
            <img src="/images/scraper-logo.png" alt="Scraper" className="h-8 w-8 rounded" />
            Scraper.bot
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Scraper.bot
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Changelog
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Stay up to date with the latest improvements
          </p>
        </header>

        <div className="space-y-8">
          {entries.map((entry, i) => {
            const isLatest = i === 0
            return (
              <Card
                key={entry.version}
                className={cn(
                  "border-l-4",
                  isLatest ? "border-l-blue-600" : "border-l-muted-foreground/20"
                )}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle className="font-serif text-xl font-bold">
                      {entry.version}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {entry.date}
                    </span>
                    {entry.badge && (
                      <Badge
                        variant={isLatest ? "default" : "secondary"}
                        className={isLatest ? "bg-blue-600 hover:bg-blue-600" : ""}
                      >
                        {entry.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {entry.changes.map((change) => (
                      <li key={change} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}

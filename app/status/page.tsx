import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/logo"
import { SubscribeForm } from "./subscribe-form"

export const metadata: Metadata = {
  title: "Status",
  description: "Scraper.bot system status. Check the health of our API, scraping engine, and platform services.",
}

type ServiceStatus = "operational" | "degraded" | "outage"

interface Service {
  name: string
  status: ServiceStatus
  uptime: string
  metric?: string
}

const services: Service[] = [
  { name: "API Gateway", status: "operational", uptime: "99.99%", metric: "45ms avg latency" },
  { name: "Scraping Engine", status: "operational", uptime: "99.95%", metric: "1.2s avg response" },
  { name: "Dashboard", status: "operational", uptime: "99.99%", metric: "120ms load time" },
  { name: "Queue Workers", status: "operational", uptime: "99.97%", metric: "142 jobs/min" },
  { name: "Database", status: "operational", uptime: "99.99%", metric: "8ms avg query" },
  { name: "Authentication", status: "operational", uptime: "99.99%", metric: "95ms avg latency" },
  { name: "CDN & Static Assets", status: "operational", uptime: "100%", },
  { name: "Webhook Delivery", status: "degraded", uptime: "99.2%", metric: "340ms avg delivery" },
]

const uptimeDays: ServiceStatus[] = Array.from({ length: 30 }, (_, i) => {
  if (i === 14) return "degraded"
  return "operational"
})

const statusConfig: Record<ServiceStatus, { label: string; color: string; bg: string; dot: string }> = {
  operational: { label: "Operational", color: "text-green-600 dark:text-green-400", bg: "bg-green-500", dot: "bg-green-500" },
  degraded: { label: "Degraded", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500", dot: "bg-yellow-500" },
  outage: { label: "Outage", color: "text-red-600 dark:text-red-400", bg: "bg-red-500", dot: "bg-red-500" },
}

const incidents = [
  {
    date: "March 16, 2026",
    title: "Webhook delivery delays",
    status: "Resolved",
    timeline: [
      { time: "14:30", message: "Investigating reports of delayed webhook deliveries" },
      { time: "15:15", message: "Identified queue backlog in webhook worker" },
      { time: "15:45", message: "Deployed fix, clearing backlog" },
      { time: "16:00", message: "Resolved. All webhooks delivering normally." },
    ],
  },
  {
    date: "March 8, 2026",
    title: "Elevated API latency",
    status: "Resolved",
    timeline: [
      { time: "09:12", message: "Monitoring detected elevated p99 latency on API Gateway" },
      { time: "09:30", message: "Identified database connection pool saturation under increased load" },
      { time: "09:45", message: "Scaled connection pool and deployed optimized query paths" },
      { time: "10:00", message: "Resolved. API latency returned to normal levels." },
    ],
  },
]

const hasIssues = services.some((s) => s.status !== "operational")

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Logo href="/" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Scraper.bot
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-10">
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Scraper.bot Status
          </h1>
        </header>

        <div className="mb-8 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 text-sm text-muted-foreground">
          This status page will be live at launch. The data shown below is for demonstration purposes only.
        </div>

        <div
          className={cn(
            "mb-12 flex items-center gap-3 rounded-lg border p-5",
            hasIssues
              ? "border-yellow-500/30 bg-yellow-500/5"
              : "border-green-500/30 bg-green-500/5"
          )}
        >
          {hasIssues ? (
            <AlertTriangle className="size-7 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
          )}
          <span
            className={cn(
              "text-lg font-semibold",
              hasIssues
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            )}
          >
            {hasIssues ? "Partial System Degradation" : "All Systems Operational"}
          </span>
        </div>

        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-5">Service Status</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const cfg = statusConfig[service.status]
              return (
                <Card key={service.name} className="py-4">
                  <CardContent className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {service.uptime} uptime
                        {service.metric ? ` / ${service.metric}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn("size-2 rounded-full", cfg.dot)} />
                      <span className={cn("text-xs font-medium", cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-2">
            Uptime — Last 30 Days
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Each square represents one day
          </p>
          <div className="flex gap-1 flex-wrap">
            {uptimeDays.map((day, i) => (
              <div
                key={i}
                title={`Day ${30 - i}: ${statusConfig[day].label}`}
                className={cn(
                  "size-4 rounded-sm",
                  statusConfig[day].bg,
                  day === "operational" && "opacity-80"
                )}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-green-500 opacity-80" /> Operational
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-yellow-500" /> Degraded
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-red-500" /> Outage
            </span>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold mb-5">
            Recent Incidents
          </h2>
          <div className="space-y-6">
            {incidents.map((incident) => (
              <Card key={incident.title}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {incident.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {incident.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      {incident.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 border-l-2 border-muted pl-4">
                    {incident.timeline.map((entry) => (
                      <div key={entry.time} className="text-sm">
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {entry.time}
                        </span>
                        <span className="text-muted-foreground">
                          {entry.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-muted-foreground" />
                <CardTitle className="text-base font-semibold">
                  Get notified about incidents
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SubscribeForm />
              <p className="mt-2 text-xs text-muted-foreground">
                Receive email notifications when we create or resolve incidents.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

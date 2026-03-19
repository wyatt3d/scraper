"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Workflow,
  Play,
  DollarSign,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Cpu,
  Layers,
} from "lucide-react"

const GrowthChart = dynamic(
  () => import("@/components/admin/growth-chart").then((mod) => ({ default: mod.GrowthChart })),
  {
    loading: () => <div className="h-[350px] bg-muted animate-pulse rounded-lg" />,
    ssr: false,
  }
)

const platformStats = [
  { label: "Total Users", value: "10,247", change: "+12.3%", icon: Users, color: "text-blue-500" },
  { label: "Active Flows", value: "3,891", change: "+8.7%", icon: Workflow, color: "text-emerald-500" },
  { label: "Runs Today", value: "45,672", change: "+23.1%", icon: Play, color: "text-violet-500" },
  { label: "Revenue MRR", value: "$127,450", change: "+15.4%", icon: DollarSign, color: "text-amber-500" },
  { label: "API Uptime", value: "99.97%", change: "0.00%", icon: Activity, color: "text-emerald-500" },
]

const services = [
  { name: "API Gateway", status: "healthy" as const, latency: "12ms", icon: Globe },
  { name: "Scraping Engine", status: "healthy" as const, latency: "45ms", icon: Cpu },
  { name: "Queue Workers", status: "healthy" as const, latency: "8ms", icon: Layers },
  { name: "Database", status: "healthy" as const, latency: "3ms", icon: Database },
  { name: "CDN", status: "healthy" as const, latency: "18ms", icon: Server },
  { name: "Auth Service", status: "healthy" as const, latency: "22ms", icon: Shield },
]

const statusColors = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
}

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Executive dashboard for Scraper.bot operations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {platformStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`size-5 ${stat.color}`} />
                <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Growth</CardTitle>
          <CardDescription>Users, active flows, and revenue (in $K) over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <GrowthChart />
        </CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => (
            <Card key={service.name}>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`size-2.5 rounded-full ${statusColors[service.status]}`} />
                  <Badge variant="outline" className="text-xs capitalize">{service.status}</Badge>
                </div>
                <service.icon className="size-5 text-muted-foreground mb-2" />
                <div className="text-sm font-medium">{service.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{service.latency}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

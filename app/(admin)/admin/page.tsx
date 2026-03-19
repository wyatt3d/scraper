"use client"

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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const platformStats = [
  { label: "Total Users", value: "10,247", change: "+12.3%", icon: Users, color: "text-blue-500" },
  { label: "Active Flows", value: "3,891", change: "+8.7%", icon: Workflow, color: "text-emerald-500" },
  { label: "Runs Today", value: "45,672", change: "+23.1%", icon: Play, color: "text-violet-500" },
  { label: "Revenue MRR", value: "$127,450", change: "+15.4%", icon: DollarSign, color: "text-amber-500" },
  { label: "API Uptime", value: "99.97%", change: "0.00%", icon: Activity, color: "text-emerald-500" },
]

function generateGrowthData() {
  const data = []
  const now = new Date(2026, 2, 18)
  let users = 8900
  let flows = 3200
  let revenue = 108000

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    users += Math.floor(Math.random() * 80 + 20)
    flows += Math.floor(Math.random() * 30 + 5)
    revenue += Math.floor(Math.random() * 1200 + 300)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      users,
      flows,
      revenue: Math.round(revenue / 1000),
    })
  }
  return data
}

const growthData = generateGrowthData()

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
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
                <Line type="monotone" dataKey="flows" stroke="#10b981" strokeWidth={2} dot={false} name="Flows" />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue ($K)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
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

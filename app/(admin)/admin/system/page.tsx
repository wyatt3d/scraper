"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Globe,
  Cpu,
  Layers,
  Database,
  Server,
  Shield,
  CheckCircle2,
  XCircle,
  GitCommit,
} from "lucide-react"

const ErrorChart = dynamic(
  () => import("@/components/admin/error-chart").then((mod) => ({ default: mod.ErrorChart })),
  {
    loading: () => <div className="h-[250px] bg-muted animate-pulse rounded-lg" />,
    ssr: false,
  }
)

const services = [
  { name: "API Gateway", status: "healthy" as const, latency: "12ms", uptime: "99.99%", requests: "1.2M/day", icon: Globe, errors: 3 },
  { name: "Scraping Engine", status: "healthy" as const, latency: "45ms", uptime: "99.95%", requests: "456K/day", icon: Cpu, errors: 12 },
  { name: "Queue Workers", status: "healthy" as const, latency: "8ms", uptime: "99.98%", requests: "890K/day", icon: Layers, errors: 1 },
  { name: "Database (Primary)", status: "healthy" as const, latency: "3ms", uptime: "99.99%", requests: "2.1M/day", icon: Database, errors: 0 },
  { name: "Database (Replica)", status: "healthy" as const, latency: "5ms", uptime: "99.97%", requests: "1.8M/day", icon: Database, errors: 2 },
  { name: "CDN (Edge)", status: "healthy" as const, latency: "18ms", uptime: "100%", requests: "3.4M/day", icon: Server, errors: 0 },
  { name: "Auth Service", status: "healthy" as const, latency: "22ms", uptime: "99.99%", requests: "67K/day", icon: Shield, errors: 0 },
  { name: "WebSocket Server", status: "healthy" as const, latency: "4ms", uptime: "99.96%", requests: "12K conns", icon: Globe, errors: 5 },
]

const statusColors = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
}

const deployments = [
  { hash: "a3f7b2c", message: "Admin panel: night shift report and team pages", time: "2 min ago", status: "deploying", author: "claude-opus" },
  { hash: "e91d4a8", message: "Docs: API reference with curl and JS examples", time: "47 min ago", status: "success", author: "claude-opus" },
  { hash: "b82c1f5", message: "Auth pages: sign-in/sign-up with social auth", time: "1h 23m ago", status: "success", author: "claude-opus" },
  { hash: "d47a9e2", message: "Landing page: complete rewrite with pricing", time: "2h 10m ago", status: "success", author: "claude-opus" },
  { hash: "c6f3b18", message: "Dashboard: flow builder with resizable panels", time: "3h 45m ago", status: "success", author: "claude-opus" },
]

const buildRoutes = [
  { route: "/", size: "142 kB", firstLoad: "298 kB", type: "SSG" },
  { route: "/dashboard", size: "89 kB", firstLoad: "245 kB", type: "Dynamic" },
  { route: "/flows", size: "67 kB", firstLoad: "223 kB", type: "Dynamic" },
  { route: "/flows/[id]", size: "112 kB", firstLoad: "268 kB", type: "Dynamic" },
  { route: "/runs", size: "54 kB", firstLoad: "210 kB", type: "Dynamic" },
  { route: "/docs", size: "38 kB", firstLoad: "194 kB", type: "SSG" },
  { route: "/admin", size: "76 kB", firstLoad: "232 kB", type: "Dynamic" },
]

const resourceMeters = [
  { name: "CPU Usage", value: 34, max: "vCPU x4", color: "text-blue-500" },
  { name: "Memory", value: 61, max: "8 GB", color: "text-violet-500" },
  { name: "Bandwidth", value: 28, max: "1 TB/mo", color: "text-emerald-500" },
  { name: "Storage", value: 17, max: "100 GB", color: "text-amber-500" },
]

export default function SystemHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">System Health</h1>
        <p className="text-muted-foreground mt-1">Infrastructure monitoring and deployment metrics</p>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Service Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Card key={service.name}>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${statusColors[service.status]}`} />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <service.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-medium">{service.latency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Uptime</div>
                    <div className="font-medium">{service.uptime}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Requests</div>
                    <div className="font-medium">{service.requests}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Errors (24h)</div>
                    <div className="font-medium">{service.errors}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
            <CardDescription>Last 5 deployments to production</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {deployments.map((deploy) => (
                <div key={deploy.hash} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5">
                    {deploy.status === "success" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : deploy.status === "deploying" ? (
                      <div className="size-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                      <XCircle className="size-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <GitCommit className="size-3" />
                        {deploy.hash}
                      </code>
                      <span className="text-xs text-muted-foreground">{deploy.time}</span>
                    </div>
                    <div className="text-sm mt-0.5 truncate">{deploy.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Build Metrics</CardTitle>
            <CardDescription>Bundle sizes per route (build output)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>First Load</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildRoutes.map((route) => (
                  <TableRow key={route.route}>
                    <TableCell className="font-mono text-xs">{route.route}</TableCell>
                    <TableCell className="text-xs">{route.size}</TableCell>
                    <TableCell className="text-xs">{route.firstLoad}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{route.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Rate (Last 24h)</CardTitle>
          <CardDescription>Errors and warnings per hour across all services</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorChart />
        </CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-xl font-semibold mb-4">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceMeters.map((resource) => (
            <Card key={resource.name}>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{resource.name}</span>
                  <span className="text-xs text-muted-foreground">{resource.max}</span>
                </div>
                <Progress value={resource.value} className="mb-2" />
                <div className={`text-2xl font-bold ${resource.color}`}>{resource.value}%</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

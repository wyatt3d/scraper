"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileSearch,
  Gauge,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

type LogEntry = {
  id: string
  time: string
  relativeTime: string
  method: HttpMethod
  endpoint: string
  status: number
  duration: string
  size: string
  ip: string
  requestHeaders: Record<string, string>
  requestBody: string | null
  responseHeaders: Record<string, string>
  responseBody: string
  timing: {
    dns: string
    connect: string
    tls: string
    ttfb: string
    transfer: string
  }
}

const mockLogs: LogEntry[] = [
  {
    id: "log_001",
    time: "2026-03-19T14:32:58Z",
    relativeTime: "2s ago",
    method: "POST",
    endpoint: "/api/extract",
    status: 200,
    duration: "1.2s",
    size: "4.8KB",
    ip: "192.168.1.100",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***", "User-Agent": "Scraper.bot-SDK/2.1", "Accept": "application/json" },
    requestBody: JSON.stringify({ url: "https://example.com/products", schema: { title: "string", price: "number" } }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_a1b2c3", "X-RateLimit-Remaining": "847" },
    responseBody: JSON.stringify({ success: true, data: [{ title: "Widget Pro", price: 29.99 }], credits_used: 1 }, null, 2),
    timing: { dns: "2ms", connect: "15ms", tls: "45ms", ttfb: "1.1s", transfer: "38ms" },
  },
  {
    id: "log_002",
    time: "2026-03-19T14:32:45Z",
    relativeTime: "15s ago",
    method: "GET",
    endpoint: "/api/flows",
    status: 200,
    duration: "45ms",
    size: "12.3KB",
    ip: "192.168.1.100",
    requestHeaders: { "Authorization": "Bearer sk_***", "Accept": "application/json" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_d4e5f6", "X-RateLimit-Remaining": "848" },
    responseBody: JSON.stringify({ flows: [{ id: "flow_1", name: "Product Scraper" }, { id: "flow_2", name: "Price Monitor" }], total: 2 }, null, 2),
    timing: { dns: "1ms", connect: "8ms", tls: "12ms", ttfb: "18ms", transfer: "6ms" },
  },
  {
    id: "log_003",
    time: "2026-03-19T14:32:30Z",
    relativeTime: "30s ago",
    method: "POST",
    endpoint: "/api/runs",
    status: 201,
    duration: "89ms",
    size: "0.5KB",
    ip: "10.0.0.45",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ flow_id: "flow_1", config: { headless: true } }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_g7h8i9" },
    responseBody: JSON.stringify({ run_id: "run_abc123", status: "queued" }, null, 2),
    timing: { dns: "1ms", connect: "10ms", tls: "18ms", ttfb: "52ms", transfer: "8ms" },
  },
  {
    id: "log_004",
    time: "2026-03-19T14:32:00Z",
    relativeTime: "1m ago",
    method: "GET",
    endpoint: "/api/runs/abc123",
    status: 200,
    duration: "32ms",
    size: "8.1KB",
    ip: "10.0.0.45",
    requestHeaders: { "Authorization": "Bearer sk_***", "Accept": "application/json" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_j0k1l2" },
    responseBody: JSON.stringify({ run_id: "run_abc123", status: "completed", results: 42, duration_ms: 12400 }, null, 2),
    timing: { dns: "0ms", connect: "5ms", tls: "8ms", ttfb: "14ms", transfer: "5ms" },
  },
  {
    id: "log_005",
    time: "2026-03-19T14:31:00Z",
    relativeTime: "2m ago",
    method: "DELETE",
    endpoint: "/api/flows/xyz",
    status: 200,
    duration: "28ms",
    size: "0.1KB",
    ip: "192.168.1.100",
    requestHeaders: { "Authorization": "Bearer sk_***" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_m3n4o5" },
    responseBody: JSON.stringify({ deleted: true }, null, 2),
    timing: { dns: "0ms", connect: "4ms", tls: "7ms", ttfb: "12ms", transfer: "5ms" },
  },
  {
    id: "log_006",
    time: "2026-03-19T14:28:00Z",
    relativeTime: "5m ago",
    method: "POST",
    endpoint: "/api/extract",
    status: 429,
    duration: "0ms",
    size: "0.2KB",
    ip: "203.0.113.50",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ url: "https://example.com/data" }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    responseBody: JSON.stringify({ error: "rate_limit_exceeded", message: "Too many requests. Retry after 60 seconds." }, null, 2),
    timing: { dns: "0ms", connect: "0ms", tls: "0ms", ttfb: "0ms", transfer: "0ms" },
  },
  {
    id: "log_007",
    time: "2026-03-19T14:25:00Z",
    relativeTime: "8m ago",
    method: "GET",
    endpoint: "/api/keys",
    status: 401,
    duration: "5ms",
    size: "0.1KB",
    ip: "198.51.100.1",
    requestHeaders: { "Authorization": "Bearer invalid_token" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_p6q7r8" },
    responseBody: JSON.stringify({ error: "unauthorized", message: "Invalid or expired API key" }, null, 2),
    timing: { dns: "1ms", connect: "2ms", tls: "0ms", ttfb: "1ms", transfer: "1ms" },
  },
  {
    id: "log_008",
    time: "2026-03-19T14:15:00Z",
    relativeTime: "18m ago",
    method: "PUT",
    endpoint: "/api/flows/flow_1",
    status: 200,
    duration: "67ms",
    size: "1.2KB",
    ip: "192.168.1.100",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ name: "Product Scraper v2", steps: [{ action: "navigate", url: "https://example.com" }] }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_s9t0u1" },
    responseBody: JSON.stringify({ id: "flow_1", name: "Product Scraper v2", updated_at: "2026-03-19T14:15:00Z" }, null, 2),
    timing: { dns: "1ms", connect: "8ms", tls: "15ms", ttfb: "35ms", transfer: "8ms" },
  },
  {
    id: "log_009",
    time: "2026-03-19T14:00:00Z",
    relativeTime: "33m ago",
    method: "POST",
    endpoint: "/api/extract",
    status: 500,
    duration: "3.4s",
    size: "0.3KB",
    ip: "10.0.0.45",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ url: "https://broken-site.example.com", schema: { data: "string" } }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_v2w3x4" },
    responseBody: JSON.stringify({ error: "internal_error", message: "Target site returned malformed HTML", request_id: "req_v2w3x4" }, null, 2),
    timing: { dns: "2ms", connect: "12ms", tls: "25ms", ttfb: "3.3s", transfer: "61ms" },
  },
  {
    id: "log_010",
    time: "2026-03-19T13:45:00Z",
    relativeTime: "48m ago",
    method: "GET",
    endpoint: "/api/flows",
    status: 200,
    duration: "38ms",
    size: "12.1KB",
    ip: "10.0.0.45",
    requestHeaders: { "Authorization": "Bearer sk_***", "Accept": "application/json" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_y5z6a7" },
    responseBody: JSON.stringify({ flows: [{ id: "flow_1", name: "Product Scraper" }], total: 1 }, null, 2),
    timing: { dns: "0ms", connect: "6ms", tls: "10ms", ttfb: "16ms", transfer: "6ms" },
  },
  {
    id: "log_011",
    time: "2026-03-19T13:00:00Z",
    relativeTime: "1h ago",
    method: "POST",
    endpoint: "/api/runs",
    status: 201,
    duration: "94ms",
    size: "0.5KB",
    ip: "192.168.1.100",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ flow_id: "flow_2", config: { headless: true, proxy: "us-east" } }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_b8c9d0" },
    responseBody: JSON.stringify({ run_id: "run_def456", status: "queued" }, null, 2),
    timing: { dns: "1ms", connect: "12ms", tls: "20ms", ttfb: "53ms", transfer: "8ms" },
  },
  {
    id: "log_012",
    time: "2026-03-19T10:30:00Z",
    relativeTime: "4h ago",
    method: "GET",
    endpoint: "/api/keys",
    status: 200,
    duration: "22ms",
    size: "1.8KB",
    ip: "192.168.1.100",
    requestHeaders: { "Authorization": "Bearer sk_***", "Accept": "application/json" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_e1f2g3" },
    responseBody: JSON.stringify({ keys: [{ id: "key_1", name: "Production", prefix: "sk_prod_" }], total: 1 }, null, 2),
    timing: { dns: "0ms", connect: "4ms", tls: "6ms", ttfb: "8ms", transfer: "4ms" },
  },
  {
    id: "log_013",
    time: "2026-03-19T06:00:00Z",
    relativeTime: "8h ago",
    method: "POST",
    endpoint: "/api/extract",
    status: 200,
    duration: "2.1s",
    size: "15.7KB",
    ip: "10.0.0.45",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ url: "https://news.example.com", schema: { headline: "string", summary: "string" }, pagination: true }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_h4i5j6", "X-Credits-Used": "3" },
    responseBody: JSON.stringify({ success: true, data: [{ headline: "Breaking News", summary: "Lorem ipsum dolor sit amet" }], pages_scraped: 3, credits_used: 3 }, null, 2),
    timing: { dns: "2ms", connect: "14ms", tls: "28ms", ttfb: "1.9s", transfer: "156ms" },
  },
  {
    id: "log_014",
    time: "2026-03-19T02:00:00Z",
    relativeTime: "12h ago",
    method: "GET",
    endpoint: "/api/runs",
    status: 200,
    duration: "51ms",
    size: "24.6KB",
    ip: "192.168.1.100",
    requestHeaders: { "Authorization": "Bearer sk_***", "Accept": "application/json" },
    requestBody: null,
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_k7l8m9" },
    responseBody: JSON.stringify({ runs: [{ id: "run_abc123", status: "completed" }, { id: "run_def456", status: "completed" }], total: 2 }, null, 2),
    timing: { dns: "0ms", connect: "7ms", tls: "12ms", ttfb: "25ms", transfer: "7ms" },
  },
  {
    id: "log_015",
    time: "2026-03-18T18:00:00Z",
    relativeTime: "20h ago",
    method: "POST",
    endpoint: "/api/extract",
    status: 422,
    duration: "12ms",
    size: "0.4KB",
    ip: "203.0.113.50",
    requestHeaders: { "Content-Type": "application/json", "Authorization": "Bearer sk_***" },
    requestBody: JSON.stringify({ schema: { title: "string" } }, null, 2),
    responseHeaders: { "Content-Type": "application/json", "X-Request-Id": "req_n0o1p2" },
    responseBody: JSON.stringify({ error: "validation_error", message: "Missing required field: url", details: [{ field: "url", message: "is required" }] }, null, 2),
    timing: { dns: "1ms", connect: "3ms", tls: "5ms", ttfb: "2ms", transfer: "1ms" },
  },
]

const methodColor: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  POST: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  PUT: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  DELETE: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
}

function statusColor(status: number) {
  if (status >= 200 && status < 300) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
  if (status >= 400 && status < 500) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
  return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
}

export default function ApiLogsPage() {
  const [liveEnabled, setLiveEnabled] = useState(true)
  const [methodFilter, setMethodFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [endpointFilter, setEndpointFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filteredLogs = mockLogs.filter((log) => {
    if (methodFilter !== "all" && log.method !== methodFilter) return false
    if (statusFilter === "2xx" && (log.status < 200 || log.status >= 300)) return false
    if (statusFilter === "4xx" && (log.status < 400 || log.status >= 500)) return false
    if (statusFilter === "5xx" && (log.status < 500 || log.status >= 600)) return false
    if (endpointFilter !== "all" && !log.endpoint.includes(endpointFilter)) return false
    return true
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold">API Logs</h1>
            <div className="flex items-center gap-2">
              {liveEnabled && (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
              )}
              <span className="text-sm text-muted-foreground">Live</span>
              <Switch
                checked={liveEnabled}
                onCheckedChange={(v) => {
                  setLiveEnabled(v)
                  toast.success(v ? "Live mode enabled" : "Live mode paused")
                }}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Real-time view of all API requests to your Scraper.bot endpoints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Activity className="size-5 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif">1,247</p>
              <p className="text-muted-foreground text-xs">Total Requests (24h)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Gauge className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif">89ms</p>
              <p className="text-muted-foreground text-xs">Avg Latency</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif">2.1%</p>
              <p className="text-muted-foreground text-xs">Error Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Zap className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif">14.2</p>
              <p className="text-muted-foreground text-xs">Requests/min</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="2xx">2xx Success</SelectItem>
            <SelectItem value="4xx">4xx Client</SelectItem>
            <SelectItem value="5xx">5xx Server</SelectItem>
          </SelectContent>
        </Select>

        <Select value={endpointFilter} onValueChange={setEndpointFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Endpoints</SelectItem>
            <SelectItem value="/flows">/flows</SelectItem>
            <SelectItem value="/runs">/runs</SelectItem>
            <SelectItem value="/extract">/extract</SelectItem>
            <SelectItem value="/keys">/keys</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]" />
                <TableHead>Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <Collapsible key={log.id} asChild open={expandedRow === log.id} onOpenChange={(open) => setExpandedRow(open ? log.id : null)}>
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="w-[30px] pr-0">
                          {expandedRow === log.id ? (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.relativeTime}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={methodColor[log.method]}>
                            {log.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.duration}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{log.size}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  Request Headers
                                </p>
                                <div className="rounded-md border bg-background">
                                  <Table>
                                    <TableBody>
                                      {Object.entries(log.requestHeaders).map(([k, v]) => (
                                        <TableRow key={k}>
                                          <TableCell className="font-mono text-xs font-medium py-1.5 px-3">{k}</TableCell>
                                          <TableCell className="font-mono text-xs text-muted-foreground py-1.5 px-3">{v}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  Response Headers
                                </p>
                                <div className="rounded-md border bg-background">
                                  <Table>
                                    <TableBody>
                                      {Object.entries(log.responseHeaders).map(([k, v]) => (
                                        <TableRow key={k}>
                                          <TableCell className="font-mono text-xs font-medium py-1.5 px-3">{k}</TableCell>
                                          <TableCell className="font-mono text-xs text-muted-foreground py-1.5 px-3">{v}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>

                            {log.requestBody && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  Request Body
                                </p>
                                <pre className="rounded-md border bg-background p-3 overflow-x-auto font-mono text-xs">
                                  {log.requestBody}
                                </pre>
                              </div>
                            )}

                            <div className="space-y-2">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Response Body
                              </p>
                              <pre className="rounded-md border bg-background p-3 overflow-x-auto font-mono text-xs">
                                {log.responseBody}
                              </pre>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Timing Breakdown
                              </p>
                              <div className="flex flex-wrap gap-4">
                                {Object.entries(log.timing).map(([phase, duration]) => (
                                  <div key={phase} className="flex items-center gap-2">
                                    <Clock className="size-3 text-muted-foreground" />
                                    <span className="text-xs uppercase text-muted-foreground">{phase}</span>
                                    <span className="font-mono text-xs font-medium">{duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

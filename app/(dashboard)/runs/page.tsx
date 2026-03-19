"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileDown,
  FileJson,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockRuns, mockFlows } from "@/lib/mock-data"
import { downloadCSV, downloadJSON } from "@/lib/export"
import { DataViewer } from "@/components/dashboard/data-viewer"
import type { Run, RunLog } from "@/lib/types"

const additionalRuns: Run[] = [
  {
    id: "run-6",
    flowId: "flow-2",
    flowName: "Job Listings Scraper",
    status: "completed",
    startedAt: "2026-03-17T18:00:00Z",
    completedAt: "2026-03-17T18:00:30Z",
    duration: 30200,
    itemsExtracted: 104,
    outputPreview: [
      { title: "Backend Engineer", company: "DataFlow Inc", location: "Austin, TX", salary: "$160k-$200k" },
    ],
    logs: [
      { timestamp: "2026-03-17T18:00:00Z", level: "info", message: "Run started" },
      { timestamp: "2026-03-17T18:00:28Z", level: "info", message: "Extracted 104 listings" },
      { timestamp: "2026-03-17T18:00:30Z", level: "info", message: "Run completed successfully" },
    ],
    cost: 0.009,
  },
  {
    id: "run-7",
    flowId: "flow-1",
    flowName: "Product Price Monitor",
    status: "completed",
    startedAt: "2026-03-17T12:00:00Z",
    completedAt: "2026-03-17T12:00:13Z",
    duration: 13100,
    itemsExtracted: 145,
    outputPreview: [
      { name: "Wireless Headphones Pro", price: 91.49, url: "/products/headphones", change: 0 },
    ],
    logs: [
      { timestamp: "2026-03-17T12:00:00Z", level: "info", message: "Run started" },
      { timestamp: "2026-03-17T12:00:13Z", level: "info", message: "Run completed successfully" },
    ],
    cost: 0.003,
  },
  {
    id: "run-8",
    flowId: "flow-3",
    flowName: "Real Estate Auction Monitor",
    status: "completed",
    startedAt: "2026-03-17T08:00:00Z",
    completedAt: "2026-03-17T08:00:09Z",
    duration: 8900,
    itemsExtracted: 31,
    outputPreview: [
      { address: "789 Pine Dr, Houston TX", currentBid: 38000, endDate: "2026-03-24" },
    ],
    logs: [
      { timestamp: "2026-03-17T08:00:00Z", level: "info", message: "Run started" },
      { timestamp: "2026-03-17T08:00:09Z", level: "info", message: "Run completed successfully" },
    ],
    cost: 0.002,
  },
  {
    id: "run-9",
    flowId: "flow-5",
    flowName: "Craigslist Cars Aggregator",
    status: "cancelled",
    startedAt: "2026-03-17T06:00:00Z",
    completedAt: "2026-03-17T06:00:20Z",
    duration: 20000,
    itemsExtracted: 0,
    logs: [
      { timestamp: "2026-03-17T06:00:00Z", level: "info", message: "Run started" },
      { timestamp: "2026-03-17T06:00:18Z", level: "warn", message: "Cancelled by user" },
      { timestamp: "2026-03-17T06:00:20Z", level: "info", message: "Run cancelled" },
    ],
    cost: 0.005,
  },
  {
    id: "run-10",
    flowId: "flow-4",
    flowName: "Contact Form Submitter",
    status: "completed",
    startedAt: "2026-03-16T14:00:00Z",
    completedAt: "2026-03-16T14:00:06Z",
    duration: 5800,
    itemsExtracted: 1,
    outputPreview: [{ confirmationId: "CF-29481", status: "submitted" }],
    logs: [
      { timestamp: "2026-03-16T14:00:00Z", level: "info", message: "Run started" },
      { timestamp: "2026-03-16T14:00:06Z", level: "info", message: "Run completed successfully" },
    ],
    cost: 0.001,
  },
]

const allRuns = [...mockRuns, ...additionalRuns].sort(
  (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
)

const ITEMS_PER_PAGE = 5

function formatDuration(ms: number) {
  if (ms === 0) return "--"
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function statusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
          <CheckCircle2 className="size-3" />
          Completed
        </Badge>
      )
    case "running":
      return (
        <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
          </span>
          Running
        </Badge>
      )
    case "failed":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400">
          <XCircle className="size-3" />
          Failed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
          <XCircle className="size-3" />
          Cancelled
        </Badge>
      )
    case "queued":
      return (
        <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
          <Clock className="size-3" />
          Queued
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function logLevelColor(level: RunLog["level"]) {
  switch (level) {
    case "info":
      return "text-blue-500"
    case "warn":
      return "text-amber-500"
    case "error":
      return "text-red-500"
    case "debug":
      return "text-gray-400"
  }
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export default function RunsPage() {
  const [flowFilter, setFlowFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("7d")
  const [expandedRun, setExpandedRun] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const now = new Date()

  const filtered = allRuns.filter((run) => {
    if (flowFilter !== "all" && run.flowId !== flowFilter) return false
    if (statusFilter !== "all" && run.status !== statusFilter) return false
    if (dateRange !== "all") {
      const runDate = new Date(run.startedAt)
      const msMap: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      }
      if (now.getTime() - runDate.getTime() > msMap[dateRange]) return false
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Run History
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all flow execution runs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => { setDateRange(v); setPage(1) }}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <Calendar className="size-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" />
                Export
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  const data = filtered.map((run) => ({
                    id: run.id,
                    flowName: run.flowName,
                    status: run.status,
                    startedAt: run.startedAt,
                    duration: formatDuration(run.duration ?? 0),
                    itemsExtracted: run.itemsExtracted,
                    cost: `$${run.cost.toFixed(3)}`,
                  }))
                  downloadCSV(data, "runs-export")
                }}
              >
                <FileDown className="size-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const data = filtered.map((run) => ({
                    id: run.id,
                    flowName: run.flowName,
                    status: run.status,
                    startedAt: run.startedAt,
                    duration: run.duration,
                    itemsExtracted: run.itemsExtracted,
                    cost: run.cost,
                  }))
                  downloadJSON(data, "runs-export")
                }}
              >
                <FileJson className="size-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={flowFilter} onValueChange={(v) => { setFlowFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Flows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flows</SelectItem>
            {mockFlows.map((flow) => (
              <SelectItem key={flow.id} value={flow.id}>
                {flow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-sm">
          {filtered.length} run{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Flow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((run) => (
                <Fragment key={run.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedRun(expandedRun === run.id ? null : run.id)
                    }
                  >
                    <TableCell>
                      {expandedRun === run.id ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/flows/${run.flowId}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {run.flowName}
                      </Link>
                    </TableCell>
                    <TableCell>{statusBadge(run.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(run.startedAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDuration(run.duration ?? 0)}
                    </TableCell>
                    <TableCell>
                      {run.itemsExtracted > 0 ? (
                        run.itemsExtracted.toLocaleString()
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      ${run.cost.toFixed(3)}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="size-8">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                          <RotateCcw className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedRun === run.id && (
                    <TableRow key={`${run.id}-detail`}>
                      <TableCell colSpan={8} className="bg-muted/30 p-0">
                        <div className="grid gap-4 p-4 lg:grid-cols-2">
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">
                              Run Logs
                            </h4>
                            <div className="rounded-md border bg-background p-3 font-mono text-xs">
                              {run.logs.map((log, i) => (
                                <div
                                  key={i}
                                  className="flex gap-2 py-0.5 leading-relaxed"
                                >
                                  <span className="text-muted-foreground shrink-0">
                                    {formatTimestamp(log.timestamp)}
                                  </span>
                                  <span
                                    className={`shrink-0 uppercase font-semibold w-12 ${logLevelColor(log.level)}`}
                                  >
                                    {log.level}
                                  </span>
                                  <span>{log.message}</span>
                                  {log.step && (
                                    <span className="text-muted-foreground">
                                      [{log.step}]
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {run.error && (
                              <div className="mt-2 rounded-md border border-red-500/25 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
                                {run.error}
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="mb-2 text-sm font-semibold">
                              Output Preview
                            </h4>
                            <DataViewer data={run.outputPreview || []} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No runs match the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 px-0"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

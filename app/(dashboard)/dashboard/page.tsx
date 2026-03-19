"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  CheckCircle2,
  Clock,
  Database,
  Edit,
  Layers,
  Pause,
  Play,
  TrendingUp,
  XCircle,
  Zap,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { UsageWarning } from "@/components/dashboard/usage-warning"
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard"
import { HelpTooltip } from "@/components/dashboard/help-tooltip"
import { ProductTour } from "@/components/dashboard/product-tour"
import { DashboardSkeleton } from "@/components/dashboard/skeletons"
import { EmptyFlows, EmptyRuns, EmptyAlerts } from "@/components/dashboard/empty-states"
import type { Flow, Run, MonitorAlert } from "@/lib/types"

const UsageChart = dynamic(
  () => import("@/components/dashboard/usage-chart").then((mod) => ({ default: mod.UsageChart })),
  {
    loading: () => <div className="h-[280px] bg-muted animate-pulse rounded-lg" />,
    ssr: false,
  }
)

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

function flowStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
          Active
        </Badge>
      )
    case "paused":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400">
          Paused
        </Badge>
      )
    case "draft":
      return (
        <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
          Draft
        </Badge>
      )
    case "error":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400">
          Error
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function severityClasses(severity: string) {
  switch (severity) {
    case "critical":
      return "border-red-500/30 bg-red-500/5"
    case "warning":
      return "border-amber-500/30 bg-amber-500/5"
    case "info":
      return "border-blue-500/30 bg-blue-500/5"
    default:
      return ""
  }
}

function severityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return <XCircle className="size-4 text-red-500" />
    case "warning":
      return <AlertTriangle className="size-4 text-amber-500" />
    case "info":
      return <Bell className="size-4 text-blue-500" />
    default:
      return <Bell className="size-4 text-muted-foreground" />
  }
}

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

export default function DashboardPage() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [alerts, setAlerts] = useState<MonitorAlert[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const [flowsRes, runsRes, alertsRes] = await Promise.all([
        fetch("/api/flows"),
        fetch("/api/runs"),
        fetch("/api/alerts"),
      ])
      const flowsData = await flowsRes.json()
      const runsData = await runsRes.json()
      const alertsData = await alertsRes.json()
      setFlows(Array.isArray(flowsData.data) ? flowsData.data : [])
      setRuns(Array.isArray(runsData.data) ? runsData.data : [])
      setAlerts(Array.isArray(alertsData.data) ? alertsData.data : [])
    } catch {
      // API failed, data stays empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const activeFlows = flows.filter((f) => f.status === "active" || f.status === "paused")
  const recentRuns = [...runs]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5)

  const completedRuns = runs.filter((r) => r.status === "completed")
  const finishedRuns = runs.filter((r) => r.status !== "running" && r.status !== "queued")
  const successRate = finishedRuns.length > 0
    ? ((completedRuns.length / finishedRuns.length) * 100).toFixed(1)
    : "0.0"
  const totalDataPoints = runs.reduce((sum, r) => sum + r.itemsExtracted, 0)

  const stats = [
    {
      title: "Total Flows",
      value: flows.length.toString(),
      change: "--",
      trend: "up" as const,
      description: "total",
      icon: Layers,
    },
    {
      title: "Runs (24h)",
      value: runs.length.toString(),
      change: "--",
      trend: "up" as const,
      description: "total",
      icon: Activity,
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      change: "--",
      trend: "up" as const,
      description: "all time",
      icon: TrendingUp,
    },
    {
      title: "Data Points",
      value: totalDataPoints.toLocaleString(),
      change: "--",
      trend: "up" as const,
      description: "extracted",
      icon: Database,
    },
  ]

  async function handleRunFlow(flowId: string, flowName: string) {
    toast.info(`Running "${flowName}"...`)
    try {
      const res = await fetch("/api/runs/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowId }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success(`Completed! ${data.itemsExtracted} items extracted in ${(data.duration / 1000).toFixed(1)}s`)
        loadData()
      }
    } catch {
      toast.error("Failed to run flow")
    }
  }

  function handleTogglePause(flowId: string) {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id !== flowId) return f
        const newStatus = f.status === "paused" ? "active" : "paused"
        toast(newStatus === "paused" ? "Flow paused" : "Flow resumed")
        return { ...f, status: newStatus } as Flow
      })
    )
  }

  function handleAcknowledge(alertId: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    )
    toast.success("Alert acknowledged")
  }

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your scraping flows, runs, and monitoring alerts.
          </p>
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6" data-tour="dashboard">
      <ProductTour />
      <OnboardingWizard />
      <UsageWarning />
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your scraping flows, runs, and monitoring alerts.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" data-tour="stats">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="animate-slide-up py-4" style={{ animationDelay: `${(i + 1) * 0.1}s`, animationFillMode: "both" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium flex items-center">
                  {stat.title}
                  {stat.title === "Success Rate" && (
                    <HelpTooltip content="Percentage of runs that completed without errors in the last 30 days" />
                  )}
                </CardDescription>
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUp className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="size-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="animate-fade-in grid gap-6 lg:grid-cols-3" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Runs Over Time</CardTitle>
            <CardDescription>Total and successful runs this week</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>
              {alerts.filter((a) => !a.acknowledged).length} unacknowledged
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No alerts</p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex gap-3 rounded-lg border p-3 ${severityClasses(alert.severity)} ${alert.acknowledged ? "opacity-50" : ""}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {severityIcon(alert.severity)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-tight">
                      {alert.flowName}
                    </p>
                    <p className="text-muted-foreground text-xs leading-snug">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                      {!alert.acknowledged && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleAcknowledge(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>
            Latest execution results across all flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentRuns.length === 0 ? (
            <EmptyRuns />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.flowName}</TableCell>
                    <TableCell>{statusBadge(run.status)}</TableCell>
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
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(run.startedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Flows</CardTitle>
          <CardDescription>
            Manage and monitor your scraping flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeFlows.length === 0 ? (
            <EmptyFlows />
          ) : (
            <div className="space-y-3">
              {activeFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{flow.name}</span>
                      {flowStatusBadge(flow.status)}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Zap className="size-3" />
                        {flow.totalRuns} runs
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        {flow.successRate}% success
                      </span>
                      {flow.lastRunAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          Last run {formatRelativeTime(flow.lastRunAt)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Activity className="size-3" />
                        Avg {formatDuration(flow.avgDuration)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pl-4">
                    <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => handleRunFlow(flow.id, flow.name)}>
                      <Play className="size-3" />
                      Run
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleTogglePause(flow.id)}>
                      {flow.status === "paused" ? (
                        <Play className="size-3.5" />
                      ) : (
                        <Pause className="size-3.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" asChild>
                      <Link href={`/flows/${flow.id}`}>
                        <Edit className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Play,
  Pause,
  Pencil,
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  FileText,
  MousePointerClick,
  Eye,
  BarChart3,
  Timer,
  MoreVertical,
  Download,
  ChevronDown,
  FileDown,
  FileJson,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { mockFlows } from "@/lib/mock-data"
import { downloadCSV, downloadJSON } from "@/lib/export"
import type { Flow, FlowMode, FlowStatus } from "@/lib/types"

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-18T18:30:00Z")
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = ms / 1000
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

const modeConfig: Record<FlowMode, { label: string; icon: typeof FileText; color: string }> = {
  extract: { label: "Extract", icon: FileText, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  interact: { label: "Interact", icon: MousePointerClick, color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  monitor: { label: "Monitor", icon: Eye, color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
}

const statusConfig: Record<FlowStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  active: { label: "Active", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  paused: { label: "Paused", icon: Pause, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  draft: { label: "Draft", icon: FileText, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  error: { label: "Error", icon: AlertCircle, color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
}

export default function FlowsPage() {
  const [search, setSearch] = useState("")
  const [modeFilter, setModeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [deleteTarget, setDeleteTarget] = useState<Flow | null>(null)
  const [flows, setFlows] = useState(mockFlows)

  const filtered = useMemo(() => {
    return flows.filter((f) => {
      const matchesSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.url.toLowerCase().includes(search.toLowerCase())
      const matchesMode = modeFilter === "all" || f.mode === modeFilter
      const matchesStatus = statusFilter === "all" || f.status === statusFilter
      return matchesSearch && matchesMode && matchesStatus
    })
  }, [flows, search, modeFilter, statusFilter])

  function handleDelete(flow: Flow) {
    setFlows((prev) => prev.filter((f) => f.id !== flow.id))
    setDeleteTarget(null)
  }

  function handleTogglePause(flow: Flow) {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === flow.id
          ? { ...f, status: f.status === "paused" ? "active" : "paused" }
          : f
      ) as Flow[]
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-crimson-text)] text-3xl font-bold tracking-tight">
              Flows
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your scraping flows and automations
            </p>
          </div>
          <div className="flex items-center gap-2">
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
                    const data = filtered.map((flow) => ({
                      id: flow.id,
                      name: flow.name,
                      description: flow.description,
                      url: flow.url,
                      mode: flow.mode,
                      status: flow.status,
                      schedule: flow.schedule,
                      totalRuns: flow.totalRuns,
                      successRate: `${flow.successRate}%`,
                      avgDuration: formatDuration(flow.avgDuration),
                      lastRunAt: flow.lastRunAt || "",
                    }))
                    downloadCSV(data, "flows-export")
                  }}
                >
                  <FileDown className="size-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const data = filtered.map((flow) => ({
                      id: flow.id,
                      name: flow.name,
                      description: flow.description,
                      url: flow.url,
                      mode: flow.mode,
                      status: flow.status,
                      schedule: flow.schedule,
                      totalRuns: flow.totalRuns,
                      successRate: flow.successRate,
                      avgDuration: flow.avgDuration,
                      lastRunAt: flow.lastRunAt,
                    }))
                    downloadJSON(data, "flows-export")
                  }}
                >
                  <FileJson className="size-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/flows/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Flow
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search flows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="extract">Extract</SelectItem>
              <SelectItem value="interact">Interact</SelectItem>
              <SelectItem value="monitor">Monitor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <div className="border-border flex items-center rounded-md border">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Activity className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
              No flows found
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {search || modeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first flow to get started"}
            </p>
            {!search && modeFilter === "all" && statusFilter === "all" && (
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Link href="/flows/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Flow
                </Link>
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((flow) => (
              <FlowCard
                key={flow.id}
                flow={flow}
                onDelete={() => setDeleteTarget(flow)}
                onTogglePause={() => handleTogglePause(flow)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((flow) => (
              <FlowRow
                key={flow.id}
                flow={flow}
                onDelete={() => setDeleteTarget(flow)}
                onTogglePause={() => handleTogglePause(flow)}
              />
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Flow</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action
                cannot be undone. All run history and data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deleteTarget && handleDelete(deleteTarget)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}

function FlowCard({
  flow,
  onDelete,
  onTogglePause,
}: {
  flow: Flow
  onDelete: () => void
  onTogglePause: () => void
}) {
  const mode = modeConfig[flow.mode]
  const status = statusConfig[flow.status]
  const ModeIcon = mode.icon
  const StatusIcon = status.icon

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link
              href={`/flows/${flow.id}`}
              className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold leading-tight hover:text-blue-600 transition-colors"
            >
              {flow.name}
            </Link>
            <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
              {flow.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/flows/${flow.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onTogglePause}>
                {flow.status === "paused" ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{flow.url}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", mode.color)}>
            <ModeIcon className="h-3 w-3" />
            {mode.label}
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>

        <div className="border-border grid grid-cols-3 gap-3 border-t pt-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center text-center">
                <span className="text-muted-foreground text-xs">Success</span>
                <span className="text-sm font-semibold">
                  {flow.successRate > 0 ? `${flow.successRate}%` : "--"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Success rate</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center text-center">
                <span className="text-muted-foreground text-xs">Runs</span>
                <span className="text-sm font-semibold">
                  {flow.totalRuns > 0 ? flow.totalRuns.toLocaleString() : "--"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total runs</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center text-center">
                <span className="text-muted-foreground text-xs">Avg</span>
                <span className="text-sm font-semibold">
                  {flow.avgDuration > 0 ? formatDuration(flow.avgDuration) : "--"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Average duration</TooltipContent>
          </Tooltip>
        </div>

        {flow.lastRunAt && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              Last run {timeAgo(flow.lastRunAt)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Play className="mr-1 h-3 w-3" />
                  Run
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run now</TooltipContent>
            </Tooltip>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FlowRow({
  flow,
  onDelete,
  onTogglePause,
}: {
  flow: Flow
  onDelete: () => void
  onTogglePause: () => void
}) {
  const mode = modeConfig[flow.mode]
  const status = statusConfig[flow.status]
  const ModeIcon = mode.icon
  const StatusIcon = status.icon

  return (
    <div className="group flex items-center gap-4 rounded-lg border p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <Link
            href={`/flows/${flow.id}`}
            className="font-[family-name:var(--font-crimson-text)] font-semibold hover:text-blue-600 transition-colors truncate"
          >
            {flow.name}
          </Link>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0", mode.color)}>
            <ModeIcon className="h-3 w-3" />
            {mode.label}
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0", status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 truncate">
            <Globe className="h-3 w-3 shrink-0" />
            {flow.url}
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-6 text-sm md:flex">
        <div className="flex items-center gap-1 text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>{flow.successRate > 0 ? `${flow.successRate}%` : "--"}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          <span>{flow.totalRuns > 0 ? flow.totalRuns.toLocaleString() : "--"}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          <span>{flow.avgDuration > 0 ? formatDuration(flow.avgDuration) : "--"}</span>
        </div>
        {flow.lastRunAt && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo(flow.lastRunAt)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Run now</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/flows/${flow.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onTogglePause}>
              {flow.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{flow.status === "paused" ? "Resume" : "Pause"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

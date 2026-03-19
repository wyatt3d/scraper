"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Pause,
  Play,
  Square,
  RotateCcw,
  Download,
  Loader2,
  Info,
  AlertTriangle,
  AlertCircle,
  Bug,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { downloadJSON } from "@/lib/export"
import { DataViewer } from "@/components/dashboard/data-viewer"
import type { Run, RunLog } from "@/lib/types"

const SIMULATED_MESSAGES = [
  "Navigating to page 3...",
  "Found 12 new items",
  "Extracting data...",
  "Processing item 7/12...",
  "Screenshot captured",
  "Moving to next page...",
  "Waiting for page load...",
  "Parsing DOM elements...",
  "Found 8 new items",
  "Processing item 3/8...",
  "Extracting data...",
  "Screenshot captured",
  "Navigating to page 4...",
  "Found 15 new items",
  "Processing item 11/15...",
]

function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function LogLevelIcon({ level }: { level: RunLog["level"] }) {
  switch (level) {
    case "info":
      return <Info className="size-3.5 text-blue-500 shrink-0" />
    case "warn":
      return <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
    case "error":
      return <XCircle className="size-3.5 text-red-500 shrink-0" />
    case "debug":
      return <Bug className="size-3.5 text-gray-400 shrink-0" />
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

function StatusBadge({ status, large }: { status: string; large?: boolean }) {
  const base = large ? "text-sm px-3 py-1" : ""
  switch (status) {
    case "completed":
      return (
        <Badge className={cn("bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400", base)}>
          <CheckCircle2 className="size-3" />
          Completed
        </Badge>
      )
    case "running":
      return (
        <Badge className={cn("bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400", base)}>
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
          </span>
          Running
        </Badge>
      )
    case "failed":
      return (
        <Badge className={cn("bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400", base)}>
          <XCircle className="size-3" />
          Failed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className={cn("bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400", base)}>
          <XCircle className="size-3" />
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge className={cn("bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400", base)}>
          <Clock className="size-3" />
          {status}
        </Badge>
      )
  }
}

export default function RunDetailPage() {
  const params = useParams()
  const runId = params.id as string

  const [baseRun, setBaseRun] = useState<Run | null>(null)
  const [flowSteps, setFlowSteps] = useState<{ id: string; type: string; label: string }[]>([])
  const [flowUrl, setFlowUrl] = useState("")
  const [flowSuccessRate, setFlowSuccessRate] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/runs/${runId}`)
        if (res.ok) {
          const data = await res.json()
          const run: Run = data.data || data
          setBaseRun(run)

          if (run.flowId) {
            try {
              const flowRes = await fetch(`/api/flows/${run.flowId}`)
              if (flowRes.ok) {
                const flowData = await flowRes.json()
                const f = flowData.data || flowData
                setFlowSteps(f.steps || [])
                setFlowUrl(f.url || "")
                setFlowSuccessRate(f.successRate ?? 0)
              }
            } catch {
              // flow fetch optional
            }
          }
        }
      } catch {
        // fallback
      } finally {
        setPageLoading(false)
      }
    }
    loadData()
  }, [runId])

  const [runStatus, setRunStatus] = useState<string>("queued")
  const [logs, setLogs] = useState<RunLog[]>([])
  const [autoScroll, setAutoScroll] = useState(true)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [itemsExtracted, setItemsExtracted] = useState(0)
  const [cost, setCost] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [simIndex, setSimIndex] = useState(0)

  useEffect(() => {
    if (baseRun) {
      setRunStatus(baseRun.status)
      setLogs([...(baseRun.logs || [])])
      setElapsedMs(baseRun.duration || 0)
      setItemsExtracted(baseRun.itemsExtracted || 0)
      setCost(baseRun.cost || 0)
      setCurrentStepIndex(baseRun.status === "running" ? 2 : (flowSteps.length ?? 0))
    }
  }, [baseRun, flowSteps.length])

  const isRunning = runStatus === "running"

  const logContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [autoScroll])

  useEffect(() => {
    scrollToBottom()
  }, [logs, scrollToBottom])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setElapsedMs((prev) => prev + 1000)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      const now = new Date()
      const message = SIMULATED_MESSAGES[simIndex % SIMULATED_MESSAGES.length]
      const newLog: RunLog = {
        timestamp: now.toISOString(),
        level: "info",
        message,
      }
      setLogs((prev) => [...prev, newLog])
      setSimIndex((prev) => prev + 1)

      if (message.startsWith("Found")) {
        const match = message.match(/(\d+)/)
        if (match) {
          setItemsExtracted((prev) => prev + parseInt(match[1]))
        }
      }

      if (message.startsWith("Navigating to page")) {
        setCost((prev) => +(prev + 0.001).toFixed(4))
        setCurrentStepIndex((prev) => {
          const max = (flowSteps.length ?? 4) - 1
          return prev >= max ? 0 : prev + 1
        })
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [isRunning, simIndex, flowSteps.length])

  const steps = flowSteps
  const successRate = flowSuccessRate

  if (pageLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!baseRun) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-serif text-xl font-semibold">Run not found</h2>
        <p className="text-muted-foreground text-sm">The run you are looking for does not exist.</p>
        <Button variant="outline" asChild>
          <Link href="/runs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Runs
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/runs">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-bold tracking-tight">
                {baseRun.flowName}
              </h1>
              <StatusBadge status={runStatus} />
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              Run {runId} &middot; Started{" "}
              {new Date(baseRun.startedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid lg:grid-cols-[40%_35%_25%] gap-4">
        {/* Left - Live Logs */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Live Logs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setAutoScroll((prev) => !prev)}
              >
                {autoScroll ? (
                  <>
                    <Pause className="size-3" />
                    Auto-scroll
                  </>
                ) : (
                  <>
                    <Play className="size-3" />
                    Paused
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <div
              ref={logContainerRef}
              className="h-[500px] overflow-y-auto rounded-md border bg-zinc-950 p-3 font-mono text-xs leading-relaxed"
            >
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <span className="text-gray-500 shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <LogLevelIcon level={log.level} />
                  <span
                    className={cn(
                      "shrink-0 uppercase font-semibold w-10 text-[10px]",
                      logLevelColor(log.level)
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="text-gray-200">{log.message}</span>
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 py-1 mt-1">
                  <Loader2 className="size-3 text-blue-500 animate-spin" />
                  <span className="text-blue-400 text-[10px]">Waiting for next event...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Center - Live Preview */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            {/* Mock browser frame */}
            <div className="rounded-lg border overflow-hidden mb-4">
              <div className="bg-gray-900 px-3 py-2 flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1 mx-3">
                  <div className="bg-gray-800 rounded px-2 py-0.5 text-gray-400 text-[10px] font-mono text-center truncate">
                    {flowUrl || "https://example.com"}
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 p-4 h-36 flex items-center justify-center">
                {isRunning ? (
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Extracting data...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs text-gray-400">Extraction complete</p>
                  </div>
                )}
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Flow Steps</p>
              {steps.map((step, i) => {
                const isCompleted = i < currentStepIndex
                const isCurrent = i === currentStepIndex && isRunning
                const isPending = i > currentStepIndex || (!isRunning && i >= currentStepIndex && runStatus !== "completed")
                const isAllDone = !isRunning && runStatus === "completed"

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors",
                      isCurrent && "border-blue-500 bg-blue-500/10",
                      (isCompleted || isAllDone) && !isCurrent && "border-border bg-background",
                      isPending && !isCurrent && "border-border bg-muted/30 text-muted-foreground"
                    )}
                  >
                    {(isCompleted || isAllDone) && !isCurrent ? (
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="size-3.5 text-blue-500 animate-spin shrink-0" />
                    ) : (
                      <div className="size-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    <span className="font-medium">{step.label}</span>
                    <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 h-4">
                      {step.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right - Run Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Run Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <StatusBadge status={runStatus} large />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-mono font-semibold">
                    {formatDuration(elapsedMs)}
                    {isRunning && (
                      <span className="inline-block ml-1 w-1 h-3 bg-blue-500 animate-pulse rounded-full align-middle" />
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Items Extracted</span>
                  <span className="font-mono font-semibold">{itemsExtracted.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-mono font-semibold">${cost.toFixed(3)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-mono font-semibold">{successRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {isRunning && (
              <Button variant="destructive" className="w-full gap-1.5" onClick={() => { setRunStatus("cancelled"); toast.success("Run cancelled") }}>
                <Square className="size-3.5" />
                Stop Run
              </Button>
            )}
            <Button variant="outline" className="w-full gap-1.5" onClick={() => toast.success("Flow re-run triggered")}>
              <RotateCcw className="size-3.5" />
              Re-run
            </Button>
            <Button variant="outline" className="w-full gap-1.5" onClick={() => { downloadJSON(baseRun.outputPreview || [], `run-${runId}-results.json`); toast.success("Results exported") }}>
              <Download className="size-3.5" />
              Export Results
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom - Results preview */}
      {runStatus === "completed" && baseRun.outputPreview && baseRun.outputPreview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Results Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <DataViewer data={baseRun.outputPreview} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

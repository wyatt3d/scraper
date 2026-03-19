"use client"

import { useState } from "react"
import {
  Play,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { formatDuration, timeAgo } from "@/lib/format"
import type { Run } from "@/lib/types"

const runStatusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  completed: { color: "text-green-600", icon: CheckCircle2 },
  failed: { color: "text-red-600", icon: XCircle },
  running: { color: "text-blue-600 dark:text-blue-400", icon: Loader2 },
  queued: { color: "text-yellow-600", icon: Clock },
  cancelled: { color: "text-muted-foreground", icon: XCircle },
}

export interface RunsTabProps {
  runs: Run[]
  flowId: string
  flowName: string
  onRunComplete: () => void
}

export function RunsTab({ runs, flowId, flowName, onRunComplete }: RunsTabProps) {
  const [running, setRunning] = useState(false)

  async function handleRun() {
    setRunning(true)
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
        onRunComplete()
      }
    } catch {
      toast.error("Failed to run flow")
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">
            Run History
          </h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            {running ? "Running..." : "Run Now"}
          </Button>
        </div>

        {runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Activity className="text-muted-foreground mb-3 h-10 w-10" />
            <p className="text-sm font-medium">No runs yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Run this flow to see execution history
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => {
                  const statusCfg = runStatusConfig[run.status] || runStatusConfig.completed
                  const StatusIcon = statusCfg.icon
                  return (
                    <TableRow key={run.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn("h-4 w-4", statusCfg.color, run.status === "running" && "animate-spin")} />
                          <span className="text-sm capitalize">{run.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{timeAgo(run.startedAt)}</TableCell>
                      <TableCell className="text-sm">
                        {run.duration ? formatDuration(run.duration) : "--"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {run.itemsExtracted > 0 ? run.itemsExtracted : "--"}
                      </TableCell>
                      <TableCell className="text-sm">${run.cost.toFixed(3)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View run details">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {runs.length > 0 && runs[0].error && (
          <Card className="border-red-200 dark:border-red-900">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Last Error</p>
                <p className="text-muted-foreground text-sm mt-0.5">{runs[0].error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

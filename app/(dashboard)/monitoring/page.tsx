"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Bell,
  BellRing,
  Check,
  Clock,
  Edit,
  ExternalLink,
  Plus,
  Settings,
  Trash2,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { StatsGridSkeleton, TableSkeleton } from "@/components/dashboard/skeletons"
import { EmptyAlerts } from "@/components/dashboard/empty-states"
import type { Flow, MonitorAlert } from "@/lib/types"

interface MonitoringRule {
  id: string
  flowId: string
  flowName: string
  condition: string
  channel: string
  enabled: boolean
}

const initialRules: MonitoringRule[] = []

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

function severityBorderColor(severity: string) {
  switch (severity) {
    case "critical":
      return "border-l-red-500"
    case "warning":
      return "border-l-amber-500"
    case "info":
      return "border-l-blue-500"
    default:
      return ""
  }
}

function severityBgColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500/5"
    case "warning":
      return "bg-amber-500/5"
    case "info":
      return "bg-blue-500/5"
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

function alertTypeBadge(type: MonitorAlert["type"]) {
  switch (type) {
    case "change_detected":
      return (
        <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
          Change Detected
        </Badge>
      )
    case "error":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400">
          Error
        </Badge>
      )
    case "threshold":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400">
          Threshold
        </Badge>
      )
    case "schedule_missed":
      return (
        <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
          Schedule Missed
        </Badge>
      )
  }
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<MonitorAlert[]>([])
  const [flows, setFlows] = useState<Flow[]>([])
  const [loading, setLoading] = useState(true)
  const [rules, setRules] = useState(initialRules)
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<MonitoringRule | null>(null)
  const [ruleFlow, setRuleFlow] = useState("")
  const [ruleCondition, setRuleCondition] = useState("")
  const [ruleChannel, setRuleChannel] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsRes, flowsRes] = await Promise.all([
          fetch("/api/alerts"),
          fetch("/api/flows"),
        ])
        const alertsData = await alertsRes.json()
        const flowsData = await flowsRes.json()
        setAlerts(Array.isArray(alertsData.data) ? alertsData.data : [])
        setFlows(Array.isArray(flowsData.data) ? flowsData.data : [])
      } catch {
        // API failed, data stays empty
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length
  const alertsTodayCount = alerts.filter((a) => {
    const d = new Date(a.createdAt)
    return d.toDateString() === new Date().toDateString()
  }).length

  function acknowledgeAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
    toast.success("Alert acknowledged")
  }

  function openAddRule() {
    setEditingRule(null)
    setRuleFlow("")
    setRuleCondition("")
    setRuleChannel("")
    setRuleDialogOpen(true)
  }

  function openEditRule(rule: MonitoringRule) {
    setEditingRule(rule)
    setRuleFlow(rule.flowId)
    setRuleCondition(rule.condition)
    setRuleChannel(rule.channel)
    setRuleDialogOpen(true)
  }

  function saveRule() {
    if (editingRule) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                flowId: ruleFlow,
                flowName: flows.find((f) => f.id === ruleFlow)?.name ?? r.flowName,
                condition: ruleCondition,
                channel: ruleChannel,
              }
            : r
        )
      )
    } else {
      const flow = flows.find((f) => f.id === ruleFlow)
      setRules((prev) => [
        ...prev,
        {
          id: `rule-${Date.now()}`,
          flowId: ruleFlow,
          flowName: flow?.name ?? "Unknown",
          condition: ruleCondition,
          channel: ruleChannel,
          enabled: true,
        },
      ])
    }
    setRuleDialogOpen(false)
    if (!editingRule) {
      toast.success("Monitoring rule created")
    }
  }

  function toggleRule(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground mt-1">Alerts and monitoring rules for your scraping flows.</p>
        </div>
        <StatsGridSkeleton />
        <TableSkeleton rows={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Alerts and monitoring rules for your scraping flows.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={openAddRule}>
          <Settings className="size-3.5" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">
              Unacknowledged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BellRing className="size-5 text-amber-500" />
              <span className="text-2xl font-bold">{unacknowledgedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">
              Active Monitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-blue-500" />
              <span className="text-2xl font-bold">
                {rules.filter((r) => r.enabled).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">
              Alerts Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{alertsTodayCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            {unacknowledgedCount} alert{unacknowledgedCount !== 1 ? "s" : ""}{" "}
            require attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <EmptyAlerts />
          ) : alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex gap-3 rounded-lg border border-l-4 p-4 ${severityBorderColor(alert.severity)} ${severityBgColor(alert.severity)} ${alert.acknowledged ? "opacity-50" : ""}`}
            >
              <div className="mt-0.5 shrink-0">
                {severityIcon(alert.severity)}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {alert.flowName}
                  </span>
                  {alertTypeBadge(alert.type)}
                </div>
                <p className="text-muted-foreground text-sm leading-snug">
                  {alert.message}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground text-xs">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/flows/${alert.flowId}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <ExternalLink className="size-3" />
                      View Flow
                    </Link>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Check className="size-3" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monitoring Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure conditions and notification channels for your flows.
              </CardDescription>
            </div>
            <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={openAddRule}
                >
                  <Plus className="size-3.5" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? "Edit Monitoring Rule" : "Add Monitoring Rule"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure a condition and notification channel for a flow.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Flow</Label>
                    <Select value={ruleFlow} onValueChange={setRuleFlow}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a flow" />
                      </SelectTrigger>
                      <SelectContent>
                        {flows.map((flow) => (
                          <SelectItem key={flow.id} value={flow.id}>
                            {flow.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Input
                      placeholder="e.g., Price change exceeds 10%"
                      value={ruleCondition}
                      onChange={(e) => setRuleCondition(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Channel</Label>
                    <Select value={ruleChannel} onValueChange={setRuleChannel}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Slack">Slack</SelectItem>
                        <SelectItem value="Discord">Discord</SelectItem>
                        <SelectItem value="Email + Slack">Email + Slack</SelectItem>
                        <SelectItem value="Slack + Discord">Slack + Discord</SelectItem>
                        <SelectItem value="Webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={saveRule}
                    disabled={!ruleFlow || !ruleCondition || !ruleChannel}
                  >
                    {editingRule ? "Save Changes" : "Add Rule"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`flex items-center justify-between rounded-lg border p-4 ${!rule.enabled ? "opacity-50" : ""}`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{rule.flowName}</span>
                  <Badge variant="outline" className="text-xs">
                    {rule.channel}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{rule.condition}</p>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => openEditRule(rule)}
                >
                  <Edit className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-500 hover:text-red-600"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No monitoring rules configured. Click "Add Rule" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

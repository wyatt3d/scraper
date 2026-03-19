"use client"

import { useState, useEffect, useCallback } from "react"
import {
  GripVertical,
  X,
  Settings,
  RotateCcw,
  Save,
  BarChart3,
  Activity,
  Zap,
  Bell,
  Play,
  Gauge,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  AreaChart,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WidgetConfig {
  id: string
  title: string
  description: string
  icon: typeof BarChart3
  timeRange: string
  size: "small" | "medium" | "large"
  refreshInterval: string
}

const AVAILABLE_WIDGETS: WidgetConfig[] = [
  { id: "stats-overview", title: "Stats Overview", description: "Runs, success rate, active flows", icon: BarChart3, timeRange: "7d", size: "medium", refreshInterval: "5m" },
  { id: "runs-chart", title: "Runs Chart", description: "Area chart of runs over time", icon: AreaChart, timeRange: "7d", size: "large", refreshInterval: "5m" },
  { id: "active-flows", title: "Active Flows List", description: "Currently active flows", icon: ListChecks, timeRange: "24h", size: "medium", refreshInterval: "1m" },
  { id: "recent-alerts", title: "Recent Alerts", description: "Latest monitoring alerts", icon: Bell, timeRange: "24h", size: "medium", refreshInterval: "1m" },
  { id: "quick-actions", title: "Quick Actions", description: "Create flow, run flow shortcuts", icon: Zap, timeRange: "24h", size: "small", refreshInterval: "manual" },
  { id: "api-usage", title: "API Usage Meter", description: "Current API usage and limits", icon: Gauge, timeRange: "30d", size: "small", refreshInterval: "5m" },
  { id: "cost-breakdown", title: "Cost Breakdown", description: "Spending by flow and period", icon: DollarSign, timeRange: "30d", size: "medium", refreshInterval: "15m" },
  { id: "top-flows", title: "Top Performing Flows", description: "Highest success rate flows", icon: TrendingUp, timeRange: "7d", size: "medium", refreshInterval: "15m" },
  { id: "scheduled-runs", title: "Upcoming Scheduled Runs", description: "Next scheduled executions", icon: Calendar, timeRange: "24h", size: "small", refreshInterval: "1m" },
  { id: "team-activity", title: "Team Activity Feed", description: "Recent team member actions", icon: Users, timeRange: "24h", size: "medium", refreshInterval: "1m" },
]

const DEFAULT_LAYOUT = ["stats-overview", "runs-chart", "active-flows", "recent-alerts"]

const STORAGE_KEY = "scraper-dashboard-layout"

function getDefaultWidgets(): WidgetConfig[] {
  return DEFAULT_LAYOUT.map((id) => {
    const w = AVAILABLE_WIDGETS.find((aw) => aw.id === id)!
    return { ...w }
  })
}

function WidgetPreview({ widget, small }: { widget: WidgetConfig; small?: boolean }) {
  const Icon = widget.icon
  if (small) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="size-4 text-muted-foreground" />
        <span className="font-medium">{widget.title}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-blue-600/10 p-2">
          <Icon className="size-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">{widget.title}</p>
          <p className="text-xs text-muted-foreground">{widget.description}</p>
        </div>
      </div>
      <div className="rounded-md border border-dashed bg-muted/30 p-4">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Icon className="size-4" />
          <span>{widget.title} preview</span>
        </div>
        {widget.id === "stats-overview" && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["1,247 Runs", "98.5% Success", "12 Flows"].map((s) => (
              <div key={s} className="rounded bg-background p-2 text-center text-xs font-medium">{s}</div>
            ))}
          </div>
        )}
        {widget.id === "runs-chart" && (
          <div className="mt-3 flex items-end gap-1 h-12">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-blue-600/30" style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
        {widget.id === "active-flows" && (
          <div className="mt-3 space-y-1.5">
            {["Product Scraper", "Price Monitor", "News Feed"].map((f) => (
              <div key={f} className="flex items-center justify-between rounded bg-background px-2 py-1 text-xs">
                <span>{f}</span>
                <span className="text-green-600">Active</span>
              </div>
            ))}
          </div>
        )}
        {widget.id === "recent-alerts" && (
          <div className="mt-3 space-y-1.5">
            {["Schema change detected", "Rate limit warning"].map((a) => (
              <div key={a} className="flex items-center gap-2 rounded bg-background px-2 py-1 text-xs">
                <Bell className="size-3 text-amber-500" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        )}
        {widget.id === "quick-actions" && (
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded bg-blue-600/10 p-2 text-center text-xs text-blue-600">+ Create Flow</div>
            <div className="flex-1 rounded bg-green-600/10 p-2 text-center text-xs text-green-600">Run Flow</div>
          </div>
        )}
        {widget.id === "api-usage" && (
          <div className="mt-3">
            <div className="h-2 rounded-full bg-muted"><div className="h-2 w-3/5 rounded-full bg-blue-600" /></div>
            <p className="mt-1 text-center text-xs">6,200 / 10,000 requests</p>
          </div>
        )}
        {widget.id === "cost-breakdown" && (
          <div className="mt-3 space-y-1.5">
            {[["Compute", "$12.40"], ["Storage", "$3.20"], ["API", "$1.80"]].map(([k, v]) => (
              <div key={k} className="flex justify-between rounded bg-background px-2 py-1 text-xs">
                <span>{k}</span><span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
        {widget.id === "top-flows" && (
          <div className="mt-3 space-y-1.5">
            {[["Product Scraper", "99.2%"], ["Price Monitor", "97.8%"]].map(([n, r]) => (
              <div key={n} className="flex justify-between rounded bg-background px-2 py-1 text-xs">
                <span>{n}</span><span className="text-green-600 font-medium">{r}</span>
              </div>
            ))}
          </div>
        )}
        {widget.id === "scheduled-runs" && (
          <div className="mt-3 space-y-1.5">
            {[["Price Monitor", "in 15m"], ["News Feed", "in 1h"]].map(([n, t]) => (
              <div key={n} className="flex justify-between rounded bg-background px-2 py-1 text-xs">
                <span>{n}</span><span className="text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        )}
        {widget.id === "team-activity" && (
          <div className="mt-3 space-y-1.5">
            {[["Alice created a flow", "2m ago"], ["Bob ran Product Scraper", "5m ago"]].map(([a, t]) => (
              <div key={a} className="flex justify-between rounded bg-background px-2 py-1 text-xs">
                <span>{a}</span><span className="text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CustomizeDashboardPage() {
  const [enabledWidgets, setEnabledWidgets] = useState<WidgetConfig[]>(getDefaultWidgets)
  const [configWidget, setConfigWidget] = useState<WidgetConfig | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const ids = JSON.parse(stored) as WidgetConfig[]
        const restored = ids.map((saved) => {
          const base = AVAILABLE_WIDGETS.find((w) => w.id === saved.id)
          if (!base) return null
          return { ...base, title: saved.title, timeRange: saved.timeRange, size: saved.size, refreshInterval: saved.refreshInterval }
        }).filter(Boolean) as WidgetConfig[]
        if (restored.length > 0) setEnabledWidgets(restored)
      }
    } catch {
      // ignore
    }
  }, [])

  const enabledIds = new Set(enabledWidgets.map((w) => w.id))
  const availableToAdd = AVAILABLE_WIDGETS.filter((w) => !enabledIds.has(w.id))

  function addWidget(widget: WidgetConfig) {
    setEnabledWidgets((prev) => [...prev, { ...widget }])
  }

  function removeWidget(widgetId: string) {
    setEnabledWidgets((prev) => prev.filter((w) => w.id !== widgetId))
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledWidgets))
    toast.success("Dashboard layout saved")
  }

  function handleReset() {
    const defaults = getDefaultWidgets()
    setEnabledWidgets(defaults)
    localStorage.removeItem(STORAGE_KEY)
    toast.success("Dashboard reset to default layout")
  }

  function handleConfigSave(updated: WidgetConfig) {
    setEnabledWidgets((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w))
    )
    setConfigWidget(null)
  }

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    setEnabledWidgets((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      return next
    })
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-crimson-text)] text-3xl font-bold tracking-tight">
            Customize Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag and arrange widgets to create your ideal dashboard view
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleReset}>
            <RotateCcw className="size-3.5" />
            Reset to Default
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            <Save className="size-3.5" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <h2 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
            Available Widgets
          </h2>
          <div className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {availableToAdd.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                All widgets have been added
              </p>
            )}
            {availableToAdd.map((widget) => {
              const Icon = widget.icon
              return (
                <Card
                  key={widget.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => addWidget(widget)}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="rounded-md bg-blue-600/10 p-2">
                      <Icon className="size-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{widget.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{widget.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 text-xs text-blue-600">
                      Add
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
            Dashboard Preview
          </h2>
          {enabledWidgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <Activity className="text-muted-foreground mb-4 size-12" />
              <h3 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
                No widgets added
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Click widgets from the left panel to add them
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {enabledWidgets.map((widget, index) => (
                <Card
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "transition-all",
                    widget.size === "large" && "sm:col-span-2",
                    dragIndex === index && "opacity-50",
                    dragOverIndex === index && dragIndex !== index && "ring-2 ring-blue-500"
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="size-4 cursor-grab text-muted-foreground active:cursor-grabbing" />
                      <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setConfigWidget({ ...widget })}
                      >
                        <Settings className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-red-500"
                        onClick={() => removeWidget(widget.id)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <WidgetPreview widget={widget} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!configWidget} onOpenChange={(o) => !o && setConfigWidget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Widget Configuration</DialogTitle>
          </DialogHeader>
          {configWidget && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="widget-title">Widget Title</Label>
                <Input
                  id="widget-title"
                  value={configWidget.title}
                  onChange={(e) => setConfigWidget({ ...configWidget, title: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Time Range</Label>
                <Select
                  value={configWidget.timeRange}
                  onValueChange={(v) => setConfigWidget({ ...configWidget, timeRange: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Size</Label>
                <Select
                  value={configWidget.size}
                  onValueChange={(v) => setConfigWidget({ ...configWidget, size: v as WidgetConfig["size"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Refresh Interval</Label>
                <Select
                  value={configWidget.refreshInterval}
                  onValueChange={(v) => setConfigWidget({ ...configWidget, refreshInterval: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="1m">Every 1 minute</SelectItem>
                    <SelectItem value="5m">Every 5 minutes</SelectItem>
                    <SelectItem value="15m">Every 15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigWidget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => configWidget && handleConfigSave(configWidget)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  Save,
  Plus,
  GripVertical,
  Globe,
  MousePointerClick,
  Type,
  FileText,
  Clock,
  ScrollText,
  Camera,
  GitBranch,
  Repeat,
  Trash2,
  Copy,
  Terminal,
  Code2,
  Settings,
  Activity,
  Calendar,
  Bell,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  Eye,
  Search,
  ArrowUpDown,
  Hash,
  Braces,
  Download,
  Upload,
  History,
  RotateCcw,
  GitCompare,
  Shield,
  Fingerprint,
  Timer,
  Layers,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { downloadJSON } from "@/lib/export"
import { toast } from "sonner"
import type { Flow, FlowStep, StepType, Run } from "@/lib/types"

const stepTypeConfig: Record<StepType, { label: string; icon: typeof Globe; color: string }> = {
  navigate: { label: "Navigate", icon: Globe, color: "text-blue-600" },
  click: { label: "Click", icon: MousePointerClick, color: "text-purple-600" },
  fill: { label: "Fill", icon: Type, color: "text-green-600" },
  extract: { label: "Extract", icon: FileText, color: "text-amber-600" },
  wait: { label: "Wait", icon: Clock, color: "text-muted-foreground" },
  scroll: { label: "Scroll", icon: ScrollText, color: "text-cyan-600" },
  screenshot: { label: "Screenshot", icon: Camera, color: "text-pink-600" },
  condition: { label: "Condition", icon: GitBranch, color: "text-orange-600" },
  loop: { label: "Loop", icon: Repeat, color: "text-indigo-600" },
}

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

const runStatusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  completed: { color: "text-green-600", icon: CheckCircle2 },
  failed: { color: "text-red-600", icon: XCircle },
  running: { color: "text-blue-600", icon: Loader2 },
  queued: { color: "text-yellow-600", icon: Clock },
  cancelled: { color: "text-muted-foreground", icon: XCircle },
}

export default function FlowDetailPage() {
  const params = useParams()
  const flowId = params.id as string

  const [flow, setFlow] = useState<Flow | null>(null)
  const [flowRuns, setFlowRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [flowRes, runsRes] = await Promise.all([
          fetch(`/api/flows/${flowId}`),
          fetch(`/api/runs?flowId=${flowId}`),
        ])
        if (flowRes.ok) {
          const flowData = await flowRes.json()
          setFlow(flowData.data || flowData)
        }
        if (runsRes.ok) {
          const runsData = await runsRes.json()
          const arr = Array.isArray(runsData) ? runsData : runsData.data || []
          setFlowRuns(arr)
        }
      } catch {
        // fallback silently
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [flowId])

  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("builder")
  const [mobileBuilderTab, setMobileBuilderTab] = useState<"steps" | "preview" | "config">("steps")
  const [steps, setSteps] = useState<FlowStep[]>([])
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)

  useEffect(() => {
    if (flow) {
      setSteps(flow.steps || [])
      setSelectedStepId(flow.steps?.[0]?.id ?? null)
    }
  }, [flow])

  const selectedStep = useMemo(() => {
    function findStep(s: FlowStep[]): FlowStep | undefined {
      for (const step of s) {
        if (step.id === selectedStepId) return step
        if (step.children) {
          const found = findStep(step.children)
          if (found) return found
        }
      }
    }
    return findStep(steps)
  }, [steps, selectedStepId])

  function handleAddStep(type: StepType) {
    const cfg = stepTypeConfig[type]
    const newStep: FlowStep = {
      id: `step-${Date.now()}`,
      type,
      label: `${cfg.label} Step`,
      config: {},
    }
    setSteps((prev) => [...prev, newStep])
    setSelectedStepId(newStep.id)
    toast.success(`${cfg.label} step added`)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!flow) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">Flow not found</h2>
        <p className="text-muted-foreground text-sm">The flow you are looking for does not exist.</p>
        <Button variant="outline" asChild>
          <Link href="/flows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flows
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/flows">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-[family-name:var(--font-crimson-text)] text-xl font-bold">
                {flow.name}
              </h1>
              <p className="text-muted-foreground text-xs">{flow.url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{flow.mode}</Badge>
            <Badge
              variant="secondary"
              className={cn(
                flow.status === "active" && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                flow.status === "paused" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
                flow.status === "draft" && "bg-muted text-muted-foreground",
                flow.status === "error" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              )}
            >
              {flow.status}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b px-4">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger value="builder" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <Code2 className="mr-2 h-4 w-4" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="runs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <Activity className="mr-2 h-4 w-4" />
                Runs
              </TabsTrigger>
              <TabsTrigger value="api" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <Terminal className="mr-2 h-4 w-4" />
                API
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="flex-1 overflow-hidden mt-0 p-0">
            {isMobile ? (
              <div className="flex h-full flex-col">
                <div className="flex border-b">
                  {(["steps", "preview", "config"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileBuilderTab(tab)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors",
                        mobileBuilderTab === tab
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-auto">
                  {mobileBuilderTab === "steps" && (
                    <StepsPanel
                      steps={steps}
                      selectedStepId={selectedStepId}
                      onSelectStep={(id) => {
                        setSelectedStepId(id)
                        setMobileBuilderTab("config")
                      }}
                      onAddStep={handleAddStep}
                    />
                  )}
                  {mobileBuilderTab === "preview" && (
                    <PreviewPanel url={flow.url} selectedStep={selectedStep} />
                  )}
                  {mobileBuilderTab === "config" && (
                    <ConfigPanel step={selectedStep} outputSchema={flow.outputSchema} />
                  )}
                </div>
              </div>
            ) : (
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={22} minSize={18} maxSize={35}>
                  <StepsPanel
                    steps={steps}
                    selectedStepId={selectedStepId}
                    onSelectStep={setSelectedStepId}
                    onAddStep={handleAddStep}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={48} minSize={30}>
                  <PreviewPanel url={flow.url} selectedStep={selectedStep} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={22} maxSize={45}>
                  <ConfigPanel step={selectedStep} outputSchema={flow.outputSchema} />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </TabsContent>

          <TabsContent value="runs" className="flex-1 overflow-auto mt-0 p-0">
            <RunsTab runs={flowRuns} flowId={flow.id} flowName={flow.name} onRunComplete={async () => {
              const runsRes = await fetch(`/api/runs?flowId=${flowId}`)
              if (runsRes.ok) {
                const runsData = await runsRes.json()
                setFlowRuns(Array.isArray(runsData) ? runsData : runsData.data || [])
              }
            }} />
          </TabsContent>

          <TabsContent value="api" className="flex-1 overflow-auto mt-0 p-0">
            <ApiTab flowId={flow.id} flowName={flow.name} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto mt-0 p-0">
            <SettingsTab flow={flow} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{steps.length} steps</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Avg {formatDuration(flow.avgDuration)}</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <Terminal className="h-3 w-3" />
              <code className="font-mono text-xs">POST /api/flows/{flow.id}/run</code>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast("Schedule configured")}>
              <Calendar className="mr-2 h-3.5 w-3.5" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Flow saved")}>
              <Save className="mr-2 h-3.5 w-3.5" />
              Save
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
              toast.info(`Running "${flow.name}"...`)
              try {
                const res = await fetch("/api/runs/trigger", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ flowId: flow.id }),
                })
                const data = await res.json()
                if (data.error) {
                  toast.error(data.error)
                } else {
                  toast.success(`Completed! ${data.itemsExtracted} items extracted in ${(data.duration / 1000).toFixed(1)}s`)
                }
              } catch {
                toast.error("Failed to run flow")
              }
            }}>
              <Play className="mr-2 h-3.5 w-3.5" />
              Run Flow
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function StepsPanel({
  steps,
  selectedStepId,
  onSelectStep,
  onAddStep,
}: {
  steps: FlowStep[]
  selectedStepId: string | null
  onSelectStep: (id: string) => void
  onAddStep: (type: StepType) => void
}) {
  function renderStep(step: FlowStep, depth: number = 0) {
    const config = stepTypeConfig[step.type]
    const Icon = config.icon
    const isSelected = step.id === selectedStepId

    return (
      <div key={step.id}>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
            isSelected && "bg-muted ring-1 ring-border"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => onSelectStep(step.id)}
        >
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab shrink-0" />
          <div className={cn("flex h-6 w-6 items-center justify-center rounded shrink-0", isSelected ? "bg-muted-foreground/15" : "bg-muted")}>
            <Icon className={cn("h-3.5 w-3.5", config.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-medium text-xs">{step.label}</span>
            {step.selector && (
              <code className="block truncate text-[10px] text-muted-foreground font-mono">
                {step.selector}
              </code>
            )}
          </div>
        </button>
        {step.children?.map((child) => renderStep(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Steps
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(stepTypeConfig).map(([type, cfg]) => {
              const Icon = cfg.icon
              return (
                <DropdownMenuItem key={type} onClick={() => onAddStep(type as StepType)}>
                  <Icon className={cn("mr-2 h-4 w-4", cfg.color)} />
                  {cfg.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-0.5">
          {steps.map((step) => renderStep(step))}
        </div>
      </ScrollArea>
    </div>
  )
}

function PreviewPanel({
  url,
  selectedStep,
}: {
  url: string
  selectedStep?: FlowStep
}) {
  return (
    <div className="flex h-full flex-col bg-muted/20">
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="bg-background flex flex-1 items-center gap-2 rounded-md border px-3 py-1 text-xs">
          <Lock className="h-3 w-3 text-green-600" />
          <span className="text-muted-foreground font-mono truncate">{url}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
              Live Preview
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              The target page will render here when you run the flow. Selectors from the
              active step will be highlighted on the page.
            </p>
          </div>
          {selectedStep && (
            <Card className="w-full">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Active step:</span>
                  <Badge variant="secondary" className="text-xs">
                    {stepTypeConfig[selectedStep.type].label}
                  </Badge>
                  <span className="font-medium">{selectedStep.label}</span>
                </div>
                {selectedStep.selector && (
                  <div className="mt-2 rounded bg-muted p-2 font-mono text-xs">
                    <span className="text-muted-foreground">selector: </span>
                    <span className="text-blue-600">{selectedStep.selector}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Button variant="outline" size="sm">
            <Play className="mr-2 h-3.5 w-3.5" />
            Load Preview
          </Button>
        </div>
      </div>
    </div>
  )
}

function ConfigPanel({
  step,
  outputSchema,
}: {
  step?: FlowStep
  outputSchema: Record<string, unknown>
}) {
  if (!step) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">Select a step to configure</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Configuration
        </span>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate step</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete step</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
          <div className="flex items-center gap-2">
            {(() => {
              const cfg = stepTypeConfig[step.type]
              const Icon = cfg.icon
              return (
                <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Icon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{cfg.label} Step</p>
                    <p className="text-xs text-muted-foreground">{step.id}</p>
                  </div>
                </>
              )
            })()}
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label className="text-xs">Label</Label>
            <Input defaultValue={step.label} className="h-8 text-sm" />
          </div>

          {(step.type === "navigate") && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">URL</Label>
              <Input defaultValue={step.selector || ""} placeholder="https://..." className="h-8 text-sm font-mono" />
            </div>
          )}

          {(step.type === "click" || step.type === "scroll") && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">CSS Selector</Label>
              <Input defaultValue={step.selector || ""} placeholder=".class, #id, [attr]" className="h-8 text-sm font-mono" />
              <p className="text-muted-foreground text-[10px]">
                Use the preview panel to visually select elements
              </p>
            </div>
          )}

          {step.type === "fill" && (
            <>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">CSS Selector</Label>
                <Input defaultValue={step.selector || ""} placeholder="#input-id" className="h-8 text-sm font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Value</Label>
                <Input defaultValue={step.value || ""} placeholder="Text to enter or {{variable}}" className="h-8 text-sm" />
                <p className="text-muted-foreground text-[10px]">
                  Use {"{{variable}}"} syntax for dynamic values
                </p>
              </div>
            </>
          )}

          {step.type === "wait" && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Wait Condition</Label>
              <Select defaultValue="selector">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selector">Wait for selector</SelectItem>
                  <SelectItem value="timeout">Fixed timeout</SelectItem>
                  <SelectItem value="navigation">Wait for navigation</SelectItem>
                  <SelectItem value="network">Wait for network idle</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder=".element-to-wait-for" className="h-8 text-sm font-mono" />
            </div>
          )}

          {step.type === "condition" && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Condition Selector</Label>
              <Input defaultValue={step.condition || ""} placeholder="Selector to check existence" className="h-8 text-sm font-mono" />
              <p className="text-muted-foreground text-[10px]">
                If this selector exists on the page, child steps will execute
              </p>
            </div>
          )}

          {step.type === "extract" && step.extractionRules && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Extraction Rules</Label>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-8 text-xs">Field</TableHead>
                      <TableHead className="h-8 text-xs">Selector</TableHead>
                      <TableHead className="h-8 text-xs">Transform</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {step.extractionRules.map((rule, i) => (
                      <TableRow key={i} className="hover:bg-muted/50">
                        <TableCell className="py-1.5">
                          <code className="text-xs font-mono">{rule.field}</code>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <code className="text-xs font-mono text-blue-600">{rule.selector}</code>
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Badge variant="secondary" className="text-[10px]">
                            {rule.transform || "text"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" size="sm" className="w-fit text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Add Rule
              </Button>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <Label className="text-xs">Output Schema</Label>
            <div className="rounded-md border bg-muted/50 p-3">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(outputSchema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function RunsTab({ runs, flowId, flowName, onRunComplete }: { runs: Run[]; flowId: string; flowName: string; onRunComplete: () => void }) {
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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

function ApiTab({ flowId, flowName }: { flowId: string; flowName: string }) {
  const endpoint = `https://scraper.bot/api/flows/${flowId}/run`
  const curlExample = `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer scr_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhook": "https://your-site.com/webhook",
    "format": "json"
  }'`

  const jsExample = `import { Scraper } from '@scraper/sdk';

const scraper = new Scraper('scr_live_your_api_key');

const run = await scraper.flows.run('${flowId}', {
  webhook: 'https://your-site.com/webhook',
  format: 'json',
});

console.log(run.id); // run_xxxxxxxxxxxxx`

  const pythonExample = `from scraper import Scraper

client = Scraper(api_key="scr_live_your_api_key")

run = client.flows.run(
    flow_id="${flowId}",
    webhook="https://your-site.com/webhook",
    format="json",
)

print(run.id)  # run_xxxxxxxxxxxxx`

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">
            API Access
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Trigger &quot;{flowName}&quot; programmatically via the REST API or SDK.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <Badge className="bg-green-600 hover:bg-green-600 text-xs shrink-0">POST</Badge>
              <code className="font-mono text-sm truncate">{endpoint}</code>
              <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto shrink-0">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">cURL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{curlExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">JavaScript / TypeScript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{jsExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Python</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="rounded-md bg-zinc-950 p-4 text-xs text-zinc-100 overflow-x-auto">
                <code>{pythonExample}</code>
              </pre>
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-zinc-400 hover:text-zinc-100">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const mockVersionHistory = [
  {
    version: 3,
    date: "2026-03-18",
    author: "Wyatt",
    changes: "Updated extraction rules",
    current: true,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "wait", label: "Wait for content" },
        { type: "extract", label: "Extract data (updated selectors)" },
      ],
    },
  },
  {
    version: 2,
    date: "2026-03-15",
    author: "Wyatt",
    changes: "Added pagination step",
    current: false,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "wait", label: "Wait for content" },
        { type: "extract", label: "Extract data" },
        { type: "click", label: "Next page", selector: ".pagination .next" },
      ],
    },
  },
  {
    version: 1,
    date: "2026-03-10",
    author: "Wyatt",
    changes: "Initial version",
    current: false,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "extract", label: "Extract data" },
      ],
    },
  },
]

function SettingsTab({ flow }: { flow: Flow }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importPreview, setImportPreview] = useState<Record<string, unknown> | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [restoreTarget, setRestoreTarget] = useState<(typeof mockVersionHistory)[0] | null>(null)
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)
  const [compareVersions, setCompareVersions] = useState<{
    from: (typeof mockVersionHistory)[0]
    to: (typeof mockVersionHistory)[0]
  } | null>(null)

  function handleExport() {
    const exportData = {
      name: flow.name,
      description: flow.description,
      url: flow.url,
      mode: flow.mode,
      steps: flow.steps,
      outputSchema: flow.outputSchema,
    }
    downloadJSON(exportData, `flow-${flow.id}`)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        setImportPreview(parsed)
        setImportDialogOpen(true)
      } catch {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleCompare(from: (typeof mockVersionHistory)[0], to: (typeof mockVersionHistory)[0]) {
    setCompareVersions({ from, to })
    setCompareDialogOpen(true)
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">
            Settings
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure schedule, notifications, and retry behavior.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" />
              Import / Export
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Export this flow as JSON for backup or sharing, or import a flow configuration from a file.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import Flow
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Versions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                View and restore previous versions of this flow.
              </p>
              {mockVersionHistory.length >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCompare(mockVersionHistory[1], mockVersionHistory[0])
                  }
                >
                  <GitCompare className="mr-2 h-3.5 w-3.5" />
                  Compare
                </Button>
              )}
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVersionHistory.map((v) => (
                    <TableRow key={v.version}>
                      <TableCell className="font-mono text-sm">
                        v{v.version}
                        {v.current && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            current
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{v.date}</TableCell>
                      <TableCell className="text-sm">{v.author}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {v.changes}
                      </TableCell>
                      <TableCell>
                        {!v.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setRestoreTarget(v)}
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restore
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Timezone-Aware Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enabled</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Automatically run this flow on a schedule
                </p>
              </div>
              <Switch defaultChecked={flow.schedule?.enabled} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Cron Expression</Label>
              <Input
                defaultValue={flow.schedule?.expression || ""}
                placeholder="0 */6 * * *"
                className="h-8 text-sm font-mono"
              />
              <p className="text-muted-foreground text-[10px]">
                {flow.schedule?.expression === "0 */6 * * *"
                  ? "Every 6 hours"
                  : flow.schedule?.expression === "0 8 * * *"
                    ? "Daily at 8:00 AM"
                    : flow.schedule?.expression === "0 */2 * * *"
                      ? "Every 2 hours"
                      : "Custom schedule"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Timezone</Label>
              <Select defaultValue={flow.schedule?.timezone || "America/New_York"}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="America/Chicago">America/Chicago (CST)</SelectItem>
                  <SelectItem value="America/Denver">America/Denver (MST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Next 5 Runs</Label>
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-muted-foreground">
                  <span>1. Mar 19, 2026 at 12:00 PM EST</span>
                  <span>2. Mar 19, 2026 at 6:00 PM EST</span>
                  <span>3. Mar 20, 2026 at 12:00 AM EST</span>
                  <span>4. Mar 20, 2026 at 6:00 AM EST</span>
                  <span>5. Mar 20, 2026 at 12:00 PM EST</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>On Failure</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Get notified when a run fails
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>On Success</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Get notified when a run completes
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>On Change Detected</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Alert when monitored data changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4" />
              Retry Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Max Retries</Label>
              <Input defaultValue="3" min={1} max={10} className="h-8 text-sm" type="number" />
              <p className="text-muted-foreground text-[10px]">Between 1 and 10 retries</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Backoff Strategy</Label>
              <Select defaultValue="exponential">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Initial Delay (seconds)</Label>
                <Input defaultValue="5" className="h-8 text-sm" type="number" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Max Delay (seconds)</Label>
                <Input defaultValue="60" className="h-8 text-sm" type="number" />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Retry On</Label>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-network" defaultChecked />
                  <label htmlFor="retry-network" className="text-sm">Network error</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-ratelimit" defaultChecked />
                  <label htmlFor="retry-ratelimit" className="text-sm">Rate limit (429)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-server" defaultChecked />
                  <label htmlFor="retry-server" className="text-sm">Server error (5xx)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-timeout" defaultChecked />
                  <label htmlFor="retry-timeout" className="text-sm">Timeout</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" />
              Concurrency
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Concurrent Run Limit</Label>
              <div className="flex items-center gap-3">
                <Slider defaultValue={[1]} min={1} max={10} step={1} className="flex-1" />
                <span className="text-sm font-mono w-6 text-right">1</span>
              </div>
              <p className="text-muted-foreground text-[10px]">Maximum parallel runs (1-10)</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Queue Behavior</Label>
              <Select defaultValue="queue">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="queue">Queue excess</SelectItem>
                  <SelectItem value="skip">Skip if running</SelectItem>
                  <SelectItem value="cancel">Cancel previous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Timeout (seconds)</Label>
              <Input defaultValue="300" className="h-8 text-sm" type="number" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              CAPTCHA &amp; Anti-Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>CAPTCHA Solving</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Automatically solve CAPTCHAs during flow execution
                </p>
              </div>
              <Switch id="captcha-solving" />
            </div>
            <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Provider</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (recommended)</SelectItem>
                    <SelectItem value="2captcha">2Captcha</SelectItem>
                    <SelectItem value="anticaptcha">Anti-Captcha</SelectItem>
                    <SelectItem value="hcaptcha">hCaptcha Solver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Supported CAPTCHA Types</Label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-recaptchav2" defaultChecked />
                    <label htmlFor="captcha-recaptchav2" className="text-sm">reCAPTCHA v2</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-recaptchav3" defaultChecked />
                    <label htmlFor="captcha-recaptchav3" className="text-sm">reCAPTCHA v3</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-hcaptcha" defaultChecked />
                    <label htmlFor="captcha-hcaptcha" className="text-sm">hCaptcha</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-turnstile" defaultChecked />
                    <label htmlFor="captcha-turnstile" className="text-sm">Cloudflare Turnstile</label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">API Key (external provider)</Label>
                <Input placeholder="Enter provider API key" className="h-8 text-sm font-mono" type="password" />
              </div>
              <Button variant="outline" size="sm" className="w-fit" onClick={() => toast.success("CAPTCHA solving test passed")}>
                Test CAPTCHA Solving
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-semibold">Anti-Bot Protection</Label>
              <p className="text-muted-foreground text-xs mt-0.5 mb-3">
                Evade bot detection systems with human-like behavior
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Browser fingerprint randomization</Label>
                    <p className="text-muted-foreground text-[10px]">Rotate canvas, WebGL, and navigator fingerprints</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Human-like delays</Label>
                    <p className="text-muted-foreground text-[10px]">Add random delays between actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Delay Range</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">500ms</span>
                    <Slider defaultValue={[800, 2500]} min={500} max={5000} step={100} className="flex-1" />
                    <span className="text-xs text-muted-foreground w-14 text-right">5000ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Request header rotation</Label>
                    <p className="text-muted-foreground text-[10px]">Randomize User-Agent and Accept headers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Cookie persistence</Label>
                    <p className="text-muted-foreground text-[10px]">Maintain cookies across requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Flow Preview</DialogTitle>
            <DialogDescription>
              Review the flow configuration before importing.
            </DialogDescription>
          </DialogHeader>
          {importPreview && (
            <div className="rounded-md border bg-muted/50 p-3 max-h-80 overflow-auto">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(importPreview, null, 2)}
              </pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setImportDialogOpen(false)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!restoreTarget} onOpenChange={(o) => !o && setRestoreTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore to v{restoreTarget?.version}? This will overwrite
              the current flow configuration. A new version will be created from the current state
              before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setRestoreTarget(null)}
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Compare Versions: v{compareVersions?.from.version} vs v{compareVersions?.to.version}
            </DialogTitle>
            <DialogDescription>
              Differences between version {compareVersions?.from.version} and version{" "}
              {compareVersions?.to.version}.
            </DialogDescription>
          </DialogHeader>
          {compareVersions && (
            <div className="rounded-md border bg-zinc-950 p-4 max-h-96 overflow-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                <span className="text-zinc-500">{"--- v" + compareVersions.from.version + " (" + compareVersions.from.date + ")\n"}</span>
                <span className="text-zinc-500">{"+++ v" + compareVersions.to.version + " (" + compareVersions.to.date + ")\n\n"}</span>
                {compareVersions.from.snapshot.steps.map((step, i) => {
                  const toStep = compareVersions.to.snapshot.steps[i]
                  if (!toStep) {
                    return (
                      <span key={`removed-${i}`} className="text-red-400">
                        {"- " + JSON.stringify(step) + "\n"}
                      </span>
                    )
                  }
                  if (JSON.stringify(step) !== JSON.stringify(toStep)) {
                    return (
                      <span key={`changed-${i}`}>
                        <span className="text-red-400">{"- " + JSON.stringify(step) + "\n"}</span>
                        <span className="text-green-400">{"+ " + JSON.stringify(toStep) + "\n"}</span>
                      </span>
                    )
                  }
                  return (
                    <span key={`same-${i}`} className="text-zinc-400">
                      {"  " + JSON.stringify(step) + "\n"}
                    </span>
                  )
                })}
                {compareVersions.to.snapshot.steps.slice(compareVersions.from.snapshot.steps.length).map((step, i) => (
                  <span key={`added-${i}`} className="text-green-400">
                    {"+ " + JSON.stringify(step) + "\n"}
                  </span>
                ))}
              </pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Globe,
  Clock,
  Webhook,
  ArrowRight,
  MousePointer,
  Keyboard,
  ArrowDown,
  Timer,
  Camera,
  Database,
  Shuffle,
  Filter,
  GitBranch,
  Repeat,
  Shield,
  FileJson,
  Send,
  Mail,
  FileSpreadsheet,
  Play,
  Save,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo2,
  Redo2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Trash2,
  GripVertical,
  Plus,
  Minus,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NodeCategory = "trigger" | "browser" | "data" | "logic" | "output"

interface NodeType {
  id: string
  label: string
  icon: LucideIcon
  category: NodeCategory
  description: string
}

interface WorkflowNode {
  id: string
  typeId: string
  x: number
  y: number
  config: Record<string, string | string[]>
}

interface Connection {
  id: string
  from: string
  to: string
}

const categoryColors: Record<NodeCategory, { bg: string; border: string; text: string; dot: string }> = {
  trigger: { bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  browser: { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  data: { bg: "bg-purple-500/10 dark:bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
  logic: { bg: "bg-orange-500/10 dark:bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
  output: { bg: "bg-teal-500/10 dark:bg-teal-500/20", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500" },
}

const categoryHeaderColors: Record<NodeCategory, string> = {
  trigger: "bg-blue-500",
  browser: "bg-emerald-500",
  data: "bg-purple-500",
  logic: "bg-orange-500",
  output: "bg-teal-500",
}

const nodeTypes: NodeType[] = [
  { id: "url-trigger", label: "URL Trigger", icon: Globe, category: "trigger", description: "Start with a URL" },
  { id: "schedule-trigger", label: "Schedule Trigger", icon: Clock, category: "trigger", description: "Run on cron schedule" },
  { id: "webhook-trigger", label: "Webhook Trigger", icon: Webhook, category: "trigger", description: "Trigger via API" },
  { id: "navigate", label: "Navigate", icon: ArrowRight, category: "browser", description: "Go to URL" },
  { id: "click", label: "Click", icon: MousePointer, category: "browser", description: "Click an element" },
  { id: "type-fill", label: "Type / Fill", icon: Keyboard, category: "browser", description: "Type into a field" },
  { id: "scroll", label: "Scroll", icon: ArrowDown, category: "browser", description: "Scroll the page" },
  { id: "wait", label: "Wait", icon: Timer, category: "browser", description: "Wait for element" },
  { id: "screenshot", label: "Screenshot", icon: Camera, category: "browser", description: "Capture screenshot" },
  { id: "extract-data", label: "Extract Data", icon: Database, category: "data", description: "Extract structured data" },
  { id: "transform", label: "Transform", icon: Shuffle, category: "data", description: "Transform data" },
  { id: "filter", label: "Filter", icon: Filter, category: "data", description: "Filter results" },
  { id: "map-fields", label: "Map Fields", icon: GitBranch, category: "data", description: "Map data fields" },
  { id: "if-else", label: "If / Else", icon: GitBranch, category: "logic", description: "Conditional branch" },
  { id: "loop", label: "Loop", icon: Repeat, category: "logic", description: "Iterate over items" },
  { id: "try-catch", label: "Try / Catch", icon: Shield, category: "logic", description: "Error handling" },
  { id: "save-json", label: "Save to JSON", icon: FileJson, category: "output", description: "Save as JSON file" },
  { id: "send-webhook", label: "Send Webhook", icon: Send, category: "output", description: "POST to endpoint" },
  { id: "send-email", label: "Send Email", icon: Mail, category: "output", description: "Send email alert" },
  { id: "google-sheets", label: "Google Sheets", icon: FileSpreadsheet, category: "output", description: "Write to spreadsheet" },
]

const nodeTypeMap = Object.fromEntries(nodeTypes.map((nt) => [nt.id, nt]))

const categoryLabels: { key: NodeCategory; label: string }[] = [
  { key: "trigger", label: "Triggers" },
  { key: "browser", label: "Browser Actions" },
  { key: "data", label: "Data" },
  { key: "logic", label: "Logic" },
  { key: "output", label: "Output" },
]

const initialNodes: WorkflowNode[] = [
  { id: "n1", typeId: "url-trigger", x: 80, y: 220, config: { url: "https://example-store.com/products", description: "Start scraping product catalog" } },
  { id: "n2", typeId: "navigate", x: 340, y: 220, config: { url: "https://example-store.com/products" } },
  { id: "n3", typeId: "extract-data", x: 600, y: 220, config: { fields: "title, price, url", selector: ".product-card", attribute: "text" } },
  { id: "n4", typeId: "filter", x: 600, y: 440, config: { field: "price", operator: "greater_than", value: "10" } },
  { id: "n5", typeId: "save-json", x: 860, y: 220, config: { filename: "products.json", format: "json" } },
]

const initialConnections: Connection[] = [
  { id: "c1", from: "n1", to: "n2" },
  { id: "c2", from: "n2", to: "n3" },
  { id: "c3", from: "n3", to: "n4" },
  { id: "c4", from: "n3", to: "n5" },
]

const NODE_WIDTH = 192
const NODE_HEIGHT = 88
const PORT_RADIUS = 6

function getOutputPort(node: WorkflowNode) {
  return { x: node.x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 }
}

function getInputPort(node: WorkflowNode) {
  return { x: node.x, y: node.y + NODE_HEIGHT / 2 }
}

function NodeConfigPanel({
  node,
  nodeType,
  onClose,
  onUpdate,
  onDelete,
}: {
  node: WorkflowNode
  nodeType: NodeType
  onClose: () => void
  onUpdate: (config: Record<string, string | string[]>) => void
  onDelete: () => void
}) {
  const colors = categoryColors[nodeType.category]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={cn("flex size-7 items-center justify-center rounded-md", colors.bg)}>
            <nodeType.icon className={cn("size-4", colors.text)} />
          </div>
          <span className="text-sm font-semibold">{nodeType.label}</span>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <p className="text-muted-foreground text-xs">{nodeType.description}</p>
        <Separator />

        {nodeType.id === "url-trigger" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">URL</Label>
              <Input
                placeholder="https://example.com"
                value={(node.config.url as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, url: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="What does this trigger do?"
                value={(node.config.description as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, description: e.target.value })}
                className="min-h-[60px] text-xs"
              />
            </div>
          </>
        )}

        {nodeType.id === "navigate" && (
          <div className="space-y-2">
            <Label className="text-xs">URL</Label>
            <Input
              placeholder="https://example.com/page"
              value={(node.config.url as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, url: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        )}

        {nodeType.id === "extract-data" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">CSS Selector</Label>
              <Input
                placeholder=".product-card"
                value={(node.config.selector as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, selector: e.target.value })}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fields (comma-separated)</Label>
              <Input
                placeholder="title, price, url"
                value={(node.config.fields as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, fields: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Attribute</Label>
              <Select
                value={(node.config.attribute as string) || "text"}
                onValueChange={(v) => onUpdate({ ...node.config, attribute: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Content</SelectItem>
                  <SelectItem value="html">Inner HTML</SelectItem>
                  <SelectItem value="href">href</SelectItem>
                  <SelectItem value="src">src</SelectItem>
                  <SelectItem value="value">value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {nodeType.id === "filter" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Field</Label>
              <Input
                placeholder="price"
                value={(node.config.field as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, field: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Operator</Label>
              <Select
                value={(node.config.operator as string) || "equals"}
                onValueChange={(v) => onUpdate({ ...node.config, operator: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="regex">Regex Match</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Value</Label>
              <Input
                placeholder="Enter value"
                value={(node.config.value as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, value: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        {nodeType.id === "save-json" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Filename</Label>
              <Input
                placeholder="output.json"
                value={(node.config.filename as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, filename: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Format</Label>
              <Select
                value={(node.config.format as string) || "json"}
                onValueChange={(v) => onUpdate({ ...node.config, format: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="jsonl">JSON Lines</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {nodeType.id === "click" && (
          <div className="space-y-2">
            <Label className="text-xs">CSS Selector</Label>
            <Input
              placeholder="#submit-btn"
              value={(node.config.selector as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, selector: e.target.value })}
              className="h-8 font-mono text-xs"
            />
          </div>
        )}

        {nodeType.id === "type-fill" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">CSS Selector</Label>
              <Input
                placeholder="#search-input"
                value={(node.config.selector as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, selector: e.target.value })}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Value</Label>
              <Input
                placeholder="Text to type"
                value={(node.config.value as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, value: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        {nodeType.id === "wait" && (
          <div className="space-y-2">
            <Label className="text-xs">Wait for (selector or ms)</Label>
            <Input
              placeholder=".results or 2000"
              value={(node.config.selector as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, selector: e.target.value })}
              className="h-8 font-mono text-xs"
            />
          </div>
        )}

        {nodeType.id === "scroll" && (
          <div className="space-y-2">
            <Label className="text-xs">Scroll target</Label>
            <Select
              value={(node.config.target as string) || "bottom"}
              onValueChange={(v) => onUpdate({ ...node.config, target: v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom">Page Bottom</SelectItem>
                <SelectItem value="element">To Element</SelectItem>
                <SelectItem value="pixels">By Pixels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {nodeType.id === "send-webhook" && (
          <div className="space-y-2">
            <Label className="text-xs">Webhook URL</Label>
            <Input
              placeholder="https://api.example.com/webhook"
              value={(node.config.url as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, url: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        )}

        {nodeType.id === "send-email" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">To</Label>
              <Input
                placeholder="user@example.com"
                value={(node.config.to as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, to: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Input
                placeholder="Scrape results"
                value={(node.config.subject as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, subject: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        {(nodeType.id === "if-else" || nodeType.id === "loop" || nodeType.id === "try-catch") && (
          <div className="space-y-2">
            <Label className="text-xs">Condition / Expression</Label>
            <Input
              placeholder={nodeType.id === "loop" ? "items.length" : ".element-exists"}
              value={(node.config.condition as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, condition: e.target.value })}
              className="h-8 font-mono text-xs"
            />
          </div>
        )}

        {(nodeType.id === "schedule-trigger") && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Cron Expression</Label>
              <Input
                placeholder="0 */6 * * *"
                value={(node.config.cron as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, cron: e.target.value })}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Timezone</Label>
              <Input
                placeholder="America/New_York"
                value={(node.config.timezone as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, timezone: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        {nodeType.id === "webhook-trigger" && (
          <div className="space-y-2">
            <Label className="text-xs">Webhook Path</Label>
            <Input
              placeholder="/api/trigger/my-flow"
              value={(node.config.path as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, path: e.target.value })}
              className="h-8 font-mono text-xs"
            />
          </div>
        )}

        {nodeType.id === "screenshot" && (
          <div className="space-y-2">
            <Label className="text-xs">Capture</Label>
            <Select
              value={(node.config.capture as string) || "fullpage"}
              onValueChange={(v) => onUpdate({ ...node.config, capture: v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullpage">Full Page</SelectItem>
                <SelectItem value="viewport">Viewport Only</SelectItem>
                <SelectItem value="element">Specific Element</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {nodeType.id === "transform" && (
          <div className="space-y-2">
            <Label className="text-xs">Transform Expression</Label>
            <Textarea
              placeholder="data.map(item => ({ ...item, price: parseFloat(item.price) }))"
              value={(node.config.expression as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, expression: e.target.value })}
              className="min-h-[80px] font-mono text-xs"
            />
          </div>
        )}

        {nodeType.id === "map-fields" && (
          <div className="space-y-2">
            <Label className="text-xs">Field Mapping (source : target)</Label>
            <Textarea
              placeholder={"product_name : title\nproduct_price : price"}
              value={(node.config.mapping as string) || ""}
              onChange={(e) => onUpdate({ ...node.config, mapping: e.target.value })}
              className="min-h-[80px] font-mono text-xs"
            />
          </div>
        )}

        {nodeType.id === "google-sheets" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Spreadsheet ID</Label>
              <Input
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                value={(node.config.spreadsheetId as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, spreadsheetId: e.target.value })}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Sheet Name</Label>
              <Input
                placeholder="Sheet1"
                value={(node.config.sheet as string) || ""}
                onChange={(e) => onUpdate({ ...node.config, sheet: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        <Separator />

        <Button variant="outline" size="sm" className="w-full text-xs text-blue-600 border-blue-600/30 hover:bg-blue-600/10" onClick={() => toast.success("Step test passed")}>
          Test This Step
        </Button>
      </div>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="mr-1 size-3" />
          Delete Node
        </Button>
      </div>
    </div>
  )
}

function getNodeSummary(node: WorkflowNode, nodeType: NodeType): string {
  switch (nodeType.id) {
    case "url-trigger": {
      const url = node.config.url as string
      if (url) {
        try {
          return new URL(url).hostname
        } catch {
          return url.slice(0, 24)
        }
      }
      return "No URL set"
    }
    case "navigate": {
      const url = node.config.url as string
      return url ? (url.length > 24 ? url.slice(0, 24) + "..." : url) : "No URL set"
    }
    case "extract-data":
      return (node.config.fields as string) || "No fields set"
    case "filter": {
      const f = node.config.field as string
      const op = (node.config.operator as string || "").replace("_", " ")
      const v = node.config.value as string
      return f && v ? `${f} ${op} ${v}` : "No condition set"
    }
    case "save-json":
      return (node.config.filename as string) || "output.json"
    case "click":
      return (node.config.selector as string) || "No selector"
    case "type-fill":
      return (node.config.value as string) || "No value"
    case "wait":
      return (node.config.selector as string) || "No target"
    case "schedule-trigger":
      return (node.config.cron as string) || "No schedule"
    case "webhook-trigger":
      return (node.config.path as string) || "No path"
    default:
      return nodeType.description
  }
}

export default function WorkflowBuilderPage() {
  const isMobile = useIsMobile()
  const [flowName, setFlowName] = useState("Product Scraper Workflow")
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes)
  const [connections, setConnections] = useState<Connection[]>(initialConnections)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panelOpen, setPanelOpen] = useState(true)
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId])
  const selectedNodeType = selectedNode ? nodeTypeMap[selectedNode.typeId] : null

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId)
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.1, 2)), [])
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.1, 0.3)), [])
  const handleZoomFit = useCallback(() => setZoom(1), [])

  const handleUpdateConfig = useCallback(
    (config: Record<string, string | string[]>) => {
      if (!selectedNodeId) return
      setNodes((prev) => prev.map((n) => (n.id === selectedNodeId ? { ...n, config } : n)))
    },
    [selectedNodeId]
  )

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId))
    setConnections((prev) => prev.filter((c) => c.from !== selectedNodeId && c.to !== selectedNodeId))
    setSelectedNodeId(null)
    toast.success("Node deleted")
  }, [selectedNodeId])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      const canvasRect = (e.currentTarget as HTMLElement).closest("[data-canvas]")?.getBoundingClientRect()
      if (!canvasRect) return
      setDraggingNodeId(nodeId)
      setDragOffset({
        x: (e.clientX - canvasRect.left) / zoom - node.x,
        y: (e.clientY - canvasRect.top) / zoom - node.y,
      })
      handleNodeClick(nodeId)
    },
    [nodes, zoom, handleNodeClick]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNodeId) return
      const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const newX = (e.clientX - canvasRect.left) / zoom - dragOffset.x
      const newY = (e.clientY - canvasRect.top) / zoom - dragOffset.y
      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) } : n))
      )
    },
    [draggingNodeId, dragOffset, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null)
  }, [])

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 z-20 flex h-12 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="h-7 w-56 border-transparent bg-transparent px-2 text-sm font-semibold hover:border-border focus:border-border"
          />
          <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wider">
            Draft
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => toast("Undo/Redo coming soon")}>
                  <Undo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => toast("Undo/Redo coming soon")}>
                  <Redo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <div className="flex items-center gap-0.5 rounded-md border px-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={handleZoomOut}>
              <Minus className="size-3" />
            </Button>
            <span className="w-10 text-center text-[11px] tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" className="size-7" onClick={handleZoomIn}>
              <Plus className="size-3" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7" onClick={handleZoomFit}>
              <Maximize className="size-3" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => { navigator.clipboard.writeText("https://scraper.bot/workflow-builder"); toast.success("Link copied") }}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast.success("Workflow saved")}>
            <Save className="size-3.5" />
            Save
          </Button>
          <Button size="sm" className="h-8 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-700" onClick={() => toast.success("Workflow run triggered")}>
            <Play className="size-3.5" />
            Run
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Node Palette (hidden on mobile) */}
        {!isMobile && (
          <div
            className={cn(
              "bg-background shrink-0 border-r transition-all duration-200 overflow-hidden",
              panelOpen ? "w-[250px]" : "w-0"
            )}
          >
            <div className="flex h-full w-[250px] flex-col">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => setPanelOpen(false)}
                >
                  <PanelLeftClose className="size-3.5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {categoryLabels.map(({ key, label }) => (
                  <div key={key} className="mb-3">
                    <span className="mb-1.5 block px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <div className="space-y-1">
                      {nodeTypes
                        .filter((nt) => nt.category === key)
                        .map((nt) => {
                          const colors = categoryColors[nt.category]
                          return (
                            <div
                              key={nt.id}
                              className={cn(
                                "group flex cursor-grab items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-all hover:shadow-sm active:cursor-grabbing",
                                colors.border,
                                "hover:bg-accent/50"
                              )}
                              draggable
                            >
                              <GripVertical className="size-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                              <div className={cn("flex size-6 shrink-0 items-center justify-center rounded", colors.bg)}>
                                <nt.icon className={cn("size-3.5", colors.text)} />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-xs font-medium">{nt.label}</div>
                                <div className="truncate text-[10px] text-muted-foreground">{nt.description}</div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toggle button when panel closed (desktop only) */}
        {!isMobile && !panelOpen && (
          <div className="absolute left-0 top-1/2 z-30 -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-l-none border-l-0"
              onClick={() => setPanelOpen(true)}
            >
              <PanelLeftOpen className="size-3.5" />
            </Button>
          </div>
        )}

        {/* Mobile floating Add Node button */}
        {isMobile && (
          <Button
            size="icon"
            className="fixed bottom-20 right-4 z-40 size-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
          >
            <Plus className={cn("size-5 transition-transform", mobilePaletteOpen && "rotate-45")} />
          </Button>
        )}

        {/* Mobile node palette overlay */}
        {isMobile && mobilePaletteOpen && (
          <div className="fixed inset-x-0 bottom-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-xl border-t bg-background p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Add Node</span>
              <Button variant="ghost" size="icon" className="size-7" onClick={() => setMobilePaletteOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            {categoryLabels.map(({ key, label }) => (
              <div key={key} className="mb-3">
                <span className="mb-1.5 block px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {nodeTypes
                    .filter((nt) => nt.category === key)
                    .map((nt) => {
                      const colors = categoryColors[nt.category]
                      return (
                        <div
                          key={nt.id}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2.5 py-2",
                            colors.border
                          )}
                        >
                          <div className={cn("flex size-6 shrink-0 items-center justify-center rounded", colors.bg)}>
                            <nt.icon className={cn("size-3.5", colors.text)} />
                          </div>
                          <span className="truncate text-xs font-medium">{nt.label}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Center Canvas */}
        <div
          className="relative flex-1 overflow-hidden bg-[radial-gradient(circle,_hsl(var(--muted-foreground)/0.15)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_hsl(var(--muted-foreground)/0.08)_1px,_transparent_1px)]"
          style={{ backgroundSize: `${24 * zoom}px ${24 * zoom}px` }}
          data-canvas
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* SVG Connections */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ width: "200%", height: "200%" }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground/40" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" className="fill-blue-500" />
                </marker>
              </defs>
              {connections.map((conn) => {
                const fromNode = nodeMap[conn.from]
                const toNode = nodeMap[conn.to]
                if (!fromNode || !toNode) return null
                const start = getOutputPort(fromNode)
                const end = getInputPort(toNode)
                const dx = Math.abs(end.x - start.x) * 0.5
                const isActive = conn.from === selectedNodeId || conn.to === selectedNodeId
                return (
                  <path
                    key={conn.id}
                    d={`M ${start.x},${start.y} C ${start.x + dx},${start.y} ${end.x - dx},${end.y} ${end.x},${end.y}`}
                    fill="none"
                    strokeWidth={2}
                    className={cn(
                      "transition-colors",
                      isActive ? "stroke-blue-500" : "stroke-muted-foreground/25"
                    )}
                    markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const nodeType = nodeTypeMap[node.typeId]
              if (!nodeType) return null
              const colors = categoryColors[nodeType.category]
              const headerColor = categoryHeaderColors[nodeType.category]
              const isSelected = node.id === selectedNodeId
              const summary = getNodeSummary(node, nodeType)

              return (
                <div
                  key={node.id}
                  className={cn(
                    "absolute w-48 cursor-pointer select-none rounded-xl border shadow-md transition-shadow hover:shadow-lg",
                    "bg-card",
                    isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-background shadow-lg shadow-blue-500/10"
                  )}
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNodeClick(node.id)
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  {/* Color header bar */}
                  <div className={cn("h-1.5 rounded-t-xl", headerColor)} />

                  <div className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", colors.bg)}>
                        <nodeType.icon className={cn("size-3.5", colors.text)} />
                      </div>
                      <span className="text-xs font-semibold leading-tight">{nodeType.label}</span>
                    </div>
                    <p className="mt-1.5 truncate text-[10px] leading-tight text-muted-foreground">
                      {summary}
                    </p>
                  </div>

                  {/* Input port */}
                  {nodeType.category !== "trigger" && (
                    <div
                      className={cn(
                        "absolute -left-[5px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-background",
                        isSelected ? "bg-blue-500" : "bg-muted-foreground/40"
                      )}
                    />
                  )}

                  {/* Output port */}
                  <div
                    className={cn(
                      "absolute -right-[5px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-background",
                      isSelected ? "bg-blue-500" : "bg-muted-foreground/40"
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel - Node Config (side panel on desktop, bottom sheet on mobile) */}
        {isMobile ? (
          selectedNode && selectedNodeType && (
            <div className="fixed inset-x-0 bottom-0 z-30 max-h-[70vh] overflow-y-auto rounded-t-xl border-t bg-background shadow-xl">
              <NodeConfigPanel
                node={selectedNode}
                nodeType={selectedNodeType}
                onClose={() => setSelectedNodeId(null)}
                onUpdate={handleUpdateConfig}
                onDelete={handleDeleteNode}
              />
            </div>
          )
        ) : (
          <div
            className={cn(
              "bg-background shrink-0 border-l transition-all duration-200 overflow-hidden",
              selectedNode && selectedNodeType ? "w-[300px]" : "w-0"
            )}
          >
            {selectedNode && selectedNodeType && (
              <div className="h-full w-[300px]">
                <NodeConfigPanel
                  node={selectedNode}
                  nodeType={selectedNodeType}
                  onClose={() => setSelectedNodeId(null)}
                  onUpdate={handleUpdateConfig}
                  onDelete={handleDeleteNode}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-muted/50 z-20 flex h-7 shrink-0 items-center justify-between border-t px-4">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{nodes.length} nodes</span>
          <span className="text-muted-foreground/30">|</span>
          <span>{connections.length} connections</span>
          <span className="text-muted-foreground/30">|</span>
          <span>Last saved: 2 minutes ago</span>
        </div>
        <Badge variant="outline" className="h-4 px-1.5 text-[10px]">Draft</Badge>
      </div>
    </div>
  )
}

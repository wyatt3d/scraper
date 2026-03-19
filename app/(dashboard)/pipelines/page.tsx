"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  Clock,
  Cloud,
  Database,
  FileDown,
  GitMerge,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Send,
  Trash2,
  Webhook,
  X,
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

type DestinationType = "sheets" | "slack" | "discord" | "email" | "webhook" | "s3" | "database" | "csv"

interface Destination {
  id: string
  type: DestinationType
  label: string
  detail: string
}

interface Pipeline {
  id: string
  name: string
  source: string
  destinations: Destination[]
  status: "active" | "paused"
  lastTriggered: string | null
  itemsRouted: number | null
}

const destinationTypeConfig: Record<DestinationType, { label: string; icon: typeof Mail }> = {
  sheets: { label: "Google Sheets", icon: FileDown },
  slack: { label: "Slack", icon: MessageSquare },
  discord: { label: "Discord", icon: MessageSquare },
  email: { label: "Email", icon: Mail },
  webhook: { label: "Webhook", icon: Webhook },
  s3: { label: "S3", icon: Cloud },
  database: { label: "Database", icon: Database },
  csv: { label: "CSV File", icon: FileDown },
}

const sourceFlows = [
  "Amazon Product Monitor",
  "Indeed Job Scraper",
  "Zillow Property Monitor",
  "Google News Aggregator",
  "eBay Price Tracker",
]

const initialPipelines: Pipeline[] = [
  {
    id: "pl-1",
    name: "Product Data to Sheets",
    source: "Amazon Product Monitor",
    destinations: [
      { id: "d1", type: "sheets", label: "Google Sheets", detail: "Primary output" },
      { id: "d2", type: "slack", label: "Slack", detail: "Notification on change" },
    ],
    status: "active",
    lastTriggered: "2 hours ago",
    itemsRouted: 147,
  },
  {
    id: "pl-2",
    name: "Job Alerts",
    source: "Indeed Job Scraper",
    destinations: [
      { id: "d3", type: "email", label: "Email", detail: "Daily digest" },
      { id: "d4", type: "discord", label: "Discord", detail: "Real-time channel" },
      { id: "d5", type: "csv", label: "CSV File", detail: "Weekly export" },
    ],
    status: "active",
    lastTriggered: "6 hours ago",
    itemsRouted: 89,
  },
  {
    id: "pl-3",
    name: "Property Data Warehouse",
    source: "Zillow Property Monitor",
    destinations: [
      { id: "d6", type: "webhook", label: "Webhook", detail: "POST to API" },
      { id: "d7", type: "s3", label: "S3", detail: "JSON backup" },
    ],
    status: "paused",
    lastTriggered: null,
    itemsRouted: null,
  },
]

function DestinationBadge({ dest }: { dest: Destination }) {
  const config = destinationTypeConfig[dest.type]
  const Icon = config.icon
  return (
    <Badge variant="outline" className="gap-1 font-normal">
      <Icon className="size-3" />
      {config.label}
    </Badge>
  )
}

function DestinationConfigFields({ type }: { type: DestinationType }) {
  switch (type) {
    case "sheets":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Spreadsheet ID</Label>
            <Input placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sheet Name</Label>
            <Input placeholder="Sheet1" className="text-sm" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Mode</Label>
            <Select defaultValue="append">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="append">Append rows</SelectItem>
                <SelectItem value="overwrite">Overwrite sheet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "slack":
    case "discord":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{type === "slack" ? "Channel / Webhook URL" : "Webhook URL"}</Label>
          <Input placeholder="https://hooks.slack.com/services/..." className="text-sm" />
        </div>
      )
    case "email":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Recipient</Label>
            <Input type="email" placeholder="team@company.com" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "webhook":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input placeholder="https://api.example.com/ingest" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Method</Label>
            <Select defaultValue="POST">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Headers (JSON)</Label>
            <Input placeholder='{"Authorization": "Bearer ..."}' className="text-sm font-mono" />
          </div>
        </div>
      )
    case "s3":
      return (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Bucket</Label>
            <Input placeholder="my-data-bucket" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Path Prefix</Label>
            <Input placeholder="scraper/output/" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Format</Label>
            <Select defaultValue="json">
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "database":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Connection String</Label>
            <Input placeholder="postgresql://user:pass@host:5432/db" className="text-sm font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Table Name</Label>
            <Input placeholder="scraped_data" className="text-sm" />
          </div>
        </div>
      )
    case "csv":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">File Name Pattern</Label>
          <Input placeholder="export-{date}.csv" className="text-sm font-mono" />
        </div>
      )
  }
}

function CreatePipelineDialog({ onCreated }: { onCreated: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [source, setSource] = useState("")
  const [trigger, setTrigger] = useState("every-run")
  const [destinations, setDestinations] = useState<{ id: number; type: DestinationType | "" }[]>([
    { id: 1, type: "" },
  ])

  let nextId = destinations.length + 1

  function addDestination() {
    setDestinations((prev) => [...prev, { id: nextId++, type: "" }])
  }

  function removeDestination(id: number) {
    setDestinations((prev) => prev.filter((d) => d.id !== id))
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error("Pipeline name is required")
      return
    }
    if (!source) {
      toast.error("Select a source flow")
      return
    }
    if (destinations.every((d) => !d.type)) {
      toast.error("Add at least one destination")
      return
    }
    onCreated(name)
    toast.success(`Pipeline "${name}" created`)
    setOpen(false)
    setName("")
    setSource("")
    setTrigger("every-run")
    setDestinations([{ id: 1, type: "" }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Create Pipeline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Pipeline</DialogTitle>
          <DialogDescription>
            Route extracted data to one or more destinations after each run.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-1.5">
            <Label>Pipeline Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product Data to Sheets"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Source Flow</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger><SelectValue placeholder="Select a flow" /></SelectTrigger>
              <SelectContent>
                {sourceFlows.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Destinations</Label>
              <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={addDestination}>
                <Plus className="size-3" />
                Add Destination
              </Button>
            </div>

            {destinations.map((dest, idx) => (
              <Card key={dest.id} className="relative">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Destination {idx + 1}
                    </span>
                    {destinations.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-red-500"
                        onClick={() => removeDestination(dest.id)}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                  <Select
                    value={dest.type}
                    onValueChange={(val) => {
                      setDestinations((prev) =>
                        prev.map((d) =>
                          d.id === dest.id ? { ...d, type: val as DestinationType } : d
                        )
                      )
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select destination type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(destinationTypeConfig) as [DestinationType, { label: string }][]).map(
                        ([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {dest.type && <DestinationConfigFields type={dest.type as DestinationType} />}
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Trigger</Label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="every-run">After every run</SelectItem>
                <SelectItem value="on-change">On data change</SelectItem>
                <SelectItem value="schedule">On schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Transform (optional)</Label>
            <Input placeholder="Field mapping or filter expression" className="text-sm font-mono" />
            <p className="text-xs text-muted-foreground">
              Map or filter fields before routing. Leave blank to pass all data through.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create Pipeline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState(initialPipelines)

  function toggleStatus(id: string) {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = p.status === "active" ? "paused" : "active"
        toast.success(`Pipeline "${p.name}" ${next === "active" ? "activated" : "paused"}`)
        return { ...p, status: next as Pipeline["status"] }
      })
    )
  }

  function deletePipeline(id: string) {
    const p = pipelines.find((pl) => pl.id === id)
    setPipelines((prev) => prev.filter((pl) => pl.id !== id))
    toast.success(`Pipeline "${p?.name}" deleted`)
  }

  function handleCreated(name: string) {
    const newPipeline: Pipeline = {
      id: `pl-${Date.now()}`,
      name,
      source: "Custom Flow",
      destinations: [{ id: `d-${Date.now()}`, type: "webhook", label: "Webhook", detail: "Custom" }],
      status: "active",
      lastTriggered: null,
      itemsRouted: null,
    }
    setPipelines((prev) => [...prev, newPipeline])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Data Pipelines
          </h1>
          <p className="text-muted-foreground mt-1">
            Route extracted data to multiple destinations automatically after each run.
          </p>
        </div>
        <CreatePipelineDialog onCreated={handleCreated} />
      </div>

      <div className="grid gap-4">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <GitMerge className="size-5 text-blue-600 shrink-0" />
                    <h3 className="font-semibold truncate">{pipeline.name}</h3>
                    {pipeline.status === "active" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400 shrink-0">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400 shrink-0">
                        Paused
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{pipeline.source}</span>
                    <ArrowRight className="size-3.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {pipeline.destinations.map((dest) => (
                        <DestinationBadge key={dest.id} dest={dest} />
                      ))}
                    </div>
                  </div>

                  {pipeline.lastTriggered && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        Last triggered {pipeline.lastTriggered}
                      </span>
                      {pipeline.itemsRouted !== null && (
                        <span className="flex items-center gap-1">
                          <Check className="size-3" />
                          {pipeline.itemsRouted} items routed
                        </span>
                      )}
                    </div>
                  )}

                  {pipeline.destinations.length > 0 && (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {pipeline.destinations.map((dest) => (
                        <div key={dest.id} className="flex items-center gap-1.5">
                          <span className="text-foreground/70">{destinationTypeConfig[dest.type].label}:</span>
                          <span>{dest.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => toggleStatus(pipeline.id)}
                  >
                    {pipeline.status === "active" ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-red-500 hover:text-red-600"
                    onClick={() => deletePipeline(pipeline.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pipelines.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <GitMerge className="size-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No pipelines yet. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

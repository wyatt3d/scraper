"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  Edit,
  Globe,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface Webhook {
  id: string
  url: string
  events: string[]
  status: "active" | "paused"
  secret: string
  lastTriggered: string | null
  createdAt: string
}

interface WebhookLog {
  id: string
  timestamp: string
  event: string
  url: string
  statusCode: number
  success: boolean
}

const ALL_EVENTS = [
  "run.started",
  "run.completed",
  "run.failed",
  "alert.triggered",
  "flow.updated",
  "flow.deleted",
]

const mockWebhooks: Webhook[] = [
  {
    id: "wh-1",
    url: "https://api.myapp.com/scraper-hook",
    events: ["run.completed", "run.failed"],
    status: "active",
    secret: "whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    lastTriggered: "2 hours ago",
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "wh-2",
    url: "https://hooks.slack.com/services/T01234567/B01234567/abcdefghijklmnop",
    events: ["alert.triggered"],
    status: "active",
    secret: "whsec_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    lastTriggered: "1 day ago",
    createdAt: "2026-03-01T14:30:00Z",
  },
  {
    id: "wh-3",
    url: "https://discord.com/api/webhooks/123456789/abcdefghijklmnop",
    events: ["run.completed"],
    status: "paused",
    secret: "whsec_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8",
    lastTriggered: "3 days ago",
    createdAt: "2026-03-10T09:15:00Z",
  },
]

const mockLogs: WebhookLog[] = [
  {
    id: "log-1",
    timestamp: "2 hours ago",
    event: "run.completed",
    url: "api.myapp.com/...",
    statusCode: 200,
    success: true,
  },
  {
    id: "log-2",
    timestamp: "2 hours ago",
    event: "run.completed",
    url: "hooks.slack.com/...",
    statusCode: 200,
    success: true,
  },
  {
    id: "log-3",
    timestamp: "1 day ago",
    event: "run.failed",
    url: "api.myapp.com/...",
    statusCode: 500,
    success: false,
  },
]

function generateSecret() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = "whsec_"
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function truncateUrl(url: string, max = 40) {
  if (url.length <= max) return url
  return url.slice(0, max) + "..."
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [url, setUrl] = useState("")
  const [events, setEvents] = useState<string[]>([])
  const [secret, setSecret] = useState(generateSecret())
  const [isActive, setIsActive] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function resetForm() {
    setUrl("")
    setEvents([])
    setSecret(generateSecret())
    setIsActive(true)
    setEditingWebhook(null)
  }

  function toggleEvent(event: string) {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  function copySecret(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Secret copied to clipboard")
  }

  function saveWebhook() {
    if (editingWebhook) {
      setWebhooks((prev) =>
        prev.map((wh) =>
          wh.id === editingWebhook.id
            ? { ...wh, url, events, secret, status: isActive ? "active" : "paused" }
            : wh
        )
      )
      toast.success("Webhook updated")
    } else {
      const newWebhook: Webhook = {
        id: `wh-${Date.now()}`,
        url,
        events,
        status: isActive ? "active" : "paused",
        secret,
        lastTriggered: null,
        createdAt: new Date().toISOString(),
      }
      setWebhooks((prev) => [...prev, newWebhook])
      toast.success("Webhook created")
    }
    setDialogOpen(false)
    resetForm()
  }

  function deleteWebhook(id: string) {
    setWebhooks((prev) => prev.filter((wh) => wh.id !== id))
    toast.success("Webhook deleted")
  }

  function testWebhook(wh: Webhook) {
    toast.success(`Test delivery sent to ${truncateUrl(wh.url, 30)}`)
  }

  function toggleStatus(id: string) {
    setWebhooks((prev) =>
      prev.map((wh) =>
        wh.id === id
          ? { ...wh, status: wh.status === "active" ? "paused" : "active" }
          : wh
      )
    )
  }

  function openEdit(wh: Webhook) {
    setEditingWebhook(wh)
    setUrl(wh.url)
    setEvents(wh.events)
    setSecret(wh.secret)
    setIsActive(wh.status === "active")
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Webhooks
          </h1>
          <p className="text-muted-foreground mt-1">
            Receive real-time notifications when events occur in your flows
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? "Edit Webhook" : "Add Webhook"}
              </DialogTitle>
              <DialogDescription>
                {editingWebhook
                  ? "Update webhook configuration."
                  : "Configure a new webhook endpoint to receive event notifications."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <Input
                  placeholder="https://example.com/webhook"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label>Events</Label>
                {ALL_EVENTS.map((event) => (
                  <div key={event} className="flex items-center gap-2">
                    <Checkbox
                      id={event}
                      checked={events.includes(event)}
                      onCheckedChange={() => toggleEvent(event)}
                    />
                    <label
                      htmlFor={event}
                      className="cursor-pointer font-mono text-sm"
                    >
                      {event}
                    </label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Signing Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => copySecret(secret, "dialog-secret")}
                  >
                    {copiedId === "dialog-secret" ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-muted-foreground text-xs">
                    Enable or disable this webhook
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success("Test webhook delivered successfully")
                }}
                disabled={!url}
              >
                <Send className="size-3.5 mr-1.5" />
                Test Webhook
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={saveWebhook}
                disabled={!url || events.length === 0}
              >
                {editingWebhook ? "Save Changes" : "Add Webhook"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Webhook Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="size-4 text-muted-foreground shrink-0" />
                          <code className="text-xs font-mono">
                            {truncateUrl(wh.url)}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {wh.events.map((event) => (
                            <Badge
                              key={event}
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            wh.status === "active"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          }
                        >
                          {wh.status === "active" ? "Active" : "Paused"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {wh.lastTriggered ?? "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => openEdit(wh)}
                            title="Edit"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => testWebhook(wh)}
                            title="Test"
                          >
                            <Send className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => toggleStatus(wh.id)}
                            title={wh.status === "active" ? "Pause" : "Resume"}
                          >
                            {wh.status === "active" ? (
                              <Pause className="size-3.5" />
                            ) : (
                              <Play className="size-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteWebhook(wh.id)}
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {webhooks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No webhooks configured. Add one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {log.event}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {log.url}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.success
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                          }
                        >
                          {log.statusCode} {log.success ? "OK" : "Error"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            View
                          </Button>
                          {!log.success && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() =>
                                toast.success("Retry delivery queued")
                              }
                            >
                              <RefreshCw className="size-3" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

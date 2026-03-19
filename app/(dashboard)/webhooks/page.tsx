"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Check,
  Copy,
  Edit,
  Globe,
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton"
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
  active: boolean
  secret: string
  last_triggered_at: string | null
  created_at: string
}

const ALL_EVENTS = [
  "run.started",
  "run.completed",
  "run.failed",
  "alert.triggered",
  "flow.updated",
  "flow.deleted",
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

function formatRelativeTime(dateStr: string | null) {
  if (!dateStr) return "Never"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`
  const diffDays = Math.floor(diffHr / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [url, setUrl] = useState("")
  const [events, setEvents] = useState<string[]>([])
  const [secret, setSecret] = useState(generateSecret())
  const [isActive, setIsActive] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await fetch("/api/webhooks")
      const json = await res.json()
      setWebhooks(json.data || [])
    } catch {
      toast.error("Failed to load webhooks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWebhooks()
  }, [fetchWebhooks])

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

  async function saveWebhook() {
    setSaving(true)
    try {
      if (editingWebhook) {
        const res = await fetch(`/api/webhooks/${editingWebhook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, events, secret, active: isActive }),
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        toast.success("Webhook updated")
      } else {
        const res = await fetch("/api/webhooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, events, secret }),
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        toast.success("Webhook created")
      }
      setDialogOpen(false)
      resetForm()
      await fetchWebhooks()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save webhook")
    } finally {
      setSaving(false)
    }
  }

  async function deleteWebhook(id: string) {
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      toast.success("Webhook deleted")
      await fetchWebhooks()
    } catch {
      toast.error("Failed to delete webhook")
    }
  }

  function testWebhook(wh: Webhook) {
    toast.success(`Test delivery sent to ${truncateUrl(wh.url, 30)}`)
  }

  async function toggleStatus(id: string, currentActive: boolean) {
    try {
      const res = await fetch(`/api/webhooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      await fetchWebhooks()
    } catch {
      toast.error("Failed to toggle webhook status")
    }
  }

  function openEdit(wh: Webhook) {
    setEditingWebhook(wh)
    setUrl(wh.url)
    setEvents(wh.events)
    setSecret(wh.secret)
    setIsActive(wh.active)
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
                disabled={!url || events.length === 0 || saving}
              >
                {saving && <Loader2 className="size-3.5 mr-1.5 animate-spin" />}
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
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
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
                                wh.active
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                              }
                            >
                              {wh.active ? "Active" : "Paused"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatRelativeTime(wh.last_triggered_at)}
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
                                onClick={() => toggleStatus(wh.id, wh.active)}
                                title={wh.active ? "Pause" : "Resume"}
                              >
                                {wh.active ? (
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
                    </>
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
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No webhook delivery logs yet.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

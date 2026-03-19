"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  Zap,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

function getDaysUntil(dateStr: string) {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function ApiVersionsPage() {
  const [pinnedVersion, setPinnedVersion] = useState("v1")
  const [defaultVersion, setDefaultVersion] = useState("v1")
  const [autoUpgrade, setAutoUpgrade] = useState(false)
  const [deprecationNotifications, setDeprecationNotifications] = useState(true)
  const [v2MigrationOpen, setV2MigrationOpen] = useState(false)

  const daysUntilV0EOL = getDaysUntil("2026-06-30")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              API Versions
            </h1>
            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
              v1 (stable)
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage API versions, view migration guides, and configure version pinning
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Version Timeline</CardTitle>
          <CardDescription>Release history and migration paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            <div className="absolute left-[15px] top-6 bottom-6 w-px bg-border" />

            <div className="relative flex gap-4 pb-8">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="size-4" />
              </div>
              <div className="flex-1 space-y-3 pt-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">v1</h3>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                    Current
                  </Badge>
                  <span className="text-sm text-muted-foreground">Released March 1, 2026</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>Flows CRUD</li>
                    <li>Runs management</li>
                    <li>One-shot extraction</li>
                    <li>API key auth</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">Breaking changes: None (initial release)</p>
                <Button
                  variant={pinnedVersion === "v1" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setPinnedVersion("v1")
                    toast.success("Pinned to v1")
                  }}
                >
                  {pinnedVersion === "v1" && <Check className="size-3.5 mr-1.5" />}
                  Pin to v1
                </Button>
              </div>
            </div>

            <div className="relative flex gap-4 pb-8">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <Zap className="size-4" />
              </div>
              <div className="flex-1 space-y-3 pt-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">v2</h3>
                  <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
                    Preview
                  </Badge>
                  <span className="text-sm text-muted-foreground">Expected April 2026</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">New features:</p>
                  <ul className="text-sm text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>WebSocket streaming</li>
                    <li>Batch operations</li>
                    <li>Enhanced filtering</li>
                    <li>Webhook subscriptions</li>
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Breaking changes:</p>
                  <ul className="text-sm text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>Response envelope format</li>
                    <li>Pagination cursor-based</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPinnedVersion("v2")
                      toast.info("Switched to v2 preview")
                    }}
                  >
                    Try v2 Preview
                  </Button>
                  <Collapsible open={v2MigrationOpen} onOpenChange={setV2MigrationOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {v2MigrationOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                        Migration Guide
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
                <Collapsible open={v2MigrationOpen} onOpenChange={setV2MigrationOpen}>
                  <CollapsibleContent>
                    <div className="rounded-md border bg-muted/50 p-4 space-y-3 mt-2">
                      <p className="text-sm font-medium">Response Format Changes</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">v1</p>
                          <pre className="text-xs font-mono bg-background rounded px-3 py-2 border overflow-x-auto">{`GET /api/v1/flows
{
  "flows": [...]
}`}</pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">v2</p>
                          <pre className="text-xs font-mono bg-background rounded px-3 py-2 border overflow-x-auto">{`GET /api/v2/flows
{
  "data": [...],
  "meta": {
    "total": 42,
    "cursor": "abc123"
  }
}`}</pre>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-blue-500/25 bg-blue-500/5 p-2.5 text-xs text-blue-600 dark:text-blue-400">
                        <ArrowRight className="size-3.5 shrink-0" />
                        Update your response parsing to use <code className="font-mono">data</code> instead of the resource name, and adopt cursor-based pagination.
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <div className="relative flex gap-4">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                <Clock className="size-4" />
              </div>
              <div className="flex-1 space-y-3 pt-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">v0</h3>
                  <Badge variant="destructive">Deprecated</Badge>
                  <span className="text-sm text-muted-foreground">Released January 2026, EOL June 2026</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-red-500/25 bg-red-500/5 p-2.5 text-sm text-red-600 dark:text-red-400">
                  <Clock className="size-4 shrink-0" />
                  Will be removed June 30, 2026 — {daysUntilV0EOL} days remaining
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-500/25 hover:bg-red-500/5"
                  onClick={() => toast.warning("v0 is deprecated. Migrate to v1 before June 30, 2026.")}
                >
                  View Migration Path
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Version Settings</CardTitle>
          <CardDescription>Configure how your API requests are versioned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Version</Label>
              <Select value={defaultVersion} onValueChange={(v) => { setDefaultVersion(v); toast.success(`Default version set to ${v}`) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">v1 (stable)</SelectItem>
                  <SelectItem value="v2">v2 (preview)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Version Header Override</Label>
              <div className="rounded-md border bg-muted/50 p-3">
                <code className="text-sm font-mono">X-API-Version: {pinnedVersion}</code>
                <p className="text-xs text-muted-foreground mt-1">Set this header to pin requests to a specific version</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Auto-upgrade</Label>
              <p className="text-muted-foreground text-xs mt-0.5">Automatically use latest stable version</p>
            </div>
            <Switch
              checked={autoUpgrade}
              onCheckedChange={(checked) => {
                setAutoUpgrade(checked)
                toast.success(checked ? "Auto-upgrade enabled" : "Auto-upgrade disabled")
              }}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Deprecation Notifications</Label>
              <p className="text-muted-foreground text-xs mt-0.5">Get notified when a pinned version is deprecated</p>
            </div>
            <Switch
              checked={deprecationNotifications}
              onCheckedChange={(checked) => {
                setDeprecationNotifications(checked)
                toast.success(checked ? "Notifications enabled" : "Notifications disabled")
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Health by Version</CardTitle>
          <CardDescription>Last 24 hours of API performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Requests (24h)</TableHead>
                <TableHead>Avg Latency</TableHead>
                <TableHead>Error Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono font-medium">v1</TableCell>
                <TableCell>12,450</TableCell>
                <TableCell>145ms</TableCell>
                <TableCell>0.3%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                    Healthy
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-medium">v2</TableCell>
                <TableCell>340</TableCell>
                <TableCell>98ms</TableCell>
                <TableCell>1.2%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
                    Preview
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-medium">v0</TableCell>
                <TableCell>89</TableCell>
                <TableCell>210ms</TableCell>
                <TableCell>0.1%</TableCell>
                <TableCell>
                  <Badge variant="destructive">Deprecated</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

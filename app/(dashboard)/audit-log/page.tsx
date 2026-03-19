"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  ScrollText,
  User,
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
import { toast } from "sonner"

type AuditEntry = {
  id: string
  timestamp: string
  relativeTime: string
  actor: string
  actorType: "user" | "system"
  action: "Created" | "Updated" | "Deleted" | "Executed" | "Viewed"
  resourceType: string
  resource: string
  details: string
  ip: string
  payload: Record<string, unknown>
}

const auditEntries: AuditEntry[] = [
  {
    id: "aud_001",
    timestamp: "2026-03-19T14:58:00Z",
    relativeTime: "2 min ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Executed",
    resourceType: "Run",
    resource: "run_8a3f2c",
    details: 'Triggered "Amazon Monitor" flow',
    ip: "192.168.1.100",
    payload: { flow_id: "flow_amazon_01", trigger: "manual", environment: "production", timeout: 30000 },
  },
  {
    id: "aud_002",
    timestamp: "2026-03-19T14:45:00Z",
    relativeTime: "15 min ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Created",
    resourceType: "API Key",
    resource: "key_prod_01",
    details: 'Created key "Production API"',
    ip: "192.168.1.100",
    payload: { key_name: "Production API", permissions: ["read", "write", "execute"], expires_at: "2027-03-19T00:00:00Z" },
  },
  {
    id: "aud_003",
    timestamp: "2026-03-19T13:58:00Z",
    relativeTime: "1 hour ago",
    actor: "Sarah Chen",
    actorType: "user",
    action: "Updated",
    resourceType: "Flow",
    resource: "flow_indeed_01",
    details: 'Modified "Indeed Scraper" steps',
    ip: "10.0.0.45",
    payload: { flow_id: "flow_indeed_01", changes: { steps_added: 2, steps_removed: 1 }, version: 14 },
  },
  {
    id: "aud_004",
    timestamp: "2026-03-19T12:58:00Z",
    relativeTime: "2 hours ago",
    actor: "System",
    actorType: "system",
    action: "Executed",
    resourceType: "Run",
    resource: "run_7b2e1d",
    details: 'Scheduled run for "Zillow Monitor"',
    ip: "system",
    payload: { flow_id: "flow_zillow_01", trigger: "schedule", cron: "0 */2 * * *", next_run: "2026-03-19T14:00:00Z" },
  },
  {
    id: "aud_005",
    timestamp: "2026-03-19T11:58:00Z",
    relativeTime: "3 hours ago",
    actor: "Mike Johnson",
    actorType: "user",
    action: "Viewed",
    resourceType: "Analytics",
    resource: "analytics_dashboard",
    details: "Viewed analytics dashboard",
    ip: "172.16.0.12",
    payload: { page: "/analytics", session_duration: "4m 32s", filters_applied: { date_range: "30d" } },
  },
  {
    id: "aud_006",
    timestamp: "2026-03-19T10:58:00Z",
    relativeTime: "4 hours ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Updated",
    resourceType: "Settings",
    resource: "settings_notifications",
    details: "Changed notification preferences",
    ip: "192.168.1.100",
    payload: { setting: "notifications", changes: { email_on_failure: true, slack_webhook: "enabled", digest_frequency: "daily" } },
  },
  {
    id: "aud_007",
    timestamp: "2026-03-19T09:58:00Z",
    relativeTime: "5 hours ago",
    actor: "System",
    actorType: "system",
    action: "Created",
    resourceType: "Alert",
    resource: "alert_prod_01",
    details: 'New alert for "Product Monitor"',
    ip: "system",
    payload: { alert_type: "threshold", condition: "error_rate > 5%", flow_id: "flow_product_01", severity: "warning" },
  },
  {
    id: "aud_008",
    timestamp: "2026-03-19T08:58:00Z",
    relativeTime: "6 hours ago",
    actor: "Sarah Chen",
    actorType: "user",
    action: "Deleted",
    resourceType: "Webhook",
    resource: "wh_old_slack",
    details: 'Removed "Old Slack Hook"',
    ip: "10.0.0.45",
    payload: { webhook_id: "wh_old_slack", url: "https://hooks.slack.com/services/T00/B00/xxx", created_at: "2025-08-14T10:00:00Z" },
  },
  {
    id: "aud_009",
    timestamp: "2026-03-19T07:30:00Z",
    relativeTime: "7 hours ago",
    actor: "System",
    actorType: "system",
    action: "Executed",
    resourceType: "Run",
    resource: "run_6c1d0e",
    details: 'Scheduled run for "HN Scraper"',
    ip: "system",
    payload: { flow_id: "flow_hn_01", trigger: "schedule", cron: "*/15 * * * *", items_scraped: 124 },
  },
  {
    id: "aud_010",
    timestamp: "2026-03-19T06:15:00Z",
    relativeTime: "9 hours ago",
    actor: "Mike Johnson",
    actorType: "user",
    action: "Created",
    resourceType: "Flow",
    resource: "flow_github_01",
    details: 'Created "GitHub Trending" flow',
    ip: "172.16.0.12",
    payload: { flow_name: "GitHub Trending", steps: 4, target_url: "https://github.com/trending", schedule: "daily" },
  },
  {
    id: "aud_011",
    timestamp: "2026-03-19T04:00:00Z",
    relativeTime: "11 hours ago",
    actor: "System",
    actorType: "system",
    action: "Executed",
    resourceType: "Run",
    resource: "run_5a9b3f",
    details: 'Batch run completed for "Amazon Monitor"',
    ip: "system",
    payload: { flow_id: "flow_amazon_01", trigger: "schedule", items_scraped: 2847, duration: "45.2s", status: "success" },
  },
  {
    id: "aud_012",
    timestamp: "2026-03-19T02:30:00Z",
    relativeTime: "12 hours ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Updated",
    resourceType: "API Key",
    resource: "key_staging_01",
    details: 'Rotated key "Staging API"',
    ip: "192.168.1.100",
    payload: { key_name: "Staging API", action: "rotate", previous_last_used: "2026-03-18T22:00:00Z" },
  },
  {
    id: "aud_013",
    timestamp: "2026-03-18T22:00:00Z",
    relativeTime: "17 hours ago",
    actor: "Sarah Chen",
    actorType: "user",
    action: "Viewed",
    resourceType: "Run",
    resource: "run_4d8c2a",
    details: 'Viewed run logs for "Indeed Scraper"',
    ip: "10.0.0.45",
    payload: { run_id: "run_4d8c2a", flow_id: "flow_indeed_01", status: "failed", error: "Timeout after 60s" },
  },
  {
    id: "aud_014",
    timestamp: "2026-03-18T20:45:00Z",
    relativeTime: "18 hours ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Updated",
    resourceType: "Team",
    resource: "team_default",
    details: 'Updated team member role for "Mike Johnson"',
    ip: "192.168.1.100",
    payload: { member: "Mike Johnson", previous_role: "viewer", new_role: "editor", team_id: "team_default" },
  },
  {
    id: "aud_015",
    timestamp: "2026-03-18T18:30:00Z",
    relativeTime: "20 hours ago",
    actor: "System",
    actorType: "system",
    action: "Created",
    resourceType: "Alert",
    resource: "alert_zillow_01",
    details: 'Rate limit warning for "Zillow Monitor"',
    ip: "system",
    payload: { alert_type: "rate_limit", flow_id: "flow_zillow_01", requests_per_minute: 58, limit: 60, severity: "warning" },
  },
  {
    id: "aud_016",
    timestamp: "2026-03-18T16:00:00Z",
    relativeTime: "23 hours ago",
    actor: "Mike Johnson",
    actorType: "user",
    action: "Deleted",
    resourceType: "Flow",
    resource: "flow_test_01",
    details: 'Deleted "Test Scraper (Draft)"',
    ip: "172.16.0.12",
    payload: { flow_name: "Test Scraper (Draft)", steps: 2, created_at: "2026-03-17T10:00:00Z", runs_total: 3 },
  },
  {
    id: "aud_017",
    timestamp: "2026-03-18T14:15:00Z",
    relativeTime: "25 hours ago",
    actor: "Sarah Chen",
    actorType: "user",
    action: "Executed",
    resourceType: "Run",
    resource: "run_3e7b1c",
    details: 'Manual run for "Indeed Scraper"',
    ip: "10.0.0.45",
    payload: { flow_id: "flow_indeed_01", trigger: "manual", params: { location: "San Francisco", keywords: "software engineer" } },
  },
  {
    id: "aud_018",
    timestamp: "2026-03-18T12:00:00Z",
    relativeTime: "27 hours ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Created",
    resourceType: "Webhook",
    resource: "wh_discord_01",
    details: 'Created "Discord Alerts" webhook',
    ip: "192.168.1.100",
    payload: { webhook_name: "Discord Alerts", url: "https://discord.com/api/webhooks/xxx", events: ["run.failed", "alert.triggered"] },
  },
  {
    id: "aud_019",
    timestamp: "2026-03-18T09:30:00Z",
    relativeTime: "29 hours ago",
    actor: "System",
    actorType: "system",
    action: "Updated",
    resourceType: "Settings",
    resource: "settings_billing",
    details: "Monthly usage reset completed",
    ip: "system",
    payload: { billing_period: "2026-03", runs_reset: true, api_calls_reset: true, bandwidth_reset: true },
  },
  {
    id: "aud_020",
    timestamp: "2026-03-17T22:45:00Z",
    relativeTime: "40 hours ago",
    actor: "Wyatt",
    actorType: "user",
    action: "Viewed",
    resourceType: "Settings",
    resource: "settings_billing",
    details: "Viewed billing and plan details",
    ip: "192.168.1.100",
    payload: { page: "/settings", tab: "billing", plan: "Pro", next_invoice: "2026-04-01" },
  },
]

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Created: "default",
  Updated: "secondary",
  Deleted: "destructive",
  Executed: "outline",
  Viewed: "secondary",
}

const ITEMS_PER_PAGE = 10

export default function AuditLogPage() {
  const [actorFilter, setActorFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("30d")
  const [page, setPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filtered = auditEntries.filter((entry) => {
    if (actorFilter !== "all" && entry.actor !== actorFilter) return false
    if (actionFilter !== "all" && entry.action !== actionFilter) return false
    if (resourceFilter !== "all" && entry.resourceType !== resourceFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Audit Log
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete record of all actions taken in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => toast.success("Audit log exported", { description: "CSV file downloaded successfully." })}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={actorFilter} onValueChange={(v) => { setActorFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="Wyatt">Wyatt</SelectItem>
                <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
                <SelectItem value="Executed">Executed</SelectItem>
                <SelectItem value="Viewed">Viewed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={(v) => { setResourceFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="Flow">Flow</SelectItem>
                <SelectItem value="Run">Run</SelectItem>
                <SelectItem value="API Key">API Key</SelectItem>
                <SelectItem value="Webhook">Webhook</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
                <SelectItem value="Alert">Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]" />
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((entry) => {
                const isExpanded = expandedRow === entry.id
                return (
                  <Collapsible key={entry.id} asChild open={isExpanded} onOpenChange={() => setExpandedRow(isExpanded ? null : entry.id)}>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="w-[30px] pr-0">
                            {isExpanded ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{entry.relativeTime}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {entry.actorType === "user" ? (
                                <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                  <User className="size-3 text-blue-600" />
                                </div>
                              ) : (
                                <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                  <ScrollText className="size-3 text-gray-500" />
                                </div>
                              )}
                              <span className="text-sm">{entry.actor}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={actionColors[entry.action]}>{entry.action}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.resourceType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate text-sm">
                            {entry.details}
                          </TableCell>
                          <TableCell>
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                              {entry.ip}
                            </code>
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={7} className="p-4">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Request Payload
                              </p>
                              <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto">
                                {JSON.stringify(entry.payload, null, 2)}
                              </pre>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>Event ID: {entry.id}</span>
                                <span>Resource: {entry.resource}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                )
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No audit entries match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

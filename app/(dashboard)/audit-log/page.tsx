"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Loader2,
  ScrollText,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { Skeleton } from "@/components/ui/skeleton"
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
  actor: string
  action: string
  resource_type: string
  resource_name: string | null
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  created: "default",
  updated: "secondary",
  deleted: "destructive",
  executed: "outline",
  viewed: "secondary",
}

function formatRelativeTime(dateStr: string) {
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

const ITEMS_PER_PAGE = 10

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actorFilter, setActorFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("30d")
  const [page, setPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", "200")
      if (actorFilter !== "all") params.set("actor", actorFilter)
      if (actionFilter !== "all") params.set("action", actionFilter)
      if (resourceFilter !== "all") params.set("resource", resourceFilter)

      const res = await fetch(`/api/audit?${params.toString()}`)
      const json = await res.json()
      setEntries(json.data || [])
    } catch {
      toast.error("Failed to load audit log")
    } finally {
      setLoading(false)
    }
  }, [actorFilter, actionFilter, resourceFilter])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  useEffect(() => {
    setPage(1)
  }, [actorFilter, actionFilter, resourceFilter])

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE)
  const paginated = entries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

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
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="size-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                <>
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
                                  <span className="text-sm font-medium">{formatRelativeTime(entry.created_at)}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(entry.created_at).toLocaleString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {entry.actor !== "system" ? (
                                    <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                                      <User className="size-3 text-foreground" />
                                    </div>
                                  ) : (
                                    <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                                      <ScrollText className="size-3 text-muted-foreground" />
                                    </div>
                                  )}
                                  <span className="text-sm">{entry.actor}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={actionColors[entry.action] || "secondary"}>
                                  {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{entry.resource_type}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[300px] truncate text-sm">
                                {entry.resource_name || "-"}
                              </TableCell>
                              <TableCell>
                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                                  {entry.ip_address || "unknown"}
                                </code>
                              </TableCell>
                            </TableRow>
                          </CollapsibleTrigger>
                          <CollapsibleContent asChild>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                              <TableCell colSpan={7} className="p-4">
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Details
                                  </p>
                                  <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto">
                                    {JSON.stringify(entry.details, null, 2)}
                                  </pre>
                                  <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span>Event ID: {entry.id}</span>
                                    {entry.resource_name && <span>Resource: {entry.resource_name}</span>}
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
                        No audit events yet. Actions you take will appear here.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, entries.length)} of {entries.length} entries
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

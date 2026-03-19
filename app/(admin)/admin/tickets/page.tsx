"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Ticket {
  id: string
  type: string
  severity: string
  title: string
  description: string
  steps_to_reproduce: string
  page_url: string
  email: string
  status: string
  created_at: string
  updated_at: string
}

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
}

const severityColors: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const typeLabels: Record<string, string> = {
  bug: "Bug",
  feature: "Feature",
  question: "Question",
  performance: "Performance",
  security: "Security",
}

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((r) => setTickets(r.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, newStatus: string) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
    try {
      await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
    } catch {
      // silent fail
    }
  }

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (typeFilter !== "all" && t.type !== typeFilter) return false
    if (severityFilter !== "all" && t.severity !== severityFilter) return false
    return true
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Support Tickets</h1>
          <Badge variant="secondary" className="text-xs">
            {filtered.length}
          </Badge>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">Loading tickets...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          {tickets.length === 0 ? "No tickets submitted yet." : "No tickets match the current filters."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-8 px-3 py-2.5" />
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Severity</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Created</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => {
                const isExpanded = expandedId === ticket.id
                return (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedId(isExpanded ? null : ticket.id)}
                    onStatusChange={(s) => updateStatus(ticket.id, s)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TicketRow({
  ticket,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  ticket: Ticket
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (status: string) => void
}) {
  return (
    <>
      <tr
        className={cn(
          "border-b border-border transition-colors hover:bg-muted/30 cursor-pointer",
          isExpanded && "bg-muted/20"
        )}
        onClick={onToggle}
      >
        <td className="px-3 py-2.5">
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </td>
        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
          {ticket.id.slice(0, 8)}
        </td>
        <td className="px-3 py-2.5">
          <span className="text-xs">{typeLabels[ticket.type] || ticket.type}</span>
        </td>
        <td className="px-3 py-2.5">
          <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", severityColors[ticket.severity])}>
            {ticket.severity}
          </span>
        </td>
        <td className="px-3 py-2.5 max-w-[250px] truncate font-medium">{ticket.title}</td>
        <td className="px-3 py-2.5">
          <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", statusColors[ticket.status])}>
            {statusLabels[ticket.status] || ticket.status}
          </span>
        </td>
        <td className="px-3 py-2.5 text-xs text-muted-foreground">{ticket.email || "-"}</td>
        <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(ticket.created_at)}
        </td>
        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
          <Select value={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-7 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-border bg-muted/10">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid gap-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Description:</span>
                <p className="mt-1 whitespace-pre-wrap text-foreground">{ticket.description}</p>
              </div>
              {ticket.steps_to_reproduce && (
                <div>
                  <span className="font-medium text-muted-foreground">Steps to Reproduce:</span>
                  <p className="mt-1 whitespace-pre-wrap text-foreground">{ticket.steps_to_reproduce}</p>
                </div>
              )}
              {ticket.page_url && (
                <div>
                  <span className="font-medium text-muted-foreground">Page URL: </span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{ticket.page_url}</code>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

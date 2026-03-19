"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Search,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastSignIn: string | null
  emailConfirmed: boolean
  provider: string
  role: string
}

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

function absoluteDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  return new Date(dateStr).toLocaleString()
}

function isWithinDays(dateStr: string | null, days: number): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  return now.getTime() - date.getTime() < days * 86400000
}

function getInitials(name: string): string {
  return name
    .split(/[\s@.]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "")
    .join("")
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setError(json.error)
        } else {
          setUsers(json.data)
        }
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false))
  }, [])

  const confirmed = users.filter(u => u.emailConfirmed).length
  const activeLast7d = users.filter(u => isWithinDays(u.lastSignIn, 7)).length
  const newLast30d = users.filter(u => isWithinDays(u.createdAt, 30)).length

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase()
      if (q && !u.email.toLowerCase().includes(q) && !u.name.toLowerCase().includes(q)) return false
      if (statusFilter === "confirmed" && !u.emailConfirmed) return false
      if (statusFilter === "unconfirmed" && u.emailConfirmed) return false
      if (providerFilter !== "all" && u.provider !== providerFilter) return false
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "active":
          return (
            new Date(b.lastSignIn || 0).getTime() - new Date(a.lastSignIn || 0).getTime()
          )
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  function exportCsv() {
    const header = "Email,Name,Created,Last Sign In,Status"
    const rows = filtered.map(u =>
      [
        u.email,
        u.name,
        absoluteDate(u.createdAt),
        absoluteDate(u.lastSignIn),
        u.emailConfirmed ? "Confirmed" : "Unconfirmed",
      ]
        .map(v => `"${v}"`)
        .join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Users exported as CSV")
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Confirmed", value: confirmed, icon: UserCheck },
    { label: "Active (7d)", value: activeLast7d, icon: Zap },
    { label: "New (30d)", value: newLast30d, icon: UserPlus },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold">Users</h1>
          {!loading && (
            <Badge variant="secondary">{users.length}</Badge>
          )}
        </div>
        <button
          onClick={exportCsv}
          disabled={loading || users.length === 0}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Download className="size-4" />
          Export Users
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="active">Last Active</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Sign In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell />
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  {users.length === 0 ? "No users yet" : "No users match your filters"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(user => (
                <>
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                  >
                    <TableCell>
                      {expandedId === user.id ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                          {getInitials(user.name)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      {user.emailConfirmed ? (
                        <Badge className="bg-emerald-600/20 text-emerald-500 border-emerald-600/30">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-600/20 text-amber-500 border-amber-600/30">
                          Unconfirmed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {relativeDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {relativeDate(user.lastSignIn)}
                    </TableCell>
                  </TableRow>
                  {expandedId === user.id && (
                    <TableRow key={`${user.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/30 px-6 py-4">
                        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <div className="text-muted-foreground">User ID</div>
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="truncate">{user.id}</span>
                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  copyToClipboard(user.id)
                                }}
                                className="shrink-0 text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="size-3.5" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Role</div>
                            <div>{user.role}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Provider</div>
                            <div className="capitalize">{user.provider}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div>{absoluteDate(user.createdAt)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Last Sign In</div>
                            <div>{absoluteDate(user.lastSignIn)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Email Confirmed</div>
                            <div>{user.emailConfirmed ? "Yes" : "No"}</div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Chrome,
  Copy,
  Download,
  Globe,
  Monitor,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Trash2,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface SessionCookie {
  name: string
  domain: string
  value: string
  expires: string
}

interface SessionMetrics {
  pagesVisited: number
  requestsMade: number
  dataTransferred: string
}

interface Session {
  id: string
  name: string
  status: "active" | "paused" | "idle"
  browser: string
  location: string
  lastActive: string
  persona: {
    enabled: boolean
    displayName?: string
    email?: string
    userAgent?: string
    resolution?: string
    language?: string
  }
  cookies: SessionCookie[]
  localStorage: { key: string; value: string }[]
  metrics: SessionMetrics
}

const initialSessions: Session[] = [
  {
    id: "session-prod-01",
    name: "session-prod-01",
    status: "active",
    browser: "Chrome 122",
    location: "US - New York",
    lastActive: "2 min ago",
    persona: {
      enabled: true,
      displayName: "John Smith",
      email: "j.smith@webmail.com",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0",
      resolution: "1920x1080",
      language: "en-US",
    },
    cookies: [
      { name: "session_id", domain: ".example.com", value: "abc123def456", expires: "Mar 25, 2026" },
      { name: "_ga", domain: ".example.com", value: "GA1.2.12345", expires: "Mar 19, 2028" },
    ],
    localStorage: [
      { key: "theme", value: "dark" },
      { key: "locale", value: "en-US" },
    ],
    metrics: { pagesVisited: 342, requestsMade: 1205, dataTransferred: "45.2 MB" },
  },
  {
    id: "session-prod-02",
    name: "session-prod-02",
    status: "active",
    browser: "Firefox 123",
    location: "UK - London",
    lastActive: "15 min ago",
    persona: {
      enabled: true,
      displayName: "Emma Wilson",
      email: "emma.w@protonmail.com",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0",
      resolution: "1440x900",
      language: "en-GB",
    },
    cookies: [
      { name: "auth_token", domain: ".shop.co.uk", value: "tk_9f8e7d6c5b", expires: "Apr 1, 2026" },
    ],
    localStorage: [
      { key: "cart_count", value: "3" },
    ],
    metrics: { pagesVisited: 128, requestsMade: 467, dataTransferred: "12.8 MB" },
  },
  {
    id: "session-dev-01",
    name: "session-dev-01",
    status: "paused",
    browser: "Chrome 122",
    location: "DE - Berlin",
    lastActive: "2 hours ago",
    persona: {
      enabled: false,
    },
    cookies: [
      { name: "csrftoken", domain: ".dev.example.de", value: "x7y8z9w0", expires: "Jun 1, 2026" },
    ],
    localStorage: [],
    metrics: { pagesVisited: 56, requestsMade: 198, dataTransferred: "3.1 MB" },
  },
  {
    id: "session-test-01",
    name: "session-test-01",
    status: "idle",
    browser: "Chrome 122",
    location: "US - San Francisco",
    lastActive: "1 day ago",
    persona: {
      enabled: false,
    },
    cookies: [],
    localStorage: [],
    metrics: { pagesVisited: 12, requestsMade: 45, dataTransferred: "0.8 MB" },
  },
]

const statusConfig = {
  active: { label: "Active", variant: "default" as const, className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400" },
  paused: { label: "Paused", variant: "default" as const, className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/25 dark:text-yellow-400" },
  idle: { label: "Idle", variant: "default" as const, className: "bg-gray-500/15 text-gray-500 border-gray-500/25" },
}

function maskValue(value: string) {
  if (value.length <= 6) return "*".repeat(value.length)
  return value.slice(0, 3) + "*".repeat(Math.min(value.length - 6, 16)) + value.slice(-3)
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [createOpen, setCreateOpen] = useState(false)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newBrowser, setNewBrowser] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [personaEnabled, setPersonaEnabled] = useState(false)
  const [personaName, setPersonaName] = useState("")
  const [personaEmail, setPersonaEmail] = useState("")
  const [personaUA, setPersonaUA] = useState("")
  const [personaResolution, setPersonaResolution] = useState("")
  const [personaLanguage, setPersonaLanguage] = useState("")
  const [cookieImport, setCookieImport] = useState("")

  function resetForm() {
    setNewName("")
    setNewBrowser("")
    setNewLocation("")
    setPersonaEnabled(false)
    setPersonaName("")
    setPersonaEmail("")
    setPersonaUA("")
    setPersonaResolution("")
    setPersonaLanguage("")
    setCookieImport("")
  }

  function createSession() {
    let importedCookies: SessionCookie[] = []
    if (cookieImport.trim()) {
      try {
        importedCookies = JSON.parse(cookieImport)
      } catch {
        toast.error("Invalid cookie JSON format")
        return
      }
    }

    const session: Session = {
      id: `session-${Date.now()}`,
      name: newName,
      status: "active",
      browser: newBrowser || "Chrome 122",
      location: newLocation || "Auto",
      lastActive: "Just now",
      persona: {
        enabled: personaEnabled,
        ...(personaEnabled && {
          displayName: personaName,
          email: personaEmail,
          userAgent: personaUA,
          resolution: personaResolution,
          language: personaLanguage,
        }),
      },
      cookies: importedCookies,
      localStorage: [],
      metrics: { pagesVisited: 0, requestsMade: 0, dataTransferred: "0 B" },
    }
    setSessions((prev) => [...prev, session])
    setCreateOpen(false)
    resetForm()
    toast.success(`Session "${newName}" created`)
  }

  function deleteSession(id: string, name: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast.success(`Session "${name}" deleted`)
  }

  function pauseSession(id: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "paused" as const, lastActive: "Just now" } : s))
    )
    toast.success("Session paused")
  }

  function resumeSession(id: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "active" as const, lastActive: "Just now" } : s))
    )
    toast.success("Session resumed")
  }

  function openSession(id: string) {
    toast.info(`Opening session ${id}...`)
  }

  function exportSession(session: Session) {
    toast.success(`Session "${session.name}" exported to clipboard`)
  }

  function cloneSession(session: Session) {
    const cloned: Session = {
      ...session,
      id: `session-${Date.now()}`,
      name: `${session.name}-copy`,
      lastActive: "Just now",
      metrics: { pagesVisited: 0, requestsMade: 0, dataTransferred: "0 B" },
    }
    setSessions((prev) => [...prev, cloned])
    toast.success(`Session cloned as "${cloned.name}"`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Browser Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage persistent browser sessions with cookies, fingerprints, and identity profiles
          </p>
        </div>
        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
              <DialogDescription>
                Set up a new persistent browser session with optional digital persona.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Session Name</Label>
                <Input
                  placeholder="e.g., session-prod-03"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Browser</Label>
                <Select value={newBrowser} onValueChange={setNewBrowser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select browser" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chrome 122">Chrome 122</SelectItem>
                    <SelectItem value="Firefox 123">Firefox 123</SelectItem>
                    <SelectItem value="Safari (WebKit)">Safari (WebKit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location / Proxy</Label>
                <Select value={newLocation} onValueChange={setNewLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="DE">DE</SelectItem>
                    <SelectItem value="JP">JP</SelectItem>
                    <SelectItem value="AU">AU</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label>Digital Persona</Label>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Enable a persistent identity profile
                  </p>
                </div>
                <Switch checked={personaEnabled} onCheckedChange={setPersonaEnabled} />
              </div>
              {personaEnabled && (
                <div className="space-y-3 rounded-md border p-3">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      placeholder="e.g., John Smith"
                      value={personaName}
                      onChange={(e) => setPersonaName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., john@example.com"
                        value={personaEmail}
                        onChange={(e) => setPersonaEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setPersonaEmail(`user${Math.floor(Math.random() * 9999)}@webmail.com`)
                          toast.info("Email auto-generated")
                        }}
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User Agent Override</Label>
                    <Input
                      placeholder="Custom user agent string"
                      value={personaUA}
                      onChange={(e) => setPersonaUA(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Screen Resolution</Label>
                    <Select value={personaResolution} onValueChange={setPersonaResolution}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1920x1080">1920x1080</SelectItem>
                        <SelectItem value="1366x768">1366x768</SelectItem>
                        <SelectItem value="1440x900">1440x900</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={personaLanguage} onValueChange={setPersonaLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="ja-JP">Japanese</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Cookie Import</Label>
                <Textarea
                  placeholder='Paste cookies as JSON array, e.g. [{"name":"sid","domain":".example.com","value":"abc","expires":"2026-12-31"}]'
                  value={cookieImport}
                  onChange={(e) => setCookieImport(e.target.value)}
                  className="font-mono text-xs"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={createSession} disabled={!newName}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>{sessions.length} session{sessions.length !== 1 ? "s" : ""} configured</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const sc = statusConfig[session.status]
                return (
                  <Collapsible key={session.id} asChild open={expandedSession === session.id} onOpenChange={(open) => setExpandedSession(open ? session.id : null)}>
                    <>
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <button className="flex items-center gap-2 text-left">
                              <Monitor className="size-4 text-muted-foreground" />
                              <code className="text-sm font-mono font-medium">{session.name}</code>
                            </button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sc.className}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{session.browser}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{session.location}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{session.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {session.status === "active" && (
                              <>
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openSession(session.id)}>
                                  Open
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs" aria-label="Pause session" onClick={() => pauseSession(session.id)}>
                                  <Pause className="size-3" />
                                </Button>
                              </>
                            )}
                            {session.status === "paused" && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => resumeSession(session.id)}>
                                <Play className="size-3 mr-1" />
                                Resume
                              </Button>
                            )}
                            {session.status === "idle" && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openSession(session.id)}>
                                Open
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 text-red-500 hover:text-red-600" aria-label={`Delete session ${session.name}`}>
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Session</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Delete &quot;{session.name}&quot;? All cookies, storage, and persona data will be lost.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteSession(session.id, session.name)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30 p-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Cookies ({session.cookies.length})</h4>
                                {session.cookies.length > 0 ? (
                                  <div className="rounded-md border text-xs">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs py-1.5">Name</TableHead>
                                          <TableHead className="text-xs py-1.5">Domain</TableHead>
                                          <TableHead className="text-xs py-1.5">Value</TableHead>
                                          <TableHead className="text-xs py-1.5">Expires</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {session.cookies.map((c) => (
                                          <TableRow key={c.name}>
                                            <TableCell className="py-1.5 font-mono">{c.name}</TableCell>
                                            <TableCell className="py-1.5">{c.domain}</TableCell>
                                            <TableCell className="py-1.5 font-mono">{maskValue(c.value)}</TableCell>
                                            <TableCell className="py-1.5">{c.expires}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">No cookies stored</p>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Local Storage ({session.localStorage.length})</h4>
                                {session.localStorage.length > 0 ? (
                                  <div className="rounded-md border text-xs">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs py-1.5">Key</TableHead>
                                          <TableHead className="text-xs py-1.5">Value</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {session.localStorage.map((entry) => (
                                          <TableRow key={entry.key}>
                                            <TableCell className="py-1.5 font-mono">{entry.key}</TableCell>
                                            <TableCell className="py-1.5 font-mono">{entry.value}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">No local storage entries</p>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Session Metrics</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="rounded-md border p-2 text-center">
                                    <p className="text-lg font-semibold">{session.metrics.pagesVisited}</p>
                                    <p className="text-xs text-muted-foreground">Pages Visited</p>
                                  </div>
                                  <div className="rounded-md border p-2 text-center">
                                    <p className="text-lg font-semibold">{session.metrics.requestsMade}</p>
                                    <p className="text-xs text-muted-foreground">Requests</p>
                                  </div>
                                  <div className="rounded-md border p-2 text-center">
                                    <p className="text-lg font-semibold">{session.metrics.dataTransferred}</p>
                                    <p className="text-xs text-muted-foreground">Data</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => exportSession(session)}>
                                  <Download className="size-3.5 mr-1.5" />
                                  Export Session
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => cloneSession(session)}>
                                  <Copy className="size-3.5 mr-1.5" />
                                  Clone Session
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                )
              })}
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No sessions configured. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

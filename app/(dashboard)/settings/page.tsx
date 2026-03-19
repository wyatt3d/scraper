"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Bell,
  Check,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Gift,
  History,
  Link2,
  Linkedin,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Trash2,
  Twitter,
  Upload,
  User,
  Users,
  UserPlus,
  Webhook,
  X,
  Zap,
  AlertCircle,
  BarChart3,
  Gauge,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

const BillingChart = dynamic(
  () => import("@/components/dashboard/billing-chart").then((mod) => ({ default: mod.BillingChart })),
  {
    loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-lg" />,
    ssr: false,
  }
)

type TeamRole = "owner" | "admin" | "editor" | "viewer"

interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  lastActive: string
  isYou?: boolean
}

interface PendingInvite {
  id: string
  email: string
  role: TeamRole
  sent: string
  status: "pending"
}

interface ActivityEntry {
  id: string
  description: string
  time: string
}

interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  icon: typeof Mail
}

const initialTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Wyatt", email: "wyatt@scraper.bot", role: "owner", lastActive: "Now", isYou: true },
  { id: "tm-2", name: "Sarah Chen", email: "sarah@team.com", role: "admin", lastActive: "2 hours ago" },
  { id: "tm-3", name: "Mike Johnson", email: "mike@team.com", role: "editor", lastActive: "1 day ago" },
  { id: "tm-4", name: "Alex Rivera", email: "alex@team.com", role: "viewer", lastActive: "3 days ago" },
]

const initialPendingInvites: PendingInvite[] = [
  { id: "inv-1", email: "newuser@company.com", role: "editor", sent: "2 hours ago", status: "pending" },
]

const activityLog: ActivityEntry[] = [
  { id: "act-1", description: "Wyatt changed Mike's role from Viewer to Editor", time: "1 hour ago" },
  { id: "act-2", description: "Sarah created flow 'Amazon Monitor'", time: "3 hours ago" },
  { id: "act-3", description: "Alex viewed run results for 'Job Scraper'", time: "5 hours ago" },
  { id: "act-4", description: "Wyatt invited alex@team.com as Viewer", time: "2 days ago" },
]

const roleDescriptions: Record<TeamRole, string> = {
  owner: "Full access, billing, team management, delete account",
  admin: "Manage flows, runs, API keys, integrations. Cannot manage billing.",
  editor: "Create and edit flows, trigger runs, view results. Cannot manage team or keys.",
  viewer: "Read-only access to flows, runs, and analytics. Cannot create or modify.",
}

const integrations: Integration[] = [
  { id: "int-1", name: "Google Sheets", description: "Export extracted data directly to Google Sheets", connected: true, icon: Link2 },
  { id: "int-2", name: "Slack", description: "Receive alerts and notifications in Slack channels", connected: true, icon: MessageSquare },
  { id: "int-3", name: "Discord", description: "Send notifications to Discord channels via webhooks", connected: false, icon: MessageSquare },
  { id: "int-4", name: "Webhook", description: "Send run results to any HTTP endpoint", connected: false, icon: Webhook },
]

const plans = [
  { name: "Free", price: "$0/mo", runs: 100, apiCalls: 1000, current: false },
  { name: "Pro", price: "$29/mo", runs: 5000, apiCalls: 50000, current: true },
  { name: "Enterprise", price: "Custom", runs: -1, apiCalls: -1, current: false },
]

const invoices = [
  { date: "Mar 1, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { date: "Feb 1, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { date: "Jan 1, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { date: "Dec 1, 2025", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { date: "Nov 15, 2025", description: "Pro Plan - Monthly (prorated)", amount: "$14.50", status: "Paid" },
]

function roleBadge(role: TeamRole) {
  switch (role) {
    case "owner":
      return (
        <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
          Owner
        </Badge>
      )
    case "admin":
      return (
        <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/25 dark:text-purple-400">
          Admin
        </Badge>
      )
    case "editor":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
          Editor
        </Badge>
      )
    case "viewer":
      return (
        <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
          Viewer
        </Badge>
      )
  }
}

function ChangeRoleDialog({ member, onRoleChange }: { member: TeamMember; onRoleChange: (id: string, role: TeamRole) => void }) {
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<TeamRole>(member.role)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          Change Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role for {member.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>Role</Label>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as TeamRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            onRoleChange(member.id, selectedRole)
            setOpen(false)
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteMemberDialog({ onInvite }: { onInvite: (email: string, role: TeamRole) => void }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<TeamRole>("editor")
  const [message, setMessage] = useState("")

  function handleInvite() {
    if (!email.trim()) {
      toast.error("Email is required")
      return
    }
    onInvite(email, role)
    toast.success(`Invitation sent to ${email}`)
    setOpen(false)
    setEmail("")
    setRole("editor")
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="size-3.5" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Personal Message (optional)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey, join our scraping workspace!"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleInvite} className="gap-1.5">
            <Send className="size-3.5" />
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TeamSection() {
  const [members, setMembers] = useState(initialTeamMembers)
  const [pendingInvites, setPendingInvites] = useState(initialPendingInvites)

  function handleRoleChange(id: string, newRole: TeamRole) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        toast.success(`${m.name}'s role changed to ${newRole}`)
        return { ...m, role: newRole }
      })
    )
  }

  function removeMember(id: string) {
    const member = members.find((m) => m.id === id)
    setMembers((prev) => prev.filter((m) => m.id !== id))
    toast.success(`${member?.name} removed from team`)
  }

  function handleInvite(email: string, role: TeamRole) {
    setPendingInvites((prev) => [
      ...prev,
      { id: `inv-${Date.now()}`, email, role, sent: "Just now", status: "pending" },
    ])
  }

  function cancelInvite(id: string) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== id))
    toast.success("Invitation cancelled")
  }

  function resendInvite(email: string) {
    toast.success(`Invitation resent to ${email}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription className="mt-1">
                Manage who has access to your workspace.
              </CardDescription>
            </div>
            <InviteMemberDialog onInvite={handleInvite} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {member.name}
                        {member.isYou && <span className="text-muted-foreground ml-1">(You)</span>}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{member.email}</TableCell>
                  <TableCell>{roleBadge(member.role)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{member.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!member.isYou && (
                      <div className="flex items-center justify-end gap-1">
                        <ChangeRoleDialog member={member} onRoleChange={handleRoleChange} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-red-500 hover:text-red-600"
                          onClick={() => removeMember(member.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-4" />
            Role Descriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.entries(roleDescriptions) as [TeamRole, string][]).map(([role, desc]) => (
            <div key={role} className="flex items-start gap-3">
              <div className="pt-0.5 shrink-0">{roleBadge(role)}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium text-sm">{invite.email}</TableCell>
                    <TableCell>{roleBadge(invite.role)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{invite.sent}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/25 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => resendInvite(invite.email)}
                        >
                          <RefreshCw className="size-3" />
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-500 hover:text-red-600"
                          onClick={() => cancelInvite(invite.id)}
                        >
                          <X className="size-3" />
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between gap-4 text-sm">
                <p className="text-muted-foreground">{entry.description}</p>
                <span className="text-xs text-muted-foreground/70 shrink-0 flex items-center gap-1">
                  <Clock className="size-3" />
                  {entry.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.name || user?.email?.split("@")[0] || "")
  const [email, setEmail] = useState(user?.email || "")
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    emailDigest: true,
    slackAlerts: true,
    slackDigest: false,
    discordAlerts: false,
    webhookAlerts: false,
  })
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(
    new Set(integrations.filter((i) => i.connected).map((i) => i.id))
  )

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleIntegration(id: string) {
    setConnectedIntegrations((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const usageData = { plan: "free" as const, runsUsed: 0, runsLimit: 500, apiCallsUsed: 0, apiCallsLimit: 5000 }
  const runsPercent = (usageData.runsUsed / usageData.runsLimit) * 100
  const apiPercent = (usageData.apiCallsUsed / usageData.apiCallsLimit) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, team, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="size-3.5" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="size-3.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5">
            <Zap className="size-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="referrals" className="gap-1.5">
            <Gift className="size-3.5" />
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="size-20">
                  <AvatarFallback className="text-xl">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Avatar upload coming soon")}>
                    <Upload className="size-3.5" />
                    Upload Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Profile saved")}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
          <TeamSection />
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are on the{" "}
                <span className="font-semibold text-foreground capitalize">
                  {usageData.plan}
                </span>{" "}
                plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Runs</span>
                    <span className="text-muted-foreground">
                      {usageData.runsUsed.toLocaleString()} /{" "}
                      {usageData.runsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={runsPercent} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>API Calls</span>
                    <span className="text-muted-foreground">
                      {usageData.apiCallsUsed.toLocaleString()} /{" "}
                      {usageData.apiCallsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={apiPercent} />
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Daily Usage</h3>
                  <span className="text-xs text-muted-foreground">
                    Current billing period: Mar 1 - Mar 31, 2026
                  </span>
                </div>
                <BillingChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`${plan.current ? "border-blue-500 ring-1 ring-blue-500/25" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription className="text-lg font-bold text-foreground">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{plan.runs === -1 ? "Unlimited" : plan.runs.toLocaleString()} runs/mo</p>
                  <p>{plan.apiCalls === -1 ? "Unlimited" : plan.apiCalls.toLocaleString()} API calls/mo</p>
                  {plan.current ? (
                    <Badge className="mt-2 bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400">
                      Current Plan
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        if (plan.name === "Enterprise") {
                          window.open("mailto:sales@scraper.bot", "_blank")
                          toast("Opening email to sales team")
                        } else {
                          toast.success(`Upgrade to ${plan.name} initiated`)
                        }
                      }}
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Your recent invoices and payment records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.date}>
                      <TableCell className="text-muted-foreground">
                        {invoice.date}
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.description}
                      </TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => toast.success("Invoice downloaded")}>
                          <Download className="size-3" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Per-Flow Cost Breakdown
              </CardTitle>
              <CardDescription>
                Usage and cost attribution for the current billing period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flow</TableHead>
                    <TableHead className="text-right">Runs (30d)</TableHead>
                    <TableHead className="text-right">Avg Duration</TableHead>
                    <TableHead className="text-right">Data Points</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Amazon Product Monitor</TableCell>
                    <TableCell className="text-right">120</TableCell>
                    <TableCell className="text-right">12.4s</TableCell>
                    <TableCell className="text-right">17,640</TableCell>
                    <TableCell className="text-right">$1.44</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Indeed Job Scraper</TableCell>
                    <TableCell className="text-right">60</TableCell>
                    <TableCell className="text-right">28.6s</TableCell>
                    <TableCell className="text-right">5,340</TableCell>
                    <TableCell className="text-right">$2.16</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Zillow Property Monitor</TableCell>
                    <TableCell className="text-right">30</TableCell>
                    <TableCell className="text-right">8.2s</TableCell>
                    <TableCell className="text-right">1,020</TableCell>
                    <TableCell className="text-right">$0.36</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hacker News Scraper</TableCell>
                    <TableCell className="text-right">240</TableCell>
                    <TableCell className="text-right">3.2s</TableCell>
                    <TableCell className="text-right">7,200</TableCell>
                    <TableCell className="text-right">$0.72</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GitHub Trending</TableCell>
                    <TableCell className="text-right">120</TableCell>
                    <TableCell className="text-right">4.5s</TableCell>
                    <TableCell className="text-right">3,600</TableCell>
                    <TableCell className="text-right">$0.54</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t-2">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">570</TableCell>
                    <TableCell className="text-right"></TableCell>
                    <TableCell className="text-right">34,800</TableCell>
                    <TableCell className="text-right">$5.22</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5" />
                Budget Alerts
              </CardTitle>
              <CardDescription>
                Set spending thresholds and get notified before overages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm">Monthly Budget</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <Input defaultValue="25.00" className="h-8 text-sm w-32" type="number" step="0.01" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Alert Threshold</Label>
                <div className="flex items-center gap-3">
                  <Slider defaultValue={[75]} min={50} max={100} step={5} className="flex-1" />
                  <span className="text-sm font-mono w-10 text-right">75%</span>
                </div>
                <p className="text-xs text-muted-foreground">Alert when spending reaches this percentage of budget</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">Notification Method</Label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Slack</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dashboard</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Hard Cap</Label>
                  <p className="text-xs text-muted-foreground">Stop all runs when budget is exceeded</p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Current Spend vs Budget</Label>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">$5.22 / $25.00</span>
                  <span className="text-muted-foreground">20.9%</span>
                </div>
                <Progress value={20.9} />
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Budget alerts saved")}>Save Budget Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="size-5" />
                Spending Caps
              </CardTitle>
              <CardDescription>
                Set hard limits on daily and per-flow spending.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm">Daily Spend Limit</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <Input defaultValue="5.00" className="h-8 text-sm w-32" type="number" step="0.01" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Per-Flow Spend Limit</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <Input defaultValue="2.00" className="h-8 text-sm w-32" type="number" step="0.01" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Action When Exceeded</Label>
                <Select defaultValue="pause">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pause">Pause flow</SelectItem>
                    <SelectItem value="queue">Queue runs</SelectItem>
                    <SelectItem value="notify">Notify only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Spending caps saved")}>Save Spending Caps</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Mail className="size-4" />
                  Email
                </h3>
                <div className="ml-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alert Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive emails for monitoring alerts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={() => toggleNotification("emailAlerts")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Daily Digest</p>
                      <p className="text-xs text-muted-foreground">
                        Summary of runs and alerts from the past 24 hours
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={() => toggleNotification("emailDigest")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquare className="size-4" />
                  Slack
                </h3>
                <div className="ml-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alert Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Post alerts to your connected Slack channel
                      </p>
                    </div>
                    <Switch
                      checked={notifications.slackAlerts}
                      onCheckedChange={() => toggleNotification("slackAlerts")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Daily Digest</p>
                      <p className="text-xs text-muted-foreground">
                        Post a daily summary to Slack
                      </p>
                    </div>
                    <Switch
                      checked={notifications.slackDigest}
                      onCheckedChange={() => toggleNotification("slackDigest")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquare className="size-4" />
                  Discord
                </h3>
                <div className="ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alert Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Send alerts via Discord webhook
                      </p>
                    </div>
                    <Switch
                      checked={notifications.discordAlerts}
                      onCheckedChange={() => toggleNotification("discordAlerts")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Webhook className="size-4" />
                  Webhook
                </h3>
                <div className="ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Webhook Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Send alert payloads to a custom HTTP endpoint
                      </p>
                    </div>
                    <Switch
                      checked={notifications.webhookAlerts}
                      onCheckedChange={() => toggleNotification("webhookAlerts")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <Button size="sm" onClick={() => toast.success("Notification preferences saved")}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Connect third-party services to enhance your workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration) => {
                const isConnected = connectedIntegrations.has(integration.id)
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <integration.icon className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {integration.name}
                          </span>
                          {isConnected && (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleIntegration(integration.id)}
                    >
                      {isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>
                Share your unique referral link and earn credits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Referral Code</Label>
                  <div className="flex items-center gap-2">
                    <Input value="WYATT-SCR-2026" readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText("WYATT-SCR-2026")
                        toast.success("Referral code copied to clipboard")
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Referral Link</Label>
                  <div className="flex items-center gap-2">
                    <Input value="https://scraper.bot/ref/WYATT-SCR-2026" readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText("https://scraper.bot/ref/WYATT-SCR-2026")
                        toast.success("Referral link copied to clipboard")
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out Scraper - the best web automation platform! Use my referral link: https://scraper.bot/ref/WYATT-SCR-2026")}`,
                      "_blank"
                    )
                  }}
                >
                  <Twitter className="size-3.5" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://scraper.bot/ref/WYATT-SCR-2026")}`,
                      "_blank"
                    )
                  }}
                >
                  <Linkedin className="size-3.5" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    window.open(
                      `mailto:?subject=${encodeURIComponent("Try Scraper - Web Automation Platform")}&body=${encodeURIComponent("Hey! Check out Scraper and get 1 month free on the Pro plan: https://scraper.bot/ref/WYATT-SCR-2026")}`,
                      "_blank"
                    )
                  }}
                >
                  <Mail className="size-3.5" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Referrals Sent
                </CardTitle>
                <Send className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Referrals Converted
                </CardTitle>
                <UserPlus className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Credits Earned
                </CardTitle>
                <DollarSign className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$50.00</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-600 dark:text-blue-400">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Share your link</p>
                    <p className="text-xs text-muted-foreground">
                      Send your referral link to friends and colleagues.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-600 dark:text-blue-400">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">They get 1 month free</p>
                    <p className="text-xs text-muted-foreground">
                      Your referral gets 1 month free on the Pro plan.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-600 dark:text-blue-400">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">You earn $10 credit</p>
                    <p className="text-xs text-muted-foreground">
                      Get $10 credit for each successful signup.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                Track the status of your referrals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">j***@gmail.com</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                        Converted
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Mar 15, 2026</TableCell>
                    <TableCell className="text-right">$10.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">m***@company.com</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/25 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Mar 12, 2026</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">s***@startup.io</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                        Converted
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Mar 8, 2026</TableCell>
                    <TableCell className="text-right">$10.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">a***@dev.com</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                        Converted
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Feb 28, 2026</TableCell>
                    <TableCell className="text-right">$10.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">t***@agency.co</TableCell>
                    <TableCell>
                      <Badge className="bg-gray-500/15 text-gray-600 border-gray-500/25 dark:text-gray-400">
                        Expired
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">Feb 15, 2026</TableCell>
                    <TableCell className="text-right">-</TableCell>
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

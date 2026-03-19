"use client"

import { useState } from "react"
import {
  Bell,
  CreditCard,
  Link2,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Users,
  Webhook,
  Zap,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { mockUser } from "@/lib/mock-data"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
}

interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  icon: typeof Mail
}

const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Wyatt", email: "wyatt@scraper.dev", role: "owner", joinedAt: "2026-01-01" },
  { id: "tm-2", name: "Alex Chen", email: "alex@scraper.dev", role: "admin", joinedAt: "2026-02-10" },
  { id: "tm-3", name: "Sarah Kim", email: "sarah@scraper.dev", role: "member", joinedAt: "2026-03-01" },
]

const integrations: Integration[] = [
  { id: "int-1", name: "Google Sheets", description: "Export extracted data directly to Google Sheets", connected: true, icon: Link2 },
  { id: "int-2", name: "Slack", description: "Receive alerts and notifications in Slack channels", connected: true, icon: MessageSquare },
  { id: "int-3", name: "Discord", description: "Send notifications to Discord channels via webhooks", connected: false, icon: MessageSquare },
  { id: "int-4", name: "Webhook", description: "Send run results to any HTTP endpoint", connected: false, icon: Webhook },
]

const plans = [
  { name: "Free", price: "$0/mo", runs: 100, apiCalls: 1000, current: false },
  { name: "Starter", price: "$19/mo", runs: 1000, apiCalls: 10000, current: false },
  { name: "Professional", price: "$49/mo", runs: 5000, apiCalls: 50000, current: true },
  { name: "Enterprise", price: "Custom", runs: -1, apiCalls: -1, current: false },
]

const dailyUsageData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 30 + Math.floor(Math.random() * 40)
  const apiBase = base * 6 + Math.floor(Math.random() * 100)
  return {
    date: `Mar ${day}`,
    runs: day <= 18 ? base : 0,
    apiCalls: day <= 18 ? apiBase : 0,
  }
})

const usageChartConfig = {
  runs: {
    label: "Runs",
    color: "hsl(221, 83%, 53%)",
  },
  apiCalls: {
    label: "API Calls",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig

function roleBadge(role: TeamMember["role"]) {
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
    case "member":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
          Member
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

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.name)
  const [email, setEmail] = useState(mockUser.email)
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

  const runsPercent = (mockUser.usage.runsUsed / mockUser.usage.runsLimit) * 100
  const apiPercent = (mockUser.usage.apiCallsUsed / mockUser.usage.apiCallsLimit) * 100

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
                  <Button variant="outline" size="sm" className="gap-1.5">
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
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription className="mt-1">
                    Manage who has access to your workspace.
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-1.5">
                  <Plus className="size-3.5" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {member.name}
                        </span>
                        {roleBadge(member.role)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are on the{" "}
                <span className="font-semibold text-foreground capitalize">
                  {mockUser.plan}
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
                      {mockUser.usage.runsUsed.toLocaleString()} /{" "}
                      {mockUser.usage.runsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={runsPercent} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>API Calls</span>
                    <span className="text-muted-foreground">
                      {mockUser.usage.apiCallsUsed.toLocaleString()} /{" "}
                      {mockUser.usage.apiCallsLimit.toLocaleString()}
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
                <ChartContainer config={usageChartConfig} className="h-[200px] w-full">
                  <AreaChart data={dailyUsageData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="fillRuns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-runs)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-runs)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fillApiCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-apiCalls)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-apiCalls)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(v) => v.replace("Mar ", "")}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      dataKey="apiCalls"
                      type="monotone"
                      fill="url(#fillApiCalls)"
                      stroke="var(--color-apiCalls)"
                      strokeWidth={1.5}
                    />
                    <Area
                      dataKey="runs"
                      type="monotone"
                      fill="url(#fillRuns)"
                      stroke="var(--color-runs)"
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
                <Button size="sm">Save Preferences</Button>
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
      </Tabs>
    </div>
  )
}

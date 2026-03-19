"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  Copy,
  FileSpreadsheet,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Plug,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type IntegrationStatus = "connected" | "not_connected"

interface Integration {
  id: string
  name: string
  description: string
  icon: typeof MessageSquare
  accent: string
  iconBg: string
  status: IntegrationStatus
  statusLabel: string
  type: "webhook" | "oauth" | "zapier" | "email" | "custom-webhook"
}

const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send scraping results and alerts to Slack channels",
    icon: MessageSquare,
    accent: "border-purple-500/30 hover:border-purple-500/50",
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "webhook",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Post notifications to Discord channels",
    icon: MessageSquare,
    accent: "border-indigo-500/30 hover:border-indigo-500/50",
    iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "webhook",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Export extracted data directly to Google Sheets",
    icon: FileSpreadsheet,
    accent: "border-green-500/30 hover:border-green-500/50",
    iconBg: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "oauth",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5,000+ apps via Zapier",
    icon: Zap,
    accent: "border-orange-500/30 hover:border-orange-500/50",
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "zapier",
  },
  {
    id: "email",
    name: "Email",
    description: "Get email notifications for important events",
    icon: Mail,
    accent: "border-blue-500/30 hover:border-blue-500/50",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "email",
  },
  {
    id: "custom-webhook",
    name: "Custom Webhook",
    description: "Send events to any HTTP endpoint",
    icon: Globe,
    accent: "border-gray-500/30 hover:border-gray-500/50",
    iconBg: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    status: "not_connected",
    statusLabel: "Not Connected",
    type: "custom-webhook",
  },
]

function WebhookWizard({
  integration,
  open,
  onOpenChange,
}: {
  integration: Integration
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState(1)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [events, setEvents] = useState<string[]>([])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "fail" | null>(null)

  function reset() {
    setStep(1)
    setWebhookUrl("")
    setEvents([])
    setTesting(false)
    setTestResult(null)
  }

  function toggleEvent(event: string) {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  function handleTest() {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTesting(false)
      setTestResult("success")
    }, 1500)
  }

  function handleFinish() {
    toast.success(`${integration.name} connected successfully`)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {integration.name}</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-blue-600" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Enter your {integration.name} webhook URL</Label>
              <Input
                placeholder={`https://hooks.${integration.id}.com/services/...`}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <a
                href="#"
                className="text-xs text-blue-600 hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                How to find your webhook URL
              </a>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <Label>Choose events to send</Label>
            {["run.completed", "run.failed", "alerts"].map((event) => (
              <div key={event} className="flex items-center gap-2">
                <Checkbox
                  id={`${integration.id}-${event}`}
                  checked={events.includes(event)}
                  onCheckedChange={() => toggleEvent(event)}
                />
                <label
                  htmlFor={`${integration.id}-${event}`}
                  className="text-sm cursor-pointer font-mono"
                >
                  {event}
                </label>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2">
            <Label>Test connection</Label>
            <p className="text-sm text-muted-foreground">
              Send a test message to verify your {integration.name} integration
              is working correctly.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Test"
                )}
              </Button>
              {testResult === "success" && (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <Check className="size-4" />
                  Test message sent successfully
                </span>
              )}
              {testResult === "fail" && (
                <span className="text-sm text-red-600">
                  Failed to send. Check your webhook URL.
                </span>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 ? !webhookUrl : events.length === 0}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={testResult !== "success"}>
              Finish Setup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function GoogleSheetsWizard({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState(1)
  const [connected, setConnected] = useState(false)
  const [spreadsheet, setSpreadsheet] = useState("")

  const fieldMappings = [
    { source: "title", target: "Column A" },
    { source: "price", target: "Column B" },
    { source: "url", target: "Column C" },
    { source: "timestamp", target: "Column D" },
  ]

  function reset() {
    setStep(1)
    setConnected(false)
    setSpreadsheet("")
  }

  function handleFinish() {
    toast.success("Google Sheets connected successfully")
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Google Sheets</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-green-600" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <Label>Connect your Google account</Label>
            <p className="text-sm text-muted-foreground">
              Authorize Scraper to access your Google Sheets.
            </p>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setConnected(true)}
            >
              {connected ? (
                <>
                  <Check className="size-4 text-emerald-500" />
                  Google Account Connected
                </>
              ) : (
                <>
                  <FileSpreadsheet className="size-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <Label>Choose spreadsheet</Label>
            <Select value={spreadsheet} onValueChange={setSpreadsheet}>
              <SelectTrigger>
                <SelectValue placeholder="Select a spreadsheet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scraper-data">Scraper Data</SelectItem>
                <SelectItem value="price-tracking">Price Tracking</SelectItem>
                <SelectItem value="create-new">Create New</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2">
            <Label>Map fields</Label>
            <div className="rounded-md border">
              <div className="grid grid-cols-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>Source Field</span>
                <span>Sheet Column</span>
              </div>
              {fieldMappings.map((mapping) => (
                <div
                  key={mapping.source}
                  className="grid grid-cols-2 border-b last:border-0 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs">{mapping.source}</span>
                  <span className="text-muted-foreground">{mapping.target}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 ? !connected : !spreadsheet}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish}>Finish Setup</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ZapierCard({ integration }: { integration: Integration }) {
  const [copied, setCopied] = useState(false)
  const zapierUrl = "https://zapier.com/apps/scraper-bot/integrations"

  function handleCopy() {
    navigator.clipboard.writeText(zapierUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("URL copied to clipboard")
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
        <code className="flex-1 break-all text-xs font-mono">
          {zapierUrl}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}

function EmailSetup({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [email, setEmail] = useState("")
  const [frequency, setFrequency] = useState("")
  const [events, setEvents] = useState({
    runCompleted: true,
    runFailed: true,
    alerts: true,
  })

  function reset() {
    setEmail("")
    setFrequency("")
    setEvents({ runCompleted: true, runFailed: true, alerts: true })
  }

  function handleSave() {
    toast.success("Email notifications configured")
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Notifications</DialogTitle>
          <DialogDescription>
            Configure email notifications for your scraping events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Events</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="email-run-completed"
                checked={events.runCompleted}
                onCheckedChange={(checked) =>
                  setEvents((prev) => ({ ...prev, runCompleted: !!checked }))
                }
              />
              <label htmlFor="email-run-completed" className="text-sm cursor-pointer">
                Run completed
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="email-run-failed"
                checked={events.runFailed}
                onCheckedChange={(checked) =>
                  setEvents((prev) => ({ ...prev, runFailed: !!checked }))
                }
              />
              <label htmlFor="email-run-failed" className="text-sm cursor-pointer">
                Run failed
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="email-alerts"
                checked={events.alerts}
                onCheckedChange={(checked) =>
                  setEvents((prev) => ({ ...prev, alerts: !!checked }))
                }
              />
              <label htmlFor="email-alerts" className="text-sm cursor-pointer">
                Alerts
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!email || !frequency}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function IntegrationsPage() {
  const [activeWizard, setActiveWizard] = useState<string | null>(null)
  const [zapierExpanded, setZapierExpanded] = useState(false)

  function handleConnect(integration: Integration) {
    if (integration.type === "custom-webhook") {
      return
    }
    if (integration.type === "zapier") {
      setZapierExpanded(!zapierExpanded)
      return
    }
    setActiveWizard(integration.id)
  }

  const slackIntegration = integrations.find((i) => i.id === "slack")!
  const discordIntegration = integrations.find((i) => i.id === "discord")!

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              Integrations
            </h1>
            <Badge variant="secondary">Browse All</Badge>
            <Badge variant="outline" className="text-xs">
              6 available
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Connect external services to extend your scraping workflows.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card
              key={integration.id}
              className={cn("transition-colors", integration.accent)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        integration.iconBg
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {integration.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      integration.status === "connected"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {integration.statusLabel}
                  </Badge>
                  {integration.type === "custom-webhook" ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/webhooks">Configure</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(integration)}
                    >
                      {integration.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  )}
                </div>
                {integration.type === "zapier" && zapierExpanded && (
                  <ZapierCard integration={integration} />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <WebhookWizard
        integration={slackIntegration}
        open={activeWizard === "slack"}
        onOpenChange={(open) => !open && setActiveWizard(null)}
      />
      <WebhookWizard
        integration={discordIntegration}
        open={activeWizard === "discord"}
        onOpenChange={(open) => !open && setActiveWizard(null)}
      />
      <GoogleSheetsWizard
        open={activeWizard === "google-sheets"}
        onOpenChange={(open) => !open && setActiveWizard(null)}
      />
      <EmailSetup
        open={activeWizard === "email"}
        onOpenChange={(open) => !open && setActiveWizard(null)}
      />
    </div>
  )
}

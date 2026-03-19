"use client"

import { useState, useRef } from "react"
import {
  Save,
  Calendar,
  Bell,
  RefreshCw,
  Download,
  Upload,
  History,
  RotateCcw,
  GitCompare,
  Shield,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { downloadJSON } from "@/lib/export"
import { toast } from "sonner"
import type { Flow } from "@/lib/types"

const mockVersionHistory = [
  {
    version: 3,
    date: "2026-03-18",
    author: "Wyatt",
    changes: "Updated extraction rules",
    current: true,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "wait", label: "Wait for content" },
        { type: "extract", label: "Extract data (updated selectors)" },
      ],
    },
  },
  {
    version: 2,
    date: "2026-03-15",
    author: "Wyatt",
    changes: "Added pagination step",
    current: false,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "wait", label: "Wait for content" },
        { type: "extract", label: "Extract data" },
        { type: "click", label: "Next page", selector: ".pagination .next" },
      ],
    },
  },
  {
    version: 1,
    date: "2026-03-10",
    author: "Wyatt",
    changes: "Initial version",
    current: false,
    snapshot: {
      steps: [
        { type: "navigate", label: "Go to page", selector: "https://example.com" },
        { type: "extract", label: "Extract data" },
      ],
    },
  },
]

export interface SettingsTabProps {
  flow: Flow
}

export function SettingsTab({ flow }: SettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importPreview, setImportPreview] = useState<Record<string, unknown> | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [restoreTarget, setRestoreTarget] = useState<(typeof mockVersionHistory)[0] | null>(null)
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)
  const [compareVersions, setCompareVersions] = useState<{
    from: (typeof mockVersionHistory)[0]
    to: (typeof mockVersionHistory)[0]
  } | null>(null)

  function handleExport() {
    const exportData = {
      name: flow.name,
      description: flow.description,
      url: flow.url,
      mode: flow.mode,
      steps: flow.steps,
      outputSchema: flow.outputSchema,
    }
    downloadJSON(exportData, `flow-${flow.id}`)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        setImportPreview(parsed)
        setImportDialogOpen(true)
      } catch {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleCompare(from: (typeof mockVersionHistory)[0], to: (typeof mockVersionHistory)[0]) {
    setCompareVersions({ from, to })
    setCompareDialogOpen(true)
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-[family-name:var(--font-crimson-text)] text-xl font-semibold">
            Settings
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure schedule, notifications, and retry behavior.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" />
              Import / Export
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Export this flow as JSON for backup or sharing, or import a flow configuration from a file.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import Flow
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Versions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                View and restore previous versions of this flow.
              </p>
              {mockVersionHistory.length >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCompare(mockVersionHistory[1], mockVersionHistory[0])
                  }
                >
                  <GitCompare className="mr-2 h-3.5 w-3.5" />
                  Compare
                </Button>
              )}
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVersionHistory.map((v) => (
                    <TableRow key={v.version}>
                      <TableCell className="font-mono text-sm">
                        v{v.version}
                        {v.current && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            current
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{v.date}</TableCell>
                      <TableCell className="text-sm">{v.author}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {v.changes}
                      </TableCell>
                      <TableCell>
                        {!v.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setRestoreTarget(v)}
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restore
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Timezone-Aware Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enabled</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Automatically run this flow on a schedule
                </p>
              </div>
              <Switch defaultChecked={flow.schedule?.enabled} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Cron Expression</Label>
              <Input
                defaultValue={flow.schedule?.expression || ""}
                placeholder="0 */6 * * *"
                className="h-8 text-sm font-mono"
              />
              <p className="text-muted-foreground text-[10px]">
                {flow.schedule?.expression === "0 */6 * * *"
                  ? "Every 6 hours"
                  : flow.schedule?.expression === "0 8 * * *"
                    ? "Daily at 8:00 AM"
                    : flow.schedule?.expression === "0 */2 * * *"
                      ? "Every 2 hours"
                      : "Custom schedule"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Timezone</Label>
              <Select defaultValue={flow.schedule?.timezone || "America/New_York"}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="America/Chicago">America/Chicago (CST)</SelectItem>
                  <SelectItem value="America/Denver">America/Denver (MST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Next 5 Runs</Label>
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-muted-foreground">
                  <span>1. Mar 19, 2026 at 12:00 PM EST</span>
                  <span>2. Mar 19, 2026 at 6:00 PM EST</span>
                  <span>3. Mar 20, 2026 at 12:00 AM EST</span>
                  <span>4. Mar 20, 2026 at 6:00 AM EST</span>
                  <span>5. Mar 20, 2026 at 12:00 PM EST</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>On Failure</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Get notified when a run fails
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>On Success</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Get notified when a run completes
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>On Change Detected</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Alert when monitored data changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4" />
              Retry Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Max Retries</Label>
              <Input defaultValue="3" min={1} max={10} className="h-8 text-sm" type="number" />
              <p className="text-muted-foreground text-[10px]">Between 1 and 10 retries</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Backoff Strategy</Label>
              <Select defaultValue="exponential">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Initial Delay (seconds)</Label>
                <Input defaultValue="5" className="h-8 text-sm" type="number" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Max Delay (seconds)</Label>
                <Input defaultValue="60" className="h-8 text-sm" type="number" />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Retry On</Label>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-network" defaultChecked />
                  <label htmlFor="retry-network" className="text-sm">Network error</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-ratelimit" defaultChecked />
                  <label htmlFor="retry-ratelimit" className="text-sm">Rate limit (429)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-server" defaultChecked />
                  <label htmlFor="retry-server" className="text-sm">Server error (5xx)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry-timeout" defaultChecked />
                  <label htmlFor="retry-timeout" className="text-sm">Timeout</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" />
              Concurrency
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Concurrent Run Limit</Label>
              <div className="flex items-center gap-3">
                <Slider defaultValue={[1]} min={1} max={10} step={1} className="flex-1" />
                <span className="text-sm font-mono w-6 text-right">1</span>
              </div>
              <p className="text-muted-foreground text-[10px]">Maximum parallel runs (1-10)</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Queue Behavior</Label>
              <Select defaultValue="queue">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="queue">Queue excess</SelectItem>
                  <SelectItem value="skip">Skip if running</SelectItem>
                  <SelectItem value="cancel">Cancel previous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Timeout (seconds)</Label>
              <Input defaultValue="300" className="h-8 text-sm" type="number" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              CAPTCHA &amp; Anti-Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>CAPTCHA Solving</Label>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Automatically solve CAPTCHAs during flow execution
                </p>
              </div>
              <Switch id="captcha-solving" />
            </div>
            <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Provider</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (recommended)</SelectItem>
                    <SelectItem value="2captcha">2Captcha</SelectItem>
                    <SelectItem value="anticaptcha">Anti-Captcha</SelectItem>
                    <SelectItem value="hcaptcha">hCaptcha Solver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Supported CAPTCHA Types</Label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-recaptchav2" defaultChecked />
                    <label htmlFor="captcha-recaptchav2" className="text-sm">reCAPTCHA v2</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-recaptchav3" defaultChecked />
                    <label htmlFor="captcha-recaptchav3" className="text-sm">reCAPTCHA v3</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-hcaptcha" defaultChecked />
                    <label htmlFor="captcha-hcaptcha" className="text-sm">hCaptcha</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="captcha-turnstile" defaultChecked />
                    <label htmlFor="captcha-turnstile" className="text-sm">Cloudflare Turnstile</label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">API Key (external provider)</Label>
                <Input placeholder="Enter provider API key" className="h-8 text-sm font-mono" type="password" />
              </div>
              <Button variant="outline" size="sm" className="w-fit" onClick={() => toast.success("CAPTCHA solving test passed")}>
                Test CAPTCHA Solving
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-semibold">Anti-Bot Protection</Label>
              <p className="text-muted-foreground text-xs mt-0.5 mb-3">
                Evade bot detection systems with human-like behavior
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Browser fingerprint randomization</Label>
                    <p className="text-muted-foreground text-[10px]">Rotate canvas, WebGL, and navigator fingerprints</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Human-like delays</Label>
                    <p className="text-muted-foreground text-[10px]">Add random delays between actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Delay Range</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12">500ms</span>
                    <Slider defaultValue={[800, 2500]} min={500} max={5000} step={100} className="flex-1" />
                    <span className="text-xs text-muted-foreground w-14 text-right">5000ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Request header rotation</Label>
                    <p className="text-muted-foreground text-[10px]">Randomize User-Agent and Accept headers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Cookie persistence</Label>
                    <p className="text-muted-foreground text-[10px]">Maintain cookies across requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Flow Preview</DialogTitle>
            <DialogDescription>
              Review the flow configuration before importing.
            </DialogDescription>
          </DialogHeader>
          {importPreview && (
            <div className="rounded-md border bg-muted/50 p-3 max-h-80 overflow-auto">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(importPreview, null, 2)}
              </pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setImportDialogOpen(false)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!restoreTarget} onOpenChange={(o) => !o && setRestoreTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore to v{restoreTarget?.version}? This will overwrite
              the current flow configuration. A new version will be created from the current state
              before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setRestoreTarget(null)}
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Compare Versions: v{compareVersions?.from.version} vs v{compareVersions?.to.version}
            </DialogTitle>
            <DialogDescription>
              Differences between version {compareVersions?.from.version} and version{" "}
              {compareVersions?.to.version}.
            </DialogDescription>
          </DialogHeader>
          {compareVersions && (
            <div className="rounded-md border bg-zinc-950 p-4 max-h-96 overflow-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                <span className="text-zinc-500">{"--- v" + compareVersions.from.version + " (" + compareVersions.from.date + ")\n"}</span>
                <span className="text-zinc-500">{"+++ v" + compareVersions.to.version + " (" + compareVersions.to.date + ")\n\n"}</span>
                {compareVersions.from.snapshot.steps.map((step, i) => {
                  const toStep = compareVersions.to.snapshot.steps[i]
                  if (!toStep) {
                    return (
                      <span key={`removed-${i}`} className="text-red-400">
                        {"- " + JSON.stringify(step) + "\n"}
                      </span>
                    )
                  }
                  if (JSON.stringify(step) !== JSON.stringify(toStep)) {
                    return (
                      <span key={`changed-${i}`}>
                        <span className="text-red-400">{"- " + JSON.stringify(step) + "\n"}</span>
                        <span className="text-green-400">{"+ " + JSON.stringify(toStep) + "\n"}</span>
                      </span>
                    )
                  }
                  return (
                    <span key={`same-${i}`} className="text-zinc-400">
                      {"  " + JSON.stringify(step) + "\n"}
                    </span>
                  )
                })}
                {compareVersions.to.snapshot.steps.slice(compareVersions.from.snapshot.steps.length).map((step, i) => (
                  <span key={`added-${i}`} className="text-green-400">
                    {"+ " + JSON.stringify(step) + "\n"}
                  </span>
                ))}
              </pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Edit,
  FileBarChart,
  Mail,
  MessageSquare,
  Plus,
  Send,
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
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "sonner"

interface ScheduledReport {
  id: string
  name: string
  schedule: string
  scheduleBadge: string
  recipients: string
  channel: "Email" | "Slack" | "Email + Slack"
  lastSent: string
  nextSend: string
  enabled: boolean
  contents: string[]
}

const initialReports: ScheduledReport[] = [
  {
    id: "rpt-1",
    name: "Weekly Summary",
    schedule: "0 9 * * 1",
    scheduleBadge: "Every Monday 9:00 AM",
    recipients: "wyatt@scraper.bot",
    channel: "Email",
    lastSent: "Mar 17, 2026 9:00 AM",
    nextSend: "Mar 23, 2026 9:00 AM",
    enabled: true,
    contents: ["Run count", "Success rate", "Top flows", "Cost breakdown"],
  },
  {
    id: "rpt-2",
    name: "Daily Alerts Digest",
    schedule: "0 18 * * *",
    scheduleBadge: "Every day 6:00 PM",
    recipients: "wyatt@scraper.bot",
    channel: "Email + Slack",
    lastSent: "Mar 18, 2026 6:00 PM",
    nextSend: "Mar 19, 2026 6:00 PM",
    enabled: true,
    contents: ["All alerts from last 24h"],
  },
  {
    id: "rpt-3",
    name: "Monthly Executive Report",
    schedule: "0 9 1 * *",
    scheduleBadge: "1st of month 9:00 AM",
    recipients: "team@scraper.bot",
    channel: "Email",
    lastSent: "Mar 1, 2026 9:00 AM",
    nextSend: "Apr 1, 2026 9:00 AM",
    enabled: true,
    contents: ["Full month analytics", "Cost trends", "Usage patterns"],
  },
]

const contentSections = [
  { id: "run-summary", label: "Run summary (count, success rate, duration)" },
  { id: "flow-performance", label: "Flow performance table" },
  { id: "cost-breakdown", label: "Cost breakdown" },
  { id: "alert-summary", label: "Alert summary" },
  { id: "data-stats", label: "Data extraction stats" },
  { id: "comparison", label: "Comparison vs previous period" },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reportName, setReportName] = useState("")
  const [template, setTemplate] = useState("")
  const [schedulePreset, setSchedulePreset] = useState("")
  const [cronExpression, setCronExpression] = useState("")
  const [recipients, setRecipients] = useState("")
  const [deliveryChannel, setDeliveryChannel] = useState("")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [format, setFormat] = useState("")

  function toggleReport(id: string) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    )
    const report = reports.find((r) => r.id === id)
    if (report) {
      toast.success(
        `${report.name} ${report.enabled ? "paused" : "resumed"}`
      )
    }
  }

  function deleteReport(id: string) {
    const report = reports.find((r) => r.id === id)
    setReports((prev) => prev.filter((r) => r.id !== id))
    if (report) {
      toast.success(`"${report.name}" deleted`)
    }
  }

  function toggleSection(sectionId: string) {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  function resetForm() {
    setReportName("")
    setTemplate("")
    setSchedulePreset("")
    setCronExpression("")
    setRecipients("")
    setDeliveryChannel("")
    setSelectedSections([])
    setFormat("")
  }

  function handleCreate() {
    if (!reportName.trim()) {
      toast.error("Report name is required")
      return
    }
    if (!recipients.trim()) {
      toast.error("At least one recipient is required")
      return
    }

    const scheduleLabel =
      schedulePreset === "daily"
        ? "Every day 9:00 AM"
        : schedulePreset === "weekly"
          ? "Every Monday 9:00 AM"
          : schedulePreset === "monthly"
            ? "1st of month 9:00 AM"
            : cronExpression || "Custom"

    const newReport: ScheduledReport = {
      id: `rpt-${Date.now()}`,
      name: reportName,
      schedule: cronExpression || schedulePreset,
      scheduleBadge: scheduleLabel,
      recipients: recipients,
      channel: (deliveryChannel as ScheduledReport["channel"]) || "Email",
      lastSent: "Never",
      nextSend: "Pending",
      enabled: true,
      contents: selectedSections.map(
        (s) => contentSections.find((c) => c.id === s)?.label || s
      ),
    }
    setReports((prev) => [...prev, newReport])
    toast.success(`Report "${reportName}" created`)
    resetForm()
    setDialogOpen(false)
  }

  function sendTestReport() {
    toast.success("Test report sent to " + (recipients || "your email"))
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            Scheduled Reports
          </h1>
          <p className="text-muted-foreground text-sm">
            Automatically generate and send reports on your scraping activity
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 size-4" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create Report</DialogTitle>
              <DialogDescription>
                Set up an automated report with custom content and schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="e.g. Weekly Summary"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly-summary">Weekly Summary</SelectItem>
                    <SelectItem value="daily-digest">Daily Digest</SelectItem>
                    <SelectItem value="monthly-executive">Monthly Executive</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Schedule</Label>
                <Select value={schedulePreset} onValueChange={setSchedulePreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom (cron)</SelectItem>
                  </SelectContent>
                </Select>
                {schedulePreset === "custom" && (
                  <Input
                    placeholder="e.g. 0 9 * * 1"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    className="mt-1 font-mono text-sm"
                  />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  placeholder="email1@example.com, email2@example.com"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  Comma-separated email addresses
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Delivery Channel</Label>
                <Select value={deliveryChannel} onValueChange={setDeliveryChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="Email + Slack">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Content Sections</Label>
                <div className="grid gap-2 rounded-md border p-3">
                  {contentSections.map((section) => (
                    <div key={section.id} className="flex items-center gap-2">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <Label
                        htmlFor={section.id}
                        className="text-sm font-normal"
                      >
                        {section.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="csv">CSV Attachment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={sendTestReport}>
                <Send className="mr-2 size-4" />
                Send Test Report
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreate}>Create Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <FileBarChart className="text-muted-foreground size-4" />
                  <CardTitle className="text-base">{report.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="mr-1 size-3" />
                    {report.scheduleBadge}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {report.contents.join(" / ")}
                </CardDescription>
              </div>
              <Switch
                checked={report.enabled}
                onCheckedChange={() => toggleReport(report.id)}
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  {report.channel.includes("Email") && (
                    <Mail className="text-muted-foreground size-3.5" />
                  )}
                  {report.channel.includes("Slack") && (
                    <MessageSquare className="text-muted-foreground size-3.5" />
                  )}
                  <span className="text-muted-foreground">
                    {report.recipients}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Last: {report.lastSent}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>Next: {report.nextSend}</span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="mr-1 size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteReport(report.id)}
                  >
                    <Trash2 className="mr-1 size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-12">
          <FileBarChart className="text-muted-foreground mb-4 size-12" />
          <p className="text-muted-foreground text-sm">
            No scheduled reports yet. Create one to get started.
          </p>
        </Card>
      )}
    </div>
  )
}

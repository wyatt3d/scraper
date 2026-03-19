"use client"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { Bot, HelpCircle, ImagePlus, BookOpen, Keyboard, AlertTriangle, X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const ticketTypes = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "question", label: "Question" },
  { value: "performance", label: "Performance Issue" },
  { value: "security", label: "Security Concern" },
]

const severityLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

function TroubleTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pathname = usePathname()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [type, setType] = useState("bug")
  const [severity, setSeverity] = useState("medium")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [steps, setSteps] = useState("")
  const [pageUrl, setPageUrl] = useState(pathname)
  const [email, setEmail] = useState(user?.email || "")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const isBugType = type === "bug" || type === "performance" || type === "security"

  function resetForm() {
    setType("bug")
    setSeverity("medium")
    setTitle("")
    setDescription("")
    setSteps("")
    setPageUrl(pathname)
    setEmail(user?.email || "")
    setScreenshot(null)
    setScreenshotPreview(null)
    setSubmittedId(null)
  }

  function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshot(file)
    const reader = new FileReader()
    reader.onload = () => setScreenshotPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeScreenshot() {
    setScreenshot(null)
    setScreenshotPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          severity: isBugType ? severity : undefined,
          title: title.trim(),
          description: description.trim(),
          stepsToReproduce: steps.trim(),
          pageUrl,
          email,
        }),
      })
      const result = await res.json()
      const ticketId = result.data?.id?.slice(0, 8) || "unknown"
      setSubmittedId(ticketId)
      toast.success("Ticket submitted! We'll get back to you shortly.")
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 2000)
    } catch {
      toast.error("Failed to submit ticket. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm() }}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-blue-600" />
            <DialogTitle className="font-serif">Report an Issue</DialogTitle>
          </div>
          <DialogDescription>
            Help us improve Scraper.bot by reporting bugs, requesting features, or asking questions.
          </DialogDescription>
        </DialogHeader>

        {submittedId ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="size-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Ticket Submitted</p>
            <code className="rounded bg-muted px-3 py-1 text-sm font-mono">#{submittedId}</code>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ticket-type" className="text-sm font-medium">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="ticket-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isBugType && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ticket-severity" className="text-sm font-medium">Severity</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger id="ticket-severity" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ticket-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="ticket-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail. What did you expect to happen? What actually happened?"
                rows={6}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-steps" className="text-sm font-medium">
                Steps to Reproduce <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="ticket-steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-url" className="text-sm font-medium">Page / URL</Label>
              <Input
                id="ticket-url"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="/dashboard"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Screenshot</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshot}
                className="hidden"
              />
              {screenshotPreview ? (
                <div className="relative inline-block">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="max-h-32 rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={removeScreenshot}
                    className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-fit gap-2"
                >
                  <ImagePlus className="size-4" />
                  Attach Screenshot
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-email" className="text-sm font-medium">Email</Label>
              <Input
                id="ticket-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="mt-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function TroubleTicketTrigger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <TroubleTicketDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export function FloatingHelpButton() {
  const [ticketOpen, setTicketOpen] = useState(false)

  return (
    <>
      <div className="fixed left-6 bottom-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Help menu"
            >
              <HelpCircle className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem onClick={() => setTicketOpen(true)}>
              <AlertTriangle className="size-4" />
              Report Issue
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/docs" className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Documentation
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
            >
              <Keyboard className="size-4" />
              Keyboard Shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TroubleTicketDialog open={ticketOpen} onOpenChange={setTicketOpen} />
    </>
  )
}

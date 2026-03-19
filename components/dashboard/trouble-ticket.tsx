"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Bot,
  HelpCircle,
  BookOpen,
  Keyboard,
  AlertTriangle,
  X,
  Crosshair,
  Undo2,
  Eye,
  Zap,
  ChevronRight,
  ChevronLeft,
  Check,
  MousePointerClick,
  RotateCcw,
} from "lucide-react"
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
import { cn } from "@/lib/utils"
import { triggerTourReplay } from "@/components/dashboard/product-tour"

// --- Types ---

interface SelectedElement {
  selector: string
  xpath: string
  tagName: string
  textContent: string
  boundingRect: { x: number; y: number; w: number; h: number }
  note: string
}

type Step = "capture" | "annotate" | "details" | "review" | "success"

const ticketTypes = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "question", label: "Question" },
]

const severityLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

function getSelector(el: Element): string {
  if (el.id) return `#${el.id}`
  const parts: string[] = []
  let current: Element | null = el
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      parts.unshift(`#${current.id}`)
      break
    }
    if (current.className && typeof current.className === "string") {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => !c.startsWith("_") && c.length < 30)
        .slice(0, 2)
      if (classes.length) selector += `.${classes.join(".")}`
    }
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-child(${index})`
      }
    }
    parts.unshift(selector)
    current = current.parentElement
  }
  return parts.join(" > ")
}

function getXPath(el: Element): string {
  const parts: string[] = []
  let current: Element | null = el
  while (current && current !== document.body) {
    let part = current.tagName.toLowerCase()
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName
      )
      if (siblings.length > 1) {
        part += `[${siblings.indexOf(current) + 1}]`
      }
    }
    parts.unshift(part)
    current = current.parentElement
  }
  return "//" + parts.join("/")
}

function getElementDisplayName(selector: string, tagName: string): string {
  const short = selector.split(" > ").pop() || tagName
  const parent = selector.split(" > ").slice(-2, -1)[0]
  if (parent) return `${short} in ${parent}`
  return short
}

function generateTitle(elements: SelectedElement[], type: string): string {
  const notes = elements.map((r) => r.note).filter(Boolean)
  if (notes.length === 0) {
    if (type === "feature") return "Feature request"
    if (type === "question") return "Question about the interface"
    return "Visual bug report"
  }
  if (notes.length === 1) return notes[0].slice(0, 80)
  return notes
    .slice(0, 2)
    .map((n) => n.slice(0, 35))
    .join(" & ")
}

function getSuggestedSeverity(pathname: string): string {
  if (pathname.includes("dashboard") || pathname.includes("flows"))
    return "high"
  if (pathname.includes("settings") || pathname.includes("api-keys"))
    return "medium"
  return "medium"
}

// --- Capture Overlay ---

function CaptureOverlay({
  onDone,
  onCancel,
  onSkip,
}: {
  onDone: (elements: SelectedElement[]) => void
  onCancel: () => void
  onSkip: () => void
}) {
  const [elements, setElements] = useState<SelectedElement[]>([])
  const [hoveredEl, setHoveredEl] = useState<Element | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [entering, setEntering] = useState(true)
  const outlinedElementsRef = useRef<Map<Element, string>>(new Map())

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => {
      outlinedElementsRef.current.forEach((originalOutline, el) => {
        ;(el as HTMLElement).style.outline = originalOutline
        ;(el as HTMLElement).style.outlineOffset = ""
      })
      outlinedElementsRef.current.clear()
      if (hoveredEl) {
        ;(hoveredEl as HTMLElement).style.outline = ""
        ;(hoveredEl as HTMLElement).style.outlineOffset = ""
      }
    }
  }, [hoveredEl])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-toolbar]")) {
        if (hoveredEl) {
          ;(hoveredEl as HTMLElement).style.outline = ""
          ;(hoveredEl as HTMLElement).style.outlineOffset = ""
          setHoveredEl(null)
        }
        return
      }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === overlayRef.current || el === document.body) return
      if (el === hoveredEl) return
      if (hoveredEl && !outlinedElementsRef.current.has(hoveredEl)) {
        ;(hoveredEl as HTMLElement).style.outline = ""
        ;(hoveredEl as HTMLElement).style.outlineOffset = ""
      }
      if (!outlinedElementsRef.current.has(el)) {
        ;(el as HTMLElement).style.outline = "3px solid #3b82f6"
        ;(el as HTMLElement).style.outlineOffset = "2px"
      }
      setHoveredEl(el)
    },
    [hoveredEl]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-toolbar]")) return
      e.preventDefault()
      e.stopPropagation()

      const overlayEl = overlayRef.current
      if (overlayEl) overlayEl.style.pointerEvents = "none"
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (overlayEl) overlayEl.style.pointerEvents = "auto"

      if (!el || el === document.body) return

      if (hoveredEl && !outlinedElementsRef.current.has(hoveredEl)) {
        ;(hoveredEl as HTMLElement).style.outline = ""
        ;(hoveredEl as HTMLElement).style.outlineOffset = ""
      }

      const originalOutline = (el as HTMLElement).style.outline
      outlinedElementsRef.current.set(el, originalOutline)
      ;(el as HTMLElement).style.outline = "3px solid red"
      ;(el as HTMLElement).style.outlineOffset = "2px"

      const selector = getSelector(el)
      const xpath = getXPath(el)
      const rect = el.getBoundingClientRect()

      setElements((prev) => [
        ...prev,
        {
          selector,
          xpath,
          tagName: el.tagName.toLowerCase(),
          textContent: (el.textContent || "").trim().slice(0, 60),
          boundingRect: {
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
          },
          note: "",
        },
      ])
      setHoveredEl(null)
    },
    [hoveredEl]
  )

  const handleUndo = useCallback(() => {
    setElements((prev) => {
      if (prev.length === 0) return prev
      const last = prev[prev.length - 1]
      const el = document.querySelector(last.selector)
      if (el && outlinedElementsRef.current.has(el)) {
        const original = outlinedElementsRef.current.get(el) || ""
        ;(el as HTMLElement).style.outline = original
        ;(el as HTMLElement).style.outlineOffset = ""
        outlinedElementsRef.current.delete(el)
      }
      return prev.slice(0, -1)
    })
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
      if (e.key === "z" && (e.ctrlKey || e.metaKey)) handleUndo()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onCancel, handleUndo])

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[100] cursor-crosshair select-none transition-opacity duration-200",
        entering ? "opacity-0" : "opacity-100"
      )}
      style={{ backgroundColor: "rgba(0,0,0,0.15)", pointerEvents: "auto" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Toolbar */}
      <div
        data-toolbar
        className="absolute top-0 right-0 left-0 z-[101] flex cursor-default items-center justify-between bg-blue-600 px-6 py-3 text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Crosshair className="size-5" />
          <span className="font-medium">
            Click on elements to highlight issues
          </span>
          <span className="rounded bg-blue-700/60 px-2 py-0.5 text-xs">
            Esc to cancel
          </span>
        </div>
        <div className="flex gap-2">
          {elements.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-white hover:bg-blue-700"
              onClick={handleUndo}
            >
              <Undo2 className="size-3.5" />
              Undo
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-blue-700"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-blue-700"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            onClick={() => onDone(elements)}
            disabled={elements.length === 0}
          >
            Done ({elements.length} element{elements.length !== 1 ? "s" : ""})
          </Button>
        </div>
      </div>

      {/* Hint when no elements selected */}
      {elements.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-black/60 px-8 py-6 text-white backdrop-blur-sm">
            <MousePointerClick className="size-8 opacity-80" />
            <p className="text-sm font-medium">
              Click on an element to select it
            </p>
            <p className="text-xs opacity-60">
              Elements highlight on hover, click to select
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Step Indicator ---

function StepIndicator({
  current,
  steps,
}: {
  current: number
  steps: string[]
}) {
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
              i < current
                ? "bg-blue-600 text-white"
                : i === current
                  ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {i < current ? <Check className="size-3.5" /> : i + 1}
          </div>
          <span
            className={cn(
              "hidden text-xs sm:inline",
              i === current
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="mx-1 size-3 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  )
}

// --- Annotate Step ---

function AnnotateStep({
  elements,
  onChange,
}: {
  elements: SelectedElement[]
  onChange: (index: number, note: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Describe what is wrong with each selected element.
      </p>
      {elements.map((el, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border p-3 transition-all hover:border-blue-300"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">
              Element: {getElementDisplayName(el.selector, el.tagName)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded bg-muted/50 px-2 py-1">
            <code className="text-[10px] text-muted-foreground break-all">
              {el.selector}
            </code>
            <code className="text-[10px] text-muted-foreground break-all">
              {el.xpath}
            </code>
          </div>
          <Input
            placeholder="What's wrong with this element?"
            value={el.note}
            onChange={(e) => onChange(i, e.target.value)}
            autoFocus={i === 0}
          />
        </div>
      ))}
    </div>
  )
}

// --- Details Step ---

function DetailsStep({
  type,
  setType,
  severity,
  setSeverity,
  title,
  setTitle,
  description,
  setDescription,
  email,
  setEmail,
}: {
  type: string
  setType: (v: string) => void
  severity: string
  setSeverity: (v: string) => void
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  email: string
  setEmail: (v: string) => void
}) {
  const isBugType = type === "bug"

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ticket-type" className="text-sm font-medium">
            Type
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="ticket-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ticketTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isBugType && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-severity" className="text-sm font-medium">
              Severity
            </Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger id="ticket-severity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
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
          Additional Details{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="ticket-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any extra context about the issue..."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ticket-email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="ticket-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>
    </div>
  )
}

// --- Review Step ---

function ReviewStep({
  elements,
  type,
  severity,
  title,
  description,
  pageUrl,
}: {
  elements: SelectedElement[]
  type: string
  severity: string
  title: string
  description: string
  pageUrl: string
}) {
  const typeLabel = ticketTypes.find((t) => t.value === type)?.label || type
  const severityLabel =
    severityLevels.find((s) => s.value === severity)?.label || severity

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border bg-muted/30 p-4">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Page</dt>
            <dd className="font-mono text-xs">{pageUrl}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium">{typeLabel}</dd>
          </div>
          {type === "bug" && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Severity</dt>
              <dd>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    severity === "critical" &&
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    severity === "high" &&
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    severity === "medium" &&
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    severity === "low" &&
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  )}
                >
                  {severityLabel}
                </span>
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Title</dt>
            <dd className="max-w-[260px] truncate font-medium">{title}</dd>
          </div>
          {description && (
            <div className="flex flex-col gap-1 pt-1">
              <dt className="text-muted-foreground">Details</dt>
              <dd className="whitespace-pre-wrap text-xs">{description}</dd>
            </div>
          )}
        </dl>
      </div>

      {elements.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Selected Elements ({elements.length})
          </p>
          {elements.map((el, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-medium">
                  {getElementDisplayName(el.selector, el.tagName)}
                </span>
                <code className="text-[10px] text-muted-foreground break-all">
                  {el.selector}
                </code>
                {el.note && <span className="text-sm">{el.note}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- Success Animation ---

function SuccessView({ ticketId }: { ticketId: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 py-8 transition-all duration-500",
        visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <Check className="size-7 text-green-600" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-foreground">
          Ticket Submitted
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We will look into it shortly.
        </p>
      </div>
      <code className="rounded bg-muted px-4 py-1.5 font-mono text-sm">
        #{ticketId}
      </code>
    </div>
  )
}

// --- Main Visual Bug Reporter ---

function VisualBugReporter({
  open,
  onOpenChange,
  startAtCapture,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  startAtCapture: boolean
}) {
  const pathname = usePathname()
  const { user } = useAuth()

  const [step, setStep] = useState<Step>(
    startAtCapture ? "capture" : "details"
  )
  const [elements, setElements] = useState<SelectedElement[]>([])
  const [type, setType] = useState("bug")
  const [severity, setSeverity] = useState(() =>
    getSuggestedSeverity(pathname)
  )
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const [submitting, setSubmitting] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  function reset() {
    setStep(startAtCapture ? "capture" : "details")
    setElements([])
    setType("bug")
    setSeverity(getSuggestedSeverity(pathname))
    setTitle("")
    setDescription("")
    setEmail(user?.email || "")
    setSubmittedId(null)
  }

  function handleClose() {
    onOpenChange(false)
    setTimeout(reset, 200)
  }

  function handleCaptureDone(newElements: SelectedElement[]) {
    setElements(newElements)
    if (newElements.length > 0) {
      setStep("annotate")
    } else {
      setStep("details")
    }
  }

  function handleCaptureSkip() {
    setElements([])
    setStep("details")
  }

  function handleAnnotationChange(index: number, note: string) {
    setElements((prev) =>
      prev.map((el, i) => (i === index ? { ...el, note } : el))
    )
  }

  function goToDetails() {
    if (!title) {
      setTitle(generateTitle(elements, type))
    }
    setStep("details")
  }

  function goToReview() {
    setStep("review")
  }

  async function handleSubmit() {
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const payload = {
        type,
        severity: type === "bug" ? severity : undefined,
        title: title.trim(),
        description: description.trim(),
        pageUrl: pathname,
        email,
        elements: elements.map((el) => ({
          selector: el.selector,
          xpath: el.xpath,
          tag: el.tagName,
          text: el.textContent,
          note: el.note,
        })),
        screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
        screenHeight: typeof window !== "undefined" ? window.innerHeight : 0,
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      const ticketId = result.data?.id?.slice(0, 8) || "submitted"
      setSubmittedId(ticketId)
      setStep("success")
      toast.success("Ticket submitted! We'll look into it.")
      setTimeout(handleClose, 2500)
    } catch {
      toast.error("Failed to submit ticket. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "capture" && open) {
    return (
      <CaptureOverlay
        onDone={handleCaptureDone}
        onCancel={handleClose}
        onSkip={handleCaptureSkip}
      />
    )
  }

  const stepLabels =
    elements.length > 0
      ? ["Capture", "Annotate", "Details", "Review"]
      : ["Details", "Review"]
  const currentStepIndex =
    elements.length > 0
      ? step === "annotate"
        ? 1
        : step === "details"
          ? 2
          : step === "review"
            ? 3
            : 0
      : step === "details"
        ? 0
        : 1

  return (
    <Dialog
      open={open && step !== "capture"}
      onOpenChange={(v) => {
        if (!v) handleClose()
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-blue-600 dark:text-blue-400" />
            <DialogTitle className="font-serif">
              {step === "success" ? "Thank You" : "Report an Issue"}
            </DialogTitle>
          </div>
          {step !== "success" && (
            <DialogDescription>
              Help us improve Scraper.bot by reporting what you see.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "success" && submittedId ? (
          <SuccessView ticketId={submittedId} />
        ) : (
          <>
            <StepIndicator current={currentStepIndex} steps={stepLabels} />

            <div className="min-h-[200px]">
              {step === "annotate" && (
                <AnnotateStep
                  elements={elements}
                  onChange={handleAnnotationChange}
                />
              )}
              {step === "details" && (
                <DetailsStep
                  type={type}
                  setType={setType}
                  severity={severity}
                  setSeverity={setSeverity}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  email={email}
                  setEmail={setEmail}
                />
              )}
              {step === "review" && (
                <ReviewStep
                  elements={elements}
                  type={type}
                  severity={severity}
                  title={title}
                  description={description}
                  pageUrl={pathname}
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                {step === "annotate" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setStep("capture")}
                  >
                    <ChevronLeft className="size-3.5" />
                    Re-capture
                  </Button>
                )}
                {step === "details" && elements.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setStep("annotate")}
                  >
                    <ChevronLeft className="size-3.5" />
                    Annotations
                  </Button>
                )}
                {step === "review" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setStep("details")}
                  >
                    <ChevronLeft className="size-3.5" />
                    Edit Details
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {step === "annotate" && (
                  <Button
                    className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={goToDetails}
                  >
                    Next
                    <ChevronRight className="size-3.5" />
                  </Button>
                )}
                {step === "details" && (
                  <Button
                    className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={goToReview}
                    disabled={!title.trim()}
                  >
                    Review
                    <Eye className="size-3.5" />
                  </Button>
                )}
                {step === "review" && (
                  <Button
                    className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                    {!submitting && <Check className="size-3.5" />}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// --- Exports ---

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <VisualBugReporter
        open={open}
        onOpenChange={setOpen}
        startAtCapture={true}
      />
    </>
  )
}

export function FloatingHelpButton() {
  const [mode, setMode] = useState<"visual" | "quick" | null>(null)

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50" data-tour="help-button">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Help menu"
            >
              <HelpCircle className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem
              onClick={() => setMode("visual")}
              className="gap-2"
            >
              <Crosshair className="size-4" />
              Report Issue (Visual)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setMode("quick")}
              className="gap-2"
            >
              <Zap className="size-4" />
              Quick Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                triggerTourReplay()
              }}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Replay Tutorial
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/docs" className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Documentation
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "?" })
                )
              }
            >
              <Keyboard className="size-4" />
              Keyboard Shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <VisualBugReporter
        open={mode !== null}
        onOpenChange={(v) => {
          if (!v) setMode(null)
        }}
        startAtCapture={mode === "visual"}
      />
    </>
  )
}

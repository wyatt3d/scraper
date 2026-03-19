"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  MousePointerClick,
  Eye,
  Globe,
  Sparkles,
  Loader2,
  Check,
  Zap,
  LayoutTemplate,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockTemplates } from "@/lib/mock-data"
import type { FlowMode } from "@/lib/types"
import { HelpTooltip } from "@/components/dashboard/help-tooltip"

const modeTooltips: Record<string, string> = {
  extract: "Pull structured data from web pages into JSON format",
  interact: "Automate browser actions like clicking, filling forms, and navigating",
  monitor: "Watch pages for changes and get notified when something updates",
}

const modeOptions = [
  {
    mode: "extract" as FlowMode,
    label: "Extract",
    description: "Scrape structured data from web pages. Extract text, prices, listings, and more into clean JSON.",
    icon: FileText,
    color: "border-border bg-muted",
    iconColor: "text-foreground",
    examples: ["Product listings", "Job postings", "Contact info"],
  },
  {
    mode: "interact" as FlowMode,
    label: "Interact",
    description: "Automate browser interactions like filling forms, clicking buttons, and navigating multi-step workflows.",
    icon: MousePointerClick,
    color: "border-purple-500 bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600",
    examples: ["Form submissions", "Login flows", "Multi-page checkout"],
  },
  {
    mode: "monitor" as FlowMode,
    label: "Monitor",
    description: "Watch pages for changes and get notified. Track prices, availability, new listings, and content updates.",
    icon: Eye,
    color: "border-amber-500 bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600",
    examples: ["Price tracking", "Stock alerts", "New listings"],
  },
]

export default function NewFlowPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedMode, setSelectedMode] = useState<FlowMode | null>(null)
  const [url, setUrl] = useState("")
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)

  const filteredTemplates = mockTemplates.filter(
    (t) => !selectedMode || t.mode === selectedMode
  )

  async function handleGenerate() {
    if (!selectedMode) {
      toast.error("Please select a mode first")
      return
    }
    if (!url && !prompt) {
      toast.error("Please enter a URL or describe what you want to scrape")
      return
    }
    setGenerating(true)
    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prompt ? prompt.slice(0, 60) : "New Flow",
          url: url || "https://example.com",
          mode: selectedMode,
          description: prompt || "",
          status: "draft",
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        toast.error(result.error || "Failed to create flow")
        setGenerating(false)
        return
      }
      const newId = result.data?.id || result.id
      if (newId) {
        toast.success("Flow created!")
        router.push(`/flows/${newId}`)
      } else {
        toast.error("Flow created but no ID returned")
        setGenerating(false)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create flow")
      setGenerating(false)
    }
  }

  async function handleTemplateSelect(templateId: string) {
    setGenerating(true)
    const template = filteredTemplates.find((t) => t.id === templateId)
    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template?.name || "New Flow",
          url: template?.url || url || "https://example.com",
          mode: template?.mode || selectedMode || "extract",
          description: template?.description || "",
          status: "draft",
          steps: template?.steps || [],
          outputSchema: template?.outputSchema || {},
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        toast.error(result.error || "Failed to create flow from template")
        setGenerating(false)
        return
      }
      const newId = result.data?.id || result.id
      if (newId) {
        toast.success("Flow created from template!")
        router.push(`/flows/${newId}`)
      } else {
        toast.error("Flow created but no ID returned")
        setGenerating(false)
      }
    } catch {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/flows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-crimson-text)] text-3xl font-bold tracking-tight">
            Create Flow
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Set up a new scraping flow in a few steps
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                step === s
                  ? "bg-foreground text-background"
                  : step > s
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                step === s ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s === 1 ? "Choose Mode" : s === 2 ? "Describe Task" : "Templates"}
            </span>
            {s < 3 && <div className="bg-border mx-2 h-px w-8" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            What type of flow do you want to create?
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {modeOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = selectedMode === opt.mode
              return (
                <Card
                  key={opt.mode}
                  className={cn(
                    "cursor-pointer border-2 transition-all hover:shadow-md",
                    isSelected ? opt.color : "border-transparent hover:border-border"
                  )}
                  onClick={() => setSelectedMode(opt.mode)}
                >
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg",
                        isSelected ? opt.color : "bg-muted"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", isSelected ? opt.iconColor : "text-muted-foreground")} />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold flex items-center">
                        {opt.label}
                        <HelpTooltip content={modeTooltips[opt.mode]} side="right" />
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {opt.examples.map((ex) => (
                        <Badge key={ex} variant="secondary" className="text-xs">
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-end pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedMode}
              onClick={() => setStep(2)}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Target URL</label>
            <div className="relative">
              <Globe className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="https://example.com/page-to-scrape"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Describe what you want to{" "}
              {selectedMode === "extract"
                ? "extract"
                : selectedMode === "interact"
                  ? "automate"
                  : "monitor"}
            </label>
            <Textarea
              placeholder={
                selectedMode === "extract"
                  ? "e.g., Extract all product names, prices, and ratings from the search results page. Include the product URL and availability status."
                  : selectedMode === "interact"
                    ? "e.g., Fill out the contact form with a name, email, and message. Submit it and capture the confirmation number."
                    : "e.g., Check the page every 6 hours for new listings. Alert me when a new property is posted under $100,000."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
            />
            <p className="text-muted-foreground text-xs">
              Be specific about the data fields, interactions, or changes you care about.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} disabled={generating}>
                Browse Templates
                <LayoutTemplate className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                disabled={generating}
                onClick={handleGenerate}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Flow...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Flow
                  </>
                )}
              </Button>
            </div>
            {generating && (
              <div className="mt-4 p-4 rounded-lg border bg-muted/50 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Creating your flow...</p>
                <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds</p>
              </div>
            )}
          </div>

          {generating && (
            <Card className="border-border bg-muted">
              <CardContent className="flex items-center gap-4 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Analyzing page and generating flow...</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    AI is inspecting the target URL and building optimized extraction steps
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Start from a template or build from scratch.
                {selectedMode && (
                  <> Showing templates for <span className="font-medium text-foreground">{selectedMode}</span> mode.</>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              className="cursor-pointer border-2 border-dashed transition-all hover:border-foreground hover:shadow-md"
              onClick={handleGenerate}
            >
              <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-crimson-text)] text-lg font-semibold">
                    Start from Scratch
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Build a custom flow with AI assistance
                  </p>
                </div>
              </CardContent>
            </Card>

            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer border-2 border-transparent transition-all hover:border-border hover:shadow-md"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.mode}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-crimson-text)] font-semibold">
                      {template.name}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {template.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {template.steps.length} steps &middot;{" "}
                    {Object.keys(template.outputSchema).length} output fields
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {generating && (
            <Card className="border-border bg-muted">
              <CardContent className="flex items-center gap-4 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Setting up your flow...</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Applying template and configuring steps
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

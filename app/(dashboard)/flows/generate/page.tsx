"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Wand2,
  CheckCircle2,
  Loader2,
  Globe,
  FileText,
  MousePointerClick,
  RotateCcw,
  Pencil,
  Rocket,
  Sparkles,
  Briefcase,
  Home,
  ShoppingCart,
  Newspaper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Step = "describe" | "generating" | "review"

interface GenerationStep {
  label: string
  done: boolean
}

interface ExtractionRule {
  field: string
  selector: string
  transform: string
}

interface FlowStep {
  id: string
  type: string
  label: string
  extractionRules?: ExtractionRule[]
}

interface GeneratedFlow {
  name: string
  description: string
  url: string
  mode: string
  steps: FlowStep[]
  outputSchema: Record<string, string>
}

const suggestedPrompts = [
  {
    icon: Briefcase,
    text: "Extract job listings from Indeed with salary and location",
  },
  {
    icon: Home,
    text: "Monitor Zillow for new properties under $500K in Austin",
  },
  {
    icon: Newspaper,
    text: "Scrape Hacker News front page stories with points and comments",
  },
  {
    icon: ShoppingCart,
    text: "Track competitor pricing on Amazon for wireless headphones",
  },
]

const generationStepLabels = [
  "Fetching target page...",
  "Analyzing page structure...",
  "Identifying data patterns...",
  "Generating extraction rules...",
  "Building flow definition...",
]

const stepTypeIcons: Record<string, typeof Globe> = {
  navigate: Globe,
  wait: Loader2,
  extract: FileText,
  click: MousePointerClick,
  fill: FileText,
  scroll: Globe,
  condition: Globe,
  loop: Globe,
}

export default function GenerateFlowPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("describe")
  const [description, setDescription] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [genSteps, setGenSteps] = useState<GenerationStep[]>(
    generationStepLabels.map((label) => ({ label, done: false }))
  )
  const [progress, setProgress] = useState(0)
  const [generatedFlow, setGeneratedFlow] = useState<GeneratedFlow | null>(null)
  const [flowName, setFlowName] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const animationTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    animationTimers.current.forEach(clearTimeout)
    animationTimers.current = []
  }, [])

  const completeAllSteps = useCallback(() => {
    clearTimers()
    setGenSteps(generationStepLabels.map((label) => ({ label, done: true })))
    setProgress(100)
  }, [clearTimers])

  const startProgressAnimation = useCallback(() => {
    setGenSteps(generationStepLabels.map((label) => ({ label, done: false })))
    setProgress(0)

    const stepInterval = 1200
    generationStepLabels.forEach((_, i) => {
      const timer = setTimeout(() => {
        setGenSteps((prev) =>
          prev.map((s, j) => (j <= i ? { ...s, done: true } : s))
        )
        setProgress(Math.min(90, Math.round(((i + 1) / generationStepLabels.length) * 90)))
      }, stepInterval * (i + 1))
      animationTimers.current.push(timer)
    })
  }, [])

  async function handleGenerate() {
    if (!description.trim()) return
    setStep("generating")
    startProgressAnimation()

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, description }),
      })
      const data = await res.json()

      if (data.error) {
        if (data.fallback) {
          // AI unavailable — create a basic flow directly
          toast.info("AI is temporarily unavailable. Creating flow with default settings.")
          const fallbackFlow = {
            name: description.slice(0, 60),
            description,
            url: targetUrl || "https://example.com",
            mode: "extract",
            steps: [
              { id: "s1", type: "navigate", label: "Go to target page" },
              { id: "s2", type: "wait", label: "Wait for page to load" },
              { id: "s3", type: "extract", label: "Extract data", extractionRules: [] },
            ],
            outputSchema: {},
          }
          completeAllSteps()
          setTimeout(() => {
            setGeneratedFlow(fallbackFlow)
            setFlowName(fallbackFlow.name)
            setStep("review")
          }, 400)
          return
        }
        toast.error(data.error)
        clearTimers()
        setStep("describe")
        return
      }

      completeAllSteps()
      setTimeout(() => {
        setGeneratedFlow(data.flow)
        setFlowName(data.flow.name || "Generated Flow")
        setStep("review")
      }, 400)
    } catch {
      toast.error("Failed to generate flow")
      clearTimers()
      setStep("describe")
    }
  }

  function handlePromptClick(text: string) {
    setDescription(text)
  }

  function handleRegenerate() {
    handleGenerate()
  }

  async function handleDeploy() {
    if (!generatedFlow) return
    setDeploying(true)

    try {
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: flowName,
          description: generatedFlow.description,
          url: generatedFlow.url,
          mode: generatedFlow.mode,
          status: "active",
          steps: generatedFlow.steps,
          outputSchema: generatedFlow.outputSchema,
        }),
      })
      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        setDeploying(false)
        return
      }

      toast.success("Flow deployed", {
        description: `"${flowName}" is now active.`,
      })
      router.push("/dashboard")
    } catch {
      toast.error("Failed to deploy flow")
      setDeploying(false)
    }
  }

  const outputSchemaEntries = generatedFlow
    ? Object.entries(generatedFlow.outputSchema || {})
    : []

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Generate Flow with AI
          </h1>
          <Badge className="bg-muted text-muted-foreground border-border gap-1">
            <Sparkles className="size-3" />
            Powered by Claude
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Describe what you want to scrape in plain English. Our AI will
          generate a complete extraction flow.
        </p>
      </div>

      {step === "describe" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Describe what you want to extract</Label>
            <Textarea
              id="description"
              rows={10}
              placeholder="I want to extract all product listings from Amazon search results, including the product name, price, star rating, number of reviews, and product URL. I need the data updated every 6 hours."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-url">Target URL (optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="target-url"
                placeholder="https://example.com/page-to-scrape"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!description.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            size="lg"
          >
            <Wand2 className="size-4" />
            Generate Flow
          </Button>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Suggested prompts
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <Card
                  key={prompt.text}
                  className="cursor-pointer transition-colors hover:border-blue-600/50 hover:bg-blue-600/5"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <prompt.icon className="size-5 shrink-0 text-blue-600 mt-0.5" />
                    <span className="text-sm">{prompt.text}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "generating" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Generating your flow...</CardTitle>
            <CardDescription>
              AI is analyzing your description and building the extraction flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />
            <div className="space-y-3">
              {genSteps.map((gs, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-opacity",
                    !gs.done &&
                      !genSteps.slice(0, i).every((s) => s.done) &&
                      "opacity-40"
                  )}
                >
                  {gs.done ? (
                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  ) : genSteps.slice(0, i).every((s) => s.done) ? (
                    <Loader2 className="size-5 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <div className="size-5 rounded-full border-2 border-muted shrink-0" />
                  )}
                  <span>{gs.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && generatedFlow && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editingName ? (
                    <Input
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      onBlur={() => setEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingName(false)
                      }}
                      className="font-serif text-xl font-bold h-auto py-1"
                      autoFocus
                    />
                  ) : (
                    <CardTitle
                      className="font-serif cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setEditingName(true)}
                    >
                      {flowName}
                      <Pencil className="inline size-3.5 ml-2 text-muted-foreground" />
                    </CardTitle>
                  )}
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Generated
                </Badge>
              </div>
              <CardDescription>
                Target: {generatedFlow.url}
              </CardDescription>
              {generatedFlow.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {generatedFlow.description}
                </p>
              )}
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Flow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedFlow.steps.map((flowStep, i) => {
                  const Icon = stepTypeIcons[flowStep.type] || Globe
                  return (
                    <div
                      key={flowStep.id || i}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex size-8 items-center justify-center rounded-md bg-blue-600/10 text-blue-600">
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">
                            {flowStep.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {flowStep.label}
                        </p>
                        {flowStep.extractionRules && flowStep.extractionRules.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {flowStep.extractionRules.map((rule) => (
                              <div key={rule.field} className="flex items-center gap-2 text-xs">
                                <span className="font-medium">{rule.field}</span>
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground">
                                  {rule.selector}
                                </code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        #{i + 1}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {outputSchemaEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Output Schema</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outputSchemaEntries.map(([field, type]) => (
                      <TableRow key={field}>
                        <TableCell className="font-medium">{field}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleRegenerate}>
              <RotateCcw className="size-4" />
              Regenerate
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/flows/new">
                <Pencil className="size-4" />
                Edit Flow
              </Link>
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={handleDeploy}
              disabled={deploying}
            >
              {deploying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {deploying ? "Deploying..." : "Deploy Now"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

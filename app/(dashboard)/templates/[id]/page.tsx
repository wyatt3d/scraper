"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe,
  MousePointer,
  PenLine,
  Search,
  Timer,
  Scroll,
  Camera,
  GitBranch,
  Repeat,
  Copy,
  Star,
  Download,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { StepType, FlowStep } from "@/lib/types"

interface Template {
  id: string
  name: string
  description: string
  category: string
  url: string
  difficulty: string
  rating: number
  useCount: number
  isFeatured: boolean
  steps: FlowStep[]
  outputSchema: Record<string, unknown>
}

function mapDbTemplate(row: Record<string, unknown>): Template {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || "",
    category: row.category as string,
    url: (row.url_pattern as string) || "",
    difficulty: (row.difficulty as string) || "beginner",
    rating: Number(row.rating) || 0,
    useCount: Number(row.use_count) || 0,
    isFeatured: Boolean(row.is_featured),
    steps: (row.steps as FlowStep[]) || [],
    outputSchema: (row.output_schema as Record<string, unknown>) || {},
  }
}

const categoryLabels: Record<string, string> = {
  "e-commerce": "E-commerce",
  "news": "News",
  "jobs": "Jobs",
  "social": "Social Media",
  "real-estate": "Real Estate",
  "food": "Food",
}

const categoryColors: Record<string, string> = {
  "e-commerce": "bg-muted text-foreground border-border",
  "jobs": "bg-violet-500/15 text-violet-600 border-violet-500/25 dark:text-violet-400",
  "real-estate": "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
  "news": "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  "social": "bg-pink-500/15 text-pink-600 border-pink-500/25 dark:text-pink-400",
  "food": "bg-orange-500/15 text-orange-600 border-orange-500/25 dark:text-orange-400",
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-muted text-foreground border-border",
  intermediate: "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  advanced: "bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400",
}

const stepIcons: Record<StepType, React.ComponentType<{ className?: string }>> = {
  navigate: Globe,
  click: MousePointer,
  fill: PenLine,
  extract: Search,
  wait: Timer,
  scroll: Scroll,
  screenshot: Camera,
  condition: GitBranch,
  loop: Repeat,
}

function formatUseCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((json) => {
        const rows = json.data || []
        const mapped = rows.map(mapDbTemplate)
        const found = mapped.find((t: Template) => t.id === id)
        setTemplate(found || null)
      })
      .catch(() => setTemplate(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm mt-2">Loading template...</p>
      </div>
    )
  }

  if (!template) {
    notFound()
  }

  const curlCommand = `curl -X POST https://scraper.bot/api/flows \\
  -H "Authorization: Bearer scr_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${template.id}",
    "url": "${template.url}"
  }'`

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/templates"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to templates
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("text-xs", categoryColors[template.category] || "")}>
            {categoryLabels[template.category] || template.category}
          </Badge>
          <Badge variant="outline" className={cn("text-xs capitalize", difficultyColors[template.difficulty] || "")}>
            {template.difficulty}
          </Badge>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i <= Math.round(template.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-300 dark:text-zinc-600"
                )}
              />
            ))}
            <span className="text-sm font-medium ml-1">{template.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
            <Download className="size-3.5" />
            {formatUseCount(template.useCount)} uses
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">{template.name}</h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          {template.description}
        </p>
      </div>

      {template.url && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">URL Pattern</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <code className="bg-muted flex-1 rounded-md px-3 py-2 text-sm font-mono truncate">
                {template.url}
              </code>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Steps</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {template.steps.map((step, i) => {
            const Icon = stepIcons[step.type] || Globe
            return (
              <div key={step.id} className="space-y-2">
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white font-medium shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="bg-muted flex size-8 items-center justify-center rounded-md shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-muted-foreground text-xs capitalize">{step.type}</p>
                    </div>

                    {step.selector && (step.type === "click" || step.type === "fill") && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Selector: </span>
                        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{step.selector}</code>
                      </div>
                    )}

                    {step.condition && step.type === "condition" && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Condition: </span>
                        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{step.condition}</code>
                      </div>
                    )}

                    {step.extractionRules && step.extractionRules.length > 0 && (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="h-7 text-[11px]">Field</TableHead>
                              <TableHead className="h-7 text-[11px]">Selector</TableHead>
                              <TableHead className="h-7 text-[11px]">Transform</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {step.extractionRules.map((rule) => (
                              <TableRow key={rule.field}>
                                <TableCell className="py-1.5 font-mono text-xs font-medium">{rule.field}</TableCell>
                                <TableCell className="py-1.5 font-mono text-xs text-muted-foreground truncate max-w-[200px]">{rule.selector}</TableCell>
                                <TableCell className="py-1.5 text-xs text-muted-foreground">{rule.transform || "text"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {step.children && step.children.length > 0 && (
                      <div className="ml-4 border-l-2 border-muted pl-3 space-y-1">
                        {step.children.map((child) => {
                          const ChildIcon = stepIcons[child.type] || Globe
                          return (
                            <div key={child.id} className="flex items-center gap-2 text-sm">
                              <ChildIcon className="size-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{child.label}</span>
                              {child.selector && (
                                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">{child.selector}</code>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Output Schema</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8 text-xs">Field</TableHead>
                <TableHead className="h-8 text-xs">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(template.outputSchema).map(([field, type]) => (
                <TableRow key={field}>
                  <TableCell className="py-2 font-mono text-sm font-medium">{field}</TableCell>
                  <TableCell className="text-muted-foreground py-2 text-sm">{String(type)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">API Endpoint</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {curlCommand}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(curlCommand)
                toast.success("Copied to clipboard")
              }}
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pb-8">
        <Button asChild size="lg" className="flex-1 gap-2">
          <Link href={`/flows/new?template=${template.id}`}>
            Use Template
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

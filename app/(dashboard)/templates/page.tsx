"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Eye,
  Globe,
  MousePointer,
  PenLine,
  Search,
  Timer,
  ArrowRight,
  Scroll,
  Camera,
  GitBranch,
  Repeat,
  Share2,
  Star,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { FlowStep } from "@/lib/types"

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

const categories = [
  "All",
  "e-commerce",
  "news",
  "jobs",
  "social",
  "real-estate",
  "food",
]

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

function formatUseCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((json) => {
        const rows = json.data || []
        setTemplates(rows.map(mapDbTemplate))
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = templates.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Start with a pre-built template and customize it for your needs.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="h-8 rounded-full text-xs"
          >
            {cat === "All" ? cat : categoryLabels[cat] || cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm mt-2">Loading templates...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground text-sm">
            {templates.length === 0 ? "No templates yet." : "No templates match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const schemaFields = Object.keys(template.outputSchema).slice(0, 3)

            return (
              <Card
                key={template.id}
                className={cn(
                  "flex flex-col justify-between py-0 overflow-hidden",
                  template.isFeatured && "border-foreground/20"
                )}
              >
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn("text-[10px]", categoryColors[template.category] || "")}>
                        {categoryLabels[template.category] || template.category}
                      </Badge>
                      {template.isFeatured && (
                        <Badge className="text-[10px] bg-blue-600 text-white border-blue-600 gap-0.5">
                          <Sparkles className="size-2.5" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] capitalize", difficultyColors[template.difficulty] || "")}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-semibold leading-tight mt-3">
                    {template.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-snug line-clamp-2">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i <= Math.round(template.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300 dark:text-zinc-600"
                          )}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Download className="size-3" />
                      {formatUseCount(template.useCount)} uses
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {schemaFields.map((field) => (
                      <span
                        key={field}
                        className="bg-muted inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-medium"
                      >
                        {field}
                      </span>
                    ))}
                    {Object.keys(template.outputSchema).length > 3 && (
                      <span className="text-muted-foreground text-[10px] flex items-center px-1">
                        +{Object.keys(template.outputSchema).length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="flex-1 gap-1.5">
                      <Link href={`/flows/new?template=${template.id}`}>
                        Use Template
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://scraper.bot/templates/${template.id}`)
                        toast.success("Link copied to clipboard")
                      }}
                    >
                      <Share2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/templates/${template.id}`}>
                        <Eye className="size-3.5" />
                        Preview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

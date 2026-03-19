"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { mockTemplates } from "@/lib/mock-data"
import type { FlowTemplate, StepType } from "@/lib/types"

const categories = [
  "All",
  "E-commerce",
  "Jobs",
  "Real Estate",
  "Content",
  "Social Media",
  "Sales",
  "Automation",
]

const categoryColors: Record<string, string> = {
  "E-commerce": "bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400",
  "Jobs": "bg-violet-500/15 text-violet-600 border-violet-500/25 dark:text-violet-400",
  "Real Estate": "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
  "Content": "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  "Social Media": "bg-pink-500/15 text-pink-600 border-pink-500/25 dark:text-pink-400",
  "Sales": "bg-orange-500/15 text-orange-600 border-orange-500/25 dark:text-orange-400",
  "Automation": "bg-cyan-500/15 text-cyan-600 border-cyan-500/25 dark:text-cyan-400",
}

const modeColors: Record<string, string> = {
  extract: "bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400",
  interact: "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  monitor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
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

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null)

  const filtered = mockTemplates.filter((t) => {
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
            {cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground text-sm">No templates match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Card key={template.id} className="flex flex-col justify-between py-0 overflow-hidden">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-[10px]", categoryColors[template.category] || "")}>
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] capitalize", modeColors[template.mode] || "")}>
                    {template.mode}
                  </Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold leading-tight mt-3">
                  {template.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-snug">
                  {template.description}
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
                    Output Schema
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(template.outputSchema).map(([field, type]) => (
                      <span
                        key={field}
                        className="bg-muted inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px]"
                      >
                        <span className="font-medium">{field}</span>
                        <span className="text-muted-foreground">{String(type)}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="flex-1 gap-1.5">
                    <Link href="/flows/new">
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
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="size-3.5" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-[10px]", categoryColors[selectedTemplate.category] || "")}>
                  {selectedTemplate.category}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px] capitalize", modeColors[selectedTemplate.mode] || "")}>
                  {selectedTemplate.mode}
                </Badge>
              </div>
              <DialogTitle className="font-serif text-xl">{selectedTemplate.name}</DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[400px]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Steps</h4>
                  <div className="space-y-2">
                    {selectedTemplate.steps.map((step, i) => {
                      const Icon = stepIcons[step.type] || Globe
                      return (
                        <div
                          key={step.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                            <Icon className="size-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{step.label}</p>
                            <p className="text-muted-foreground text-xs capitalize">{step.type}</p>
                          </div>
                          <span className="text-muted-foreground text-xs">#{i + 1}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Output Schema</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 text-xs">Field</TableHead>
                        <TableHead className="h-8 text-xs">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(selectedTemplate.outputSchema).map(([field, type]) => (
                        <TableRow key={field}>
                          <TableCell className="py-2 font-mono text-sm">{field}</TableCell>
                          <TableCell className="text-muted-foreground py-2 text-sm">
                            {String(type)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>

            <Button asChild className="w-full gap-1.5">
              <Link href="/flows/new">
                Use This Template
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

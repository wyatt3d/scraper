"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Wand2,
  CheckCircle2,
  Loader2,
  Globe,
  FileText,
  MousePointerClick,
  Eye,
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

type Step = "describe" | "generating" | "review"

interface GenerationStep {
  label: string
  delay: number
  done: boolean
}

interface FlowStep {
  type: "navigate" | "wait" | "extract" | "paginate"
  selector?: string
  description: string
}

interface SchemaField {
  name: string
  type: string
  selector: string
}

interface GeneratedFlow {
  name: string
  url: string
  steps: FlowStep[]
  schema: SchemaField[]
  exampleData: Record<string, string>[]
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

const generationSteps: GenerationStep[] = [
  { label: "Analyzing target URL...", delay: 1000, done: false },
  { label: "Identifying page structure...", delay: 1500, done: false },
  { label: "Generating CSS selectors...", delay: 1000, done: false },
  { label: "Building extraction flow...", delay: 1000, done: false },
  { label: "Optimizing for reliability...", delay: 500, done: false },
]

function getFlowForDescription(description: string): GeneratedFlow {
  const lower = description.toLowerCase()

  if (lower.includes("job")) {
    return {
      name: "Indeed Job Listings Extractor",
      url: "https://www.indeed.com/jobs?q=software+engineer",
      steps: [
        { type: "navigate", description: "Navigate to Indeed search results" },
        { type: "wait", selector: ".job_seen_beacon", description: "Wait for job cards to load" },
        { type: "extract", selector: ".job_seen_beacon", description: "Extract job listing data" },
        { type: "paginate", selector: "a[data-testid='pagination-page-next']", description: "Navigate to next page" },
      ],
      schema: [
        { name: "title", type: "string", selector: ".jobTitle span" },
        { name: "company", type: "string", selector: ".companyName" },
        { name: "location", type: "string", selector: ".companyLocation" },
        { name: "salary", type: "string", selector: ".salary-snippet-container" },
        { name: "description", type: "string", selector: ".job-snippet" },
        { name: "url", type: "url", selector: ".jobTitle a[href]" },
      ],
      exampleData: [
        { title: "Senior Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$150,000 - $200,000", description: "We are looking for an experienced...", url: "https://indeed.com/jobs/123" },
        { title: "Full Stack Developer", company: "StartupXYZ", location: "Remote", salary: "$120,000 - $160,000", description: "Join our growing team to build...", url: "https://indeed.com/jobs/456" },
        { title: "Backend Engineer", company: "DataFlow Inc", location: "Austin, TX", salary: "$130,000 - $175,000", description: "Design and implement scalable...", url: "https://indeed.com/jobs/789" },
      ],
    }
  }

  if (lower.includes("property") || lower.includes("real estate") || lower.includes("zillow")) {
    return {
      name: "Zillow Property Monitor",
      url: "https://www.zillow.com/austin-tx/",
      steps: [
        { type: "navigate", description: "Navigate to Zillow search results" },
        { type: "wait", selector: "article[data-test='property-card']", description: "Wait for property cards to load" },
        { type: "extract", selector: "article[data-test='property-card']", description: "Extract property listing data" },
        { type: "paginate", selector: "a[rel='next']", description: "Navigate to next page" },
      ],
      schema: [
        { name: "address", type: "string", selector: "address[data-test='property-card-addr']" },
        { name: "price", type: "number", selector: "span[data-test='property-card-price']" },
        { name: "beds", type: "number", selector: "ul.StyledPropertyCardHomeDetailsList li:nth-child(1)" },
        { name: "baths", type: "number", selector: "ul.StyledPropertyCardHomeDetailsList li:nth-child(2)" },
        { name: "sqft", type: "number", selector: "ul.StyledPropertyCardHomeDetailsList li:nth-child(3)" },
        { name: "url", type: "url", selector: "a.property-card-link[href]" },
      ],
      exampleData: [
        { address: "1234 Oak Hill Dr, Austin, TX", price: "$425,000", beds: "3", baths: "2", sqft: "1,850", url: "https://zillow.com/homedetails/123" },
        { address: "5678 Riverside Blvd, Austin, TX", price: "$389,000", beds: "2", baths: "2", sqft: "1,400", url: "https://zillow.com/homedetails/456" },
        { address: "9012 Barton Creek Ln, Austin, TX", price: "$475,000", beds: "4", baths: "3", sqft: "2,200", url: "https://zillow.com/homedetails/789" },
      ],
    }
  }

  if (lower.includes("product") || lower.includes("price") || lower.includes("amazon")) {
    return {
      name: "Amazon Product Monitor",
      url: "https://www.amazon.com/s?k=wireless+headphones",
      steps: [
        { type: "navigate", description: "Navigate to Amazon search results" },
        { type: "wait", selector: "div[data-component-type='s-search-result']", description: "Wait for product grid to load" },
        { type: "extract", selector: "div[data-component-type='s-search-result']", description: "Extract product data from each card" },
        { type: "paginate", selector: "a.s-pagination-next", description: "Navigate to next page of results" },
      ],
      schema: [
        { name: "name", type: "string", selector: "h2 a span" },
        { name: "price", type: "number", selector: ".a-price .a-offscreen" },
        { name: "rating", type: "number", selector: "span.a-icon-alt" },
        { name: "reviews", type: "number", selector: "span.a-size-base.s-underline-text" },
        { name: "url", type: "url", selector: "h2 a.a-link-normal[href]" },
      ],
      exampleData: [
        { name: "Sony WH-1000XM5 Wireless Headphones", price: "$278.00", rating: "4.6", reviews: "12,453", url: "https://amazon.com/dp/B09XS7JWHH" },
        { name: "Apple AirPods Max", price: "$449.99", rating: "4.7", reviews: "8,291", url: "https://amazon.com/dp/B08PZHYWJS" },
        { name: "Bose QuietComfort Ultra", price: "$329.00", rating: "4.5", reviews: "6,102", url: "https://amazon.com/dp/B0CCZ1L489" },
      ],
    }
  }

  return {
    name: "Web Data Extractor",
    url: "https://example.com",
    steps: [
      { type: "navigate", description: "Navigate to target page" },
      { type: "wait", selector: "main", description: "Wait for main content to load" },
      { type: "extract", selector: ".item, article, tr", description: "Extract data from repeated elements" },
    ],
    schema: [
      { name: "title", type: "string", selector: "h2, h3, .title" },
      { name: "description", type: "string", selector: "p, .description" },
      { name: "link", type: "url", selector: "a[href]" },
      { name: "date", type: "string", selector: "time, .date" },
    ],
    exampleData: [
      { title: "Item 1", description: "Description of the first item", link: "https://example.com/1", date: "2025-03-19" },
      { title: "Item 2", description: "Description of the second item", link: "https://example.com/2", date: "2025-03-18" },
      { title: "Item 3", description: "Description of the third item", link: "https://example.com/3", date: "2025-03-17" },
    ],
  }
}

const stepTypeIcons: Record<string, typeof Globe> = {
  navigate: Globe,
  wait: Loader2,
  extract: FileText,
  paginate: MousePointerClick,
}

export default function GenerateFlowPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("describe")
  const [description, setDescription] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [genSteps, setGenSteps] = useState<GenerationStep[]>(
    generationSteps.map((s) => ({ ...s }))
  )
  const [progress, setProgress] = useState(0)
  const [generatedFlow, setGeneratedFlow] = useState<GeneratedFlow | null>(null)
  const [flowName, setFlowName] = useState("")
  const [editingName, setEditingName] = useState(false)

  const runGeneration = useCallback(() => {
    setStep("generating")
    setGenSteps(generationSteps.map((s) => ({ ...s, done: false })))
    setProgress(0)

    const totalDelay = generationSteps.reduce((sum, s) => sum + s.delay, 0)
    let elapsed = 0

    generationSteps.forEach((gs, i) => {
      elapsed += gs.delay
      const currentElapsed = elapsed
      setTimeout(() => {
        setGenSteps((prev) =>
          prev.map((s, j) => (j <= i ? { ...s, done: true } : s))
        )
        setProgress(Math.round((currentElapsed / totalDelay) * 100))
      }, currentElapsed)
    })

    setTimeout(() => {
      const flow = getFlowForDescription(description)
      setGeneratedFlow(flow)
      setFlowName(flow.name)
      setStep("review")
    }, totalDelay + 300)
  }, [description])

  function handleGenerate() {
    if (!description.trim()) return
    runGeneration()
  }

  function handlePromptClick(text: string) {
    setDescription(text)
  }

  function handleRegenerate() {
    runGeneration()
  }

  function handleDeploy() {
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Generate Flow with AI
          </h1>
          <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 dark:text-blue-400 gap-1">
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
                      key={i}
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
                          {flowStep.selector && (
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                              {flowStep.selector}
                            </code>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {flowStep.description}
                        </p>
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
                    <TableHead>Selector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedFlow.schema.map((field) => (
                    <TableRow key={field.name}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {field.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {field.selector}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Example Output</CardTitle>
              <CardDescription>
                Preview of extracted data based on the generated schema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {generatedFlow.schema.map((field) => (
                        <TableHead key={field.name}>{field.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedFlow.exampleData.map((row, i) => (
                      <TableRow key={i}>
                        {generatedFlow.schema.map((field) => (
                          <TableCell
                            key={field.name}
                            className="text-sm max-w-[200px] truncate"
                          >
                            {row[field.name] || "--"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

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
            >
              <Rocket className="size-4" />
              Deploy Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

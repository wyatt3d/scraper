import type { Metadata } from "next"
import Link from "next/link"
import { Rocket, Layers, Code, BookOpen, LayoutTemplate, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation",
}

const sections = [
  { title: "Quickstart", description: "Get up and running in under 5 minutes", href: "/docs/quickstart", icon: Rocket },
  { title: "Concepts", description: "Understand Flows, Runs, and Extraction", href: "/docs/concepts", icon: Layers },
  { title: "API Reference", description: "Full REST API documentation", href: "/docs/api-reference", icon: Code },
  { title: "Guides", description: "Step-by-step tutorials for common tasks", href: "/docs/guides", icon: BookOpen },
  { title: "Templates", description: "Pre-built flows for popular use cases", href: "/docs/templates", icon: LayoutTemplate },
]

const concepts = [
  { title: "Flows", description: "Define multi-step scraping workflows with selectors, conditions, and loops." },
  { title: "Runs", description: "Each execution of a Flow produces a Run with logs, extracted data, and cost tracking." },
  { title: "Extraction", description: "One-shot extraction API for instant structured data from any URL." },
  { title: "Monitoring", description: "Track changes over time with scheduled runs and alerts on detected differences." },
  { title: "API", description: "Programmatic access to all platform features via REST API with key-based auth." },
]

export default function DocsOverview() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Scraper Documentation</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Learn how to build, deploy, and manage production-grade web scraping workflows.
          From one-shot extraction to scheduled monitoring pipelines, Scraper handles it all.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-2">What is Scraper?</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Scraper is an AI-powered web scraping and automation platform. It combines deterministic
          flow-based scraping with intelligent extraction to turn any website into a structured API.
          Define your scraping logic as a Flow, schedule it, and receive clean structured data
          via webhooks or our REST API.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-6">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3 mb-2">
                <section.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold mb-6">Key Concepts</h2>
        <div className="space-y-4">
          {concepts.map((concept) => (
            <div key={concept.title} className="flex gap-4 items-start">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold">{concept.title}</h3>
                <p className="text-sm text-muted-foreground">{concept.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on web scraping, automation, and data extraction from the Scraper.bot team.",
}

const articles = [
  {
    slug: "complete-guide-web-scraping-2026",
    title: "The Complete Guide to Web Scraping in 2026",
    date: "March 15, 2026",
    author: "Scraper.bot Team",
    summary:
      "Covers modern scraping techniques, legal considerations, browserless vs headless approaches, and best practices for production-grade data extraction.",
    tags: ["Guide", "Web Scraping"],
    readingTime: "12 min read",
  },
  {
    slug: "self-healing-web-scrapers-ai",
    title: "Building Self-Healing Web Scrapers with AI",
    date: "March 10, 2026",
    author: "Scraper.bot Team",
    summary:
      "How AI-powered selector mapping adapts to website changes automatically, eliminating the #1 cause of scraper maintenance.",
    tags: ["AI", "Engineering"],
    readingTime: "8 min read",
  },
  {
    slug: "manual-data-entry-to-automated-pipelines",
    title: "From Manual Data Entry to Automated Pipelines: A Case Study",
    date: "March 5, 2026",
    author: "Scraper.bot Team",
    summary:
      "How a real estate team automated their auction monitoring workflow, saving 20+ hours per week and never missing a listing again.",
    tags: ["Case Study", "Real Estate"],
    readingTime: "6 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/blog"
                className="text-foreground font-medium transition-colors"
              >
                Blog
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif font-black text-4xl md:text-5xl tracking-tight mb-4">
            Scraper.bot Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights on web scraping, automation, and data extraction.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
              <article className="rounded-xl border border-border p-8 transition-colors hover:bg-accent/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <time>{article.date}</time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readingTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

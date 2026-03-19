import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  MousePointerClick,
  Braces,
  Globe,
  Bot,
  Repeat,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free Web Scraping Tools",
  description:
    "Free, no-signup-required web scraping tools. CSS Selector Tester, JSON Formatter, HTTP Header Inspector, robots.txt Analyzer, XPath to CSS Converter, and Cron Expression Builder.",
  keywords: [
    "free web scraping tools",
    "css selector tester",
    "json formatter",
    "http header inspector",
    "robots.txt analyzer",
    "xpath to css converter",
    "cron expression builder",
  ],
}

const tools = [
  {
    title: "CSS Selector Tester",
    description:
      "Test CSS selectors against any HTML. Paste HTML, write a selector, see matches highlighted.",
    href: "/tools/selector-tester",
    icon: MousePointerClick,
  },
  {
    title: "JSON Formatter",
    description:
      "Paste raw JSON to format, validate, and minify. Supports large payloads.",
    href: "/tools/json-formatter",
    icon: Braces,
  },
  {
    title: "HTTP Header Inspector",
    description:
      "Enter a URL to see its HTTP response headers, status code, and redirect chain.",
    href: "/tools/headers",
    icon: Globe,
  },
  {
    title: "robots.txt Analyzer",
    description:
      "Check any website's robots.txt to see what can and can't be scraped.",
    href: "/tools/robots-analyzer",
    icon: Bot,
  },
  {
    title: "XPath to CSS Converter",
    description:
      "Convert XPath expressions to CSS selectors and vice versa.",
    href: "/tools/xpath-converter",
    icon: Repeat,
  },
  {
    title: "Cron Expression Builder",
    description:
      "Build and test cron expressions visually. See the next 5 run times.",
    href: "/tools/cron-builder",
    icon: Clock,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link href="/tools">
              <Badge variant="secondary">Free Tools</Badge>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">
            Free Web Scraping Tools
          </h1>
          <p className="text-muted-foreground text-lg">
            No sign-up required. Use these tools instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-blue-600/40">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4">
                    <tool.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="font-serif text-lg font-semibold mb-2">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {tool.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                  >
                    Try it free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by <span className="font-serif font-semibold">Scraper<span className="text-blue-600 dark:text-blue-400">.bot</span></span>
          </p>
          <Link href="/pricing">
            <Button variant="default" size="lg">
              Need more power? Sign up for full access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

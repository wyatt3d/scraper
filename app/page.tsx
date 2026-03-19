"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { TrustedBy } from "@/components/landing/trusted-by"
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Bell,
  MessageSquareText,
  Workflow,
  Bot,
  Clock,
  Users,
  Code,
  Twitter,
  Linkedin,
  Github,
  Menu,
} from "lucide-react"

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav aria-label="Main navigation" className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
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

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="size-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetTitle className="font-serif">Navigation</SheetTitle>
                  <nav className="flex flex-col gap-4 mt-6">
                    <a href="#features" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
                      Features
                    </a>
                    <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
                      How It Works
                    </a>
                    <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
                      Pricing
                    </a>
                    <Link href="/docs" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
                      Docs
                    </Link>
                    <hr className="border-border" />
                    <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Get Started Free
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
      <section aria-labelledby="hero-heading" className="animate-fade-in py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 id="hero-heading" className="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-balance mb-6 text-foreground">
              Turn Any Website Into a{" "}
              <span className="text-blue-600">Structured API</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-10 leading-relaxed max-w-3xl mx-auto">
              Describe what you need in plain English. Get a live, deterministic API endpoint in minutes. No browser infrastructure, no maintenance, no code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  View Documentation
                </Button>
              </Link>
            </div>

            {/* Terminal mockup */}
            <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border" role="img" aria-label="Example API request and response in a terminal">
              <div className="bg-zinc-900 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-zinc-400 text-sm font-mono">Terminal</span>
              </div>
              <div className="bg-zinc-950 p-6 text-left font-mono text-sm leading-relaxed">
                <p className="text-zinc-400">$ curl -X POST https://api.scraper.dev/v1/extract \</p>
                <p className="text-zinc-400 pl-4">-H &quot;Authorization: Bearer scr_live_...&quot; \</p>
                <p className="text-zinc-400 pl-4">-d &apos;&#123;&quot;url&quot;: &quot;https://example.com/products&quot;,</p>
                <p className="text-zinc-400 pl-8">&quot;prompt&quot;: &quot;Extract all product names and prices&quot;&#125;&apos;</p>
                <p className="mt-4 text-green-400">&#123;</p>
                <p className="text-green-400 pl-4">&quot;status&quot;: &quot;success&quot;,</p>
                <p className="text-green-400 pl-4">&quot;data&quot;: [</p>
                <p className="text-green-400 pl-8">&#123; &quot;name&quot;: &quot;Widget Pro&quot;, &quot;price&quot;: &quot;$29.99&quot; &#125;,</p>
                <p className="text-green-400 pl-8">&#123; &quot;name&quot;: &quot;Widget Ultra&quot;, &quot;price&quot;: &quot;$49.99&quot; &#125;</p>
                <p className="text-green-400 pl-4">],</p>
                <p className="text-green-400 pl-4">&quot;endpoint&quot;: &quot;/v1/flows/f_3kx9m2/run&quot;</p>
                <p className="text-green-400">&#125;</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-muted-foreground text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By + Stats */}
      <TrustedBy />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Go from idea to production API in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Describe",
                description: "Tell us the URL and what data you need in plain English. No selectors, no XPath, no code.",
                icon: MessageSquareText,
              },
              {
                step: "2",
                title: "Generate",
                description: "Our AI builds a deterministic extraction flow and creates a live REST API endpoint for you.",
                icon: Zap,
              },
              {
                step: "3",
                title: "Integrate",
                description: "Use your REST API, install our SDK, or connect via webhook. Data flows in real time.",
                icon: Code,
              },
            ].map((item) => (
              <Card key={item.step} className="animate-slide-up border-border text-center relative pt-12">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-serif font-black text-xl shadow-lg">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="font-serif font-bold text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Everything You Need to Automate the Web
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
              A complete platform for structured data extraction, browser automation, and API generation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Structured Data Extraction",
                description: "Extract clean, typed JSON from any webpage with AI-powered selectors.",
                icon: Globe,
              },
              {
                title: "Multi-Step Browser Automation",
                description: "Navigate, click, fill forms, and handle pagination automatically.",
                icon: Workflow,
              },
              {
                title: "Change Monitoring & Alerts",
                description: "Watch pages for changes and get instant notifications when data updates.",
                icon: Bell,
              },
              {
                title: "Natural Language Flow Builder",
                description: "Describe your workflow in plain English. We build the automation.",
                icon: MessageSquareText,
              },
              {
                title: "Deterministic API Endpoints",
                description: "Every flow becomes a versioned, cacheable REST endpoint you can depend on.",
                icon: Code,
              },
              {
                title: "Anti-Bot & Session Handling",
                description: "Built-in proxy rotation, CAPTCHA solving, and session management.",
                icon: Shield,
              },
              {
                title: "Scheduling & Cron Jobs",
                description: "Run flows on any schedule. Minute-level granularity, zero infrastructure.",
                icon: Clock,
              },
              {
                title: "Team Collaboration & Webhooks",
                description: "Share flows across your team. Push data to Slack, Discord, or any webhook.",
                icon: Users,
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="font-serif font-bold text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Paste any URL, describe the data you need, and get structured JSON back instantly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-xl border border-border shadow-lg p-6 mb-6">
              <div className="flex gap-3">
                <Input
                  placeholder="https://news.ycombinator.com"
                  className="flex-1 h-12 text-base"
                  readOnly
                  defaultValue="https://news.ycombinator.com"
                  aria-label="URL to scrape"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
                  onClick={() => setShowDemo((prev) => !prev)}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Extract
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Prompt: &quot;Get the top 5 story titles, URLs, and point counts&quot;</p>
            </div>

            {showDemo && (
              <div className="rounded-xl overflow-hidden border border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between">
                  <span className="text-zinc-400 text-sm font-mono">Response - 200 OK - 1.2s</span>
                  <span className="text-xs text-green-400 font-mono">application/json</span>
                </div>
                <div className="bg-zinc-950 p-6 font-mono text-sm leading-relaxed">
                  <p className="text-green-400">&#123;</p>
                  <p className="text-green-400 pl-4">&quot;data&quot;: [</p>
                  <p className="text-green-400 pl-8">&#123;</p>
                  <p className="text-green-400 pl-12">&quot;title&quot;: &quot;Show HN: Open-source web scraping API&quot;,</p>
                  <p className="text-green-400 pl-12">&quot;url&quot;: &quot;https://github.com/example/scraper&quot;,</p>
                  <p className="text-green-400 pl-12">&quot;points&quot;: 342</p>
                  <p className="text-green-400 pl-8">&#125;,</p>
                  <p className="text-green-400 pl-8">&#123;</p>
                  <p className="text-green-400 pl-12">&quot;title&quot;: &quot;Why deterministic scraping beats LLM-only&quot;,</p>
                  <p className="text-green-400 pl-12">&quot;url&quot;: &quot;https://blog.example.com/deterministic&quot;,</p>
                  <p className="text-green-400 pl-12">&quot;points&quot;: 287</p>
                  <p className="text-green-400 pl-8">&#125;,</p>
                  <p className="text-zinc-600 pl-8">// ... 3 more results</p>
                  <p className="text-green-400 pl-4">],</p>
                  <p className="text-green-400 pl-4">&quot;meta&quot;: &#123; &quot;total&quot;: 5, &quot;cached&quot;: false &#125;</p>
                  <p className="text-green-400">&#125;</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif font-bold text-xl">Free</CardTitle>
                <CardDescription>For side projects and experimentation</CardDescription>
                <div className="mt-4">
                  <span className="font-serif font-black text-4xl">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {["100 runs/month", "3 flows", "Community support", "REST API access", "7-day data retention"].map((f) => (
                    <li key={f} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button variant="outline" className="w-full bg-transparent">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-blue-600 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <CardHeader>
                <CardTitle className="font-serif font-bold text-xl">Pro</CardTitle>
                <CardDescription>For teams shipping production integrations</CardDescription>
                <div className="mt-4">
                  <span className="font-serif font-black text-4xl">$29</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {[
                    "5,000 runs/month",
                    "Unlimited flows",
                    "Priority support",
                    "All integrations",
                    "30-day data retention",
                    "Webhooks & SDKs",
                  ].map((f) => (
                    <li key={f} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-serif font-bold text-xl">Enterprise</CardTitle>
                <CardDescription>For organizations with custom requirements</CardDescription>
                <div className="mt-4">
                  <span className="font-serif font-black text-4xl">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited runs",
                    "Unlimited flows",
                    "Dedicated support & SLA",
                    "On-premise option",
                    "Custom data retention",
                    "SSO & audit logs",
                  ].map((f) => (
                    <li key={f} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="mailto:sales@scraper.bot">
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Sales
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Our Users Say */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Join teams using Scraper.bot to replace fragile scrapers with reliable, AI-generated APIs.
            </p>
            <p className="text-muted-foreground">
              We are collecting testimonials from early users. Want to share your story?{" "}
              <a href="mailto:hello@scraper.bot" className="text-blue-600 hover:underline">
                Get in touch
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="how-it-works">
                <AccordionTrigger className="text-base font-semibold">
                  How does Scraper.bot work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Scraper.bot follows a simple three-step flow: Describe, Generate, and Integrate. First, you describe the data you need in plain English along with the target URL. Our AI then generates a deterministic extraction flow and creates a live REST API endpoint. Finally, you integrate the endpoint into your app using our REST API, SDKs, or webhooks. No selectors, no XPath, no code required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-code">
                <AccordionTrigger className="text-base font-semibold">
                  Do I need to write code?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  No. You can build and manage scraping flows entirely through our dashboard using natural language. Just describe what data you need and from which website. That said, we also provide a full REST API and SDKs for developers who prefer programmatic control over their workflows.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="difference">
                <AccordionTrigger className="text-base font-semibold">
                  How is this different from traditional web scrapers?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Traditional scrapers require you to manage browser infrastructure, write brittle CSS/XPath selectors, and deal with constant breakages. Scraper.bot generates deterministic API endpoints that return structured data without any browser overhead on your side. Our self-healing selectors automatically adapt when a website changes its layout, so you spend zero time on maintenance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="websites">
                <AccordionTrigger className="text-base font-semibold">
                  What websites can I scrape?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  You can scrape any publicly accessible website. This includes e-commerce stores, news sites, job boards, real estate listings, social media profiles, government databases, and more. If you can view it in a browser, Scraper.bot can extract structured data from it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="anti-bot">
                <AccordionTrigger className="text-base font-semibold">
                  How do you handle anti-bot protection?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Scraper.bot includes built-in IP rotation across a global proxy network, automatic session management, CSRF token handling, and intelligent request throttling. We handle CAPTCHAs, rate limiting, and fingerprint detection so your flows run reliably without getting blocked.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="multi-step">
                <AccordionTrigger className="text-base font-semibold">
                  Can I automate multi-step workflows?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes. Scraper.bot supports full browser automation including form fills, button clicks, page navigation, login flows, pagination, and conditional logic. You can chain multiple steps together into a single flow that handles complex interactions like searching, filtering, and navigating through authenticated pages.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger className="text-base font-semibold">
                  Is my data secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Absolutely. All data is encrypted in transit and at rest. We are SOC 2 compliant and follow industry best practices for data security. By default, we do not store your extracted data beyond the configured retention period. Enterprise customers can opt for on-premise deployment for full data sovereignty.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="website-changes">
                <AccordionTrigger className="text-base font-semibold">
                  What happens when a website changes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Scraper.bot uses self-healing selectors that automatically detect and adapt to layout changes. When a target website updates its structure, our system re-maps the extraction logic to match the new DOM without any manual intervention. You get notified of changes, and your API continues returning structured data without downtime.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6 text-white">
            Ready to Automate the Web?
          </h2>
          <p className="text-xl text-blue-100 text-balance max-w-2xl mx-auto mb-10">
            Replace fragile scrapers with reliable, AI-generated APIs. Get started in minutes.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6 font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-4">
                <Logo size="md" href="/" />
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered web scraping and structured API generation for modern data teams.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold text-foreground text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/docs/api-reference" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-foreground text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><a href="mailto:hello@scraper.bot" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-foreground text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">&copy; 2026 Scraper. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="https://x.com/scraperbot" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/wyatt3d/scraper" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/scraperbot" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

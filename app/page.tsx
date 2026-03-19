import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TrustedBy } from "@/components/landing/trusted-by"
import { AuthNavDesktop, HeroCTA } from "@/components/landing/auth-nav"
import { MobileMenu } from "@/components/landing/mobile-menu"
import { DemoToggle } from "@/components/landing/demo-toggle"
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Bell,
  MessageSquareText,
  Workflow,
  Clock,
  Users,
  Code,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react"

export default async function LandingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isSignedIn = !!user

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
              <AuthNavDesktop isSignedIn={isSignedIn} />
            </div>

            <MobileMenu isSignedIn={isSignedIn} />
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
              <span className="text-blue-600 dark:text-blue-400">Structured API</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-10 leading-relaxed max-w-3xl mx-auto">
              Describe what you need in plain English. Our AI generates scraping flows, executes them in a real browser engine, and returns structured data via API. No infrastructure, no maintenance, no code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <HeroCTA isSignedIn={isSignedIn} />
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
                <p className="text-zinc-400">$ curl -X POST https://scraper.bot/api/extract \</p>
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
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600" />
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
                description: "Claude AI generates a complete scraping flow with selectors, steps, and output schema. A live REST API endpoint is created automatically.",
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
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-serif font-black text-xl shadow-lg">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <item.icon className="w-8 h-8 text-muted-foreground" />
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
                title: "Interactive Browser Automation",
                description: "Real Playwright execution with click, fill, scroll, and multi-step flows via Browserless Chrome.",
                icon: Workflow,
              },
              {
                title: "Change Monitoring & Alerts",
                description: "Watch pages for changes and get instant notifications when data updates.",
                icon: Bell,
              },
              {
                title: "AI Flow Generation",
                description: "Describe your scraping task in plain English. Claude AI generates a complete flow with selectors, steps, and output schema.",
                icon: MessageSquareText,
              },
              {
                title: "Deterministic API Endpoints",
                description: "Every flow becomes a versioned, cacheable REST endpoint you can depend on.",
                icon: Code,
              },
              {
                title: "Stealth Mode & Anti-Bot Bypass",
                description: "Built-in stealth mode on Browserless Chrome with proxy rotation, fingerprint evasion, and session management.",
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
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-foreground" />
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

          <DemoToggle />
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
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
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
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
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
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
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
              <a href="mailto:hello@scraper.bot" className="text-blue-600 dark:text-blue-400 hover:underline">
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
                  Scraper.bot runs a stealth-mode Browserless Chrome engine that evades fingerprint detection, bot checks, and JavaScript challenges. Combined with IP rotation, automatic session management, and intelligent request throttling, your flows run reliably without getting blocked.
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
          <p className="text-xl text-white/80 text-balance max-w-2xl mx-auto mb-10">
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

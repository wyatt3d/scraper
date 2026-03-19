import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Chrome,
  Globe,
  MousePointerClick,
  Zap,
  RefreshCw,
  Eye,
  LayoutDashboard,
  Monitor,
} from "lucide-react"
import { ExtensionButtons } from "./extension-buttons"

export const metadata: Metadata = {
  title: "Chrome Extension | Scraper.bot",
  description:
    "Point. Click. Extract. Turn any webpage into structured data without leaving your browser with the Scraper.bot Chrome Extension.",
}

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-balance mb-6 text-foreground">
              Scraper.bot{" "}
              <span className="text-blue-600 dark:text-blue-400">Chrome Extension</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-10 leading-relaxed max-w-3xl mx-auto">
              Point. Click. Extract. Turn any webpage into structured data without leaving your browser.
            </p>
            <ExtensionButtons variant="hero" />

            {/* Chrome Web Store badge placeholder */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                <Chrome className="w-4 h-4" />
                Available on the Chrome Web Store
              </div>
            </div>

            {/* Browser mockup */}
            <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border">
              <div className="bg-zinc-900 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4">
                  <div className="bg-zinc-800 rounded-md px-3 py-1 text-zinc-400 text-sm font-mono text-center">
                    https://example-store.com/products
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950 p-8 relative">
                <div className="grid grid-cols-3 gap-4">
                  {["Product A", "Product B", "Product C"].map((name, i) => (
                    <div
                      key={name}
                      className={`rounded-lg border p-4 text-left ${
                        i === 1
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30"
                          : "border-zinc-700 bg-zinc-800/50"
                      }`}
                    >
                      <div className="h-16 rounded bg-zinc-700 mb-3" />
                      <p className="text-zinc-300 text-sm font-medium">{name}</p>
                      <p className="text-emerald-400 text-sm font-mono mt-1">$29.99</p>
                    </div>
                  ))}
                </div>
                {/* Extension popup overlay */}
                <div className="absolute top-4 right-4 w-56 rounded-lg border border-border bg-background shadow-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">Scraper.bot</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle className="w-3 h-3" />
                      <span>2 selectors captured</span>
                    </div>
                    <div className="rounded border border-border bg-muted/50 p-2 font-mono text-[10px] text-muted-foreground">
                      .product-title<br />.price
                    </div>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                      Extract Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Extension Works */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              How the Extension Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to structured data from any webpage.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Browse",
                description: "Navigate to any website in Chrome.",
                icon: Globe,
              },
              {
                step: "2",
                title: "Select",
                description: "Click elements to define what to extract. Visual selector picker highlights them in real-time.",
                icon: MousePointerClick,
              },
              {
                step: "3",
                title: "Extract",
                description: "Get structured JSON data instantly in the extension popup.",
                icon: Zap,
              },
              {
                step: "4",
                title: "Automate",
                description: "Save as a Flow for scheduled runs via Scraper.bot.",
                icon: RefreshCw,
              },
            ].map((item) => (
              <Card key={item.step} className="border-border text-center relative pt-12">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-serif font-black text-xl shadow-lg">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="font-serif font-bold text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Extension Features
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Visual Selector Picker",
                description:
                  "Click on any element to capture its CSS selector. See it highlighted in real-time. No DevTools needed.",
                icon: Eye,
              },
              {
                title: "Instant Extraction",
                description:
                  "Extract data from the current page with one click. See results in the extension popup.",
                icon: Zap,
              },
              {
                title: "Sync to Dashboard",
                description:
                  "Flows created in the extension automatically sync to your Scraper.bot dashboard for scheduling and API access.",
                icon: LayoutDashboard,
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <CardTitle className="font-serif font-bold text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Extension Screenshots */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              See It in Action
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { caption: "Select elements visually", color: "from-muted to-muted/50" },
              { caption: "See extracted data instantly", color: "from-emerald-600/20 to-emerald-400/10" },
              { caption: "Configure and schedule", color: "from-purple-600/20 to-purple-400/10" },
            ].map((screenshot) => (
              <div key={screenshot.caption} className="text-center">
                <div
                  className={`aspect-[4/3] rounded-xl border border-border bg-gradient-to-br ${screenshot.color} flex items-center justify-center mb-4`}
                >
                  <div className="text-center space-y-3">
                    <Monitor className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground/70">Screenshot placeholder</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{screenshot.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              {["Chrome", "Edge", "Brave", "Chromium"].map((browser) => (
                <div
                  key={browser}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Globe className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">{browser}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-lg mt-2">
              Works with Chrome, Edge, Brave, and all Chromium browsers
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6 text-white">
            Ready to Start Scraping from Your Browser?
          </h2>
          <p className="text-xl text-white/80 text-balance max-w-2xl mx-auto mb-10">
            Install the Scraper.bot extension and start extracting structured data in seconds.
          </p>
          <ExtensionButtons variant="cta" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">&copy; 2026 Scraper. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

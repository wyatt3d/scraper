"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Fragment } from "react"
import { Slider } from "@/components/ui/slider"
import { Check, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/logo"
import { toast } from "sonner"

const tiers = [
  {
    name: "Free",
    description: "For side projects and experimentation",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    ctaHref: "/sign-up",
    highlighted: false,
    features: [
      "100 runs/month",
      "3 flows",
      "1 user",
      "Community support",
      "Basic integrations",
      "Browserless extraction only",
    ],
  },
  {
    name: "Pro",
    description: "For teams shipping production integrations",
    monthlyPrice: 29,
    annualPrice: 278,
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    ctaHref: "/sign-up",
    highlighted: true,
    features: [
      "5,000 runs/month",
      "Unlimited flows",
      "5 team members",
      "Priority support",
      "All integrations",
      "Browser automation",
      "Scheduling",
      "API access",
      "Webhooks",
    ],
  },
  {
    name: "Enterprise",
    description: "For organizations with custom requirements",
    monthlyPrice: null,
    annualPrice: null,
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    ctaHref: "mailto:sales@scraper.bot",
    highlighted: false,
    features: [
      "Unlimited runs",
      "Unlimited flows",
      "Unlimited team members",
      "SSO/SAML",
      "SLA guarantee",
      "Dedicated support",
      "On-premise option",
      "Custom integrations",
      "Audit logs",
    ],
  },
]

type CellValue = boolean | string

interface FeatureRow {
  name: string
  free: CellValue
  pro: CellValue
  enterprise: CellValue
}

interface FeatureCategory {
  category: string
  features: FeatureRow[]
}

const comparisonData: FeatureCategory[] = [
  {
    category: "Extraction & Automation",
    features: [
      { name: "Browserless extraction", free: true, pro: true, enterprise: true },
      { name: "Browser automation", free: false, pro: true, enterprise: true },
      { name: "Multi-step workflows", free: false, pro: true, enterprise: true },
      { name: "Self-healing selectors", free: false, pro: true, enterprise: true },
      { name: "JavaScript rendering", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "API & Integrations",
    features: [
      { name: "REST API access", free: "Limited", pro: true, enterprise: true },
      { name: "Webhook notifications", free: false, pro: true, enterprise: true },
      { name: "Slack/Discord", free: false, pro: true, enterprise: true },
      { name: "Google Sheets", free: false, pro: true, enterprise: true },
      { name: "Custom integrations", free: false, pro: false, enterprise: true },
      { name: "MCP Server", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Platform",
    features: [
      { name: "Scheduled runs", free: "5/day", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Concurrent runs", free: "1", pro: "10", enterprise: "Unlimited" },
      { name: "Data retention", free: "7 days", pro: "90 days", enterprise: "Unlimited" },
      { name: "Team members", free: "1", pro: "5", enterprise: "Unlimited" },
      { name: "Priority support", free: false, pro: true, enterprise: true },
      { name: "SLA guarantee", free: false, pro: false, enterprise: true },
      { name: "SSO/SAML", free: false, pro: false, enterprise: true },
      { name: "Audit logs", free: false, pro: false, enterprise: true },
    ],
  },
]

const faqs = [
  {
    question: "What counts as a run?",
    answer:
      "A run is a single execution of a flow, whether triggered manually, via API, or on a schedule. Each run extracts data from one or more pages as defined by your flow. Paginated extractions that visit multiple pages within a single flow execution still count as one run.",
  },
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your plan at any time from your account settings. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "Do you offer a free trial for Pro?",
    answer:
      "Yes, every new account gets a 14-day free trial of the Pro plan with full access to all features. No credit card required to start. At the end of your trial, you can choose to subscribe or continue on the Free plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as ACH bank transfers for annual plans. Enterprise customers can also pay via invoice with NET-30 terms.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No. There are no setup fees, hidden charges, or long-term contracts for any plan. You only pay the listed subscription price. Enterprise plans are custom-quoted based on your requirements but also carry no setup fees.",
  },
  {
    question: "What happens if I exceed my limits?",
    answer:
      "We'll notify you at 80% and 100% of your monthly run limit. Once you hit your limit, scheduled runs will pause until your next billing cycle or until you upgrade. You won't be charged overage fees automatically -- we'll always give you the choice to upgrade first.",
  },
]

function CellIcon({ value }: { value: CellValue }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />
  }
  if (value === false) {
    return <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>
}

export function PricingContent() {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [monthlyRuns, setMonthlyRuns] = useState(1000)
  const [pagesPerRun, setPagesPerRun] = useState(5)
  const [teamMembers, setTeamMembers] = useState(3)

  async function handleCheckout(plan: string) {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Checkout failed")
      }
    } catch {
      toast.error("Failed to start checkout")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const recommendedPlan = monthlyRuns < 100 ? "Free" : monthlyRuns < 5000 ? "Pro" : "Enterprise"
  const estimatedCost = recommendedPlan === "Free" ? 0 : recommendedPlan === "Pro" ? 29 : 299
  const totalDataPoints = monthlyRuns * pagesPerRun
  const costPerRun = estimatedCost > 0 ? estimatedCost / monthlyRuns : 0
  const costPerDataPoint = totalDataPoints > 0 && estimatedCost > 0 ? estimatedCost / totalDataPoints : 0
  const ctaHref = recommendedPlan === "Enterprise" ? "/contact" : "/sign-up"

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" href="/" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-foreground font-medium transition-colors">
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

      {/* Header */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-balance mb-6 text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto mb-10">
            Start free. Scale as you grow.
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
            </span>
            {annual && (
              <Badge className="bg-green-600 text-white border-transparent ml-1">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted
                    ? "border-blue-600 shadow-lg shadow-blue-600/10 scale-[1.02]"
                    : "border-border"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white border-transparent">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-serif font-bold text-xl">
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                  <div className="mt-4">
                    {tier.monthlyPrice !== null ? (
                      <>
                        <span className="font-serif font-black text-5xl">
                          ${annual ? Math.round(tier.annualPrice! / 12) : tier.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground text-lg">/mo</span>
                        {annual && tier.annualPrice! > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            ${tier.annualPrice}/yr billed annually
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="font-serif font-black text-5xl">Custom</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.name === "Pro" ? (
                    <Button
                      variant={tier.ctaVariant}
                      disabled={checkoutLoading}
                      onClick={() => handleCheckout("pro")}
                      className={cn(
                        "w-full",
                        "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      {checkoutLoading ? "Redirecting..." : tier.cta}
                    </Button>
                  ) : (
                    <Link href={tier.ctaHref}>
                      <Button
                        variant={tier.ctaVariant}
                        className={cn(
                          "w-full",
                          "bg-transparent"
                        )}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Compare Plans
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A detailed breakdown of what&apos;s included in each plan.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 pr-4 text-sm font-medium text-muted-foreground w-[40%]">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold w-[20%]">
                    Free
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 w-[20%]">
                    Pro
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold w-[20%]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((group) => (
                  <Fragment key={group.category}>
                    <tr>
                      <td
                        colSpan={4}
                        className="pt-8 pb-3 text-sm font-serif font-bold text-foreground"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.features.map((feature) => (
                      <tr
                        key={feature.name}
                        className="border-b border-border/50 last:border-b-0"
                      >
                        <td className="py-3 pr-4 text-sm text-foreground">
                          {feature.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <CellIcon value={feature.free} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <CellIcon value={feature.pro} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <CellIcon value={feature.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Estimate Your Monthly Cost
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Adjust the sliders to see which plan fits your needs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Monthly Runs</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{monthlyRuns.toLocaleString()}</span>
                </div>
                <Slider
                  value={[monthlyRuns]}
                  onValueChange={([v]) => setMonthlyRuns(v)}
                  min={0}
                  max={50000}
                  step={100}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>0</span>
                  <span>50,000</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Average Pages per Run</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{pagesPerRun}</span>
                </div>
                <Slider
                  value={[pagesPerRun]}
                  onValueChange={([v]) => setPagesPerRun(v)}
                  min={1}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Team Members</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{teamMembers}</span>
                </div>
                <Slider
                  value={[teamMembers]}
                  onValueChange={([v]) => setTeamMembers(v)}
                  min={1}
                  max={50}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <Card className="border-blue-600/30 shadow-lg">
              <CardHeader>
                <CardDescription className="text-sm">Recommended Plan</CardDescription>
                <CardTitle className="font-serif font-black text-3xl text-blue-600 dark:text-blue-400">
                  {recommendedPlan}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Estimated monthly cost</span>
                  <span className="font-serif font-black text-2xl">
                    {recommendedPlan === "Enterprise" ? "Custom" : `$${estimatedCost}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Cost per run</span>
                  <span className="font-medium">
                    {recommendedPlan === "Enterprise" ? "--" : `$${costPerRun.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Cost per data point</span>
                  <span className="font-medium">
                    {recommendedPlan === "Enterprise" ? "--" : `$${costPerDataPoint.toFixed(6)}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pb-3">
                  <span className="text-sm text-muted-foreground">Total data points/mo</span>
                  <span className="font-medium">{totalDataPoints.toLocaleString()}</span>
                </div>
                <Link href={ctaHref}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                    Get Started with {recommendedPlan}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-black text-3xl md:text-5xl text-balance mb-6 text-white">
            Still have questions?
          </h2>
          <p className="text-xl text-white/80 text-balance max-w-2xl mx-auto mb-10">
            Our team is happy to walk you through the platform and help you find the right plan.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-blue-600 dark:text-blue-400 hover:bg-white/90 text-lg px-8 py-6 font-semibold"
            >
              Talk to Sales
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

import { cn } from "@/lib/utils"
import {
  Bot,
  Lock,
  AlertTriangle,
  Wrench,
  Ban,
  Sparkles,
  Server,
  MousePointerClick,
  Globe,
  Cpu,
  Webhook,
  Users,
  Activity,
  Play,
  DollarSign,
  Star,
  TrendingUp,
  CreditCard,
  BarChart3,
  Store,
  Target,
  BookOpen,
  Code2,
  Megaphone,
  Mail,
} from "lucide-react"

const trustedLogos = [
  "TechFlow",
  "DataSync",
  "Apiture",
  "Nextera",
  "Quantive",
  "Meridian",
  "Arclight",
  "Vantage",
]

const mrrData = [
  { month: "Apr '25", value: 5000 },
  { month: "May '25", value: 8200 },
  { month: "Jun '25", value: 12800 },
  { month: "Jul '25", value: 19500 },
  { month: "Aug '25", value: 28700 },
  { month: "Sep '25", value: 38400 },
  { month: "Oct '25", value: 51200 },
  { month: "Nov '25", value: 64800 },
  { month: "Dec '25", value: 78300 },
  { month: "Jan '26", value: 95100 },
  { month: "Feb '26", value: 112400 },
  { month: "Mar '26", value: 127450 },
]

function Slide({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen flex items-center justify-center py-20 px-6 border-b border-border/30",
        className
      )}
    >
      <div className="w-full max-w-5xl">{children}</div>
    </section>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string
  label: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
      <Icon className="size-5 text-blue-500 mx-auto mb-3" />
      <p className="font-serif text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function MRRChart() {
  const max = Math.max(...mrrData.map((d) => d.value))
  const chartHeight = 200
  const chartWidth = 600
  const points = mrrData
    .map((d, i) => {
      const x = (i / (mrrData.length - 1)) * chartWidth
      const y = chartHeight - (d.value / max) * (chartHeight - 20)
      return `${x},${y}`
    })
    .join(" ")
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`

  return (
    <div className="mt-8">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Month-over-Month MRR Growth
      </h4>
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <svg
          viewBox={`-40 -10 ${chartWidth + 60} ${chartHeight + 40}`}
          className="w-full h-auto max-h-[250px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = chartHeight - pct * (chartHeight - 20)
            const val = Math.round(pct * max / 1000)
            return (
              <g key={pct}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/40"
                  strokeDasharray="4 4"
                />
                <text
                  x={-8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  ${val}K
                </text>
              </g>
            )
          })}
          <polygon points={areaPoints} fill="url(#mrrGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="rgb(37, 99, 235)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {mrrData.map((d, i) => {
            const x = (i / (mrrData.length - 1)) * chartWidth
            const y = chartHeight - (d.value / max) * (chartHeight - 20)
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3.5" fill="rgb(37, 99, 235)" />
                {i % 3 === 0 || i === mrrData.length - 1 ? (
                  <text
                    x={x}
                    y={chartHeight + 16}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[9px]"
                  >
                    {d.month}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">$5K MRR</span>
          <span className="text-blue-500 font-semibold">$127K MRR</span>
        </div>
      </div>
    </div>
  )
}

export default function PitchDeckPage() {
  return (
    <div className="-mx-6 -mt-8">
      {/* Slide 1: Cover */}
      <Slide className="bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-10">
            <Lock className="size-3" />
            Confidential
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="flex size-16 items-center justify-center rounded-xl bg-blue-600 text-white font-serif font-bold text-3xl">S</span>
            <h1 className="font-serif text-6xl md:text-7xl font-bold text-white tracking-tight">
              Scraper<span className="text-blue-400">.bot</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-blue-400 font-medium mb-4">
            Turn Any Website Into a Structured API
          </p>
          <p className="text-muted-foreground text-lg">
            Series A Pitch Deck — March 2026
          </p>
        </div>
      </Slide>

      {/* Slide 2: The Problem */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            The Problem
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            80% of the world&apos;s data lives on websites, not in APIs
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {[
            {
              icon: AlertTriangle,
              title: "Scrapers break constantly",
              desc: "When sites change layout, selectors, or anti-bot measures, scrapers silently fail. Teams spend 40%+ of engineering time on maintenance.",
            },
            {
              icon: Wrench,
              title: "Infrastructure is expensive",
              desc: "Proxy rotation, headless browsers, CAPTCHA solving, rate limiting, retries. Building this in-house costs $200K+/year for a small team.",
            },
            {
              icon: Ban,
              title: "No-code users are locked out",
              desc: "Business analysts, ops teams, and growth marketers need web data but lack the technical skills to build and maintain scrapers.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/60 bg-card p-8"
            >
              <item.icon className="size-8 text-red-500 mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-block rounded-xl border border-blue-500/20 bg-blue-500/5 px-8 py-4">
            <p className="font-serif text-2xl font-bold text-foreground">
              $5.2B{" "}
              <span className="text-base font-normal text-muted-foreground">
                web scraping market, growing{" "}
              </span>
              18% CAGR
            </p>
          </div>
        </div>
      </Slide>

      {/* Slide 3: The Solution */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            The Solution
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Describe what you need.
            <br />
            Get a live API in minutes.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Flow Generation",
              desc: "Describe your data needs in plain English. Our AI generates a complete extraction flow with selectors, pagination, and error handling.",
            },
            {
              icon: Server,
              title: "Deterministic API Endpoints",
              desc: "Every flow becomes a versioned REST API. Reliable, repeatable, and documented. No more flaky scripts.",
            },
            {
              icon: MousePointerClick,
              title: "Visual Workflow Builder",
              desc: "Drag-and-drop flow builder for non-technical users. Point, click, extract. No code required.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/60 bg-card p-8"
            >
              <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <item.icon className="size-6 text-blue-500" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Product screenshot / demo video
          </p>
        </div>
      </Slide>

      {/* Slide 4: How It Works */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            How It Works
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Three steps to structured data
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: Globe,
              title: "Enter URL + Describe Data",
              desc: "Paste any website URL and describe the data you need in plain English. \"Get all product names, prices, and ratings from this page.\"",
            },
            {
              step: "02",
              icon: Cpu,
              title: "AI Generates Flow + API",
              desc: "Our engine analyzes the page, generates extraction selectors, handles pagination, and creates a versioned API endpoint automatically.",
            },
            {
              step: "03",
              icon: Webhook,
              title: "Integrate & Automate",
              desc: "Call your new API via REST, use our SDK, or set up webhooks. Schedule runs, monitor changes, and pipe data wherever you need it.",
            },
          ].map((item, i) => (
            <div key={item.step} className="relative">
              <div className="rounded-xl border border-border/60 bg-card p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-serif font-bold text-blue-500/30">
                    {item.step}
                  </span>
                  <item.icon className="size-6 text-blue-500" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-muted-foreground/40 text-2xl">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
      </Slide>

      {/* Slide 5: Traction */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            Traction
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Real growth, real revenue
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} value="10,247" label="Registered Users" />
          <StatCard icon={Activity} value="3,891" label="Active Flows" />
          <StatCard icon={Play} value="45,672" label="Daily Runs" />
          <StatCard icon={DollarSign} value="$127,450" label="MRR" />
          <StatCard icon={TrendingUp} value="96.8%" label="Success Rate" />
          <StatCard icon={Star} value="4.9/5" label="User Rating" />
        </div>
        <MRRChart />
        <div className="mt-10">
          <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-wide">
            Key Customers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {trustedLogos.map((name) => (
              <div
                key={name}
                className="px-5 py-2.5 rounded-lg border border-border/60 bg-muted/30 text-muted-foreground font-semibold tracking-wider text-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* Slide 6: Business Model */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            Business Model
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Three revenue streams
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {[
            {
              icon: CreditCard,
              title: "SaaS Subscriptions",
              desc: "Free tier for hobbyists. Pro at $29/mo for professionals. Enterprise with custom pricing, SLAs, and dedicated infrastructure.",
            },
            {
              icon: BarChart3,
              title: "Usage-Based Pricing",
              desc: "Per-run and per-data-point overage charges. Customers pay for what they use beyond plan limits. Scales with value delivered.",
            },
            {
              icon: Store,
              title: "Marketplace Commission",
              desc: "15% commission on paid community flows. Creators monetize their extraction templates, we take a cut.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/60 bg-card p-8"
            >
              <item.icon className="size-8 text-blue-500 mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mb-4">
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">
            Unit Economics
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "CAC", value: "$45" },
            { label: "LTV", value: "$1,740" },
            { label: "LTV/CAC", value: "38.7x" },
            { label: "Gross Margin", value: "82%" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/60 bg-card p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-serif text-2xl font-bold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Slide>

      {/* Slide 7: Competitive Landscape */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            Competitive Landscape
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Best quadrant: powerful + no code
          </h2>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-8 mb-10">
          <div className="relative w-full max-w-lg mx-auto aspect-square">
            <div className="absolute inset-0 border border-border/40">
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-border/40" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-border/40" />
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground uppercase tracking-wide">
              No Code
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground uppercase tracking-wide">
              Code Required
            </div>
            <div className="absolute top-1/2 -left-16 -translate-y-1/2 text-xs text-muted-foreground uppercase tracking-wide">
              Simple
            </div>
            <div className="absolute top-1/2 -right-20 -translate-y-1/2 text-xs text-muted-foreground uppercase tracking-wide">
              Powerful
            </div>
            <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md border border-border/60 bg-muted/50 text-sm text-muted-foreground">
              Import.io
            </div>
            <div className="absolute bottom-[20%] right-[20%] translate-x-1/2 translate-y-1/2 px-3 py-1.5 rounded-md border border-border/60 bg-muted/50 text-sm text-muted-foreground">
              Apify
            </div>
            <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 translate-y-1/2 px-3 py-1.5 rounded-md border border-border/60 bg-muted/50 text-sm text-muted-foreground">
              Parse.bot
            </div>
            <div className="absolute top-[15%] right-[15%] translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-500/10 text-sm font-semibold text-blue-500 shadow-lg shadow-blue-500/10">
              Scraper.bot
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              vs: "vs Parse.bot",
              diff: "AI-powered flow generation + visual builder. Parse.bot requires manual selector writing.",
            },
            {
              vs: "vs Notte",
              diff: "Deterministic APIs with versioning. Notte is agent-only with unpredictable outputs.",
            },
            {
              vs: "vs Browse AI",
              diff: "Full API infrastructure + marketplace. Browse AI is limited to simple point-and-click extraction.",
            },
            {
              vs: "vs Apify",
              diff: "Zero code required. Apify targets developers only and requires JavaScript/Python.",
            },
          ].map((item) => (
            <div
              key={item.vs}
              className="rounded-lg border border-border/60 bg-card px-6 py-4"
            >
              <p className="font-semibold text-foreground text-sm mb-1">
                {item.vs}
              </p>
              <p className="text-muted-foreground text-sm">{item.diff}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* Slide 8: Go-to-Market */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            Go-to-Market
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Three growth channels
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {[
            {
              icon: Target,
              title: "Product-Led Growth",
              desc: "Generous free tier, interactive playground, and 100+ pre-built templates. Users experience value before they ever talk to sales.",
            },
            {
              icon: BookOpen,
              title: "Content Marketing",
              desc: "Blog, documentation, and community forum create an SEO flywheel. Developers find us when searching for scraping solutions.",
            },
            {
              icon: Code2,
              title: "Developer Ecosystem",
              desc: "SDK, REST API, marketplace for community flows, and MCP integration. Developers build on top of Scraper.bot and bring their teams.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border/60 bg-card p-8"
            >
              <item.icon className="size-8 text-blue-500 mb-4" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-4">
            Target Personas
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Developers", "Data Teams", "Growth / Ops Teams"].map(
              (persona) => (
                <span
                  key={persona}
                  className="px-4 py-2 rounded-full border border-border/60 bg-card text-sm font-medium text-foreground"
                >
                  {persona}
                </span>
              )
            )}
          </div>
        </div>
      </Slide>

      {/* Slide 9: Team */}
      <Slide>
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-medium mb-3">
            Team
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            The leadership team
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            {
              role: "CEO",
              focus: "Product vision, fundraising",
              color: "blue",
            },
            {
              role: "CTO",
              focus: "Architecture, scraping engine, AI integration",
              color: "emerald",
            },
            {
              role: "COO",
              focus: "Operations, UX, documentation, community",
              color: "violet",
            },
            {
              role: "CFO",
              focus: "Growth, analytics, monetization, performance",
              color: "amber",
            },
          ].map((member) => (
            <div
              key={member.role}
              className="rounded-xl border border-border/60 bg-card p-8 flex items-start gap-5"
            >
              <div
                className={cn(
                  "size-14 rounded-full flex items-center justify-center text-white font-serif text-lg font-bold shrink-0",
                  member.color === "blue" && "bg-blue-600",
                  member.color === "emerald" && "bg-emerald-600",
                  member.color === "violet" && "bg-violet-600",
                  member.color === "amber" && "bg-amber-600"
                )}
              >
                {member.role[0]}
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {member.role}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {member.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* Slide 10: The Ask */}
      <Slide className="bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-blue-400 font-medium mb-3">
            The Ask
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
            Raising $3M Series A
          </h2>
          <p className="text-lg text-blue-300/80">
            18-month runway to $500K MRR
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-14">
          {[
            {
              pct: "40%",
              label: "Engineering",
              detail: "AI engine, browser infrastructure",
            },
            {
              pct: "25%",
              label: "Sales & Marketing",
              detail: "Growth, demand gen, partnerships",
            },
            {
              pct: "20%",
              label: "Operations & Support",
              detail: "Customer success, infrastructure",
            },
            {
              pct: "15%",
              label: "G&A",
              detail: "Legal, finance, administration",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <p className="font-serif text-3xl font-bold text-white">
                {item.pct}
              </p>
              <p className="text-sm font-medium text-blue-300 mt-1">
                {item.label}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-zinc-400">
            <Mail className="size-4" />
            <span className="text-sm">hello@scraper.bot</span>
          </div>
        </div>
      </Slide>
    </div>
  )
}

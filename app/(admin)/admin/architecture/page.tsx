import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Cloud,
  Database,
  Server,
  CreditCard,
  Mail,
  Brain,
  Globe,
} from "lucide-react"

const architectureDiagram = `Users  ->  Vercel (Next.js 15)
             |--- Frontend (React 19 + shadcn/ui)
             |--- API Routes (/api/*)
             |      |--- /api/flows (CRUD)
             |      |--- /api/runs (trigger + history)
             |      |--- /api/extract (real scraping)
             |      |--- /api/generate (Claude AI)
             |      |--- /api/checkout (Stripe)
             |      |--- /api/email (Resend)
             |      \`--- /api/health (monitoring)
             |--- Supabase PostgreSQL
             |      |--- flows, runs, api_keys, alerts
             |      |--- webhooks, secrets, sessions
             |      \`--- audit_log, tickets
             \`--- Hostinger VPS (72.62.83.124)
                    \`--- Browserless Chrome (Docker)
                           |--- /content (JS rendering)
                           \`--- /screenshot (page capture)`

interface ServiceCard {
  name: string
  icon: React.ElementType
  color: string
  description: string
  details: string[]
}

const services: ServiceCard[] = [
  {
    name: "Vercel",
    icon: Cloud,
    color: "text-foreground",
    description: "Hosting & Framework",
    details: [
      "Next.js 15 with App Router",
      "89+ routes (pages + API)",
      "Edge & serverless functions",
      "Auto-deploy from GitHub on push to main",
      "8 subdomains configured (www, app, admin, docs, api, blog, status, community)",
    ],
  },
  {
    name: "Supabase",
    icon: Database,
    color: "text-emerald-500",
    description: "Database & Auth",
    details: [
      "PostgreSQL with RLS policies",
      "Tables: flows, runs, api_keys, alerts, webhooks, secrets, sessions, audit_log, tickets",
      "Service role key for server-side access",
      "Public anon key for client-side (RLS protected)",
      "Real-time subscriptions available",
    ],
  },
  {
    name: "Hostinger VPS",
    icon: Server,
    color: "text-purple-500",
    description: "Browser Scraping",
    details: [
      "IP: 72.62.83.124:3000",
      "Docker container running Browserless Chrome",
      "/content endpoint for JS-rendered page HTML",
      "/screenshot endpoint for page capture (PNG)",
      "Used when Cheerio HTTP mode cannot handle JS-heavy sites",
    ],
  },
  {
    name: "Stripe",
    icon: CreditCard,
    color: "text-orange-500",
    description: "Payments",
    details: [
      "Checkout session creation via /api/checkout",
      "Pro plan: $29/mo or $278/yr (20% annual discount)",
      "Webhook handling for payment events",
      "lib/stripe.ts client wrapper",
    ],
  },
  {
    name: "Resend",
    icon: Mail,
    color: "text-pink-500",
    description: "Email Delivery",
    details: [
      "Welcome email on signup",
      "Alert email templates for monitoring notifications",
      "lib/email.ts client wrapper",
      "Sender domain configured for scraper.bot",
    ],
  },
  {
    name: "Anthropic",
    icon: Brain,
    color: "text-yellow-500",
    description: "AI Intelligence",
    details: [
      "Claude API for AI-powered flow generation",
      "/api/generate endpoint",
      "Natural language to scraping flow conversion",
      "Prompt design for structured extraction schemas",
    ],
  },
]

const envVars = [
  { name: "NEXT_PUBLIC_SUPABASE_URL", service: "Supabase", purpose: "Database connection" },
  { name: "SUPABASE_SERVICE_ROLE_KEY", service: "Supabase", purpose: "Server-side DB access" },
  { name: "STRIPE_SECRET_KEY", service: "Stripe", purpose: "Payment processing" },
  { name: "ANTHROPIC_API_KEY", service: "Anthropic", purpose: "AI flow generation" },
  { name: "RESEND_API_KEY", service: "Resend", purpose: "Email delivery" },
  { name: "BROWSERLESS_URL", service: "Hostinger VPS", purpose: "Browser scraping" },
  { name: "HOSTINGER_API_KEY", service: "Hostinger", purpose: "VPS management" },
]

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">System Architecture</h1>
        <p className="text-muted-foreground mt-1">Technical overview of the Scraper.bot platform infrastructure</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-foreground" />
            <CardTitle>Architecture Diagram</CardTitle>
          </div>
          <CardDescription>High-level system topology</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto leading-relaxed">
            {architectureDiagram}
          </pre>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-xl font-bold mb-4">Service Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <service.icon className={`size-5 ${service.color} shrink-0`} />
                  <div>
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {service.details.map((detail, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-muted-foreground/50 mt-1.5 shrink-0 size-1 rounded-full bg-current" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Required environment variables (set in Vercel production environment)</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium">Variable</th>
                  <th className="text-left py-2 pr-4 font-medium">Service</th>
                  <th className="text-left py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {envVars.map((v) => (
                  <tr key={v.name} className="border-b border-border/50">
                    <td className="py-2 pr-4">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{v.name}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline" className="text-xs">{v.service}</Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">{v.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

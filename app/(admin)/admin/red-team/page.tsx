"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertOctagon, Info, ShieldAlert, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

interface Finding {
  id: string
  title: string
  severity: Severity
  category: string
  description: string
  location: string
  recommendation: string
  fixed: boolean
}

const findings: Finding[] = [
  {
    id: "RT-001",
    title: "Auth forms only console.log credentials",
    severity: "CRITICAL",
    category: "Dead Functionality",
    description:
      "Both sign-in and sign-up forms call console.log() with user credentials on submit. There is no actual authentication, no API call, no redirect. A user who fills out the form and clicks 'Sign In' sees nothing happen. This is the single most damaging UX failure -- it makes the product look fake on first contact.",
    location: "app/(auth)/sign-in/page.tsx:29, app/(auth)/sign-up/page.tsx:44",
    recommendation:
      "Integrate a real auth provider (Clerk, NextAuth, Supabase Auth). At minimum, redirect to /dashboard after submit and store a session cookie.",
    fixed: false,
  },
  {
    id: "RT-002",
    title: "Google and GitHub OAuth buttons do nothing",
    severity: "CRITICAL",
    category: "Dead Functionality",
    description:
      "Both auth pages have 'Continue with Google' and 'Continue with GitHub' buttons with no onClick handler, no Link wrapper, no form action. They are purely decorative. Users who prefer OAuth (the majority of developer signups) hit a dead end immediately.",
    location: "app/(auth)/sign-in/page.tsx:95-121, app/(auth)/sign-up/page.tsx:151-177",
    recommendation:
      "Wire up OAuth providers or remove the buttons entirely. Half-functional auth is worse than no auth.",
    fixed: false,
  },
  {
    id: "RT-003",
    title: "Landing page 'Extract' button does nothing",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The hero 'See It In Action' section has an Extract button with no onClick handler. The input is readOnly. This is supposed to be the live demo that sells the product -- instead it's a static screenshot pretending to be interactive.",
    location: "app/page.tsx:287-289",
    recommendation:
      "Either make it a real interactive demo (link to /playground with pre-filled URL) or remove the button and label it as a static example.",
    fixed: false,
  },
  {
    id: "RT-004",
    title: "Enterprise 'Contact Sales' button is a dead end",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The Enterprise pricing card on the landing page has a 'Contact Sales' button with no onClick, no href, no Link wrapper. It renders as a plain <button> that does absolutely nothing. The pricing page's Enterprise CTA links to /contact which does not exist (404).",
    location: "app/page.tsx:425-427, components/pricing/pricing-content.tsx:67",
    recommendation:
      "Link to a contact form, mailto, or Calendly link. Every enterprise lead that clicks this and gets nothing is lost revenue.",
    fixed: false,
  },
  {
    id: "RT-005",
    title: "13 footer links go to href='#' (dead links)",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The landing page footer has links for API Reference, Changelog, About, Blog, Careers, Contact, Help Center, Status, Privacy Policy, Terms of Service, plus Twitter/GitHub/LinkedIn social icons -- ALL pointing to '#'. These pages exist at /blog, /status, /changelog but are not linked. Social links go nowhere.",
    location: "app/page.tsx:617-651",
    recommendation:
      "Link footer items to their real routes (/blog, /status, /changelog, /docs/api-reference). Remove links for pages that don't exist. Add real social URLs or remove the icons.",
    fixed: false,
  },
  {
    id: "RT-006",
    title: "Dashboard action buttons are non-functional",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "Dashboard page has multiple buttons with no onClick handlers: 'Acknowledge' alert buttons (line 297-299), 'Run' buttons on active flows (line 397-399), pause/resume toggle buttons (line 401-405), and edit buttons (line 408-409). All are purely visual -- clicking them does nothing.",
    location: "app/(dashboard)/dashboard/page.tsx:297-409",
    recommendation:
      "At minimum, implement client-side state changes (like the monitoring page does for acknowledging alerts). Wire Run buttons to redirect to the flow or trigger a mock run.",
    fixed: false,
  },
  {
    id: "RT-007",
    title: "Flow builder buttons are non-functional",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The flow detail page has dead buttons everywhere: 'Save' (line 259), 'Run Flow' (line 262), 'Schedule' (line 255), 'Save Settings' in settings tab (line 940-943), 'Load Preview' (line 406), 'Add Rule' for extraction (line 574-577), 'Run Now' in runs tab (line 605-608), and the 'Add Step' dropdown items (line 331-335). The Copy buttons on API code snippets also do nothing -- no clipboard API call.",
    location: "app/(dashboard)/flows/[id]/page.tsx (multiple locations)",
    recommendation:
      "Implement clipboard copy for code snippets. Add toast notifications for Save/Run buttons. Make Add Step actually add steps to local state.",
    fixed: false,
  },
  {
    id: "RT-008",
    title: "'Forgot password?' links to itself (sign-in page)",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The 'Forgot password?' link on the sign-in page points to /sign-in -- the same page the user is already on. This is a broken circular link.",
    location: "app/(auth)/sign-in/page.tsx:58",
    recommendation:
      "Create a /forgot-password page or remove the link.",
    fixed: false,
  },
  {
    id: "RT-009",
    title: "Terms of Service and Privacy Policy pages don't exist",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The sign-up form requires users to agree to Terms of Service (/terms) and Privacy Policy (/privacy) before creating an account. Both links lead to 404 pages. Requiring agreement to non-existent documents is legally and ethically problematic.",
    location: "app/(auth)/sign-up/page.tsx:119-124",
    recommendation:
      "Create /terms and /privacy pages with real legal content, even if placeholder.",
    fixed: false,
  },
  {
    id: "RT-010",
    title: "Blog article links go to non-existent pages",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "All 3 blog article cards link to /blog/[slug] routes that don't exist. Clicking any article results in a 404. This makes the blog section look abandoned and damages credibility.",
    location: "app/blog/page.tsx:114",
    recommendation:
      "Create actual blog post pages, or make the cards non-clickable with a 'Coming soon' indicator.",
    fixed: false,
  },
  {
    id: "RT-011",
    title: "Status page subscribe form does nothing",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The 'Get notified about incidents' form has a Subscribe button with type='button' (not 'submit') and no onClick handler. Users who enter their email and click Subscribe get zero feedback.",
    location: "app/status/page.tsx:246",
    recommendation:
      "Wire to a mailing list API or at minimum show a toast confirmation.",
    fixed: false,
  },
  {
    id: "RT-012",
    title: "Settings page 'Save Changes' and 'Save Preferences' buttons do nothing",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The profile 'Save Changes' button, notification 'Save Preferences' button, 'Upload Avatar' button, and 'Invite Member' button all lack onClick handlers. Users can edit fields but can never persist changes.",
    location: "app/(dashboard)/settings/page.tsx:249,266,551",
    recommendation:
      "Add toast notifications on click (e.g., 'Settings saved') to provide feedback, even without a real backend.",
    fixed: false,
  },
  {
    id: "RT-013",
    title: "Settings billing 'Upgrade' and 'Contact Sales' buttons are dead",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The billing tab shows plan cards with 'Upgrade' and 'Contact Sales' buttons that have no onClick or href. Users looking to give you money literally cannot.",
    location: "app/(dashboard)/settings/page.tsx:419-425",
    recommendation:
      "Link Upgrade to /pricing or a Stripe checkout. Link Contact Sales to a form or Calendly.",
    fixed: false,
  },
  {
    id: "RT-014",
    title: "Monitoring 'Configure Alerts' button is dead",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The 'Configure Alerts' button in the monitoring page header has no onClick or href.",
    location: "app/(dashboard)/monitoring/page.tsx:265-268",
    recommendation:
      "Either remove it or scroll to the monitoring rules section below.",
    fixed: false,
  },
  {
    id: "RT-015",
    title: "Runs page 'Last 7 Days' date picker button does nothing",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The 'Last 7 Days' button in the runs page header is decorative -- no onClick, no date picker popover.",
    location: "app/(dashboard)/runs/page.tsx:268-271",
    recommendation:
      "Add a date range picker or remove the button.",
    fixed: false,
  },
  {
    id: "RT-016",
    title: "Runs page Eye and Retry action buttons do nothing",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "Each run row has an Eye (view) button and a RotateCcw (retry) button with no onClick handlers.",
    location: "app/(dashboard)/runs/page.tsx:417-422",
    recommendation:
      "Eye should expand the detail view. Retry should trigger a new run with a toast.",
    fixed: false,
  },
  {
    id: "RT-017",
    title: "Landing page claims 'SOC 2 Compliant' -- likely false",
    severity: "HIGH",
    category: "Credibility",
    description:
      "The hero trust badge says 'SOC 2 Compliant'. The FAQ also claims SOC 2 compliance and 'industry best practices'. If this is not actually SOC 2 certified, this is a material misrepresentation that could have legal consequences. Enterprise buyers will ask for the SOC 2 report.",
    location: "app/page.tsx:137, app/page.tsx:558",
    recommendation:
      "Remove the SOC 2 claim unless you have the actual certification. Replace with something truthful like 'Encrypted in transit' or 'GDPR-aware'.",
    fixed: false,
  },
  {
    id: "RT-018",
    title: "Fake testimonials from fake people at fake companies",
    severity: "HIGH",
    category: "Credibility",
    description:
      "Three testimonials cite 'Sarah Johnson, VP Engineering, DataStack', 'Mike Chen, CTO, MarketPulse', and 'Amanda Lee, Director, Asset Recovery LLC'. These are fabricated people at fabricated companies. Any user who Googles them will find nothing and immediately distrust the product. All have perfect 5-star ratings.",
    location: "app/page.tsx:444-483",
    recommendation:
      "Remove testimonials until you have real ones. Alternatively, use the section for product screenshots, metrics, or a case study.",
    fixed: false,
  },
  {
    id: "RT-019",
    title: "TrustedBy component likely shows fake company logos",
    severity: "MEDIUM",
    category: "Credibility",
    description:
      "The landing page includes a <TrustedBy /> component. If this shows logos of companies that don't actually use the product, it's deceptive. Combined with fake testimonials and fake SOC 2, the credibility damage compounds.",
    location: "app/page.tsx:145, components/landing/trusted-by.tsx",
    recommendation:
      "Remove the trusted-by section or show stats instead ('1000+ scraping flows created').",
    fixed: false,
  },
  {
    id: "RT-020",
    title: "Hardcoded footer color: bg-gray-950 breaks theming",
    severity: "MEDIUM",
    category: "Dark Mode",
    description:
      "The landing page footer uses bg-gray-950 with hardcoded text-gray-300, text-gray-400, text-gray-500, border-gray-800, and text-white. In dark mode this happens to look fine, but in light mode it creates a jarring dark section. More importantly, it doesn't use theme tokens, making it impossible to maintain consistent theming.",
    location: "app/page.tsx:594",
    recommendation:
      "Use bg-muted or bg-card with text-foreground/text-muted-foreground theme tokens.",
    fixed: false,
  },
  {
    id: "RT-021",
    title: "Admin layout uses hardcoded dark colors, ignores theme in light mode",
    severity: "MEDIUM",
    category: "Dark Mode",
    description:
      "Admin layout nav uses bg-gray-950, border-gray-800, text-gray-400, bg-gray-800, text-white, hover:bg-gray-900. The ThemeToggle button uses text-gray-400 hover:text-white. In light mode, the admin nav remains a dark slab that clashes with the page content.",
    location: "app/(admin)/layout.tsx:36-67",
    recommendation:
      "Use bg-background, border-border, text-foreground/text-muted-foreground for the admin nav, or force dark theme on the entire admin layout.",
    fixed: false,
  },
  {
    id: "RT-022",
    title: "CTA section uses bg-blue-50 hover which is light-mode only",
    severity: "LOW",
    category: "Dark Mode",
    description:
      "The final CTA section button uses hover:bg-blue-50 which is a near-white color. In dark mode, hovering the button flashes a bright white background that looks broken.",
    location: "app/page.tsx:585",
    recommendation:
      "Use hover:bg-white/90 or a dark-mode-aware hover state.",
    fixed: false,
  },
  {
    id: "RT-023",
    title: "No mobile navigation menu",
    severity: "HIGH",
    category: "UX",
    description:
      "The landing page nav uses 'hidden md:flex' for navigation links. On mobile, only the logo is visible -- no hamburger menu, no way to navigate to Features, Pricing, Docs, Sign In, or Sign Up. The blog page has the same issue.",
    location: "app/page.tsx:48, app/blog/page.tsx:60",
    recommendation:
      "Add a mobile hamburger menu with Sheet or Drawer component.",
    fixed: false,
  },
  {
    id: "RT-024",
    title: "Social icon buttons lack accessible labels",
    severity: "MEDIUM",
    category: "Accessibility",
    description:
      "Twitter, GitHub, and LinkedIn icon links in the footer have no aria-label or screen reader text. They are invisible to assistive technology.",
    location: "app/page.tsx:643-651",
    recommendation:
      "Add aria-label='Twitter', aria-label='GitHub', aria-label='LinkedIn' to each anchor.",
    fixed: false,
  },
  {
    id: "RT-025",
    title: "Notification bell button does nothing",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The dashboard header has a notification bell with a '3' badge count, but clicking it does nothing -- no dropdown, no link to /monitoring.",
    location: "components/dashboard/dashboard-header.tsx:75-79",
    recommendation:
      "Link to /monitoring or add a dropdown showing recent alerts.",
    fixed: false,
  },
  {
    id: "RT-026",
    title: "Sign out button does nothing",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The sidebar user dropdown has a 'Sign out' menu item with no onClick handler. Users who want to sign out cannot.",
    location: "components/dashboard/app-sidebar.tsx:163",
    recommendation:
      "Wire to auth signout or redirect to /sign-in with session cleared.",
    fixed: false,
  },
  {
    id: "RT-027",
    title: "Middleware API auth is easily bypassed",
    severity: "HIGH",
    category: "Technical Debt",
    description:
      "The middleware skips API key validation if the request's referer or origin header contains the hostname. This means any request with a spoofed Referer header bypasses auth entirely. The key validation only checks the 'scr_' prefix -- there is no actual key lookup against a database.",
    location: "middleware.ts:49-63",
    recommendation:
      "Remove the referer bypass. Implement real API key validation against a database. Use proper session-based auth for dashboard API calls.",
    fixed: false,
  },
  {
    id: "RT-028",
    title: "New flow wizard always redirects to flow-1",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "Both handleGenerate() and handleTemplateSelect() hardcode router.push('/flows/flow-1'). No matter what URL or prompt the user enters, they always end up on the same pre-baked flow. The 'AI generation' is a setTimeout fake.",
    location: "app/(dashboard)/flows/new/page.tsx:72-82",
    recommendation:
      "Generate unique flow IDs and create actual flow state. At minimum, create a new mock flow based on user input.",
    fixed: false,
  },
  {
    id: "RT-029",
    title: "Playground is fully faked with hardcoded responses",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The playground chat always shows the same preloaded conversation and output regardless of the URL entered. The 'AI' is a sequence of delayed addMessage() calls with hardcoded strings. Follow-up messages always return the same generic response.",
    location: "app/(dashboard)/playground/page.tsx:61-127",
    recommendation:
      "Wire to a real scraping/extraction API endpoint, even if rate-limited for the free tier.",
    fixed: false,
  },
  {
    id: "RT-030",
    title: "Hardcoded dates throughout the codebase",
    severity: "LOW",
    category: "Technical Debt",
    description:
      "Multiple files hardcode new Date('2026-03-18T18:30:00Z') as 'now' for relative time calculations. This means all time displays are frozen. If someone visits the site on any other date, all times will be wrong ('2d ago' when it should be months ago).",
    location: "dashboard/page.tsx:192, flows/page.tsx:70, flows/[id]/page.tsx:103, runs/page.tsx:160, monitoring/page.tsx:96, api-keys/page.tsx:76",
    recommendation:
      "Use actual Date.now() for time calculations. The mock data dates should be generated relative to the current date.",
    fixed: false,
  },
  {
    id: "RT-031",
    title: "Docs sidebar links lead to non-existent pages",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The docs layout sidebar has links to /docs/quickstart, /docs/concepts, /docs/api-reference, /docs/guides, /docs/templates. If these pages don't exist, users navigating the docs see 404s.",
    location: "app/(docs)/layout.tsx:7-13",
    recommendation:
      "Create stub pages for each docs section or mark unfinished ones as 'Coming soon'.",
    fixed: false,
  },
  {
    id: "RT-032",
    title: "API docs link points to /docs/api which may not exist",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The API Keys page has a 'View API Docs' button linking to /docs/api. The docs sidebar uses /docs/api-reference. These are different routes -- at least one is wrong.",
    location: "app/(dashboard)/api-keys/page.tsx:408",
    recommendation:
      "Standardize the API docs route and ensure it resolves to a real page.",
    fixed: false,
  },
  {
    id: "RT-033",
    title: "Runs page table rows lack React keys on fragments",
    severity: "LOW",
    category: "Technical Debt",
    description:
      "The runs page renders expandable table rows using bare <> fragments. React requires keys on all sibling elements. The key is on the TableRow but the fragment wrapper doesn't have one, which can cause rendering issues.",
    location: "app/(dashboard)/runs/page.tsx:371-485",
    recommendation:
      "Use <Fragment key={run.id}> instead of bare <>.",
    fixed: false,
  },
  {
    id: "RT-034",
    title: "Pricing page has no navigation bar",
    severity: "MEDIUM",
    category: "UX",
    description:
      "The standalone /pricing page (PricingContent) has no navigation header at all -- no logo, no links, no way to get back to the home page or sign up. Users who arrive from a direct link are stranded.",
    location: "components/pricing/pricing-content.tsx",
    recommendation:
      "Add the same nav bar used on the landing page, or at minimum a back link.",
    fixed: false,
  },
  {
    id: "RT-035",
    title: "Settings page pricing doesn't match pricing page",
    severity: "LOW",
    category: "Credibility",
    description:
      "The settings billing tab shows plans: Free $0, Starter $19, Professional $49, Enterprise Custom. The pricing page shows: Free $0, Pro $29, Enterprise Custom. Different plan names and prices across the product erode trust.",
    location: "app/(dashboard)/settings/page.tsx:73-78 vs components/pricing/pricing-content.tsx:21-81",
    recommendation:
      "Standardize plan names and pricing across all pages.",
    fixed: false,
  },
]

const severityConfig: Record<Severity, { icon: typeof AlertOctagon; color: string; bg: string }> = {
  CRITICAL: { icon: AlertOctagon, color: "text-red-600 dark:text-red-400", bg: "bg-red-600 text-white border-red-600" },
  HIGH: { icon: AlertTriangle, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500 text-white border-orange-500" },
  MEDIUM: { icon: ShieldAlert, color: "text-yellow-500 dark:text-yellow-400", bg: "bg-yellow-600 text-white border-yellow-600" },
  LOW: { icon: Info, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-600 text-white border-blue-600" },
}

const categoryColors: Record<string, string> = {
  "Dead Functionality": "bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400",
  "Credibility": "bg-purple-500/15 text-purple-600 border-purple-500/25 dark:text-purple-400",
  "Dark Mode": "bg-indigo-500/15 text-indigo-600 border-indigo-500/25 dark:text-indigo-400",
  "UX": "bg-cyan-500/15 text-cyan-600 border-cyan-500/25 dark:text-cyan-400",
  "Accessibility": "bg-pink-500/15 text-pink-600 border-pink-500/25 dark:text-pink-400",
  "Technical Debt": "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  "Competitive Gap": "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
}

function countBySeverity(severity: Severity) {
  return findings.filter((f) => f.severity === severity).length
}

function countFixed() {
  return findings.filter((f) => f.fixed).length
}

export default function RedTeamPage() {
  const criticalCount = countBySeverity("CRITICAL")
  const highCount = countBySeverity("HIGH")
  const mediumCount = countBySeverity("MEDIUM")
  const lowCount = countBySeverity("LOW")
  const fixedCount = countFixed()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Red Team Report
        </h1>
        <p className="text-muted-foreground mt-1">
          Brutal, honest assessment of every broken, fake, or missing piece in Scraper.bot.
          Audit date: March 18, 2026.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="py-4 border-l-4 border-l-red-600">
          <CardContent>
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-orange-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">High</p>
            <p className="text-3xl font-bold text-orange-500">{highCount}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-yellow-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">Medium</p>
            <p className="text-3xl font-bold text-yellow-500">{mediumCount}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-blue-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">Low</p>
            <p className="text-3xl font-bold text-blue-500">{lowCount}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-emerald-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">Fixed</p>
            <p className="text-3xl font-bold text-emerald-500">
              {fixedCount}/{findings.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Findings */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">
          All Findings ({findings.length})
        </h2>
        <div className="space-y-4">
          {findings.map((finding) => {
            const sev = severityConfig[finding.severity]
            const SevIcon = sev.icon
            return (
              <Card
                key={finding.id}
                className={cn(
                  "border-l-4",
                  finding.severity === "CRITICAL" && "border-l-red-600",
                  finding.severity === "HIGH" && "border-l-orange-500",
                  finding.severity === "MEDIUM" && "border-l-yellow-500",
                  finding.severity === "LOW" && "border-l-blue-500",
                  finding.fixed && "opacity-50"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <SevIcon className={cn("size-5 mt-0.5 shrink-0", sev.color)} />
                      <div>
                        <CardTitle className="text-base font-semibold leading-tight text-foreground">
                          {finding.id}: {finding.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={sev.bg}>{finding.severity}</Badge>
                          <Badge className={categoryColors[finding.category] || ""}>
                            {finding.category}
                          </Badge>
                          {finding.fixed && (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400">
                              Fixed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {finding.description}
                  </p>
                  <div className="rounded-md bg-muted/50 p-3 text-xs font-mono text-muted-foreground">
                    {finding.location}
                  </div>
                  <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-foreground">
                    <span className="font-semibold">Recommendation:</span>{" "}
                    {finding.recommendation}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Competitive Gap Analysis */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">
          Competitive Gap Analysis
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ExternalLink className="size-4" />
                Parse.bot Advantages
              </CardTitle>
              <CardDescription>What they have that we don't</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Browserless execution</span> --
                    10-100x faster than headless browser. HTTP-level extraction means sub-second responses, not 5-15 second Puppeteer runs.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Deterministic APIs</span> --
                    Every parser becomes a versioned, typed, cacheable REST endpoint. Not just data extraction -- an API product.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">MCP integration</span> --
                    Parsers work as Model Context Protocol servers, enabling AI agents to use web data natively.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Hosted endpoints</span> --
                    Real, live API endpoints you can curl right now. Not a demo, not a screenshot.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ExternalLink className="size-4" />
                Notte Advantages
              </CardTitle>
              <CardDescription>What they have that we don't</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Real browser infrastructure</span> --
                    Actual headless browser fleet with fingerprint rotation, residential proxies, and anti-detection.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Agent orchestration</span> --
                    AI agents that can reason, plan multi-step workflows, and recover from failures autonomously.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Digital personas</span> --
                    Browser sessions that maintain persistent identity, cookies, and history across runs.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">CAPTCHA solving</span> --
                    Built-in CAPTCHA bypass, not just claimed in marketing copy.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium text-foreground">Serverless edge compute</span> --
                    Runs execute at the edge with zero cold start. Real infrastructure, not setTimeout().
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Our Gaps</CardTitle>
              <CardDescription>What we're missing vs. both competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">No real scraping engine</span> --
                    The entire product is mock data and setTimeout() calls. Nothing actually scrapes anything.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">No real authentication</span> --
                    Auth forms console.log credentials. No sessions, no JWT, no user state.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">No real database</span> --
                    All state is mock-data.ts constants. Refreshing the page resets everything.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">No real AI</span> --
                    The "AI generation" is a hardcoded timeout that always routes to the same flow. The playground chat is a script.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">All mock data</span> --
                    Flows, runs, alerts, API keys, team members, usage charts -- every single data point is hardcoded fiction.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Assessment */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold text-foreground">
            Risk Assessment: What Would Make a User Leave After 5 Minutes?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">00:00</span>
              <span>
                User lands on homepage. Looks polished. Clicks "Get Started Free". Arrives at sign-up page. Fills out form. Clicks "Create Account".{" "}
                <span className="font-semibold text-red-500">Nothing happens.</span>{" "}
                Opens console, sees their password logged in plaintext. Trust destroyed.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">00:30</span>
              <span>
                User tries Google OAuth button.{" "}
                <span className="font-semibold text-red-500">Nothing happens.</span>{" "}
                Tries GitHub button.{" "}
                <span className="font-semibold text-red-500">Nothing happens.</span>{" "}
                User is now suspicious.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">01:00</span>
              <span>
                User navigates directly to /dashboard (no auth required -- middleware doesn't protect dashboard routes). Sees beautiful dashboard with
                pre-populated data. Clicks "Run" on a flow.{" "}
                <span className="font-semibold text-red-500">Nothing happens.</span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">02:00</span>
              <span>
                User goes to Playground. Enters their own URL. Gets back the same canned "example-store.com" response regardless of what they entered. Realizes the AI is fake.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">03:00</span>
              <span>
                User creates a flow. The "AI generation" spinner runs for 2.5 seconds, then dumps them on a pre-built flow they didn't ask for. Every input they provided was ignored.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">04:00</span>
              <span>
                User Googles "Sarah Johnson VP Engineering DataStack" from the testimonials. No results. Googles "DataStack" and "MarketPulse". Fake companies.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-red-500 font-bold shrink-0">05:00</span>
              <span>
                <span className="font-semibold text-red-500">User leaves.</span>{" "}
                Goes to Parse.bot or Notte and gets a working product. Never comes back.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

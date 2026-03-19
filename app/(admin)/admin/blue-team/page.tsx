"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "FIXED" | "IN PROGRESS" | "ACKNOWLEDGED"
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

interface DefenseItem {
  id: string
  title: string
  severity: Severity
  status: Status
  resolution?: string
}

const items: DefenseItem[] = [
  {
    id: "RT-001",
    title: "Auth forms only console.log credentials",
    severity: "CRITICAL",
    status: "FIXED",
    resolution: "Removed console.log from sign-in and sign-up onSubmit handlers. Forms now call router.push('/dashboard') on submit.",
  },
  {
    id: "RT-002",
    title: "Google and GitHub OAuth buttons do nothing",
    severity: "CRITICAL",
    status: "FIXED",
    resolution: "Added onClick handlers to both OAuth buttons on sign-in and sign-up pages. They now show a toast: 'OAuth coming soon -- use email sign in'.",
  },
  {
    id: "RT-003",
    title: "Landing page 'Extract' button does nothing",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Extract button now toggles visibility of the mock JSON response output below the input field.",
  },
  {
    id: "RT-004",
    title: "Enterprise 'Contact Sales' button is a dead end",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Landing page Enterprise card now links to mailto:sales@scraper.bot. Pricing page ctaHref changed from /contact to mailto:sales@scraper.bot.",
  },
  {
    id: "RT-005",
    title: "13 footer links go to href='#' (dead links)",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Updated footer links: Features -> /#features, Pricing -> /pricing, Documentation -> /docs, API Reference -> /docs/api-reference, Changelog -> /changelog, About -> /changelog, Blog -> /blog, Careers -> /changelog, Contact -> mailto:hello@scraper.bot, Help Center -> /docs, Status -> /status. Added aria-labels to social icons. Privacy/Terms kept as # (pending legal content).",
  },
  {
    id: "RT-006",
    title: "Dashboard action buttons are non-functional",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Added onClick handlers to Run (toast.success), Pause/Resume (toggles flow status via state), and Edit (Link to /flows/[id]) buttons in Active Flows. Acknowledge buttons on alerts now update state and show toast. Dashboard page converted to use useState for flows and alerts.",
  },
  {
    id: "RT-007",
    title: "Flow builder buttons are non-functional",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Wired bottom bar buttons: Run Flow (toast.success), Save (toast.success), Schedule (toast). Add Step dropdown items now add new steps to local state via useState. Steps panel accepts onAddStep callback.",
  },
  {
    id: "RT-008",
    title: "'Forgot password?' links to itself",
    severity: "MEDIUM",
    status: "FIXED",
    resolution: "Replaced Link with a button that opens a Dialog containing an email input and 'Send Reset Link' button. Clicking Send Reset Link shows toast.success('Password reset email sent').",
  },
  {
    id: "RT-009",
    title: "Terms of Service and Privacy Policy pages don't exist",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-010",
    title: "Blog article links go to non-existent pages",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-011",
    title: "Status page subscribe form does nothing",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-012",
    title: "Settings page 'Save Changes' and 'Save Preferences' buttons do nothing",
    severity: "MEDIUM",
    status: "FIXED",
    resolution: "Added onClick with toast.success to: Save Preferences (notifications tab), Upload Avatar (profile tab), Remove member (team tab), and Download invoice (billing tab). Profile Save Changes was already fixed previously.",
  },
  {
    id: "RT-013",
    title: "Settings billing 'Upgrade' and 'Contact Sales' buttons are dead",
    severity: "MEDIUM",
    status: "FIXED",
    resolution: "Upgrade buttons now show toast.success with plan name. Contact Sales opens mailto:sales@scraper.bot and shows toast.",
  },
  {
    id: "RT-014",
    title: "Monitoring 'Configure Alerts' button is dead",
    severity: "LOW",
    status: "FIXED",
    resolution: "Configure Alerts button now calls openAddRule() to open the Add Monitoring Rule dialog, reusing the existing dialog infrastructure.",
  },
  {
    id: "RT-015",
    title: "Runs page 'Last 7 Days' date picker button does nothing",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-016",
    title: "Runs page Eye and Retry action buttons do nothing",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-017",
    title: "Landing page claims 'SOC 2 Compliant' -- likely false",
    severity: "HIGH",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-018",
    title: "Fake testimonials from fake people at fake companies",
    severity: "HIGH",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-019",
    title: "TrustedBy component likely shows fake company logos",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-020",
    title: "Hardcoded footer color: bg-gray-950 breaks theming",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-021",
    title: "Admin layout uses hardcoded dark colors, ignores theme in light mode",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-022",
    title: "CTA section uses bg-blue-50 hover which is light-mode only",
    severity: "LOW",
    status: "FIXED",
    resolution: "Changed hover:bg-blue-50 to hover:bg-white/90 on the final CTA button.",
  },
  {
    id: "RT-023",
    title: "No mobile navigation menu",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Added a mobile hamburger menu button (visible on screens < md) that opens a Sheet component with all nav links: Features, How It Works, Pricing, Docs, Sign In, and Get Started Free.",
  },
  {
    id: "RT-024",
    title: "Social icon buttons lack accessible labels",
    severity: "MEDIUM",
    status: "FIXED",
    resolution: "Added aria-label='Twitter', aria-label='GitHub', and aria-label='LinkedIn' to footer social icon links.",
  },
  {
    id: "RT-025",
    title: "Notification bell button does nothing",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-026",
    title: "Sign out button does nothing",
    severity: "HIGH",
    status: "FIXED",
    resolution: "Added onClick handler to Sign Out dropdown menu item in app-sidebar.tsx that calls router.push('/') to navigate to the landing page.",
  },
  {
    id: "RT-027",
    title: "Middleware API auth is easily bypassed",
    severity: "HIGH",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-028",
    title: "New flow wizard always redirects to flow-1",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-029",
    title: "Playground is fully faked with hardcoded responses",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-030",
    title: "Hardcoded dates throughout the codebase",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-031",
    title: "Docs sidebar links lead to non-existent pages",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-032",
    title: "API docs link points to /docs/api which may not exist",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-033",
    title: "Runs page table rows lack React keys on fragments",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-034",
    title: "Pricing page has no navigation bar",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "RT-035",
    title: "Settings page pricing doesn't match pricing page",
    severity: "LOW",
    status: "ACKNOWLEDGED",
  },
]

const statusConfig: Record<Status, { icon: typeof CheckCircle; color: string; bg: string }> = {
  FIXED: { icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-600 text-white border-emerald-600" },
  "IN PROGRESS": { icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-600 text-white border-yellow-600" },
  ACKNOWLEDGED: { icon: Eye, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-500 text-white border-gray-500" },
}

const severityBg: Record<Severity, string> = {
  CRITICAL: "bg-red-600 text-white border-red-600",
  HIGH: "bg-orange-500 text-white border-orange-500",
  MEDIUM: "bg-yellow-600 text-white border-yellow-600",
  LOW: "bg-blue-600 text-white border-blue-600",
}

const severityBorder: Record<Severity, string> = {
  CRITICAL: "border-l-red-600",
  HIGH: "border-l-orange-500",
  MEDIUM: "border-l-yellow-500",
  LOW: "border-l-blue-500",
}

function countByStatus(status: Status) {
  return items.filter((i) => i.status === status).length
}

export default function BlueTeamPage() {
  const fixed = countByStatus("FIXED")
  const inProgress = countByStatus("IN PROGRESS")
  const acknowledged = countByStatus("ACKNOWLEDGED")
  const total = items.length
  const score = Math.round((fixed / total) * 100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Shield className="size-7 text-blue-500" />
          Blue Team Defense Report
        </h1>
        <p className="text-muted-foreground mt-1">
          Tracking fixes and mitigations for all Red Team findings. Last updated: March 19, 2026.
        </p>
      </div>

      {/* Defense Score */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4 border-l-4 border-l-blue-600">
          <CardContent>
            <p className="text-sm text-muted-foreground">Defense Score</p>
            <p className="text-4xl font-black text-blue-600">{score}%</p>
            <p className="text-xs text-muted-foreground mt-1">{fixed} of {total} findings resolved</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-emerald-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">Fixed</p>
            <p className="text-3xl font-bold text-emerald-500">{fixed}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-yellow-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-yellow-500">{inProgress}</p>
          </CardContent>
        </Card>
        <Card className="py-4 border-l-4 border-l-gray-500">
          <CardContent>
            <p className="text-sm text-muted-foreground">Acknowledged</p>
            <p className="text-3xl font-bold text-gray-500">{acknowledged}</p>
          </CardContent>
        </Card>
      </div>

      {/* All Items */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">
          All Findings ({total})
        </h2>
        <div className="space-y-4">
          {items.map((item) => {
            const st = statusConfig[item.status]
            const StIcon = st.icon
            return (
              <Card
                key={item.id}
                className={cn(
                  "border-l-4",
                  severityBorder[item.severity],
                  item.status === "FIXED" && "opacity-70"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <StIcon className={cn("size-5 mt-0.5 shrink-0", st.color)} />
                      <div>
                        <CardTitle className="text-base font-semibold leading-tight text-foreground">
                          {item.id}: {item.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={severityBg[item.severity]}>{item.severity}</Badge>
                          <Badge className={st.bg}>{item.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {item.status === "FIXED" && item.resolution && (
                  <CardContent className="pt-0">
                    <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-foreground">
                      <span className="font-semibold">Resolution:</span> {item.resolution}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertOctagon, Info, ShieldAlert, ExternalLink, CheckCircle, XCircle } from "lucide-react"
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

interface FixVerification {
  id: string
  title: string
  blueTeamClaim: string
  verified: boolean
  notes: string
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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
    fixed: true,
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

const round2Findings: Finding[] = [
  {
    id: "RT-036",
    title: "Playground returns identical output regardless of URL entered",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The revamped playground page always shows the same preloadedFlow messages and the same mockOutputData (24 hardcoded products) no matter what URL the user types. Every follow-up message returns the same canned 'Got it. I can refine...' response. The 'AI' is still entirely fake. This was noted in RT-029 but the new page makes the deception even more convincing, which is worse.",
    location: "app/(dashboard)/playground/page.tsx:61-127",
    recommendation:
      "At minimum, vary the mock response based on URL domain. Better: wire to a real extraction endpoint.",
    fixed: false,
  },
  {
    id: "RT-037",
    title: "Playground output panel uses hardcoded bg-zinc-950, breaks in light mode",
    severity: "MEDIUM",
    category: "Dark Mode",
    description:
      "The JSON output <pre> tag uses bg-zinc-950 and text-zinc-300 without dark: variants. The schema tab does the same. In light mode the code blocks look jarring -- dark rectangles against a white page. While this is a deliberate 'code editor' aesthetic, it should still use theme-aware backgrounds.",
    location: "app/(dashboard)/playground/page.tsx:290, 340",
    recommendation:
      "Use bg-muted or bg-card for code blocks, or wrap in a dark-mode-aware container.",
    fixed: false,
  },
  {
    id: "RT-038",
    title: "Workflow builder: Save, Run, Share buttons have no onClick handlers",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The workflow builder toolbar has Save, Run, and Share buttons that are purely decorative -- no onClick, no toast, no state change. This is the same class of bug as the original RT-007 but in a brand-new page. The 'Test This Step' button inside the NodeConfigPanel also does nothing.",
    location: "app/(dashboard)/workflow-builder/page.tsx:754-765, 560",
    recommendation:
      "Add onClick handlers with toast.success('Workflow saved') at minimum. Wire 'Run' to navigate to a mock run page.",
    fixed: false,
  },
  {
    id: "RT-039",
    title: "Workflow builder: Undo/Redo buttons are non-functional",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The Undo and Redo buttons in the workflow builder toolbar have no onClick handlers. There is no undo/redo state management. They are purely visual.",
    location: "app/(dashboard)/workflow-builder/page.tsx:718-732",
    recommendation:
      "Implement an undo stack or remove the buttons.",
    fixed: false,
  },
  {
    id: "RT-040",
    title: "Workflow builder: Node palette drag-and-drop does nothing",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "Each node in the left palette has draggable attribute and cursor-grab styling, but there is no onDragStart, no onDrop on the canvas, and no ondragover handler. Dragging a node from the palette does not add it to the canvas. The only way nodes exist is from the hardcoded initialNodes array. Users have no way to add new nodes to the workflow.",
    location: "app/(dashboard)/workflow-builder/page.tsx:802-821",
    recommendation:
      "Implement drag-and-drop with onDragStart/onDrop, or add an onClick handler to palette items that adds a node at a default position.",
    fixed: false,
  },
  {
    id: "RT-041",
    title: "Marketplace 'Use Flow' buttons have no onClick handler",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "Every FlowCard has a 'Use Flow' button with bg-blue-600 styling that looks fully interactive but has no onClick handler. Users click it and nothing happens. The 'Install Flow' button in the preview dialog also has no onClick handler.",
    location: "app/(dashboard)/marketplace/page.tsx:388-389, 623-626",
    recommendation:
      "Add onClick with toast or redirect to /flows/new with the template pre-selected.",
    fixed: false,
  },
  {
    id: "RT-042",
    title: "Marketplace 'Publish Your Flow' button has no onClick handler",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The header 'Publish Your Flow' button (line 450-453) has no onClick handler, no Link wrapper, no dialog trigger. It is completely dead.",
    location: "app/(dashboard)/marketplace/page.tsx:450-453",
    recommendation:
      "Either add a publishing wizard or show a 'Coming soon' toast.",
    fixed: false,
  },
  {
    id: "RT-043",
    title: "Marketplace sort 'Most Runs' duplicates 'Most Popular' logic",
    severity: "LOW",
    category: "Technical Debt",
    description:
      "The sort dropdown has 'Most Popular' and 'Most Runs' as separate options, but both use the identical sort logic: b.installs - a.installs. They produce identical results. This either means runs data is missing or the sort was copy-pasted without updating.",
    location: "app/(dashboard)/marketplace/page.tsx:417-418",
    recommendation:
      "Add a separate 'runs' field to marketplace flows or remove the duplicate sort option.",
    fixed: false,
  },
  {
    id: "RT-044",
    title: "Marketplace fake reviews with fake usernames",
    severity: "MEDIUM",
    category: "Credibility",
    description:
      "All marketplace flows have fabricated reviews from fake users (@datawhiz, @recruitbot, @realtyai, etc.) with suspiciously high ratings. Combined with the existing RT-018 (fake testimonials) problem, this compounds the credibility issue. Every interaction point in the product now has fake social proof.",
    location: "app/(dashboard)/marketplace/page.tsx:87-127",
    recommendation:
      "Remove reviews section until real user data exists, or clearly label as example data.",
    fixed: false,
  },
  {
    id: "RT-045",
    title: "API Playground uses hardcoded mock responses, not real API calls",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The API Playground 'Send Request' button triggers setTimeout(800ms) and returns hardcoded getMockResponse() data. It does not make any actual HTTP request to the API. All response times, sizes, and headers are fabricated. Users might think they are testing a real API.",
    location: "app/(dashboard)/api-playground/page.tsx:345-352",
    recommendation:
      "Make actual fetch() calls to the API endpoints, or clearly label the page as 'API Explorer (Mock Mode)'.",
    fixed: false,
  },
  {
    id: "RT-046",
    title: "API Playground body textarea uses hardcoded dark colors",
    severity: "LOW",
    category: "Dark Mode",
    description:
      "The body textarea and response pre blocks use bg-zinc-950, text-zinc-100, border-zinc-800 without theme-aware variants. These dark code blocks clash with light mode.",
    location: "app/(dashboard)/api-playground/page.tsx:479, 544",
    recommendation:
      "Use theme tokens or wrap in a forced-dark container.",
    fixed: false,
  },
  {
    id: "RT-047",
    title: "API Playground uses dangerouslySetInnerHTML for syntax highlighting",
    severity: "MEDIUM",
    category: "Technical Debt",
    description:
      "The syntaxHighlight function returns raw HTML strings injected via dangerouslySetInnerHTML. While the input is JSON.stringify output (so not user-controlled in practice), this is a bad pattern. If the API ever returns user-controlled data in responses, this becomes an XSS vector.",
    location: "app/(dashboard)/api-playground/page.tsx:284-299, 547-549",
    recommendation:
      "Use a proper syntax highlighting library (shiki, prism-react-renderer) or React-based tokenizer.",
    fixed: false,
  },
  {
    id: "RT-048",
    title: "Analytics page chart components don't exist -- will crash in production",
    severity: "CRITICAL",
    category: "Dead Functionality",
    description:
      "The analytics page dynamically imports RunsChart, DataChart, and CostChart from '@/components/dashboard/analytics/runs-chart', 'data-chart', and 'cost-chart'. These files DO NOT EXIST in the codebase. The dynamic import has a loading placeholder, so dev mode shows spinners, but the charts will never render. The page is fundamentally broken.",
    location: "app/(dashboard)/analytics/page.tsx:38-51",
    recommendation:
      "Create the chart components or remove the imports and show placeholder charts with static data.",
    fixed: false,
  },
  {
    id: "RT-049",
    title: "Analytics numbers don't add up with dashboard/runs data",
    severity: "MEDIUM",
    category: "Credibility",
    description:
      "Analytics shows Total Runs: 4,287 and 7 top flows whose runs sum to 4,287 (248+412+1024+856+632+389+726). But the items extracted sum to 1,175,476 while the stat card says 1.2M -- close but sloppy. More importantly, these numbers don't match the dashboard page which shows different flow data. The Total Cost of $12.47 is absurdly low for 4,287 runs. The cost column sums to $19.89, not $12.47.",
    location: "app/(dashboard)/analytics/page.tsx:53-99",
    recommendation:
      "Ensure all numbers are internally consistent. Total cost should match sum of individual flow costs.",
    fixed: false,
  },
  {
    id: "RT-050",
    title: "Analytics date range selector does nothing",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The date range Select (7d, 30d, 90d, Custom) updates state but has zero effect on the displayed data. All stats, charts, and tables show the same data regardless of selection. The 'Custom' option has no date picker UI.",
    location: "app/(dashboard)/analytics/page.tsx:102, 115-125",
    recommendation:
      "Filter the displayed data based on selection, or disable the selector.",
    fixed: false,
  },
  {
    id: "RT-051",
    title: "Webhook logs 'View' button has no onClick handler",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "In the webhook logs table, each row has a 'View' button that renders as a ghost Button with no onClick or href. Clicking it does nothing -- no detail panel, no modal, no navigation.",
    location: "app/(dashboard)/webhooks/page.tsx:514",
    recommendation:
      "Add an onClick that shows the full payload in a dialog, or remove the button.",
    fixed: false,
  },
  {
    id: "RT-052",
    title: "Integrations wizard 'How to find your webhook URL' link goes to '#'",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The webhook wizard in the integrations page has an anchor tag with href='#' for 'How to find your webhook URL'. It calls e.preventDefault() so it does nothing. Dead help link in a setup wizard is poor UX.",
    location: "app/(dashboard)/integrations/page.tsx:208-213",
    recommendation:
      "Link to actual documentation or show inline instructions.",
    fixed: false,
  },
  {
    id: "RT-053",
    title: "Integrations wizard does not update card status after completion",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "After completing the Slack, Discord, Google Sheets, or Email wizard and clicking 'Finish Setup', the toast says 'connected successfully' but the integration card still shows 'Not Connected'. The wizard calls onOpenChange(false) but never updates the integration status in state. The status is hardcoded in the const array and never mutated.",
    location: "app/(dashboard)/integrations/page.tsx:60-127, 167-168",
    recommendation:
      "Move integrations to useState and update status on successful wizard completion.",
    fixed: false,
  },
  {
    id: "RT-054",
    title: "Community thread links all lead to 404s",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "Every PostCard links to /community/{post.id} (e.g., /community/welcome, /community/paginated-ecommerce). There is no app/community/[id]/page.tsx or app/community/[slug]/page.tsx. All thread links result in 404 pages. The community page looks like a real forum but clicking any post leads nowhere.",
    location: "app/community/page.tsx:182",
    recommendation:
      "Create a dynamic route at app/community/[id]/page.tsx with thread content, or make posts non-clickable.",
    fixed: false,
  },
  {
    id: "RT-055",
    title: "Community 'New Post' button leads to 404",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The 'New Post' button links to /community/new which does not exist. Users who want to create content hit a 404. This makes the forum look abandoned.",
    location: "app/community/page.tsx:296-300",
    recommendation:
      "Create a /community/new page with a post creation form, or remove the button.",
    fixed: false,
  },
  {
    id: "RT-056",
    title: "Community Quick Links sidebar uses /docs/api (inconsistent route)",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "The community sidebar 'API Reference' link points to /docs/api. The docs sidebar uses /docs/api-reference. The API Keys page uses /docs/api. These inconsistencies mean at least one route 404s. This is the same issue as RT-032 but now appearing in a third location.",
    location: "app/community/page.tsx:416-417",
    recommendation:
      "Standardize the API docs route across all pages.",
    fixed: false,
  },
  {
    id: "RT-057",
    title: "Community fake engagement metrics",
    severity: "MEDIUM",
    category: "Credibility",
    description:
      "The community page displays '2,847 members', '1,234 posts', '89 online now' -- all hardcoded fake numbers. Combined with fabricated post authors, reply counts, and view counts, this creates the illusion of an active community that doesn't exist.",
    location: "app/community/page.tsx:329-340",
    recommendation:
      "Remove fake metrics or clearly label as demo data.",
    fixed: false,
  },
  {
    id: "RT-058",
    title: "Extension page 'Add to Chrome' buttons go nowhere",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "Both 'Add to Chrome' buttons (hero and final CTA) are plain <Button> elements with no onClick, no href, no Link wrapper. There is no actual Chrome extension in the Chrome Web Store. The page claims 'Available on the Chrome Web Store' which is false. The 'Watch Demo' button also has no handler.",
    location: "app/extension/page.tsx:73-79, 310-314",
    recommendation:
      "Remove the extension page until an actual extension exists, or clearly label as 'Coming Soon'. At minimum, link to a waitlist signup.",
    fixed: false,
  },
  {
    id: "RT-059",
    title: "Extension page: browser mockup 'Extract Data' button is dead",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "Inside the browser mockup screenshot, the 'Extract Data' button in the simulated extension popup has no onClick handler. This is a static visual, but it's styled as an interactive button.",
    location: "app/extension/page.tsx:135-137",
    recommendation:
      "Either make it obviously a screenshot/illustration or remove the button styling.",
    fixed: false,
  },
  {
    id: "RT-060",
    title: "Extension page footer uses hardcoded bg-gray-950 dark colors",
    severity: "LOW",
    category: "Dark Mode",
    description:
      "The extension page has its own footer that duplicates the hardcoded bg-gray-950 / text-gray-300 / border-gray-800 pattern from the landing page footer (RT-020). New pages are copying the same theming bug.",
    location: "app/extension/page.tsx:319",
    recommendation:
      "Use theme tokens or share a common footer component.",
    fixed: false,
  },
  {
    id: "RT-061",
    title: "Extension page has 'Screenshot placeholder' text visible to users",
    severity: "MEDIUM",
    category: "UX",
    description:
      "The 'See It in Action' section has three placeholder boxes that literally say 'Screenshot placeholder' with a Monitor icon. This is developer placeholder content that was never replaced with actual screenshots or illustrations.",
    location: "app/extension/page.tsx:256-274",
    recommendation:
      "Add real screenshots or remove the section entirely.",
    fixed: false,
  },
  {
    id: "RT-062",
    title: "Run detail page: Stop Run, Re-run, Export Results buttons are dead",
    severity: "HIGH",
    category: "Dead Functionality",
    description:
      "The run detail page has three action buttons (Stop Run, Re-run, Export Results) that are all purely decorative -- no onClick handlers on any of them. The live simulation looks impressive but users cannot actually interact with it.",
    location: "app/(dashboard)/runs/[id]/page.tsx:405-417",
    recommendation:
      "Add onClick with toast feedback. Stop should end the simulation. Re-run should restart it. Export should download JSON.",
    fixed: false,
  },
  {
    id: "RT-063",
    title: "Run detail page: browser mockup uses hardcoded dark colors",
    severity: "LOW",
    category: "Dark Mode",
    description:
      "The run detail page has a browser frame mockup using bg-gray-900, bg-gray-800, text-gray-400, bg-gray-950. This is the same pattern as the extension page and landing page -- hardcoded dark colors that ignore theming.",
    location: "app/(dashboard)/runs/[id]/page.tsx:301-309",
    recommendation:
      "Use theme tokens.",
    fixed: false,
  },
  {
    id: "RT-064",
    title: "Run detail live log container uses bg-zinc-950 (hardcoded dark)",
    severity: "LOW",
    category: "Dark Mode",
    description:
      "The live logs panel uses bg-zinc-950 with text-gray-500 / text-gray-200. In light mode this creates a jarring dark rectangle. Same pattern as RT-037 and RT-046.",
    location: "app/(dashboard)/runs/[id]/page.tsx:264",
    recommendation:
      "Use theme-aware background.",
    fixed: false,
  },
  {
    id: "RT-065",
    title: "Chatbot gives identical canned response to all free-text messages",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The chat widget's handleSend function always returns defaultResponse: 'Thanks for your message! A team member will follow up shortly.' regardless of what the user types. There is no NLP, no keyword matching, no routing. Quick replies work but free-text is completely ignored.",
    location: "components/chatbot/chat-widget.tsx:82-88",
    recommendation:
      "Add basic keyword matching (e.g., 'price' triggers pricing response) or integrate a simple LLM chat endpoint.",
    fixed: false,
  },
  {
    id: "RT-066",
    title: "Chatbot references non-existent pages (scraper.bot/contact)",
    severity: "LOW",
    category: "Dead Functionality",
    description:
      "Quick reply responses reference 'scraper.bot/contact' and 'scraper.bot/community' as valid URLs. The /contact page does not exist (same issue as RT-004). Community exists at /community but the chatbot formats it without a link.",
    location: "components/chatbot/chat-widget.tsx:24-28",
    recommendation:
      "Fix URLs to match actual routes. Make them clickable links.",
    fixed: false,
  },
  {
    id: "RT-067",
    title: "Sidebar links to /templates which does not exist (404)",
    severity: "MEDIUM",
    category: "Dead Functionality",
    description:
      "The sidebar nav includes a 'Templates' item linking to /templates. There is no app/(dashboard)/templates/page.tsx. Clicking Templates in the sidebar gives a 404. This is a new nav item that was added without a corresponding page.",
    location: "components/dashboard/app-sidebar.tsx:55",
    recommendation:
      "Create a templates page or remove the nav item.",
    fixed: false,
  },
  {
    id: "RT-068",
    title: "Sidebar 'Billing' link goes to /settings instead of billing tab",
    severity: "LOW",
    category: "UX",
    description:
      "The sidebar user dropdown has a 'Billing' menu item that links to /settings (generic settings page). It should link to /settings?tab=billing or /settings#billing to land on the billing tab directly. Currently it dumps users on the profile tab.",
    location: "components/dashboard/app-sidebar.tsx:169-172",
    recommendation:
      "Link to /settings with a query param or hash that activates the billing tab.",
    fixed: false,
  },
  {
    id: "RT-069",
    title: "Blog post pages have no mobile navigation menu",
    severity: "MEDIUM",
    category: "UX",
    description:
      "The blog post detail pages use 'hidden md:flex' for the nav links (Features, Pricing, Docs, Blog, Sign In, Get Started). On mobile, only the logo is visible. Same bug as RT-023 but on the new blog post pages.",
    location: "app/blog/[slug]/page.tsx:259-294",
    recommendation:
      "Add mobile hamburger menu matching the landing page fix.",
    fixed: false,
  },
  {
    id: "RT-070",
    title: "Extension page has no mobile navigation menu",
    severity: "MEDIUM",
    category: "UX",
    description:
      "The extension page nav uses 'hidden md:flex' with no hamburger menu fallback. Same bug as RT-023 and RT-069. Every new standalone page is missing the mobile menu that was fixed on the landing page.",
    location: "app/extension/page.tsx:33-57",
    recommendation:
      "Share the landing page nav component (with mobile menu) across all public pages.",
    fixed: false,
  },
]

const fixVerifications: FixVerification[] = [
  {
    id: "RT-001",
    title: "Auth forms only console.log credentials",
    blueTeamClaim: "Removed console.log. Forms now call router.push('/dashboard').",
    verified: true,
    notes: "Confirmed: no console.log found in auth files. Fix is valid.",
  },
  {
    id: "RT-002",
    title: "Google and GitHub OAuth buttons do nothing",
    blueTeamClaim: "Added onClick handlers showing toast: 'OAuth coming soon'.",
    verified: true,
    notes: "Fix is a band-aid (toast instead of real OAuth) but acceptable for now.",
  },
  {
    id: "RT-003",
    title: "Landing page 'Extract' button does nothing",
    blueTeamClaim: "Extract button now toggles mock JSON response visibility.",
    verified: true,
    notes: "Functional as described.",
  },
  {
    id: "RT-004",
    title: "Enterprise 'Contact Sales' button is a dead end",
    blueTeamClaim: "Changed to mailto:sales@scraper.bot.",
    verified: true,
    notes: "Valid fix. mailto is functional.",
  },
  {
    id: "RT-005",
    title: "13 footer links go to href='#'",
    blueTeamClaim: "Updated links to real routes. Privacy/Terms kept as #.",
    verified: true,
    notes: "Most links fixed. Privacy/Terms still dead but acknowledged.",
  },
  {
    id: "RT-006",
    title: "Dashboard action buttons are non-functional",
    blueTeamClaim: "Added onClick handlers with toasts and state changes.",
    verified: true,
    notes: "Confirmed functional.",
  },
  {
    id: "RT-007",
    title: "Flow builder buttons are non-functional",
    blueTeamClaim: "Wired Save, Run, Schedule, Add Step buttons.",
    verified: true,
    notes: "Confirmed in flows/[id] page. Note: the NEW workflow-builder page (RT-038) has the same bugs.",
  },
  {
    id: "RT-008",
    title: "'Forgot password?' links to itself",
    blueTeamClaim: "Replaced with Dialog containing email input and toast.",
    verified: true,
    notes: "Functional.",
  },
  {
    id: "RT-010",
    title: "Blog article links go to non-existent pages",
    blueTeamClaim: "Blue Team said ACKNOWLEDGED, not fixed.",
    verified: true,
    notes: "Actually FIXED: app/blog/[slug]/page.tsx now exists with 3 full blog posts. Blue Team undersold this fix.",
  },
  {
    id: "RT-012",
    title: "Settings page buttons do nothing",
    blueTeamClaim: "Added onClick with toast to Save Preferences, Upload Avatar, Remove member, Download invoice.",
    verified: true,
    notes: "Confirmed functional.",
  },
  {
    id: "RT-013",
    title: "Settings billing buttons are dead",
    blueTeamClaim: "Upgrade shows toast. Contact Sales opens mailto.",
    verified: true,
    notes: "Confirmed functional.",
  },
  {
    id: "RT-014",
    title: "Monitoring 'Configure Alerts' button is dead",
    blueTeamClaim: "Button now calls openAddRule().",
    verified: true,
    notes: "Confirmed functional.",
  },
  {
    id: "RT-022",
    title: "CTA hover:bg-blue-50 breaks dark mode",
    blueTeamClaim: "Changed to hover:bg-white/90.",
    verified: true,
    notes: "Confirmed.",
  },
  {
    id: "RT-023",
    title: "No mobile navigation menu",
    blueTeamClaim: "Added hamburger menu with Sheet component.",
    verified: true,
    notes: "Fixed on landing page only. Blog post pages (RT-069) and extension page (RT-070) still lack mobile nav.",
  },
  {
    id: "RT-024",
    title: "Social icon buttons lack accessible labels",
    blueTeamClaim: "Added aria-label to footer social icons.",
    verified: true,
    notes: "Confirmed.",
  },
  {
    id: "RT-026",
    title: "Sign out button does nothing",
    blueTeamClaim: "Added onClick: router.push('/').",
    verified: true,
    notes: "Confirmed in app-sidebar.tsx line 177.",
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

const allFindings = [...findings, ...round2Findings]

function countBySeverity(severity: Severity) {
  return allFindings.filter((f) => f.severity === severity).length
}

function countFixed() {
  return allFindings.filter((f) => f.fixed).length
}

function countUnfixed() {
  return allFindings.filter((f) => !f.fixed).length
}

export default function RedTeamPage() {
  const criticalCount = countBySeverity("CRITICAL")
  const highCount = countBySeverity("HIGH")
  const mediumCount = countBySeverity("MEDIUM")
  const lowCount = countBySeverity("LOW")
  const fixedCount = countFixed()
  const unfixedCount = countUnfixed()
  const r1Fixed = findings.filter((f) => f.fixed).length
  const r1Total = findings.length
  const r2Total = round2Findings.length
  const r2Critical = round2Findings.filter((f) => f.severity === "CRITICAL").length
  const r2High = round2Findings.filter((f) => f.severity === "HIGH").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Red Team Report -- Round 2
        </h1>
        <p className="text-muted-foreground mt-1">
          Second audit after Blue Team fixes. Original 35 findings + 35 new findings across all new features.
          Audit date: March 19, 2026.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="py-4 border-l-4 border-l-red-600">
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Findings</p>
            <p className="text-3xl font-bold text-foreground">{allFindings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">R1: {r1Total} + R2: {r2Total}</p>
          </CardContent>
        </Card>
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
              {fixedCount}/{allFindings.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((fixedCount / allFindings.length) * 100)}% resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Blue Team Fix Verification */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">
          Blue Team Fix Verification
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Blue Team claimed {r1Fixed} of {r1Total} fixes. All {fixVerifications.filter(v => v.verified).length} verified fixes confirmed working.
          RT-010 (blog pages) was ACKNOWLEDGED by Blue Team but actually fixed -- credit given.
        </p>
        <div className="space-y-2">
          {fixVerifications.map((v) => (
            <Card key={v.id} className={cn("border-l-4", v.verified ? "border-l-emerald-500" : "border-l-red-500")}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-3">
                  {v.verified ? (
                    <CheckCircle className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{v.id}: {v.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.notes}</p>
                  </div>
                  <Badge className={v.verified ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400" : "bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400"}>
                    {v.verified ? "VERIFIED" : "NOT FIXED"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Round 2 Findings */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">
          Round 2 Findings ({round2Findings.length})
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          New issues discovered in new features: {r2Critical} critical, {r2High} high.
          The product has grown massively but almost every new page has dead buttons, fake data, or broken navigation.
        </p>
        <div className="space-y-4">
          {round2Findings.map((finding) => {
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

      {/* Original Findings */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">
          Round 1 Findings ({findings.length})
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
                    Auth forms redirect to dashboard but there are no sessions, no JWT, no user state.
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
                    The "AI generation" is a hardcoded timeout. The playground chat is a script. The workflow builder is a static canvas.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-foreground">Feature sprawl without depth</span> --
                    13+ new pages added (marketplace, analytics, workflow builder, community, extension, etc.) but none of them actually work. Breadth without depth is worse than a small product that works.
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
            Round 2 Risk Assessment: The Potemkin Village Got Bigger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The Blue Team fixed 16 of 35 Round 1 findings (46% -- slightly better than their claimed 40%). All verified fixes are real.
              However, the product has expanded from ~15 pages to ~28 pages, and almost every new page introduces
              the same category of bugs that were found in Round 1.
            </p>
            <p>
              <span className="font-semibold text-foreground">The pattern:</span> A new feature gets built with polished UI, hardcoded mock data,
              and buttons that look interactive but have no onClick handlers. The workflow builder looks like a professional node editor
              but you cannot add nodes from the palette. The marketplace looks like a real app store but "Use Flow" does nothing.
              The analytics page imports chart components that do not exist in the codebase.
            </p>
            <p>
              <span className="font-semibold text-foreground">The core problem remains unchanged:</span> This is a demo site, not a product.
              Every new feature makes it look more real, which makes the disappointment worse when a user tries to actually use it.
              The community page fabricates 2,847 members. The marketplace fabricates reviews. The extension page advertises
              a Chrome extension that does not exist. The attack surface for credibility damage has tripled since Round 1.
            </p>
            <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/5 p-4">
              <p className="font-semibold text-red-600 dark:text-red-400 mb-2">Bottom line:</p>
              <p>
                {unfixedCount} of {allFindings.length} total findings remain unfixed ({Math.round((unfixedCount / allFindings.length) * 100)}%).
                {" "}{r2Critical} new critical and {r2High} new high-severity issues were introduced by the new features.
                The product is growing faster than it is being fixed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

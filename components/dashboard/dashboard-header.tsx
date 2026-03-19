"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Plus, Sun } from "lucide-react"

import { NotificationCenter } from "@/components/dashboard/notification-center"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  flows: "Flows",
  runs: "Runs",
  monitoring: "Monitoring",
  "api-keys": "API Keys",
  webhooks: "Webhooks",
  settings: "Settings",
  analytics: "Analytics",
  playground: "Playground",
  templates: "Templates",
  usage: "Usage",
  marketplace: "Marketplace",
  proxies: "Proxies",
  secrets: "Secrets",
  sessions: "Sessions",
  pipelines: "Pipelines",
  reports: "Reports",
  graphql: "GraphQL",
  "api-playground": "API Playground",
  mcp: "MCP Servers",
  sso: "SSO",
  "api-logs": "API Logs",
  "audit-log": "Audit Log",
  "api-versions": "API Versions",
  "workflow-builder": "Workflow Builder",
  integrations: "Integrations",
  customize: "Customize",
  recorder: "Record",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = routeLabels[segment] || decodeURIComponent(segment)
    const isLast = index === segments.length - 1
    return { href, label, isLast }
  })

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <NotificationCenter />

        <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" data-tour="new-flow" aria-label="Create new flow">
          <Link href="/flows/new">
            <Plus className="size-4" />
            New Flow
          </Link>
        </Button>
      </div>
    </header>
  )
}

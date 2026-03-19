"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  BarChart3,
  Bell,
  ChevronsUpDown,
  Cpu,
  CreditCard,
  GitBranch,
  GitMerge,
  Braces,
  FileBarChart,
  FileSearch,
  Globe,
  Key,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  LogOut,
  Monitor,
  Play,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  Terminal,
  Wand2,
  Workflow,
} from "lucide-react"

import { signOut } from "@/lib/auth"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Usage", href: "/usage", icon: Receipt },
  { title: "Playground", href: "/playground", icon: Sparkles, tourId: "playground" },
  { title: "Generate Flow", href: "/flows/generate", icon: Wand2 },
  { title: "Flows", href: "/flows", icon: Workflow },
  { title: "Shared Flows", href: "/flows/share", icon: Share2 },
  { title: "Templates", href: "/templates", icon: LayoutTemplate, tourId: "templates" },
  { title: "Workflow Builder", href: "/workflow-builder", icon: GitBranch, tourId: "workflow-builder" },
  { title: "Pipelines", href: "/pipelines", icon: GitMerge },
  { title: "Runs", href: "/runs", icon: Play },
  { title: "Monitoring", href: "/monitoring", icon: Bell },
  { title: "Reports", href: "/reports", icon: FileBarChart },
  { title: "API Playground", href: "/api-playground", icon: Terminal },
  { title: "GraphQL", href: "/graphql", icon: Braces },
  { title: "Marketplace", href: "/marketplace", icon: Store },
  { title: "API Keys", href: "/api-keys", icon: Key },
  { title: "Webhooks", href: "/webhooks", icon: Globe },
  { title: "Integrations", href: "/integrations", icon: Plug },
  { title: "MCP Server", href: "/mcp", icon: Cpu },
  { title: "Proxies", href: "/proxies", icon: Shield },
  { title: "Secrets", href: "/secrets", icon: Lock },
  { title: "Sessions", href: "/sessions", icon: Monitor },
  { title: "API Versions", href: "/api-versions", icon: Layers },
  { title: "SSO", href: "/sso", icon: ShieldCheck },
  { title: "API Logs", href: "/api-logs", icon: FileSearch },
  { title: "Audit Log", href: "/audit-log", icon: ScrollText },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User"
  const userEmail = user?.email || ""
  const userInitials = userName.slice(0, 2).toUpperCase()

  return (
    <Sidebar collapsible="icon" data-tour="sidebar" aria-label="Main navigation">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="inline-flex items-baseline">
                    <span className="font-serif text-lg font-bold">Scraper</span>
                    <span className="font-serif text-lg font-bold text-blue-600">.bot</span>
                  </span>
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.href} {...(item.tourId ? { "data-tour": item.tourId } : {})}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                        <item.icon aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userName}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {userEmail || "Free Plan"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side={isCollapsed ? "right" : "top"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <CreditCard />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  try {
                    await signOut()
                    toast.success("Signed out")
                    router.push("/")
                  } catch {
                    router.push("/")
                  }
                }}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

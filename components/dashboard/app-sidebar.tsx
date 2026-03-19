"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronsUpDown,
  Cpu,
  CreditCard,
  GitBranch,
  Globe,
  Key,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  LogOut,
  Play,
  Plug,
  Settings,
  Shield,
  Sparkles,
  Store,
  Terminal,
  Workflow,
} from "lucide-react"

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
  { title: "Playground", href: "/playground", icon: Sparkles },
  { title: "Flows", href: "/flows", icon: Workflow },
  { title: "Templates", href: "/templates", icon: LayoutTemplate },
  { title: "Workflow Builder", href: "/workflow-builder", icon: GitBranch },
  { title: "Runs", href: "/runs", icon: Play },
  { title: "Monitoring", href: "/monitoring", icon: Bell },
  { title: "API Playground", href: "/api-playground", icon: Terminal },
  { title: "Marketplace", href: "/marketplace", icon: Store },
  { title: "API Keys", href: "/api-keys", icon: Key },
  { title: "Webhooks", href: "/webhooks", icon: Globe },
  { title: "Integrations", href: "/integrations", icon: Plug },
  { title: "MCP Server", href: "/mcp", icon: Cpu },
  { title: "Proxies", href: "/proxies", icon: Shield },
  { title: "Secrets", href: "/secrets", icon: Lock },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white font-serif font-bold text-sm">S</span>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="inline-flex items-baseline">
                    <span className="font-serif text-base font-semibold">Scraper</span>
                    <span className="font-serif text-base font-semibold text-blue-600">.bot</span>
                  </span>
                  <span className="text-muted-foreground text-xs">Web Automation</span>
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
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
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
                    <AvatarImage src="/avatars/user.png" alt="User" />
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      WS
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Wyatt S.</span>
                    <span className="text-muted-foreground truncate text-xs">
                      Professional Plan
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
                    <p className="text-sm font-medium leading-none">Wyatt S.</p>
                    <p className="text-muted-foreground text-xs leading-none">
                      wyatt@example.com
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
                <DropdownMenuItem onClick={() => router.push("/")}>
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

"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeProvider, useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  Activity,
  ArrowLeft,
  Bot,
  Crosshair,
  FileText,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Presentation,
  Rocket,
  Shield,
  ShieldAlert,
  Sun,
  Users,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Night Shift Report", href: "/admin/night-shift", icon: FileText },
      { label: "Teams", href: "/admin/teams", icon: Users },
      { label: "Roadmap", href: "/admin/roadmap", icon: Map },
      { label: "System Health", href: "/admin/system", icon: Activity },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Red Team", href: "/admin/red-team", icon: ShieldAlert },
      { label: "Blue Team", href: "/admin/blue-team", icon: Shield },
    ],
  },
  {
    label: "Strategy",
    items: [
      { label: "Pitch Deck", href: "/admin/pitch", icon: Presentation },
      { label: "GTM Strategy", href: "/admin/gtm", icon: Rocket },
      { label: "Competitive", href: "/admin/competitive", icon: Crosshair },
    ],
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 text-gray-400 hover:text-white transition-colors"
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 block dark:hidden" />
    </button>
  )
}

function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {group.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-800 bg-gray-950 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="lg:hidden rounded-md p-2 text-gray-400 hover:text-white">
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-60 bg-gray-900 border-gray-800 p-0">
            <SheetHeader className="border-b border-gray-800 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-white">
                <Bot className="size-5 text-blue-500" />
                <span className="font-serif text-lg font-semibold">Admin</span>
              </SheetTitle>
            </SheetHeader>
            <SidebarNav />
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2">
          <Bot className="size-5 text-blue-500" />
          <span className="font-serif text-lg font-semibold text-white">
            Scraper.bot <span className="text-xs font-sans font-normal text-gray-500">Admin</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-14 lg:left-0 lg:border-r lg:border-gray-800 lg:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-800 px-6 py-4">
        <Bot className="size-5 text-blue-500" />
        <span className="font-serif text-base font-semibold text-white">Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
    </aside>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <TopBar />
        <Sidebar />
        <main className="lg:pl-60">
          <div className="mx-auto max-w-5xl p-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}

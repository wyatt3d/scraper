"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { cn } from "@/lib/utils"
import { Bot, Crosshair, Moon, Presentation, Rocket, Shield, ShieldAlert, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Night Shift Report", href: "/admin/night-shift" },
  { label: "Teams", href: "/admin/teams" },
  { label: "Roadmap", href: "/admin/roadmap" },
  { label: "System Health", href: "/admin/system" },
  { label: "Red Team", href: "/admin/red-team", icon: ShieldAlert },
  { label: "Blue Team", href: "/admin/blue-team", icon: Shield },
  { label: "Pitch Deck", href: "/admin/pitch", icon: Presentation },
  { label: "GTM Strategy", href: "/admin/gtm", icon: Rocket },
  { label: "Competitive", href: "/admin/competitive", icon: Crosshair },
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

function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <Bot className="size-5 text-blue-500" />
              <span className="font-serif text-lg font-semibold text-white">
                Scraper.bot <span className="text-xs font-sans font-normal text-gray-500">Admin</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-900"
                  )}
                >
                  {"icon" in item && item.icon ? <item.icon className="size-3.5 mr-1.5 inline" /> : null}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
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
        <AdminNav />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </ThemeProvider>
  )
}

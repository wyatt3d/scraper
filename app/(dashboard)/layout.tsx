import type React from "react"
import { cookies } from "next/headers"
import { ThemeProvider } from "next-themes"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShortcuts } from "@/components/dashboard/dashboard-shortcuts"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth/auth-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
            Skip to main content
          </a>
          <AppSidebar />
          <SidebarInset>
            <DashboardHeader />
            <div role="status" className="bg-blue-600 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
              <span className="font-medium">Early Beta</span>
              <span className="opacity-80">—</span>
              <span className="opacity-90">You&apos;re using an early version of Scraper.bot.</span>
              <a href="https://github.com/wyatt3d/scraper/issues" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80">Submit a trouble ticket</a>
            </div>
            <main id="main-content" className="flex-1 p-6">{children}</main>
          </SidebarInset>
          <DashboardShortcuts />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

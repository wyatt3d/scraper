import type React from "react"
import { cookies } from "next/headers"
import { ThemeProvider } from "next-themes"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShortcuts } from "@/components/dashboard/dashboard-shortcuts"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth/auth-provider"
import { BetaBanner } from "@/components/dashboard/beta-banner"
import { FloatingHelpButton } from "@/components/dashboard/trouble-ticket"

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
            <BetaBanner />
            <main id="main-content" className="flex-1 p-6">{children}</main>
          </SidebarInset>
          <DashboardShortcuts />
          <FloatingHelpButton />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

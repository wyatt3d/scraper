import type React from "react"
import Link from "next/link"
import { ArrowLeft, Book, Rocket, Layers, Code, BookOpen, LayoutTemplate, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarNav = [
  { title: "Overview", href: "/docs", icon: Book },
  { title: "Quickstart", href: "/docs/quickstart", icon: Rocket },
  { title: "Concepts", href: "/docs/concepts", icon: Layers },
  { title: "Guides", href: "/docs/guides", icon: BookOpen },
  { title: "SDK Reference", href: "/docs/sdk", icon: Terminal },
  { title: "API Reference", href: "/docs/api-reference", icon: Code },
  { title: "Templates", href: "/docs/templates", icon: LayoutTemplate },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="ml-6 font-serif text-lg font-semibold">Scraper Docs</div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r md:block">
          <nav className="space-y-1 p-4">
            {sidebarNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {children}
          </div>
        </main>

        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 xl:block">
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              On this page
            </p>
            <div id="toc-container" />
          </div>
        </aside>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { AuthNavMobile } from "./auth-nav"

interface MobileMenuProps {
  isSignedIn: boolean
}

export function MobileMenu({ isSignedIn }: MobileMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="font-serif">Navigation</SheetTitle>
          <nav className="flex flex-col gap-4 mt-6">
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
              How It Works
            </a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
              Pricing
            </a>
            <Link href="/docs" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-blue-600 transition-colors text-lg font-medium">
              Docs
            </Link>
            <hr className="border-border" />
            <AuthNavMobile isSignedIn={isSignedIn} onNavigate={() => setMobileOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

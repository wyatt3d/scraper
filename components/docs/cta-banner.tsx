"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CTABannerProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export function CTABanner({
  title = "Ready to start scraping?",
  description = "Create your first flow in minutes. No credit card required.",
  buttonText = "Get Started Free",
  buttonHref = "/sign-up",
}: CTABannerProps) {
  return (
    <div className="my-12 rounded-xl border bg-gradient-to-r from-blue-600/10 to-blue-600/5 p-8 text-center">
      <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">{description}</p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
        <Link href={buttonHref}>
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

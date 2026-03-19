"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Chrome, ArrowRight } from "lucide-react"

export function ExtensionButtons({ variant }: { variant: "hero" | "cta" }) {
  const handleAddToChrome = () => {
    toast("Chrome extension coming soon. Join the waitlist!")
  }

  if (variant === "cta") {
    return (
      <Button
        size="lg"
        className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6 font-semibold"
        onClick={handleAddToChrome}
      >
        <Chrome className="mr-2 w-5 h-5" />
        Add to Chrome — It&apos;s Free
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
        onClick={handleAddToChrome}
      >
        <Chrome className="mr-2 w-5 h-5" />
        Add to Chrome — It&apos;s Free
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="text-lg px-8 py-6 bg-transparent"
        onClick={() => toast("Demo video coming soon")}
      >
        Watch Demo
      </Button>
    </div>
  )
}

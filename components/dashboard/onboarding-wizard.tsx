"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  MousePointer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "scraper_onboarding_complete"
const TOTAL_STEPS = 4

const flowTypes = [
  {
    id: "extract",
    label: "Extract Data",
    description: "Pull structured data from any website",
    icon: Database,
  },
  {
    id: "automate",
    label: "Automate Actions",
    description: "Fill forms, click buttons, navigate pages",
    icon: MousePointer,
  },
  {
    id: "monitor",
    label: "Monitor Changes",
    description: "Watch for price drops, new listings, content updates",
    icon: Eye,
  },
]

export function OnboardingWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [url, setUrl] = useState("")

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY)
    if (!completed) {
      setOpen(true)
    }
  }, [])

  function completeOnboarding() {
    localStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  function back() {
    if (step > 1) setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) completeOnboarding() }}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg gap-0 p-0 overflow-hidden">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {step === 1 && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl">
                  Welcome to Scraper.bot!
                </DialogTitle>
                <DialogDescription>
                  Let&apos;s get you set up in under 2 minutes.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center rounded-lg border bg-muted/50 py-12">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-blue-600 text-white font-serif text-2xl font-bold">
                    S
                  </div>
                  <p className="text-sm text-muted-foreground">Scraper.bot</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={next}>
                  Let&apos;s Go
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl">
                  Create Your First Flow
                </DialogTitle>
                <DialogDescription>
                  What would you like to scrape?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {flowTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={cn(
                      "flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
                      selectedFlow === type.id && "border-foreground bg-muted ring-1 ring-foreground/25"
                    )}
                    onClick={() => setSelectedFlow(type.id)}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <type.icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={back}>
                  <ArrowLeft className="mr-1.5 size-4" />
                  Back
                </Button>
                <Button onClick={next} disabled={!selectedFlow}>
                  Next
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl">
                  Enter a URL
                </DialogTitle>
                <DialogDescription>
                  Enter a URL to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="https://example.com/products"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  We&apos;ll analyze the page and suggest an extraction strategy.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={back}>
                  <ArrowLeft className="mr-1.5 size-4" />
                  Back
                </Button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                    onClick={next}
                  >
                    Skip for now
                  </button>
                  <Button onClick={next}>
                    Next
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <DialogHeader className="mb-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="size-6 text-emerald-600" />
                </div>
                <DialogTitle className="font-serif text-2xl text-center">
                  You&apos;re All Set!
                </DialogTitle>
                <DialogDescription className="text-center">
                  You&apos;re ready to go!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Link
                  href="/flows/new"
                  className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={completeOnboarding}
                >
                  Create a Flow
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/templates"
                  className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={completeOnboarding}
                >
                  Browse Templates
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/docs"
                  className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={completeOnboarding}
                >
                  Read Docs
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={completeOnboarding}>
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

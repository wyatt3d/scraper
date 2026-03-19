"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const STORAGE_KEY = "scraper_onboarding_complete"
const TOTAL_STEPS = 4

export function OnboardingWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

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
                  Welcome to Scraper.bot
                </DialogTitle>
                <DialogDescription>
                  Let&apos;s extract your first data. You&apos;ll be up and running in under 60 seconds.
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
                  Try the Playground
                </DialogTitle>
                <DialogDescription>
                  Paste a URL and see structured data instantly. No setup required.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center rounded-lg border bg-muted/50 py-10">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-blue-600/10">
                    <Sparkles className="size-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instant extraction</p>
                    <p className="text-xs text-muted-foreground mt-1">Paste any URL, get structured JSON back</p>
                  </div>
                </div>
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
                    Skip
                  </button>
                  <Link href="/playground" onClick={completeOnboarding}>
                    <Button className="gap-1.5">
                      <Sparkles className="size-4" />
                      Open Playground
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl">
                  Record a Flow
                </DialogTitle>
                <DialogDescription>
                  Point and click to build a reusable scraping flow. Runs on a schedule or via API.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center rounded-lg border bg-muted/50 py-10">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-blue-600/10">
                    <Video className="size-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visual flow builder</p>
                    <p className="text-xs text-muted-foreground mt-1">Click through a site to record extraction steps</p>
                  </div>
                </div>
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
                    Skip
                  </button>
                  <Link href="/recorder" onClick={completeOnboarding}>
                    <Button className="gap-1.5">
                      <Video className="size-4" />
                      Start Recording
                    </Button>
                  </Link>
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
                  You&apos;re Ready
                </DialogTitle>
                <DialogDescription className="text-center">
                  Explore your dashboard, create API keys, and start automating.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Link
                  href="/playground"
                  className="flex items-center justify-between rounded-lg border border-blue-600 bg-blue-600/5 p-3 text-sm font-medium hover:bg-blue-600/10 transition-colors"
                  onClick={completeOnboarding}
                >
                  Try the Playground
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/recorder"
                  className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={completeOnboarding}
                >
                  Record a Flow
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/api-keys"
                  className="flex items-center justify-between rounded-lg border p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={completeOnboarding}
                >
                  Create an API Key
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

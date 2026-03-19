"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, Download, X } from "lucide-react"
import Link from "next/link"

interface TourStep {
  target: string | null
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right" | "center"
}

const steps: TourStep[] = [
  {
    target: null,
    title: "Welcome to Scraper.bot!",
    description:
      "Let us show you around. This tour takes about 1 minute.",
    position: "center",
  },
  {
    target: '[data-tour="sidebar"]',
    title: "Your Command Center",
    description:
      "Everything you need is in the sidebar \u2014 flows, runs, monitoring, and more.",
    position: "right",
  },
  {
    target: '[data-tour="stats"]',
    title: "At-a-Glance Metrics",
    description:
      "See your active flows, run success rate, and data extraction stats in real time.",
    position: "bottom",
  },
  {
    target: '[data-tour="new-flow"]',
    title: "Create Your First Flow",
    description:
      "Click here to build a scraping flow. Describe what you want in plain English and our AI generates it.",
    position: "bottom",
  },
  {
    target: '[data-tour="playground"]',
    title: "Try the Playground",
    description:
      "Test scraping instantly \u2014 paste any URL, describe what you need, and see results in seconds.",
    position: "right",
  },
  {
    target: '[data-tour="templates"]',
    title: "Start with Templates",
    description:
      "Choose from pre-built templates for Amazon, Indeed, Zillow, GitHub, and more.",
    position: "right",
  },
  {
    target: '[data-tour="workflow-builder"]',
    title: "Visual Workflow Builder",
    description:
      "Drag and drop nodes to build complex multi-step automations \u2014 no code required.",
    position: "right",
  },
  {
    target: null,
    title: "You're Ready!",
    description:
      "Start by creating a flow or exploring the playground. Need help? Press Cmd+K for quick navigation or ? for keyboard shortcuts.",
    position: "center",
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function ProductTour() {
  const [active, setActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [transitioning, setTransitioning] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const done = localStorage.getItem("scraper_tour_complete")
    if (!done) {
      setActive(true)
    }
  }, [])

  const measureTarget = useCallback(() => {
    const step = steps[currentStep]
    if (!step.target) {
      setTargetRect(null)
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      })
      return
    }

    const el = document.querySelector(step.target) as HTMLElement | null
    if (!el) {
      setTargetRect(null)
      setTooltipStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      })
      return
    }

    const r = el.getBoundingClientRect()
    const padding = 8
    const rect: Rect = {
      top: r.top - padding,
      left: r.left - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    }
    setTargetRect(rect)

    const tooltipWidth = 360
    const tooltipHeight = 200
    const gap = 16

    let style: React.CSSProperties = { position: "fixed" }

    switch (step.position) {
      case "right":
        style.top = rect.top + rect.height / 2
        style.left = rect.left + rect.width + gap
        style.transform = "translateY(-50%)"
        if (style.left as number + tooltipWidth > window.innerWidth) {
          style.left = rect.left - tooltipWidth - gap
        }
        break
      case "bottom":
        style.top = rect.top + rect.height + gap
        style.left = rect.left + rect.width / 2
        style.transform = "translateX(-50%)"
        if (style.top as number + tooltipHeight > window.innerHeight) {
          style.top = rect.top - tooltipHeight - gap
        }
        break
      case "top":
        style.top = rect.top - tooltipHeight - gap
        style.left = rect.left + rect.width / 2
        style.transform = "translateX(-50%)"
        break
      case "left":
        style.top = rect.top + rect.height / 2
        style.left = rect.left - tooltipWidth - gap
        style.transform = "translateY(-50%)"
        break
      default:
        style.top = rect.top + rect.height + gap
        style.left = rect.left + rect.width / 2
        style.transform = "translateX(-50%)"
    }

    setTooltipStyle(style)
  }, [currentStep])

  useEffect(() => {
    if (!active) return

    const update = () => {
      measureTarget()
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)

    return () => cancelAnimationFrame(rafRef.current)
  }, [active, measureTarget])

  function completeTour() {
    localStorage.setItem("scraper_tour_complete", "true")
    setActive(false)
  }

  function goNext() {
    if (currentStep >= steps.length - 1) {
      completeTour()
      return
    }
    setTransitioning(true)
    setTimeout(() => {
      setCurrentStep((s) => s + 1)
      setTransitioning(false)
    }, 200)
  }

  if (!active) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const isCenterStep = step.target === null

  return (
    <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      {isCenterStep ? (
        <div className="fixed inset-0 bg-black/60 transition-opacity duration-300" />
      ) : (
        <>
          {targetRect && (
            <div
              className="fixed rounded-lg transition-all duration-300 ease-out"
              style={{
                top: targetRect.top,
                left: targetRect.left,
                width: targetRect.width,
                height: targetRect.height,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
                zIndex: 101,
                pointerEvents: "none",
              }}
            />
          )}
          {!targetRect && (
            <div className="fixed inset-0 bg-black/60" />
          )}
        </>
      )}

      <div
        className={cn(
          "z-[102] w-[360px] rounded-xl border bg-background p-6 shadow-2xl transition-all duration-300 ease-out",
          transitioning ? "scale-95 opacity-0" : "scale-100 opacity-100",
          isCenterStep && "w-[420px]"
        )}
        style={tooltipStyle}
      >
        {!isFirst && !isLast && (
          <div className="mb-3 text-xs font-medium text-muted-foreground">
            {currentStep} of {steps.length - 2}
          </div>
        )}

        <h3 className="font-serif text-lg font-bold tracking-tight">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>

        <div className="mt-5 flex items-center gap-2">
          {isFirst ? (
            <>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={goNext}
              >
                Start Tour
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={completeTour}
              >
                Skip
              </Button>
            </>
          ) : isLast ? (
            <>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={completeTour}
              >
                Finish Tour
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
              >
                <Link href="/extension">
                  <Download className="mr-1 size-3.5" />
                  Install Desktop App
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={goNext}
              >
                Next
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={completeTour}
              >
                Skip Tour
              </Button>
            </>
          )}
        </div>

        {!isFirst && !isLast && (
          <div className="mt-4 flex gap-1">
            {steps.slice(1, -1).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-200",
                  i < currentStep
                    ? "bg-blue-600"
                    : i === currentStep - 1
                    ? "bg-blue-600"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        )}

        <button
          onClick={completeTour}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close tour"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}

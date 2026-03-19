"use client"

import { AnimatedCounter } from "@/components/landing/animated-counter"

const logos = [
  "TechFlow",
  "DataSync",
  "Apiture",
  "Nextera",
  "Quantive",
  "Meridian",
  "Arclight",
  "Vantage",
]

export function TrustedBy() {
  return (
    <section className="py-16 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground tracking-wide uppercase mb-8">
          Trusted by 500+ teams worldwide
        </p>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap items-center justify-center gap-6 md:gap-8 pb-2 md:pb-0">
          {logos.map((name) => (
            <div
              key={name}
              className="shrink-0 px-5 py-2.5 rounded-lg border border-border/60 bg-muted/30 text-muted-foreground font-semibold tracking-wider text-sm opacity-60 hover:opacity-90 transition-opacity select-none"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 max-w-3xl mx-auto text-center">
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              <AnimatedCounter end={10} suffix="K+" />
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active Users</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              <AnimatedCounter end={50} suffix="M+" />
            </p>
            <p className="text-sm text-muted-foreground mt-1">Pages Scraped</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              <AnimatedCounter end={99} suffix="%" />
            </p>
            <p className="text-sm text-muted-foreground mt-1">Uptime SLA</p>
          </div>
          <div>
            <p className="font-serif font-black text-3xl md:text-4xl text-foreground">
              <AnimatedCounter end={500} suffix="+" />
            </p>
            <p className="text-sm text-muted-foreground mt-1">Teams Worldwide</p>
          </div>
        </div>
      </div>
    </section>
  )
}

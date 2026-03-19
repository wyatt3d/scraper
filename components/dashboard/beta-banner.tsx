"use client"

import { TroubleTicketTrigger } from "@/components/dashboard/trouble-ticket"

export function BetaBanner() {
  return (
    <div
      role="status"
      className="bg-blue-600 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2"
    >
      <span className="font-medium">Early Beta</span>
      <span className="opacity-80">&mdash;</span>
      <span className="opacity-90">You&apos;re using an early version of Scraper.bot.</span>
      <TroubleTicketTrigger className="underline font-medium hover:opacity-80">
        Submit a trouble ticket
      </TroubleTicketTrigger>
    </div>
  )
}

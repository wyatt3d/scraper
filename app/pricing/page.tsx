import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing/pricing-content"

export const metadata: Metadata = {
  title: "Pricing - Scraper",
  description:
    "Simple, transparent pricing for Scraper. Start free with 100 runs per month, upgrade to Pro for production workloads, or contact us for Enterprise.",
  openGraph: {
    title: "Pricing - Scraper",
    description:
      "Start free. Scale as you grow. No hidden fees, no setup costs.",
  },
}

export default function PricingPage() {
  return <PricingContent />
}

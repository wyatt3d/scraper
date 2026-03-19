import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "robots.txt Analyzer - Free Tool | Scraper.bot",
  description:
    "Analyze robots.txt files to see which bots are allowed or disallowed. Parse user-agent rules, sitemaps, and crawl-delay directives. Free, no sign-up required.",
  keywords: [
    "robots.txt analyzer",
    "robots.txt parser",
    "robots.txt checker",
    "web scraping",
    "crawl rules",
    "user-agent rules",
  ],
}

export default function RobotsAnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

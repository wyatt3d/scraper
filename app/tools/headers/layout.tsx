import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HTTP Header Inspector - Free Tool | Scraper.bot",
  description:
    "Inspect HTTP response headers for any URL. View status codes, security headers, and caching policies. Free, no sign-up required.",
  keywords: [
    "http header inspector",
    "http headers",
    "response headers",
    "security headers",
    "hsts",
    "web scraping",
  ],
}

export default function HeadersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

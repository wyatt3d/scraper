import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON Formatter - Free Tool | Scraper.bot",
  description:
    "Format, validate, and minify JSON instantly. Paste raw JSON, get pretty-printed output. Free, no sign-up required.",
  keywords: [
    "json formatter",
    "json validator",
    "json minifier",
    "json prettifier",
    "json tool",
    "web scraping",
  ],
}

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "XPath to CSS Converter - Free Tool | Scraper.bot",
  description:
    "Convert XPath expressions to CSS selectors and vice versa. Supports common patterns. Free, no sign-up required.",
  keywords: [
    "xpath to css",
    "css to xpath",
    "xpath converter",
    "css selector converter",
    "xpath expression",
    "web scraping",
  ],
}

export default function XPathConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

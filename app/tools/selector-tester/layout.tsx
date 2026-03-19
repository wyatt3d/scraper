import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CSS Selector Tester - Free Tool",
  description:
    "Test CSS selectors against any HTML instantly. Paste HTML, write a selector, see matches highlighted. Free, no sign-up required.",
  keywords: [
    "css selector tester",
    "css selector",
    "html selector",
    "querySelector",
    "web scraping",
    "css selector tool",
  ],
}

export default function SelectorTesterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

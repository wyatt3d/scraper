import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text } from "next/font/google"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson-text",
  weight: ["400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Scraper.bot - Turn Any Website Into a Structured API",
    template: "%s | Scraper.bot"
  },
  description: "Transform any website into a deterministic API endpoint in minutes. AI-powered web scraping, browser automation, and structured data extraction. No code, no maintenance.",
  keywords: ["web scraping", "API generation", "browser automation", "data extraction", "web scraping API", "no-code scraping", "structured data", "AI scraping"],
  authors: [{ name: "Scraper.bot" }],
  creator: "Scraper.bot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scraper.bot",
    siteName: "Scraper.bot",
    title: "Scraper.bot - Turn Any Website Into a Structured API",
    description: "Transform any website into a deterministic API endpoint in minutes. AI-powered web scraping and browser automation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scraper.bot - Turn Any Website Into a Structured API",
    description: "Transform any website into a deterministic API endpoint in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://scraper.bot"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${crimsonText.variable} ${inter.variable} font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

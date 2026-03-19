import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text } from "next/font/google"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
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
  title: "Scraper - AI-Powered Web Scraping Extensions",
  description:
    "Generate Chrome and Mozilla extensions for scraping listings from Craigslist, Bid4Assets and more. Share data seamlessly with your team on Slack, Discord, or Google Sheets.",
  generator: "Scraper AI Tool",
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
        <Analytics />
      </body>
    </html>
  )
}

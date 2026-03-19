import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cron Expression Builder - Free Tool | Scraper.bot",
  description:
    "Build and test cron expressions visually. See the next 5 scheduled run times. Free, no sign-up required.",
  keywords: [
    "cron expression builder",
    "cron generator",
    "cron schedule",
    "cron tester",
    "crontab",
    "web scraping",
  ],
}

export default function CronBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

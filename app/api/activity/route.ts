import { NextRequest, NextResponse } from "next/server"

interface Activity {
  id: string
  type: string
  flowName: string
  message: string
  timestamp: string
  userId: string
}

function hoursAgo(hours: number): string {
  const d = new Date()
  d.setHours(d.getHours() - hours)
  return d.toISOString()
}

const activities: Activity[] = [
  { id: "act-1", type: "run.completed", flowName: "Product Monitor", message: "Extracted 147 items", timestamp: hoursAgo(0.5), userId: "user-1" },
  { id: "act-2", type: "alert.triggered", flowName: "Price Tracker", message: "Price dropped below threshold on 3 items", timestamp: hoursAgo(1), userId: "user-1" },
  { id: "act-3", type: "run.started", flowName: "News Aggregator", message: "Scheduled run initiated", timestamp: hoursAgo(1.5), userId: "user-1" },
  { id: "act-4", type: "flow.created", flowName: "New Scraper", message: "Created by Wyatt", timestamp: hoursAgo(2), userId: "user-1" },
  { id: "act-5", type: "run.completed", flowName: "News Aggregator", message: "Extracted 52 articles", timestamp: hoursAgo(2.5), userId: "user-1" },
  { id: "act-6", type: "run.failed", flowName: "Craigslist Cars", message: "Rate limited after 23 requests", timestamp: hoursAgo(3), userId: "user-1" },
  { id: "act-7", type: "flow.updated", flowName: "Product Monitor", message: "Updated extraction selectors", timestamp: hoursAgo(4), userId: "user-1" },
  { id: "act-8", type: "run.completed", flowName: "Job Board Scanner", message: "Extracted 89 listings", timestamp: hoursAgo(5), userId: "user-1" },
  { id: "act-9", type: "alert.triggered", flowName: "Competitor Watch", message: "New product detected on competitor site", timestamp: hoursAgo(6), userId: "user-1" },
  { id: "act-10", type: "run.completed", flowName: "Price Tracker", message: "Extracted 312 prices", timestamp: hoursAgo(7), userId: "user-1" },
  { id: "act-11", type: "run.started", flowName: "Product Monitor", message: "Manual run triggered", timestamp: hoursAgo(8), userId: "user-1" },
  { id: "act-12", type: "flow.deleted", flowName: "Old Test Flow", message: "Deleted by Wyatt", timestamp: hoursAgo(10), userId: "user-1" },
  { id: "act-13", type: "run.completed", flowName: "Social Media Scraper", message: "Extracted 203 posts", timestamp: hoursAgo(12), userId: "user-1" },
  { id: "act-14", type: "run.failed", flowName: "LinkedIn Profiles", message: "Authentication expired", timestamp: hoursAgo(16), userId: "user-1" },
  { id: "act-15", type: "flow.updated", flowName: "Job Board Scanner", message: "Added new job board source", timestamp: hoursAgo(20), userId: "user-1" },
  { id: "act-16", type: "run.completed", flowName: "Craigslist Cars", message: "Extracted 67 listings", timestamp: hoursAgo(24), userId: "user-1" },
  { id: "act-17", type: "alert.triggered", flowName: "Product Monitor", message: "5 items went out of stock", timestamp: hoursAgo(28), userId: "user-1" },
  { id: "act-18", type: "run.completed", flowName: "News Aggregator", message: "Extracted 41 articles", timestamp: hoursAgo(32), userId: "user-1" },
  { id: "act-19", type: "flow.created", flowName: "Real Estate Tracker", message: "Created by Wyatt", timestamp: hoursAgo(40), userId: "user-1" },
  { id: "act-20", type: "run.completed", flowName: "Price Tracker", message: "Extracted 298 prices", timestamp: hoursAgo(46), userId: "user-1" },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100)
  const type = searchParams.get("type")

  let filtered = activities
  if (type) {
    filtered = filtered.filter((a) => a.type === type)
  }

  return NextResponse.json({ activities: filtered.slice(0, limit) })
}

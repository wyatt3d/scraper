import { NextResponse } from "next/server"
import { listAlerts } from "@/lib/db"
import { mockAlerts } from "@/lib/mock-data"

export async function GET() {
  try {
    const alerts = await listAlerts()
    return NextResponse.json({ data: alerts, total: alerts.length })
  } catch {
    return NextResponse.json({ data: mockAlerts, total: mockAlerts.length })
  }
}

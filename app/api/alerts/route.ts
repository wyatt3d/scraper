import { NextResponse } from "next/server"
import { listAlerts } from "@/lib/db"

export async function GET() {
  try {
    const alerts = await listAlerts()
    return NextResponse.json({ data: alerts, total: alerts.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch alerts"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

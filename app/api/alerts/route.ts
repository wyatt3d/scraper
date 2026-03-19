import { NextResponse } from "next/server"
import { listAlerts } from "@/lib/db"

export async function GET() {
  try {
    const alerts = await listAlerts()
    return NextResponse.json({ data: alerts, total: alerts.length })
  } catch {
    return NextResponse.json({ data: [], total: 0 })
  }
}

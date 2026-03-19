import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.5.0",
    services: {
      api: "healthy",
      database: "unknown",
    },
  }

  try {
    const { error } = await supabase.from("flows").select("id").limit(1)
    checks.services.database = error ? "unhealthy" : "healthy"
  } catch {
    checks.services.database = "unhealthy"
  }

  if (checks.services.database === "unhealthy") {
    checks.status = "degraded"
  }

  return NextResponse.json(checks, {
    status: checks.status === "healthy" ? 200 : 503,
  })
}

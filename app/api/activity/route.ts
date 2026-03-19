import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("audit_log")
      .select("id, actor, action, resource_type, resource_name, details, created_at")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    const activities = (data || []).map(entry => ({
      id: entry.id,
      user: entry.actor,
      action: entry.action,
      target: entry.resource_name || entry.resource_type,
      type: entry.resource_type,
      details: entry.details,
      timestamp: entry.created_at,
    }))

    return NextResponse.json({ activities })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch activity" },
      { status: 500 }
    )
  }
}

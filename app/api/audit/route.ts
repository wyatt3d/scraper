import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const actor = searchParams.get("actor")
  const action = searchParams.get("action")
  const resource = searchParams.get("resource")

  try {
    let query = supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (actor) query = query.eq("actor", actor)
    if (action) query = query.eq("action", action)
    if (resource) query = query.eq("resource_type", resource)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data: data || [] })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { error } = await supabase.from("audit_log").insert({
      actor: body.actor || "system",
      action: body.action,
      resource_type: body.resourceType,
      resource_name: body.resourceName,
      details: body.details || {},
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
    })
    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to log" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

const createAuditSchema = z.object({
  actor: z.string().min(1).max(200),
  action: z.enum(["created", "updated", "deleted", "executed", "viewed", "error"]),
  resourceType: z.string().min(1).max(100),
  resourceName: z.string().max(200).optional(),
  details: z.record(z.any()).optional().default({}),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
  const offset = parseInt(searchParams.get("offset") || "0")
  const actor = searchParams.get("actor")
  const action = searchParams.get("action")
  const resource = searchParams.get("resource")

  try {
    let query = supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (actor) query = query.eq("actor", actor)
    if (action) query = query.eq("action", action)
    if (resource) query = query.eq("resource_type", resource)

    const { data, error } = await query
    if (error) throw error
    const response = NextResponse.json({ data: data || [] })
    response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch audit log"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createAuditSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
    }
    const validated = result.data
    const { error } = await supabase.from("audit_log").insert({
      actor: validated.actor,
      action: validated.action,
      resource_type: validated.resourceType,
      resource_name: validated.resourceName,
      details: validated.details,
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
    })
    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to log" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { toRun } from "@/lib/mappers"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const flowId = searchParams.get("flowId")
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
  const offset = parseInt(searchParams.get("offset") || "0")

  let query = supabase
    .from("runs")
    .select("id, flow_id, flow_name, status, started_at, completed_at, duration, items_extracted, error, cost")
    .order("started_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (flowId) {
    query = query.eq("flow_id", flowId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const response = NextResponse.json({ data: (data || []).map(toRun) })
  response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
  return response
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("runs")
    .insert({
      flow_id: body.flowId,
      flow_name: body.flowName || "Untitled",
      status: body.status || "queued",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: toRun(data) }, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function toRun(row: Record<string, unknown>) {
  return {
    id: row.id,
    flowId: row.flow_id,
    flowName: row.flow_name,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    duration: row.duration,
    itemsExtracted: row.items_extracted,
    error: row.error,
    outputPreview: row.output_preview,
    logs: row.logs,
    cost: row.cost,
  }
}

export async function GET(req: NextRequest) {
  const flowId = req.nextUrl.searchParams.get("flowId")

  let query = supabase
    .from("runs")
    .select("*")
    .order("started_at", { ascending: false })

  if (flowId) {
    query = query.eq("flow_id", flowId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: (data || []).map(toRun) })
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

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data: toRun(data) })
}

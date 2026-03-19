import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function toFlow(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    mode: row.mode,
    status: row.status,
    steps: row.steps,
    outputSchema: row.output_schema,
    schedule: row.schedule,
    successRate: row.success_rate,
    totalRuns: row.total_runs,
    avgDuration: row.avg_duration,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastRunAt: row.last_run_at,
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("flows")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: (data || []).map(toFlow) })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("flows")
    .insert({
      name: body.name || "Untitled Flow",
      description: body.description || "",
      url: body.url || "",
      mode: body.mode || "extract",
      status: body.status || "draft",
      steps: body.steps || [],
      output_schema: body.outputSchema || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: toFlow(data) }, { status: 201 })
}

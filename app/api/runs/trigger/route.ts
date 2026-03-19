import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { executeFlow } from "@/lib/engine/runner"
import type { Flow } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { flowId } = await request.json()
    if (!flowId) return NextResponse.json({ error: "flowId required" }, { status: 400 })

    const { data: flow, error: flowError } = await supabase
      .from("flows")
      .select("*")
      .eq("id", flowId)
      .single()

    if (flowError || !flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 })
    }

    const { data: run, error: runError } = await supabase
      .from("runs")
      .insert({
        flow_id: flowId,
        flow_name: flow.name,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (runError) throw runError

    const flowData: Flow = {
      id: flow.id,
      name: flow.name,
      description: flow.description || "",
      url: flow.url,
      mode: flow.mode,
      status: flow.status,
      steps: flow.steps || [],
      outputSchema: flow.output_schema || {},
      createdAt: flow.created_at,
      updatedAt: flow.updated_at,
      successRate: flow.success_rate || 0,
      totalRuns: flow.total_runs || 0,
      avgDuration: flow.avg_duration || 0,
    }

    const result = await executeFlow(flowData)

    await supabase
      .from("runs")
      .update({
        status: result.status,
        completed_at: new Date().toISOString(),
        duration: result.duration,
        items_extracted: result.items.length,
        output_preview: result.items.slice(0, 10),
        logs: result.logs,
        error: result.error || null,
        cost: (result.duration / 1000) * 0.001,
      })
      .eq("id", run.id)

    await supabase
      .from("flows")
      .update({
        total_runs: (flow.total_runs || 0) + 1,
        last_run_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", flowId)

    return NextResponse.json({
      runId: run.id,
      status: result.status,
      itemsExtracted: result.items.length,
      duration: result.duration,
      screenshots: result.screenshots || [],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Trigger failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

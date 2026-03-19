// CRON_SECRET must be set in Vercel environment variables.
// Vercel Cron Jobs sends requests with the header: Authorization: Bearer <CRON_SECRET>
// Generate a random secret and set it in both Vercel env vars and vercel.json will not need it.
// See: https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { executeFlow } from "@/lib/engine/runner"
import type { Flow } from "@/lib/types"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: flows, error } = await supabase
      .from("flows")
      .select("*")
      .eq("status", "active")
      .not("schedule", "is", null)

    if (error) throw error
    if (!flows || flows.length === 0) {
      return NextResponse.json({ message: "No scheduled flows", ran: 0 })
    }

    const now = new Date()
    const results: { flowId: string; flowName: string; status: string }[] = []

    for (const flow of flows) {
      const schedule = flow.schedule as { enabled?: boolean; interval?: string; lastRun?: string } | null
      if (!schedule?.enabled || !schedule?.interval) continue

      const lastRun = schedule.lastRun ? new Date(schedule.lastRun) : new Date(0)
      const intervalMs = parseInterval(schedule.interval)
      if (now.getTime() - lastRun.getTime() < intervalMs) continue

      const { data: run } = await supabase
        .from("runs")
        .insert({
          flow_id: flow.id,
          flow_name: flow.name,
          status: "running",
          started_at: now.toISOString(),
        })
        .select("id")
        .single()

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

      try {
        const result = await executeFlow(flowData)

        await supabase
          .from("runs")
          .update({
            status: result.status,
            completed_at: new Date().toISOString(),
            duration: result.duration,
            items_extracted: result.items.length,
            output_preview: result.items.slice(0, 50),
            logs: result.logs,
            screenshots: result.screenshots,
            cost: (result.duration / 1000) * 0.001,
          })
          .eq("id", run?.id)

        await supabase
          .from("flows")
          .update({
            schedule: { ...schedule, lastRun: now.toISOString() },
            last_run_at: now.toISOString(),
            total_runs: (flow.total_runs || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", flow.id)

        results.push({ flowId: flow.id, flowName: flow.name, status: result.status })
      } catch (err) {
        await supabase
          .from("runs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            error: err instanceof Error ? err.message : "Execution failed",
          })
          .eq("id", run?.id)

        results.push({ flowId: flow.id, flowName: flow.name, status: "failed" })
      }
    }

    return NextResponse.json({ message: "Scheduled runs complete", ran: results.length, results })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron failed" },
      { status: 500 }
    )
  }
}

function parseInterval(interval: string): number {
  const match = interval.match(/^(\d+)(m|h|d)$/)
  if (!match) return 3600000
  const [, num, unit] = match
  const n = parseInt(num)
  switch (unit) {
    case "m": return n * 60 * 1000
    case "h": return n * 3600 * 1000
    case "d": return n * 86400 * 1000
    default: return 3600000
  }
}

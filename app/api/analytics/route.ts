import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "30")
  const startDate = new Date(Date.now() - days * 86400000).toISOString()
  const endDate = new Date().toISOString()

  try {
    const [runsResult, flowsResult] = await Promise.all([
      supabase
        .from("runs")
        .select("started_at, status, items_extracted, cost, duration")
        .gte("started_at", startDate)
        .lte("started_at", endDate)
        .order("started_at", { ascending: true }),
      supabase
        .from("flows")
        .select("id, name, mode, status, success_rate, total_runs, avg_duration"),
    ])

    if (runsResult.error) throw runsResult.error
    if (flowsResult.error) throw flowsResult.error

    const runs = runsResult.data ?? []
    const flows = flowsResult.data ?? []

    let totalRuns = 0
    let completedRuns = 0
    let failedRuns = 0
    let totalItems = 0
    let totalCost = 0
    let totalDuration = 0

    const dailyMap = new Map<string, { runs: number; success: number; failed: number; items: number }>()

    for (const run of runs) {
      totalRuns++
      if (run.status === "completed") completedRuns++
      if (run.status === "failed") failedRuns++
      totalItems += run.items_extracted || 0
      totalCost += run.cost || 0
      totalDuration += run.duration || 0

      const day = new Date(run.started_at).toISOString().split("T")[0]
      const entry = dailyMap.get(day) || { runs: 0, success: 0, failed: 0, items: 0 }
      entry.runs++
      if (run.status === "completed") entry.success++
      if (run.status === "failed") entry.failed++
      entry.items += run.items_extracted || 0
      dailyMap.set(day, entry)
    }

    const successRate = totalRuns > 0 ? (completedRuns / totalRuns) * 100 : 0
    const avgDuration = totalRuns > 0 ? totalDuration / totalRuns / 1000 : 0

    const daily = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const flowBreakdown = flows
      .map(flow => ({
        id: flow.id,
        name: flow.name,
        mode: flow.mode,
        runs: flow.total_runs || 0,
        successRate: flow.success_rate || 0,
        items: 0,
        avgDuration: flow.avg_duration || 0,
        cost: 0,
      }))
      .sort((a, b) => b.runs - a.runs)

    return NextResponse.json({
      summary: { totalRuns, completedRuns, failedRuns, successRate, totalItems, totalCost, avgDuration },
      daily,
      flowBreakdown,
      period: { days, since: startDate },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch analytics"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "30")
  const since = new Date(Date.now() - days * 86400000).toISOString()

  try {
    const { data: runs, error: runsError } = await supabase
      .from("runs")
      .select("*")
      .gte("started_at", since)
      .order("started_at", { ascending: false })

    if (runsError) throw runsError

    const { data: flows, error: flowsError } = await supabase
      .from("flows")
      .select("id, name, mode, status, success_rate, total_runs, avg_duration")

    if (flowsError) throw flowsError

    const totalRuns = runs?.length || 0
    const completedRuns = runs?.filter(r => r.status === "completed").length || 0
    const failedRuns = runs?.filter(r => r.status === "failed").length || 0
    const successRate = totalRuns > 0 ? (completedRuns / totalRuns) * 100 : 0
    const totalItems = runs?.reduce((sum, r) => sum + (r.items_extracted || 0), 0) || 0
    const totalCost = runs?.reduce((sum, r) => sum + (r.cost || 0), 0) || 0
    const avgDuration = totalRuns > 0
      ? (runs?.reduce((sum, r) => sum + (r.duration || 0), 0) || 0) / totalRuns / 1000
      : 0

    const dailyMap = new Map<string, { runs: number; success: number; failed: number; items: number }>()
    runs?.forEach(run => {
      const day = new Date(run.started_at).toISOString().split("T")[0]
      const entry = dailyMap.get(day) || { runs: 0, success: 0, failed: 0, items: 0 }
      entry.runs++
      if (run.status === "completed") entry.success++
      if (run.status === "failed") entry.failed++
      entry.items += run.items_extracted || 0
      dailyMap.set(day, entry)
    })

    const daily = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const flowBreakdown = flows?.map(flow => {
      const flowRuns = runs?.filter(r => r.flow_id === flow.id) || []
      return {
        id: flow.id,
        name: flow.name,
        mode: flow.mode,
        runs: flowRuns.length,
        successRate: flowRuns.length > 0
          ? (flowRuns.filter(r => r.status === "completed").length / flowRuns.length) * 100
          : 0,
        items: flowRuns.reduce((sum, r) => sum + (r.items_extracted || 0), 0),
        avgDuration: flowRuns.length > 0
          ? flowRuns.reduce((sum, r) => sum + (r.duration || 0), 0) / flowRuns.length / 1000
          : 0,
        cost: flowRuns.reduce((sum, r) => sum + (r.cost || 0), 0),
      }
    }).sort((a, b) => b.runs - a.runs) || []

    return NextResponse.json({
      summary: { totalRuns, completedRuns, failedRuns, successRate, totalItems, totalCost, avgDuration },
      daily,
      flowBreakdown,
      period: { days, since },
    })
  } catch {
    return NextResponse.json({
      summary: { totalRuns: 0, completedRuns: 0, failedRuns: 0, successRate: 0, totalItems: 0, totalCost: 0, avgDuration: 0 },
      daily: [],
      flowBreakdown: [],
      period: { days, since },
    })
  }
}

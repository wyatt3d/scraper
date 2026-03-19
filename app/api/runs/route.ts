import { NextRequest, NextResponse } from "next/server"
import { listRuns, createRun } from "@/lib/db"
import { getFlow } from "@/lib/db"
import { mockRuns, mockFlows } from "@/lib/mock-data"
import type { RunStatus } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const flowId = searchParams.get("flowId")
  const status = searchParams.get("status") as RunStatus | null

  try {
    const runs = await listRuns({ flowId: flowId || undefined, status: status || undefined })
    return NextResponse.json({ data: runs, total: runs.length })
  } catch {
    let runs = [...mockRuns]
    if (flowId) runs = runs.filter((r) => r.flowId === flowId)
    if (status) runs = runs.filter((r) => r.status === status)
    return NextResponse.json({ data: runs, total: runs.length })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { flowId } = body

  if (!flowId) {
    return NextResponse.json({ error: "flowId is required" }, { status: 400 })
  }

  try {
    const flow = await getFlow(flowId)
    const run = await createRun({ flow_id: flowId, flow_name: flow.name })
    return NextResponse.json({ data: run }, { status: 201 })
  } catch {
    const flow = mockFlows.find((f) => f.id === flowId)
    if (!flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 })
    }

    const now = new Date().toISOString()
    const newRun = {
      id: `run-${Date.now()}`,
      flowId,
      flowName: flow.name,
      status: "queued" as const,
      startedAt: now,
      duration: 0,
      itemsExtracted: 0,
      logs: [
        { timestamp: now, level: "info" as const, message: "Run queued" },
      ],
      cost: 0,
    }
    return NextResponse.json({ data: newRun }, { status: 201 })
  }
}

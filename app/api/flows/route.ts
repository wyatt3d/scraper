import { NextRequest, NextResponse } from "next/server"
import { mockFlows } from "@/lib/mock-data"
import type { FlowStatus, FlowMode } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status") as FlowStatus | null
  const mode = searchParams.get("mode") as FlowMode | null

  let flows = [...mockFlows]

  if (status) {
    flows = flows.filter((f) => f.status === status)
  }
  if (mode) {
    flows = flows.filter((f) => f.mode === mode)
  }

  return NextResponse.json({ data: flows, total: flows.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const now = new Date().toISOString()

  const newFlow = {
    id: `flow-${Date.now()}`,
    name: body.name ?? "Untitled Flow",
    description: body.description ?? "",
    url: body.url ?? "",
    mode: body.mode ?? "extract",
    status: "draft" as const,
    steps: body.steps ?? [],
    outputSchema: body.outputSchema ?? {},
    schedule: body.schedule,
    createdAt: now,
    updatedAt: now,
    successRate: 0,
    totalRuns: 0,
    avgDuration: 0,
  }

  return NextResponse.json({ data: newFlow }, { status: 201 })
}

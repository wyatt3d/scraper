import { NextRequest, NextResponse } from "next/server"
import { enqueueJob, listJobs } from "@/lib/queue"
import type { Job } from "@/lib/queue"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const status = searchParams.get("status") as Job["status"] | null
    const type = searchParams.get("type") as Job["type"] | null

    const jobs = await listJobs({
      status: status || undefined,
      type: type || undefined,
    })

    return NextResponse.json(jobs)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list jobs" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, payload, scheduledAt } = body as {
      type: Job["type"]
      payload?: Record<string, unknown>
      scheduledAt?: string
    }

    if (!type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 })
    }

    const validTypes = ["run_flow", "send_email", "send_webhook", "generate_report"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const id = await enqueueJob(
      type,
      payload || {},
      scheduledAt ? new Date(scheduledAt) : undefined
    )

    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to enqueue job" },
      { status: 500 }
    )
  }
}

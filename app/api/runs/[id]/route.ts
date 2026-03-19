import { NextRequest, NextResponse } from "next/server"
import { mockRuns } from "@/lib/mock-data"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const run = mockRuns.find((r) => r.id === id)

  if (!run) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 })
  }

  return NextResponse.json({ data: run })
}

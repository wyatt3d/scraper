import { NextRequest, NextResponse } from "next/server"
import { mockFlows } from "@/lib/mock-data"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const flow = mockFlows.find((f) => f.id === id)

  if (!flow) {
    return NextResponse.json({ error: "Flow not found" }, { status: 404 })
  }

  return NextResponse.json({ data: flow })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const flow = mockFlows.find((f) => f.id === id)

  if (!flow) {
    return NextResponse.json({ error: "Flow not found" }, { status: 404 })
  }

  const updates = await request.json()
  const updatedFlow = {
    ...flow,
    ...updates,
    id: flow.id,
    createdAt: flow.createdAt,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ data: updatedFlow })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const flow = mockFlows.find((f) => f.id === id)

  if (!flow) {
    return NextResponse.json({ error: "Flow not found" }, { status: 404 })
  }

  return NextResponse.json({ message: `Flow ${id} deleted successfully` })
}

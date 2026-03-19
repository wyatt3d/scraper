import { NextRequest, NextResponse } from "next/server"
import { mockApiKeys } from "@/lib/mock-data"

export async function GET() {
  const masked = mockApiKeys.map((key) => ({
    ...key,
    key: key.prefix + "****" + key.key.slice(-4),
  }))

  return NextResponse.json({ data: masked, total: masked.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newKey = {
    id: `key-${Date.now()}`,
    name: body.name ?? "New API Key",
    key: `scr_live_${crypto.randomUUID().replace(/-/g, "")}`,
    prefix: "scr_live_",
    createdAt: new Date().toISOString(),
    scopes: body.scopes ?? ["flows:read", "runs:read"],
  }

  return NextResponse.json({ data: newKey }, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { listApiKeys, createApiKey } from "@/lib/db"
import { mockApiKeys } from "@/lib/mock-data"

export async function GET() {
  try {
    const keys = await listApiKeys()
    const masked = keys.map((key: { prefix: string; key_hash: string; [k: string]: unknown }) => ({
      ...key,
      key: key.prefix + "****" + key.key_hash.slice(-4),
    }))
    return NextResponse.json({ data: masked, total: masked.length })
  } catch {
    const masked = mockApiKeys.map((key) => ({
      ...key,
      key: key.prefix + "****" + key.key.slice(-4),
    }))
    return NextResponse.json({ data: masked, total: masked.length })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const rawKey = `scr_live_${crypto.randomUUID().replace(/-/g, "")}`
    const key = await createApiKey({
      name: body.name ?? "New API Key",
      key_hash: rawKey,
      prefix: "scr_live_",
      scopes: body.scopes ?? ["flows:read", "runs:read"],
    })
    return NextResponse.json({ data: { ...key, key: rawKey } }, { status: 201 })
  } catch {
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
}

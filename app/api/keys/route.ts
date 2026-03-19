import { NextRequest, NextResponse } from "next/server"
import { listApiKeys, createApiKey } from "@/lib/db"

export async function GET() {
  try {
    const keys = await listApiKeys()
    const masked = keys.map((key: { prefix: string; key_hash: string; [k: string]: unknown }) => ({
      ...key,
      key: key.prefix + "****" + key.key_hash.slice(-4),
    }))
    return NextResponse.json({ data: masked, total: masked.length })
  } catch {
    return NextResponse.json({ data: [], total: 0 })
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
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

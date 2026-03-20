import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { listApiKeys, createApiKey } from "@/lib/db"
import { checkCsrf } from "@/lib/csrf"

export async function GET() {
  try {
    const keys = await listApiKeys()
    const masked = keys.map((key) => ({
      ...key,
      key: key.prefix + "****",
    }))
    return NextResponse.json({ data: masked, total: masked.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch API keys"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const csrfError = checkCsrf(request)
  if (csrfError) return csrfError

  const body = await request.json()

  try {
    const rawKey = `scr_live_${crypto.randomUUID().replace(/-/g, "")}`
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")
    const key = await createApiKey({
      name: body.name ?? "New API Key",
      key_hash: keyHash,
      prefix: "scr_live_",
      scopes: body.scopes ?? ["flows:read", "runs:read"],
    })
    return NextResponse.json({ data: { ...key, key: rawKey } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { executeRecorderSession } from "@/lib/engine/recorder"
import { checkCsrf } from "@/lib/csrf"

const startSchema = z.object({
  url: z.string().url(),
})

export async function POST(req: NextRequest) {
  const csrfError = checkCsrf(req)
  if (csrfError) return csrfError

  try {
    const body = await req.json()
    const parsed = startSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const result = await executeRecorderSession(parsed.data.url, [])
    return NextResponse.json({
      sessionId: crypto.randomUUID(),
      ...result,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start recorder" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { checkCsrf } from "@/lib/csrf"
import { executeRecorderSession } from "@/lib/engine/recorder"

export const maxDuration = 60

const previewSchema = z.object({
  url: z.string().url(),
  actions: z.array(z.object({
    type: z.enum(["click", "fill", "scroll", "wait"]),
    selector: z.string(),
    value: z.string().optional(),
  })),
})

export async function POST(req: NextRequest) {
  const csrfError = checkCsrf(req)
  if (csrfError) return csrfError

  try {
    const body = await req.json()
    const parsed = previewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const result = await executeRecorderSession(parsed.data.url, parsed.data.actions)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Preview failed" },
      { status: 500 }
    )
  }
}

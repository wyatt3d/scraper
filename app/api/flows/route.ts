import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { validateApiKey } from "@/lib/api-auth"
import { toFlow } from "@/lib/mappers"
import { checkCsrf } from "@/lib/csrf"
import { z } from "zod"

const createFlowSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional().default(""),
  url: z.string().url(),
  mode: z.enum(["extract", "interact", "monitor"]),
  steps: z.array(z.any()).optional().default([]),
  output_schema: z.record(z.any()).optional().default({}),
})

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  if (apiKey) {
    const isValid = await validateApiKey(apiKey)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 })
    }
  }

  const searchParams = req.nextUrl.searchParams
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
  const offset = parseInt(searchParams.get("offset") || "0")

  const { data, error } = await supabase
    .from("flows")
    .select("id, name, description, url, mode, status, success_rate, total_runs, avg_duration, created_at, updated_at, last_run_at")
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const response = NextResponse.json({ data: (data || []).map(toFlow) })
  response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
  return response
}

export async function POST(req: NextRequest) {
  const csrfError = checkCsrf(req)
  if (csrfError) return csrfError

  try {
    const body = await req.json()

    const result = createFlowSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
    }
    const validated = result.data

    const { data, error } = await supabase
      .from("flows")
      .insert({
        name: validated.name,
        description: validated.description,
        url: validated.url,
        mode: validated.mode,
        status: "draft",
        steps: validated.steps,
        output_schema: validated.output_schema,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: toFlow(data) }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create flow"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

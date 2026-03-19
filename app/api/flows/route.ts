import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { toFlow } from "@/lib/mappers"

export async function GET(req: NextRequest) {
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
  try {
    const body = await req.json()

    if (!body.name && !body.url) {
      return NextResponse.json({ error: "Name or URL is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("flows")
      .insert({
        name: body.name || "Untitled Flow",
        description: body.description || "",
        url: body.url || "https://example.com",
        mode: body.mode || "extract",
        status: body.status || "draft",
        steps: body.steps || [],
        output_schema: body.outputSchema || body.output_schema || {},
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

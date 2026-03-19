import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

const createTicketSchema = z.object({
  type: z.enum(["bug", "feature", "question"]).default("bug"),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  steps_to_reproduce: z.string().max(5000).optional().default(""),
  page_url: z.string().max(500).optional().default(""),
  email: z.string().email().optional().or(z.literal("")).default(""),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const offset = parseInt(searchParams.get("offset") || "0")

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)
    if (error) throw error
    const response = NextResponse.json({ data: data || [] })
    response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
    return response
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createTicketSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
    }
    const validated = result.data
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        type: validated.type,
        severity: validated.severity,
        title: validated.title,
        description: validated.description,
        steps_to_reproduce: validated.steps_to_reproduce,
        page_url: validated.page_url,
        email: validated.email,
        status: "open",
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

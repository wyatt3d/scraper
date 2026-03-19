import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const offset = parseInt(searchParams.get("offset") || "0")

    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)
    if (error) throw error
    const response = NextResponse.json({ data: data || [] })
    response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch webhooks"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from("webhooks")
      .insert({
        url: body.url,
        events: body.events || [],
        secret: body.secret || crypto.randomUUID(),
        active: true,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create webhook"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

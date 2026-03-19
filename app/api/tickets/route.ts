import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        type: body.type,
        severity: body.severity || "medium",
        title: body.title,
        description: body.description,
        steps_to_reproduce: body.stepsToReproduce || "",
        page_url: body.pageUrl || "",
        email: body.email || "",
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

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return NextResponse.json({ data: data || [] })
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
    return NextResponse.json({ data: { id: crypto.randomUUID().slice(0, 8) } }, { status: 201 })
  }
}

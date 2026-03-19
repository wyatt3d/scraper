import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, unknown> = {}
    if (body.url !== undefined) updates.url = body.url
    if (body.events !== undefined) updates.events = body.events
    if (body.secret !== undefined) updates.secret = body.secret
    if (body.active !== undefined) updates.active = body.active

    const { data, error } = await supabase
      .from("webhooks")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update webhook"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from("webhooks")
      .delete()
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete webhook"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

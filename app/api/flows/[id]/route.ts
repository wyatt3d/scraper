import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { toFlow } from "@/lib/mappers"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from("flows")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data: toFlow(data) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const updateFields: Record<string, unknown> = {}
  if (body.name !== undefined) updateFields.name = body.name
  if (body.description !== undefined) updateFields.description = body.description
  if (body.url !== undefined) updateFields.url = body.url
  if (body.mode !== undefined) updateFields.mode = body.mode
  if (body.status !== undefined) updateFields.status = body.status
  if (body.steps !== undefined) updateFields.steps = body.steps
  if (body.outputSchema !== undefined) updateFields.output_schema = body.outputSchema
  if (body.schedule !== undefined) updateFields.schedule = body.schedule
  updateFields.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("flows")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: toFlow(data) })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabase.from("flows").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { validateApiKey } from "@/lib/api-auth"
import { toFlow } from "@/lib/mappers"
import { z } from "zod"

const updateFlowSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional(),
  mode: z.enum(["extract", "interact", "monitor"]).optional(),
  status: z.enum(["active", "paused", "draft", "error"]).optional(),
  steps: z.array(z.any()).optional(),
  output_schema: z.record(z.any()).optional(),
  schedule: z.any().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = _req.headers.get("x-api-key")
  if (apiKey) {
    const isValid = await validateApiKey(apiKey)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 })
    }
  }

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

  const result = updateFlowSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
  }
  const validated = result.data

  const updateFields: Record<string, unknown> = {}
  if (validated.name !== undefined) updateFields.name = validated.name
  if (validated.description !== undefined) updateFields.description = validated.description
  if (validated.url !== undefined) updateFields.url = validated.url
  if (validated.mode !== undefined) updateFields.mode = validated.mode
  if (validated.status !== undefined) updateFields.status = validated.status
  if (validated.steps !== undefined) updateFields.steps = validated.steps
  if (validated.output_schema !== undefined) updateFields.output_schema = validated.output_schema
  if (validated.schedule !== undefined) updateFields.schedule = validated.schedule
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

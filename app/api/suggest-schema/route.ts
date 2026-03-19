import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { description } = await request.json()
    if (!description) return NextResponse.json({ error: "description required" }, { status: 400 })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Given this data extraction request: "${description}"

Suggest an output schema (field names and types). Respond with ONLY a JSON object:
{"schema": {"fieldName": "string|number|url|date", ...}, "description": "what each field represents"}`
      }]
    })

    const content = message.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected" }, { status: 500 })
    }
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: "Parse failed" }, { status: 422 })
    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 })
  }
}

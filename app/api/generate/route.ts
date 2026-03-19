import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { url, description } = await request.json()
    if (!description) return NextResponse.json({ error: "description required" }, { status: 400 })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `You are a web scraping expert. Generate a scraping flow definition as JSON for the following request.

URL: ${url || "not specified"}
User request: ${description}

Respond with ONLY a JSON object (no markdown, no explanation) in this exact format:
{
  "name": "Flow name",
  "description": "What this flow does",
  "url": "target URL",
  "mode": "extract" or "monitor" or "interact",
  "steps": [
    {
      "id": "s1",
      "type": "navigate",
      "label": "Go to page"
    },
    {
      "id": "s2",
      "type": "extract",
      "label": "Extract data",
      "extractionRules": [
        {
          "field": "fieldName",
          "selector": "CSS selector",
          "transform": "text"
        }
      ]
    }
  ],
  "outputSchema": {
    "fieldName": "string"
  }
}

Step types: navigate, click, fill, extract, wait, scroll, condition, loop
Transform types: text, number, url, date, html
Use real CSS selectors that would work on the target website.`
      }],
    })

    const content = message.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 })
    }

    let flowDef
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("No JSON found in response")
      flowDef = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: content.text }, { status: 422 })
    }

    return NextResponse.json({ flow: flowDef })
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()
    if (!to || !subject) {
      return NextResponse.json({ error: "Missing to or subject" }, { status: 400 })
    }
    const result = await sendEmail({ to, subject, html: html || "" })
    return NextResponse.json({ success: true, id: result?.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

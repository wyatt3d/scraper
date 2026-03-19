import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    const users = (data?.users || []).map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Unknown",
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      emailConfirmed: !!user.email_confirmed_at,
      provider: user.app_metadata?.provider || "email",
      role: user.role || "authenticated",
    }))

    return NextResponse.json({ data: users, total: users.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list users"
    return NextResponse.json({ error: message, data: [], total: 0 }, { status: 500 })
  }
}

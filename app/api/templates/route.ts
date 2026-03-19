import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ data: [], total: 0 })
    }

    const response = NextResponse.json({ data: data || [], total: data?.length || 0 })
    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    return response
  } catch {
    return NextResponse.json({ data: [], total: 0 })
  }
}

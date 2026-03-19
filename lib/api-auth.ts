import { supabase } from "./supabase"
import crypto from "crypto"

export async function validateApiKey(rawKey: string): Promise<boolean> {
  const hash = crypto.createHash("sha256").update(rawKey).digest("hex")
  const { data } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", hash)
    .single()
  return !!data
}

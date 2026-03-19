import { supabase } from "./supabase"

// Flows
export async function listFlows(filters?: { status?: string; mode?: string }) {
  let query = supabase.from("flows").select("*").order("created_at", { ascending: false })
  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.mode) query = query.eq("mode", filters.mode)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getFlow(id: string) {
  const { data, error } = await supabase.from("flows").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function createFlow(flow: { name: string; url: string; mode: string; description?: string; steps?: unknown[]; output_schema?: Record<string, unknown> }) {
  const { data, error } = await supabase.from("flows").insert(flow).select().single()
  if (error) throw error
  return data
}

export async function updateFlow(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase.from("flows").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteFlow(id: string) {
  const { error } = await supabase.from("flows").delete().eq("id", id)
  if (error) throw error
}

// Runs
export async function listRuns(filters?: { flowId?: string; status?: string }) {
  let query = supabase.from("runs").select("*").order("started_at", { ascending: false })
  if (filters?.flowId) query = query.eq("flow_id", filters.flowId)
  if (filters?.status) query = query.eq("status", filters.status)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getRun(id: string) {
  const { data, error } = await supabase.from("runs").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function createRun(run: { flow_id: string; flow_name: string }) {
  const { data, error } = await supabase.from("runs").insert({ ...run, status: "queued" }).select().single()
  if (error) throw error
  return data
}

// API Keys
export async function listApiKeys() {
  const { data, error } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createApiKey(key: { name: string; key_hash: string; prefix: string; scopes: string[] }) {
  const { data, error } = await supabase.from("api_keys").insert(key).select().single()
  if (error) throw error
  return data
}

// Alerts
export async function listAlerts() {
  const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data
}

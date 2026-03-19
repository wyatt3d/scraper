import { supabase } from "./supabase"

export interface Job {
  id: string
  type: "run_flow" | "send_email" | "send_webhook" | "generate_report"
  payload: Record<string, unknown>
  status: "pending" | "processing" | "completed" | "failed"
  attempts: number
  max_attempts: number
  scheduled_at: string
  started_at?: string
  completed_at?: string
  error?: string
  created_at: string
}

export async function enqueueJob(
  type: Job["type"],
  payload: Record<string, unknown>,
  scheduledAt?: Date
): Promise<string> {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      type,
      payload,
      status: "pending",
      max_attempts: 3,
      scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) throw error
  return data.id
}

export async function processNextJob(): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
      attempts: 1,
    })
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .select()
    .single()

  if (error || !data) return null
  return data as unknown as Job
}

export async function completeJob(
  jobId: string,
  result?: Record<string, unknown>
): Promise<void> {
  await supabase
    .from("jobs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      payload: result ? { ...result } : undefined,
    })
    .eq("id", jobId)
}

export async function failJob(jobId: string, error: string): Promise<void> {
  const { data } = await supabase
    .from("jobs")
    .select("attempts, max_attempts")
    .eq("id", jobId)
    .single()

  const shouldRetry = data && data.attempts < data.max_attempts

  await supabase
    .from("jobs")
    .update({
      status: shouldRetry ? "pending" : "failed",
      error,
      attempts: (data?.attempts || 0) + 1,
      started_at: null,
    })
    .eq("id", jobId)
}

export async function listJobs(filters?: {
  status?: Job["status"]
  type?: Job["type"]
}): Promise<Job[]> {
  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.type) query = query.eq("type", filters.type)

  const { data, error } = await query
  if (error) throw error
  return (data || []) as unknown as Job[]
}

import type { RecorderAction, ElementInfo } from "../types"

const RECORDER_API_URL = process.env.RECORDER_API_URL || "http://72.62.83.124:3001"
const RECORDER_API_KEY = process.env.RECORDER_API_KEY || "scr_recorder_secret_2026"

export async function executeRecorderSession(
  url: string,
  actions: RecorderAction[]
): Promise<{
  screenshot: string
  elements: ElementInfo[]
  currentUrl: string
  pageTitle: string
}> {
  const endpoint = actions.length === 0 ? "recorder/start" : "recorder/action"
  const body = actions.length === 0 ? { url } : { url, actions }

  const response = await fetch(`${RECORDER_API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": RECORDER_API_KEY,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(50000),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
    throw new Error(errorData.error || `Recorder API error: ${response.status}`)
  }

  return response.json()
}

export async function logAudit(entry: {
  actor: string
  action: "created" | "updated" | "deleted" | "executed" | "viewed"
  resourceType: string
  resourceName?: string
  details?: Record<string, unknown>
}) {
  try {
    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    })
  } catch {
    // Silent fail -- audit logging should never block operations
  }
}

interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  url?: string
  metadata?: Record<string, unknown>
}

class ErrorTracker {
  captureException(error: Error, context?: ErrorContext): void {
    const entry = {
      level: "error" as const,
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      ...context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }
    console.error("[ErrorTracker]", JSON.stringify(entry))

    if (process.env.NODE_ENV === "production") {
      this.persistError(entry).catch(() => {})
    }
  }

  captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
    console.error(`[ErrorTracker:${level}]`, message)
  }

  private async persistError(entry: Record<string, unknown>): Promise<void> {
    try {
      const { supabase } = await import("./supabase")
      await supabase.from("audit_log").insert({
        actor: "system",
        action: "error",
        resource_type: "system",
        resource_name: String(entry.component || "unknown"),
        details: entry,
      })
    } catch {}
  }
}

export const errorTracker = new ErrorTracker()

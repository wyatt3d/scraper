interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  metadata?: Record<string, unknown>
}

class ErrorTracker {
  private isProduction = process.env.NODE_ENV === "production"

  captureException(error: Error, context?: ErrorContext): void {
    if (this.isProduction) {
      console.error("[ErrorTracker]", {
        message: error.message,
        stack: error.stack,
        ...context,
        timestamp: new Date().toISOString(),
      })
    }
  }

  captureMessage(message: string, level: "info" | "warning" | "error" = "info", context?: ErrorContext): void {
    if (this.isProduction) {
      console.error(`[ErrorTracker:${level}]`, {
        message,
        ...context,
        timestamp: new Date().toISOString(),
      })
    }
  }

  setUser(userId: string, email?: string): void {
    // Will be used when Sentry is integrated
  }
}

export const errorTracker = new ErrorTracker()

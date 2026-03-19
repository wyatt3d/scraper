"use client"

import { Button } from "@/components/ui/button"

export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 p-8 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">{error.message || "An unexpected error occurred"}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}

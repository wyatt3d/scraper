"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"

interface UsageWarningProps {
  usage?: { runs: number; limit: number }
}

export function UsageWarning({ usage }: UsageWarningProps) {
  if (!usage) return null

  const runsPercent = (usage.runs / usage.limit) * 100

  if (runsPercent < 75) return null

  const isNearLimit = runsPercent >= 90

  return (
    <Alert className={isNearLimit ? "border-red-500/50 bg-red-500/5" : "border-yellow-500/50 bg-yellow-500/5"}>
      {isNearLimit ? (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      ) : (
        <TrendingUp className="h-4 w-4 text-yellow-500" />
      )}
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isNearLimit
            ? `You've used ${runsPercent.toFixed(0)}% of your monthly runs. Upgrade to avoid interruptions.`
            : `You're approaching your usage limit (${runsPercent.toFixed(0)}% of runs used).`
          }
        </span>
        <Button size="sm" variant="outline" asChild>
          <Link href="/settings">Upgrade Plan</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

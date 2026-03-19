"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { mockUser } from "@/lib/mock-data"

export function UsageWarning() {
  const { usage } = mockUser
  const runsPercent = (usage.runsUsed / usage.runsLimit) * 100
  const apiPercent = (usage.apiCallsUsed / usage.apiCallsLimit) * 100

  if (runsPercent < 75 && apiPercent < 75) return null

  const isNearLimit = runsPercent >= 90 || apiPercent >= 90

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

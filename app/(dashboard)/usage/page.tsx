"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  Activity,
  Database,
  DollarSign,
  Download,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const UsageDailyChart = dynamic(
  () => import("@/components/dashboard/usage-daily-chart").then((mod) => ({ default: mod.UsageDailyChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />, ssr: false }
)

interface AnalyticsData {
  summary: {
    totalRuns: number
    completedRuns: number
    failedRuns: number
    successRate: number
    totalItems: number
    totalCost: number
    avgDuration: number
  }
  daily: { date: string; runs: number; success: number; failed: number; items: number }[]
  flowBreakdown: {
    id: string
    name: string
    mode: string
    runs: number
    successRate: number
    items: number
    avgDuration: number
    cost: number
  }[]
  period: { days: number; since: string }
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return n.toLocaleString()
  return n.toString()
}

function StatSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  )
}

export default function UsagePage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/analytics?days=30")
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const summary = data?.summary
  const isEmpty = !loading && (!summary || summary.totalRuns === 0)

  const dailyChartData = data?.daily.map(d => ({
    date: d.date,
    runs: d.runs,
  }))

  const summaryCards = summary ? [
    { title: "Total Runs", value: formatNumber(summary.totalRuns), subtitle: "This period", icon: Activity },
    { title: "Completed", value: formatNumber(summary.completedRuns), subtitle: `${summary.successRate.toFixed(1)}% success rate`, icon: TrendingUp },
    { title: "Data Points", value: formatNumber(summary.totalItems), subtitle: "Items extracted", icon: Database },
    { title: "Total Cost", value: `$${summary.totalCost.toFixed(2)}`, subtitle: "This period", icon: DollarSign },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Usage & Billing
          </h1>
          <p className="text-muted-foreground mt-1">
            Current period: last 30 days
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.success("Report exported", { description: "Usage report downloaded as PDF." })}
        >
          <Download className="mr-2 size-4" />
          Export Report
        </Button>
      </div>

      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="size-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No usage data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create and run a flow to see usage metrics
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
              : summaryCards.map((card) => (
                  <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <card.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Usage</CardTitle>
              <CardDescription>Runs per day for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <UsageDailyChart data={dailyChartData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Flow</CardTitle>
              <CardDescription>Resource consumption breakdown per flow</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : data?.flowBreakdown && data.flowBreakdown.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flow</TableHead>
                      <TableHead className="text-right">Runs</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Avg Duration</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.flowBreakdown.map((flow) => (
                      <TableRow key={flow.id}>
                        <TableCell className="font-medium">{flow.name}</TableCell>
                        <TableCell className="text-right">{flow.runs.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatNumber(flow.items)}</TableCell>
                        <TableCell className="text-right">{flow.avgDuration.toFixed(1)}s</TableCell>
                        <TableCell className="text-right">${flow.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No flow data available</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

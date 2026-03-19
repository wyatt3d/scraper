"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  Activity,
  Clock,
  Database,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const RunsChart = dynamic(
  () => import("@/components/dashboard/analytics/runs-chart").then((mod) => ({ default: mod.RunsChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />, ssr: false }
)

const DataChart = dynamic(
  () => import("@/components/dashboard/analytics/data-chart").then((mod) => ({ default: mod.DataChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />, ssr: false }
)

const CostChart = dynamic(
  () => import("@/components/dashboard/analytics/cost-chart").then((mod) => ({ default: mod.CostChart })),
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

const DATE_RANGE_MAP: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

const MODE_COLORS: Record<string, string> = {
  extract: "hsl(221, 83%, 53%)",
  interact: "hsl(262, 83%, 58%)",
  monitor: "hsl(142, 71%, 45%)",
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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")

  const period = DATE_RANGE_MAP[dateRange] || 30

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/analytics?days=${period}`)
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  const summary = data?.summary
  const isEmpty = !loading && (!summary || summary.totalRuns === 0)

  const stats = summary ? [
    { title: "Total Runs", value: formatNumber(summary.totalRuns), icon: Activity },
    { title: "Success Rate", value: `${summary.successRate.toFixed(1)}%`, icon: TrendingUp },
    { title: "Data Points", value: formatNumber(summary.totalItems), icon: Database },
    { title: "Avg Duration", value: `${summary.avgDuration.toFixed(1)}s`, icon: Clock },
    { title: "Total Cost", value: `$${summary.totalCost.toFixed(2)}`, icon: DollarSign },
  ] : []

  const runsChartData = data?.daily.map(d => ({
    date: d.date,
    success: d.success,
    failed: d.failed,
  }))

  const dataChartData = data?.daily.map(d => ({
    date: d.date,
    points: d.items,
  }))

  const costChartData = data?.flowBreakdown
    .filter(f => f.cost > 0)
    .map(f => ({
      name: f.name,
      value: parseFloat(f.cost.toFixed(2)),
      fill: MODE_COLORS[f.mode] || "hsl(220, 10%, 50%)",
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your scraping metrics and performance.
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="size-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create and run a flow to see analytics
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Runs Over Time</CardTitle>
                <CardDescription>Success and failed runs over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <RunsChart data={runsChartData} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Points Extracted</CardTitle>
                <CardDescription>Total data points collected per day</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <DataChart data={dataChartData} />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Flows</CardTitle>
              <CardDescription>Performance breakdown by flow</CardDescription>
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
                      <TableHead className="text-right">Success</TableHead>
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
                        <TableCell className="text-right">{flow.successRate.toFixed(1)}%</TableCell>
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

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Where your budget is being spent</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <CostChart data={costChartData} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

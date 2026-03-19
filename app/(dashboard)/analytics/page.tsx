"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  Database,
  DollarSign,
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

const stats = [
  {
    title: "Total Runs",
    value: "4,287",
    change: "+12%",
    positive: true,
    icon: Activity,
  },
  {
    title: "Success Rate",
    value: "96.8%",
    change: "+1.2%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Data Points",
    value: "1.2M",
    change: "+23%",
    positive: true,
    icon: Database,
  },
  {
    title: "Avg Duration",
    value: "8.4s",
    change: "-15%",
    positive: true,
    icon: Clock,
  },
  {
    title: "Total Cost",
    value: "$12.47",
    change: "-8%",
    positive: true,
    icon: DollarSign,
  },
]

const topFlows = [
  { name: "Product Price Monitor", runs: 248, success: "98.5%", items: "36,456", avgDuration: "12.4s", cost: "$3.72" },
  { name: "Job Listings Scraper", runs: 412, success: "96.2%", items: "36,668", avgDuration: "28.6s", cost: "$4.94" },
  { name: "Craigslist Cars", runs: 1024, success: "94.7%", items: "23,552", avgDuration: "45.2s", cost: "$2.89" },
  { name: "News Aggregator", runs: 856, success: "97.1%", items: "128,400", avgDuration: "6.2s", cost: "$1.84" },
  { name: "Social Media Tracker", runs: 632, success: "95.8%", items: "45,920", avgDuration: "18.7s", cost: "$3.12" },
  { name: "Real Estate Listings", runs: 389, success: "93.4%", items: "12,480", avgDuration: "52.1s", cost: "$2.46" },
  { name: "Stock Data Feed", runs: 726, success: "99.2%", items: "892,000", avgDuration: "2.1s", cost: "$0.92" },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

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
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stat.positive ? (
                  <ArrowUp className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="size-3 text-red-500" />
                )}
                <span className="text-emerald-500">
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs prev period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Runs Over Time</CardTitle>
            <CardDescription>Success and failed runs over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RunsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Points Extracted</CardTitle>
            <CardDescription>Total data points collected per day</CardDescription>
          </CardHeader>
          <CardContent>
            <DataChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Flows</CardTitle>
          <CardDescription>Performance breakdown by flow</CardDescription>
        </CardHeader>
        <CardContent>
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
              {topFlows.map((flow) => (
                <TableRow key={flow.name}>
                  <TableCell className="font-medium">{flow.name}</TableCell>
                  <TableCell className="text-right">{flow.runs.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{flow.success}</TableCell>
                  <TableCell className="text-right">{flow.items}</TableCell>
                  <TableCell className="text-right">{flow.avgDuration}</TableCell>
                  <TableCell className="text-right">{flow.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>Where your budget is being spent</CardDescription>
        </CardHeader>
        <CardContent>
          <CostChart />
        </CardContent>
      </Card>
    </div>
  )
}

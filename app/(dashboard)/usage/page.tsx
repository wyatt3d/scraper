"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Activity,
  CheckCircle2,
  Download,
  Globe,
  HardDrive,
  Receipt,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

const UsageDailyChart = dynamic(
  () => import("@/components/dashboard/usage-daily-chart").then((mod) => ({ default: mod.UsageDailyChart })),
  { loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />, ssr: false }
)

const summaryCards = [
  {
    title: "Runs Used",
    value: "1,885",
    limit: "5,000",
    percent: 37.7,
    icon: Activity,
    hasBar: true,
  },
  {
    title: "API Calls",
    value: "12,450",
    limit: "50,000",
    percent: 24.9,
    icon: Zap,
    hasBar: true,
  },
  {
    title: "Data Points",
    value: "845,200",
    limit: "Unlimited",
    percent: 0,
    icon: Globe,
    hasBar: false,
  },
  {
    title: "Bandwidth",
    value: "28.4 GB",
    limit: "100 GB",
    percent: 28.4,
    icon: HardDrive,
    hasBar: true,
  },
  {
    title: "Current Bill",
    value: "$29.00",
    limit: "Pro Plan",
    percent: 0,
    icon: Receipt,
    hasBar: false,
  },
]

const flowUsage = [
  { name: "Amazon Monitor", runs: 480, apiCalls: "3,840", dataPoints: "282,240", bandwidth: "8.2 GB", cost: "$5.76" },
  { name: "Indeed Scraper", runs: 240, apiCalls: "1,920", dataPoints: "141,120", bandwidth: "5.1 GB", cost: "$4.32" },
  { name: "Zillow Monitor", runs: 120, apiCalls: "960", dataPoints: "70,560", bandwidth: "3.8 GB", cost: "$2.16" },
  { name: "HN Scraper", runs: 960, apiCalls: "7,680", dataPoints: "345,600", bandwidth: "9.6 GB", cost: "$2.88" },
  { name: "GitHub Trending", runs: 85, apiCalls: "680", dataPoints: "5,680", bandwidth: "1.7 GB", cost: "$0.51" },
]

const billingHistory = [
  { period: "March 2026", plan: "Pro", runs: "1,885", status: "in progress", cost: "$29.00", invoice: "current" },
  { period: "February 2026", plan: "Pro", runs: "4,231", status: "paid", cost: "$29.00", invoice: "download" },
  { period: "January 2026", plan: "Pro", runs: "3,892", status: "paid", cost: "$29.00", invoice: "download" },
  { period: "December 2025", plan: "Pro", runs: "2,104", status: "paid", cost: "$29.00", invoice: "download" },
  { period: "November 2025", plan: "Free", runs: "98", status: "paid", cost: "$0.00", invoice: "download" },
  { period: "October 2025", plan: "Free", runs: "12", status: "paid", cost: "$0.00", invoice: "download" },
]

export default function UsagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Usage & Billing
          </h1>
          <p className="text-muted-foreground mt-1">
            Current Period: Mar 1-31, 2026
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
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
                {card.hasBar ? `of ${card.limit} (${card.percent}%)` : card.limit}
              </p>
              {card.hasBar && (
                <Progress value={card.percent} className="mt-2 h-1.5" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
          <CardDescription>Runs per day for the current billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <UsageDailyChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage by Flow</CardTitle>
          <CardDescription>Resource consumption breakdown per flow</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow</TableHead>
                <TableHead className="text-right">Runs</TableHead>
                <TableHead className="text-right">API Calls</TableHead>
                <TableHead className="text-right">Data Points</TableHead>
                <TableHead className="text-right">Bandwidth</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flowUsage.map((flow) => (
                <TableRow key={flow.name}>
                  <TableCell className="font-medium">{flow.name}</TableCell>
                  <TableCell className="text-right">{flow.runs.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{flow.apiCalls}</TableCell>
                  <TableCell className="text-right">{flow.dataPoints}</TableCell>
                  <TableCell className="text-right">{flow.bandwidth}</TableCell>
                  <TableCell className="text-right">{flow.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <CardTitle>Overage Projection</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              At current usage rate, you&apos;ll use <span className="font-semibold">3,247</span> of{" "}
              <span className="font-semibold">5,000</span> runs this month (65%).
            </p>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                No overage expected
              </p>
            </div>
            <Progress value={65} className="mt-2 h-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Past invoices and billing periods</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Runs</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium">{row.period}</TableCell>
                  <TableCell>
                    <Badge variant={row.plan === "Pro" ? "default" : "secondary"}>
                      {row.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span>{row.runs}</span>
                    {row.status === "in progress" && (
                      <span className="ml-1 text-xs text-muted-foreground">(in progress)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{row.cost}</TableCell>
                  <TableCell className="text-right">
                    {row.invoice === "current" ? (
                      <Badge variant="outline">Current</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toast.success("Invoice downloaded", { description: `${row.period} invoice saved.` })}
                      >
                        <Download className="mr-1 size-3" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

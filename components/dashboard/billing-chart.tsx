"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const dailyUsageData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const base = 30 + Math.floor(Math.random() * 40)
  const apiBase = base * 6 + Math.floor(Math.random() * 100)
  return {
    date: `Mar ${day}`,
    runs: day <= 18 ? base : 0,
    apiCalls: day <= 18 ? apiBase : 0,
  }
})

const usageChartConfig = {
  runs: {
    label: "Runs",
    color: "hsl(221, 83%, 53%)",
  },
  apiCalls: {
    label: "API Calls",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig

export function BillingChart() {
  return (
    <ChartContainer config={usageChartConfig} className="h-[200px] w-full">
      <AreaChart data={dailyUsageData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="fillRuns" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-runs)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-runs)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillApiCalls" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-apiCalls)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-apiCalls)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.replace("Mar ", "")}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="apiCalls"
          type="monotone"
          fill="url(#fillApiCalls)"
          stroke="var(--color-apiCalls)"
          strokeWidth={1.5}
        />
        <Area
          dataKey="runs"
          type="monotone"
          fill="url(#fillRuns)"
          stroke="var(--color-runs)"
          strokeWidth={1.5}
        />
      </AreaChart>
    </ChartContainer>
  )
}

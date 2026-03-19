"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", runs: 18, successful: 16 },
  { day: "Tue", runs: 24, successful: 22 },
  { day: "Wed", runs: 21, successful: 19 },
  { day: "Thu", runs: 28, successful: 26 },
  { day: "Fri", runs: 32, successful: 30 },
  { day: "Sat", runs: 15, successful: 14 },
  { day: "Sun", runs: 22, successful: 21 },
]

const chartConfig = {
  runs: {
    label: "Total Runs",
    color: "hsl(221, 83%, 53%)",
  },
  successful: {
    label: "Successful",
    color: "hsl(142, 71%, 45%)",
  },
} satisfies ChartConfig

export function UsageChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id="fillRuns" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-runs)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-runs)"
              stopOpacity={0.02}
            />
          </linearGradient>
          <linearGradient
            id="fillSuccessful"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--color-successful)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-successful)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border"
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="runs"
          type="monotone"
          fill="url(#fillRuns)"
          stroke="var(--color-runs)"
          strokeWidth={2}
        />
        <Area
          dataKey="successful"
          type="monotone"
          fill="url(#fillSuccessful)"
          stroke="var(--color-successful)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

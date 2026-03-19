"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const dailyData = Array.from({ length: 19 }, (_, i) => {
  const day = i + 1
  const base = 80 + Math.floor(Math.random() * 40)
  const weekend = (new Date(2026, 2, day).getDay() % 6 === 0) ? 0.6 : 1
  return {
    date: `Mar ${day}`,
    runs: Math.floor(base * weekend),
  }
})

const chartConfig = {
  runs: {
    label: "Runs",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig

export function UsageDailyChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="fillRuns" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-runs)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-runs)" stopOpacity={0} />
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

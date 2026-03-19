"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  runs: {
    label: "Runs",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig

interface UsageDailyChartProps {
  data?: { date: string; runs: number }[]
}

export function UsageDailyChart({ data }: UsageDailyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No daily usage data yet
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
          tickFormatter={(v) => v.slice(5)}
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

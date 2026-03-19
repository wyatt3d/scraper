"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(142, 71%, 45%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

interface RunsChartProps {
  data?: { date: string; success: number; failed: number }[]
}

export function RunsChart({ data }: RunsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No run data yet
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-failed)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-failed)" stopOpacity={0} />
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
          dataKey="success"
          type="monotone"
          fill="url(#fillSuccess)"
          stroke="var(--color-success)"
          strokeWidth={1.5}
          stackId="1"
        />
        <Area
          dataKey="failed"
          type="monotone"
          fill="url(#fillFailed)"
          stroke="var(--color-failed)"
          strokeWidth={1.5}
          stackId="1"
        />
      </AreaChart>
    </ChartContainer>
  )
}

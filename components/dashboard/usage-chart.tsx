"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartDataPoint {
  date: string
  total: number
  success: number
}

const chartConfig = {
  total: {
    label: "Total Runs",
    color: "hsl(221, 83%, 53%)",
  },
  success: {
    label: "Successful",
    color: "hsl(142, 71%, 45%)",
  },
} satisfies ChartConfig

export function UsageChart({ data }: { data?: ChartDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          No run data yet. Create and run a flow to see chart data.
        </p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <AreaChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-total)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-total)"
              stopOpacity={0.02}
            />
          </linearGradient>
          <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-success)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-success)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border"
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="total"
          type="monotone"
          fill="url(#fillTotal)"
          stroke="var(--color-total)"
          strokeWidth={2}
        />
        <Area
          dataKey="success"
          type="monotone"
          fill="url(#fillSuccess)"
          stroke="var(--color-success)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

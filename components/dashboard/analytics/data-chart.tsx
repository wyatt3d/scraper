"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const dataPoints = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const points = 30000 + Math.floor(Math.random() * 20000)
  return {
    date: `Day ${day}`,
    points,
  }
})

const chartConfig = {
  points: {
    label: "Data Points",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig

export function DataChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={dataPoints} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.replace("Day ", "")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="points" fill="var(--color-points)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

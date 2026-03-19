"use client"

import { Cell, Pie, PieChart, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const MODE_COLORS: Record<string, string> = {
  extract: "hsl(221, 83%, 53%)",
  interact: "hsl(262, 83%, 58%)",
  monitor: "hsl(142, 71%, 45%)",
}

interface CostChartProps {
  data?: { name: string; value: number; fill: string }[]
}

export function CostChart({ data }: CostChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No cost data yet
      </div>
    )
  }

  const chartConfig: ChartConfig = {
    value: { label: "Cost" },
    ...Object.fromEntries(
      data.map(d => [d.name, { label: d.name, color: d.fill }])
    ),
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}

export { MODE_COLORS }

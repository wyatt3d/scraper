"use client"

import { Cell, Pie, PieChart, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const costData = [
  { name: "Browserless extraction", value: 45, fill: "hsl(221, 83%, 53%)" },
  { name: "Browser automation", value: 35, fill: "hsl(262, 83%, 58%)" },
  { name: "Monitoring", value: 15, fill: "hsl(142, 71%, 45%)" },
  { name: "API calls", value: 5, fill: "hsl(38, 92%, 50%)" },
]

const chartConfig = {
  value: {
    label: "Cost",
  },
  "Browserless extraction": {
    label: "Browserless extraction",
    color: "hsl(221, 83%, 53%)",
  },
  "Browser automation": {
    label: "Browser automation",
    color: "hsl(262, 83%, 58%)",
  },
  Monitoring: {
    label: "Monitoring",
    color: "hsl(142, 71%, 45%)",
  },
  "API calls": {
    label: "API calls",
    color: "hsl(38, 92%, 50%)",
  },
} satisfies ChartConfig

export function CostChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie
          data={costData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {costData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}

"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function generateErrorData() {
  const data = []
  for (let i = 23; i >= 0; i--) {
    const hour = (24 - i) % 24
    data.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      errors: Math.floor(Math.random() * 8 + (hour >= 2 && hour <= 5 ? 1 : 3)),
      warnings: Math.floor(Math.random() * 15 + 5),
    })
  }
  return data
}

const errorData = generateErrorData()

export function ErrorChart() {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={errorData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Area type="monotone" dataKey="warnings" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Warnings" />
          <Area type="monotone" dataKey="errors" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Errors" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

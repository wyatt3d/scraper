"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

function generateGrowthData() {
  const data = []
  const now = new Date(2026, 2, 18)
  let users = 8900
  let flows = 3200
  let revenue = 108000

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    users += Math.floor(Math.random() * 80 + 20)
    flows += Math.floor(Math.random() * 30 + 5)
    revenue += Math.floor(Math.random() * 1200 + 300)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      users,
      flows,
      revenue: Math.round(revenue / 1000),
    })
  }
  return data
}

const growthData = generateGrowthData()

export function GrowthChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
          <Line type="monotone" dataKey="flows" stroke="#10b981" strokeWidth={2} dot={false} name="Flows" />
          <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue ($K)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

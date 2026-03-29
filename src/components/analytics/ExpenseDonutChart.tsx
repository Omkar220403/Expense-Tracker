"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export type DonutDataEntry = {
  name: string
  value: number
  fill: string
}

interface ExpenseDonutChartProps {
  data: DonutDataEntry[]
  totalSpent: number
}

// Tooltip customization to match premium feel
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl flex flex-col gap-1 ring-1 ring-black/5 dark:ring-white/10">
        <p className="font-semibold text-sm flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
          {payload[0].payload.name}
        </p>
        <p className="font-black text-lg text-foreground">₹{payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export function ExpenseDonutChart({ data, totalSpent }: ExpenseDonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
        <span className="text-3xl mb-2 opacity-50">🍩</span>
        <p className="font-medium text-sm">No categorical data yet</p>
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity duration-200 outline-none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-widest">Total</p>
        <p className="text-2xl font-black text-foreground">
          ₹{totalSpent > 1000 ? (totalSpent / 1000).toFixed(1) + 'k' : totalSpent.toFixed(0)}
        </p>
      </div>
    </div>
  )
}

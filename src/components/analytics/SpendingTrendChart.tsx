"use client"

import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export type TrendDataEntry = {
  month: string
  amount: number
}

interface SpendingTrendChartProps {
  data: TrendDataEntry[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl flex flex-col gap-1 ring-1 ring-black/5 dark:ring-white/10">
        <p className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="font-black text-lg text-indigo-500">₹{payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
        <span className="text-3xl mb-2 opacity-50">📈</span>
        <p className="font-medium text-sm">No historical data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 11 }}
            tickFormatter={(val) => `₹${val}`}
            dx={-10}
          />
          <Tooltip cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#6366f1" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

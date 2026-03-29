"use server"

import { prisma } from "@/lib/prisma"

const CHART_COLORS = [
  "var(--color-category-1, #6366f1)", // Indigo 500
  "var(--color-category-2, #8b5cf6)", // Violet 500
  "var(--color-category-3, #ec4899)", // Pink 500
  "var(--color-category-4, #14b8a6)", // Teal 500
  "var(--color-category-5, #f59e0b)", // Amber 500
  "var(--color-category-6, #ef4444)", // Red 500
  "var(--color-category-7, #3b82f6)", // Blue 500
]

export async function getAnalyticsDashboardData() {
  const now = new Date()
  
  // 1. Current Month vs Last Month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0) // Last day of previous month
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  // Fetch all required data chunks
  const [currentMonthRecords, lastMonthRecords, sixMonthRecords] = await Promise.all([
    prisma.expense.findMany({
      where: { date: { gte: currentMonthStart } },
      include: { category: true }
    }),
    prisma.expense.findMany({
      where: { date: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.expense.findMany({
      where: { date: { gte: sixMonthsAgo } }
    })
  ])

  // Calculation: Totals
  const currentMonthTotal = currentMonthRecords.reduce((acc, curr) => acc + curr.amount, 0)
  const lastMonthTotal = lastMonthRecords.reduce((acc, curr) => acc + curr.amount, 0)

  let percentageChange = 0
  if (lastMonthTotal === 0 && currentMonthTotal > 0) percentageChange = 100
  else if (lastMonthTotal > 0) percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100

  // Calculation: Category Distribution (Donut Chart)
  const categoryMap = new Map<string, { value: number, name: string }>()
  currentMonthRecords.forEach(exp => {
    const catName = exp.category?.name || "Other"
    const existing = categoryMap.get(catName) || { value: 0, name: catName }
    existing.value += exp.amount
    categoryMap.set(catName, existing)
  })

  const donutData = Array.from(categoryMap.values())
    .sort((a, b) => b.value - a.value)
    .map((item, idx) => ({
      ...item,
      fill: CHART_COLORS[idx % CHART_COLORS.length]
    }))

  const topCategory = donutData.length > 0 ? donutData[0] : null

  // Calculation: 6-Month Trend Data
  const trendMap = new Map<string, number>()
  
  // Initialize the last 6 months with 0 so charts don't look broken if months are skipped
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = d.toLocaleString('default', { month: 'short' })
    trendMap.set(monthName, 0)
  }

  sixMonthRecords.forEach(exp => {
    const monthName = exp.date.toLocaleString('default', { month: 'short' })
    if (trendMap.has(monthName)) {
      trendMap.set(monthName, trendMap.get(monthName)! + exp.amount)
    }
  })

  // Recharts prefers arrays of objects
  const trendData = Array.from(trendMap.entries()).map(([month, amount]) => ({
    month,
    amount
  }))

  return {
    currentMonthTotal,
    lastMonthTotal,
    percentageChange,
    topCategory,
    donutData,
    trendData
  }
}

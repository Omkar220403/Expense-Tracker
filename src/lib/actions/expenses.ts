"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type ExpenseInput = {
  amount: number
  categoryId: string
  paymentMethod: string
  date: Date
  notes?: string
}

export async function createExpense(data: ExpenseInput) {
  try {
    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        paymentMethod: data.paymentMethod,
        date: data.date,
        notes: data.notes || "",
      },
    })
    
    revalidatePath("/")
    revalidatePath("/transactions")
    revalidatePath("/analytics")
    
    return { success: true, expense }
  } catch (error) {
    console.error("Failed to create expense:", error)
    return { success: false, error: "Failed to create expense" }
  }
}

export async function getDashboardSummary() {
  const [expenses, categories] = await Promise.all([
    prisma.expense.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        category: true,
      }
    }),
    prisma.category.findMany()
  ])

  // Process naive totals for Phase 1
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const allThisMonth = await prisma.expense.findMany({
    where: {
      date: {
        gte: firstDayOfMonth
      }
    }
  })

  const totalSpentThisMonth = allThisMonth.reduce((acc, curr) => acc + curr.amount, 0)
  
  return {
    recentExpenses: expenses,
    totalSpentThisMonth,
    categories
  }
}

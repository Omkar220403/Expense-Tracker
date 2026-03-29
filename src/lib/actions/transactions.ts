"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type GetTransactionsInput = {
  limit?: number
  cursor?: string
  search?: string
  categoryId?: string
  sort?: "desc" | "asc"
  period?: "today" | "week" | "month" | "all"
}

export async function getTransactions({
  limit = 10,
  cursor,
  search,
  categoryId,
  sort = "desc",
  period = "all",
}: GetTransactionsInput) {
  try {
    const where: Prisma.ExpenseWhereInput = {}

    // 1. Search filter
    if (search) {
      where.notes = { contains: search }
    }

    // 2. Category filter
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId
    }

    // 3. Period filter
    if (period !== "all") {
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (period === "today") {
        where.date = { gte: startOfToday }
      } else if (period === "week") {
        const startOfWeek = new Date(startOfToday)
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()) // Starts Sunday
        where.date = { gte: startOfWeek }
      } else if (period === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        where.date = { gte: startOfMonth }
      }
    }

    // Determine query args
    const args: Prisma.ExpenseFindManyArgs = {
      take: limit + 1, // Fetch an extra one to know if there's a next page
      where,
      orderBy: {
        date: sort,
      },
      include: {
        category: true,
      },
    }

    if (cursor) {
      args.cursor = { id: cursor }
      // Skip the cursor itself
      args.skip = 1
    }

    const expenses = await prisma.expense.findMany(args)

    let nextCursor: string | undefined = undefined
    if (expenses.length > limit) {
      const nextItem = expenses.pop()
      nextCursor = nextItem?.id
    }

    return {
      data: expenses,
      nextCursor,
    }
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return { data: [], nextCursor: undefined }
  }
}

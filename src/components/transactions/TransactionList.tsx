"use client"

import * as React from "react"
import { format } from "date-fns"
import { getTransactions, GetTransactionsInput } from "@/lib/actions/transactions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Category = {
  id: string
  name: string
}

type ExpenseWithCategory = {
  id: string
  amount: number
  paymentMethod: string
  categoryId: string
  date: Date
  notes: string | null
  category?: Category
}

interface TransactionListProps {
  initialData: ExpenseWithCategory[]
  initialNextCursor?: string
  fetchArgs: GetTransactionsInput
}

const iconMap: Record<string, string> = { "Food": "🍔", "Travel": "🚕", "Bills": "🧾", "Shopping": "🛍️", "Entertainment": "🍿", "Health": "💊", "Other": "📦" }

export function TransactionList({ initialData, initialNextCursor, fetchArgs }: TransactionListProps) {
  // We sync state with props locally so when URL params change, the layout wipes this and passes new props!
  const [data, setData] = React.useState(initialData)
  const [nextCursor, setNextCursor] = React.useState(initialNextCursor)
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset state on searchParam change (detected because Next.js passes different initialData natively)
  React.useEffect(() => {
    setData(initialData)
    setNextCursor(initialNextCursor)
  }, [initialData, initialNextCursor])

  const loadMore = async () => {
    if (!nextCursor || isLoading) return
    setIsLoading(true)

    try {
      const result = await getTransactions({
        ...fetchArgs,
        cursor: nextCursor,
      })

      setData((prev) => [...prev, ...result.data])
      setNextCursor(result.nextCursor)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="h-16 w-16 bg-muted/40 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">
          📭
        </div>
        <h3 className="font-bold text-lg mb-1">No transactions found</h3>
        <p className="text-muted-foreground text-sm max-w-[250px]">
          Try adjusting your filters or expanding your search to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pb-8">
      {data.map((expense) => {
        const catName = expense.category?.name || "Other"
        const icon = iconMap[catName] || "📦"

        return (
          <div key={expense.id} className="flex flex-row items-center justify-between p-4 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-row items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center text-2xl border border-background shadow-xs group-hover:scale-105 transition-transform duration-300">
                {icon}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-foreground leading-none mb-1 text-base">{catName}</h4>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium">
                  {/* Handle date type converting from next cache generic arrays nicely */}
                  <span>{format(new Date(expense.date), 'MMM do, yyyy')}</span>
                  <span>•</span>
                  <span className="bg-muted-foreground/10 px-2.5 py-0.5 rounded text-[10px] tracking-widest uppercase text-foreground/70">{expense.paymentMethod}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-foreground">-₹{Number(expense.amount).toFixed(2)}</p>
              {expense.notes && <p className="text-xs text-muted-foreground max-w-[120px] truncate mt-1.5 font-medium italic">{expense.notes}</p>}
            </div>
          </div>
        )
      })}

      {nextCursor ? (
        <div className="pt-6 pb-2 w-full flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            className="rounded-full px-8 h-12 shadow-sm font-bold active:scale-95 transition-all w-full max-w-[200px]"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      ) : (
        <div className="pt-8 pb-4 w-full flex justify-center">
          <p className="text-sm font-medium text-muted-foreground/50">You've reached the end of the history.</p>
        </div>
      )}
    </div>
  )
}

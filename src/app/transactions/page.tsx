import { getTransactions, GetTransactionsInput } from "@/lib/actions/transactions"
import { getCategories } from "@/lib/actions/categories"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { TransactionList } from "@/components/transactions/TransactionList"

export const dynamic = "force-dynamic"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined
  const categoryId = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort as any : "desc"
  const period = typeof resolvedParams.period === "string" ? resolvedParams.period as any : "all"

  const args: GetTransactionsInput = {
    limit: 15,
    search,
    categoryId,
    sort,
    period
  }

  const [transactionsResult, categories] = await Promise.all([
    getTransactions(args),
    getCategories()
  ])

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8 pt-8">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          Transactions
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and search through your entire financial history.
        </p>
      </header>

      <TransactionFilters categories={categories} />
      
      {/* Transaction List Client Component wrapped with fresh data per URL update */}
      <TransactionList 
        initialData={transactionsResult.data as any} 
        initialNextCursor={transactionsResult.nextCursor} 
        fetchArgs={args} 
      />
    </div>
  )
}

import { format } from "date-fns"
import { getDashboardSummary } from "@/lib/actions/expenses"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, TrendingUp } from "lucide-react"

export default async function Dashboard() {
  const { totalSpentThisMonth, recentExpenses } = await getDashboardSummary()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full pt-8">
      <header className="flex flex-row items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Happy {format(new Date(), "EEEE")}! Let's check your spending.
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <span className="text-indigo-600 font-bold dark:text-indigo-400">OM</span>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden relative shadow-lg shadow-indigo-900/20 border-0 h-40">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Wallet className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <p className="text-indigo-100 text-sm font-medium mb-1">Spent This Month</p>
            <h2 className="text-4xl font-black mb-4">₹{totalSpentThisMonth.toFixed(2)}</h2>

            <div className="flex items-center text-sm font-medium text-indigo-100 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
              <span>On track</span>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:col-span-1">
          <Card className="shadow-none bg-muted/40 border-border/50">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Income</p>
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold">₹0.00</h3>
            </CardContent>
          </Card>
          <Card className="shadow-none bg-muted/40 border-border/50">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Food 🍔</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <h3 className="font-bold text-lg mt-4 mb-2">Recent Transactions</h3>

      {recentExpenses.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💸</span>
            </div>
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm opacity-70 mt-1">Tap the plus button below to log your first transaction.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 pb-6">
          {recentExpenses.map((expense) => {
            const iconMap: Record<string, string> = { "Food": "🍔", "Travel": "🚕", "Bills": "🧾", "Shopping": "🛍️", "Entertainment": "🍿", "Health": "💊", "Other": "📦" }
            const catName = expense.category?.name || "Other"
            const icon = iconMap[catName] || "📦"

            return (
              <div key={expense.id} className="flex flex-row items-center justify-between p-4 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-row items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-2xl border border-background shadow-xs">
                    {icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-foreground leading-none mb-1">{catName}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium">
                      <span>{format(expense.date, 'MMM do')}</span>
                      <span>•</span>
                      <span className="bg-muted-foreground/10 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">{expense.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">-₹{expense.amount.toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { getAnalyticsDashboardData } from "@/lib/actions/analytics"
import { ExpenseDonutChart } from "@/components/analytics/ExpenseDonutChart"
import { SpendingTrendChart } from "@/components/analytics/SpendingTrendChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, PieChart, Activity, Grip } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const data = await getAnalyticsDashboardData()

  const isUp = data.percentageChange > 0
  const isDown = data.percentageChange < 0
  const noChange = data.percentageChange === 0

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8 pt-8 gap-6 pb-20">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deep-dive into your financial habits and trends.
        </p>
      </header>

      {/* Primary Insights - Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Comparison */}
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-0 shadow-lg shadow-indigo-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
            <Activity className="h-32 w-32" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-indigo-200 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              This Month's Spend
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="text-5xl font-black">₹{data.currentMonthTotal.toFixed(2)}</h2>
            </div>
            
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-md shadow-sm",
              isUp ? "bg-red-500/20 text-red-200 border border-red-500/30" : 
              isDown ? "bg-green-500/20 text-green-200 border border-green-500/30" : 
              "bg-white/10 text-white/80 border border-white/20"
            )}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : isDown ? <TrendingDown className="h-4 w-4" /> : <Grip className="h-4 w-4" />}
              <span>{Math.abs(data.percentageChange).toFixed(1)}% {isUp ? "more" : isDown ? "less" : "same"} than last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Category Card */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Highest Spend Cat.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-end h-[calc(100%-48px)]">
            {data.topCategory ? (
              <>
                <h3 className="text-2xl font-black text-foreground capitalize leading-none mb-2">{data.topCategory.name}</h3>
                <p className="font-semibold text-muted-foreground">₹{data.topCategory.value.toFixed(2)} <span className="font-normal text-xs opacity-50">this mo</span></p>
              </>
            ) : (
              <p className="text-muted-foreground italic text-sm">No expenses yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Category Distribution Donut */}
        <Card className="shadow-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Distribution</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ExpenseDonutChart data={data.donutData} totalSpent={data.currentMonthTotal} />
          </CardContent>
        </Card>

        {/* 6 Month Trend Line */}
        <Card className="shadow-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">6-Month Trend</CardTitle>
            <CardDescription>Your spending patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart data={data.trendData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

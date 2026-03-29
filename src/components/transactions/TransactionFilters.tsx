"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function TransactionFilters({ categories }: { categories: {id: string, name: string}[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Manage optimistic state before URL push
  const currentSearch = searchParams.get("search") || ""
  const currentPeriod = searchParams.get("period") || "all"
  const currentCategory = searchParams.get("category") || "all"
  const currentSort = searchParams.get("sort") || "desc"

  const [query, setQuery] = React.useState(currentSearch)

  // Debounced Search Push
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentSearch) {
        updateFilter("search", query.trim() || null)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query, currentSearch])

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const periods = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur z-20 pt-4 pb-2 border-b">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, merchants..." 
          className="pl-10 h-12 rounded-xl bg-muted/40 border-border/50 text-base"
        />
      </div>

      {/* Advanced Filters Row */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Chips for Timeframe */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => updateFilter("period", p.value)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                currentPeriod === p.value 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                  : "bg-muted/40 border-border hover:bg-muted"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border/60 mx-1 shrink-0" />

        <Select value={currentCategory} onValueChange={(val) => updateFilter("category", val)}>
          <SelectTrigger className="w-[140px] rounded-full h-9 bg-muted/40 border-border text-xs font-semibold">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSort} onValueChange={(val) => updateFilter("sort", val)}>
          <SelectTrigger className="w-[140px] rounded-full h-9 bg-muted/40 border-border text-xs font-semibold">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

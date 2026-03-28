"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, PieChart, User, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { AddExpenseDrawer } from "@/components/expenses/AddExpenseDrawer"

const tabs = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  // Add Expense goes here in the middle
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
        <nav className="flex items-center justify-around h-20 px-4">
          {tabs.slice(0, 2).map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-12 transition-all duration-200",
                pathname === tab.href ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          ))}

          {/* Center Floating Action Button (FAB) */}
          <div className="relative -top-6">
            <AddExpenseDrawer>
              <button
                 className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-background"
              >
                <Plus className="h-6 w-6 stroke-[3]" />
              </button>
            </AddExpenseDrawer>
          </div>

          {tabs.slice(2, 4).map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-12 transition-all duration-200",
                pathname === tab.href ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
          FinTracker
        </div>

        <div className="p-4 flex-1 space-y-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/10" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t">
          {/* Desktop "Add Expense" Button */}
          <AddExpenseDrawer>
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all font-medium">
              <Plus className="h-5 w-5" />
              Add Expense
            </button>
          </AddExpenseDrawer>
        </div>
      </aside>
    </>
  )
}

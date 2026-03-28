"use client"

import * as React from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { AddExpenseForm } from "./AddExpenseForm"

export function AddExpenseDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  // Drawer configuration: scale background, 300ms smooth anim
  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="pb-safe mx-auto max-w-lg md:max-w-2xl px-2">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold tracking-tight text-center">Add Expense</DrawerTitle>
          <DrawerDescription className="text-center">
            Log your latest transaction below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto max-h-[85vh]">
          {/* We pass setOpen so the form can close the drawer upon success */}
          <AddExpenseForm onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

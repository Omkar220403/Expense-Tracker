"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Loader2, Check } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { createExpense } from "@/lib/actions/expenses"
import { getCategories } from "@/lib/actions/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Map icons visually using DB names
const iconMap: Record<string, string> = { "Food": "🍔", "Travel": "🚕", "Bills": "🧾", "Shopping": "🛍️", "Entertainment": "🍿", "Health": "💊", "Other": "📦" }

const formSchema = z.object({
  amount: z.string().nonempty("Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a valid positive number"),
  categoryId: z.string().nonempty("Please select a category"),
  paymentMethod: z.enum(["Cash", "UPI", "Card"] as const),
  date: z.date(),
  notes: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof formSchema>

export function AddExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = React.useTransition()
  const [categories, setCategories] = React.useState<{id: string, name: string}[]>([])

  React.useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
    }
    loadCategories()
  }, [])

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      paymentMethod: "UPI",
      date: new Date(),
      notes: "",
    },
  })

  function onSubmit(data: ExpenseFormValues) {
    startTransition(async () => {
      // Mock network delay
      await new Promise((r) => setTimeout(r, 600))

      console.log("Submitting:", data)
      await createExpense({ ...data, amount: Number(data.amount) })

      toast.success("Expense added successfully", {
        description: `Logged ${data.paymentMethod} transaction for ${data.amount}.`,
        icon: <Check className="h-5 w-5 text-green-500" />
      })

      if (onSuccess) onSuccess()
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col pt-4">
        {/* HUGE AMOUNT INPUT */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="relative flex flex-col items-center justify-center -mt-6 mb-4">
              <span className="absolute left-[20%] text-4xl font-bold text-muted-foreground/50 top-6">₹</span>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="text-6xl text-center font-black !border-none !ring-0 !shadow-none h-24 bg-transparent outline-none focus-visible:ring-0 text-foreground"
                />
              </FormControl>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        {/* CATEGORY GRID */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium">Category</FormLabel>
              <FormControl>
                <div className="grid grid-cols-4 gap-3">
                  {categories.length === 0 ? (
                    <div className="col-span-4 flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => field.onChange(cat.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all duration-200 border-2",
                          field.value === cat.id
                            ? "border-indigo-500 bg-indigo-500/10 scale-105 shadow-md shadow-indigo-500/10"
                            : "border-transparent bg-muted/40 hover:bg-muted/60"
                        )}
                      >
                        <span className="text-2xl">{iconMap[cat.name] || "📦"}</span>
                        <span className="text-[10px] font-semibold tracking-wide text-center">{cat.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* PAYMENT METHOD */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    {["Cash", "UPI", "Card"].map((method) => (
                      <div key={method} className="flex items-center space-x-2 bg-muted/20 p-3 rounded-lg border border-border/50">
                        <RadioGroupItem value={method} id={method} />
                        <Label htmlFor={method} className="cursor-pointer font-medium flex-1">{method}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            {/* DATE PICKER */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-muted/20 border-border/50 rounded-lg p-3 h-auto",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NOTES */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Note <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="What was this for?" className="bg-muted/20 border-border/50 rounded-lg p-3 h-auto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-indigo-500/30 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:opacity-90 transition-all mt-4"
        >
          {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isPending ? "Saving..." : "Log Expense"}
        </Button>
      </form>
    </Form>
  )
}

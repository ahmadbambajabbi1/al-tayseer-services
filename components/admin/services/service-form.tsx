"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { serviceSchema } from "@/lib/validations/service"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  service?: {
    _id: string
    servicesPeriod: {
      _id: string
      servicesPeriodByNumber: number
      servicesPeriodByWord: string
    }
    servicesCategory: {
      _id: string
      name: string
    }
    washFrequency: number
    washingFolding: number
    ironing: string
    maximumKg: number
    total: number
    description?: string
  }
}

interface Category {
  _id: string
  name: string
}

interface Period {
  _id: string
  servicesPeriodByNumber: number
  servicesPeriodByWord: string
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [periods, setPeriods] = useState<Period[]>([])

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      servicesPeriod: service?.servicesPeriod?._id || "",
      servicesCategory: service?.servicesCategory?._id || "",
      washFrequency: service?.washFrequency || 1,
      washingFolding: service?.washingFolding || 0,
      ironing: service?.ironing || "N/A",
      maximumKg: service?.maximumKg || 5,
      total: service?.total || 0,
      description: service?.description || "",
    },
  })

  // Calculate total when washingFolding or maximumKg changes
  const washingFolding = form.watch("washingFolding")
  const maximumKg = form.watch("maximumKg")

  useEffect(() => {
    const total = washingFolding * maximumKg
    form.setValue("total", total)
  }, [washingFolding, maximumKg, form])

  // Fetch categories and periods
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, periodsRes] = await Promise.all([
          fetch("/api/services-categories"),
          fetch("/api/services-periods"),
        ])

        if (categoriesRes.ok && periodsRes.ok) {
          const categoriesData = await categoriesRes.json()
          const periodsData = await periodsRes.json()

          setCategories(categoriesData)
          setPeriods(periodsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const formatPeriod = (period: Period) => {
    return `${period.servicesPeriodByNumber} ${period.servicesPeriodByWord}${period.servicesPeriodByNumber > 1 && !period.servicesPeriodByWord.endsWith("s") ? "s" : ""}`
  }

  async function onSubmit(values: ServiceFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const url = service?._id ? `/api/services/${service._id}` : "/api/services"
      const method = service?._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="servicesCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servicesPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period._id} value={period._id}>
                          {formatPeriod(period)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="washFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wash Frequency</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter wash frequency"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="washingFolding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Washing & Folding Price (per kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price per kg"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="ironing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ironing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ironing option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="N/A">Not Available</SelectItem>
                      <SelectItem value="Included">Included</SelectItem>
                      <SelectItem value="Optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Kg</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter maximum kg"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter service description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : service ? "Update Service" : "Create Service"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

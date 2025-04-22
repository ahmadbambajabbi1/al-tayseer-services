import { z } from "zod"

export const servicesCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
})

export const servicesPeriodSchema = z.object({
  servicesPeriodByNumber: z.number().min(1, "Period number must be at least 1"),
  servicesPeriodByWord: z.enum(["week", "month", "year", "day", "days", "hour", "hours", "minute", "minutes"]),
})

export const serviceSchema = z.object({
  servicesPeriod: z.string().min(1, "Service period is required"),
  servicesCategory: z.string().min(1, "Service category is required"),
  washFrequency: z.number().min(1, "Wash frequency must be at least 1"),
  washingFolding: z.number().min(0, "Washing and folding price must be a positive number"),
  ironing: z.string().default("N/A"),
  maximumKg: z.number().min(1, "Maximum kg must be at least 1"),
  total: z.number().min(0, "Total must be a positive number"),
  description: z.string().optional(),
})

export const subscriptionSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  quantity: z.number().min(0, "Quantity must be a positive number"),
})

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { onboardingSchema } from "@/lib/validations/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { APP_NAME } from "@/lib/constants"
import { fadeIn } from "@/lib/animations"

type OnboardingFormValues = z.infer<typeof onboardingSchema>

export function OnboardingForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      additionalInfo: "",
    },
  })

  async function onSubmit(values: OnboardingFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/users/onboarding", {
        method: "POST",
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

      setSuccess(true)

      // Force reload to update the session
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn("up", 0.3)}
      className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Your profile has been completed successfully! Redirecting to your dashboard...
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to {APP_NAME}!</h2>
        <p className="text-gray-600 mt-1">Please tell us where to deliver your freshly laundered clothes</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your street address"
                    {...field}
                    className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your city"
                      {...field}
                      className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your state"
                      {...field}
                      className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip/Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your zip code"
                      {...field}
                      className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your country"
                      {...field}
                      className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional delivery instructions or information"
                    {...field}
                    className="border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Onboarding"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}

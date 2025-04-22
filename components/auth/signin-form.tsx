"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/lib/validations/auth"
import { FcGoogle } from "react-icons/fc"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fadeIn } from "@/lib/animations"

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        phoneNumber: values.phoneNumber,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid phone number or password")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      setError("Something went wrong with Google sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={fadeIn("up", 0.3)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
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
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>
    </motion.div>
  )
}

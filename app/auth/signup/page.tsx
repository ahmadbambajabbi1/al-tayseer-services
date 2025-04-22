import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SignUpForm } from "@/components/auth/signup-form"
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"
import { APP_NAME } from "@/lib/constants"

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <div className="flex-1 flex items-center justify-center py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto grid w-full max-w-md gap-6 px-4">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Join {APP_NAME} Today</h1>
            <p className="text-muted-foreground">Create an account to get started with premium laundry services</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <SignUpForm />
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-sky-600 hover:text-sky-500 underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

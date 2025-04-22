import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SignInForm } from "@/components/auth/signin-form"
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"
import { APP_NAME } from "@/lib/constants"

export default async function SignInPage() {
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
            <h1 className="text-3xl font-bold">Welcome back to {APP_NAME}</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <SignInForm />
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-sky-600 hover:text-sky-500 underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

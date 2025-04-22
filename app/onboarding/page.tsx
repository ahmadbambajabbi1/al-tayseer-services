import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.onboardingCompleted) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <div className="flex-1 flex items-center justify-center py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto w-full max-w-md px-4">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
}

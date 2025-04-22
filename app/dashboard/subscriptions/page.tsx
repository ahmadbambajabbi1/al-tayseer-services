import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SubscriptionCard } from "@/components/subscriptions/subscription-card"
import { Button } from "@/components/ui/button"
import connectDB from "@/lib/db"
import Subscription from "@/models/subscription"

async function getUserSubscriptions(userId: string) {
  await connectDB()

  try {
    // Use the user ID directly as a string
    const subscriptions = await Subscription.find({ user: userId }).sort({ createdAt: -1 }).populate("service", "name")
    return JSON.parse(JSON.stringify(subscriptions))
  } catch (error) {
    console.error("Error getting user subscriptions:", error)
    return []
  }
}

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const subscriptions = await getUserSubscriptions(session.user.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Subscriptions</h1>
          <Button asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>

        <Suspense fallback={<div>Loading subscriptions...</div>}>
          {subscriptions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard key={subscription._id} subscription={subscription} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No subscriptions found</h2>
              <p className="text-muted-foreground mt-2">You haven't subscribed to any services yet.</p>
              <Button asChild className="mt-4">
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          )}
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

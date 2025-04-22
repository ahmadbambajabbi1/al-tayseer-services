import { notFound } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SubscriptionDetail } from "@/components/subscriptions/subscription-detail"
import connectDB from "@/lib/db"
import Subscription from "@/models/subscription"

interface SubscriptionPageProps {
  params: {
    id: string
  }
}

async function getSubscription(id: string) {
  await connectDB()
  try {
    const subscription = await Subscription.findById(id)
      .populate("user", "fullName email phoneNumber")
      .populate("service", "name")
      .populate("adminProcessor", "fullName")

    if (!subscription) {
      return null
    }

    return JSON.parse(JSON.stringify(subscription))
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}

export default async function AdminSubscriptionPage({ params }: SubscriptionPageProps) {
  const subscription = await getSubscription(params.id)

  if (!subscription) {
    notFound()
  }

  return (
    <AdminLayout>
      <SubscriptionDetail subscription={subscription} />
    </AdminLayout>
  )
}

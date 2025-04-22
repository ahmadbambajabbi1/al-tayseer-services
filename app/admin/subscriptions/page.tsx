import { AdminLayout } from "@/components/layout/admin-layout"
import { SubscriptionTable } from "@/components/admin/subscriptions/subscription-table"
import connectDB from "@/lib/db"
import Subscription from "@/models/subscription"

async function getSubscriptions() {
  await connectDB()
  const subscriptions = await Subscription.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName")
    .populate("service", "name")

  return JSON.parse(JSON.stringify(subscriptions))
}

export default async function AdminSubscriptionsPage() {
  const subscriptions = await getSubscriptions()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Subscriptions</h1>
        <SubscriptionTable subscriptions={subscriptions} />
      </div>
    </AdminLayout>
  )
}

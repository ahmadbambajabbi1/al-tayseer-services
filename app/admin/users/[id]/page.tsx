import { notFound } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { UserDetail } from "@/components/admin/users/user-detail"
import connectDB from "@/lib/db"
import User from "@/models/user"
import Subscription from "@/models/subscription"

interface UserPageProps {
  params: {
    id: string
  }
}

async function getUser(id: string) {
  await connectDB()
  try {
    const user = await User.findById(id)

    if (!user) {
      return null
    }

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

async function getUserSubscriptions(userId: string) {
  await connectDB()
  try {
    // Use the user ID directly as a string for Google OAuth users
    const subscriptions = await Subscription.find({ user: userId }).sort({ createdAt: -1 }).populate("service", "name")

    return JSON.parse(JSON.stringify(subscriptions))
  } catch (error) {
    console.error("Error fetching user subscriptions:", error)
    return []
  }
}

export default async function AdminUserPage({ params }: UserPageProps) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  // For MongoDB ObjectId users, use the _id
  // For Google OAuth users, use the googleId if available
  const userId = user.googleId || user._id.toString()

  const subscriptions = await getUserSubscriptions(userId)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <UserDetail user={user} subscriptions={subscriptions} />
      </div>
    </AdminLayout>
  )
}

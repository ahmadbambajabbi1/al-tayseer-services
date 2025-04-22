import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import connectDB from "@/lib/db"
import User from "@/models/user"

async function getUserProfile(userId: string) {
  await connectDB()
  const user = await User.findById(userId)
  return JSON.parse(JSON.stringify(user))
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const user = await getUserProfile(session.user.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Update your delivery information</p>
        <ProfileForm user={user} />
      </div>
    </DashboardLayout>
  )
}

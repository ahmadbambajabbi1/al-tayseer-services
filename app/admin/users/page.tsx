import { AdminLayout } from "@/components/layout/admin-layout"
import { UserTable } from "@/components/admin/users/user-table"
import connectDB from "@/lib/db"
import User from "@/models/user"

async function getUsers() {
  await connectDB()
  const users = await User.find({ role: "user" }).sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(users))
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <UserTable users={users} />
      </div>
    </AdminLayout>
  )
}

import { Suspense } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalyticsCharts } from "@/components/admin/analytics/analytics-charts"
import connectDB from "@/lib/db"
import User from "@/models/user"
import Service from "@/models/service"
import Subscription from "@/models/subscription"

async function getAdminStats() {
  await connectDB()

  try {
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalServices = await Service.countDocuments()
    const totalSubscriptions = await Subscription.countDocuments()
    const pendingPayments = await Subscription.countDocuments({ paymentStatus: "pending" })

    // Get subscription data for the last 7 days
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)

    const subscriptionData = []
    const revenueData = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(sevenDaysAgo.getDate() + i)

      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const daySubscriptions = await Subscription.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })

      const dayRevenue = await Subscription.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ])

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      subscriptionData.push({
        name: dayName,
        total: daySubscriptions,
      })

      revenueData.push({
        name: dayName,
        total: dayRevenue.length > 0 ? dayRevenue[0].total : 0,
      })
    }

    return {
      users: totalUsers,
      services: totalServices,
      subscriptions: totalSubscriptions,
      pendingPayments,
      subscriptionData,
      revenueData,
    }
  } catch (error) {
    console.error("Error getting admin stats:", error)
    return {
      users: 0,
      services: 0,
      subscriptions: 0,
      pendingPayments: 0,
      subscriptionData: [],
      revenueData: [],
    }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your mobile wash service</p>
        </div>

        <Suspense fallback={<div>Loading stats...</div>}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.services}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subscriptions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              </CardContent>
            </Card>
          </div>
        </Suspense>

        <Suspense fallback={<div>Loading analytics...</div>}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Analytics</h2>
            <AnalyticsCharts subscriptionData={stats.subscriptionData} revenueData={stats.revenueData} />
          </div>
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline" className="h-auto p-4 text-left">
              <Link href="/admin/services">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Manage Services</span>
                  <span className="text-sm text-muted-foreground">Add, edit, or remove wash services</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 text-left">
              <Link href="/admin/subscriptions">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Manage Subscriptions</span>
                  <span className="text-sm text-muted-foreground">View and update subscription statuses</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 text-left">
              <Link href="/admin/users">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Manage Users</span>
                  <span className="text-sm text-muted-foreground">View and manage user accounts</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import connectDB from "@/lib/db";
import Subscription from "@/models/subscription";

async function getSubscriptionStats(userId: string) {
  await connectDB();

  try {
    // Use the user ID directly as a string
    const totalSubscriptions = await Subscription.countDocuments({
      user: userId,
    });
    const pendingSubscriptions = await Subscription.countDocuments({
      user: userId,
      paymentStatus: "pending",
    });
    const paidSubscriptions = await Subscription.countDocuments({
      user: userId,
      paymentStatus: "paid",
    });

    return {
      total: totalSubscriptions,
      pending: pendingSubscriptions,
      paid: paidSubscriptions,
    };
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      paid: 0,
    };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const stats = await getSubscriptionStats(session.user.id as any);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name as any}!
          </p>
        </div>

        <Suspense fallback={<div>Loading stats...</div>}>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
              </CardContent>
            </Card>
          </div>
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline" className="h-auto p-4 text-left">
              <Link href="/services">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Browse Services</span>
                  <span className="text-sm text-muted-foreground">
                    Explore our range of wash services
                  </span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 text-left">
              <Link href="/dashboard/subscriptions">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">View Subscriptions</span>
                  <span className="text-sm text-muted-foreground">
                    Manage your current subscriptions
                  </span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

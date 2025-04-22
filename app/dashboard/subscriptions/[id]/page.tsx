import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SubscriptionDetail } from "@/components/subscriptions/subscription-detail";
import connectDB from "@/lib/db";
import Subscription from "@/models/subscription";

interface SubscriptionPageProps {
  params: {
    id: string;
  };
}

async function getSubscription(id: string, userId: string) {
  await connectDB();

  try {
    const subscription = await Subscription.findOne({
      _id: id,
      user: userId,
    })
      .populate({
        path: "service",
        populate: { path: "servicesCategory" },
      })
      .populate("adminProcessor", "fullName");

    if (!subscription) {
      return null;
    }

    return JSON.parse(JSON.stringify(subscription));
  } catch (error) {
    return null;
  }
}

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const subscription = await getSubscription(params.id, session.user.id);

  if (!subscription) {
    notFound();
  }

  return (
    <DashboardLayout>
      <SubscriptionDetail subscription={subscription} />
    </DashboardLayout>
  );
}

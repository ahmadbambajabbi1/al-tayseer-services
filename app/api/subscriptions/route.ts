import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/subscription";
import Services from "@/models/service";
import ServicesPeriod from "@/models/services-period";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let subscriptions;

    if (session.user.role === "admin") {
      subscriptions = await Subscription.find()
        .populate("user", "fullName email phoneNumber")
        .populate({
          path: "service",
          populate: [{ path: "servicesCategory" }, { path: "servicesPeriod" }],
        })
        .populate("adminProcessor", "fullName");
    } else {
      subscriptions = await Subscription.find({ user: session.user.id })
        .populate({
          path: "service",
          populate: [{ path: "servicesCategory" }, { path: "servicesPeriod" }],
        })
        .populate("adminProcessor", "fullName");
    }

    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.onboardingCompleted) {
      return NextResponse.json(
        { error: "Please complete onboarding before subscribing" },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { serviceId } = body;
    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }
    const service = await Services.findById(serviceId).populate(
      "servicesPeriod"
    );

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (service.servicesPeriod) {
      const { servicesPeriodByNumber, servicesPeriodByWord } =
        service.servicesPeriod;

      switch (servicesPeriodByWord) {
        case "day":
        case "days":
          endDate.setDate(endDate.getDate() + servicesPeriodByNumber);
          break;
        case "week":
          endDate.setDate(endDate.getDate() + servicesPeriodByNumber * 7);
          break;
        case "month":
          endDate.setMonth(endDate.getMonth() + servicesPeriodByNumber);
          break;
        case "year":
          endDate.setFullYear(endDate.getFullYear() + servicesPeriodByNumber);
          break;
        case "hour":
        case "hours":
          endDate.setHours(endDate.getHours() + servicesPeriodByNumber);
          break;
        case "minute":
        case "minutes":
          endDate.setMinutes(endDate.getMinutes() + servicesPeriodByNumber);
          break;
        default:
          endDate.setDate(endDate.getDate() + 30);
      }
    } else {
      endDate.setDate(endDate.getDate() + 30);
    }
    const washFrequencyTotal = service.washFrequency || 0;
    const newSubscription = await Subscription.create({
      user: session.user.id,
      service: serviceId,
      startDate,
      endDate,
      amount: service.total,
      washFrequencyTotal,
      washFrequencyLeft: washFrequencyTotal,
      paymentStatus: "pending",
    });
    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

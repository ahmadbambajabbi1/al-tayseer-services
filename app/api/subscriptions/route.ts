import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Subscription from "@/models/subscription"
import Service from "@/models/service"
import { subscriptionSchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let subscriptions

    if (session.user.role === "admin") {
      subscriptions = await Subscription.find()
        .populate("user", "fullName email phoneNumber")
        .populate("service", "name basePrice")
        .populate("adminProcessor", "fullName")
    } else {
      // Use the user ID directly as a string
      subscriptions = await Subscription.find({ user: session.user.id })
        .populate("service", "name basePrice")
        .populate("adminProcessor", "fullName")
    }

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.onboardingCompleted) {
      return NextResponse.json({ error: "Please complete onboarding before subscribing" }, { status: 400 })
    }

    await connectDB()
    const body = await request.json()

    const validationResult = subscriptionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { serviceId, quantity } = validationResult.data

    // Get service details
    const service = await Service.findById(serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Find the appropriate quantity option
    const quantityOption = service.quantityOptions.find((option) => option.kilos === quantity)

    if (!quantityOption) {
      return NextResponse.json({ error: "Invalid quantity selected" }, { status: 400 })
    }

    const totalPrice = quantityOption.price

    try {
      // Use the user ID directly as a string
      const newSubscription = await Subscription.create({
        user: session.user.id,
        service: serviceId,
        quantity,
        totalPrice,
        paymentStatus: "pending",
      })

      return NextResponse.json(newSubscription, { status: 201 })
    } catch (error) {
      console.error("Error creating subscription:", error)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in subscription POST:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

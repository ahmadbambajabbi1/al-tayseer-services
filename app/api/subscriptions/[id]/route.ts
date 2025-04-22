import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Subscription from "@/models/subscription"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const updatePaymentSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const subscription = await Subscription.findById(params.id)
      .populate("service", "name basePrice")
      .populate("adminProcessor", "fullName")

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Check if the user is authorized to view this subscription
    if (session.user.role !== "admin" && subscription.user !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    const validationResult = updatePaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { paymentStatus, notes } = validationResult.data

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      params.id,
      {
        paymentStatus,
        notes,
        adminProcessor: session.user.id,
        ...(paymentStatus === "paid" ? { paymentDate: new Date() } : {}),
      },
      { new: true },
    )

    if (!updatedSubscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}

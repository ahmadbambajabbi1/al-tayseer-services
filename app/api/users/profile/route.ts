import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/user"
import { onboardingSchema } from "@/lib/validations/auth"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    const validationResult = onboardingSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const { street, city, state, zipCode, country, additionalInfo } = validationResult.data

    // Find the user either by MongoDB ObjectId or by Google ID
    let query = {}

    // If the ID is a Google OAuth ID (long numeric string), search by googleId
    if (/^\d+$/.test(session.user.id) && session.user.id.length > 20) {
      query = { googleId: session.user.id }
    } else {
      // Otherwise, search by _id
      query = { _id: session.user.id }
    }

    const updatedUser = await User.findOneAndUpdate(
      query,
      {
        deliveryAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
        additionalInfo,
      },
      { new: true },
    )

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

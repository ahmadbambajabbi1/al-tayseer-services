import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { onboardingSchema } from "@/lib/validations/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const validationResult = onboardingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { street, city, state, zipCode, country, additionalInfo } =
      validationResult.data;

    // Find the user directly by MongoDB _id since we now ensure session.user.id is always the MongoDB _id
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        deliveryAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
        additionalInfo,
        onboardingCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the session to reflect the onboarding completion
    session.user.onboardingCompleted = true;

    return NextResponse.json({
      message: "Onboarding completed successfully",
      onboardingCompleted: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

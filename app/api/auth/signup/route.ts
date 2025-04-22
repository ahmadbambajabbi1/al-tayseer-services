import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { ApiSignUpSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const validationResult = ApiSignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { fullName, phoneNumber, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this phone number already exists" },
        { status: 400 }
      );
    }

    // Create new user
    await User.create({
      fullName,
      phoneNumber,
      password,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

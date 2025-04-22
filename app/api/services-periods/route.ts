import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServicesPeriod from "@/models/services-period"
import { servicesPeriodSchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const periods = await ServicesPeriod.find().sort({ servicesPeriodByNumber: 1 })
    return NextResponse.json(periods)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service periods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    const validationResult = servicesPeriodSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const newPeriod = await ServicesPeriod.create({
      ...validationResult.data,
      createdBy: session.user.id,
    })

    return NextResponse.json(newPeriod, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service period" }, { status: 500 })
  }
}

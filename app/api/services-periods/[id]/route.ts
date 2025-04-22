import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServicesPeriod from "@/models/services-period"
import { servicesPeriodSchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const period = await ServicesPeriod.findById(params.id)

    if (!period) {
      return NextResponse.json({ error: "Service period not found" }, { status: 404 })
    }

    return NextResponse.json(period)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service period" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updatedPeriod = await ServicesPeriod.findByIdAndUpdate(
      params.id,
      {
        ...validationResult.data,
        updatedBy: session.user.id,
      },
      { new: true },
    )

    if (!updatedPeriod) {
      return NextResponse.json({ error: "Service period not found" }, { status: 404 })
    }

    return NextResponse.json(updatedPeriod)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service period" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const deletedPeriod = await ServicesPeriod.findByIdAndDelete(params.id)

    if (!deletedPeriod) {
      return NextResponse.json({ error: "Service period not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service period deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service period" }, { status: 500 })
  }
}

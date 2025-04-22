import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Services from "@/models/service"
import { serviceSchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const services = await Services.find({ isActive: true })
      .populate("servicesPeriod")
      .populate("servicesCategory")
      .sort({ createdAt: -1 })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
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

    const validationResult = serviceSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const newService = await Services.create({
      ...validationResult.data,
      createdBy: session.user.id,
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Service creation error:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

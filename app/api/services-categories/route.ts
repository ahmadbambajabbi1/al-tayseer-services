import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServicesCategory from "@/models/services-category"
import { servicesCategorySchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const categories = await ServicesCategory.find().sort({ name: 1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service categories" }, { status: 500 })
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

    const validationResult = servicesCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const newCategory = await ServicesCategory.create({
      ...validationResult.data,
      createdBy: session.user.id,
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create service category" }, { status: 500 })
  }
}

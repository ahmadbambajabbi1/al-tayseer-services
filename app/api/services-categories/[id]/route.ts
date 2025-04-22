import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServicesCategory from "@/models/services-category"
import { servicesCategorySchema } from "@/lib/validations/service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const category = await ServicesCategory.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service category" }, { status: 500 })
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

    const validationResult = servicesCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }

    const updatedCategory = await ServicesCategory.findByIdAndUpdate(
      params.id,
      {
        ...validationResult.data,
        updatedBy: session.user.id,
      },
      { new: true },
    )

    if (!updatedCategory) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update service category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const deletedCategory = await ServicesCategory.findByIdAndDelete(params.id)

    if (!deletedCategory) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service category deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service category" }, { status: 500 })
  }
}

import { notFound } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CategoryForm } from "@/components/admin/services/category-form"
import connectDB from "@/lib/db"
import ServicesCategory from "@/models/services-category"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

async function getCategory(id: string) {
  await connectDB()
  const category = await ServicesCategory.findById(id)

  if (!category) {
    return null
  }

  return JSON.parse(JSON.stringify(category))
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategory(params.id)

  if (!category) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service Category</h1>
        <CategoryForm category={category} />
      </div>
    </AdminLayout>
  )
}

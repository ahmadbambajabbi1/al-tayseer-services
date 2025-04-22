import Link from "next/link"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CategoryTable } from "@/components/admin/services/category-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import connectDB from "@/lib/db"
import ServicesCategory from "@/models/services-category"

async function getCategories() {
  await connectDB()
  const categories = await ServicesCategory.find().sort({ name: 1 })
  return JSON.parse(JSON.stringify(categories))
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Manage Service Categories</h1>
          <Button asChild>
            <Link href="/admin/services/categories/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>

        <CategoryTable categories={categories} />
      </div>
    </AdminLayout>
  )
}

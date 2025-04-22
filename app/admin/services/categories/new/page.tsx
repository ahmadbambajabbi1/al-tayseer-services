import { AdminLayout } from "@/components/layout/admin-layout"
import { CategoryForm } from "@/components/admin/services/category-form"

export default function NewCategoryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Service Category</h1>
        <CategoryForm />
      </div>
    </AdminLayout>
  )
}

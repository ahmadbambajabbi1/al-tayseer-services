import { AdminLayout } from "@/components/layout/admin-layout"
import { ServiceForm } from "@/components/admin/services/service-form"

export default function NewServicePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
        <ServiceForm />
      </div>
    </AdminLayout>
  )
}

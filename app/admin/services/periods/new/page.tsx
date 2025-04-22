import { AdminLayout } from "@/components/layout/admin-layout"
import { PeriodForm } from "@/components/admin/services/period-form"

export default function NewPeriodPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Service Period</h1>
        <PeriodForm />
      </div>
    </AdminLayout>
  )
}

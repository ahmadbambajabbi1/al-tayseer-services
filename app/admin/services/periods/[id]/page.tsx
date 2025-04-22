import { notFound } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PeriodForm } from "@/components/admin/services/period-form"
import connectDB from "@/lib/db"
import ServicesPeriod from "@/models/services-period"

interface EditPeriodPageProps {
  params: {
    id: string
  }
}

async function getPeriod(id: string) {
  await connectDB()
  const period = await ServicesPeriod.findById(id)

  if (!period) {
    return null
  }

  return JSON.parse(JSON.stringify(period))
}

export default async function EditPeriodPage({ params }: EditPeriodPageProps) {
  const period = await getPeriod(params.id)

  if (!period) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service Period</h1>
        <PeriodForm period={period} />
      </div>
    </AdminLayout>
  )
}

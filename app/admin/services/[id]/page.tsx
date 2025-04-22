import { notFound } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ServiceForm } from "@/components/admin/services/service-form"
import connectDB from "@/lib/db"
import Service from "@/models/service"

interface EditServicePageProps {
  params: {
    id: string
  }
}

async function getService(id: string) {
  await connectDB()
  const service = await Service.findById(id)

  if (!service) {
    return null
  }

  return JSON.parse(JSON.stringify(service))
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <ServiceForm service={service} />
      </div>
    </AdminLayout>
  )
}

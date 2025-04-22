import Link from "next/link"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ServiceTable } from "@/components/admin/services/service-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import connectDB from "@/lib/db"
import Service from "@/models/service"

async function getServices() {
  await connectDB()
  const services = await Service.find().sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(services))
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Manage Services</h1>
          <Button asChild>
            <Link href="/admin/services/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>

        <ServiceTable services={services} />
      </div>
    </AdminLayout>
  )
}

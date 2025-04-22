import Link from "next/link"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PeriodTable } from "@/components/admin/services/period-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import connectDB from "@/lib/db"
import ServicesPeriod from "@/models/services-period"

async function getPeriods() {
  await connectDB()
  const periods = await ServicesPeriod.find().sort({ servicesPeriodByNumber: 1 })
  return JSON.parse(JSON.stringify(periods))
}

export default async function AdminPeriodsPage() {
  const periods = await getPeriods()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Manage Service Periods</h1>
          <Button asChild>
            <Link href="/admin/services/periods/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Period
            </Link>
          </Button>
        </div>

        <PeriodTable periods={periods} />
      </div>
    </AdminLayout>
  )
}

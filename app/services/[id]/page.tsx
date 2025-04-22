import { notFound } from "next/navigation"
import { ServiceDetail } from "@/components/services/service-detail"
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"
import { AnimatedFooter } from "@/components/layout/animated-footer"
import connectDB from "@/lib/db"
import Services from "@/models/service"

interface ServicePageProps {
  params: {
    id: string
  }
}

async function getService(id: string) {
  await connectDB()
  try {
    const service = await Services.findById(id).populate("servicesPeriod").populate("servicesCategory")

    if (!service) {
      return null
    }

    return JSON.parse(JSON.stringify(service))
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <ServiceDetail service={service} />
        </div>
      </main>
      <AnimatedFooter />
    </div>
  )
}

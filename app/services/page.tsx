import { Suspense } from "react";
import { ServiceCard } from "@/components/services/service-card";
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header";
import { AnimatedFooter } from "@/components/layout/animated-footer";
import connectDB from "@/lib/db";
import Services from "@/models/service";
import { APP_NAME } from "@/lib/constants";
import { getServices } from "@/services/services.services";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Services
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse our range of premium wash services from {APP_NAME} and
                select the one that suits your needs.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="text-center py-12">Loading services...</div>
              }
            >
              {services && services.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service: any) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold">
                    No services available
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Please check back later for available services or contact
                    the administrator to add services.
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>
      <AnimatedFooter />
    </div>
  );
}

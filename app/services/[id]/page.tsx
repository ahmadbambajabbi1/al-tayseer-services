import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/service-detail";
import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header";
import { AnimatedFooter } from "@/components/layout/animated-footer";
import { getService } from "@/services/services.services";

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
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
  );
}

import { EnhancedSiteHeader } from "@/components/layout/enhanced-site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CtaSection } from "@/components/landing/cta-section"
import { AnimatedFooter } from "@/components/layout/animated-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedSiteHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <AnimatedFooter />
    </div>
  )
}

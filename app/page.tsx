import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { ProjectsSection } from "@/components/projects-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { CustomCursor } from "@/components/custom-cursor"

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <CustomCursor />
      <div className="relative z-10 min-h-screen bg-background/0">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <ProcessSection />
        <ProjectsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  )
}

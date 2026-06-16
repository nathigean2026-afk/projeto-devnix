import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { ProjectsSection } from "@/components/projects-section"
import { GlossaryPreview } from "@/components/glossary-preview"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { CustomCursor } from "@/components/custom-cursor"
import { CosmicReveal } from "@/components/cosmic-reveal"

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <CustomCursor />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <HeroSection />
        <CosmicReveal delay={0}>
          <StatsSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <ServicesSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <ProcessSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <ProjectsSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <GlossaryPreview />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <TestimonialsSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <PricingSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <FaqSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <ContactSection />
        </CosmicReveal>
        <CosmicReveal delay={0}>
          <Footer />
        </CosmicReveal>
      </div>
    </>
  )
}

"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { HeroContent } from "@/components/hero-content"

export function HeroSection() {
  // Inicia como false (desktop) para SSR e hidratação inicial coincidirem.
  // Em mobile o useEffect troca para true — apenas um render extra no mobile,
  // mas o desktop não sofre remontagem = LCP mais rápido no maior segmento.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true)
    }
  }, [])

  if (isMobile) return <HeroStatic />
  return <HeroDesktop />
}

// ── Mobile: CSS puro, sem useScroll/useTransform ──────────────────────────────
function HeroStatic() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }} />
      <div aria-hidden="true" className="hero-glow-simple pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28 w-full">
        <HeroContent />
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none animate-fade-in"
        style={{ animationDelay: "1200ms", animationFillMode: "both" }}
        aria-hidden="true"
      >
        <span className="label-sm text-muted-foreground">Clique para interagir</span>
        <ArrowDown className="size-4 text-muted-foreground" />
      </div>
    </section>
  )
}

// ── Desktop: parallax com framer-motion ──────────────────────────────────────
function HeroDesktop() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }} />
      <div aria-hidden="true" className="hero-glow-simple pointer-events-none" style={{ zIndex: 0 }} />

      <motion.div
        style={{ y, opacity: fadeOut }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28 w-full pointer-events-none"
      >
        <HeroContent />
      </motion.div>

      {/* Scroll indicator com bounce framer-motion apenas no desktop */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none animate-fade-in"
        style={{ animationDelay: "1200ms", animationFillMode: "both" }}
        aria-hidden="true"
      >
        <span className="label-sm text-muted-foreground">Clique para interagir</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  )
}



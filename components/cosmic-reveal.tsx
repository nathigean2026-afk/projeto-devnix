"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

interface CosmicRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Mobile-first: começa como true (CSS puro) e só troca para false no desktop.
// CosmicReveal é usado abaixo do fold — mobile-first garante zero framer-motion
// no primeiro render em dispositivos touch (sem TBT extra no load).
function useMobile() {
  const [isMobile, setIsMobile] = useState(true)
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches)
  }, [])
  return isMobile
}

// Versão CSS pura para mobile — apenas opacity+translateY via @keyframes
function CosmicRevealCSS({ children, className = "" }: Omit<CosmicRevealProps, "delay">) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: "-40px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}

export function CosmicReveal({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const isMobile = useMobile()

  // Antes da hidratação ou em mobile: CSS puro sem framer-motion
  if (isMobile) return <CosmicRevealCSS className={className}>{children}</CosmicRevealCSS>

  return <CosmicRevealDesktop className={className} delay={delay}>{children}</CosmicRevealDesktop>
}

function CosmicRevealDesktop({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CosmicRevealUp({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const isMobile = useMobile()

  if (isMobile) return <CosmicRevealCSS className={className}>{children}</CosmicRevealCSS>

  return <CosmicRevealUpDesktop className={className} delay={delay}>{children}</CosmicRevealUpDesktop>
}

function CosmicRevealUpDesktop({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

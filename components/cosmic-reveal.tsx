"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface CosmicRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Animação simplificada: apenas opacity + translateY (compositor-only)
// Removido scale e filter: blur() que causam repaints custosos no mobile
export function CosmicReveal({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : {}
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function CosmicRevealUp({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : {}
      }
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

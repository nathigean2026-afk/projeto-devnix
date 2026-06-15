"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface CosmicRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function CosmicReveal({ children, className = "", delay = 0 }: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.88, y: 48, filter: "blur(14px)" }}
      animate={
        inView
          ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 0.95,
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
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 56, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

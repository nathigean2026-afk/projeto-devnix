"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: "+50", label: "Projetos Entregues" },
  { value: "100%", label: "Satisfação dos Clientes" },
  { value: "+5", label: "Anos de Experiência" },
  { value: "24h", label: "Suporte Responsivo" },
]

export function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <section ref={ref} className="relative border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center justify-center py-8 px-4 gap-1"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <span
                className="text-4xl md:text-5xl font-black text-foreground"
                style={{ letterSpacing: "-0.04em" }}
              >
                {s.value}
              </span>
              <span className="label-sm text-muted-foreground text-center">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

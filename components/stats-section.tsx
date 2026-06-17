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
    <section ref={ref} className="relative border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 2 cols on mobile, 4 on md+ — borders drawn manually to avoid divide-x quirks */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => {
            // On mobile (2-col grid): right border for left column (i=0,2), bottom border for top row (i=0,1)
            // On md+ (4-col grid): right border for all except last
            const borderClass = [
              "relative flex flex-col items-center justify-center py-10 px-4 gap-2",
              // right border: left cols in mobile (0,2) + all except last in desktop
              i % 2 === 0 ? "border-r border-border" : "",
              // bottom border: top row in mobile (0,1)
              i < 2 ? "border-b border-border md:border-b-0" : "",
              // on md+: remove right border from last item (index 3)
              i === 3 ? "md:border-r-0" : "md:border-r md:border-border",
            ]
              .filter(Boolean)
              .join(" ")

            return (
              <motion.div
                key={s.label}
                className={borderClass}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <span
                  className="text-4xl sm:text-5xl font-black text-foreground leading-none"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {s.value}
                </span>
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground text-center leading-tight mt-1">
                  {s.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

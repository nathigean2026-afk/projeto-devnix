"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { projects } from "@/lib/projects-data"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const COVER_PATTERNS: Record<string, string> = {
  saas: "M10 10h20v20H10z M40 5h15v15H40z M5 40h12v12H5z M38 35h18v18H38z",
  ecommerce: "M15 15h25v35H15z M45 20h15v10H45z M45 35h15v10H45z M18 55h20v5H18z",
  dashboard: "M5 30h15v25H5z M25 15h15v40H25z M45 20h15v35H45z M65 5h15v50H65z",
  portal: "M10 40 Q35 10 60 40 Q85 70 110 40",
  landing: "M0 50 Q25 10 50 50 Q75 90 100 50",
  blog: "M10 15h80v5H10z M10 30h60v4H10z M10 44h70v4H10z M10 58h50v4H10z M10 72h65v4H10z",
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="projetos" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Portfólio</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <motion.h2
            className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Projetos que
            <br />
            <span className="text-muted-foreground">entregam resultados.</span>
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Cada projeto é único — problema analisado, solução construída, código entregue.
          </motion.p>
        </div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((p) => (
            <motion.article
              key={p.slug}
              variants={cardVariants}
              className={`group relative flex flex-col bg-background hover:bg-secondary transition-colors duration-300 overflow-hidden ${p.col}`}
            >
              {/* Top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--foreground)" }}
              />

              {/* Preview area with SVG pattern */}
              <div className="h-36 relative flex items-center justify-center bg-secondary overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <svg
                  viewBox="0 0 100 60"
                  className="w-24 h-14 text-foreground opacity-[0.07] group-hover:opacity-[0.12] transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {p.cover === "portal" || p.cover === "landing" ? (
                    <path d={COVER_PATTERNS[p.cover]} strokeLinecap="round" />
                  ) : (
                    <path d={COVER_PATTERNS[p.cover]} />
                  )}
                </svg>
                {/* "Ver projeto" on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border"
                    style={{ background: "var(--background)" }}>
                    Ver projeto <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <span
                  className="inline-flex self-start label-sm border border-border px-2.5 py-0.5 rounded-full text-muted-foreground"
                  style={{ fontSize: "9px" }}
                >
                  {p.category}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="label-sm border border-border px-2 py-0.5 rounded text-muted-foreground font-mono"
                      style={{ fontSize: "9px", background: "var(--secondary)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clickable overlay */}
              <Link href={`/projetos/${p.slug}`} className="absolute inset-0" aria-label={`Ver projeto: ${p.title}`} />
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a
            href="#contato"
            className="flex items-center gap-3 text-sm font-medium text-muted-foreground border border-border px-7 py-3.5 rounded-full hover:border-foreground/20 hover:text-foreground transition-all duration-300"
          >
            Tem um projeto em mente? Vamos conversar
            <span className="opacity-50">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

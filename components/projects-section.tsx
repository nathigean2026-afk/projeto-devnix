"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ExternalLink } from "lucide-react"
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

// Gradient covers per project type — vivid and visible in both themes
const COVERS: Record<string, { gradient: string; icon: React.ReactNode }> = {
  barbearia: {
    gradient: "from-amber-900/80 via-amber-800/50 to-stone-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <path d="M20 12 C20 12 16 28 20 38 C24 48 32 52 32 52 C32 52 40 48 44 38 C48 28 44 12 44 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 20 L38 20 M24 28 L40 28 M26 36 L38 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="32" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  saas: {
    gradient: "from-blue-900/70 via-indigo-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 24h48" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="30" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="28" y="28" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="42" y="33" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  ecommerce: {
    gradient: "from-rose-900/70 via-pink-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <path d="M10 14h8l6 26h24l6-18H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30" cy="46" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="44" cy="46" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M36 14 L40 26 M42 14 L38 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  dashboard: {
    gradient: "from-emerald-900/70 via-teal-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="36" y="8" width="20" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="36" y="22" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="8" y="34" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M14 22 L20 16 L24 19 L30 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  portal: {
    gradient: "from-violet-900/70 via-purple-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <rect x="8" y="10" width="48" height="34" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 20h48" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="14" y="26" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M40 28h12 M40 33h10 M40 38h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M20 50 L24 44 M44 50 L40 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 50h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="18" cy="16" r="1.5" fill="currentColor" opacity=".5"/>
        <circle cx="24" cy="16" r="1.5" fill="currentColor" opacity=".5"/>
      </svg>
    ),
  },
  landing: {
    gradient: "from-orange-900/70 via-amber-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <path d="M10 52 L32 12 L54 52" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 38 L46 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 28 L40 28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="32" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  blog: {
    gradient: "from-sky-900/70 via-cyan-900/50 to-slate-900/80",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none" aria-hidden="true">
        <rect x="10" y="10" width="44" height="44" rx="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M18 22h28 M18 30h22 M18 38h26 M18 46h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="46" cy="46" r="6" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <path d="M49 46 L43 46 M46 43 L46 49" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
}

function ProjectCover({ cover, title }: { cover: string; title: string }) {
  const c = COVERS[cover] ?? COVERS.saas
  return (
    <div className={`h-44 relative overflow-hidden bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      {/* Icon */}
      <div className="relative text-white/70 drop-shadow-lg">
        {c.icon}
      </div>
      {/* Subtle title watermark */}
      <span
        className="absolute bottom-3 right-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 select-none"
        aria-hidden="true"
      >
        {title}
      </span>
    </div>
  )
}

// Show first 4 on homepage
const PREVIEW_COUNT = 4

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const preview = projects.slice(0, PREVIEW_COUNT)

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

        {/* Grid preview — 4 cards, 2×2 on desktop */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {preview.map((p) => (
            <motion.article
              key={p.slug}
              variants={cardVariants}
              className="group relative flex flex-col bg-background hover:bg-secondary transition-colors duration-300 overflow-hidden"
            >
              {/* Top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--foreground)" }}
              />

              {/* Cover */}
              <ProjectCover cover={p.cover} title={p.title} />

              {/* "Ver projeto" on hover overlay */}
              <div className="absolute top-0 left-0 right-0 h-44 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
                  Ver projeto <ArrowRight className="size-3" />
                </span>
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

        {/* CTA row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link
            href="/projetos"
            className="flex items-center gap-2.5 px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 hover:scale-95"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Ver todos os projetos <ArrowRight className="size-3.5" />
          </Link>
          <a
            href="#contato"
            className="flex items-center gap-3 text-sm font-medium text-muted-foreground border border-border px-7 py-3.5 rounded-full hover:border-foreground/20 hover:text-foreground transition-all duration-300"
          >
            Tem um projeto em mente? <span className="opacity-50">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// Export ProjectCover so the /projetos page can reuse it
export { ProjectCover, COVERS }

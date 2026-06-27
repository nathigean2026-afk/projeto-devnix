"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { ProjectRow } from "@/lib/db/schema"
import { ProjectCover } from "@/components/projects-section"

const ALL = "Todos"

export function ProjectsGallery({ projects }: { projects: ProjectRow[] }) {
  const [active, setActive] = useState(ALL)
  const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))]

  const filtered =
    active === ALL ? projects : projects.filter((p) => p.category === active)

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 backdrop-blur-xl" style={{ background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="size-4" /> Elevanthe
          </Link>
          <span className="label-sm text-muted-foreground hidden sm:block">
            {filtered.length} projeto{filtered.length !== 1 ? "s" : ""}
          </span>
          <a
            href="/#contato"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all hover:opacity-75"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Iniciar Projeto
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-foreground opacity-30" />
            <span className="label-sm text-muted-foreground">Portfólio completo</span>
          </div>
          <h1 className="text-editorial text-[clamp(40px,7vw,84px)] text-foreground leading-none mb-4">
            Todos os<br />
            <span className="text-muted-foreground">projetos.</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Cada projeto é único — problema analisado, solução construída, código entregue ao cliente.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 border ${
                active === cat
                  ? "text-background border-transparent"
                  : "text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
              }`}
              style={active === cat ? { background: "var(--foreground)" } : {}}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {filtered.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col bg-background hover:bg-secondary transition-colors duration-300 overflow-hidden"
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "var(--foreground)" }}
                />

                {/* Cover */}
                <ProjectCover cover={p.cover} title={p.title} />

                {/* Hover overlay */}
                <div className="absolute top-0 left-0 right-0 h-44 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span
                    className="text-xs font-semibold text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
                  >
                    Ver detalhes <ArrowRight className="size-3" />
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
                  <h2 className="text-sm font-semibold text-foreground">{p.title}</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {(p.tech as string[]).map((t) => (
                      <span
                        key={t}
                        className="label-sm border border-border px-2 py-0.5 rounded text-muted-foreground font-mono"
                        style={{ fontSize: "9px", background: "var(--secondary)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Live URL */}
                  {(p as { liveUrl?: string }).liveUrl && (
                    <a
                      href={(p as { liveUrl?: string }).liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mt-1 w-fit relative z-10"
                    >
                      <ExternalLink className="size-2.5" /> Ver site ao vivo
                    </a>
                  )}
                </div>

                {/* Clickable overlay */}
                <Link
                  href={`/projetos/${p.slug}`}
                  className="absolute inset-0"
                  aria-label={`Ver projeto: ${p.title}`}
                />
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">Quer um projeto como estes?</p>
          <a
            href="/#contato"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all hover:opacity-75 hover:scale-95"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Iniciar meu projeto <ArrowRight className="size-3.5" />
          </a>
        </motion.div>
      </div>
    </main>
  )
}

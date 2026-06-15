"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { projects, type Project } from "@/lib/projects-data"

const ease = [0.16, 1, 0.3, 1] as const

export function ProjectDetailClient({ project }: { project: Project }) {
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar strip */}
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-md" style={{ background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
            Devnix
          </Link>
          <Link href="/#projetos" className="label-sm text-muted-foreground hover:text-foreground transition-colors">
            Todos os projetos
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative py-24 border-b border-border overflow-hidden">
          <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/#projetos"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                style={{ background: "var(--secondary)" }}
              >
                <ArrowLeft className="size-3" /> Portfólio
              </Link>
              <span className="text-muted-foreground opacity-30">/</span>
              <span className="label-sm text-muted-foreground">{project.category}</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h1
                  className="text-[clamp(36px,6vw,72px)] font-black text-foreground leading-none tracking-tight mb-6"
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease }}
                >
                  {project.title}
                </motion.h1>
                <motion.p
                  className="text-lg text-muted-foreground leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease }}
                >
                  {project.desc}
                </motion.p>
                <motion.div
                  className="flex items-center gap-4 flex-wrap"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease }}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-full" style={{ background: "var(--secondary)" }}>
                    <Clock className="size-3.5" />
                    {project.duration}
                  </div>
                  <Link
                    href="/#contato"
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:opacity-80"
                    style={{ background: "var(--foreground)", color: "var(--background)" }}
                  >
                    Quero um igual <ArrowRight className="size-3.5" />
                  </Link>
                </motion.div>
              </div>

              {/* Cover visual */}
              <motion.div
                className="relative h-64 lg:h-80 rounded-2xl border border-border overflow-hidden"
                style={{ background: "var(--secondary)" }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15, ease }}
              >
                <div className="absolute inset-0 grid-pattern opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[clamp(60px,10vw,100px)] font-black text-foreground select-none"
                    style={{ opacity: 0.04, letterSpacing: "-0.06em", lineHeight: 1 }}
                  >
                    {project.category.split(" ")[0].toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((s) => (
                    <span key={s} className="label-sm border border-border px-2 py-0.5 rounded text-muted-foreground font-mono backdrop-blur-sm"
                      style={{ fontSize: "9px", background: "var(--background)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Details grid */}
        <section className="py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-1.5 rounded-full bg-foreground opacity-60" />
                  <span className="label-sm text-muted-foreground uppercase tracking-wider" style={{ fontSize: "9px" }}>Desafio</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.challenge}</p>
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-1.5 rounded-full bg-foreground opacity-60" />
                  <span className="label-sm text-muted-foreground uppercase tracking-wider" style={{ fontSize: "9px" }}>Solução</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-1.5 rounded-full bg-foreground opacity-60" />
                  <span className="label-sm text-muted-foreground uppercase tracking-wider" style={{ fontSize: "9px" }}>Resultados</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {project.results.map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <CheckCircle className="size-3.5 text-foreground opacity-50 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="label-sm text-muted-foreground mb-6">Stack utilizada</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s}
                    className="px-4 py-2 rounded-xl border border-border text-sm text-foreground font-mono"
                    style={{ background: "var(--secondary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <h2 className="text-[clamp(32px,5vw,56px)] font-black text-foreground leading-none tracking-tight mb-5">
                Quer um projeto
                <br />
                <span style={{ opacity: 0.4 }}>parecido com este?</span>
              </h2>
              <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                Construo soluções personalizadas do zero. O código é seu, sem mensalidade de plataforma e sem limites de escala.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/#contato"
                  className="flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:opacity-80"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}
                >
                  Quero um igual
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/#contato"
                  className="flex items-center gap-3 px-8 py-4 rounded-full border border-border text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                >
                  Agendar bate-papo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Other projects */}
        {others.length > 0 && (
          <section className="py-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-6">
              <p className="label-sm text-muted-foreground mb-8">Outros projetos</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {others.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/projetos/${p.slug}`}
                      className="group flex flex-col gap-3 p-5 rounded-2xl border border-border hover:bg-secondary transition-all duration-200"
                      style={{ background: "var(--background)" }}
                    >
                      <span className="text-xs text-muted-foreground">{p.category}</span>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/80 transition-colors">{p.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {p.tech.map((t) => (
                          <span key={t} className="label-sm border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono"
                            style={{ fontSize: "8px", background: "var(--secondary)" }}>{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors mt-1">
                        Ver projeto <ArrowRight className="size-3" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

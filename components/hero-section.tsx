"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"

const TAGS = ["Sites", "Software", "E-commerce", "Plataformas", "Landing Pages", "Blogs", "Sistemas", "APIs"]

const ease = [0.23, 1, 0.32, 1] as const

export function HeroSection() {
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
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden="true" />

      {/* Subtle center glow */}
      <div
        aria-hidden="true"
        className="hero-glow w-[800px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse, var(--foreground) 0%, transparent 65%)", opacity: 0.028 }}
      />

      <motion.div
        style={{ y, opacity: fadeOut }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full"
      >
        {/* Tag line */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-muted-foreground"
            style={{ background: "var(--secondary)" }}
          >
            <span className="size-1.5 rounded-full bg-foreground opacity-60 animate-pulse" />
            <span className="label-sm">Desenvolvedor Full-Stack · Disponível</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-1">
          <motion.h1
            className="text-display text-foreground"
            style={{ fontSize: "clamp(54px,10vw,136px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            Seu site
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-1">
          <motion.h1
            className="text-display"
            style={{
              fontSize: "clamp(54px,10vw,136px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "1.5px var(--foreground)",
              opacity: 0.45,
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 0.45 }}
            transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
          >
            é sua
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="text-display text-foreground"
            style={{ fontSize: "clamp(54px,10vw,136px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.29, ease: "easeOut" }}
          >
            identidade.
          </motion.h1>
        </div>

        {/* Sub row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
        >
          <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
            Construo sites, software e plataformas que pertencem a você. Código-fonte
            entregue, personalizado do zero, sem limites de escala.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#contato"
              className="group flex items-center gap-3 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              Começar Projeto
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#servicos"
              className="flex items-center gap-3 px-7 py-4 rounded-full border border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
            >
              Ver Serviços
            </a>
          </div>
        </motion.div>

        {/* Marquee tags strip */}
        <motion.div
          className="mt-16 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
          aria-hidden="true"
        >
          <div className="flex w-max marquee-track">
            {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
              <div key={i} className="flex items-center gap-6 px-6">
                <span className="label-sm text-muted-foreground whitespace-nowrap">{tag}</span>
                <span className="size-1 rounded-full bg-border flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="mt-14 grid grid-cols-3 divide-x divide-border border border-border rounded-2xl overflow-hidden"
          style={{ background: "var(--card)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: "easeOut" }}
        >
          {[
            { n: "+50", label: "Projetos entregues" },
            { n: "100%", label: "Código seu, sempre" },
            { n: "+5", label: "Anos de experiência" },
          ].map((s) => (
            <div key={s.n} className="flex flex-col gap-1 px-6 py-5">
              <span
                className="font-black text-foreground"
                style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                {s.n}
              </span>
              <span className="label-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="label-sm text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { ParticleBackground } from "./particle-background"

const badges = [
  "Código original entregue",
  "Suporte pós-entrega",
  "Projetos sob medida",
  "Domínio 100% seu",
]

export function HeroSection() {
  const scrollTo = (href: string) => {
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Radial glow from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, oklch(0.84 0.2 155 / 8%) 0%, transparent 70%)",
        }}
      />

      {/* Animated particles / floating code */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="size-4" />
          Desenvolvimento Web Profissional
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-none mb-6"
        >
          Seu projeto,{" "}
          <span className="neon-text">
            do zero
          </span>
          <br />
          ao{" "}
          <span className="neon-text">
            ar
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 text-pretty"
        >
          Transformo ideias em soluções digitais reais — sites, software personalizado,
          plataformas analíticas e muito mais. Você tem o problema,{" "}
          <span className="text-foreground font-medium">eu faço a solução</span>.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <button
            onClick={() => scrollTo("#contato")}
            className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl neon-glow hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Iniciar projeto
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo("#servicos")}
            className="flex items-center gap-2 px-8 py-4 text-base font-medium text-foreground border border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all duration-200"
          >
            Ver serviços
          </button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {badges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground"
            >
              <CheckCircle2 className="size-3.5 text-primary flex-shrink-0" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest uppercase">Role para explorar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="size-5 rounded-full border border-muted-foreground/40 flex items-center justify-center"
        >
          <div className="size-1.5 rounded-full bg-muted-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}

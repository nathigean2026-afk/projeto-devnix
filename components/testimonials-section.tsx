"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Andrade",
    role: "CEO, Andrade Imóveis",
    initials: "CA",
    content:
      "Entregou o portal imobiliário no prazo, com todas as funcionalidades pedidas e ainda sugeriu melhorias que não tínhamos pensado. O código nos foi entregue completo.",
    stars: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Empreendedora Digital",
    initials: "FL",
    content:
      "Precisava de uma landing page de alta conversão para o lançamento do meu curso. O resultado superou todas as expectativas. As vendas explodiram no lançamento.",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Diretor, LogisTech",
    initials: "RS",
    content:
      "Desenvolveu um sistema de gestão completo para nossa empresa. O diferencial foi a análise do problema antes de propor a solução. Parece que nos conhece há anos.",
    stars: 5,
  },
  {
    name: "Mariana Costa",
    role: "Fundadora, Studio MC",
    initials: "MC",
    content:
      "Contratei o projeto pré-pronto adaptado. Foi rápido, econômico e o resultado ficou exatamente como precisávamos. Suporte pós-entrega excelente.",
    stars: 5,
  },
  {
    name: "Pedro Martins",
    role: "Tech Lead, StartupX",
    initials: "PM",
    content:
      "Criou nossa plataforma analítica com dashboards em tempo real. Arquitetura sólida, código limpo e documentação completa. Recomendo sem hesitar.",
    stars: 5,
  },
  {
    name: "Ana Paula Ribeiro",
    role: "Blogueira & Criadora",
    initials: "AP",
    content:
      "Meu blog ficou lindo e super rápido. O SEO começou a dar resultados no primeiro mês. Adoro poder mexer no conteúdo sozinha pelo painel que ele criou.",
    stars: 5,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Depoimentos</span>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <motion.h2
            className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            O que os clientes
            <br />
            <span style={{ opacity: 0.35 }}>dizem.</span>
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Mais de 50 projetos entregues com 100% de satisfação dos clientes.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="group relative flex flex-col gap-5 p-7 bg-background hover:bg-secondary transition-colors duration-300"
            >
              {/* Top hover line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--foreground)" }}
              />

              {/* Quote + stars */}
              <div className="flex items-start justify-between">
                <Quote className="size-6 text-muted-foreground opacity-15" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="size-3 text-foreground opacity-60 fill-foreground" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className="size-9 rounded-full border border-border flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--secondary)" }}
                >
                  <span className="label-sm text-foreground" style={{ fontSize: "9px" }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="label-sm text-muted-foreground" style={{ fontSize: "9px" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

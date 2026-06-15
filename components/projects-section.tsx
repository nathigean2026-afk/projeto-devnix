"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Plataforma SaaS de Gestão",
    category: "Software Personalizado",
    desc: "Sistema completo com dashboard analítico, controle de estoque, vendas e relatórios em tempo real.",
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
    col: "lg:col-span-2",
    row: "",
  },
  {
    title: "E-commerce de Moda",
    category: "Loja Virtual",
    desc: "Loja com catálogo, carrinho, checkout e painel admin completo — código entregue.",
    tech: ["React", "Stripe", "Node.js"],
    col: "",
    row: "",
  },
  {
    title: "Dashboard Analítico",
    category: "Plataforma Analítica",
    desc: "BI com gráficos em tempo real, múltiplas fontes de dados e exportação de relatórios.",
    tech: ["React", "D3.js", "SQL"],
    col: "",
    row: "",
  },
  {
    title: "Portal Imobiliário",
    category: "Site Profissional",
    desc: "Portal com busca avançada, mapa interativo, tour virtual e CRM integrado.",
    tech: ["Next.js", "Mapbox", "Prisma"],
    col: "",
    row: "",
  },
  {
    title: "Landing Page SaaS",
    category: "Landing Page",
    desc: "Página de alta conversão com animações, depoimentos, preços e formulário integrado.",
    tech: ["Next.js", "Framer Motion"],
    col: "",
    row: "",
  },
  {
    title: "Blog Especializado",
    category: "Blog & Conteúdo",
    desc: "Plataforma com CMS headless, SEO otimizado, categorias e pesquisa full-text.",
    tech: ["Next.js", "MDX", "Algolia"],
    col: "lg:col-span-2",
    row: "",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="projetos" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Portfólio</span>
        </motion.div>

        {/* Heading */}
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
              key={p.title}
              variants={cardVariants}
              className={`group relative flex flex-col bg-background hover:bg-secondary transition-colors duration-300 overflow-hidden ${p.col}`}
            >
              {/* Top line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--foreground)" }}
              />

              {/* Preview area */}
              <div className="h-32 relative flex items-center justify-center bg-secondary overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-60" />
                <span className="label-sm text-muted-foreground opacity-40 font-mono select-none">
                  {`{ ${p.category} }`}
                </span>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className="size-7 rounded-lg border border-border flex items-center justify-center"
                    style={{ background: "var(--background)" }}
                  >
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </div>
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

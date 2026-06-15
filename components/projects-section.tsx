"use client"

import { motion } from "framer-motion"
import { ExternalLink, GitBranch } from "lucide-react"

const projects = [
  {
    title: "Plataforma SaaS de Gestão",
    category: "Software Personalizado",
    desc: "Sistema completo de gestão empresarial com dashboard analítico, controle de estoque, vendas e relatórios em tempo real.",
    tech: ["Next.js", "PostgreSQL", "TypeScript", "Recharts"],
    color: "from-primary/20 to-primary/5",
    size: "lg",
  },
  {
    title: "E-commerce de Moda",
    category: "Loja Virtual",
    desc: "Loja completa com catálogo de produtos, carrinho, checkout integrado com Stripe e painel admin.",
    tech: ["React", "Stripe", "Node.js"],
    color: "from-blue-500/20 to-blue-500/5",
    size: "sm",
  },
  {
    title: "Dashboard Analítico",
    category: "Plataforma Analítica",
    desc: "Plataforma de BI com gráficos em tempo real, integração com múltiplas fontes de dados e exportação de relatórios.",
    tech: ["React", "D3.js", "SQL"],
    color: "from-purple-500/20 to-purple-500/5",
    size: "sm",
  },
  {
    title: "Portal Imobiliário",
    category: "Site Profissional",
    desc: "Portal de imóveis com busca avançada por filtros, mapa interativo, tour virtual e CRM integrado para corretores.",
    tech: ["Next.js", "Mapbox", "Prisma"],
    color: "from-amber-500/20 to-amber-500/5",
    size: "md",
  },
  {
    title: "Landing Page SaaS",
    category: "Landing Page",
    desc: "Página de alta conversão para produto SaaS com animações, depoimentos, preços e integração com formulário.",
    tech: ["Next.js", "Framer Motion", "Resend"],
    color: "from-rose-500/20 to-rose-500/5",
    size: "md",
  },
  {
    title: "Blog Especializado",
    category: "Blog & Conteúdo",
    desc: "Plataforma de blog com CMS próprio, SEO otimizado, categorias, pesquisa full-text e monetização via anúncios.",
    tech: ["Next.js", "MDX", "Algolia"],
    color: "from-teal-500/20 to-teal-500/5",
    size: "sm",
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

export function ProjectsSection() {
  return (
    <section id="projetos" className="py-24 sm:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Portfólio
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-5">
            Projetos que{" "}
            <span className="neon-text">entregam resultados</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Cada projeto é único. Analiso o problema, construo a solução e entrego o código original — tudo é seu.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project) => (
            <motion.article
              key={project.title}
              variants={itemVariants}
              className={`group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer
                ${project.size === "lg" ? "md:col-span-2" : ""}`}
            >
              {/* Gradient top area */}
              <div className={`h-36 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                {/* Decorative floating code */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xs text-primary/40 select-none">
                    {"{"}project.{project.category.toLowerCase().replace(" ", "_")}{"}"}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="size-8 rounded-lg bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </button>
                  <button className="size-8 rounded-lg bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                    <GitBranch className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  {project.category}
                </span>
                <h3 className="font-semibold text-foreground mt-3 mb-2 text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-muted border border-border text-muted-foreground font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Neon bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300" />
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Tem um projeto em mente?
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("contato")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary border border-primary/40 rounded-xl hover:bg-primary/10 transition-all duration-200"
          >
            Vamos conversar →
          </button>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import {
  Globe, Code2, BarChart3, Layout, ShoppingCart,
  Wrench, Database, Smartphone, ArrowUpRight
} from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Sites Profissionais",
    desc: "Do site institucional ao portal corporativo. Design moderno, responsivo e otimizado para SEO e performance.",
    tags: ["WordPress", "Next.js", "React"],
    highlight: false,
  },
  {
    icon: Code2,
    title: "Software Personalizado",
    desc: "Você tem um problema específico? Eu analiso e construo a solução ideal — do zero ao deploy, 100% customizado.",
    tags: ["Node.js", "Python", "APIs"],
    highlight: true,
  },
  {
    icon: BarChart3,
    title: "Plataformas Analíticas",
    desc: "Dashboards e plataformas de dados em tempo real para visualizar métricas e tomar decisões mais inteligentes.",
    tags: ["Dashboard", "SQL", "Charts"],
    highlight: false,
  },
  {
    icon: Layout,
    title: "Landing Pages",
    desc: "Páginas de alta conversão para campanhas, lançamentos de produtos e captação de leads com foco em resultado.",
    tags: ["Alta conversão", "Animações", "CTA"],
    highlight: false,
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Lojas",
    desc: "Lojas virtuais completas com carrinho, pagamentos, controle de estoque e painel administrativo.",
    tags: ["Stripe", "Checkout", "Admin"],
    highlight: false,
  },
  {
    icon: Database,
    title: "Projetos Pré-prontos",
    desc: "Templates prontos adaptados ao seu banco de dados. Você escolhe, eu personalizo. Disponível via mensalidade.",
    tags: ["Templates", "Mensalidade", "Rápido"],
    highlight: false,
  },
  {
    icon: Wrench,
    title: "Manutenção & Suporte",
    desc: "Manutenção contínua com preço combinado. Correções, atualizações e melhorias no seu sistema já existente.",
    tags: ["Correções", "Updates", "Suporte"],
    highlight: false,
  },
  {
    icon: Smartphone,
    title: "Blogs & Conteúdo",
    desc: "Plataformas de blog otimizadas para SEO, com editor amigável, categorias, comentários e monetização.",
    tags: ["SEO", "CMS", "Blog"],
    highlight: false,
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle top border glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            O que eu faço
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-5">
            Serviços completos de<br />
            <span className="neon-text">desenvolvimento digital</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Do site mais simples ao sistema mais complexo — entrego soluções que funcionam
            e que são 100% do cliente.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 cursor-default
                  ${service.highlight
                    ? "border-primary/40 bg-primary/5 neon-glow"
                    : "border-border bg-card hover:border-primary/30 hover:bg-primary/3"
                  }`}
              >
                {service.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-full"
                  >
                    Mais popular
                  </div>
                )}

                <div className={`size-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                  ${service.highlight
                    ? "bg-primary/20 border border-primary/40"
                    : "bg-muted border border-border group-hover:border-primary/30 group-hover:bg-primary/10"
                  }`}>
                  <Icon className={`size-5 ${service.highlight ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                </div>

                <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ArrowUpRight className="absolute top-5 right-5 size-4 text-muted-foreground/0 group-hover:text-primary/60 transition-all duration-200" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

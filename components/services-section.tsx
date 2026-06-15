"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Globe, Code2, BarChart3, Layout, ShoppingCart, Wrench, BookOpen, Zap } from "lucide-react"

const services = [
  {
    icon: Globe,
    num: "01",
    title: "Sites Profissionais",
    desc: "Do institucional ao corporativo. Responsivo, performático e com SEO técnico desde o primeiro commit.",
    tags: ["Next.js", "React", "SEO"],
  },
  {
    icon: Code2,
    num: "02",
    title: "Software Personalizado",
    desc: "Você tem o problema — eu analiso e construo a solução exata. Nada genérico, tudo sob medida para o seu negócio.",
    tags: ["Full-Stack", "API", "DB"],
  },
  {
    icon: BarChart3,
    num: "03",
    title: "Plataformas Analíticas",
    desc: "Dashboards em tempo real, relatórios interativos e BI para decisões mais rápidas e inteligentes.",
    tags: ["Dashboard", "BI", "Real-time"],
  },
  {
    icon: Layout,
    num: "04",
    title: "Landing Pages",
    desc: "Páginas de alta conversão para campanhas, lançamentos e captação de leads com copy e design validados.",
    tags: ["CRO", "A/B", "Analytics"],
  },
  {
    icon: ShoppingCart,
    num: "05",
    title: "E-commerce",
    desc: "Lojas virtuais completas com carrinho, checkout, pagamento integrado e painel admin — código seu.",
    tags: ["Checkout", "Pagamentos", "Admin"],
  },
  {
    icon: BookOpen,
    num: "06",
    title: "Blogs & Conteúdo",
    desc: "Plataformas com CMS headless integrado, SEO avançado e estrutura escalável para crescer sem limites.",
    tags: ["CMS", "MDX", "SEO"],
  },
  {
    icon: Zap,
    num: "07",
    title: "Projetos Pré-prontos",
    desc: "Templates premium adaptados ao seu banco de dados e identidade. Rápido, econômico, via mensalidade.",
    tags: ["Template", "Rápido", "Mensal"],
  },
  {
    icon: Wrench,
    num: "08",
    title: "Manutenção & Suporte",
    desc: "Atualizações, correções e melhorias contínuas com preço combinado e atendimento direto. Sem surpresas.",
    tags: ["Suporte", "Updates", "24h"],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="servicos" ref={ref} className="relative py-32 overflow-hidden">
      {/* Dot pattern bg */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Serviços</span>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <motion.h2
            className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            O que eu faço,
            <br />
            <span style={{ opacity: 0.35 }}>com excelência.</span>
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Código-fonte original sempre incluso. Você tem total domínio sobre tudo que foi construído.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((s) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                variants={cardVariants}
                className="group relative flex flex-col gap-5 p-6 bg-background hover:bg-secondary transition-colors duration-300 cursor-default"
              >
                {/* Number */}
                <span className="label-sm text-muted-foreground opacity-40">{s.num}</span>

                {/* Icon */}
                <div
                  className="size-10 rounded-xl border border-border flex items-center justify-center group-hover:border-foreground/20 transition-all duration-300"
                  style={{ background: "var(--secondary)" }}
                >
                  <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="label-sm text-muted-foreground border border-border px-2 py-0.5 rounded-full"
                      style={{ fontSize: "9px" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Hover line */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "var(--foreground)" }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const projects = [
  {
    slug: "plataforma-saas-gestao",
    title: "Plataforma SaaS de Gestão",
    category: "Software Personalizado",
    desc: "Sistema completo com dashboard analítico, controle de estoque, vendas e relatórios em tempo real.",
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
    col: "lg:col-span-2",
    cover: "saas",
    challenge: "Uma empresa de médio porte precisava substituir planilhas desorganizadas por um sistema centralizado que permitisse múltiplos usuários, controle de estoque em tempo real e geração automática de relatórios gerenciais.",
    solution: "Desenvolvemos uma plataforma SaaS multi-tenant com autenticação por papéis (admin, gestor, operador), dashboard com gráficos em tempo real via WebSocket, módulo de estoque com alertas automáticos e relatórios exportáveis em PDF e Excel.",
    results: ["Redução de 70% no tempo de geração de relatórios", "Visibilidade em tempo real do estoque", "Acesso simultâneo de 50+ usuários", "Código-fonte 100% entregue ao cliente"],
    duration: "4 meses",
    stack: ["Next.js 14", "TypeScript", "PostgreSQL", "Drizzle ORM", "WebSocket", "Recharts", "PDF generation"],
  },
  {
    slug: "ecommerce-moda",
    title: "E-commerce de Moda",
    category: "Loja Virtual",
    desc: "Loja com catálogo, carrinho, checkout e painel admin completo — código entregue.",
    tech: ["React", "Stripe", "Node.js"],
    col: "",
    cover: "ecommerce",
    challenge: "Uma marca de moda independente precisava de uma loja online que transmitisse sua identidade visual única, suportasse pagamentos seguros e tivesse um painel admin intuitivo para gerenciar produtos e pedidos sem depender de terceiros.",
    solution: "E-commerce completo com catálogo filtrado por categoria/tamanho/cor, carrinho persistente, checkout com Stripe, rastreamento de pedidos e painel admin para cadastro de produtos com upload de imagens múltiplas.",
    results: ["Lançamento em 2 meses", "Taxa de conversão 3x acima da média do segmento", "Painel admin sem necessidade de desenvolvedor", "Código-fonte e infraestrutura do cliente"],
    duration: "2 meses",
    stack: ["React", "Node.js", "Stripe", "MongoDB", "Cloudinary", "Tailwind CSS"],
  },
  {
    slug: "dashboard-analitico",
    title: "Dashboard Analítico",
    category: "Plataforma Analítica",
    desc: "BI com gráficos em tempo real, múltiplas fontes de dados e exportação de relatórios.",
    tech: ["React", "D3.js", "SQL"],
    col: "",
    cover: "dashboard",
    challenge: "Um grupo empresarial com múltiplas filiais precisava consolidar dados de diferentes sistemas legados (ERP, CRM, planilhas) em uma única visão executiva, com atualização em tempo real e exportação para apresentações.",
    solution: "Dashboard analítico com conectores para 5 fontes de dados distintas, normalização e cache inteligente, visualizações interativas com D3.js e Recharts, filtros por período/filial/produto e exportação em PDF/Excel.",
    results: ["Consolidação de 5 sistemas em 1 painel", "Atualização a cada 5 minutos automaticamente", "Relatórios executivos em 1 clique", "Adoção imediata pelo time de diretores"],
    duration: "3 meses",
    stack: ["React", "D3.js", "PostgreSQL", "Python (ETL)", "Redis", "FastAPI"],
  },
  {
    slug: "portal-imobiliario",
    title: "Portal Imobiliário",
    category: "Site Profissional",
    desc: "Portal com busca avançada, mapa interativo, tour virtual e CRM integrado.",
    tech: ["Next.js", "Mapbox", "Prisma"],
    col: "",
    cover: "portal",
    challenge: "Uma imobiliária regional queria digitalizar toda sua operação: substituir o atendimento por WhatsApp por um portal moderno com busca georreferenciada, tour virtual dos imóveis e CRM próprio para gestão de leads.",
    solution: "Portal imobiliário completo com mapa Mapbox interativo, filtros avançados por preço/bairro/tipo, galeria de fotos com tour 360°, sistema de agendamento de visitas e CRM para acompanhamento de cada lead do funil.",
    results: ["500+ imóveis cadastrados no lançamento", "Tempo médio de resposta reduzido de 6h para 15min", "Tour virtual reduziu visitas desnecessárias em 40%", "SEO resultou em 3x mais tráfego orgânico"],
    duration: "5 meses",
    stack: ["Next.js", "Mapbox GL", "Prisma", "PostgreSQL", "AWS S3", "Pannellum (360°)"],
  },
  {
    slug: "landing-page-saas",
    title: "Landing Page SaaS",
    category: "Landing Page",
    desc: "Página de alta conversão com animações, depoimentos, preços e formulário integrado.",
    tech: ["Next.js", "Framer Motion"],
    col: "",
    cover: "landing",
    challenge: "Uma startup SaaS precisava de uma landing page que comunicasse claramente o valor do produto, transmitisse credibilidade para potenciais clientes corporativos e convertesse visitantes em leads qualificados para o time de vendas.",
    solution: "Landing page com animações suaves em Framer Motion, seção de pricing dinâmica com toggle mensal/anual, depoimentos com carrossel, FAQ interativo, formulário de demo com integração ao CRM e rastreamento de conversões.",
    results: ["Taxa de conversão de 8,4% (média do setor: 2-3%)", "Tempo no site aumentou 2,5x vs. versão anterior", "Leads qualificados cresceram 120% no primeiro mês", "Core Web Vitals 100 no Lighthouse"],
    duration: "3 semanas",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS", "HubSpot API", "Vercel Analytics"],
  },
  {
    slug: "blog-especializado",
    title: "Blog Especializado",
    category: "Blog & Conteúdo",
    desc: "Plataforma com CMS headless, SEO otimizado, categorias e pesquisa full-text.",
    tech: ["Next.js", "MDX", "Algolia"],
    col: "lg:col-span-2",
    cover: "blog",
    challenge: "Um especialista em finanças pessoais queria publicar conteúdo de forma independente, sem depender de plataformas como Medium ou WordPress, com controle total sobre SEO, monetização e design.",
    solution: "Blog com CMS headless em Markdown/MDX, geração estática via Next.js para máxima performance, pesquisa full-text com Algolia, sistema de categorias e tags, newsletter integrada, monetização com Google AdSense e planos pagos.",
    results: ["Score 98+ no Lighthouse em todas as métricas", "Indexação no Google em menos de 48h", "Newsletter com 2.000+ assinantes em 3 meses", "Tempo de carregamento médio: 0.8s"],
    duration: "6 semanas",
    stack: ["Next.js", "MDX", "Algolia", "Resend", "Stripe (planos pagos)", "Vercel Edge"],
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

const COVER_PATTERNS: Record<string, string> = {
  saas: "M10 10h20v20H10z M40 5h15v15H40z M5 40h12v12H5z M38 35h18v18H38z",
  ecommerce: "M15 15h25v35H15z M45 20h15v10H45z M45 35h15v10H45z M18 55h20v5H18z",
  dashboard: "M5 30h15v25H5z M25 15h15v40H25z M45 20h15v35H45z M65 5h15v50H65z",
  portal: "M10 40 Q35 10 60 40 Q85 70 110 40",
  landing: "M0 50 Q25 10 50 50 Q75 90 100 50",
  blog: "M10 15h80v5H10z M10 30h60v4H10z M10 44h70v4H10z M10 58h50v4H10z M10 72h65v4H10z",
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

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

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((p) => (
            <motion.article
              key={p.slug}
              variants={cardVariants}
              className={`group relative flex flex-col bg-background hover:bg-secondary transition-colors duration-300 overflow-hidden ${p.col}`}
            >
              {/* Top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--foreground)" }}
              />

              {/* Preview area with SVG pattern */}
              <div className="h-36 relative flex items-center justify-center bg-secondary overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <svg
                  viewBox="0 0 100 60"
                  className="w-24 h-14 text-foreground opacity-[0.07] group-hover:opacity-[0.12] transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {p.cover === "portal" || p.cover === "landing" ? (
                    <path d={COVER_PATTERNS[p.cover]} strokeLinecap="round" />
                  ) : (
                    <path d={COVER_PATTERNS[p.cover]} />
                  )}
                </svg>
                {/* "Ver projeto" on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border"
                    style={{ background: "var(--background)" }}>
                    Ver projeto <ArrowRight className="size-3" />
                  </span>
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

              {/* Clickable overlay */}
              <Link href={`/projetos/${p.slug}`} className="absolute inset-0" aria-label={`Ver projeto: ${p.title}`} />
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

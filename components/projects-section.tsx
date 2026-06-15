"use client"

import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Plataforma SaaS de Gestão",
    category: "Software Personalizado",
    desc: "Sistema completo com dashboard analítico, controle de estoque, vendas e relatórios em tempo real.",
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
    accent: "rgba(92,255,138,0.12)",
    span: "lg:col-span-2",
  },
  {
    title: "E-commerce de Moda",
    category: "Loja Virtual",
    desc: "Loja com catálogo, carrinho, checkout Stripe e painel admin completo.",
    tech: ["React", "Stripe", "Node.js"],
    accent: "rgba(92,200,255,0.10)",
    span: "",
  },
  {
    title: "Dashboard Analítico",
    category: "Plataforma Analítica",
    desc: "BI com gráficos em tempo real, múltiplas fontes de dados e exportação de relatórios.",
    tech: ["React", "D3.js", "SQL"],
    accent: "rgba(180,92,255,0.10)",
    span: "",
  },
  {
    title: "Portal Imobiliário",
    category: "Site Profissional",
    desc: "Portal com busca avançada, mapa interativo, tour virtual e CRM para corretores.",
    tech: ["Next.js", "Mapbox", "Prisma"],
    accent: "rgba(255,200,92,0.10)",
    span: "",
  },
  {
    title: "Landing Page SaaS",
    category: "Landing Page",
    desc: "Página de alta conversão com animações, depoimentos, preços e formulário integrado.",
    tech: ["Next.js", "Framer Motion"],
    accent: "rgba(255,92,138,0.10)",
    span: "",
  },
  {
    title: "Blog Especializado",
    category: "Blog & Conteúdo",
    desc: "Plataforma com CMS, SEO otimizado, categorias, pesquisa full-text e monetização.",
    tech: ["Next.js", "MDX", "Algolia"],
    accent: "rgba(92,255,200,0.10)",
    span: "lg:col-span-2",
  },
]

export function ProjectsSection() {
  return (
    <section id="projetos" className="relative py-32 overflow-hidden">
      {/* Divisor */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="section-label mb-5">Portfólio</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#eef4f0] leading-tight tracking-tight">
              Projetos que{" "}
              <span className="text-[#5cff8a] glow-text-sm">entregam resultados</span>
            </h2>
            <p className="text-[#7a9985] text-sm max-w-xs leading-relaxed lg:text-right">
              Cada projeto é único — problema analisado, solução construída, código entregue.
            </p>
          </div>
        </div>

        {/* Grid bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/7"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          {projects.map((p) => (
            <article
              key={p.title}
              className={`group relative bg-[#0c1710] flex flex-col overflow-hidden hover:bg-[#0f1e14] transition-colors duration-300 ${p.span}`}
            >
              {/* Linha hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[#5cff8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Área de preview */}
              <div
                className="h-36 relative overflow-hidden flex items-center justify-center"
                style={{ background: p.accent }}
              >
                {/* Grade sutil */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <span className="font-mono text-[11px] text-white/15 select-none">{`{ ${p.category} }`}</span>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="size-7 rounded-lg bg-[#0c1710]/80 border border-white/10 flex items-center justify-center">
                    <ExternalLink className="size-3 text-[#7a9985]" />
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <span className="inline-flex self-start text-[11px] font-medium text-[#5cff8a] bg-[#5cff8a]/8 border border-[#5cff8a]/20 px-2.5 py-0.5 rounded-full">
                  {p.category}
                </span>
                <h3 className="text-[14px] font-semibold text-[#eef4f0]">{p.title}</h3>
                <p className="text-[12.5px] text-[#7a9985] leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#111f16] border border-white/7 text-[#7a9985]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <a
            href="#contato"
            className="flex items-center gap-2 text-[13px] font-medium text-[#5cff8a] border border-[#5cff8a]/25 px-6 py-2.5 rounded-xl hover:bg-[#5cff8a]/8 transition-all duration-200"
          >
            Tem um projeto em mente? Vamos conversar
            <span className="text-[#5cff8a]/60">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

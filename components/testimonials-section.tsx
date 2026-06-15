"use client"

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

export function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Divisor */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="section-label mb-5">Depoimentos</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#eef4f0] leading-tight tracking-tight">
            O que os clientes{" "}
            <span className="text-[#5cff8a] glow-text-sm">dizem</span>
          </h2>
        </div>

        {/* Grid bento */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-white/7"
          style={{ gap: "1px", background: "rgba(255,255,255,0.06)" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative bg-[#0c1710] p-7 flex flex-col gap-5 hover:bg-[#0f1e14] transition-colors duration-300"
            >
              {/* Hover top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[#5cff8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Quote + estrelas */}
              <div className="flex items-start justify-between">
                <Quote className="size-6 text-[#5cff8a]/20" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="size-3.5 text-[#5cff8a] fill-[#5cff8a]" />
                  ))}
                </div>
              </div>

              {/* Texto */}
              <p className="text-[13px] text-[#7a9985] leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="size-9 rounded-full bg-[#5cff8a]/10 border border-[#5cff8a]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-[#5cff8a]">{t.initials}</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#eef4f0]">{t.name}</div>
                  <div className="text-[11px] text-[#536860]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

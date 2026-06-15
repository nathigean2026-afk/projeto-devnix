"use client"

import { Globe, Code2, BarChart3, Layout, ShoppingCart, Wrench, Database, Smartphone } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Sites Profissionais",
    desc: "Do institucional ao e-commerce. Responsivo, rápido e com SEO otimizado desde o primeiro commit.",
    span: "col-span-2",
  },
  {
    icon: Code2,
    title: "Software Personalizado",
    desc: "Você tem o problema — eu analiso e construo a solução exata. Nada genérico, tudo sob medida.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Plataformas Analíticas",
    desc: "Dashboards de dados em tempo real, relatórios interativos e BI para decisões mais rápidas.",
    span: "",
  },
  {
    icon: Layout,
    title: "Landing Pages",
    desc: "Páginas de alta conversão para campanhas, lançamentos e captação de leads com foco em resultado.",
    span: "",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Lojas virtuais com carrinho, pagamento, estoque e painel admin — entregue com código-fonte.",
    span: "",
  },
  {
    icon: Database,
    title: "Projetos Pré-prontos",
    desc: "Templates prontos adaptados ao seu banco de dados. Rápido, econômico e pago por mensalidade.",
    span: "col-span-2",
  },
  {
    icon: Wrench,
    title: "Manutenção & Suporte",
    desc: "Atualizações, correções e melhorias com preço combinado. Sem surpresas.",
    span: "",
  },
  {
    icon: Smartphone,
    title: "Blogs & Conteúdo",
    desc: "Plataformas de blog com CMS integrado, SEO avançado e estrutura escalável.",
    span: "",
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="relative py-32 overflow-hidden">
      {/* Divisor superior */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      {/* Glow de fundo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(20,70,38,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="section-label mb-5">O que faço</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#eef4f0] leading-tight tracking-tight">
              O que posso{" "}
              <span className="text-[#5cff8a] glow-text-sm">construir</span>{" "}
              para você
            </h2>
            <p className="text-[#7a9985] text-sm max-w-xs leading-relaxed lg:text-right">
              Desde um site simples até sistemas complexos — código-fonte original sempre incluso.
            </p>
          </div>
        </div>

        {/* Bento grid fiel ao vídeo: divisórias com bg gap, sem cards individuais arredondados */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-white/7"
          style={{ gap: "1px", background: "rgba(255,255,255,0.06)" }}
        >
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className={`group relative bg-[#0c1710] p-7 flex flex-col gap-5 hover:bg-[#0f1e14] transition-colors duration-300 ${s.span}`}
              >
                {/* Linha de destaque no hover — igual ao vídeo */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#5cff8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="size-10 rounded-xl bg-[#111f16] border border-white/7 flex items-center justify-center group-hover:border-[#5cff8a]/30 group-hover:bg-[#5cff8a]/8 transition-all duration-300">
                  <Icon className="size-[18px] text-[#7a9985] group-hover:text-[#5cff8a] transition-colors duration-300" />
                </div>

                <div>
                  <h3 className="text-[13.5px] font-semibold text-[#eef4f0] mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-[#7a9985] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

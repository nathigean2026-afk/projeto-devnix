"use client"

import { Check, Zap, Crown, Package } from "lucide-react"

const plans = [
  {
    icon: Package,
    name: "Projeto Pré-pronto",
    price: "Mensalidade",
    priceDetail: "valor combinado",
    desc: "Templates prontos adaptados ao seu banco de dados e identidade visual. Solução rápida e econômica.",
    features: [
      "Template escolhido por você",
      "Adaptação ao seu banco de dados",
      "Personalização de cores e logo",
      "Suporte técnico incluso",
      "Atualizações mensais",
      "Hospedagem orientada",
    ],
    cta: "Escolher template",
    highlight: false,
  },
  {
    icon: Zap,
    name: "Site Personalizado",
    price: "Sob consulta",
    priceDetail: "pagamento único",
    desc: "Site ou landing page construído do zero, com design exclusivo e código original entregue.",
    features: [
      "Design exclusivo 100%",
      "Código original entregue",
      "SEO otimizado",
      "Responsivo — mobile-first",
      "30 dias de suporte pós-entrega",
      "Manutenção com preço combinado",
      "Domínio e hospedagem orientada",
    ],
    cta: "Solicitar orçamento",
    highlight: true,
  },
  {
    icon: Crown,
    name: "Software Completo",
    price: "Sob consulta",
    priceDetail: "por projeto",
    desc: "Sistemas, plataformas analíticas e software personalizado do zero ao deploy.",
    features: [
      "Análise do problema e proposta",
      "Arquitetura personalizada",
      "Painel administrativo incluso",
      "Integrações de APIs",
      "Banco de dados sob medida",
      "Documentação técnica",
      "Suporte contínuo negociado",
      "Código 100% do cliente",
    ],
    cta: "Solicitar orçamento",
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="precos" className="relative py-32 overflow-hidden">
      {/* Divisor */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      {/* Glow de fundo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(20,70,38,0.28) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-5 justify-center">Planos e valores</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#eef4f0] leading-tight tracking-tight mb-5">
            Solução para cada{" "}
            <span className="text-[#5cff8a] glow-text-sm">necessidade</span>
          </h2>
          <p className="text-[#7a9985] text-sm max-w-sm mx-auto leading-relaxed">
            Cada projeto é único. Entre em contato para um orçamento personalizado sem compromisso.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/7"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 transition-colors duration-300 ${
                  plan.highlight
                    ? "bg-[#111f16]"
                    : "bg-[#0c1710] hover:bg-[#0f1e14]"
                }`}
              >
                {/* Linha de destaque no plano highlight */}
                {plan.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.8), transparent)" }}
                  />
                )}

                {/* Badge */}
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#5cff8a] text-[#0c1710] text-[11px] font-bold rounded-full"
                    style={{ boxShadow: "0 0 18px rgba(92,255,138,0.5)" }}>
                    Mais escolhido
                  </div>
                )}

                {/* Ícone + nome */}
                <div className={`size-11 rounded-xl flex items-center justify-center mb-5 border ${
                  plan.highlight
                    ? "bg-[#5cff8a]/12 border-[#5cff8a]/30"
                    : "bg-[#111f16] border-white/7"
                }`}>
                  <Icon className={`size-5 ${plan.highlight ? "text-[#5cff8a]" : "text-[#7a9985]"}`} />
                </div>

                <h3 className="text-[15px] font-bold text-[#eef4f0] mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`text-xl font-black ${plan.highlight ? "text-[#5cff8a]" : "text-[#eef4f0]"}`}
                    style={plan.highlight ? { textShadow: "0 0 20px rgba(92,255,138,0.4)" } : {}}>
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-[#536860]">{plan.priceDetail}</span>
                </div>

                <p className="text-[12.5px] text-[#7a9985] leading-relaxed mb-7">{plan.desc}</p>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="size-3.5 text-[#5cff8a] flex-shrink-0 mt-0.5" />
                      <span className="text-[12.5px] text-[#7a9985]">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contato"
                  className={`flex items-center justify-center w-full py-3 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                    plan.highlight
                      ? "bg-[#5cff8a] text-[#0c1710] hover:bg-[#7aff9e]"
                      : "border border-white/10 text-[#c8d9cd] hover:border-[#5cff8a]/30 hover:bg-[#5cff8a]/6"
                  }`}
                  style={plan.highlight ? { boxShadow: "0 0 20px rgba(92,255,138,0.35)" } : {}}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>

        <p className="text-center text-[12px] text-[#536860] mt-8">
          Todos os projetos incluem{" "}
          <span className="text-[#c8d9cd]">código original entregue</span>
          {" "}e opção de{" "}
          <span className="text-[#c8d9cd]">manutenção continuada</span>.
        </p>
      </div>
    </section>
  )
}

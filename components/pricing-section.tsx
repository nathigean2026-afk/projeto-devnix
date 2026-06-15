import { Check, Zap, Crown, Package } from "lucide-react"

const plans = [
  {
    icon: Package,
    name: "Starter",
    price: "Mensalidade",
    priceDetail: "valor combinado",
    desc: "Projetos pré-prontos adaptados ao seu banco de dados e identidade visual. Rápido e econômico.",
    features: [
      "Template escolhido por você",
      "Adaptação ao banco de dados",
      "Personalização de cores e logo",
      "Suporte técnico incluso",
      "Atualizações mensais",
      "Hospedagem orientada",
    ],
    cta: "Escolher plano",
    featured: false,
  },
  {
    icon: Zap,
    name: "Professional",
    price: "Sob consulta",
    priceDetail: "pagamento único",
    desc: "Site ou landing page do zero, design exclusivo e código original entregue. O mais escolhido.",
    features: [
      "Design exclusivo 100%",
      "Código original entregue",
      "SEO otimizado",
      "Responsivo — mobile-first",
      "30 dias de suporte pós-entrega",
      "Manutenção com preço combinado",
      "Domínio e hospedagem orientada",
    ],
    cta: "Escolher plano",
    featured: true,
  },
  {
    icon: Crown,
    name: "Enterprise",
    price: "Sob consulta",
    priceDetail: "por projeto",
    desc: "Sistemas, plataformas analíticas e software personalizado do zero ao deploy.",
    features: [
      "Análise do problema e proposta",
      "Arquitetura personalizada",
      "Painel administrativo incluso",
      "Integrações de APIs externas",
      "Banco de dados sob medida",
      "Documentação técnica completa",
      "Suporte contínuo negociado",
      "Código 100% do cliente",
    ],
    cta: "Solicitar orçamento",
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="precos" className="relative py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(74,222,128,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-green-400 tracking-[0.15em] uppercase mb-4">
            — Pacotes
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Os melhores preços do setor.
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Cada projeto é único. Orçamento personalizado sem compromisso.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border flex flex-col p-7 transition-all duration-300 ${
                  plan.featured
                    ? "border-green-400/35 bg-zinc-900 pricing-featured"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-400 text-black text-[11px] font-bold rounded-full whitespace-nowrap"
                    style={{ boxShadow: "0 0 20px rgba(74,222,128,0.45)" }}
                  >
                    Mais Escolhido
                  </div>
                )}

                <div
                  className={`size-11 rounded-xl flex items-center justify-center mb-5 border ${
                    plan.featured
                      ? "bg-green-400/10 border-green-400/30"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <Icon
                    className={`size-5 ${plan.featured ? "text-green-400" : "text-zinc-400"}`}
                  />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className={`text-xl font-black ${plan.featured ? "text-green-400" : "text-white"}`}
                    style={plan.featured ? { textShadow: "0 0 20px rgba(74,222,128,0.4)" } : {}}
                  >
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-600">{plan.priceDetail}</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">{plan.desc}</p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="size-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-zinc-400">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contato"
                  className={`flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    plan.featured
                      ? "bg-green-400 text-black hover:bg-green-300 glow-green"
                      : "border border-zinc-700 text-zinc-300 hover:border-green-400/30 hover:bg-green-400/[0.04] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">
          Todos os projetos incluem{" "}
          <span className="text-zinc-400">código original entregue</span> e opção de{" "}
          <span className="text-zinc-400">manutenção continuada</span>.
        </p>
      </div>
    </section>
  )
}

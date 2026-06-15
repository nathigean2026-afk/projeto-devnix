"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Zap, Crown, Package } from "lucide-react"

const plans = [
  {
    icon: Package,
    name: "Starter",
    price: "Mensalidade",
    priceDetail: "valor combinado",
    desc: "Templates premium adaptados ao seu banco de dados e identidade visual. Rápido e econômico.",
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
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="precos" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Pacotes</span>
        </motion.div>

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <motion.h2
            className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Investimento
            <br />
            <span style={{ opacity: 0.35 }}>transparente.</span>
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Orçamento personalizado sem compromisso. Cada projeto é único.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                className="relative rounded-2xl border flex flex-col p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: plan.featured ? "rgba(var(--foreground-rgb, 242,242,242), 0.2)" : "var(--border)",
                  background: plan.featured ? "var(--secondary)" : "var(--background)",
                }}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold rounded-full whitespace-nowrap label-sm"
                    style={{
                      background: "var(--foreground)",
                      color: "var(--background)",
                    }}
                  >
                    Mais Escolhido
                  </div>
                )}

                <div
                  className="size-11 rounded-xl border border-border flex items-center justify-center mb-5"
                  style={{ background: "var(--muted)" }}
                >
                  <Icon className="size-5 text-muted-foreground" />
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-black text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground opacity-60">{plan.priceDetail}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="size-3.5 text-foreground opacity-50 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contato"
                  className="flex items-center justify-center w-full py-3.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75"
                  style={
                    plan.featured
                      ? { background: "var(--foreground)", color: "var(--background)" }
                      : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }
                  }
                >
                  {plan.cta}
                </a>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          className="text-center text-xs text-muted-foreground opacity-50 mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.8 }}
        >
          Todos os projetos incluem{" "}
          <span className="opacity-100 text-foreground">código original entregue</span> e opção de{" "}
          <span className="opacity-100 text-foreground">manutenção continuada</span>.
        </motion.p>
      </div>
    </section>
  )
}

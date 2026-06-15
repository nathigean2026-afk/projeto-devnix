"use client"

import { motion } from "framer-motion"
import { Check, Zap, Crown, Package } from "lucide-react"

const plans = [
  {
    icon: Package,
    name: "Projeto Pré-pronto",
    price: "Mensalidade",
    priceDetail: "Valor combinado",
    desc: "Templates prontos adaptados ao seu banco de dados. Solução rápida e econômica.",
    features: [
      "Template selecionado por você",
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
    priceDetail: "Preço único",
    desc: "Site ou landing page construído do zero, com design único e código original entregue.",
    features: [
      "Design exclusivo 100%",
      "Código original entregue",
      "Domínio e hospedagem orientada",
      "SEO otimizado",
      "Responsivo (mobile-first)",
      "30 dias de suporte pós-entrega",
      "Manutenção com preço combinado",
    ],
    cta: "Solicitar orçamento",
    highlight: true,
  },
  {
    icon: Crown,
    name: "Software Completo",
    price: "Sob consulta",
    priceDetail: "Por projeto",
    desc: "Sistemas, plataformas analíticas e software personalizado de ponta a ponta.",
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
  const scrollToContact = () => {
    const el = document.getElementById("contato")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="precos" className="py-24 sm:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Planos e valores
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-5">
            Soluções para cada{" "}
            <span className="neon-text">necessidade</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Cada projeto é único. Entre em contato para receber um orçamento personalizado
            sem compromisso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300
                  ${plan.highlight
                    ? "border-primary/50 bg-primary/5 neon-glow scale-105"
                    : "border-border bg-card hover:border-primary/30"
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full neon-glow">
                    Mais escolhido
                  </div>
                )}

                <div className="mb-6">
                  <div className={`size-12 rounded-xl flex items-center justify-center mb-4
                    ${plan.highlight ? "bg-primary/20 border border-primary/40" : "bg-muted border border-border"}`}>
                    <Icon className={`size-6 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={`text-2xl font-bold ${plan.highlight ? "text-primary neon-text" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.priceDetail}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="size-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToContact}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95
                    ${plan.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90 neon-glow"
                      : "border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
                    }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          Todos os projetos incluem{" "}
          <span className="text-foreground">código original entregue ao cliente</span>
          {" "}e opção de{" "}
          <span className="text-foreground">manutenção continuada</span>.
        </motion.p>
      </div>
    </section>
  )
}

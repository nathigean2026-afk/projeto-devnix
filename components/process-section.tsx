"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageSquare, Code2, Rocket } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Consultoria",
    desc: "Entendemos o problema, objetivos e orçamento. Sem compromisso — a solução certa começa por aqui.",
  },
  {
    num: "02",
    icon: Code2,
    title: "Desenvolvimento",
    desc: "Construção focada com atualizações constantes. Você acompanha cada etapa e pode solicitar ajustes.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Lançamento",
    desc: "O projeto vai ao ar, o código é seu. Suporte pós-entrega e manutenção conforme combinado.",
  },
]

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="processo" ref={ref} className="relative py-32 overflow-hidden">
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
          <span className="label-sm text-muted-foreground">Como Funciona</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-editorial text-[clamp(34px,5.5vw,68px)] text-foreground leading-none mb-16 max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          Simples,
          <br />
          <span style={{ opacity: 0.35 }}>transparente,</span>
          <br />
          eficiente.
        </motion.h2>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-8 left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px pointer-events-none opacity-20"
            style={{ background: "var(--foreground)" }}
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                className="relative flex flex-col items-start md:items-center md:text-center gap-6 px-0 md:px-8 pb-12 md:pb-0"
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Vertical line (mobile) */}
                {i < 2 && (
                  <div
                    className="md:hidden absolute left-7 top-[72px] bottom-0 w-px opacity-15"
                    style={{ background: "var(--foreground)" }}
                  />
                )}

                {/* Circle */}
                <div
                  className="relative size-16 rounded-2xl border border-border bg-secondary flex flex-col items-center justify-center gap-0.5 flex-shrink-0 z-10"
                >
                  <Icon className="size-5 text-foreground opacity-70" />
                  <span className="label-sm text-muted-foreground" style={{ fontSize: "8px" }}>
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 flex items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a
            href="#contato"
            className="flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 hover:scale-95"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Iniciar Meu Projeto
          </a>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Quanto tempo leva para fazer um site?",
    a: "Depende da complexidade. Uma landing page simples fica pronta em 3–5 dias úteis. Um site institucional completo leva de 1 a 3 semanas. Sistemas e plataformas personalizadas têm prazo acordado na proposta — sempre com cronograma claro e atualizações frequentes.",
  },
  {
    q: "Você fornece hospedagem e domínio?",
    a: "Não ofereço hospedagem diretamente, mas oriento e configuro tudo para você. Indico as melhores opções de acordo com o projeto (Vercel, Railway, VPS própria) e faço o deploy completo. O domínio é registrado no seu nome — tudo é seu.",
  },
  {
    q: "O código-fonte realmente fica comigo?",
    a: "Sim, sempre. Todos os projetos são entregues com o repositório Git completo. Sem licenças de uso, sem amarrações. Você pode hospedar, modificar e contratar qualquer outro desenvolvedor para continuar — sem restrições.",
  },
  {
    q: "O que são os projetos pré-prontos?",
    a: "São templates funcionais que eu adapto ao seu banco de dados, marca e necessidades. São cobrados via mensalidade e ideais para quem quer uma solução rápida e econômica. Mesmo assim, você recebe uma versão personalizada — não um template genérico.",
  },
  {
    q: "Como funciona a manutenção após a entrega?",
    a: "Ofereço planos de manutenção com preço combinado previamente — sem surpresas. Cobre correções de bugs, atualizações de segurança, melhorias e suporte técnico. O valor varia de acordo com o volume de trabalho esperado.",
  },
  {
    q: "Você trabalha com projetos pequenos também?",
    a: "Sim! Atendo desde uma landing page de uma página até grandes plataformas. Todo projeto recebe o mesmo cuidado. Se você tiver um orçamento limitado, podemos encontrar juntos a solução mais adequada.",
  },
  {
    q: "Como é feito o pagamento?",
    a: "Para projetos únicos, cobro 50% no início e 50% na entrega. Para mensalidades (projetos pré-prontos ou manutenção), a cobrança é mensal. Aceito PIX, transferência bancária e outros meios conforme combinado.",
  },
]

export function FaqSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="faq" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">FAQ</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          Perguntas
          <br />
          <span style={{ opacity: 0.35 }}>frequentes.</span>
        </motion.h2>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Accordion className="w-full flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-background px-5 overflow-hidden data-[state=open]:bg-secondary transition-colors duration-200"
              >
                <AccordionTrigger className="py-5 text-sm font-semibold text-foreground text-left hover:no-underline hover:text-muted-foreground transition-colors duration-200">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm text-muted-foreground leading-relaxed border-l-2 border-foreground/10 pl-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA box */}
        <motion.div
          className="mt-12 rounded-2xl border border-border p-8 flex flex-col items-center text-center"
          style={{ background: "var(--secondary)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="font-bold text-foreground mb-1.5">Ainda tem dúvidas?</p>
          <p className="text-sm text-muted-foreground mb-6">
            Entre em contato diretamente — respondo em até 24 horas.
          </p>
          <a
            href="#contato"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Falar Agora
          </a>
        </motion.div>
      </div>
    </section>
  )
}

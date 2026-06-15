"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Quanto tempo leva para fazer um site?",
    a: "Depende da complexidade. Uma landing page simples fica pronta em 3–5 dias úteis. Um site institucional completo leva de 1 a 3 semanas. Sistemas e plataformas personalizadas têm prazo acordado na proposta. Sempre com cronograma claro e atualizações frequentes.",
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
    a: "Ofereço planos de manutenção com preço combinado previamente — sem surpresas. Cobre correções de bugs, atualizações de segurança, pequenas melhorias e suporte técnico. O valor varia de acordo com o volume de trabalho esperado.",
  },
  {
    q: "Você trabalha com projetos pequenos também?",
    a: "Sim! Atendo desde uma landing page de uma página até grandes plataformas. Todo projeto recebe o mesmo cuidado. Se você tiver um orçamento limitado, podemos encontrar juntos a solução mais adequada para o seu caso.",
  },
  {
    q: "Como é feito o pagamento?",
    a: "Para projetos únicos, cobro 50% no início e 50% na entrega. Para mensalidades (projetos pré-prontos ou manutenção), a cobrança é mensal. Aceito PIX, transferência bancária e outros meios conforme combinado.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="relative py-28">
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(74,222,128,0.12), transparent)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-green-400 tracking-[0.15em] uppercase mb-4">
            — FAQ
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            Respostas para as perguntas{" "}
            <span className="text-green-400">mais frequentes</span>.
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 overflow-hidden data-[state=open]:border-green-400/25 transition-colors duration-200"
            >
              <AccordionTrigger className="py-5 text-sm font-semibold text-white hover:text-green-400 transition-colors duration-200 text-left [&>svg]:text-zinc-500 [&[data-state=open]>svg]:text-green-400 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm text-zinc-400 leading-relaxed border-l-2 border-green-400/40 pl-4 ml-0.5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA below */}
        <div className="mt-12 text-center glass rounded-2xl border border-white/[0.06] p-8">
          <p className="text-white font-semibold mb-1.5">Ainda tem dúvidas?</p>
          <p className="text-zinc-500 text-sm mb-5">
            Entre em contato diretamente — respondo em até 24 horas.
          </p>
          <a
            href="#contato"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-400 text-black text-sm font-bold hover:bg-green-300 transition-all duration-200 glow-green"
          >
            Falar agora
          </a>
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Andrade",
    role: "CEO, Andrade Imóveis",
    avatar: "CA",
    content:
      "Profissional incrível. Entregou o portal imobiliário no prazo, com todas as funcionalidades que pedimos e ainda sugeriu melhorias que não tínhamos pensado. O código nos foi entregue completo.",
    stars: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Empreendedora Digital",
    avatar: "FL",
    content:
      "Precisava de uma landing page de alta conversão para o lançamento do meu curso. O resultado superou todas as expectativas. As animações ficaram perfeitas e as vendas explodiram no lançamento.",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Diretor, LogisTech",
    avatar: "RS",
    content:
      "Desenvolveu um sistema de gestão completo para nossa empresa. O diferencial foi a análise que ele fez do nosso problema antes de propor a solução. Parece que nos conhece há anos.",
    stars: 5,
  },
  {
    name: "Mariana Costa",
    role: "Fundadora, Studio MC",
    avatar: "MC",
    content:
      "Contratei o projeto pré-pronto adaptado. Foi rápido, econômico e o resultado ficou exatamente como precisávamos. O suporte pós-entrega também é excelente.",
    stars: 5,
  },
  {
    name: "Pedro Martins",
    role: "Tech Lead, StartupX",
    avatar: "PM",
    content:
      "Criou nossa plataforma analítica com dashboards em tempo real. A arquitetura é sólida, o código é limpo e a documentação é completa. Recomendo sem hesitar.",
    stars: 5,
  },
  {
    name: "Ana Paula Ribeiro",
    role: "Blogueira & Criadora",
    avatar: "AP",
    content:
      "Meu blog ficou lindo e super rápido. O SEO já começou a dar resultados no primeiro mês. Adoro que posso mexer no conteúdo sozinha pelo painel que ele criou.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Depoimentos
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-5">
            O que os clientes{" "}
            <span className="neon-text">dizem</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Resultados reais de projetos entregues com qualidade e transparência.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="size-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="size-4 text-primary fill-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{t.avatar}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/0 group-hover:bg-primary/30 rounded-b-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

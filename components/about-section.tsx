"use client"

import { motion } from "framer-motion"
import { Code2, Clock, Shield, Lightbulb, Package, HeartHandshake } from "lucide-react"

const differentials = [
  {
    icon: Code2,
    title: "Código 100% seu",
    desc: "Todo projeto entregue com o código-fonte original. Você tem total controle e propriedade do que foi desenvolvido.",
  },
  {
    icon: Shield,
    title: "Domínio total do projeto",
    desc: "Nada de dependência de terceiros. Você recebe o projeto completo para hospedar onde quiser.",
  },
  {
    icon: Lightbulb,
    title: "Foco no seu problema",
    desc: "Analiso sua necessidade real antes de propor qualquer solução. O objetivo é resolver, não só entregar.",
  },
  {
    icon: Clock,
    title: "Manutenção por contrato",
    desc: "Manutenção e atualizações com preço combinado previamente, sem surpresas na nota.",
  },
  {
    icon: Package,
    title: "Templates pré-prontos",
    desc: "Projetos prontos que adapto ao seu banco de dados e identidade visual. Mais rápido e acessível.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte humanizado",
    desc: "Comunicação direta comigo, sem intermediários. Você sabe exatamente o que está acontecendo no seu projeto.",
  },
]

const stats = [
  { value: "3+", label: "Anos de experiência" },
  { value: "50+", label: "Projetos entregues" },
  { value: "100%", label: "Código entregue" },
  { value: "24h", label: "Resposta garantida" },
]

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 sm:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* About intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              Sobre mim
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-6">
              Desenvolvedor que{" "}
              <span className="neon-text">resolve problemas</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5 text-pretty">
              Sou desenvolvedor web full-stack com foco em criar soluções digitais que realmente funcionam.
              Não entrego apenas código — entrego{" "}
              <span className="text-foreground font-medium">autonomia total ao cliente</span>.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5 text-pretty">
              Atuo em projetos desde sites simples e landing pages até plataformas analíticas e sistemas
              empresariais completos. Cada projeto começa com uma conversa: você me conta o problema,
              eu proponho a solução mais adequada.
            </p>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Acredito que o cliente deve ter{" "}
              <span className="text-foreground font-medium">total domínio do que foi construído</span>.
              Por isso, todos os projetos incluem o código original — sem amarrações ou dependência.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Python", "Tailwind CSS", "API REST"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-muted border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 text-center hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="text-4xl font-bold neon-text mb-2 group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Differentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Por que me escolher
          </p>
          <h3 className="text-3xl sm:text-4xl font-bold text-balance">
            Diferenciais que fazem a{" "}
            <span className="neon-text">diferença</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentials.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/3 transition-all duration-300"
              >
                <div className="size-10 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300">
                  <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1.5">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

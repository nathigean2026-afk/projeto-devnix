"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import {
  Code2,
  Clock,
  Shield,
  Lightbulb,
  Package,
  HeartHandshake,
  ArrowRight,
  Target,
  Eye,
  Sparkles,
  Users,
  Globe,
  Zap,
} from "lucide-react"

const stats = [
  { value: "3+", label: "Anos de experiência" },
  { value: "50+", label: "Projetos entregues" },
  { value: "100%", label: "Código do cliente" },
  { value: "24h", label: "Resposta garantida" },
]

const values = [
  {
    icon: Code2,
    title: "Código 100% seu",
    desc: "Todo projeto é entregue com código-fonte original. Você tem total controle e propriedade sobre o que foi construído.",
  },
  {
    icon: Shield,
    title: "Autonomia total",
    desc: "Sem dependência de terceiros. Você hospeda onde quiser, contrata quem quiser para continuar, sem restrições.",
  },
  {
    icon: Lightbulb,
    title: "Foco no problema real",
    desc: "Analisamos sua necessidade antes de propor qualquer solução. O objetivo é resolver, não apenas entregar.",
  },
  {
    icon: Clock,
    title: "Transparência nos prazos",
    desc: "Cronograma claro desde o início, com atualizações frequentes. Você acompanha cada etapa do desenvolvimento.",
  },
  {
    icon: Package,
    title: "Soluções sob medida",
    desc: "Cada projeto é único. Não trabalhamos com fórmulas genéricas — construímos exatamente o que o seu negócio precisa.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte direto",
    desc: "Comunicação direta, sem intermediários. Você sabe exatamente o que está acontecendo com o seu projeto.",
  },
]

const pillars = [
  {
    icon: Target,
    title: "Nossa Missão",
    desc: "Elevar negócios por meio da tecnologia, entregando soluções digitais inteligentes que pertencem ao cliente — com código original, prazos claros e suporte real.",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
  },
  {
    icon: Eye,
    title: "Nossa Visão",
    desc: "Ser referência em desenvolvimento web personalizado no Brasil, reconhecidos pela qualidade técnica, transparência e pelo compromisso genuíno com o sucesso de cada cliente.",
    color: "from-purple-500/10 to-transparent",
    border: "border-purple-500/20",
  },
  {
    icon: Sparkles,
    title: "Nossos Valores",
    desc: "Honestidade, qualidade técnica, autonomia do cliente, comunicação clara e melhoria contínua. Cada decisão que tomamos é guiada por esses princípios.",
    color: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20",
  },
]

const techs = [
  "Next.js", "React", "TypeScript", "Node.js",
  "PostgreSQL", "Python", "Tailwind CSS", "REST APIs",
  "Docker", "Vercel", "AWS", "Git",
]

const services = [
  { icon: Globe, label: "Sites e Portais" },
  { icon: Code2, label: "Software Personalizado" },
  { icon: Zap, label: "Landing Pages" },
  { icon: Users, label: "Plataformas Analíticas" },
]

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function QuemSomosContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = resolvedTheme === "dark"

  return (
    <main className="relative overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />

        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Label */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-8 bg-foreground opacity-30" />
            <span className="label-sm text-muted-foreground">Quem Somos</span>
            <div className="h-px w-8 bg-foreground opacity-30" />
          </motion.div>

          <motion.h1
            className="text-display text-foreground mb-6"
            style={{ fontSize: "clamp(48px,8vw,100px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Tecnologia que
            <br />
            <span style={{ opacity: 0.35 }}>eleva negócios.</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            A Elevanthe nasceu da crença de que toda empresa merece soluções digitais de alto nível,
            construídas com cuidado, entregues com transparência e pertencentes ao cliente.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/#contato"
              className="group flex items-center gap-3 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              Falar Conosco
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#servicos"
              className="flex items-center gap-3 px-7 py-4 rounded-full border border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
            >
              Nossos Serviços
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LOGO + IDENTIDADE ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div
              className="rounded-2xl border border-border p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16"
              style={{ background: "var(--secondary)" }}
            >
              {/* Mascote */}
              <div className="flex-shrink-0">
                <div
                  className="size-40 md:size-52 rounded-2xl flex items-center justify-center border border-border"
                  style={{ background: "var(--background)" }}
                >
                  <Image
                    src={mounted ? (isDark ? "/logo-icon-light.png" : "/logo-icon-dark.png") : "/logo-icon-dark.png"}
                    alt="Mascote Elevanthe — elefante tecnológico"
                    width={160}
                    height={160}
                    className="object-contain transition-all duration-300"
                    style={{ maxWidth: "80%", maxHeight: "80%" }}
                  />
                </div>
              </div>

              {/* Texto */}
              <div>
                <p className="section-label mb-4" style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                  Nossa Identidade
                </p>
                <h2
                  className="text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  O elefante que nunca esquece
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  O mascote da Elevanthe é um elefante com circuitos tecnológicos — símbolo de força,
                  memória e inteligência. Assim como o elefante nunca esquece, a Elevanthe não esquece
                  nenhum detalhe do seu projeto.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O nome <span className="text-foreground font-medium">Elevanthe</span> une
                  {" "}<span className="text-foreground font-medium">&quot;elevar&quot;</span> e{" "}
                  <span className="text-foreground font-medium">&quot;elephant&quot;</span> — eleva negócios
                  com a solidez e a memória de um elefante. Uma marca criada para durar.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border"
              style={{ background: "var(--border)" }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-background px-6 py-10 flex flex-col items-center justify-center gap-2 text-center hover:bg-secondary transition-colors duration-300 group"
                >
                  <span
                    className="text-4xl font-black text-foreground leading-none"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight text-center">{s.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── MISSÃO / VISÃO / VALORES ──────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-14">
            <p className="label-sm text-muted-foreground mb-4">Fundamentos</p>
            <h2
              className="text-3xl md:text-4xl font-black text-foreground"
              style={{ letterSpacing: "-0.03em" }}
            >
              O que nos move
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p, i) => {
              const Icon = p.icon
              return (
                <FadeIn key={p.title} delay={i * 0.12}>
                  <div
                    className={`rounded-2xl border ${p.border} p-7 flex flex-col gap-5 h-full`}
                    style={{ background: "var(--secondary)" }}
                  >
                    <div
                      className="size-11 rounded-xl border border-border flex items-center justify-center"
                      style={{ background: "var(--background)" }}
                    >
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground mb-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HISTÓRIA ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeIn>
              <p className="label-sm text-muted-foreground mb-4">Nossa História</p>
              <h2
                className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight"
                style={{ letterSpacing: "-0.03em" }}
              >
                Como a Elevanthe
                <br />
                <span style={{ opacity: 0.4 }}>chegou até aqui</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                A Elevanthe surgiu da experiência acumulada em mais de três anos de projetos web,
                com clientes dos mais variados setores. Percebemos que a maioria das empresas
                enfrentava o mesmo problema: dependência de ferramentas terceiras, código que não
                pertencia a elas e suporte inexistente após a entrega.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Criamos a Elevanthe para mudar esse cenário. Nossa abordagem é simples:{" "}
                <span className="text-foreground font-medium">
                  entendemos o seu problema antes de propor qualquer solução
                </span>
                , construímos com qualidade técnica e entregamos tudo com código original.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hoje, atendemos empresas de diferentes tamanhos — desde empreendedores individuais
                até organizações com equipes de dezenas de pessoas. O que não muda é o compromisso
                com a{" "}
                <span className="text-foreground font-medium">autonomia e o sucesso do cliente</span>.
              </p>
            </FadeIn>

            {/* Serviços em destaque */}
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => {
                  const Icon = s.icon
                  return (
                    <div
                      key={s.label}
                      className="rounded-xl border border-border p-5 flex items-center gap-4 hover:bg-secondary transition-colors duration-200"
                      style={{ background: "var(--background)" }}
                    >
                      <div
                        className="size-10 rounded-lg border border-border flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--secondary)" }}
                      >
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Stack tecnológico */}
              <div className="mt-6">
                <p className="label-sm text-muted-foreground mb-3">Stack tecnológico</p>
                <div className="flex flex-wrap gap-2">
                  {techs.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 text-[11px] font-mono rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200 cursor-default"
                      style={{ background: "var(--secondary)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-14">
            <p className="label-sm text-muted-foreground mb-4">Por que a Elevanthe</p>
            <h2
              className="text-3xl md:text-4xl font-black text-foreground"
              style={{ letterSpacing: "-0.03em" }}
            >
              Diferenciais que fazem a{" "}
              <span style={{ opacity: 0.4 }}>diferença</span>
            </h2>
          </FadeIn>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-border"
            style={{ gap: "1px", background: "var(--border)" }}
          >
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="group bg-background p-7 flex gap-5 hover:bg-secondary transition-colors duration-300 relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className="size-9 rounded-xl border border-border flex items-center justify-center flex-shrink-0 group-hover:border-foreground/20 transition-all duration-300 mt-0.5"
                    style={{ background: "var(--secondary)" }}
                  >
                    <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-foreground mb-1.5">{v.title}</h4>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-20 px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div
              className="rounded-2xl border border-border p-10 md:p-14 text-center"
              style={{ background: "var(--secondary)" }}
            >
              <p className="label-sm text-muted-foreground mb-4">Vamos começar</p>
              <h2
                className="text-3xl md:text-4xl font-black text-foreground mb-5 leading-tight"
                style={{ letterSpacing: "-0.03em" }}
              >
                Pronto para elevar
                <br />
                <span style={{ opacity: 0.4 }}>o seu negócio?</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
                Entre em contato e receba uma proposta personalizada sem compromisso em até 24 horas.
                A conversa é gratuita — e pode ser o início de algo grande.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/#contato"
                  className="group flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}
                >
                  Iniciar Projeto
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/projetos"
                  className="flex items-center gap-3 px-8 py-4 rounded-full border border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
                >
                  Ver Portfólio
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  )
}

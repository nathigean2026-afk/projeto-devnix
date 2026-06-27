"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import {
  Check, Users, FileText, BarChart3, Wrench, DollarSign,
  Shield, Zap, CalendarDays, CalendarRange, ArrowRight,
  Star, ChevronRight, Play, X,
} from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const CRM_URL = "https://v0-crm-devnix.vercel.app/demo"

const screenshots = [
  { id: "dashboard", label: "Dashboard", src: "/crm-screenshot-dashboard.png", desc: "Visao geral do negocio em tempo real" },
  { id: "clientes", label: "Clientes", src: "/crm-screenshot-clientes.png", desc: "Gestao completa da sua base de clientes" },
  { id: "os", label: "Ordens de Servico", src: "/crm-screenshot-os.png", desc: "Acompanhamento de todas as OS em aberto" },
  { id: "financeiro", label: "Financeiro", src: "/crm-screenshot-financeiro.png", desc: "Controle de receitas, despesas e saldo" },
]

const features = [
  { icon: Users, title: "Gestao de Clientes", desc: "Cadastre e organize todos os seus clientes com historico completo, contatos e status de relacionamento." },
  { icon: Wrench, title: "Ordens de Servico", desc: "Crie, acompanhe e finalize ordens de servico com controle de status em tempo real." },
  { icon: FileText, title: "Orcamentos Profissionais", desc: "Gere orcamentos detalhados com itens, valores e envie diretamente para seus clientes." },
  { icon: DollarSign, title: "Controle Financeiro", desc: "Acompanhe receitas, despesas e lucro do seu negocio com visao clara do fluxo de caixa." },
  { icon: BarChart3, title: "Relatorios e Metricas", desc: "Dashboards com graficos e indicadores para voce tomar decisoes baseadas em dados reais." },
  { icon: Shield, title: "Dados Seguros", desc: "Banco de dados seguro com acesso protegido por autenticacao. Seus dados sempre disponiveis." },
]

const plans = [
  {
    id: "start", icon: Zap, label: "Start", duration: "7 dias", price: "R$ 7", priceDetail: "por 7 dias",
    desc: "Ideal para conhecer a plataforma sem compromisso.", featured: false,
    features: ["Acesso completo por 7 dias", "Clientes ilimitados", "Ordens de servico ilimitadas", "Orcamentos e financeiro", "Suporte por email"],
  },
  {
    id: "business", icon: CalendarDays, label: "Business", duration: "30 dias", price: "R$ 24", priceDetail: "por mes",
    desc: "Para profissionais que precisam de controle mensal.", featured: true,
    features: ["Acesso completo por 30 dias", "Clientes ilimitados", "Ordens de servico ilimitadas", "Orcamentos e financeiro", "Relatorios completos", "Suporte prioritario"],
  },
  {
    id: "enterprise", icon: CalendarRange, label: "Enterprise", duration: "1 ano", price: "R$ 260", priceDetail: "por ano",
    desc: "Melhor custo-beneficio para uso continuo.", featured: false,
    features: ["Acesso completo por 12 meses", "Clientes ilimitados", "Ordens de servico ilimitadas", "Orcamentos e financeiro", "Relatorios completos", "Suporte VIP"],
  },
]

const stats = [
  { value: "100%", label: "Online" },
  { value: "3", label: "Planos acessiveis" },
  { value: "24h", label: "Acesso instantaneo" },
  { value: "R$ 7", label: "Para comecar" },
]

export default function CrmPlusPage() {
  const [activeShot, setActiveShot] = useState(0)
  const [videoOpen, setVideoOpen] = useState(false)

  const videoRef = useRef<HTMLElement>(null)
  const screenshotRef = useRef<HTMLElement>(null)
  const featRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  const bannerRef = useRef<HTMLElement>(null)

  const videoInView = useInView(videoRef, { once: true, margin: "-80px" })
  const screenshotInView = useInView(screenshotRef, { once: true, margin: "-80px" })
  const featInView = useInView(featRef, { once: true, margin: "-80px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-80px" })
  const bannerInView = useInView(bannerRef, { once: true, margin: "-80px" })

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, rgba(99,102,241,1) 0%, transparent 70%)" }} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border mb-8 text-xs font-semibold tracking-widest uppercase text-muted-foreground"
              style={{ background: "var(--secondary)" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
              Produto Elevanthe — CRM Plus
            </motion.div>
            <motion.h1
              className="text-display text-[clamp(52px,10vw,120px)] text-foreground mb-6 text-balance"
              initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Seu negocio,<br /><span className="text-muted-foreground">organizado.</span>
            </motion.h1>
            <motion.p
              className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            >
              CRM completo para prestadores de servico. Gerencie clientes, ordens de servico,
              orcamentos e financeiro em um so lugar, acessivel de qualquer dispositivo.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            >
              <a href={`${CRM_URL}/planos`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80 hover:scale-95"
                style={{ background: "var(--foreground)", color: "var(--background)" }}>
                Comecar agora <ArrowRight className="size-3.5" />
              </a>
              <a href="https://v0-crm-devnix.vercel.app/demo"
                className="flex items-center gap-3 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300">
                <span className="size-6 rounded-full border border-border flex items-center justify-center">
                  <Play className="size-2.5 fill-current ml-0.5" />
                </span>
                Ver demonstracao
              </a>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-16 border-t border-border"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-editorial text-3xl text-foreground">{s.value}</span>
                  <span className="text-xs text-muted-foreground text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── VIDEO ─── */}
        <section ref={videoRef} className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -16 }} animate={videoInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <div className="h-px w-8 bg-foreground opacity-30" />
              <span className="label-sm text-muted-foreground">Demonstracao</span>
            </motion.div>
            <motion.h2
              className="text-editorial text-[clamp(32px,5vw,60px)] text-foreground leading-none mb-12"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={videoInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Veja como funciona<br /><span className="text-muted-foreground">na pratica.</span>
            </motion.h2>
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-border cursor-pointer group"
              style={{ background: "var(--secondary)" }}
              initial={{ opacity: 0, y: 32 }}
              animate={videoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setVideoOpen(true)}
            >
              {/* Thumbnail com overlay */}
              <div className="relative aspect-video w-full">
                <Image
                  src="/crm-screenshot-dashboard.png"
                  alt="Video demonstracao Elevanthe CRM Plus"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,8,0.8))" }} />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-20 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    <Play className="size-8 text-white fill-white ml-1" />
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm bg-black/40 text-xs text-white font-semibold tracking-wider">
                    Assistir demonstracao — 2 min
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── SCREENSHOTS ─── */}
        <section ref={screenshotRef} className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -16 }} animate={screenshotInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <div className="h-px w-8 bg-foreground opacity-30" />
              <span className="label-sm text-muted-foreground">Plataforma</span>
            </motion.div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <motion.h2
                className="text-editorial text-[clamp(32px,5vw,60px)] text-foreground leading-none"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={screenshotInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Interface simples,<br /><span className="text-muted-foreground">resultados reais.</span>
              </motion.h2>
              <motion.p className="text-sm text-muted-foreground max-w-xs leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={screenshotInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 }}>
                Cada tela foi pensada para ser intuitiva. Zero treinamento necessario para comecar.
              </motion.p>
            </div>

            {/* Tabs */}
            <motion.div className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 12 }} animate={screenshotInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
              {screenshots.map((s, i) => (
                <button key={s.id} onClick={() => setActiveShot(i)}
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200"
                  style={activeShot === i
                    ? { background: "var(--foreground)", color: "var(--background)" }
                    : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                  {s.label}
                </button>
              ))}
            </motion.div>

            {/* Screenshot display */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={screenshotInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <div className="relative rounded-2xl overflow-hidden border border-border" style={{ background: "var(--secondary)" }}>
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                  <div className="flex gap-1.5">
                    <span className="size-3 rounded-full bg-red-500/50" />
                    <span className="size-3 rounded-full bg-yellow-500/50" />
                    <span className="size-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-6 max-w-xs mx-auto rounded-md flex items-center justify-center px-3 border border-border" style={{ background: "var(--muted)" }}>
                      <span className="text-[10px] text-muted-foreground font-mono">v0-crm-devnix.vercel.app</span>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-[16/9] w-full">
                  {screenshots.map((s, i) => (
                    <motion.div key={s.id} className="absolute inset-0"
                      initial={false}
                      animate={{ opacity: activeShot === i ? 1 : 0 }}
                      transition={{ duration: 0.35 }}>
                      <Image src={s.src} alt={s.label} fill className="object-cover object-top" />
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Caption */}
              <div className="mt-4 flex items-center justify-between px-1">
                <p className="text-xs text-muted-foreground">{screenshots[activeShot].desc}</p>
                <div className="flex gap-1.5">
                  {screenshots.map((_, i) => (
                    <button key={i} onClick={() => setActiveShot(i)}
                      className="size-1.5 rounded-full transition-all duration-200"
                      style={{ background: activeShot === i ? "var(--foreground)" : "var(--border)" }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section ref={featRef} className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -16 }} animate={featInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <div className="h-px w-8 bg-foreground opacity-30" />
              <span className="label-sm text-muted-foreground">Funcionalidades</span>
            </motion.div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <motion.h2 className="text-editorial text-[clamp(32px,5vw,60px)] text-foreground leading-none"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={featInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                Tudo que voce<br /><span className="text-muted-foreground">precisa.</span>
              </motion.h2>
              <motion.p className="text-sm text-muted-foreground max-w-xs leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={featInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 }}>
                Uma plataforma completa pensada para quem presta servicos e precisa de controle real do negocio.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.title}
                    className="service-card rounded-2xl border border-border p-7 dark-card-border"
                    style={{ background: "var(--card)" }}
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                    animate={featInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="size-11 rounded-xl border border-border flex items-center justify-center mb-5" style={{ background: "var(--muted)" }}>
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section ref={pricingRef} className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -16 }} animate={pricingInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <div className="h-px w-8 bg-foreground opacity-30" />
              <span className="label-sm text-muted-foreground">Planos</span>
            </motion.div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <motion.h2 className="text-editorial text-[clamp(32px,5vw,60px)] text-foreground leading-none"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={pricingInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                Precos que<br /><span className="text-muted-foreground">cabem no bolso.</span>
              </motion.h2>
              <motion.p className="text-sm text-muted-foreground max-w-xs leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 }}>
                Pagamento unico via Cartao ou Pix. Ativacao automatica apos confirmacao.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan, i) => {
                const Icon = plan.icon
                return (
                  <motion.div key={plan.id}
                    className={`neon-card rounded-2xl flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 relative ${plan.featured ? "neon-card-featured neon-card-secondary" : ""}`}
                    initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(8px)" }}
                    animate={pricingInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.85, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}>
                    {plan.featured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold rounded-full whitespace-nowrap label-sm"
                        style={{ background: "var(--foreground)", color: "var(--background)" }}>
                        Mais Popular
                      </div>
                    )}
                    <div className="size-11 rounded-xl border border-border flex items-center justify-center mb-5" style={{ background: "var(--muted)" }}>
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">Plano {plan.label}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-black text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground opacity-60">{plan.priceDetail}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{plan.duration} de acesso</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>
                    <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="size-3.5 text-foreground opacity-50 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={`${CRM_URL}/planos`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75"
                      style={plan.featured
                        ? { background: "var(--foreground)", color: "var(--background)" }
                        : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                      Assinar {plan.label} <ChevronRight className="size-3" />
                    </a>
                  </motion.div>
                )
              })}
            </div>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 text-xs text-muted-foreground"
              initial={{ opacity: 0 }} animate={pricingInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
              <div className="flex items-center gap-2"><Shield className="size-3.5" />Pagamento seguro via Stripe e Mercado Pago</div>
              <span className="hidden sm:block opacity-30">·</span>
              <div className="flex items-center gap-2"><Zap className="size-3.5" />Ativacao automatica apos pagamento</div>
            </motion.div>
          </div>
        </section>

        {/* ─── BANNER CTA ─── */}
        <section ref={bannerRef} className="py-20 px-6">
          <motion.div
            className="max-w-4xl mx-auto rounded-2xl border border-border p-10 text-center relative overflow-hidden"
            style={{ background: "var(--secondary)" }}
            initial={{ opacity: 0, y: 32 }} animate={bannerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (<Star key={i} className="size-4 text-foreground opacity-60 fill-current" />))}
              </div>
              <blockquote className="text-editorial text-[clamp(22px,4vw,40px)] text-foreground leading-tight mb-6 text-balance">
                &ldquo;Organizei toda a minha assistencia tecnica em menos de um dia. Vale cada centavo.&rdquo;
              </blockquote>
              <p className="text-xs text-muted-foreground mb-8">Cliente Elevanthe CRM Plus</p>
              <a href={`${CRM_URL}/planos`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                style={{ background: "var(--foreground)", color: "var(--background)" }}>
                Comece agora por R$ 7 <ArrowRight className="size-3.5" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />

      {/* ─── VIDEO LIGHTBOX ─── */}
      {videoOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setVideoOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-border"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 size-9 rounded-full border border-white/10 bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
              <X className="size-4 text-white" />
            </button>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <p className="text-sm text-white/40 text-center px-8">
                Adicione aqui o link do seu video de demonstracao.<br />
                <span className="text-xs opacity-60">Substitua este placeholder pelo componente de video (YouTube, Vimeo ou &lt;video&gt; nativo).</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

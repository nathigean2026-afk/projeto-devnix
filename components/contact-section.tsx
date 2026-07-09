"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import {
  Send, Mail, CheckCircle, Loader2,
  Phone, MessageSquare, Calendar, Clock, User, ChevronRight,
} from "lucide-react"
import { submitLead } from "@/app/actions/leads"
import { ArrowUpRight } from "lucide-react"

// ── Quick channels ──────────────────────────────────────
const CHANNELS = [
  {
    label: "WhatsApp",
    value: "Conversar agora",
    badge: "Resposta rápida",
    badgeColor: "#25D366",
    href: "https://wa.me/5587988219342?text=" + encodeURIComponent("Olá! Vim pelo site da Elevanthe e gostaria de conversar."),
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" style={{ color: "#25D366" }} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "E-mail",
    value: "contato@elevanthe.com",
    badge: null,
    badgeColor: null,
    href: "mailto:contato@elevanthe.com",
    icon: <Mail className="size-5" />,
  },
  {
    label: "Instagram",
    value: "@elevanthedev",
    badge: null,
    badgeColor: null,
    href: "https://instagram.com/elevanthedev",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
]

const TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

function getNextWeekdays(count: number) {
  const days: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (days.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d))
  }
  return days
}

const PT_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const PT_MONTH = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

type FormData = { name: string; email: string; phone: string; whatsapp: string; subject: string; message: string; plan: string }
type ScheduleData = { name: string; email: string; whatsapp: string; date: Date | null; time: string }
type TabType = "message" | "schedule"

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const [activeTab, setActiveTab] = useState<TabType>("message")
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "" })
  const [msgStatus, setMsgStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const weekdays = getNextWeekdays(14)
  const [sched, setSched] = useState<ScheduleData>({ name: "", email: "", whatsapp: "", date: null, time: "" })
  const [schedStatus, setSchedStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Turnstile
  const [tsToken, setTsToken] = useState<string | null>(null)
  const tsContainerRef = useRef<HTMLDivElement>(null)
  const tsWidgetId = useRef<string | null>(null)

  const renderTurnstile = useCallback(() => {
    if (!SITE_KEY || !tsContainerRef.current) return
    if (typeof window === "undefined" || !(window as any).turnstile) return
    if (tsWidgetId.current) return
    tsWidgetId.current = (window as any).turnstile.render(tsContainerRef.current, {
      sitekey: SITE_KEY,
      callback: (token: string) => setTsToken(token),
      "expired-callback": () => setTsToken(null),
      "error-callback": () => setTsToken(null),
      theme: "dark",
      size: "normal",
    })
  }, [])

  useEffect(() => {
    if (!SITE_KEY) return
    if ((window as any).turnstile) { renderTurnstile(); return }
    const existing = document.querySelector('script[src*="turnstile"]')
    if (existing) { existing.addEventListener("load", renderTurnstile); return }
    const s = document.createElement("script")
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    s.async = true
    s.defer = true
    s.onload = renderTurnstile
    document.head.appendChild(s)
    return () => { s.onload = null }
  }, [renderTurnstile])

  useEffect(() => {
    const handler = (e: CustomEvent<{ plan: string; subject: string }>) => {
      setForm(prev => ({ ...prev, plan: e.detail.plan, subject: e.detail.subject }))
      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    window.addEventListener("elevanthe:plan-selected" as never, handler as EventListener)
    return () => window.removeEventListener("elevanthe:plan-selected" as never, handler as EventListener)
  }, [])

  const handleMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (SITE_KEY && !tsToken) {
      setMsgStatus("error")
      setTimeout(() => setMsgStatus("idle"), 3000)
      return
    }
    setMsgStatus("loading")
    try {
      await submitLead({ name: form.name, email: form.email, phone: form.phone || undefined, whatsapp: form.whatsapp || undefined, subject: form.subject || undefined, message: form.message, plan: form.plan || undefined, turnstileToken: tsToken || undefined })
      setMsgStatus("success")
      setForm({ name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "" })
      setTsToken(null)
      if (tsWidgetId.current && (window as any).turnstile) {
        ;(window as any).turnstile.reset(tsWidgetId.current)
      }
      setTimeout(() => setMsgStatus("idle"), 6000)
    } catch { setMsgStatus("error"); setTimeout(() => setMsgStatus("idle"), 4000) }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sched.date || !sched.time) return
    if (SITE_KEY && !tsToken) {
      setSchedStatus("error")
      setTimeout(() => setSchedStatus("idle"), 3000)
      return
    }
    setSchedStatus("loading")
    const dateStr = `${PT_WEEK[sched.date.getDay()]}, ${sched.date.getDate()} de ${PT_MONTH[sched.date.getMonth()]}`
    try {
      await submitLead({ name: sched.name, email: sched.email, whatsapp: sched.whatsapp || undefined, subject: `Agendamento de bate-papo — ${dateStr} às ${sched.time}`, message: `Solicitação de bate-papo agendado para ${dateStr} às ${sched.time}.\nContato: ${sched.email}${sched.whatsapp ? ` / WhatsApp: ${sched.whatsapp}` : ""}`, turnstileToken: tsToken || undefined })
      setSchedStatus("success")
      setSched({ name: "", email: "", whatsapp: "", date: null, time: "" })
      setTsToken(null)
      if (tsWidgetId.current && (window as any).turnstile) {
        ;(window as any).turnstile.reset(tsWidgetId.current)
      }
      setTimeout(() => setSchedStatus("idle"), 6000)
    } catch { setSchedStatus("error"); setTimeout(() => setSchedStatus("idle"), 4000) }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200 bg-white/5"

  return (
    <section id="contato" ref={ref} className="relative overflow-hidden">
      {/* Full-width dark panel */}
      <div className="bg-[#080808] border-t border-white/[0.06]">
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "256px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* ── LEFT — headline + channels ──────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-white/25" />
                <span className="label-sm text-white/80">Contato</span>
              </div>

              <h2
                className="text-[clamp(38px,5.5vw,72px)] font-black text-white leading-[0.92] tracking-tight mb-8"
                style={{ letterSpacing: "-0.04em" }}
              >
                A próxima
                <br />
                <span className="text-white/50">DECISÃO</span>
                <br />
                começa por uma
                <br />
                conversa.
              </h2>

              <p className="text-sm text-white/65 leading-relaxed max-w-sm mb-12">
                Respondo em até 24h com uma proposta detalhada — sem custo de consulta.
              </p>

              {/* Channels card */}
              <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <span className="label-sm text-white/80">Canais rápidos</span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/75">Resposta em &lt; 24h</span>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {CHANNELS.map((ch) => {
                    const isWA = ch.label === "WhatsApp"
                    return (
                      <a
                        key={ch.label}
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 px-6 py-4 transition-colors duration-200"
                        style={isWA ? { background: "rgba(37,211,102,0.07)" } : {}}
                        onMouseEnter={e => { if (!isWA) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)" }}
                        onMouseLeave={e => { if (!isWA) (e.currentTarget as HTMLElement).style.background = "" }}
                      >
                        <div
                          className="size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                          style={isWA
                            ? { background: "#25D366", border: "none" }
                            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {isWA
                            ? <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            : <span className="text-white/50 group-hover:text-white transition-colors">{ch.icon}</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="text-[9px] font-bold tracking-widest uppercase text-white/70">{ch.label}</div>
                            {ch.badge && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(37,211,102,0.15)", color: "#25D366" }}>
                                {ch.badge}
                              </span>
                            )}
                          </div>
                          <div className={`text-sm font-semibold transition-colors truncate ${isWA ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                            {ch.value}
                          </div>
                        </div>
                        <ArrowUpRight className="size-4 text-white/35 group-hover:text-white/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT — form ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl border border-white/[0.08] mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
                {([
                  { id: "message", icon: Send, label: "Enviar mensagem" },
                  { id: "schedule", icon: Calendar, label: "Agendar bate-papo" },
                ] as const).map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        active ? "text-[#080808]" : "text-white/60 hover:text-white/70"
                      }`}
                      style={active ? { background: "#f2f2f2" } : {}}
                    >
                      <Icon className="size-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.id === "message" ? "Mensagem" : "Agendar"}</span>
                    </button>
                  )
                })}
              </div>

              {/* ── MESSAGE TAB ── */}
              {activeTab === "message" && (
                <>
                  {msgStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <CheckCircle className="size-12 text-white mb-4 opacity-70" />
                      <h4 className="text-lg font-bold text-white mb-2">Mensagem enviada!</h4>
                      <p className="text-sm text-white/50">Obrigado pelo contato. Retornarei em breve.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleMessage} className="flex flex-col gap-4">
                      {form.plan && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
                          <CheckCircle className="size-3.5 opacity-60 flex-shrink-0" />
                          Plano selecionado: <strong>{form.plan}</strong>
                          <button type="button" onClick={() => setForm(p => ({ ...p, plan: "" }))} className="ml-auto opacity-40 hover:opacity-70 transition">✕</button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80">Nome *</label>
                          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="João Silva" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80">E-mail *</label>
                          <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="joao@empresa.com" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                            <Phone className="size-3" /> Telefone
                          </label>
                          <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 9999-9999" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                            <MessageSquare className="size-3" /> WhatsApp
                          </label>
                          <input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="(11) 9 9999-9999" className={inputCls} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/80">Assunto *</label>
                        <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Quero um site para minha empresa" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/80">Descreva seu projeto *</label>
                        <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Quanto mais detalhes, melhor a proposta..." rows={5} className={`${inputCls} resize-none`} />
                      </div>
                      {/* Turnstile widget */}
                      {SITE_KEY && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide text-white/40 uppercase">
                            <svg viewBox="0 0 24 24" className="size-3 fill-current" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                            Verificação de segurança
                          </div>
                          <div ref={tsContainerRef} className="flex justify-start" />
                          {SITE_KEY && !tsToken && msgStatus !== "loading" && (
                            <p className="text-[10px] text-white/30 flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-yellow-400/60 animate-pulse inline-block" />
                              Aguarde o widget carregar para enviar
                            </p>
                          )}
                          {SITE_KEY && tsToken && (
                            <p className="text-[10px] text-green-400/70 flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-green-400 inline-block" />
                              Verificação concluída
                            </p>
                          )}
                        </div>
                      )}
                      {msgStatus === "error" && (
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
                          <svg viewBox="0 0 24 24" className="size-4 fill-current shrink-0" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                          {SITE_KEY && !tsToken ? "Complete a verificação de segurança acima." : "Erro ao enviar. Tente novamente."}
                        </p>
                      )}
                      <button type="submit" disabled={msgStatus === "loading" || (!!SITE_KEY && !tsToken)}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80 disabled:opacity-40 bg-white text-[#080808]"
                      >
                        {msgStatus === "loading" ? <><Loader2 className="size-4 animate-spin" />Enviando...</> : <><Send className="size-3.5" />Enviar Mensagem</>}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ── SCHEDULE TAB ── */}
              {activeTab === "schedule" && (
                <>
                  {schedStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <CheckCircle className="size-12 text-white mb-4 opacity-70" />
                      <h4 className="text-lg font-bold text-white mb-2">Bate-papo agendado!</h4>
                      <p className="text-sm text-white/50">Confirmaremos o horário por e-mail ou WhatsApp.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSchedule} className="flex flex-col gap-5">
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                        <Calendar className="size-4 text-white/60 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white mb-0.5">Bate-papo gratuito de 30 min</p>
                          <p className="text-xs text-white/60 leading-relaxed">Apresente seu projeto, entenda como trabalhamos — sem compromisso.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80 flex items-center gap-1.5"><User className="size-3" /> Nome *</label>
                          <input type="text" required value={sched.name} onChange={e => setSched({ ...sched, name: e.target.value })} placeholder="Seu nome" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-white/80 flex items-center gap-1.5"><Mail className="size-3" /> E-mail *</label>
                          <input type="email" required value={sched.email} onChange={e => setSched({ ...sched, email: e.target.value })} placeholder="seu@email.com" className={inputCls} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-white/80 flex items-center gap-1.5"><MessageSquare className="size-3" /> WhatsApp (para confirmação)</label>
                        <input type="tel" value={sched.whatsapp} onChange={e => setSched({ ...sched, whatsapp: e.target.value })} placeholder="(11) 9 9999-9999" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/80 flex items-center gap-1.5"><Calendar className="size-3" /> Escolha um dia *</label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                          {weekdays.map((d, i) => {
                            const sel = sched.date?.toDateString() === d.toDateString()
                            return (
                              <button key={i} type="button" onClick={() => setSched({ ...sched, date: d })}
                                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-xs transition-all duration-150 ${sel ? "border-white text-[#080808] bg-white" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white bg-white/[0.03]"}`}
                              >
                                <span className="font-medium" style={{ fontSize: "9px" }}>{PT_WEEK[d.getDay()]}</span>
                                <span className="font-bold text-sm leading-none mt-0.5">{d.getDate()}</span>
                                <span style={{ fontSize: "8px" }}>{PT_MONTH[d.getMonth()]}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/80 flex items-center gap-1.5"><Clock className="size-3" /> Escolha um horário *</label>
                        <div className="flex flex-wrap gap-2">
                          {TIMES.map((t) => {
                            const sel = sched.time === t
                            return (
                              <button key={t} type="button" onClick={() => setSched({ ...sched, time: t })}
                                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-150 ${sel ? "border-white text-[#080808] bg-white" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white bg-white/[0.03]"}`}
                              >
                                {t}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      {sched.date && sched.time && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/20 bg-white/[0.05]">
                          <ChevronRight className="size-4 text-white/50 flex-shrink-0" />
                          <p className="text-xs text-white/70">
                            <strong className="text-white">{PT_WEEK[sched.date.getDay()]}, {sched.date.getDate()} de {PT_MONTH[sched.date.getMonth()]}</strong>{" "}às <strong className="text-white">{sched.time}</strong>
                          </p>
                        </div>
                      )}
                      {schedStatus === "error" && (
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">Erro ao agendar. Tente novamente.</p>
                      )}
                      <button type="submit" disabled={schedStatus === "loading" || !sched.date || !sched.time}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80 disabled:opacity-40 bg-white text-[#080808]"
                      >
                        {schedStatus === "loading" ? <><Loader2 className="size-4 animate-spin" />Agendando...</> : <><Calendar className="size-3.5" />Confirmar Agendamento</>}
                      </button>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

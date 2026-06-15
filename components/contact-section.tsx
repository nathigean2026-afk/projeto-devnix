"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import {
  Send, Mail, GitBranch, AtSign, Link2, CheckCircle, Loader2,
  Phone, MessageSquare, Calendar, Clock, User, ChevronRight,
} from "lucide-react"
import { submitLead } from "@/app/actions/leads"

const contactLinks = [
  { icon: Mail, label: "E-mail", value: "contato@devnix.com.br", href: "mailto:contato@devnix.com.br" },
  { icon: GitBranch, label: "GitHub", value: "github.com/devnix", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/devnix", href: "https://linkedin.com" },
  { icon: AtSign, label: "Instagram", value: "@devnix.dev", href: "https://instagram.com" },
]

const TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

// Generate next 14 weekdays from today
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

type FormData = {
  name: string; email: string; phone: string; whatsapp: string
  subject: string; message: string; plan: string
}

type ScheduleData = {
  name: string; email: string; whatsapp: string; date: Date | null; time: string
}

type TabType = "message" | "schedule"

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const [activeTab, setActiveTab] = useState<TabType>("message")

  // ── Message form state
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "",
  })
  const [msgStatus, setMsgStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // ── Schedule form state
  const weekdays = getNextWeekdays(14)
  const [sched, setSched] = useState<ScheduleData>({ name: "", email: "", whatsapp: "", date: null, time: "" })
  const [schedStatus, setSchedStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const handler = (e: CustomEvent<{ plan: string; subject: string }>) => {
      setForm(prev => ({ ...prev, plan: e.detail.plan, subject: e.detail.subject }))
      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    window.addEventListener("devnix:plan-selected" as never, handler as EventListener)
    return () => window.removeEventListener("devnix:plan-selected" as never, handler as EventListener)
  }, [])

  const handleMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsgStatus("loading")
    try {
      await submitLead({
        name: form.name, email: form.email,
        phone: form.phone || undefined, whatsapp: form.whatsapp || undefined,
        subject: form.subject || undefined, message: form.message,
        plan: form.plan || undefined,
      })
      setMsgStatus("success")
      setForm({ name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "" })
      setTimeout(() => setMsgStatus("idle"), 6000)
    } catch {
      setMsgStatus("error")
      setTimeout(() => setMsgStatus("idle"), 4000)
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sched.date || !sched.time) return
    setSchedStatus("loading")
    const dateStr = `${PT_WEEK[sched.date.getDay()]}, ${sched.date.getDate()} de ${PT_MONTH[sched.date.getMonth()]}`
    try {
      await submitLead({
        name: sched.name, email: sched.email,
        whatsapp: sched.whatsapp || undefined,
        subject: `Agendamento de bate-papo — ${dateStr} às ${sched.time}`,
        message: `Solicitação de bate-papo agendado para ${dateStr} às ${sched.time}.\nContato: ${sched.email}${sched.whatsapp ? ` / WhatsApp: ${sched.whatsapp}` : ""}`,
      })
      setSchedStatus("success")
      setSched({ name: "", email: "", whatsapp: "", date: null, time: "" })
      setTimeout(() => setSchedStatus("idle"), 6000)
    } catch {
      setSchedStatus("error")
      setTimeout(() => setSchedStatus("idle"), 4000)
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all duration-200 bg-background"

  return (
    <section id="contato" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-8 bg-foreground opacity-30" />
          <span className="label-sm text-muted-foreground">Contato</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <motion.h2
            className="text-editorial text-[clamp(38px,6vw,72px)] text-foreground leading-none"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Vamos construir
            <br />
            <span className="text-muted-foreground">algo incrível.</span>
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Respondo em até 24h com uma proposta detalhada — sem custo de consulta.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Form card — neon sweep border */}
          <motion.div
            className="lg:col-span-3 relative rounded-2xl p-8"
            style={{ isolation: "isolate", background: "var(--secondary)" }}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Neon rotating border — theme-aware via CSS class */}
            <div
              className="neon-border-sweep absolute inset-[-1.5px] rounded-2xl pointer-events-none"
              style={{ zIndex: -1 }}
              aria-hidden="true"
            />
            <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] z-[-1]" style={{ background: "var(--secondary)" }} aria-hidden="true" />

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border mb-6" style={{ background: "var(--background)" }}>
              {([
                { id: "message", icon: Send, label: "Enviar mensagem" },
                { id: "schedule", icon: Calendar, label: "Agendar bate-papo" },
              ] as const).map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={activeTab === tab.id ? { background: "var(--foreground)" } : {}}
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
                    <CheckCircle className="size-12 text-foreground mb-4 opacity-80" />
                    <h4 className="text-lg font-bold text-foreground mb-2">Mensagem enviada!</h4>
                    <p className="text-sm text-muted-foreground">
                      Obrigado pelo contato. Retornarei em breve com uma proposta.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleMessage} className="flex flex-col gap-4">
                    {form.plan && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs text-foreground">
                        <CheckCircle className="size-3.5 opacity-60 flex-shrink-0" />
                        Plano selecionado: <strong>{form.plan}</strong>
                        <button type="button" onClick={() => setForm(p => ({ ...p, plan: "" }))} className="ml-auto opacity-40 hover:opacity-70 transition">✕</button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-xs font-medium text-muted-foreground">Nome *</label>
                        <input id="name" type="text" required value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="João Silva" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-muted-foreground">E-mail *</label>
                        <input id="email" type="email" required value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="joao@empresa.com" className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Phone className="size-3" /> Telefone
                        </label>
                        <input id="phone" type="tel" value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="(11) 9999-9999" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="whatsapp" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <MessageSquare className="size-3" /> WhatsApp
                        </label>
                        <input id="whatsapp" type="tel" value={form.whatsapp}
                          onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                          placeholder="(11) 9 9999-9999" className={inputCls} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-xs font-medium text-muted-foreground">Assunto *</label>
                      <input id="subject" type="text" required value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Quero um site para minha empresa" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs font-medium text-muted-foreground">Descreva seu projeto *</label>
                      <textarea id="message" required value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Quanto mais detalhes, melhor a proposta..."
                        rows={5} className={`${inputCls} resize-none`} />
                    </div>
                    {msgStatus === "error" && (
                      <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                        Erro ao enviar. Tente novamente.
                      </p>
                    )}
                    <button type="submit" disabled={msgStatus === "loading"}
                      className="flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 disabled:opacity-50"
                      style={{ background: "var(--foreground)", color: "var(--background)" }}
                    >
                      {msgStatus === "loading"
                        ? <><Loader2 className="size-4 animate-spin" />Enviando...</>
                        : <><Send className="size-3.5" />Enviar Mensagem</>}
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
                    <CheckCircle className="size-12 text-foreground mb-4 opacity-80" />
                    <h4 className="text-lg font-bold text-foreground mb-2">Bate-papo agendado!</h4>
                    <p className="text-sm text-muted-foreground">
                      Recebemos seu pedido. Confirmaremos o horário em breve por e-mail ou WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSchedule} className="flex flex-col gap-5">
                    {/* Info banner */}
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background/60">
                      <Calendar className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-0.5">Bate-papo gratuito de 30 min</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Apresente seu projeto, entenda como trabalhamos e tire dúvidas — sem compromisso.
                        </p>
                      </div>
                    </div>

                    {/* Name + email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <User className="size-3" /> Nome *
                        </label>
                        <input type="text" required value={sched.name}
                          onChange={e => setSched({ ...sched, name: e.target.value })}
                          placeholder="Seu nome" className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Mail className="size-3" /> E-mail *
                        </label>
                        <input type="email" required value={sched.email}
                          onChange={e => setSched({ ...sched, email: e.target.value })}
                          placeholder="seu@email.com" className={inputCls} />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <MessageSquare className="size-3" /> WhatsApp (para confirmação)
                      </label>
                      <input type="tel" value={sched.whatsapp}
                        onChange={e => setSched({ ...sched, whatsapp: e.target.value })}
                        placeholder="(11) 9 9999-9999" className={inputCls} />
                    </div>

                    {/* Date picker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3" /> Escolha um dia *
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                        {weekdays.map((d, i) => {
                          const sel = sched.date?.toDateString() === d.toDateString()
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSched({ ...sched, date: d })}
                              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-xs transition-all duration-150 ${
                                sel
                                  ? "border-foreground text-background"
                                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                              }`}
                              style={sel ? { background: "var(--foreground)" } : { background: "var(--background)" }}
                            >
                              <span className="font-medium" style={{ fontSize: "9px" }}>{PT_WEEK[d.getDay()]}</span>
                              <span className="font-bold text-sm leading-none mt-0.5">{d.getDate()}</span>
                              <span style={{ fontSize: "8px" }}>{PT_MONTH[d.getMonth()]}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time picker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3" /> Escolha um horário *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIMES.map((t) => {
                          const sel = sched.time === t
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSched({ ...sched, time: t })}
                              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                                sel
                                  ? "border-foreground text-background"
                                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                              }`}
                              style={sel ? { background: "var(--foreground)" } : { background: "var(--background)" }}
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Summary */}
                    {sched.date && sched.time && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-foreground/20 bg-foreground/5">
                        <ChevronRight className="size-4 text-foreground opacity-60 flex-shrink-0" />
                        <p className="text-xs text-foreground">
                          <strong>
                            {PT_WEEK[sched.date.getDay()]}, {sched.date.getDate()} de {PT_MONTH[sched.date.getMonth()]}
                          </strong>
                          {" "}às{" "}
                          <strong>{sched.time}</strong>
                        </p>
                      </div>
                    )}

                    {schedStatus === "error" && (
                      <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                        Erro ao agendar. Tente novamente.
                      </p>
                    )}

                    <button type="submit"
                      disabled={schedStatus === "loading" || !sched.date || !sched.time}
                      className="flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 disabled:opacity-40"
                      style={{ background: "var(--foreground)", color: "var(--background)" }}
                    >
                      {schedStatus === "loading"
                        ? <><Loader2 className="size-4 animate-spin" />Agendando...</>
                        : <><Calendar className="size-3.5" />Confirmar Agendamento</>}
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-border p-6 flex-1" style={{ background: "var(--background)" }}>
              <h3 className="text-sm font-bold text-foreground mb-3">Resposta garantida em 24h</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                Todo contato é respondido com uma proposta clara e sem taxas de consulta.
              </p>
              <div className="flex flex-col gap-2.5">
                {["Orçamento sem compromisso", "Proposta detalhada e transparente", "Sem taxa de consulta", "Bate-papo gratuito disponível"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="size-3.5 text-foreground opacity-50 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border p-6" style={{ background: "var(--background)" }}>
              <h3 className="label-sm text-muted-foreground mb-4">Outros canais</h3>
              <div className="flex flex-col gap-2">
                {contactLinks.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <a key={opt.label} href={opt.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border transition-all duration-200 group"
                    >
                      <div className="size-8 rounded-lg border border-border flex items-center justify-center flex-shrink-0" style={{ background: "var(--secondary)" }}>
                        <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <div>
                        <div className="label-sm text-muted-foreground" style={{ fontSize: "9px" }}>{opt.label}</div>
                        <div className="text-xs text-foreground font-medium">{opt.value}</div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

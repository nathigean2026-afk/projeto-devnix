"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Send, Mail, GitBranch, AtSign, Link2, CheckCircle, Loader2, Phone, MessageSquare } from "lucide-react"
import { submitLead } from "@/app/actions/leads"

const contactLinks = [
  { icon: Mail, label: "E-mail", value: "contato@devnix.com.br", href: "mailto:contato@devnix.com.br" },
  { icon: GitBranch, label: "GitHub", value: "github.com/devnix", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/devnix", href: "https://linkedin.com" },
  { icon: AtSign, label: "Instagram", value: "@devnix.dev", href: "https://instagram.com" },
]

type FormData = {
  name: string
  email: string
  phone: string
  whatsapp: string
  subject: string
  message: string
  plan: string
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Listen for plan selection from PricingSection
  useEffect(() => {
    const handler = (e: CustomEvent<{ plan: string; subject: string }>) => {
      setForm(prev => ({ ...prev, plan: e.detail.plan, subject: e.detail.subject }))
      // Scroll to section
      const el = document.getElementById("contato")
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    window.addEventListener("devnix:plan-selected" as never, handler as EventListener)
    return () => window.removeEventListener("devnix:plan-selected" as never, handler as EventListener)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        whatsapp: form.whatsapp || undefined,
        subject: form.subject || undefined,
        message: form.message,
        plan: form.plan || undefined,
      })
      setStatus("success")
      setForm({ name: "", email: "", phone: "", whatsapp: "", subject: "", message: "", plan: "" })
      setTimeout(() => setStatus("idle"), 6000)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
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
          {/* Form — neon sweep border */}
          <motion.div
            className="lg:col-span-3 relative rounded-2xl p-8"
            style={{ isolation: "isolate", background: "var(--secondary)" }}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Rotating neon border */}
            <div
              className="absolute inset-[-1.5px] rounded-2xl pointer-events-none"
              style={{
                background: "conic-gradient(from var(--angle, 0deg) at 50% 50%, transparent 0%, transparent 35%, rgba(255,255,255,0.6) 50%, transparent 65%, transparent 100%)",
                animation: "neon-rotate 3s linear infinite",
                zIndex: -1,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] z-[-1]" style={{ background: "var(--secondary)" }} aria-hidden="true" />
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="size-12 text-foreground mb-4 opacity-80" />
                <h4 className="text-lg font-bold text-foreground mb-2">Mensagem enviada!</h4>
                <p className="text-sm text-muted-foreground">
                  Obrigado pelo contato. Retornarei em breve com uma proposta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-foreground mb-2">Enviar mensagem</h3>

                {/* Plano pré-selecionado */}
                {form.plan && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs text-foreground">
                    <CheckCircle className="size-3.5 opacity-60 flex-shrink-0" />
                    Plano selecionado: <strong>{form.plan}</strong>
                    <button type="button" onClick={() => setForm(p => ({ ...p, plan: "" }))} className="ml-auto opacity-40 hover:opacity-70 transition">✕</button>
                  </div>
                )}

                {/* Nome + Email */}
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

                {/* Telefone + WhatsApp */}
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

                {/* Assunto */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-muted-foreground">Assunto *</label>
                  <input id="subject" type="text" required value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Quero um site para minha empresa" className={inputCls} />
                </div>

                {/* Mensagem */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground">Descreva seu projeto *</label>
                  <textarea id="message" required value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Quanto mais detalhes, melhor a proposta que posso oferecer..."
                    rows={5} className={`${inputCls} resize-none`} />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    Erro ao enviar. Tente novamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 disabled:opacity-50"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}
                >
                  {status === "loading" ? (
                    <><Loader2 className="size-4 animate-spin" />Enviando...</>
                  ) : (
                    <><Send className="size-3.5" />Enviar Mensagem</>
                  )}
                </button>
              </form>
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
                {["Orçamento sem compromisso", "Proposta detalhada e transparente", "Sem taxa de consulta"].map((item) => (
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

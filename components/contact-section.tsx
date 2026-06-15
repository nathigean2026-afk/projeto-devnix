"use client"

import { useState } from "react"
import { Send, MessageSquare, Mail, GitBranch, AtSign, Link2, CheckCircle2, Loader2 } from "lucide-react"

const contactOptions = [
  { icon: Mail, label: "E-mail", value: "contato@devpro.com.br", href: "mailto:contato@devpro.com.br" },
  { icon: GitBranch, label: "GitHub", value: "github.com/devpro", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/devpro", href: "https://linkedin.com" },
  { icon: AtSign, label: "Instagram", value: "@devpro.dev", href: "https://instagram.com" },
]

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[#111f16] border border-white/7 text-[#eef4f0] placeholder:text-[#536860] text-sm focus:outline-none focus:border-[#5cff8a]/40 focus:ring-1 focus:ring-[#5cff8a]/20 transition-all duration-200"

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1500))
    setStatus("success")
    setForm({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setStatus("idle"), 5000)
  }

  return (
    <section id="contato" className="relative py-32 overflow-hidden">
      {/* Divisor */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      {/* Glow de fundo */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(20,70,38,0.3) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="section-label mb-5">Contato</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#eef4f0] leading-tight tracking-tight">
              Vamos construir algo{" "}
              <span className="text-[#5cff8a] glow-text-sm">incrível juntos</span>
            </h2>
            <p className="text-[#7a9985] text-sm max-w-xs leading-relaxed lg:text-right">
              Respondo em até 24h com uma proposta detalhada — sem custo de consulta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden border border-white/7"
          style={{ background: "rgba(255,255,255,0.06)" }}>

          {/* Formulário */}
          <div className="lg:col-span-3 bg-[#0c1710] p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-[#5cff8a]/10 border border-[#5cff8a]/25 flex items-center justify-center">
                <MessageSquare className="size-5 text-[#5cff8a]" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#eef4f0]">Enviar mensagem</h3>
                <p className="text-[11px] text-[#536860]">Resposta garantida em até 24h</p>
              </div>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <CheckCircle2 className="size-12 text-[#5cff8a] mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(92,255,138,0.5))" }} />
                <h4 className="text-lg font-bold text-[#eef4f0] mb-2">Mensagem enviada!</h4>
                <p className="text-[13px] text-[#7a9985]">
                  Obrigado pelo contato. Retornarei em breve com uma proposta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[12px] font-medium text-[#7a9985]">Nome *</label>
                    <input id="name" type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="João Silva" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[12px] font-medium text-[#7a9985]">E-mail *</label>
                    <input id="email" type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="joao@empresa.com" className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-[12px] font-medium text-[#7a9985]">Assunto *</label>
                  <input id="subject" type="text" required value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Quero um site para minha empresa" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[12px] font-medium text-[#7a9985]">Descreva seu projeto *</label>
                  <textarea id="message" required value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Quanto mais detalhes, melhor a proposta que posso oferecer..."
                    rows={5} className={`${inputCls} resize-none`} />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#5cff8a] text-[#0c1710] font-bold text-sm hover:bg-[#7aff9e] transition-all duration-200 disabled:opacity-50"
                  style={{ boxShadow: "0 0 22px rgba(92,255,138,0.35)" }}
                >
                  {status === "loading" ? (
                    <><Loader2 className="size-4 animate-spin" />Enviando...</>
                  ) : (
                    <><Send className="size-4" />Enviar mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar direita */}
          <div className="lg:col-span-2 bg-[#0c1710] flex flex-col">
            {/* Card de garantia */}
            <div className="p-8 border-b border-white/6">
              <h3 className="text-[14px] font-bold text-[#eef4f0] mb-3">Resposta rápida garantida</h3>
              <p className="text-[12.5px] text-[#7a9985] leading-relaxed mb-5">
                Todo contato é respondido em até{" "}
                <span className="text-[#eef4f0] font-medium">24 horas</span>.
                Dependendo da complexidade, já envio uma proposta inicial.
              </p>
              <div className="flex flex-col gap-2.5">
                {["Orçamento sem compromisso", "Proposta detalhada e transparente", "Sem taxa de consulta"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-[#5cff8a] flex-shrink-0" />
                    <span className="text-[12px] text-[#7a9985]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links sociais */}
            <div className="p-8 flex-1">
              <h3 className="text-[12px] font-semibold text-[#7a9985] uppercase tracking-widest mb-5">Outros canais</h3>
              <div className="flex flex-col gap-2.5">
                {contactOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <a
                      key={opt.label}
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-[#5cff8a]/25 hover:bg-[#5cff8a]/5 transition-all duration-200 group"
                    >
                      <div className="size-8 rounded-lg bg-[#111f16] border border-white/7 flex items-center justify-center group-hover:border-[#5cff8a]/25 transition-all">
                        <Icon className="size-3.5 text-[#7a9985] group-hover:text-[#5cff8a] transition-colors" />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#536860]">{opt.label}</div>
                        <div className="text-[12.5px] text-[#c8d9cd] font-medium">{opt.value}</div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Send, Mail, GitBranch, AtSign, Link2, CheckCircle, Loader2 } from "lucide-react"

const contactLinks = [
  { icon: Mail, label: "E-mail", value: "contato@devpro.com.br", href: "mailto:contato@devpro.com.br" },
  { icon: GitBranch, label: "GitHub", value: "github.com/devpro", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/devpro", href: "https://linkedin.com" },
  { icon: AtSign, label: "Instagram", value: "@devpro.dev", href: "https://instagram.com" },
]

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-green-400/40 focus:ring-1 focus:ring-green-400/20 transition-all duration-200"

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1400))
    setStatus("success")
    setForm({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setStatus("idle"), 5000)
  }

  return (
    <section id="contato" className="relative py-28">
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.15), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold text-green-400 tracking-[0.15em] uppercase mb-4">
            — Contato
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Vamos construir algo{" "}
              <span className="text-green-400">incrível</span> juntos.
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed lg:text-right">
              Respondo em até 24h com uma proposta detalhada — sem custo de consulta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Formulário */}
          <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle
                  className="size-12 text-green-400 mb-4"
                  style={{ filter: "drop-shadow(0 0 14px rgba(74,222,128,0.5))" }}
                />
                <h4 className="text-lg font-bold text-white mb-2">Mensagem enviada!</h4>
                <p className="text-sm text-zinc-500">
                  Obrigado pelo contato. Retornarei em breve com uma proposta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white mb-2">Enviar mensagem</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-zinc-500">Nome *</label>
                    <input
                      id="name" type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="João Silva" className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-zinc-500">E-mail *</label>
                    <input
                      id="email" type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="joao@empresa.com" className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-zinc-500">Assunto *</label>
                  <input
                    id="subject" type="text" required value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Quero um site para minha empresa" className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-zinc-500">Descreva seu projeto *</label>
                  <textarea
                    id="message" required value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Quanto mais detalhes, melhor a proposta que posso oferecer..."
                    rows={5} className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-400 text-black text-sm font-bold hover:bg-green-300 transition-all duration-200 disabled:opacity-60 glow-green"
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

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Garantias */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex-1">
              <h3 className="text-sm font-bold text-white mb-3">Resposta garantida em 24h</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-5">
                Todo contato é respondido rapidamente com uma proposta clara e sem taxas de consulta.
              </p>
              <div className="flex flex-col gap-2.5">
                {["Orçamento sem compromisso", "Proposta detalhada e transparente", "Sem taxa de consulta"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="size-3.5 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                Outros canais
              </h3>
              <div className="flex flex-col gap-2">
                {contactLinks.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <a
                      key={opt.label}
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-green-400/[0.04] hover:border-green-400/20 border border-transparent transition-all duration-200 group"
                    >
                      <div className="size-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Icon className="size-3.5 text-zinc-500 group-hover:text-green-400 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-600">{opt.label}</div>
                        <div className="text-xs text-zinc-300 font-medium">{opt.value}</div>
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

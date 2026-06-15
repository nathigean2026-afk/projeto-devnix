"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, MessageSquare, Mail, GitBranch, AtSign, Link2, CheckCircle2, Loader2 } from "lucide-react"

const contactOptions = [
  { icon: Mail, label: "E-mail", value: "contato@devpro.com.br", href: "mailto:contato@devpro.com.br" },
  { icon: GitBranch, label: "GitHub", value: "github.com/devpro", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", value: "linkedin.com/in/devpro", href: "https://linkedin.com" },
  { icon: AtSign, label: "Instagram", value: "@devpro.dev", href: "https://instagram.com" },
]

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500))
    setStatus("success")
    setForm({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setStatus("idle"), 4000)
  }

  return (
    <section id="contato" className="py-24 sm:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 60%), transparent)" }}
        aria-hidden="true"
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center bottom, oklch(0.84 0.2 155 / 8%), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Contato
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance mb-5">
            Vamos construir algo{" "}
            <span className="neon-text">incrível juntos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Conte-me sobre o seu projeto ou problema. Respondo em até 24 horas com uma proposta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <MessageSquare className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Enviar mensagem</h3>
                  <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
                </div>
              </div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="size-14 text-primary mb-4 neon-text" />
                  <h4 className="text-xl font-semibold text-foreground mb-2">Mensagem enviada!</h4>
                  <p className="text-muted-foreground text-sm">
                    Obrigado pelo contato. Retornarei em breve com uma proposta.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                        Seu nome *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="João Silva"
                        className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                        E-mail *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="joao@empresa.com"
                        className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
                      Assunto *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Quero um site para minha empresa"
                      className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                      Descreva seu projeto ou problema *
                    </label>
                    <textarea
                      id="message"
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Conte-me o que você precisa. Quanto mais detalhes, melhor a proposta que posso oferecer..."
                      rows={5}
                      className="px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 neon-glow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Enviar mensagem
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* CTA card */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-bold text-foreground text-lg mb-2">Resposta rápida garantida</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Todo contato é respondido em até <span className="text-foreground font-medium">24 horas</span>.
                Dependendo da complexidade, já envio uma proposta inicial na mesma mensagem.
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                  Orçamento sem compromisso
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                  Proposta detalhada e transparente
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                  Sem taxa de consulta
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Outros canais de contato</h3>
              <div className="flex flex-col gap-3">
                {contactOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <a
                      key={opt.label}
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="size-8 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                        <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{opt.label}</div>
                        <div className="text-sm text-foreground font-medium">{opt.value}</div>
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

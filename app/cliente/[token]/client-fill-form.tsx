"use client"

import { useState } from "react"
import { submitClientForm } from "@/app/actions/leads"
import type { Client } from "@/lib/db/schema"
import { Check, Building2, User, ChevronRight, ChevronLeft, Send } from "lucide-react"
import Image from "next/image"

type Step = "pessoal" | "empresa" | "identidade" | "conclusao"

const STEPS: { key: Step; label: string; desc: string }[] = [
  { key: "pessoal",    label: "Seus dados",    desc: "Informações pessoais de contato" },
  { key: "empresa",    label: "Sua empresa",   desc: "Dados do negócio" },
  { key: "identidade", label: "Identidade",    desc: "Missão, visão e mercado" },
  { key: "conclusao",  label: "Pronto!",        desc: "Cadastro enviado" },
]

type FormState = {
  name: string; email: string; phone: string; whatsapp: string; cpf: string;
  companyName: string; cnpj: string; foundedYear: string; city: string; state: string;
  sector: string; employees: string; socialMedia: string;
  mission: string; vision: string; values: string;
  targetAudience: string; differentials: string; competitors: string;
  brandColors: string; logoUrl: string;
}

export default function ClientFillForm({ token, initial }: { token: string; initial: Client }) {
  const [step, setStep] = useState<Step>("pessoal")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState<FormState>({
    name:          initial.name ?? "",
    email:         initial.email ?? "",
    phone:         initial.phone ?? "",
    whatsapp:      initial.whatsapp ?? "",
    cpf:           initial.cpf ?? "",
    companyName:   initial.companyName ?? "",
    cnpj:          initial.cnpj ?? "",
    foundedYear:   initial.foundedYear ?? "",
    city:          initial.city ?? "",
    state:         initial.state ?? "",
    sector:        initial.sector ?? "",
    employees:     initial.employees ?? "",
    socialMedia:   initial.socialMedia ?? "",
    mission:       initial.mission ?? "",
    vision:        initial.vision ?? "",
    values:        initial.values ?? "",
    targetAudience: initial.targetAudience ?? "",
    differentials:  initial.differentials ?? "",
    competitors:    initial.competitors ?? "",
    brandColors:    initial.brandColors ?? "",
    logoUrl:        initial.logoUrl ?? "",
  })

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const INPUT = "w-full px-4 py-3 rounded-xl border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 transition"
  const LABEL = "text-xs font-semibold text-foreground/60 uppercase tracking-wider block mb-1.5"
  const TA = INPUT + " resize-none"

  const stepIndex = STEPS.findIndex(s => s.key === step)

  async function handleSubmit() {
    setSubmitting(true)
    setError("")
    try {
      await submitClientForm(token, {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        whatsapp: form.whatsapp || undefined,
        cpf: form.cpf || undefined,
        companyName: form.companyName || undefined,
        cnpj: form.cnpj || undefined,
        foundedYear: form.foundedYear || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        sector: form.sector || undefined,
        employees: form.employees || undefined,
        socialMedia: form.socialMedia || undefined,
        mission: form.mission || undefined,
        vision: form.vision || undefined,
        values: form.values || undefined,
        targetAudience: form.targetAudience || undefined,
        differentials: form.differentials || undefined,
        competitors: form.competitors || undefined,
        brandColors: form.brandColors || undefined,
        logoUrl: form.logoUrl || undefined,
      })
      setStep("conclusao")
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-8 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-foreground flex items-center justify-center">
            <Building2 className="size-4 text-background" />
          </div>
          <span className="font-bold text-sm">Elevanthe</span>
        </div>
        <span className="text-muted-foreground text-sm">—</span>
        <span className="text-sm text-muted-foreground">Cadastro de Cliente</span>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        {/* Steps indicator */}
        {!done && (
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
            {STEPS.filter(s => s.key !== "conclusao").map((s, idx) => {
              const current = STEPS.findIndex(x => x.key === step)
              const isPast = idx < current
              const isActive = s.key === step
              return (
                <div key={s.key} className="flex items-center gap-1 shrink-0">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive ? "bg-foreground text-background" :
                    isPast ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {isPast ? <Check className="size-3" /> : <span>{idx + 1}</span>}
                    {s.label}
                  </div>
                  {idx < 2 && <ChevronRight className="size-3 text-muted-foreground shrink-0" />}
                </div>
              )
            })}
          </div>
        )}

        {/* Step content */}
        {step === "pessoal" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold">Seus dados pessoais</h1>
              <p className="text-sm text-muted-foreground mt-1">Preencha suas informações de contato para continuarmos.</p>
            </div>
            <div>
              <label className={LABEL}>Nome completo *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} className={INPUT} placeholder="João da Silva" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>E-mail</label>
                <input value={form.email} onChange={e => set("email", e.target.value)} type="email" className={INPUT} placeholder="joao@email.com" />
              </div>
              <div>
                <label className={LABEL}>WhatsApp</label>
                <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={INPUT} placeholder="+55 87 99999-9999" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Telefone fixo</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)} className={INPUT} placeholder="+55 87 3000-0000" />
              </div>
              <div>
                <label className={LABEL}>CPF</label>
                <input value={form.cpf} onChange={e => set("cpf", e.target.value)} className={INPUT} placeholder="000.000.000-00" />
              </div>
            </div>
            <button
              onClick={() => form.name ? setStep("empresa") : setError("Informe seu nome para continuar.")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition"
            >
              Continuar <ChevronRight className="size-4" />
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        )}

        {step === "empresa" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold">Dados da sua empresa</h1>
              <p className="text-sm text-muted-foreground mt-1">Informações sobre o negócio que iremos trabalhar juntos.</p>
            </div>
            <div>
              <label className={LABEL}>Nome da empresa</label>
              <input value={form.companyName} onChange={e => set("companyName", e.target.value)} className={INPUT} placeholder="Barbearia Maktub" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>CNPJ</label>
                <input value={form.cnpj} onChange={e => set("cnpj", e.target.value)} className={INPUT} placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <label className={LABEL}>Ano de fundação</label>
                <input value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} className={INPUT} placeholder="2018" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Cidade</label>
                <input value={form.city} onChange={e => set("city", e.target.value)} className={INPUT} placeholder="Juazeiro do Norte" />
              </div>
              <div>
                <label className={LABEL}>Estado</label>
                <input value={form.state} onChange={e => set("state", e.target.value)} className={INPUT} placeholder="CE" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Ramo / Setor</label>
                <input value={form.sector} onChange={e => set("sector", e.target.value)} className={INPUT} placeholder="Beleza, Serviços..." />
              </div>
              <div>
                <label className={LABEL}>Nº de funcionários</label>
                <input value={form.employees} onChange={e => set("employees", e.target.value)} className={INPUT} placeholder="1-5" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Redes sociais</label>
              <input value={form.socialMedia} onChange={e => set("socialMedia", e.target.value)} className={INPUT} placeholder="@empresa no Instagram..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("pessoal")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                <ChevronLeft className="size-4" /> Voltar
              </button>
              <button onClick={() => setStep("identidade")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition">
                Continuar <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === "identidade" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold">Identidade do negócio</h1>
              <p className="text-sm text-muted-foreground mt-1">Nos conte mais sobre a essência da sua empresa. Isso nos ajuda a criar algo que realmente represente você.</p>
            </div>
            <div>
              <label className={LABEL}>Missão — qual o propósito da empresa?</label>
              <textarea value={form.mission} onChange={e => set("mission", e.target.value)} rows={2} className={TA} placeholder="Por que vocês existem?" />
            </div>
            <div>
              <label className={LABEL}>Visão — onde deseja chegar?</label>
              <textarea value={form.vision} onChange={e => set("vision", e.target.value)} rows={2} className={TA} placeholder="Como se vê daqui a 5 anos?" />
            </div>
            <div>
              <label className={LABEL}>Valores — o que é inegociável?</label>
              <textarea value={form.values} onChange={e => set("values", e.target.value)} rows={2} className={TA} placeholder="Transparência, qualidade, pontualidade..." />
            </div>
            <div>
              <label className={LABEL}>Público-alvo — quem são seus clientes?</label>
              <textarea value={form.targetAudience} onChange={e => set("targetAudience", e.target.value)} rows={2} className={TA} placeholder="Homens 25-45, donos de pequenos negócios..." />
            </div>
            <div>
              <label className={LABEL}>Diferenciais — o que faz vocês melhores?</label>
              <textarea value={form.differentials} onChange={e => set("differentials", e.target.value)} rows={2} className={TA} placeholder="Atendimento personalizado, entrega rápida..." />
            </div>
            <div>
              <label className={LABEL}>Concorrentes principais</label>
              <input value={form.competitors} onChange={e => set("competitors", e.target.value)} className={INPUT} placeholder="Empresa X, Empresa Y" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Cores da marca</label>
                <input value={form.brandColors} onChange={e => set("brandColors", e.target.value)} className={INPUT} placeholder="#1a1a1a, dourado..." />
              </div>
              <div>
                <label className={LABEL}>URL do logotipo</label>
                <input value={form.logoUrl} onChange={e => set("logoUrl", e.target.value)} className={INPUT} placeholder="https://drive.google.com/..." />
              </div>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep("empresa")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                <ChevronLeft className="size-4" /> Voltar
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition">
                <Send className="size-4" />
                {submitting ? "Enviando..." : "Enviar cadastro"}
              </button>
            </div>
          </div>
        )}

        {step === "conclusao" && (
          <div className="text-center py-8 space-y-5">
            <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Check className="size-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cadastro enviado!</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                Obrigado, {form.name.split(" ")[0]}! Recebemos suas informações e entraremos em contato em breve para revisar tudo com você.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-secondary/30 text-left space-y-1 max-w-xs mx-auto">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Resumo</p>
              {form.name && <p className="text-sm"><span className="text-muted-foreground">Nome:</span> {form.name}</p>}
              {form.companyName && <p className="text-sm"><span className="text-muted-foreground">Empresa:</span> {form.companyName}</p>}
              {form.email && <p className="text-sm"><span className="text-muted-foreground">E-mail:</span> {form.email}</p>}
              {form.whatsapp && <p className="text-sm"><span className="text-muted-foreground">WhatsApp:</span> {form.whatsapp}</p>}
            </div>
            <p className="text-xs text-muted-foreground">Elevanthe — Tecnologia que Eleva Negócios</p>
          </div>
        )}
      </div>
    </div>
  )
}

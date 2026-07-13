"use client"

import { useState, useTransition } from "react"
import type { Client } from "@/lib/db/schema"
import {
  createClient, updateClient, deleteClient, generateClientFillLink,
} from "@/app/actions/leads"
import {
  Plus, Pencil, Trash2, X, Check, Link2, Copy, User,
  Building2, Phone, Mail, MapPin, ChevronRight, Clock,
  CheckCircle2, XCircle, Search, ExternalLink,
} from "lucide-react"

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(d))
}

const STATUS_CONFIG = {
  pendente:  { label: "Pendente",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20",   dot: "bg-amber-400" },
  aprovado:  { label: "Aprovado",  color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  rejeitado: { label: "Rejeitado", color: "bg-red-500/10 text-red-400 border-red-500/20",         dot: "bg-red-400" },
} as const

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendente
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.color}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const letters = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
  const cls = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-12 text-base" : "size-10 text-sm"
  return (
    <div className={`${cls} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ background: "var(--foreground)", color: "var(--background)" }}>
      {letters || "?"}
    </div>
  )
}

// ── Blank form ────────────────────────────────────────────────────────────────
type ClientFormState = {
  name: string; email: string; phone: string; whatsapp: string; cpf: string;
  companyName: string; cnpj: string; foundedYear: string; city: string; state: string;
  sector: string; employees: string;
  mission: string; vision: string; values: string;
  targetAudience: string; differentials: string; competitors: string; socialMedia: string;
  logoUrl: string; brandColors: string;
  adminNotes: string;
}

function blankForm(): ClientFormState {
  return {
    name: "", email: "", phone: "", whatsapp: "", cpf: "",
    companyName: "", cnpj: "", foundedYear: "", city: "", state: "",
    sector: "", employees: "",
    mission: "", vision: "", values: "",
    targetAudience: "", differentials: "", competitors: "", socialMedia: "",
    logoUrl: "", brandColors: "",
    adminNotes: "",
  }
}

function rowToForm(c: Client): ClientFormState {
  return {
    name: c.name, email: c.email ?? "", phone: c.phone ?? "", whatsapp: c.whatsapp ?? "", cpf: c.cpf ?? "",
    companyName: c.companyName ?? "", cnpj: c.cnpj ?? "", foundedYear: c.foundedYear ?? "",
    city: c.city ?? "", state: c.state ?? "", sector: c.sector ?? "", employees: c.employees ?? "",
    mission: c.mission ?? "", vision: c.vision ?? "", values: c.values ?? "",
    targetAudience: c.targetAudience ?? "", differentials: c.differentials ?? "",
    competitors: c.competitors ?? "", socialMedia: c.socialMedia ?? "",
    logoUrl: c.logoUrl ?? "", brandColors: c.brandColors ?? "",
    adminNotes: c.adminNotes ?? "",
  }
}

// ── ClientFormModal ───────────────────────────────────────────────────────────
function ClientFormModal({
  initial, mode, editId, onClose, onSaved,
}: {
  initial: ClientFormState
  mode: "create" | "edit"
  editId?: number
  onClose: () => void
  onSaved: (c: Client) => void
}) {
  const [form, setForm] = useState<ClientFormState>(initial)
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState<"pessoal" | "empresa" | "identidade" | "notas">("pessoal")
  const [error, setError] = useState("")

  const set = <K extends keyof ClientFormState>(k: K, v: ClientFormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const INPUT = "w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 transition"
  const LABEL = "text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5"
  const TA = INPUT + " resize-none"

  const handleSave = () => {
    if (!form.name.trim()) { setError("Nome é obrigatório."); return }
    setError("")
    startTransition(async () => {
      try {
        const payload = {
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
          mission: form.mission || undefined,
          vision: form.vision || undefined,
          values: form.values || undefined,
          targetAudience: form.targetAudience || undefined,
          differentials: form.differentials || undefined,
          competitors: form.competitors || undefined,
          socialMedia: form.socialMedia || undefined,
          logoUrl: form.logoUrl || undefined,
          brandColors: form.brandColors || undefined,
          adminNotes: form.adminNotes || undefined,
        }
        let saved: Client
        if (mode === "create") {
          saved = await createClient(payload) as Client
        } else {
          await updateClient(editId!, payload)
          saved = { id: editId!, ...payload, status: "pendente", fillToken: null, fillExpiresAt: null, createdAt: new Date(), updatedAt: new Date() } as Client
        }
        onSaved(saved)
        onClose()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao salvar")
      }
    })
  }

  const TABS = [
    { key: "pessoal", label: "Dados Pessoais" },
    { key: "empresa", label: "Empresa" },
    { key: "identidade", label: "Identidade" },
    { key: "notas", label: "Notas Admin" },
  ] as const

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-0 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className="w-full sm:max-w-2xl sm:rounded-2xl border-0 sm:border border-border shadow-2xl sm:my-8 min-h-screen sm:min-h-0"
        style={{ background: "var(--background)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold">{mode === "create" ? "Novo Cliente" : `Editar: ${initial.name}`}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "create" ? "Cadastre o cliente que fechou negócio" : "Atualize os dados do cliente"}
            </p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-4 sm:px-6 overflow-x-auto scrollbar-none">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`py-3 px-1 mr-5 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">

          {tab === "pessoal" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>Nome completo *</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} className={INPUT} placeholder="João da Silva" /></div>
                <div><label className={LABEL}>CPF</label>
                  <input value={form.cpf} onChange={e => set("cpf", e.target.value)} className={INPUT} placeholder="000.000.000-00" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>E-mail</label>
                  <input value={form.email} onChange={e => set("email", e.target.value)} type="email" className={INPUT} placeholder="joao@empresa.com" /></div>
                <div><label className={LABEL}>Telefone</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} className={INPUT} placeholder="+55 87 3000-0000" /></div>
              </div>
              <div><label className={LABEL}>WhatsApp</label>
                <input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={INPUT} placeholder="+55 87 99999-9999" /></div>
            </>
          )}

          {tab === "empresa" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>Nome da empresa</label>
                  <input value={form.companyName} onChange={e => set("companyName", e.target.value)} className={INPUT} placeholder="Barbearia Maktub" /></div>
                <div><label className={LABEL}>CNPJ</label>
                  <input value={form.cnpj} onChange={e => set("cnpj", e.target.value)} className={INPUT} placeholder="00.000.000/0001-00" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className={LABEL}>Ano de fundação</label>
                  <input value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} className={INPUT} placeholder="2018" /></div>
                <div><label className={LABEL}>Cidade</label>
                  <input value={form.city} onChange={e => set("city", e.target.value)} className={INPUT} placeholder="Juazeiro do Norte" /></div>
                <div><label className={LABEL}>Estado</label>
                  <input value={form.state} onChange={e => set("state", e.target.value)} className={INPUT} placeholder="CE" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>Ramo / Setor</label>
                  <input value={form.sector} onChange={e => set("sector", e.target.value)} className={INPUT} placeholder="Beleza, Serviços..." /></div>
                <div><label className={LABEL}>Funcionários</label>
                  <input value={form.employees} onChange={e => set("employees", e.target.value)} className={INPUT} placeholder="1-5" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>Redes sociais</label>
                  <input value={form.socialMedia} onChange={e => set("socialMedia", e.target.value)} className={INPUT} placeholder="@empresa" /></div>
                <div><label className={LABEL}>Cores da marca</label>
                  <input value={form.brandColors} onChange={e => set("brandColors", e.target.value)} className={INPUT} placeholder="#1a1a1a, dourado" /></div>
              </div>
              <div><label className={LABEL}>URL do logotipo</label>
                <input value={form.logoUrl} onChange={e => set("logoUrl", e.target.value)} className={INPUT} placeholder="https://..." />
                {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="mt-2 h-16 w-auto rounded-lg border border-border object-contain" />}
              </div>
            </>
          )}

          {tab === "identidade" && (
            <>
              <div><label className={LABEL}>Concorrentes</label>
                <input value={form.competitors} onChange={e => set("competitors", e.target.value)} className={INPUT} placeholder="Empresa X, Empresa Y" /></div>
              <div><label className={LABEL}>Público-alvo</label>
                <textarea value={form.targetAudience} onChange={e => set("targetAudience", e.target.value)} rows={2} className={TA} placeholder="Quem são seus clientes ideais?" /></div>
              <div><label className={LABEL}>Diferenciais</label>
                <textarea value={form.differentials} onChange={e => set("differentials", e.target.value)} rows={2} className={TA} placeholder="O que faz vocês melhores?" /></div>
              <div><label className={LABEL}>Missão</label>
                <textarea value={form.mission} onChange={e => set("mission", e.target.value)} rows={2} className={TA} placeholder="Qual o propósito da empresa?" /></div>
              <div><label className={LABEL}>Visão</label>
                <textarea value={form.vision} onChange={e => set("vision", e.target.value)} rows={2} className={TA} placeholder="Onde deseja chegar?" /></div>
              <div><label className={LABEL}>Valores</label>
                <textarea value={form.values} onChange={e => set("values", e.target.value)} rows={2} className={TA} placeholder="O que é inegociável?" /></div>
            </>
          )}

          {tab === "notas" && (
            <div>
              <label className={LABEL}>Anotações internas (visíveis só para o admin)</label>
              <textarea value={form.adminNotes} onChange={e => set("adminNotes", e.target.value)} rows={6} className={TA}
                placeholder="Qualquer observação sobre o cliente, combinados, histórico de negociação..." />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-foreground text-background rounded-xl hover:opacity-90 disabled:opacity-50 transition">
            <Check className="size-4" />
            {isPending ? "Salvando..." : mode === "create" ? "Cadastrar Cliente" : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ClientDetail ──────────────────────────────────────────────────────────────
function ClientDetail({
  client, onClose, onDelete, onStatus, onFillLink,
}: {
  client: Client
  onClose: () => void
  onDelete: (id: number) => void
  onStatus: (id: number, status: string) => void
  onFillLink: (id: number) => void
}) {
  const [copied, setCopied] = useState(false)

  const fillUrl = client.fillToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/cliente/${client.fillToken}`
    : null

  function copyLink() {
    if (!fillUrl) return
    navigator.clipboard.writeText(fillUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const FIELD = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    ) : null

  return (
    <div className="flex flex-col h-full">
      {/* Header do detalhe */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Initials name={client.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base truncate">{client.name}</h3>
          {client.companyName && <p className="text-xs text-muted-foreground truncate">{client.companyName}</p>}
          <div className="mt-1"><StatusBadge status={client.status} /></div>
        </div>
        <button onClick={onClose} className="size-7 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors ml-auto shrink-0">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Contato */}
        <div className="grid grid-cols-2 gap-3">
          <FIELD label="E-mail" value={client.email} />
          <FIELD label="WhatsApp" value={client.whatsapp} />
          <FIELD label="Telefone" value={client.phone} />
          <FIELD label="CPF" value={client.cpf} />
        </div>

        {/* Empresa */}
        {(client.companyName || client.cnpj || client.sector) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Empresa</p>
            <div className="grid grid-cols-2 gap-3">
              <FIELD label="Nome" value={client.companyName} />
              <FIELD label="CNPJ" value={client.cnpj} />
              <FIELD label="Setor" value={client.sector} />
              <FIELD label="Funcionários" value={client.employees} />
              <FIELD label="Cidade / Estado" value={[client.city, client.state].filter(Boolean).join(" — ")} />
              <FIELD label="Fundação" value={client.foundedYear} />
            </div>
          </div>
        )}

        {/* Identidade */}
        {(client.mission || client.targetAudience || client.differentials) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Identidade</p>
            <div className="space-y-2">
              <FIELD label="Missão" value={client.mission} />
              <FIELD label="Visão" value={client.vision} />
              <FIELD label="Valores" value={client.values} />
              <FIELD label="Público-alvo" value={client.targetAudience} />
              <FIELD label="Diferenciais" value={client.differentials} />
              <FIELD label="Concorrentes" value={client.competitors} />
              <FIELD label="Redes sociais" value={client.socialMedia} />
              <FIELD label="Cores da marca" value={client.brandColors} />
            </div>
          </div>
        )}

        {client.adminNotes && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Notas internas</p>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{client.adminNotes}</p>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">Cadastrado em {fmtDate(client.createdAt)}</p>
      </div>

      {/* Ações */}
      <div className="shrink-0 border-t border-border p-4 space-y-3">
        {/* Status */}
        <div className="flex gap-2">
          {["pendente", "aprovado", "rejeitado"].map(s => (
            <button key={s} onClick={() => onStatus(client.id, s)}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${
                client.status === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary text-muted-foreground"
              }`}>
              {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
            </button>
          ))}
        </div>

        {/* Link de preenchimento */}
        <div className="flex gap-2">
          <button onClick={() => onFillLink(client.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold transition-colors">
            <Link2 className="size-3.5" />
            {client.fillToken ? "Regenerar link" : "Gerar link de preenchimento"}
          </button>
          {fillUrl && (
            <button onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold transition-colors">
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          )}
          {fillUrl && (
            <a href={fillUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold transition-colors">
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        {/* Link info */}
        {fillUrl && (
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Link compartilhável</p>
            <p className="text-xs font-mono break-all text-foreground/70">{fillUrl}</p>
            {client.fillExpiresAt && (
              <p className="text-[10px] text-muted-foreground mt-1">Expira em {fmtDate(client.fillExpiresAt)}</p>
            )}
          </div>
        )}

        {/* Excluir */}
        <button onClick={() => onDelete(client.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/5 text-xs font-semibold transition-colors">
          <Trash2 className="size-3.5" />
          Excluir cliente
        </button>
      </div>
    </div>
  )
}

// ── ClientsAdmin (main export) ───────────────────────────────────────────────
export function ClientsAdmin({ initialClients, onClientsChange }: {
  initialClients: Client[]
  onClientsChange?: (clients: Client[]) => void
}) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [selected, setSelected] = useState<Client | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [, startTransition] = useTransition()

  function update(updated: Client[]) {
    setClients(updated)
    onClientsChange?.(updated)
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este cliente permanentemente?")) return
    await deleteClient(id)
    const next = clients.filter(c => c.id !== id)
    update(next)
    if (selected?.id === id) setSelected(null)
  }

  async function handleStatus(id: number, status: string) {
    startTransition(async () => {
      await updateClient(id, { status })
      const next = clients.map(c => c.id === id ? { ...c, status } : c)
      update(next)
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    })
  }

  async function handleFillLink(id: number) {
    const token = await generateClientFillLink(id)
    const next = clients.map(c => c.id === id ? { ...c, fillToken: token, fillExpiresAt: new Date(Date.now() + 7 * 86400000) } : c)
    update(next)
    if (selected?.id === id) setSelected(next.find(c => c.id === id) ?? null)
  }

  function handleSaved(c: Client) {
    const exists = clients.find(x => x.id === c.id)
    let next: Client[]
    if (exists) {
      next = clients.map(x => x.id === c.id ? c : x)
    } else {
      next = [c, ...clients]
    }
    update(next)
    setSelected(c)
  }

  const filtered = clients.filter(c => {
    const matchStatus = statusFilter === "todos" || c.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) ||
      (c.companyName ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = {
    todos:     clients.length,
    pendente:  clients.filter(c => c.status === "pendente").length,
    aprovado:  clients.filter(c => c.status === "aprovado").length,
    rejeitado: clients.filter(c => c.status === "rejeitado").length,
  }

  const FILTER_TABS = [
    { key: "todos",     label: "Todos",     icon: User },
    { key: "pendente",  label: "Pendentes", icon: Clock },
    { key: "aprovado",  label: "Aprovados", icon: CheckCircle2 },
    { key: "rejeitado", label: "Rejeitados",icon: XCircle },
  ] as const

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
        {/* Filtro de status */}
        <div className="flex gap-1 p-0.5 rounded-lg border border-border bg-secondary/50 overflow-x-auto">
          {FILTER_TABS.map(t => {
            const Icon = t.icon
            const count = counts[t.key]
            return (
              <button key={t.key} onClick={() => setStatusFilter(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="size-3" />
                {t.label}
                {count > 0 && statusFilter !== t.key && (
                  <span className="text-[10px] font-bold tabular-nums">{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[160px] flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-secondary text-xs">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Buscar nome, empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full placeholder:text-muted-foreground"
          />
          {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
        </div>

        {/* New client */}
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition shrink-0">
          <Plus className="size-3.5" />
          Novo Cliente
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* List */}
        <div className="w-full sm:w-80 lg:w-96 shrink-0 border-r-0 sm:border-r border-border overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
              <User className="size-8 opacity-25" />
              <p className="text-sm">Nenhum cliente encontrado</p>
            </div>
          ) : (
            filtered.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left px-4 py-4 border-b border-border transition-colors hover:bg-secondary flex gap-3 items-start ${selected?.id === c.id ? "bg-secondary" : ""}`}>
                <Initials name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  {c.companyName && <p className="text-xs text-muted-foreground truncate">{c.companyName}</p>}
                  {c.email && <p className="text-xs text-muted-foreground truncate opacity-70">{c.email}</p>}
                  <p className="text-[10px] text-muted-foreground opacity-50 mt-1">{fmtDate(c.createdAt)}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="hidden sm:flex flex-1 overflow-y-auto">
          {!selected ? (
            <div className="flex flex-col items-center justify-center w-full gap-3 text-muted-foreground p-8">
              <div className="size-14 rounded-2xl border border-border flex items-center justify-center bg-secondary">
                <User className="size-6 opacity-30" />
              </div>
              <p className="text-sm">Selecione um cliente para ver os detalhes</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-end px-4 py-2 border-b border-border">
                <button onClick={() => setEditClient(selected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-semibold transition-colors">
                  <Pencil className="size-3" />
                  Editar
                </button>
              </div>
              <ClientDetail
                client={selected}
                onClose={() => setSelected(null)}
                onDelete={handleDelete}
                onStatus={handleStatus}
                onFillLink={handleFillLink}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <ClientFormModal
          initial={blankForm()}
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={handleSaved}
        />
      )}
      {editClient && (
        <ClientFormModal
          initial={rowToForm(editClient)}
          mode="edit"
          editId={editClient.id}
          onClose={() => setEditClient(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

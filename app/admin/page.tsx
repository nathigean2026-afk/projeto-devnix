"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { getLeads, markLeadRead, updateLeadStatus, deleteLead } from "@/app/actions/leads"
import type { Lead } from "@/lib/db/schema"
import {
  Mail, Phone, MessageSquare, Trash2, CheckCircle2,
  LogOut, Clock, TrendingUp, Users, Inbox,
  ChevronDown, Search, Sun, Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  novo:        { label: "Novo",        color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  lido:        { label: "Lido",        color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25" },
  contatado:   { label: "Contatado",   color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  convertido:  { label: "Convertido",  color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  arquivado:   { label: "Arquivado",   color: "bg-zinc-700/30 text-zinc-500 border-zinc-600/25" },
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function AdminDashboard() {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setMounted(true) }, [])

  async function load() {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch {
      router.push("/sign-in")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
  }

  function openLead(lead: Lead) {
    setSelected(lead)
    if (lead.status === "novo") {
      startTransition(async () => {
        await markLeadRead(lead.id)
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "lido", readAt: new Date() } : l))
      })
    }
  }

  async function handleStatus(id: number, status: string) {
    await updateLeadStatus(id, status)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev)
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este lead permanentemente?")) return
    await deleteLead(id)
    setLeads(prev => prev.filter(l => l.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
      || l.email.toLowerCase().includes(search.toLowerCase())
      || (l.subject?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchStatus = filterStatus === "todos" || l.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === "novo").length,
    convertidos: leads.filter(l => l.status === "convertido").length,
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar admin */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="Devnix" width={32} height={32} className="object-contain" />
            <div>
              <span className="font-bold text-sm text-foreground">Devnix</span>
              <span className="text-muted-foreground text-xs ml-1.5">/ Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="size-9 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition"
              aria-label="Alternar tema"
            >
              {mounted && resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg border border-border transition"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto w-full px-6 py-8 flex-1">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Inbox, label: "Total de Leads", value: stats.total, color: "text-foreground" },
            { icon: Clock, label: "Novos (não lidos)", value: stats.novos, color: "text-blue-400" },
            { icon: TrendingUp, label: "Convertidos", value: stats.convertidos, color: "text-emerald-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className={`size-12 rounded-xl border border-border flex items-center justify-center ${color}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lead list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/15 transition"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/15 transition cursor-pointer"
              >
                <option value="todos">Todos</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
                ))
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="size-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Nenhum lead encontrado.</p>
                </div>
              ) : filtered.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => openLead(lead)}
                  className={`w-full text-left rounded-xl border p-4 transition-all hover:border-foreground/20 ${selected?.id === lead.id ? "border-foreground/30 bg-secondary" : "border-border bg-card"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {lead.status === "novo" && <span className="size-2 rounded-full bg-blue-400 flex-shrink-0" />}
                        <span className="font-medium text-sm text-foreground truncate">{lead.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                      {lead.subject && <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.subject}</p>}
                    </div>
                    <span className={`text-xs border rounded-full px-2 py-0.5 flex-shrink-0 ${STATUS_LABELS[lead.status]?.color ?? ""}`}>
                      {STATUS_LABELS[lead.status]?.label ?? lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(lead.createdAt)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Lead detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="rounded-2xl border border-border bg-card h-full min-h-80 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Inbox className="size-10 opacity-30" />
                <p className="text-sm">Selecione um lead para ver os detalhes</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">{formatDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status select */}
                    <div className="relative">
                      <select
                        value={selected.status}
                        onChange={e => handleStatus(selected.id, e.target.value)}
                        className={`appearance-none text-xs border rounded-full pl-3 pr-7 py-1.5 font-medium cursor-pointer focus:outline-none transition bg-transparent ${STATUS_LABELS[selected.status]?.color ?? ""}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k} className="bg-background text-foreground">{v.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="size-8 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/30 flex items-center justify-center transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition group">
                    <Mail className="size-4 text-muted-foreground group-hover:text-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">E-mail</p>
                      <p className="text-sm font-medium text-foreground truncate">{selected.email}</p>
                    </div>
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition group">
                      <Phone className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm font-medium text-foreground">{selected.phone}</p>
                      </div>
                    </a>
                  )}
                  {selected.whatsapp && (
                    <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition group">
                      <MessageSquare className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">WhatsApp</p>
                        <p className="text-sm font-medium text-foreground">{selected.whatsapp}</p>
                      </div>
                    </a>
                  )}
                  {selected.plan && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/50">
                      <CheckCircle2 className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Plano de interesse</p>
                        <p className="text-sm font-medium text-foreground">{selected.plan}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subject + Message */}
                {selected.subject && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Assunto</p>
                    <p className="text-sm text-foreground font-medium">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Mensagem</p>
                  <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 flex-wrap pt-1">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "Seu projeto")}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
                  >
                    <Mail className="size-4" />
                    Responder por e-mail
                  </a>
                  {selected.whatsapp && (
                    <a
                      href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Vi sua mensagem na Devnix e gostaria de conversar sobre seu projeto.")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition"
                    >
                      <MessageSquare className="size-4" />
                      Responder WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

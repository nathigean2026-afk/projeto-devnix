"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { getLeads, updateLeadStatus, deleteLead } from "@/app/actions/leads"
import type { Lead } from "@/lib/db/schema"
import {
  Mail, Phone, MessageSquare, Trash2, CheckCircle2,
  LogOut, Clock, TrendingUp, Inbox, Search, Sun, Moon,
  ThumbsUp, ArrowUpRight, RefreshCw, Filter, User,
} from "lucide-react"
import { useTheme } from "next-themes"

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  novo:        { label: "Novo",        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",     dot: "bg-blue-400" },
  lido:        { label: "Lido",        color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",     dot: "bg-zinc-400" },
  pendente:    { label: "Pendente",    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",  dot: "bg-amber-400" },
  respondido:  { label: "Respondido",  color: "bg-green-500/10 text-green-400 border-green-500/20",  dot: "bg-green-400" },
  aprovado:    { label: "Aprovado",    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
}

const TABS = [
  { key: "todos",      label: "Todos",       icon: Inbox },
  { key: "novo",       label: "Novos",       icon: Mail },
  { key: "pendente",   label: "Pendentes",   icon: Clock },
  { key: "respondido", label: "Respondidos", icon: CheckCircle2 },
  { key: "aprovado",   label: "Aprovados",   icon: ThumbsUp },
] as const

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(d))
}

function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const letters = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
  const cls = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-12 text-base" : "size-10 text-sm"
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ background: "var(--foreground)", color: "var(--background)" }}
    >
      {letters}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG["lido"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.color}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoaded, setLeadsLoaded] = useState(false)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState("todos")
  const [search, setSearch] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [, startTransition] = useTransition()

  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const isDark = resolvedTheme === "dark"

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    // Only redirect after the session check is fully resolved AND no session exists.
    // We use a small debounce to avoid false redirects during re-hydration.
    if (sessionLoading) return
    if (!session?.user) {
      const timer = setTimeout(() => {
        // Double-check: if still no session after 300ms, redirect
        authClient.getSession().then(({ data }) => {
          if (!data?.user) router.push("/sign-in")
        })
      }, 300)
      return () => clearTimeout(timer)
    }
    if (!leadsLoaded) loadLeads()
  }, [session, sessionLoading]) // eslint-disable-line

  async function loadLeads() {
    try {
      const data = await getLeads()
      setLeads(data as Lead[])
      setLeadsLoaded(true)
    } catch {
      router.push("/sign-in")
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    await loadLeads()
    setTimeout(() => setRefreshing(false), 500)
  }

  async function handleStatus(id: number, status: string) {
    startTransition(async () => {
      await updateLeadStatus(id, status)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    })
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este lead permanentemente?")) return
    await deleteLead(id)
    setLeads(prev => prev.filter(l => l.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
  }

  const filtered = leads.filter(l => {
    const matchTab = activeTab === "todos" || l.status === activeTab
    const q = search.toLowerCase()
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.subject ?? "").toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  const counts = {
    todos:      leads.length,
    novo:       leads.filter(l => l.status === "novo").length,
    pendente:   leads.filter(l => l.status === "pendente").length,
    respondido: leads.filter(l => l.status === "respondido").length,
    aprovado:   leads.filter(l => l.status === "aprovado").length,
  }

  if (sessionLoading || !leadsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-border border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">

      {/* ── Navbar ── */}
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 gap-3 overflow-hidden"
        style={{ background: "var(--background)" }}>

        {/* Logo compacta — tamanho fixo, nunca cresce */}
        <a href="/" className="flex items-center gap-2 shrink-0 group min-w-0">
          <Image
            src="/logo-icon.png"
            alt="Devnix"
            width={24}
            height={24}
            className={`object-contain shrink-0 transition-all${mounted && !isDark ? " brightness-0" : ""}`}
            style={{ width: "24px", height: "24px" }}
          />
          <span className="text-sm font-bold leading-none">Devnix</span>
          <span className="text-xs text-muted-foreground hidden sm:inline leading-none">/&nbsp;Admin</span>
        </a>

        <div className="flex items-center gap-2 shrink-0">
          {/* User badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs max-w-[160px] overflow-hidden">
            <User className="size-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground font-medium truncate">
              {session.user.name ?? session.user.email}
            </span>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition shrink-0"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition shrink-0"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* ── Stats strip ── */}
      <div className="shrink-0 border-b border-border px-5 py-3 flex items-center gap-8 overflow-x-auto"
        style={{ background: "var(--secondary)" }}>
        <div className="flex items-center gap-2 shrink-0">
          <Inbox className="size-4 text-muted-foreground" />
          <span className="text-xl font-black">{counts.todos}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
        <div className="w-px h-5 bg-border shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          <span className="size-2 rounded-full bg-blue-400" />
          <span className="text-xl font-black text-blue-400">{counts.novo}</span>
          <span className="text-xs text-muted-foreground">Novos</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="text-xl font-black text-amber-400">{counts.pendente}</span>
          <span className="text-xs text-muted-foreground">Pendentes</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="size-2 rounded-full bg-green-400" />
          <span className="text-xl font-black text-green-400">{counts.respondido}</span>
          <span className="text-xs text-muted-foreground">Respondidos</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xl font-black text-emerald-400">{counts.aprovado}</span>
          <span className="text-xs text-muted-foreground">Aprovados</span>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="size-7 rounded-md border border-border flex items-center justify-center hover:bg-background transition"
            aria-label="Atualizar"
          >
            <RefreshCw className={`size-3 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Main: list + detail ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Left: list panel ── */}
        <div className="w-80 lg:w-96 shrink-0 flex flex-col border-r border-border overflow-hidden">

          {/* Tabs */}
          <div className="px-3 pt-3 pb-2 flex items-center gap-1 overflow-x-auto shrink-0">
            {TABS.map(tab => {
              const count = counts[tab.key as keyof typeof counts]
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="size-3" />
                  {tab.label}
                  {count > 0 && !active && (
                    <span className={`font-bold tabular-nums ${
                      tab.key === "novo" ? "text-blue-400" :
                      tab.key === "pendente" ? "text-amber-400" :
                      tab.key === "aprovado" ? "text-emerald-400" : "text-muted-foreground"
                    }`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="px-3 pb-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary text-xs">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar nome, email, assunto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <Filter className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Lead list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                <Inbox className="size-8 opacity-25" />
                <p className="text-xs">Nenhum lead encontrado</p>
              </div>
            ) : (
              filtered.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`w-full text-left px-4 py-3.5 border-b border-border transition-colors hover:bg-secondary flex gap-3 items-start ${
                    selected?.id === lead.id ? "bg-secondary" : ""
                  }`}
                >
                  <Initials name={lead.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-sm font-semibold truncate">{lead.name}</span>
                      <StatusBadge status={lead.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                    {lead.subject && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 opacity-70">{lead.subject}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground opacity-50 mt-1.5">{fmtDate(lead.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: detail panel ── */}
        <div className="flex-1 overflow-y-auto">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground p-8">
              <div className="size-14 rounded-2xl border border-border flex items-center justify-center bg-secondary">
                <Inbox className="size-6 opacity-30" />
              </div>
              <p className="text-sm">Selecione um lead para ver os detalhes</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 space-y-5">

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Initials name={selected.name} size="lg" />
                  <div>
                    <h2 className="text-xl font-bold leading-tight">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">{selected.email}</p>
                    <p className="text-xs text-muted-foreground opacity-60 mt-0.5">{fmtDate(selected.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={selected.status} />
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="size-8 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/20 flex items-center justify-center transition"
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const url = `mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "Sua solicitação — Devnix")}`
                    // Open outside iframe if inside one (v0 preview)
                    try { (window.top ?? window).open(url, "_blank") } catch { window.open(url, "_blank") }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}
                >
                  <Mail className="size-4" />
                  Responder por E-mail
                  <ArrowUpRight className="size-3.5 opacity-60" />
                </button>
                {selected.whatsapp && (
                  <button
                    onClick={() => {
                      const url = `https://wa.me/${selected.whatsapp!.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${selected.name}! Tudo bem? Vi sua mensagem na Devnix e gostaria de conversar sobre o seu projeto.`)}`
                      try { (window.top ?? window).open(url, "_blank") } catch { window.open(url, "_blank") }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#25d366]/30 text-[#25d366] bg-[#25d366]/10 hover:bg-[#25d366]/20 transition-all active:scale-95"
                  >
                    <MessageSquare className="size-4" />
                    WhatsApp
                    <ArrowUpRight className="size-3.5 opacity-60" />
                  </button>
                )}
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  >
                    <Phone className="size-4" />
                    {selected.phone}
                  </a>
                )}
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selected.whatsapp && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                    <MessageSquare className="size-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">WhatsApp</p>
                      <p className="text-sm font-medium truncate">{selected.whatsapp}</p>
                    </div>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Telefone</p>
                      <p className="text-sm font-medium truncate">{selected.phone}</p>
                    </div>
                  </div>
                )}
                {selected.plan && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                    <TrendingUp className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Plano</p>
                      <p className="text-sm font-medium">{selected.plan}</p>
                    </div>
                  </div>
                )}
                {selected.readAt && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                    <CheckCircle2 className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Lido em</p>
                      <p className="text-sm font-medium">{fmtDate(selected.readAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              {selected.subject && (
                <div className="rounded-xl border border-border p-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Assunto</p>
                  <p className="text-sm font-medium">{selected.subject}</p>
                </div>
              )}

              {/* Message */}
              <div className="rounded-xl border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Mensagem</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{selected.message}</p>
              </div>

              {/* Status actions */}
              <div className="rounded-xl border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Mover para</p>
                <div className="flex flex-wrap gap-2">
                  {(["novo", "pendente", "respondido", "aprovado"] as const).map(status => {
                    const s = STATUS_CONFIG[status]
                    const isActive = selected.status === status
                    return (
                      <button
                        key={status}
                        onClick={() => !isActive && handleStatus(selected.id, status)}
                        disabled={isActive}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isActive
                            ? `${s.color} cursor-default`
                            : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { getLeads, updateLeadStatus, deleteLead, getQuotes } from "@/app/actions/leads"
import { getProjects } from "@/app/actions/projects"
import type { Lead, ProjectRow, Quote } from "@/lib/db/schema"
import { ProjectsAdmin } from "@/components/admin-projects"
import { QuotesAdmin } from "@/components/admin-quotes"
import {
  Mail, Phone, MessageSquare, Trash2, CheckCircle2,
  LogOut, Clock, TrendingUp, Inbox, Search, Sun, Moon,
  ThumbsUp, ArrowUpRight, RefreshCw, User, Layers,
  ChevronLeft, X, Globe, FileText, MapPin, Wifi,
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
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [projectsLoaded, setProjectsLoaded] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quotesLoaded, setQuotesLoaded] = useState(false)
  // On mobile: selected lead opens as a full-screen sheet
  const [selected, setSelected] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState("todos")
  const [activeSection, setActiveSection] = useState<"leads" | "projetos" | "orcamentos">("leads")
  const [search, setSearch] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [, startTransition] = useTransition()

  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const isDark = resolvedTheme === "dark"

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (sessionLoading) return
    if (!session?.user) {
      const timer = setTimeout(() => {
        authClient.getSession().then(({ data }) => {
          if (!data?.user) router.push("/sign-in")
        })
      }, 300)
      return () => clearTimeout(timer)
    }
    if (!leadsLoaded) loadLeads()
    if (!projectsLoaded) loadProjects()
    if (!quotesLoaded) loadQuotes()
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

  async function loadProjects() {
    try {
      const data = await getProjects()
      setProjects(data as ProjectRow[])
      setProjectsLoaded(true)
    } catch {
      // silently fail
    }
  }

  async function loadQuotes() {
    try {
      const data = await getQuotes()
      setQuotes(data as Quote[])
      setQuotesLoaded(true)
    } catch {
      // silently fail
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
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-background text-foreground">

      {/* ── Navbar ── */}
      <header
        className="h-14 shrink-0 border-b border-border flex items-center justify-between px-3 sm:px-4 gap-2"
        style={{ background: "var(--background)" }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 group min-w-0">
          <Image
            src={mounted && !isDark ? "/logo-full-dark.webp" : "/logo-full-light.webp"}
            alt="Elevanthe"
            width={90}
            height={28}
            className="object-contain shrink-0 transition-all"
            style={{ width: "auto", maxHeight: "28px" }}
          />
        </a>

        {/* Center: section toggle — visible on ALL sizes */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-secondary/50">
          <button
            onClick={() => setActiveSection("leads")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSection === "leads"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="size-3.5" />
            <span>Leads</span>
            {counts.novo > 0 && activeSection !== "leads" && (
              <span className="size-4 rounded-full bg-blue-400 text-white text-[9px] font-bold flex items-center justify-center">{counts.novo}</span>
            )}
          </button>
          <button
            onClick={() => setActiveSection("projetos")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSection === "projetos"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Projetos</span>
          </button>
          <button
            onClick={() => setActiveSection("orcamentos")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSection === "orcamentos"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">Orçamentos</span>
            <span className="sm:hidden">Orç.</span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* User badge — desktop only */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs max-w-[140px] overflow-hidden">
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
            className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition shrink-0"
            aria-label="Sair"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </header>

      {/* ── PROJETOS section ── */}
      {activeSection === "projetos" && (
        <div className="flex-1 overflow-y-auto">
          <ProjectsAdmin initialProjects={projects} />
        </div>
      )}

      {/* ── ORÇAMENTOS section ── */}
      {activeSection === "orcamentos" && (
        <div className="flex-1 overflow-y-auto">
          <QuotesAdmin
            initialQuotes={quotes}
            onQuotesChange={setQuotes}
          />
        </div>
      )}

      {/* ── LEADS section ── */}
      {activeSection === "leads" && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">

          {/* Stats strip — grid on mobile, row on desktop */}
          <div
            className="shrink-0 border-b border-border px-4 py-3 grid grid-cols-2 sm:flex sm:flex-row sm:items-center gap-3 sm:gap-6"
            style={{ background: "var(--secondary)" }}
          >
            <div className="flex items-center gap-2">
              <Inbox className="size-4 text-muted-foreground shrink-0" />
              <span className="text-lg font-black">{counts.todos}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-400 shrink-0" />
              <span className="text-lg font-black text-blue-400">{counts.novo}</span>
              <span className="text-xs text-muted-foreground">Novos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-lg font-black text-amber-400">{counts.pendente}</span>
              <span className="text-xs text-muted-foreground">Pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-lg font-black text-green-400">{counts.respondido}</span>
              <span className="text-xs text-muted-foreground">Respondidos</span>
            </div>
            {/* Refresh — hidden on mobile grid, shown on desktop */}
            <div className="hidden sm:flex ml-auto">
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

          {/* Tabs */}
          <div className="px-3 pt-3 pb-2 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
            {TABS.map(tab => {
              const count = counts[tab.key as keyof typeof counts]
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="size-3.5" />
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
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar nome, email, assunto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full placeholder:text-muted-foreground text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ── Two-panel on desktop, list-only on mobile ── */}
          <div className="flex flex-1 overflow-hidden min-h-0">

            {/* Lead list — full width mobile, fixed width desktop */}
            <div className="w-full sm:w-80 lg:w-96 shrink-0 flex flex-col border-r-0 sm:border-r border-border overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                    <Inbox className="size-8 opacity-25" />
                    <p className="text-sm">Nenhum lead encontrado</p>
                  </div>
                ) : (
                  filtered.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => setSelected(lead)}
                      className={`w-full text-left px-4 py-4 border-b border-border transition-colors hover:bg-secondary flex gap-3 items-start ${
                        selected?.id === lead.id ? "bg-secondary" : ""
                      }`}
                    >
                      <Initials name={lead.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
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

            {/* Detail panel — hidden on mobile (shown as sheet), visible on desktop */}
            <div className="hidden sm:flex flex-1 overflow-y-auto">
              {!selected ? (
                <div className="flex flex-col items-center justify-center w-full gap-3 text-muted-foreground p-8">
                  <div className="size-14 rounded-2xl border border-border flex items-center justify-center bg-secondary">
                    <Inbox className="size-6 opacity-30" />
                  </div>
                  <p className="text-sm">Selecione um lead para ver os detalhes</p>
                </div>
              ) : (
                <LeadDetail
                  lead={selected}
                  onClose={() => setSelected(null)}
                  onDelete={handleDelete}
                  onStatus={handleStatus}
                  showBack={false}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile lead detail sheet (slides up over the list) ── */}
      {selected && activeSection === "leads" && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
          <LeadDetail
            lead={selected}
            onClose={() => setSelected(null)}
            onDelete={handleDelete}
            onStatus={handleStatus}
            showBack={true}
          />
        </div>
      )}
    </div>
  )
}

/* ── Extracted lead detail — reused on mobile sheet and desktop panel ── */
function LeadDetail({
  lead,
  onClose,
  onDelete,
  onStatus,
  showBack,
}: {
  lead: Lead
  onClose: () => void
  onDelete: (id: number) => void
  onStatus: (id: number, status: string) => void
  showBack: boolean
}) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Sheet header — only on mobile */}
      {showBack && (
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ChevronLeft className="size-4" />
            Leads
          </button>
          <button
            onClick={() => { onDelete(lead.id); onClose() }}
            className="size-8 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/20 flex items-center justify-center transition"
            aria-label="Excluir"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Initials name={lead.name} size="lg" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold leading-tight">{lead.name}</h2>
                <p className="text-sm text-muted-foreground break-all">{lead.email}</p>
                <p className="text-xs text-muted-foreground opacity-60 mt-0.5">{fmtDate(lead.createdAt)}</p>
              </div>
            </div>
            {/* Desktop-only delete + status */}
            {!showBack && (
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={lead.status} />
                <button
                  onClick={() => onDelete(lead.id)}
                  className="size-8 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/20 flex items-center justify-center transition"
                  aria-label="Excluir"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}
            {/* Mobile: just show badge */}
            {showBack && <StatusBadge status={lead.status} />}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const url = `mailto:${lead.email}?subject=Re: ${encodeURIComponent(lead.subject ?? "Sua solicitação — Elevanthe")}`
                try { (window.top ?? window).open(url, "_blank") } catch { window.open(url, "_blank") }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              <Mail className="size-4" />
              <span>Responder por E-mail</span>
              <ArrowUpRight className="size-3.5 opacity-60" />
            </button>
            {lead.whatsapp && (
              <button
                onClick={() => {
                  const url = `https://wa.me/${lead.whatsapp!.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${lead.name}! Tudo bem? Vi sua mensagem na Elevanthe e gostaria de conversar sobre o seu projeto.`)}`
                  try { (window.top ?? window).open(url, "_blank") } catch { window.open(url, "_blank") }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#25d366]/30 text-[#25d366] bg-[#25d366]/10 hover:bg-[#25d366]/20 transition-all active:scale-95"
              >
                <MessageSquare className="size-4" />
                WhatsApp
                <ArrowUpRight className="size-3.5 opacity-60" />
              </button>
            )}
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Phone className="size-4" />
                {lead.phone}
              </a>
            )}
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lead.whatsapp && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                <MessageSquare className="size-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">WhatsApp</p>
                  <p className="text-sm font-medium truncate">{lead.whatsapp}</p>
                </div>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Telefone</p>
                  <p className="text-sm font-medium truncate">{lead.phone}</p>
                </div>
              </div>
            )}
            {lead.plan && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                <TrendingUp className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Plano</p>
                  <p className="text-sm font-medium">{lead.plan}</p>
                </div>
              </div>
            )}
            {lead.readAt && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
                <CheckCircle2 className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Lido em</p>
                  <p className="text-sm font-medium">{fmtDate(lead.readAt)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Subject */}
          {lead.subject && (
            <div className="rounded-xl border border-border p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Assunto</p>
              <p className="text-sm font-medium">{lead.subject}</p>
            </div>
          )}

          {/* Message */}
          <div className="rounded-xl border border-border p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Mensagem</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{lead.message}</p>
          </div>

          {/* Geo / origem */}
          {(lead.ip || lead.city || lead.isp) && (
            <div className="rounded-xl border border-border p-4 space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Origem da mensagem</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lead.ip && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">IP</p>
                      <p className="text-xs font-mono font-medium">{lead.ip}</p>
                    </div>
                  </div>
                )}
                {(lead.city || lead.region || lead.country) && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Localização</p>
                      <p className="text-xs font-medium">{[lead.city, lead.region, lead.country].filter(Boolean).join(", ")}</p>
                    </div>
                  </div>
                )}
                {lead.isp && (
                  <div className="flex items-center gap-2.5 col-span-full">
                    <Wifi className="size-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Provedor (ISP)</p>
                      <p className="text-xs font-medium">{lead.isp}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status actions */}
          <div className="rounded-xl border border-border p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Mover para</p>
            <div className="flex flex-wrap gap-2">
              {(["novo", "pendente", "respondido", "aprovado"] as const).map(status => {
                const s = STATUS_CONFIG[status]
                const isActive = lead.status === status
                return (
                  <button
                    key={status}
                    onClick={() => !isActive && onStatus(lead.id, status)}
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

          {/* Extra padding bottom for mobile safe area */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  )
}

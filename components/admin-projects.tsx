"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pencil, Trash2, Eye, Save, X,
  ImagePlus, ExternalLink, GripVertical,
} from "lucide-react"
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createProject, updateProject, deleteProject, getProjects, reorderProjects } from "@/app/actions/projects"
import type { ProjectRow } from "@/lib/db/schema"

// ── Types ────────────────────────────────────────────────────────────────────
type Screenshot = { src: string; caption: string }
type BeforeAfter = { before: string; after: string }

const COVER_OPTIONS = [
  { value: "barbearia", label: "Barbearia", color: "#b45309" },
  { value: "saas", label: "SaaS / Software", color: "#3b82f6" },
  { value: "ecommerce", label: "E-commerce", color: "#e11d48" },
  { value: "dashboard", label: "Dashboard", color: "#10b981" },
  { value: "portal", label: "Portal", color: "#8b5cf6" },
  { value: "landing", label: "Landing Page", color: "#f59e0b" },
  { value: "blog", label: "Blog / Conteúdo", color: "#0ea5e9" },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function TagInput({
  label, values, onChange, placeholder,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("")
  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setInput("")
  }
  return (
    <div>
      <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-muted-foreground hover:text-foreground">
              <X className="size-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
          + Add
        </button>
      </div>
    </div>
  )
}

function ScreenshotEditor({
  screenshots, onChange,
}: { screenshots: Screenshot[]; onChange: (s: Screenshot[]) => void }) {
  const add = () => onChange([...screenshots, { src: "", caption: "" }])
  const update = (i: number, field: keyof Screenshot, val: string) => {
    const next = [...screenshots]
    next[i] = { ...next[i], [field]: val }
    onChange(next)
  }
  const remove = (i: number) => onChange(screenshots.filter((_, idx) => idx !== i))

  return (
    <div>
      <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Galeria de Screenshots</label>
      <div className="space-y-3">
        {screenshots.map((s, i) => (
          <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-border bg-secondary/30">
            <div className="flex-1 space-y-2">
              <input
                value={s.src}
                onChange={(e) => update(i, "src", e.target.value)}
                placeholder="URL da imagem (/images/screen.png)"
                className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-background focus:outline-none focus:border-foreground/30"
              />
              <input
                value={s.caption}
                onChange={(e) => update(i, "caption", e.target.value)}
                placeholder="Legenda da imagem"
                className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-background focus:outline-none focus:border-foreground/30"
              />
              {s.src && (
                <img src={s.src} alt={s.caption} className="h-20 w-auto rounded-lg object-cover border border-border" />
              )}
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-1 text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-xl px-4 py-3 w-full transition-colors">
          <ImagePlus className="size-3.5" /> Adicionar screenshot
        </button>
      </div>
    </div>
  )
}

// ── Blank project form ───────────────────────────────────────────────────────
function blankForm(): ProjectFormState {
  return {
    slug: "", title: "", category: "", desc: "", cover: "saas", col: "",
    tech: [], liveUrl: "", challenge: "", solution: "",
    results: [], duration: "", stack: [],
    screenshots: [],
    beforeAfter: null,
    useBeforeAfter: false,
    coverImageUrl: "",
    coverImageMode: "none",
    published: true,
  }
}

type ProjectFormState = {
  slug: string; title: string; category: string; desc: string; cover: string; col: string;
  tech: string[]; liveUrl: string; challenge: string; solution: string;
  results: string[]; duration: string; stack: string[];
  screenshots: Screenshot[];
  beforeAfter: BeforeAfter | null;
  useBeforeAfter: boolean;
  coverImageUrl: string;
  coverImageMode: "none" | "single" | "before_after";
  published: boolean;
}

function rowToForm(p: ProjectRow): ProjectFormState {
  const hasCoverImg = !!p.coverImageUrl
  const mode = hasCoverImg ? ((p.coverImageMode ?? "single") as "single" | "before_after") : "none"
  return {
    slug: p.slug, title: p.title, category: p.category, desc: p.desc,
    cover: p.cover, col: p.col ?? "",
    tech: (p.tech as string[]) ?? [],
    liveUrl: p.liveUrl ?? "",
    challenge: p.challenge ?? "", solution: p.solution ?? "",
    results: (p.results as string[]) ?? [],
    duration: p.duration ?? "",
    stack: (p.stack as string[]) ?? [],
    screenshots: (p.screenshots as Screenshot[]) ?? [],
    beforeAfter: (p.beforeAfter as BeforeAfter | null) ?? null,
    useBeforeAfter: !!(p.beforeAfter as BeforeAfter | null)?.before,
    coverImageUrl: p.coverImageUrl ?? "",
    coverImageMode: mode,
    published: p.published,
  }
}

// ── Main form modal ──────────────────────────────────────────────────────────
function ProjectFormModal({
  initial, mode, editId, onClose, onSaved,
}: {
  initial: ProjectFormState
  mode: "create" | "edit"
  editId?: number
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<ProjectFormState>(initial)
  const [isPending, startTransition] = useTransition()
  const [section, setSection] = useState<"basic" | "story" | "media">("basic")
  const [error, setError] = useState("")

  const set = <K extends keyof ProjectFormState>(k: K, v: ProjectFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: mode === "create" ? slugify(val) : f.slug }))
  }

  const handleSubmit = () => {
    if (!form.slug || !form.title || !form.category || !form.desc) {
      setError("Preencha os campos obrigatórios: slug, título, categoria e descrição.")
      return
    }
    setError("")
    const isSingle = form.coverImageMode === "single"
    const isBA = form.coverImageMode === "before_after"
    const payload = {
      slug: form.slug,
      title: form.title,
      category: form.category,
      desc: form.desc,
      cover: form.cover,
      col: form.col,
      tech: form.tech,
      liveUrl: form.liveUrl || null,
      challenge: form.challenge || null,
      solution: form.solution || null,
      results: form.results,
      duration: form.duration || null,
      stack: form.stack,
      screenshots: form.screenshots,
      coverImageUrl: isSingle ? (form.coverImageUrl || null) : null,
      coverImageMode: form.coverImageMode === "none" ? "single" : form.coverImageMode,
      beforeAfter: isBA && form.beforeAfter?.before ? form.beforeAfter : (form.useBeforeAfter && form.beforeAfter?.before ? form.beforeAfter : null),
      published: form.published,
    }
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createProject(payload)
        } else if (editId !== undefined) {
          await updateProject(editId, payload)
        }
        onSaved()
        onClose()
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao salvar")
      }
    })
  }

  const SECTIONS = [
    { key: "basic", label: "Informações Básicas" },
    { key: "story", label: "Desafio / Solução / Resultados" },
    { key: "media", label: "Mídias & Screenshots" },
  ] as const

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-0 sm:p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <motion.div
        className="w-full sm:max-w-2xl sm:rounded-2xl rounded-none border-0 sm:border border-border shadow-2xl sm:my-8 min-h-screen sm:min-h-0"
        style={{ background: "var(--background)" }}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground">{mode === "create" ? "Novo Projeto" : `Editar: ${initial.title}`}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "create" ? "Preencha os dados do projeto para publicar na página /projetos" : "Altere os dados e clique em Salvar"}
            </p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-border px-4 sm:px-6 overflow-x-auto scrollbar-none">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`py-3 px-1 mr-4 sm:mr-6 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                section === s.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {section === "basic" && (
            <>
              {/* Title + slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Título *</label>
                  <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Maktub Barbearia"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30" />
                </div>
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Slug (URL) *</label>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                    placeholder="maktub-barbearia"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 font-mono" />
                </div>
              </div>

              {/* Category + Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Categoria *</label>
                  <input value={form.category} onChange={(e) => set("category", e.target.value)}
                    placeholder="Site + Sistema de Gestão"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30" />
                </div>
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Duração</label>
                  <input value={form.duration} onChange={(e) => set("duration", e.target.value)}
                    placeholder="2 semanas"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30" />
                </div>
              </div>

              {/* Desc */}
              <div>
                <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Descrição curta *</label>
                <textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} rows={2}
                  placeholder="Breve descrição exibida no card do projeto"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 resize-none" />
              </div>

              {/* Cover + liveUrl */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">Capa (cor/ícone)</label>
                  <select value={form.cover} onChange={(e) => set("cover", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30">
                    {COVER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">URL do site</label>
                  <input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)}
                    placeholder="https://cliente.com.br"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30" />
                </div>
              </div>

              <TagInput label="Stack (badges do card)" values={form.tech} onChange={(v) => set("tech", v)} placeholder="Next.js 16" />
              <TagInput label="Stack completa (página do projeto)" values={form.stack} onChange={(v) => set("stack", v)} placeholder="Drizzle ORM" />

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("published", !form.published)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.published ? "bg-emerald-500" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${form.published ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm">{form.published ? "Publicado" : "Rascunho"}</span>
              </div>
            </>
          )}

          {section === "story" && (
            <>
              <div>
                <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">O Desafio</label>
                <textarea value={form.challenge} onChange={(e) => set("challenge", e.target.value)} rows={4}
                  placeholder="Qual era o problema do cliente antes do projeto?"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 resize-none" />
              </div>
              <div>
                <label className="label-sm text-muted-foreground mb-1.5 block text-[11px] uppercase tracking-wider">A Solução</label>
                <textarea value={form.solution} onChange={(e) => set("solution", e.target.value)} rows={4}
                  placeholder="Como o projeto foi desenvolvido e o que foi entregue?"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-secondary/50 focus:outline-none focus:border-foreground/30 resize-none" />
              </div>
              <TagInput label="Resultados (um por item)" values={form.results} onChange={(v) => set("results", v)} placeholder="Redução de 70% no tempo de resposta" />
            </>
          )}

          {section === "media" && (
            <>
              {/* ── Foto de capa ─────────────────────────────── */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Foto de Capa</p>
                {/* Mode selector */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { value: "none",         label: "Sem foto",      desc: "Usa gradiente/ícone" },
                    { value: "single",       label: "Imagem única",  desc: "Uma foto de capa" },
                    { value: "before_after", label: "Antes & Depois", desc: "Slider comparativo" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("coverImageMode", opt.value as ProjectFormState["coverImageMode"])}
                      className={`flex flex-col gap-0.5 items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                        form.coverImageMode === opt.value
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <span className="text-xs font-semibold">{opt.label}</span>
                      <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Single image */}
                {form.coverImageMode === "single" && (
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">URL da imagem</label>
                      <input
                        value={form.coverImageUrl}
                        onChange={(e) => set("coverImageUrl", e.target.value)}
                        placeholder="https://... ou /images/projeto-capa.png"
                        className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background focus:outline-none focus:border-foreground/30"
                      />
                    </div>
                    {form.coverImageUrl && (
                      <img
                        src={form.coverImageUrl}
                        alt="Preview da capa"
                        className="w-full h-40 object-cover rounded-lg border border-border"
                      />
                    )}
                  </div>
                )}

                {/* Before / After */}
                {form.coverImageMode === "before_after" && (
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                    <p className="text-xs text-muted-foreground">As duas imagens serão exibidas num slider de comparação.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Antes (URL)</label>
                        <input
                          value={form.beforeAfter?.before ?? ""}
                          onChange={(e) => set("beforeAfter", { before: e.target.value, after: form.beforeAfter?.after ?? "" })}
                          placeholder="/images/antes.png"
                          className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background focus:outline-none"
                        />
                        {form.beforeAfter?.before && (
                          <img src={form.beforeAfter.before} alt="Antes" className="mt-2 w-full h-24 object-cover rounded-lg border border-border" />
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Depois (URL)</label>
                        <input
                          value={form.beforeAfter?.after ?? ""}
                          onChange={(e) => set("beforeAfter", { before: form.beforeAfter?.before ?? "", after: e.target.value })}
                          placeholder="/images/depois.png"
                          className="w-full px-3 py-2 rounded-lg border border-border text-xs bg-background focus:outline-none"
                        />
                        {form.beforeAfter?.after && (
                          <img src={form.beforeAfter.after} alt="Depois" className="mt-2 w-full h-24 object-cover rounded-lg border border-border" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshots gallery */}
              <ScreenshotEditor screenshots={form.screenshots} onChange={(s) => set("screenshots", s)} />
            </>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            <Save className="size-3.5" />
            {isPending ? "Salvando..." : mode === "create" ? "Criar Projeto" : "Salvar Alterações"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Linha drag-and-drop ───────────────────────────────────────────────────────
function SortableRow({
  p, onEdit, onDelete, onPreview, isPending,
}: {
  p: ProjectRow
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
  isPending: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.45 : 1 }
  const dot = COVER_OPTIONS.find((c) => c.value === p.cover)?.color ?? "#888"

  const badge = (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
      p.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }`}>
      <span className={`size-1.5 rounded-full ${p.published ? "bg-emerald-400" : "bg-zinc-500"}`} />
      {p.published ? "Pub" : "Rascunho"}
    </span>
  )

  const actions = (
    <div className="flex items-center gap-1 shrink-0">
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
          className="size-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors" title="Ver ao vivo">
          <ExternalLink className="size-3" />
        </a>
      )}
      <button onClick={onPreview} className="size-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors" title="Visualizar">
        <Eye className="size-3" />
      </button>
      <button onClick={onEdit} className="size-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-blue-400 transition-colors" title="Editar">
        <Pencil className="size-3" />
      </button>
      <button onClick={onDelete} disabled={isPending} className="size-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-40" title="Excluir">
        <Trash2 className="size-3" />
      </button>
    </div>
  )

  const grip = (
    <button {...attributes} {...listeners}
      className="touch-none p-1 text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab active:cursor-grabbing shrink-0 transition-colors"
      title="Arrastar para reordenar">
      <GripVertical className="size-4" />
    </button>
  )

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-border bg-background">
      {/* Mobile */}
      <div className="flex sm:hidden items-center gap-2 p-3">
        {grip}
        <div className="size-2.5 rounded-full shrink-0" style={{ background: dot }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
          <p className="text-[11px] text-muted-foreground truncate">{p.category}</p>
        </div>
        {badge}
        {actions}
      </div>
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-1 px-2 py-2.5">
        {grip}
        <div className="size-2 rounded-full shrink-0" style={{ background: dot }} />
        <span className="flex-1 font-medium text-sm text-foreground px-2 truncate">{p.title}</span>
        <span className="w-40 text-xs text-muted-foreground truncate hidden md:block">{p.category}</span>
        <span className="w-36 font-mono text-xs text-muted-foreground truncate hidden lg:block">{p.slug}</span>
        <div className="w-24 flex justify-center">{badge}</div>
        {actions}
      </div>
    </div>
  )
}

// ── Main ProjectsAdmin component ─────────────────────────────────────────────
export function ProjectsAdmin({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects)
  const [modal, setModal] = useState<{ mode: "create" | "edit"; project?: ProjectRow } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [savingOrder, setSavingOrder] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const reload = async () => {
    const fresh = await getProjects()
    setProjects(fresh)
  }

  const handleDelete = (p: ProjectRow) => {
    if (!confirm(`Excluir "${p.title}"? Esta ação não pode ser desfeita.`)) return
    startTransition(async () => {
      await deleteProject(p.id)
      setProjects((prev) => prev.filter((x) => x.id !== p.id))
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setProjects((items) => {
      const from = items.findIndex((p) => p.id === active.id)
      const to   = items.findIndex((p) => p.id === over.id)
      const next = arrayMove(items, from, to)
      setSavingOrder(true)
      reorderProjects(next.map((p, i) => ({ id: p.id, sortOrder: i })))
        .finally(() => setSavingOrder(false))
      return next
    })
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Projetos</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {projects.length} projeto{projects.length !== 1 ? "s" : ""} —{" "}
            <span className="opacity-70">arraste</span> para reordenar
            {savingOrder && <span className="ml-2 text-blue-400">salvando...</span>}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all hover:opacity-80"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          <Plus className="size-3.5" /> Novo Projeto
        </button>
      </div>

      {/* Cabeçalho desktop */}
      <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        <div className="w-6" />
        <div className="w-3" />
        <div className="flex-1 px-2">Projeto</div>
        <div className="w-40 hidden md:block">Categoria</div>
        <div className="w-36 hidden lg:block">Slug</div>
        <div className="w-24 text-center">Status</div>
        <div className="w-32 text-right">Ações</div>
      </div>

      {/* Lista sortable */}
      {projects.length === 0 ? (
        <p className="text-center py-12 text-sm text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {projects.map((p) => (
                <SortableRow
                  key={p.id}
                  p={p}
                  isPending={isPending}
                  onEdit={() => setModal({ mode: "edit", project: p })}
                  onDelete={() => handleDelete(p)}
                  onPreview={() => router.push(`/projetos/${p.slug}`)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProjectFormModal
            key={modal.project?.id ?? "new"}
            mode={modal.mode}
            initial={modal.project ? rowToForm(modal.project) : blankForm()}
            editId={modal.project?.id}
            onClose={() => setModal(null)}
            onSaved={reload}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

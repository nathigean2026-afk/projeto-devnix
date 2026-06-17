"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  glossaryTerms,
  buildLetterIndex,
  CATEGORIES,
  CATEGORY_COLORS,
  type GlossaryTerm,
  type GlossaryCategory,
} from "@/lib/glossary-data"

// ── Term Detail Modal ─────────────────────────────────────
function TermModal({
  term,
  allTerms,
  onClose,
  onNavigate,
}: {
  term: GlossaryTerm
  allTerms: GlossaryTerm[]
  onClose: () => void
  onNavigate: (t: GlossaryTerm) => void
}) {
  const idx = allTerms.findIndex((t) => t.slug === term.slug)
  const prev = idx > 0 ? allTerms[idx - 1] : null
  const next = idx < allTerms.length - 1 ? allTerms[idx + 1] : null
  const colors = CATEGORY_COLORS[term.category]

  // Close on Escape; navigate with arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && prev) onNavigate(prev)
      if (e.key === "ArrowRight" && next) onNavigate(next)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [prev, next, onClose, onNavigate])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Card */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border"
          style={{ background: "var(--card)" }}
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Color accent top bar */}
          <div className="h-1 w-full rounded-t-2xl" style={{ background: colors.dot }} />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase mb-3"
                  style={{ color: colors.dot }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.dot }} />
                  {term.category}
                </span>
                <h2 className="text-xl font-bold text-foreground leading-tight">{term.term}</h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-6">
              {[
                { label: "O que é", content: term.what },
                { label: "Na prática", content: term.practice },
                { label: "Por que importa", content: term.why },
              ].map(({ label, content }) => (
                <div key={label}>
                  <p
                    className="text-[10px] font-bold tracking-widest uppercase mb-2"
                    style={{ color: colors.dot }}
                  >
                    {label}
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{content}</p>
                </div>
              ))}

              {/* Related terms */}
              {term.related.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-3 text-muted-foreground">
                    Termos relacionados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {term.related.map((r) => {
                      const found = glossaryTerms.find(
                        (t) => t.term === r || t.term.startsWith(r.split("—")[0].trim())
                      )
                      return found ? (
                        <button
                          key={r}
                          onClick={() => onNavigate(found)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                        >
                          {r}
                        </button>
                      ) : (
                        <span
                          key={r}
                          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground"
                        >
                          {r}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-border">
            <button
              onClick={() => prev && onNavigate(prev)}
              disabled={!prev}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              {prev ? prev.term.split("—")[0].trim() : "Anterior"}
            </button>

            <span className="text-xs text-muted-foreground">
              {idx + 1} / {allTerms.length}
            </span>

            <button
              onClick={() => next && onNavigate(next)}
              disabled={!next}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {next ? next.term.split("—")[0].trim() : "Próximo"}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Term Card ─────────────────────────────────────────────
function TermCard({ term, onClick }: { term: GlossaryTerm; onClick: () => void }) {
  const colors = CATEGORY_COLORS[term.category]
  return (
    <motion.button
      onClick={onClick}
      className="text-left w-full p-5 rounded-xl border border-border hover:border-foreground/20 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ background: "var(--card)", borderLeftColor: colors.dot, borderLeftWidth: "3px" }}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colors.dot }} />
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: colors.dot }}>
          {term.category}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-foreground transition-colors leading-tight">
        {term.term}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{term.what}</p>
    </motion.button>
  )
}

// ── Main Client Component ─────────────────────────────────
export function GlossaryClient() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(null)
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Filter terms
  const filtered = useMemo(() => {
    let list = glossaryTerms
    if (activeCategory) list = list.filter((t) => t.category === activeCategory)
    if (activeLetter) list = list.filter((t) => t.term[0].toUpperCase() === activeLetter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.what.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [query, activeCategory, activeLetter])

  const letterIndex = useMemo(() => buildLetterIndex(filtered), [filtered])
  const sortedLetters = Object.keys(letterIndex).sort()
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const handleLetterClick = (letter: string) => {
    if (activeLetter === letter) {
      setActiveLetter(null)
      return
    }
    setActiveLetter(letter)
    setTimeout(() => {
      letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  const handleClear = () => {
    setQuery("")
    setActiveCategory(null)
    setActiveLetter(null)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6366f1" }} />
            <span className="label-sm text-muted-foreground">Vocabulário do Negócio Brasileiro</span>
          </motion.div>

          <motion.h1
            className="text-[clamp(52px,10vw,110px)] font-black tracking-tight text-foreground leading-none mb-4"
            style={{ fontStyle: "italic", letterSpacing: "-0.04em" }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Glossário
          </motion.h1>

          <motion.p
            className="text-sm text-muted-foreground mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Os termos que todo dono de negócio deveria conhecer.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="inline-grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { value: glossaryTerms.length, label: "Termos" },
              { value: CATEGORIES.length, label: "Categorias" },
              { value: 3, label: "Blocos por termo" },
            ].map(({ value, label }) => (
              <div key={label} className="px-8 py-5" style={{ background: "var(--secondary)" }}>
                <div className="text-2xl font-black text-foreground">{value}</div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sticky filters — z-10 so it stays below the navbar (z-50) and menu overlay (z-60) */}
      <div className="sticky top-0 z-10 border-b border-border" style={{ background: "var(--background)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Row 1: search + categories */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative w-full sm:flex-1 sm:min-w-48 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar termo (ex.: CAC, churn, EBITDA...)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                style={{ background: "var(--secondary)" }}
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const c = CATEGORY_COLORS[cat]
                const active = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(active ? null : cat)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[9px] font-bold tracking-wide uppercase transition-all duration-200"
                    style={
                      active
                        ? { background: c.dot, color: "#fff", borderColor: c.dot }
                        : { borderColor: c.dot + "55", color: c.dot, background: c.dot + "12" }
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: active ? "#fff" : c.dot }} />
                    {cat.split(" & ")[0]}
                  </button>
                )
              })}

              {(query || activeCategory || activeLetter) && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border text-[9px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-3" /> Limpar
                </button>
              )}
            </div>

            {/* Count */}
            <span className="hidden sm:block ml-auto text-[10px] font-bold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
              {filtered.length} termo{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Row 2: alphabet — scrollable on mobile */}
          <div className="flex overflow-x-auto gap-0.5 mt-2 pb-0.5 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {allLetters.map((letter) => {
              const hasTerms = !!letterIndex[letter]
              const isActive = activeLetter === letter
              return (
                <button
                  key={letter}
                  onClick={() => hasTerms && handleLetterClick(letter)}
                  disabled={!hasTerms}
                  className={`shrink-0 w-6 h-6 text-[11px] font-semibold rounded transition-all duration-150 ${
                    isActive
                      ? "text-background"
                      : hasTerms
                      ? "text-foreground hover:bg-foreground/10"
                      : "text-muted-foreground/30 cursor-default"
                  }`}
                  style={isActive ? { background: "var(--foreground)" } : {}}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Terms list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {sortedLetters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-bold text-foreground mb-2">Nenhum termo encontrado</p>
            <p className="text-sm text-muted-foreground mb-6">Tente buscar por outro termo ou limpe os filtros.</p>
            <button
              onClick={handleClear}
              className="px-6 py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {sortedLetters.map((letter) => (
              <div
                key={letter}
                ref={(el) => { letterRefs.current[letter] = el }}
                className="scroll-mt-40"
              >
                {/* Letter header */}
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className="text-[clamp(36px,5vw,56px)] font-black text-foreground leading-none"
                    style={{ fontStyle: "italic", opacity: 0.15, letterSpacing: "-0.04em" }}
                  >
                    {letter}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(letterIndex[letter].length).padStart(2, "0")}
                  </span>
                </div>

                {/* Cards grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {letterIndex[letter].map((term) => (
                      <TermCard
                        key={term.slug}
                        term={term}
                        onClick={() => setSelectedTerm(term)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Term modal */}
      <AnimatePresence>
        {selectedTerm && (
          <TermModal
            term={selectedTerm}
            allTerms={filtered}
            onClose={() => setSelectedTerm(null)}
            onNavigate={(t) => setSelectedTerm(t)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

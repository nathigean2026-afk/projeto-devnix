"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { glossaryTerms, type GlossaryCategory } from "@/lib/glossary-data"
import { useTheme } from "next-themes"

// Pick a balanced mix across all 5 categories — 3-4 terms each
function buildBalancedTerms() {
  const cats: GlossaryCategory[] = [
    "Marketing & Vendas",
    "Finanças",
    "Gestão & Estratégia",
    "Operações & Qualidade",
    "Produto & Cliente",
  ]
  const perCat: Record<string, typeof glossaryTerms> = {}
  for (const cat of cats) {
    perCat[cat] = glossaryTerms.filter((t) => t.category === cat)
  }
  // Interleave: take one from each category in round-robin until we have 24
  const result: typeof glossaryTerms = []
  let i = 0
  while (result.length < 24) {
    const cat = cats[i % cats.length]
    const idx = Math.floor(i / cats.length)
    if (perCat[cat][idx]) result.push(perCat[cat][idx])
    i++
    if (i > 200) break
  }
  return result
}

const TICKER_TERMS = buildBalancedTerms()

function TermCard({ term, category }: { term: string; category: GlossaryCategory }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = !mounted || resolvedTheme === "dark"

  // Unified dot: blue in dark, green in light
  const dotColor = isDark ? "#3b82f6" : "#16a34a"
  const labelColor = isDark ? "#ffffff" : "#000000"
  const catShort = category.split(" & ")[0]

  return (
    <div
      className="glossary-neon-card flex flex-col gap-2 p-4 rounded-xl w-52 shrink-0 relative"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        border: isDark ? "1px solid rgba(59,130,246,0.18)" : "1px solid rgba(22,163,74,0.2)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: dotColor }}
        />
        <span
          className="text-[9px] font-bold tracking-widest uppercase"
          style={{ color: labelColor, opacity: 0.7 }}
        >
          {catShort}
        </span>
      </div>
      <p className="text-xs font-semibold leading-tight line-clamp-2"
        style={{ color: labelColor }}
      >{term}</p>
    </div>
  )
}

function ScrollColumn({
  terms,
  direction,
  speed,
}: {
  terms: typeof TICKER_TERMS
  direction: "up" | "down"
  speed: number
}) {
  const doubled = [...terms, ...terms]
  const isUp = direction === "up"
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const fadeColor = isDark ? "var(--background)" : "var(--background)"

  return (
    <div className="relative overflow-hidden" style={{ height: "420px" }}>
      <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${fadeColor}, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${fadeColor}, transparent)` }} />

      <motion.div
        className="flex flex-col gap-3"
        animate={{
          y: isUp ? [0, -(terms.length * 71)] : [-(terms.length * 71), 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {doubled.map((t, i) => (
          <TermCard key={`${t.slug}-${i}`} term={t.term} category={t.category} />
        ))}
      </motion.div>
    </div>
  )
}

export function GlossaryPreview() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // 3 columns, 8 terms each (24 total, balanced across 5 categories)
  const col1 = TICKER_TERMS.slice(0, 8)
  const col2 = TICKER_TERMS.slice(8, 16)
  const col3 = TICKER_TERMS.slice(16, 24)

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-foreground opacity-30" />
              <span className="label-sm text-muted-foreground">Glossário</span>
            </div>

            <h2 className="text-editorial text-[clamp(38px,5.5vw,68px)] text-foreground leading-none mb-6">
              Os termos que
              <br />
              <span className="text-muted-foreground">seu negócio usa</span>
              <br />
              (e deve dominar).
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
              {glossaryTerms.length} termos de negócios explicados de forma direta — sem enrolação, com exemplos reais. Marketing, Finanças, Gestão, Operações e Produto.
            </p>

            {/* Category pills — unified dot style */}
            <div className="flex flex-wrap gap-2 mb-10">
              {(["Marketing & Vendas", "Finanças", "Gestão & Estratégia", "Operações & Qualidade", "Produto & Cliente"] as GlossaryCategory[]).map((cat) => {
                const dotColor = isDark ? "#3b82f6" : "#16a34a"
                return (
                  <span
                    key={cat}
                    className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full border tracking-wide"
                    style={{
                      borderColor: isDark ? "rgba(59,130,246,0.2)" : "rgba(22,163,74,0.25)",
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      background: isDark ? "rgba(59,130,246,0.07)" : "rgba(22,163,74,0.07)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
                    {cat.split(" & ")[0]}
                  </span>
                )
              })}
            </div>

            <Link
              href="/glossario"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 hover:scale-95"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              Ver glossário completo <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>

          {/* Right — animated columns */}
          <motion.div
            className="hidden lg:flex items-start gap-4"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <ScrollColumn terms={col1} direction="up" speed={26} />
            <ScrollColumn terms={col2} direction="down" speed={32} />
            <ScrollColumn terms={col3} direction="up" speed={22} />
          </motion.div>

          {/* Mobile: horizontal scroll */}
          <motion.div
            className="flex lg:hidden overflow-x-auto gap-3 pb-2 -mx-6 px-6"
            style={{ scrollbarWidth: "none" }}
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {TICKER_TERMS.slice(0, 8).map((t) => (
              <TermCard key={t.slug} term={t.term} category={t.category} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}


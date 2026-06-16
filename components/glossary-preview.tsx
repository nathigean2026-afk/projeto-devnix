"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { glossaryTerms, CATEGORY_COLORS, type GlossaryCategory } from "@/lib/glossary-data"

// Pick a balanced mix of terms for the ticker
const TICKER_TERMS = glossaryTerms.slice(0, 18)

function TermCard({ term, category }: { term: string; category: GlossaryCategory }) {
  const colors = CATEGORY_COLORS[category]
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-background/60 backdrop-blur-sm w-52 shrink-0">
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: colors.dot }}
        />
        <span
          className="text-[9px] font-bold tracking-widest uppercase"
          style={{ color: colors.dot }}
        >
          {category.split(" & ")[0]}
        </span>
      </div>
      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{term}</p>
    </div>
  )
}

// Column of cards scrolling up or down
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

  return (
    <div className="relative overflow-hidden" style={{ height: "380px" }}>
      {/* Top/bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />

      <motion.div
        className="flex flex-col gap-3"
        animate={{
          y: isUp ? [0, -(terms.length * 67)] : [-(terms.length * 67), 0],
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

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const col1 = TICKER_TERMS.slice(0, 6)
  const col2 = TICKER_TERMS.slice(6, 12)
  const col3 = TICKER_TERMS.slice(12, 18)

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

            <div className="flex flex-wrap gap-3 mb-10">
              {(["Marketing & Vendas", "Finanças", "Gestão & Estratégia"] as GlossaryCategory[]).map((cat) => {
                const c = CATEGORY_COLORS[cat]
                return (
                  <span
                    key={cat}
                    className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full border tracking-wide"
                    style={{ borderColor: c.dot + "44", color: c.dot, background: c.dot + "15" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                    {cat}
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
            <ScrollColumn terms={col1} direction="up" speed={22} />
            <ScrollColumn terms={col2} direction="down" speed={28} />
            <ScrollColumn terms={col3} direction="up" speed={19} />
          </motion.div>

          {/* Mobile: single horizontal scroll */}
          <motion.div
            className="flex lg:hidden overflow-x-auto gap-3 pb-2 -mx-6 px-6 scrollbar-hide"
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

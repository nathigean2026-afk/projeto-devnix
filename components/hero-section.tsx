"use client"

import { useRef, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"

const TAGS = ["Sites", "Software", "E-commerce", "Plataformas", "Landing Pages", "Blogs", "Sistemas", "APIs"]

// ─── Canvas: floating dots + constellation lines + click burst ───────────────
function FloatingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    // Inject burst particles into the existing dots array
    ;(canvas as HTMLCanvasElement & { __inject?: (x: number, y: number) => void }).__inject?.(cx, cy)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    type Dot = {
      x: number; y: number; r: number
      vx: number; vy: number
      alpha: number; targetAlpha: number; alphaSpeed: number
      burst?: boolean; life?: number; maxLife?: number
    }

    let dots: Dot[] = []

    function makeDot(x?: number, y?: number, burst = false): Dot {
      const angle = Math.random() * Math.PI * 2
      const speed = burst ? Math.random() * 3 + 1 : (Math.random() - 0.5) * 0.32
      return {
        x: x ?? Math.random() * W,
        y: y ?? Math.random() * H,
        r: burst ? Math.random() * 2 + 0.5 : Math.random() * 1.5 + 0.3,
        vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.32,
        vy: burst ? Math.sin(angle) * speed : (Math.random() - 0.5) * 0.32,
        alpha: burst ? 0.9 : Math.random() * 0.55 + 0.12,
        targetAlpha: Math.random() * 0.55 + 0.12,
        alphaSpeed: Math.random() * 0.005 + 0.001,
        burst,
        life: burst ? 0 : undefined,
        maxLife: burst ? Math.random() * 40 + 30 : undefined,
      }
    }

    function resize() {
      W = canvas!.offsetWidth
      H = canvas!.offsetHeight
      canvas!.width = W
      canvas!.height = H
      dots = Array.from({ length: 160 }, () => makeDot())
    }

    // Expose inject fn to click handler
    ;(canvas as HTMLCanvasElement & { __inject?: (x: number, y: number) => void }).__inject = (x, y) => {
      const count = Math.floor(Math.random() * 18 + 16)
      for (let i = 0; i < count; i++) dots.push(makeDot(x, y, true))
    }

    const CONNECT_DIST = 100

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      const isDark = document.documentElement.classList.contains("dark") ||
        !document.documentElement.classList.contains("light")
      // Light mode: much darker so dots are clearly visible
      const color = isDark ? "255,255,255" : "0,0,0"
      const alphaMultiplier = isDark ? 1 : 2.8

      const active = dots.filter((d) => {
        if (!d.burst) return true
        d.life! += 1
        return d.life! < d.maxLife!
      })
      dots = active

      // Draw connection lines between nearby dots
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const dx = active[i].x - active[j].x
          const dy = active[i].y - active[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.12 * alphaMultiplier
            ctx!.strokeStyle = `rgba(${color},${lineAlpha.toFixed(3)})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(active[i].x, active[i].y)
            ctx!.lineTo(active[j].x, active[j].y)
            ctx!.stroke()
          }
        }
      }

      // Draw + move dots
      for (const d of active) {
        d.x += d.vx
        d.y += d.vy

        if (!d.burst) {
          if (d.x < -4) d.x = W + 4
          if (d.x > W + 4) d.x = -4
          if (d.y < -4) d.y = H + 4
          if (d.y > H + 4) d.y = -4
          if (Math.abs(d.alpha - d.targetAlpha) < d.alphaSpeed) {
            d.targetAlpha = Math.random() * 0.55 + 0.12
          }
          d.alpha += (d.targetAlpha - d.alpha) * d.alphaSpeed * 40
        } else {
          // burst fade out
          d.vx *= 0.96
          d.vy *= 0.96
          d.alpha = 0.9 * (1 - d.life! / d.maxLife!)
        }

        const a = Math.min(d.alpha * alphaMultiplier, 1)
        ctx!.beginPath()
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${color},${a.toFixed(3)})`
        ctx!.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    canvas.addEventListener("click", handleClick as EventListener)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      canvas.removeEventListener("click", handleClick as EventListener)
    }
  }, [handleClick])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }} />

      {/* Animated floating dots — z-index 1, cursor crosshair */}
      <FloatingDots />

      {/* Corner glows */}
      <div
        aria-hidden="true"
        className="hero-glow w-[600px] h-[600px] -top-32 -left-32 opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        className="hero-glow w-[500px] h-[500px] -bottom-20 -right-20 opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", zIndex: 0 }}
      />

      <motion.div
        style={{ y, opacity: fadeOut }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full pointer-events-none"
      >
        {/* Tag line */}
        <motion.div
          className="flex items-center gap-3 mb-10 pointer-events-auto"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-muted-foreground"
            style={{ background: "var(--secondary)" }}
          >
            <span className="size-1.5 rounded-full bg-foreground opacity-60 animate-pulse" />
            <span className="label-sm">Desenvolvedor Full-Stack · Disponível</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-1">
          <motion.h1
            className="text-display text-foreground"
            style={{ fontSize: "clamp(54px,10vw,136px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            Seu site
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-1">
          <motion.h1
            className="text-display"
            style={{
              fontSize: "clamp(54px,10vw,136px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "1.5px var(--foreground)",
              opacity: 0.45,
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 0.45 }}
            transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
          >
            é sua
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="text-display text-foreground"
            style={{ fontSize: "clamp(54px,10vw,136px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.29, ease: "easeOut" }}
          >
            identidade.
          </motion.h1>
        </div>

        {/* Sub row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-14 pointer-events-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
        >
          <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
            Construo sites, software e plataformas que pertencem a você. Código-fonte
            entregue, personalizado do zero, sem limites de escala.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#contato"
              className="group flex items-center gap-3 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              Começar Projeto
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#servicos"
              className="flex items-center gap-3 px-7 py-4 rounded-full border border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
            >
              Ver Serviços
            </a>
          </div>
        </motion.div>

        {/* Marquee tags strip */}
        <motion.div
          className="mt-16 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
          aria-hidden="true"
        >
          <div className="flex w-max marquee-track">
            {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
              <div key={i} className="flex items-center gap-6 px-6">
                <span className="label-sm text-muted-foreground whitespace-nowrap">{tag}</span>
                <span className="size-1 rounded-full bg-border flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="mt-14 grid grid-cols-3 divide-x divide-border border border-border rounded-2xl overflow-hidden"
          style={{ background: "var(--card)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: "easeOut" }}
        >
          {[
            { n: "+50", label: "Projetos entregues" },
            { n: "100%", label: "Código seu, sempre" },
            { n: "+5", label: "Anos de experiência" },
          ].map((s) => (
            <div key={s.n} className="flex flex-col gap-1 px-6 py-5">
              <span
                className="font-black text-foreground"
                style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                {s.n}
              </span>
              <span className="label-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="label-sm text-muted-foreground">Clique para interagir</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}

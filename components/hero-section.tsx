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
      burst?: boolean
    }

    let dots: Dot[] = []

    function makeDot(x?: number, y?: number, burst = false): Dot {
      const speed = burst ? Math.random() * 2.8 + 0.8 : (Math.random() - 0.5) * 0.32
      const angle = Math.random() * Math.PI * 2
      return {
        x: x ?? Math.random() * W,
        y: y ?? Math.random() * H,
        r: burst ? Math.random() * 1.8 + 0.4 : Math.random() * 1.5 + 0.3,
        vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.32,
        vy: burst ? Math.sin(angle) * speed : (Math.random() - 0.5) * 0.32,
        alpha: burst ? 0.8 : Math.random() * 0.55 + 0.12,
        targetAlpha: Math.random() * 0.55 + 0.12,
        alphaSpeed: Math.random() * 0.005 + 0.001,
        burst,
      }
    }

    function resize() {
      W = canvas!.offsetWidth
      H = canvas!.offsetHeight
      canvas!.width = W
      canvas!.height = H
      dots = Array.from({ length: 160 }, () => makeDot())
    }

    const MAX_DOTS = 400
    // Pool of burst dots sorted by age — oldest index = 0
    const burstPool: Dot[] = []

    // When click happens: spawn new burst dots.
    // They keep their velocity forever (slow over time) and join the normal
    // pool permanently — they never die. If over MAX_DOTS, evict the oldest burst.
    ;(canvas as HTMLCanvasElement & { __inject?: (x: number, y: number) => void }).__inject = (x, y) => {
      const count = Math.floor(Math.random() * 20 + 14)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.8 + 0.8
        const d: Dot = {
          x, y,
          r: Math.random() * 1.8 + 0.4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: Math.random() * 0.5 + 0.5,
          targetAlpha: Math.random() * 0.55 + 0.12,
          alphaSpeed: Math.random() * 0.005 + 0.001,
          burst: true,
        }
        burstPool.push(d)
        dots.push(d)
      }
      // Evict oldest burst dots if over limit
      while (dots.length > MAX_DOTS && burstPool.length > 0) {
        const evict = burstPool.shift()!
        const idx = dots.indexOf(evict)
        if (idx !== -1) dots.splice(idx, 1)
      }
    }

    const CONNECT_DIST = 100

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      const isDark = document.documentElement.classList.contains("dark") ||
        !document.documentElement.classList.contains("light")
      const color = isDark ? "255,255,255" : "0,0,0"
      const alphaMultiplier = isDark ? 1 : 2.8

      // Draw connection lines between nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.12 * alphaMultiplier
            ctx!.strokeStyle = `rgba(${color},${lineAlpha.toFixed(3)})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(dots[i].x, dots[i].y)
            ctx!.lineTo(dots[j].x, dots[j].y)
            ctx!.stroke()
          }
        }
      }

      // Update + draw every dot
      for (const d of dots) {
        // Decelerate burst dots — once slow enough they become ambient
        if (d.burst) {
          d.vx *= 0.97
          d.vy *= 0.97
          const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy)
          if (speed < 0.35) d.burst = false // graduate to normal dot
        }

        d.x += d.vx
        d.y += d.vy

        // Wrap around edges for all dots
        if (d.x < -4) d.x = W + 4
        if (d.x > W + 4) d.x = -4
        if (d.y < -4) d.y = H + 4
        if (d.y > H + 4) d.y = -4

        // Breathe alpha
        if (Math.abs(d.alpha - d.targetAlpha) < d.alphaSpeed) {
          d.targetAlpha = Math.random() * 0.55 + 0.12
        }
        d.alpha += (d.targetAlpha - d.alpha) * d.alphaSpeed * 40

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
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28 w-full pointer-events-none"
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

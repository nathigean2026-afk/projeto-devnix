"use client"

import { useRef, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"

const TAGS = ["Sites", "Software", "E-commerce", "Plataformas", "Landing Pages", "Blogs", "Sistemas", "APIs"]

// FloatingDots — canvas interativo do hero
// Desktop: 120 pontos com burst no clique + cursor crosshair
// Mobile:  40 pontos estáticos, sem burst, inicia em 1500ms (pós-LCP)
function FloatingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Burst só no desktop (mobile não tem cursor)
    if (window.innerWidth < 768) return
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    ;(canvas as HTMLCanvasElement & { __inject?: (x: number, y: number) => void }).__inject?.(cx, cy)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mobile = window.innerWidth < 768
    // Desktop: 120 pontos | Mobile: 40 pontos (leve)
    const DOT_COUNT = mobile ? 40 : 120
    // Desktop: início em 600ms | Mobile: início em 1500ms (bem pós-LCP)
    const START_DELAY = mobile ? 1500 : 600

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
      const angle = Math.random() * Math.PI * 2
      const speed = burst ? Math.random() * 2.8 + 0.8 : (Math.random() - 0.5) * 0.32
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
      dots = Array.from({ length: DOT_COUNT }, () => makeDot())
    }

    const MAX_DOTS = mobile ? 80 : 300
    const burstPool: Dot[] = []

    ;(canvas as HTMLCanvasElement & { __inject?: (x: number, y: number) => void }).__inject = (x, y) => {
      const count = Math.floor(Math.random() * 16 + 10)
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
      while (dots.length > MAX_DOTS && burstPool.length > 0) {
        const evict = burstPool.shift()!
        const idx = dots.indexOf(evict)
        if (idx !== -1) dots.splice(idx, 1)
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      const isDark = document.documentElement.classList.contains("dark") ||
        !document.documentElement.classList.contains("light")
      const color = isDark ? "255,255,255" : "0,0,0"
      const alphaMultiplier = isDark ? 1 : 2.8

      for (const d of dots) {
        if (d.burst) {
          d.vx *= 0.97
          d.vy *= 0.97
          const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy)
          if (speed < 0.35) d.burst = false
        }

        d.x += d.vx
        d.y += d.vy

        if (d.x < -4) d.x = W + 4
        if (d.x > W + 4) d.x = -4
        if (d.y < -4) d.y = H + 4
        if (d.y > H + 4) d.y = -4

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
    const startTimer = setTimeout(() => draw(), START_DELAY)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    canvas.addEventListener("click", handleClick as EventListener)

    return () => {
      clearTimeout(startTimer)
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

      {/* FloatingDots — desktop: 120 pontos + burst no clique | mobile: 40 pontos, início adiado */}
      <FloatingDots />

      {/* Corner glows — substituído por versão CSS sem filter:blur */}
      <div
        aria-hidden="true"
        className="hero-glow-simple pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <motion.div
        style={{ y, opacity: fadeOut }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28 w-full pointer-events-none"
      >
        {/* Tag line — visível imediatamente, sem opacity:0 inicial */}
        <div
          className="flex items-center gap-3 mb-10 pointer-events-auto animate-fade-in"
          style={{ animationDelay: "0ms", animationFillMode: "both" }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-muted-foreground"
            style={{ background: "var(--secondary)" }}
          >
            <span className="size-1.5 rounded-full bg-foreground opacity-60 animate-pulse" />
            <span className="label-sm">Desenvolvedor Full-Stack · Disponível</span>
          </span>
        </div>

        {/* Main headline — texto SEMPRE visível para o LCP ser detectado imediatamente
            A animação de entrada usa CSS puro (não bloqueia Lighthouse) */}
        <div className="overflow-hidden mb-1">
          <h1
            className="text-display text-foreground hero-h1-slide"
            style={{
              fontSize: "clamp(54px,10vw,136px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              animationDelay: "0ms",
            }}
          >
            Seu site
          </h1>
        </div>
        <div className="overflow-hidden mb-1">
          <h1
            className="text-display hero-h1-slide"
            style={{
              fontSize: "clamp(54px,10vw,136px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "1.5px var(--foreground)",
              opacity: 0.45,
              animationDelay: "60ms",
            }}
          >
            é sua
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className="text-display text-foreground hero-h1-slide"
            style={{
              fontSize: "clamp(54px,10vw,136px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              animationDelay: "120ms",
            }}
          >
            identidade.
          </h1>
        </div>

        {/* Sub row */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-14 pointer-events-auto animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
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
        </div>

        {/* Marquee tags strip */}
        <div
          className="mt-16 overflow-hidden animate-fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
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
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none animate-fade-in"
        style={{ animationDelay: "1200ms", animationFillMode: "both" }}
        aria-hidden="true"
      >
        <span className="label-sm text-muted-foreground">Clique para interagir</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  )
}

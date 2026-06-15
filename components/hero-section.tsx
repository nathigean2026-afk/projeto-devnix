"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react"

const badges = [
  "Código-fonte incluso",
  "Entrega no prazo",
  "Suporte pós-entrega",
  "100% personalizado",
]

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    type Particle = {
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; opacityDir: number
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.55 + 0.08,
      opacityDir: (Math.random() - 0.5) * 0.007,
    }))

    type Streak = { x: number; y: number; len: number; speed: number; opacity: number; dead: boolean }
    const streaks: Streak[] = []
    let streakTimer = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.opacity += p.opacityDir
        if (p.opacity <= 0.04 || p.opacity >= 0.7) p.opacityDir *= -1
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,218,208,${p.opacity})`
        ctx.fill()
      }

      streakTimer++
      if (streakTimer > 200 + Math.random() * 140) {
        streaks.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
          y: Math.random() * canvas.height * 0.35,
          len: 90 + Math.random() * 90,
          speed: 5 + Math.random() * 4,
          opacity: 0.9,
          dead: false,
        })
        streakTimer = 0
      }

      for (const s of streaks) {
        if (s.dead) continue
        s.x -= s.speed * 0.9
        s.y += s.speed * 0.9
        s.opacity -= 0.022
        const g = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y - s.len)
        g.addColorStop(0, `rgba(255,255,255,0)`)
        g.addColorStop(1, `rgba(255,255,255,${s.opacity})`)
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.len, s.y - s.len)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.stroke()
        if (s.opacity <= 0) s.dead = true
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        if (streaks[i].dead) streaks.splice(i, 1)
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Canvas partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Glow radial central — exato do vídeo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 62% 58% at 50% 52%, rgba(25,90,48,0.6) 0%, rgba(18,62,34,0.28) 45%, transparent 75%)",
          filter: "blur(28px)",
        }}
      />

      {/* Glow menor acima do texto */}
      <div
        className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[320px] h-[180px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(92,255,138,0.1) 0%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-20">

        {/* Badge topo */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm mb-8 animate-fade-up">
          <span className="size-1.5 rounded-full bg-[#5cff8a] animate-pulse" />
          <span className="text-[12px] font-medium text-[#c8d9cd] tracking-wide">
            Seu projeto · seu código · sua propriedade
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-black leading-[0.93] tracking-tight text-[#eef4f0] animate-fade-up delay-100 text-balance"
        >
          Desenvolvimento
          <br />
          Web{" "}
          <span className="text-[#5cff8a] glow-text">Profissional</span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-7 text-[15px] sm:text-lg text-[#7a9985] max-w-xl leading-relaxed animate-fade-up delay-200">
          Sites, softwares, plataformas analíticas e landing pages.
          Entrego a solução certa — e o código é sempre seu.
        </p>

        {/* Badges de check */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 animate-fade-up delay-300">
          {badges.map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-[12px] text-[#7a9985]">
              <CheckCircle2 className="size-3.5 text-[#5cff8a]" />
              {b}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-9 animate-fade-up delay-400">
          <Link
            href="#contato"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5cff8a] text-[#0c1710] text-sm font-bold hover:bg-[#7aff9e] transition-all duration-200 group"
            style={{ boxShadow: "0 0 28px rgba(92,255,138,0.45)" }}
          >
            Iniciar projeto
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#projetos"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-sm font-medium text-[#c8d9cd] hover:bg-white/7 hover:border-white/16 transition-all duration-200"
          >
            Ver projetos
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-fade-in delay-700"
      >
        <span className="text-[10px] text-[#4a6655] tracking-[0.2em] uppercase">
          Scroll to explore
        </span>
        <ChevronDown className="size-4 text-[#4a6655] animate-bounce" />
      </div>
    </section>
  )
}

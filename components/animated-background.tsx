"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

// ─── Efeito de teia/grafo interativo ────────────────────────────────────────
// • Nós flutuam e se conectam por linhas quando próximos (constelação)
// • Hover: repulsão suave dos nós — a teia se abre ao redor do cursor
// • Click: espalha novos nós que se integram e crescem a teia
// • Cada nó brilha com glow neon (azul no dark, verde no light)
// ─────────────────────────────────────────────────────────────────────────────

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  originX: number
  originY: number
  // 0→1 ao nascer (fade-in); nós base nascem com 1
  spawnAlpha: number
  // brilho neon individual (0→1), pulsa levemente
  glow: number
  glowDir: number
  // se é um nó spawnado pelo clique (física diferente)
  free?: boolean
}

// Cores neon: dark = azul, light = verde (mesmas dos neon-cards)
const NEON_DARK  = { r: 59,  g: 130, b: 246 } // blue-500
const NEON_LIGHT = { r: 22,  g: 163, b: 74  } // green-600

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const nodesRef  = useRef<Node[]>([])
  const rafRef    = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mobile = window.innerWidth < 768

    // ── Configuração por device ───────────────────────────────────────
    const NODE_COUNT  = mobile ? 45  : 120
    const CONNECT_D   = mobile ? 90  : 145
    const CONNECT_D2  = CONNECT_D * CONNECT_D
    const MAX_NODES   = mobile ? 110 : 280
    const REPEL_R     = 140            // raio de repulsão do hover
    const REPEL_F     = 4.5            // força da repulsão
    const FRICTION    = 0.88
    const RETURN_SPD  = 0.025          // velocidade de retorno à origem

    let w = 0, h = 0

    function makeNode(x?: number, y?: number, spawned = false): Node {
      const px = x ?? Math.random() * w
      const py = y ?? Math.random() * h
      return {
        x: px, y: py,
        vx: (Math.random() - 0.5) * (mobile ? 0.20 : 0.28),
        vy: (Math.random() - 0.5) * (mobile ? 0.20 : 0.28),
        size:        mobile ? 1.0 + Math.random() * 1.2 : 1.2 + Math.random() * 1.8,
        opacity:     0.30 + Math.random() * 0.45,
        originX: px, originY: py,
        spawnAlpha:  spawned ? 0 : 1,
        glow:        Math.random(),
        glowDir:     Math.random() > 0.5 ? 1 : -1,
      }
    }

    function resize() {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => makeNode())
    }

    resize()
    window.addEventListener("resize", resize, { passive: true })

    // ── Mouse: repulsão no hover ──────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    if (!mobile) {
      window.addEventListener("mousemove",  onMouseMove,  { passive: true })
      window.addEventListener("mouseleave", onMouseLeave)
    }

    // ── Função interna: gera nós que nascem no clique e derivam
    //    para posições espalhadas — integrando-se à teia existente
    function spawnWebNodes(cx: number, cy: number, count: number) {
      const slots = MAX_NODES - nodesRef.current.length
      const add   = Math.min(count, Math.max(slots, 0))

      for (let i = 0; i < add; i++) {
        // Nasce em ângulo distribuído + ruído, dentro do raio de conexão
        // → todos dentro de CONNECT_D entre si = linhas visíveis desde o frame 1
        const angle  = (i / add) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
        const birthR = CONNECT_D * (0.08 + Math.random() * 0.70)
        const bx = Math.max(8, Math.min(w - 8, cx + Math.cos(angle) * birthR))
        const by = Math.max(8, Math.min(h - 8, cy + Math.sin(angle) * birthR))

        // Velocidade: leve drift aleatório para se espalhar suavemente
        const spd = mobile ? 0.15 : 0.22
        const vx  = (Math.random() - 0.5) * spd * 2
        const vy  = (Math.random() - 0.5) * spd * 2

        nodesRef.current.push({
          x: bx, y: by, vx, vy,
          size:       1.6 + Math.random() * 2.0,
          opacity:    0.55 + Math.random() * 0.35,
          originX:    -1,   // -1 = nó livre, sem RETURN_SPD
          originY:    -1,
          spawnAlpha: 0.4,  // começa visível — linha aparece no frame 1
          glow:       1.0,
          glowDir:    -1,
          free:       true,
        })
      }
    }

    // ── Click (desktop) ───────────────────────────────────────────────
    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      spawnWebNodes(e.clientX - rect.left, e.clientY - rect.top, 14)
    }
    canvas.addEventListener("click", onCanvasClick)

    // ── Touch (mobile) ────────────────────────────────────────────────
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return
      const t    = e.changedTouches[0]
      const rect = canvas.getBoundingClientRect()
      spawnWebNodes(t.clientX - rect.left, t.clientY - rect.top, 6)
    }
    if (mobile) canvas.addEventListener("touchend", onTouchEnd, { passive: true })

    // ── Loop principal ────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isDark = resolvedTheme !== "light"
      const neon   = isDark ? NEON_DARK : NEON_LIGHT
      const rgb    = isDark ? "255,255,255" : "0,0,0"
      const mx     = mouseRef.current.x
      const my     = mouseRef.current.y
      const nodes  = nodesRef.current

      // ── Física ───────────────────────────────────────────────────────
      for (const p of nodes) {
        // Pulso do glow individual (cada nó tem ritmo próprio)
        p.glow += p.glowDir * 0.008
        if (p.glow >= 1) { p.glow = 1; p.glowDir = -1 }
        if (p.glow <= 0) { p.glow = 0; p.glowDir =  1 }

        if (p.spawnAlpha < 1) {
          // Fade-in rápido: 0.4→1 em ~15 frames
          p.spawnAlpha = Math.min(p.spawnAlpha + 0.04, 1)
        }

        if (p.free) {
          // Nó spawnado pelo clique: flutua completamente livre
          // Fricção suave para se espalhar por mais tempo antes de parar
          p.vx *= 0.97
          p.vy *= 0.97
        } else {
          // Nó base: repulsão hover + retorno à origem
          if (!mobile) {
            const dx = p.x - mx
            const dy = p.y - my
            const d2 = dx * dx + dy * dy
            if (d2 < REPEL_R * REPEL_R && d2 > 0.01) {
              const d     = Math.sqrt(d2)
              const force = (1 - d / REPEL_R) * REPEL_F
              p.vx += (dx / d) * force
              p.vy += (dy / d) * force
            }
          }
          p.vx += (p.originX - p.x) * RETURN_SPD
          p.vy += (p.originY - p.y) * RETURN_SPD
          p.vx *= FRICTION
          p.vy *= FRICTION
        }

        p.x += p.vx
        p.y += p.vy

        // Rebate nas bordas
        if (p.x < 0) { p.x = 0; p.vx =  Math.abs(p.vx) * 0.5 }
        if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx) * 0.5 }
        if (p.y < 0) { p.y = 0; p.vy =  Math.abs(p.vy) * 0.5 }
        if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy) * 0.5 }
      }

      // ── Linhas de conexão (teia) ──────────────────────────────────────
      // Linhas comuns entre nós: branco/preto translúcido
      ctx.shadowBlur  = 0
      ctx.shadowColor = "transparent"

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < CONNECT_D2) {
            const ratio = 1 - d2 / CONNECT_D2
            // Usa min() em vez de produto: linha aparece assim que UM dos nós existe
            const sa    = Math.min(nodes[i].spawnAlpha, nodes[j].spawnAlpha)
            // Linhas mais próximas do cursor ficam levemente mais brilhantes
            const distMx2 = (nodes[i].x - mx) ** 2 + (nodes[i].y - my) ** 2
            const hover   = !mobile && distMx2 < (REPEL_R * 1.5) ** 2
                            ? 0.18 : 0

            const alpha = ratio * (isDark ? 0.18 : 0.12) * sa + hover * ratio
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`
            ctx.lineWidth   = ratio * (isDark ? 0.85 : 0.70)
            ctx.stroke()
          }
        }
      }

      // ── Nós com glow neon ────────────────────────────────────────────
      for (const p of nodes) {
        const a    = p.opacity * (isDark ? 0.85 : 0.65) * p.spawnAlpha
        // Intensidade do glow pulsa com cada nó + recém-spawnados brilham no máximo
        const glowIntensity = (0.55 + p.glow * 0.45) * p.spawnAlpha
        const glowRadius    = p.size * (5 + p.glow * 9)

        // Halo neon externo — difuso e colorido
        ctx.shadowBlur  = glowRadius
        ctx.shadowColor = `rgba(${neon.r},${neon.g},${neon.b},${(glowIntensity * (isDark ? 0.85 : 0.60)).toFixed(3)})`

        // Anel externo translúcido (dá volume ao nó)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${a.toFixed(3)})`
        ctx.fill()

        // Miolo neon puro — pequeno e ultra-brilhante
        ctx.shadowBlur  = p.size * 4
        ctx.shadowColor = `rgba(${neon.r},${neon.g},${neon.b},1)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${neon.r},${neon.g},${neon.b},${(glowIntensity * (isDark ? 0.80 : 0.60)).toFixed(3)})`
        ctx.fill()
      }

      // Resetar shadow para não vazar para outros elementos
      ctx.shadowBlur  = 0
      ctx.shadowColor = "transparent"

      rafRef.current = requestAnimationFrame(draw)
    }

    // Adiamento pós-LCP: desktop 400ms | mobile 1800ms
    const delay = mobile ? 1800 : 400
    const timer = setTimeout(() => { rafRef.current = requestAnimationFrame(draw) }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      if (!mobile) {
        window.removeEventListener("mousemove",  onMouseMove)
        window.removeEventListener("mouseleave", onMouseLeave)
      }
      canvas.removeEventListener("click",    onCanvasClick)
      if (mobile) canvas.removeEventListener("touchend", onTouchEnd)
    }
  }, [mounted, resolvedTheme])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ willChange: "transform", cursor: "crosshair" }}
      aria-hidden="true"
    />
  )
}

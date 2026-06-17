"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

// ─── Efeito de teia/grafo ────────────────────────────────────────────────────
// Nós flutuam e se conectam por linhas quando próximos.
// Clicar espalha novos nós em burst que crescem a teia organicamente.
// Desktop: 120 nós + repulsão de mouse + linhas até 140px
// Mobile : 45 nós + linhas até 90px + início adiado 1800ms (pós-LCP)

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  // nós base têm posição de origem (usada na repulsão de mouse)
  originX: number
  originY: number
  // nós nascidos por clique: alpha cresce de 0 até 1
  spawnAlpha: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const nodesRef = useRef<Node[]>([])
  const rafRef = useRef<number>(0)
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

    const NODE_COUNT  = mobile ? 45  : 120
    const CONNECT_D   = mobile ? 90  : 140   // px — distância máxima para linha
    const CONNECT_D2  = CONNECT_D * CONNECT_D
    const MAX_NODES   = mobile ? 120 : 300   // limite ao spawnar por clique
    const REPEL_R     = 130
    const REPEL_F     = 5.0
    const FRICTION    = 0.87
    const RETURN_SPD  = 0.028

    let w = 0, h = 0

    function makeNode(x?: number, y?: number, spawned = false): Node {
      const px = x ?? Math.random() * w
      const py = y ?? Math.random() * h
      return {
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * (mobile ? 0.22 : 0.30),
        vy: (Math.random() - 0.5) * (mobile ? 0.22 : 0.30),
        size: mobile ? 1.0 + Math.random() * 1.4 : 1.2 + Math.random() * 2.0,
        opacity: 0.25 + Math.random() * 0.50,
        originX: px,
        originY: py,
        spawnAlpha: spawned ? 0 : 1,
      }
    }

    function resize() {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => makeNode())
    }

    resize()
    window.addEventListener("resize", resize, { passive: true })

    // Mouse repulsion — desktop only
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    if (!mobile) {
      window.addEventListener("mousemove",  onMouseMove,  { passive: true })
      window.addEventListener("mouseleave", onMouseLeave)
    }

    // Click: burst de novos nós que crescem a teia
    const onCanvasClick = (e: MouseEvent) => {
      const rect  = canvas.getBoundingClientRect()
      const cx    = e.clientX - rect.left
      const cy    = e.clientY - rect.top
      const count = mobile ? 5 : 12

      for (let i = 0; i < count; i++) {
        if (nodesRef.current.length >= MAX_NODES) break
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const speed = mobile
          ? 0.4 + Math.random() * 0.9
          : 0.7 + Math.random() * 1.6

        nodesRef.current.push({
          x: cx + Math.cos(angle) * 3,
          y: cy + Math.sin(angle) * 3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.4 + Math.random() * 2.0,
          opacity: 0.55 + Math.random() * 0.35,
          originX: cx,
          originY: cy,
          spawnAlpha: 0,
        })
      }
    }
    canvas.addEventListener("click", onCanvasClick)

    // ── Loop principal ────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isDark = resolvedTheme !== "light"
      const rgb    = isDark ? "255,255,255" : "0,0,0"
      const mx     = mouseRef.current.x
      const my     = mouseRef.current.y
      const nodes  = nodesRef.current

      // ── Física ───────────────────────────────────────────────────────
      for (const p of nodes) {
        // Spawn: alpha cresce suavemente de 0 → 1
        if (p.spawnAlpha < 1) {
          p.spawnAlpha = Math.min(p.spawnAlpha + 0.035, 1)
          // Nós spawned desaceleram gradualmente até ficarem flutuando
          p.vx *= 0.970
          p.vy *= 0.970
        } else {
          // Nós base: repulsão de mouse + retorno à origem
          if (!mobile) {
            const dx   = p.x - mx
            const dy   = p.y - my
            const d2   = dx * dx + dy * dy
            if (d2 < REPEL_R * REPEL_R && d2 > 0) {
              const d     = Math.sqrt(d2)
              const force = (1 - d / REPEL_R) * REPEL_F
              p.vx += (dx / d) * force
              p.vy += (dy / d) * force
            }
            p.vx += (p.originX - p.x) * RETURN_SPD
            p.vy += (p.originY - p.y) * RETURN_SPD
          }
          p.vx *= FRICTION
          p.vy *= FRICTION
        }

        p.x += p.vx
        p.y += p.vy

        // Rebate suave nas bordas
        if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx) * 0.5 }
        if (p.x > w)  { p.x = w;  p.vx = -Math.abs(p.vx) * 0.5 }
        if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy) * 0.5 }
        if (p.y > h)  { p.y = h;  p.vy = -Math.abs(p.vy) * 0.5 }
      }

      // ── Linhas de conexão (teia) ──────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < CONNECT_D2) {
            const ratio   = 1 - d2 / CONNECT_D2
            const alpha   = ratio
                          * (isDark ? 0.22 : 0.14)
                          * nodes[i].spawnAlpha
                          * nodes[j].spawnAlpha
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`
            ctx.lineWidth   = ratio * (isDark ? 0.9 : 0.75)
            ctx.stroke()
          }
        }
      }

      // ── Nós ──────────────────────────────────────────────────────────
      for (const p of nodes) {
        const a = p.opacity * (isDark ? 0.8 : 0.6) * p.spawnAlpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${a.toFixed(3)})`
        ctx.fill()
      }

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
      canvas.removeEventListener("click", onCanvasClick)
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

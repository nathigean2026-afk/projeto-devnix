"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

// ─── Efeito de teia/grafo interativo (desktop-only) — v4 ────────────────────
// Mobile: canvas NUNCA renderiza — background CSS puro no globals.css
// isMobile começa como TRUE → componente retorna null antes de qualquer canvas
// ─────────────────────────────────────────────────────────────────────────────

interface Node {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  originX: number; originY: number
  spawnAlpha: number
  glow: number; glowDir: number
  free?: boolean
  life: number
}

const NEON_DARK  = { r: 59,  g: 130, b: 246 } // blue-500
const NEON_LIGHT = { r: 22,  g: 163, b: 74  } // green-600

export function AnimatedBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const nodesRef   = useRef<Node[]>([])
  const rafRef     = useRef<number>(0)
  // themeRef: lido dentro do draw() sem reinicializar o canvas ao trocar tema
  const themeRef   = useRef<string>("dark")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted]   = useState(false)
  const [isMobile, setIsMobile] = useState(true) // começa true → não renderiza canvas

  // Sincroniza tema no ref sem reinicializar o useEffect principal
  useEffect(() => {
    themeRef.current = resolvedTheme ?? "dark"
  }, [resolvedTheme])

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!mounted || isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── Constantes desktop ────────────────────────────────────────────
    const NODE_COUNT      = 65
    const CONNECT_D       = 160
    const CONNECT_D2      = CONNECT_D * CONNECT_D
    const MAX_FREE        = 30
    const SPAWN_PER_CLICK = 7
    const LINE_ALPHA_BASE = 0.35
    const REPEL_R         = 130
    const REPEL_F         = 4.0
    const FRICTION        = 0.88
    const RETURN_SPD      = 0.025

    let w = 0, h = 0

    function makeNode(x?: number, y?: number, spawned = false): Node {
      const px = x ?? Math.random() * w
      const py = y ?? Math.random() * h
      return {
        x: px, y: py,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size:       1.2 + Math.random() * 1.8,
        opacity:    0.30 + Math.random() * 0.45,
        originX: px, originY: py,
        spawnAlpha: spawned ? 0 : 1,
        glow:       Math.random(),
        glowDir:    Math.random() > 0.5 ? 1 : -1,
        life:       Infinity,
      }
    }

    function resize() {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => makeNode())
    }

    resize()
    window.addEventListener("resize", resize, { passive: true })

    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    window.addEventListener("mousemove",  onMouseMove,  { passive: true })
    window.addEventListener("mouseleave", onMouseLeave)

    function spawnWebNodes(cx: number, cy: number, count: number) {
      const freeAlive = nodesRef.current.filter((n) => n.free && n.life > 0).length
      if (freeAlive >= MAX_FREE) {
        const sorted = nodesRef.current
          .filter((n) => n.free && n.life > 0)
          .sort((a, b) => a.life - b.life)
        sorted.slice(0, count).forEach((n) => { n.life = Math.min(n.life, 60) })
      }
      const add = Math.min(count, MAX_FREE - Math.max(0, freeAlive - count))
      for (let i = 0; i < add; i++) {
        const angle  = (i / Math.max(add, 1)) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const birthR = CONNECT_D * (0.05 + Math.random() * 0.30)
        const bx = Math.max(8, Math.min(w - 8, cx + Math.cos(angle) * birthR))
        const by = Math.max(8, Math.min(h - 8, cy + Math.sin(angle) * birthR))
        const spd = 0.40
        nodesRef.current.push({
          x: bx, y: by,
          vx: Math.cos(angle) * spd * (0.4 + Math.random() * 0.6),
          vy: Math.sin(angle) * spd * (0.4 + Math.random() * 0.6),
          size:       1.5 + Math.random() * 1.8,
          opacity:    0.65 + Math.random() * 0.25,
          originX:    -1, originY: -1,
          spawnAlpha: 1.0,
          glow:       1.0, glowDir: -1,
          free:       true,
          life:       300 + Math.random() * 300,
        })
      }
    }

    const onWindowClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("a, button, input, textarea, select, [role=button]")) return
      spawnWebNodes(e.clientX, e.clientY, SPAWN_PER_CLICK)
    }
    window.addEventListener("click", onWindowClick)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isDark = themeRef.current !== "light"
      const neon   = isDark ? NEON_DARK : NEON_LIGHT
      const rgb    = isDark ? "255,255,255" : "0,0,0"
      const mx     = mouseRef.current.x
      const my     = mouseRef.current.y
      const nodes  = nodesRef.current

      // ── Física ───────────────────────────────────────────────────────
      for (const p of nodes) {
        p.glow += p.glowDir * 0.008
        if (p.glow >= 1) { p.glow = 1; p.glowDir = -1 }
        if (p.glow <= 0) { p.glow = 0; p.glowDir =  1 }

        if (!p.free && p.spawnAlpha < 1) {
          p.spawnAlpha = Math.min(p.spawnAlpha + 0.04, 1)
        }

        // Repulsão pelo cursor
        const rdx = p.x - mx
        const rdy = p.y - my
        const rd2 = rdx * rdx + rdy * rdy
        if (rd2 < REPEL_R * REPEL_R && rd2 > 0.01) {
          const rd    = Math.sqrt(rd2)
          const force = (1 - rd / REPEL_R) * REPEL_F
          p.vx += (rdx / rd) * force
          p.vy += (rdy / rd) * force
        }

        if (p.free) {
          p.life -= 1
          const fadeThresh = 480 * 0.30
          if (p.life < fadeThresh) p.spawnAlpha = Math.max(0, p.life / fadeThresh)
          p.vx *= 0.97
          p.vy *= 0.97
        } else {
          p.vx += (p.originX - p.x) * RETURN_SPD
          p.vy += (p.originY - p.y) * RETURN_SPD
          p.vx *= FRICTION
          p.vy *= FRICTION
        }

        p.x += p.vx; p.y += p.vy
        if (p.x < 0) { p.x = 0; p.vx =  Math.abs(p.vx) * 0.5 }
        if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx) * 0.5 }
        if (p.y < 0) { p.y = 0; p.vy =  Math.abs(p.vy) * 0.5 }
        if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy) * 0.5 }
      }

      nodesRef.current = nodes.filter((p) => !(p.free && p.life <= 0))
      const drawNodes  = nodesRef.current

      // ── Linhas (teia) ─────────────────────────────────────────────────
      ctx.shadowBlur  = 0
      ctx.shadowColor = "transparent"
      for (let i = 0; i < drawNodes.length; i++) {
        for (let j = i + 1; j < drawNodes.length; j++) {
          const dx = drawNodes[i].x - drawNodes[j].x
          const dy = drawNodes[i].y - drawNodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < CONNECT_D2) {
            const ratio = 1 - d2 / CONNECT_D2
            const ni = drawNodes[i], nj = drawNodes[j]
            const sa = Math.min(ni.spawnAlpha, nj.spawnAlpha)
            const isFreeEdge = ni.free || nj.free
            const baseAlpha  = isFreeEdge ? LINE_ALPHA_BASE : (isDark ? 0.38 : 0.14)
            const distMx2    = (ni.x - mx) ** 2 + (ni.y - my) ** 2
            const hover      = distMx2 < (REPEL_R * 1.5) ** 2 ? 0.18 : 0
            const alpha      = ratio * baseAlpha * sa + hover * ratio
            ctx.beginPath()
            ctx.moveTo(ni.x, ni.y)
            ctx.lineTo(nj.x, nj.y)
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`
            ctx.lineWidth   = ratio * (isFreeEdge ? 1.0 : (isDark ? 0.95 : 0.70))
            ctx.stroke()
          }
        }
      }

      // ── Nós com glow neon ─────────────────────────────────────────────
      for (const p of drawNodes) {
        const sa    = p.spawnAlpha
        const pulse = 0.40 + p.glow * 0.60
        const haloR = p.size * (8 + p.glow * 10)
        const haloA = pulse * sa * (isDark ? 0.55 : 0.35)

        ctx.shadowBlur  = haloR
        ctx.shadowColor = `rgba(${neon.r},${neon.g},${neon.b},${haloA.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${(p.opacity * (isDark ? 0.90 : 0.70) * sa).toFixed(3)})`
        ctx.fill()

        ctx.shadowBlur  = p.size * 5
        ctx.shadowColor = `rgba(${neon.r},${neon.g},${neon.b},${(pulse * sa * (isDark ? 1.0 : 0.75)).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.40, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${neon.r},${neon.g},${neon.b},${(pulse * sa * (isDark ? 0.90 : 0.70)).toFixed(3)})`
        ctx.fill()
      }

      ctx.shadowBlur  = 0
      ctx.shadowColor = "transparent"
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize",     resize)
      window.removeEventListener("mousemove",  onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("click",      onWindowClick)
    }
  }, [mounted, isMobile])

  // Mobile: não renderiza canvas — background CSS cuida da textura
  if (!mounted || isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}

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
  spawnAlpha: number
  glow: number
  glowDir: number
  // nó spawnado pelo clique: física livre, sem retorno à origem
  free?: boolean
  // vida em frames: Infinity para nós base, 480-960 para nós livres
  life: number
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
    const NODE_COUNT      = mobile ? 35  : 65
    const CONNECT_D       = mobile ? 110 : 160   // raio de conexão maior → mais linhas visíveis
    const CONNECT_D2      = CONNECT_D * CONNECT_D
    const MAX_FREE        = mobile ? 16  : 30    // limite conservador de nós livres
    const SPAWN_PER_CLICK = mobile ? 5   : 7
    const LINE_ALPHA_BASE = 0.35                 // alpha base das linhas (era 0.18 — muito escuro)
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
        vx: (Math.random() - 0.5) * (mobile ? 0.20 : 0.28),
        vy: (Math.random() - 0.5) * (mobile ? 0.20 : 0.28),
        size:        mobile ? 1.0 + Math.random() * 1.2 : 1.2 + Math.random() * 1.8,
        opacity:     0.30 + Math.random() * 0.45,
        originX: px, originY: py,
        spawnAlpha:  spawned ? 0 : 1,
        glow:        Math.random(),
        glowDir:     Math.random() > 0.5 ? 1 : -1,
        life:        Infinity,
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
      // Conta apenas nós livres com vida restante
      const freeAlive = nodesRef.current.filter((n) => n.free && n.life > 0).length
      // Se já atingiu o limite, os mais antigos vão sumindo naturalmente —
      // mas forçamos novos slots acelerando o fade dos mais velhos
      if (freeAlive >= MAX_FREE) {
        // Acelera fade-out dos mais velhos (menor vida restante)
        const freeNodes = nodesRef.current
          .filter((n) => n.free && n.life > 0)
          .sort((a, b) => a.life - b.life)
        // Mata os 'count' mais velhos imediatamente
        freeNodes.slice(0, count).forEach((n) => { n.life = Math.min(n.life, 60) })
      }
      const add = Math.min(count, MAX_FREE - Math.max(0, freeAlive - count))

      for (let i = 0; i < add; i++) {
        const angle = (i / Math.max(add, 1)) * Math.PI * 2 + (Math.random() - 0.5) * 0.5

        // Nasce PERTO do clique — dentro de 35% do raio de conexão
        // Assim os nós já estão conectados entre si no frame 1
        const birthR = CONNECT_D * (0.05 + Math.random() * 0.30)
        const bx = Math.max(8, Math.min(w - 8, cx + Math.cos(angle) * birthR))
        const by = Math.max(8, Math.min(h - 8, cy + Math.sin(angle) * birthR))

        // Velocidade baixa: nós se espalham lentamente para não sair do CONNECT_D
        const spd = mobile ? 0.30 : 0.40
        const vx  = Math.cos(angle) * spd * (0.4 + Math.random() * 0.6)
        const vy  = Math.sin(angle) * spd * (0.4 + Math.random() * 0.6)

        // Vida de 5-10s @ 60fps
        const life = 300 + Math.random() * 300
        nodesRef.current.push({
          x: bx, y: by, vx, vy,
          size:       1.5 + Math.random() * 1.8,
          opacity:    0.65 + Math.random() * 0.25,
          originX:    -1,
          originY:    -1,
          spawnAlpha: 1.0,  // começa totalmente visível — sem fade-in
          glow:       1.0,
          glowDir:    -1,
          free:       true,
          life,
        })
      }
    }

    // Expõe spawn globalmente — facilita testes e integração futura
    ;(window as typeof window & { __spawnWeb?: (x: number, y: number, n: number) => void }).__spawnWeb = spawnWebNodes

    // ── Click no WINDOW (não no canvas) ──────────────────────────────
    // O canvas fica em z-0, elementos HTML ficam na frente.
    // Escutando window garante que qualquer click na página dispara.
    // Ignora clicks em inputs, botões e links para não interferir com UI.
    const onWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, input, textarea, select, [role=button]")) return
      spawnWebNodes(e.clientX, e.clientY, SPAWN_PER_CLICK)
    }
    window.addEventListener("click", onWindowClick)

    // ── Touch no WINDOW (mobile) ──────────────────────────────────────
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return
      const target = e.target as HTMLElement
      if (target.closest("a, button, input, textarea, select, [role=button]")) return
      const t = e.changedTouches[0]
      spawnWebNodes(t.clientX, t.clientY, SPAWN_PER_CLICK)
    }
    if (mobile) window.addEventListener("touchend", onTouchEnd, { passive: true })

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

        // Fade-in apenas para nós base (spawned=true inicia em 0)
        if (!p.free && p.spawnAlpha < 1) {
          p.spawnAlpha = Math.min(p.spawnAlpha + 0.04, 1)
        }

        // Repulsão hover — funciona para TODOS os nós (base e livres)
        if (!mobile) {
          const rdx = p.x - mx
          const rdy = p.y - my
          const rd2 = rdx * rdx + rdy * rdy
          if (rd2 < REPEL_R * REPEL_R && rd2 > 0.01) {
            const rd    = Math.sqrt(rd2)
            const force = (1 - rd / REPEL_R) * REPEL_F
            p.vx += (rdx / rd) * force
            p.vy += (rdy / rd) * force
          }
        }

        if (p.free) {
          // Decrementa vida; fade-out nos últimos 30% da vida total
          p.life -= 1
          const fadeThresh = (240 + 240) * 0.30  // ~144 frames
          if (p.life < fadeThresh) {
            p.spawnAlpha = Math.max(0, p.life / fadeThresh)
          }
          // Fricção suave — nó flutua livre sem retorno à origem
          p.vx *= 0.97
          p.vy *= 0.97
        } else {
          // Nó base: retorno à origem + fricção normal
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

      // Remove nós livres com vida esgotada
      nodesRef.current = nodes.filter((p) => !(p.free && p.life <= 0))
      const drawNodes = nodesRef.current

      // ── Linhas de conexão (teia) ──────────────────────────────────────
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
            // Se pelo menos um dos nós é livre (clique), a linha fica mais visível
            const isFreeEdge = ni.free || nj.free
            const baseAlpha  = isFreeEdge ? LINE_ALPHA_BASE : (isDark ? 0.18 : 0.12)
            const distMx2    = (ni.x - mx) ** 2 + (ni.y - my) ** 2
            const hover      = !mobile && distMx2 < (REPEL_R * 1.5) ** 2 ? 0.15 : 0
            const alpha      = ratio * baseAlpha * sa + hover * ratio
            ctx.beginPath()
            ctx.moveTo(ni.x, ni.y)
            ctx.lineTo(nj.x, nj.y)
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`
            ctx.lineWidth   = ratio * (isFreeEdge ? 0.90 : (isDark ? 0.85 : 0.70))
            ctx.stroke()
          }
        }
      }

      // ── Nós com glow neon ────────────────────────────────────────────
      for (const p of drawNodes) {
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

    // Inicia imediatamente — delay remvido pois causava canvas branco
    rafRef.current = requestAnimationFrame(draw)
    const timer = 0

    return () => {
      // timer = 0, nada a limpar
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      if (!mobile) {
        window.removeEventListener("mousemove",  onMouseMove)
        window.removeEventListener("mouseleave", onMouseLeave)
      }
      window.removeEventListener("click",    onWindowClick)
      if (mobile) window.removeEventListener("touchend", onTouchEnd)
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

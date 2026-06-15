"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  originalX: number
  originalY: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      // Respawn particles on resize
      particlesRef.current = createParticles(w, h)
    }

    const createParticles = (width: number, height: number): Particle[] =>
      Array.from({ length: 220 }, () => {
        const x = Math.random() * width
        const y = Math.random() * height
        return {
          x,
          y,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 2.5,
          opacity: 0.15 + Math.random() * 0.55,
          originalX: x,
          originalY: y,
        }
      })

    resize()
    window.addEventListener("resize", resize, { passive: true })

    const REPEL_RADIUS = 130
    const REPEL_STRENGTH = 5.5
    const RETURN_SPEED = 0.042
    const FRICTION = 0.88

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("mouseleave", onMouseLeave)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isDark = resolvedTheme !== "light"
      const rgb = isDark ? "255,255,255" : "0,0,0"
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particlesRef.current.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Return to origin
        p.vx += (p.originalX - p.x) * RETURN_SPEED
        p.vy += (p.originalY - p.y) * RETURN_SPEED

        // Friction
        p.vx *= FRICTION
        p.vy *= FRICTION

        p.x += p.vx
        p.y += p.vy

        // Draw particle
        ctx.globalAlpha = p.opacity * (isDark ? 0.6 : 0.5)
        ctx.fillStyle = `rgb(${rgb})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections between nearby particles
      ctx.globalAlpha = 1
      const pts = particlesRef.current
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = dx * dx + dy * dy
          if (d < 8000) {
            const alpha = (1 - d / 8000) * (isDark ? 0.07 : 0.05)
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${rgb},${alpha})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [resolvedTheme])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}

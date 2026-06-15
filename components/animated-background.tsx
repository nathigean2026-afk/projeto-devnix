"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  opacity: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    let w = 0, h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Floating orbs
    const orbs: Orb[] = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 200 + i * 80,
      opacity: 0.06 + Math.random() * 0.06,
    }))

    // Moving dots
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 0.8 + Math.random() * 1.2,
      opacity: 0.15 + Math.random() * 0.25,
    }))

    let mouseX = w / 2, mouseY = h / 2
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener("mousemove", onMouse)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const isDark = resolvedTheme !== "light"
      const orbColor = isDark ? "255,255,255" : "0,0,0"
      const dotColor = isDark ? "255,255,255" : "10,10,10"

      // Draw orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx + (mouseX - w / 2) * 0.00015
        orb.y += orb.vy + (mouseY - h / 2) * 0.00015
        if (orb.x < -orb.r) orb.x = w + orb.r
        if (orb.x > w + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = h + orb.r
        if (orb.y > h + orb.r) orb.y = -orb.r

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
        grad.addColorStop(0, `rgba(${orbColor},${orb.opacity})`)
        grad.addColorStop(1, `rgba(${orbColor},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw dots + connections
      dots.forEach((dot) => {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < 0) dot.x = w
        if (dot.x > w) dot.x = 0
        if (dot.y < 0) dot.y = h
        if (dot.y > h) dot.y = 0

        ctx.globalAlpha = dot.opacity * (isDark ? 0.5 : 0.35)
        ctx.fillStyle = `rgb(${dotColor})`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Connections
      ctx.globalAlpha = 1
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            const alpha = (1 - dist / 120) * (isDark ? 0.06 : 0.04)
            ctx.strokeStyle = `rgba(${dotColor},${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}

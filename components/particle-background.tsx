"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
  text: string
  color: string
}

const CODE_SNIPPETS = [
  "const", "function", "return", "useState", "useEffect",
  "async", "await", "fetch()", "API", "POST", "GET",
  "React", "Next.js", "TypeScript", "Node.js", "SQL",
  "{ }", "[ ]", "=>", "import", "export",
  "index.tsx", "app.js", "server.ts",
  "<div>", "<h1>", "</p>", "className",
  "git push", "npm run", "deploy",
  "0101", "1100", "0011", "1010",
  "SELECT *", "INSERT", "UPDATE",
  "git commit", "yarn build",
]

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Neon green color with variation
    const colors = [
      "rgba(0, 255, 136,",
      "rgba(0, 220, 120,",
      "rgba(0, 180, 100,",
    ]

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.05,
      size: Math.random() * 10 + 8,
      text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    })

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -100) p.x = canvas.width + 100
        if (p.x > canvas.width + 100) p.x = -100
        if (p.y < -50) p.y = canvas.height + 50
        if (p.y > canvas.height + 50) p.y = -50

        ctx.save()
        ctx.font = `${p.size}px 'Geist Mono', monospace`
        ctx.fillStyle = `${p.color}${p.opacity})`
        ctx.fillText(p.text, p.x, p.y)
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}

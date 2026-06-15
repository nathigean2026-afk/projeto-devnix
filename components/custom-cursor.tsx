"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    let raf: number

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      cursor.style.transform += " scale(2.5)"
      follower.style.opacity = "0.4"
    }
    const onLeave = () => {
      follower.style.opacity = "1"
    }

    document.addEventListener("mousemove", move)
    document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
    })

    raf = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          className="size-2 rounded-full"
          style={{ background: isDark ? "#ffffff" : "#0a0a0a" }}
        />
      </div>
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          className="size-10 rounded-full border"
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </>
  )
}

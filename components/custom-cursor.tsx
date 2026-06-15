"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.11
      ringY += (mouseY - ringY) * 0.11
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      dot.style.transform += " scale(2)"
      ring.style.opacity = "0.3"
    }
    const onLeave = () => {
      ring.style.opacity = "1"
    }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
    })

    raf = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div className="size-2 rounded-full bg-white" />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div
          className="size-9 rounded-full border border-white"
          style={{ transition: "opacity 0.3s" }}
        />
      </div>
    </>
  )
}

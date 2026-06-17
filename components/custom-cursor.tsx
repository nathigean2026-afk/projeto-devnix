"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  useEffect(() => {
    // Only activate on non-touch devices
    const hasTouch = window.matchMedia("(pointer: coarse)").matches
    if (hasTouch) return
    setIsTouchDevice(false)

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number
    let hovering = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(${hovering ? 2 : 1})`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px) scale(${hovering ? 1.4 : 1})`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = () => { hovering = true }
    const onLeave = () => { hovering = false }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.querySelectorAll("a, button, [role='button']").forEach((el) => {
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
    })

    raf = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // On touch devices, render nothing and keep default cursor
  if (isTouchDevice) return null

  return (
    <>
      {/* Small solid dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s, transform 0.08s linear",
        }}
      >
        <div
          className="size-1.5 rounded-full"
          style={{ background: "var(--foreground)", opacity: 0.9 }}
        />
      </div>
      {/* Soft ring — lagging behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          willChange: "transform",
          opacity: visible ? 0.45 : 0,
          transition: "opacity 0.3s, transform 0.06s linear",
        }}
      >
        <div
          className="size-7 rounded-full border"
          style={{ borderColor: "var(--foreground)", transition: "transform 0.18s cubic-bezier(0.23,1,0.32,1)" }}
        />
      </div>
    </>
  )
}

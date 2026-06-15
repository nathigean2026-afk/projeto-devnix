"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  aspectRatio?: string
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Antes",
  afterLabel = "Depois",
  aspectRatio = "16/9",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50) // 0–100 %
  const [dragging, setDragging] = useState(false)

  const update = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setDragging(true); update(e.clientX) }
  const onMouseMove = useCallback((e: MouseEvent) => { if (dragging) update(e.clientX) }, [dragging, update])
  const onMouseUp   = useCallback(() => setDragging(false), [])

  // Touch
  const onTouchStart = (e: React.TouchEvent) => { setDragging(true); update(e.touches[0].clientX) }
  const onTouchMove  = useCallback((e: TouchEvent) => { if (dragging) { e.preventDefault(); update(e.touches[0].clientX) } }, [dragging, update])
  const onTouchEnd   = useCallback(() => setDragging(false), [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",   onMouseUp)
    window.addEventListener("touchmove",  onTouchMove,  { passive: false })
    window.addEventListener("touchend",   onTouchEnd)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup",   onMouseUp)
      window.removeEventListener("touchmove",  onTouchMove)
      window.removeEventListener("touchend",   onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-border select-none"
      style={{ aspectRatio, cursor: dragging ? "grabbing" : "ew-resize" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      aria-label="Arraste para comparar antes e depois"
    >
      {/* AFTER — full width, behind */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterSrc}
          alt="Depois"
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
          draggable={false}
        />
      </div>

      {/* BEFORE — clipped to left of handle */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="absolute inset-0" style={{ width: containerRef.current?.offsetWidth ?? "100%" }}>
          <Image
            src={beforeSrc}
            alt="Antes"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            draggable={false}
          />
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ left: `${position}%`, background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(0,0,0,0.4)" }}
      />

      {/* Handle knob */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full border-2 border-white bg-background shadow-lg flex items-center justify-center gap-1 pointer-events-none"
        style={{ left: `${position}%`, boxShadow: "0 0 0 1px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.35)" }}
      >
        {/* left arrow */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
          <path d="M6 2L3 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* right arrow */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
          <path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 pointer-events-none" style={{ opacity: position > 12 ? 1 : 0, transition: "opacity 0.2s" }}>
        <span className="px-2 py-1 rounded text-xs font-bold tracking-wider uppercase text-white"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none" style={{ opacity: position < 88 ? 1 : 0, transition: "opacity 0.2s" }}>
        <span className="px-2 py-1 rounded text-xs font-bold tracking-wider uppercase text-white"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          {afterLabel}
        </span>
      </div>
    </div>
  )
}

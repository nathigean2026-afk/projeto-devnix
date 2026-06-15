"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Antes",
  afterLabel = "Depois",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50) // 0–100%
  const [dragging, setDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  // Track container width for correct pixel math on the BEFORE clip
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth))
    ro.observe(el)
    setContainerWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

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
    <div className="flex flex-col gap-3 w-full">
      {/* Outer scroll wrapper — max height so very long screenshots don't go forever */}
      <div
        className="w-full rounded-2xl border border-border overflow-hidden"
        style={{ maxHeight: "70vh", overflowY: "auto", position: "relative" }}
      >
        {/*
          Inner drag container:
          – position: relative so the handle and divider are anchored to it
          – height: auto so both images show at FULL natural height
          – We use a CSS grid so both images share the exact same cell
            and the taller one sets the row height
        */}
        <div
          ref={containerRef}
          className="relative w-full select-none"
          style={{ cursor: dragging ? "grabbing" : "ew-resize", minHeight: "200px" }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          aria-label="Arraste para comparar antes e depois"
        >
          {/* ── AFTER image — full width, natural height, sits behind ── */}
          <Image
            src={afterSrc}
            alt={afterLabel}
            width={1280}
            height={900}
            className="w-full h-auto block"
            style={{ display: "block" }}
            sizes="(max-width: 1024px) 100vw, 55vw"
            draggable={false}
            priority
          />

          {/* ── BEFORE image — clipped to the left of the handle ──
              It sits on top of AFTER, absolutely positioned to fill the same space.
              clipPath cuts it at the handle position so only left side shows.
          ── */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${position}%` }}
          >
            {/* This inner div must be exactly as wide as the container so
                the image renders at the same scale as the AFTER image */}
            <div style={{ width: containerWidth > 0 ? `${containerWidth}px` : "100%" }}>
              <Image
                src={beforeSrc}
                alt={beforeLabel}
                width={1280}
                height={900}
                className="w-full h-auto block"
                sizes="(max-width: 1024px) 100vw, 55vw"
                draggable={false}
                priority
              />
            </div>
          </div>

          {/* ── Divider line ── */}
          <div
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
            style={{
              left: `${position}%`,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          />

          {/* ── Handle knob ── */}
          <div
            className="absolute -translate-x-1/2 size-11 rounded-full flex items-center justify-center gap-1 pointer-events-none z-10"
            style={{
              left: `${position}%`,
              top: "50%",
              transform: `translateX(-50%) translateY(-50%)`,
              background: "var(--background)",
              border: "2px solid rgba(255,255,255,0.9)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" className="opacity-75">
              <path d="M6 2L3 5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none" className="opacity-75">
              <path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* ── Labels — sticky to top so they're always visible on scroll ── */}
          <div
            className="absolute top-3 left-3 pointer-events-none z-10"
            style={{ opacity: position > 10 ? 1 : 0, transition: "opacity 0.2s" }}
          >
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            >
              {beforeLabel}
            </span>
          </div>
          <div
            className="absolute top-3 right-3 pointer-events-none z-10"
            style={{ opacity: position < 90 ? 1 : 0, transition: "opacity 0.2s" }}
          >
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            >
              {afterLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-xs text-muted-foreground text-center">
        Arraste para comparar — role para ver o site completo
      </p>
    </div>
  )
}

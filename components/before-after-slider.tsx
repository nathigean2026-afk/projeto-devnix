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
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const update = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseDown  = (e: React.MouseEvent)  => { e.preventDefault(); setDragging(true); update(e.clientX) }
  const onTouchStart = (e: React.TouchEvent)  => { setDragging(true); update(e.touches[0].clientX) }

  const onMouseMove  = useCallback((e: MouseEvent) => { if (dragging) update(e.clientX) }, [dragging, update])
  const onMouseUp    = useCallback(() => setDragging(false), [])
  const onTouchMove  = useCallback((e: TouchEvent) => {
    if (dragging) { e.preventDefault(); update(e.touches[0].clientX) }
  }, [dragging, update])
  const onTouchEnd   = useCallback(() => setDragging(false), [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",   onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend",  onTouchEnd)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup",   onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend",  onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Scroll wrapper */}
      <div
        className="w-full rounded-2xl border border-border overflow-hidden"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/*
          Drag container — position: relative, height = natural image height.
          Both images are stacked with CSS grid (grid-template-areas trick):
          they share the same grid cell so the taller one sets the row height.
          The BEFORE image uses clipPath so it's clipped at pixel level
          regardless of scroll position — no absolute positioning needed.
        */}
        <div
          ref={containerRef}
          className="relative w-full select-none"
          style={{
            cursor: dragging ? "grabbing" : "ew-resize",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          aria-label="Arraste para comparar antes e depois"
        >
          {/* AFTER — full width, sits in grid cell, defines the row height */}
          <Image
            src={afterSrc}
            alt={afterLabel}
            width={1280}
            height={3200}
            className="w-full h-auto block"
            style={{ gridArea: "1 / 1 / 2 / 2", display: "block" }}
            sizes="(max-width: 1024px) 100vw, 55vw"
            draggable={false}
            priority
          />

          {/*
            BEFORE — exact same cell, exact same size.
            clipPath cuts the image at the handle position.
            Because clipPath works in the element's own coordinate space,
            it always covers the full height no matter scroll position.
          */}
          <Image
            src={beforeSrc}
            alt={beforeLabel}
            width={1280}
            height={3200}
            className="w-full h-auto block"
            style={{
              gridArea: "1 / 1 / 2 / 2",
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              display: "block",
            }}
            sizes="(max-width: 1024px) 100vw, 55vw"
            draggable={false}
            priority
          />

          {/* Divider line — absolute, spans the full natural height of the grid */}
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{
              left: `${position}%`,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 12px rgba(0,0,0,0.55)",
              zIndex: 10,
            }}
          />

          {/* Handle knob — sticky to viewport center vertically via position:sticky trick:
              we place it absolute and use top:50% but inside a sticky inner wrapper */}
          <div
            className="absolute w-0 pointer-events-none"
            style={{ left: `${position}%`, top: 0, bottom: 0, zIndex: 11 }}
          >
            <div
              className="sticky size-11 rounded-full flex items-center justify-center gap-0.5"
              style={{
                top: "calc(50% - 22px)",
                transform: "translateX(-50%)",
                background: "var(--background)",
                border: "2.5px solid rgba(255,255,255,0.92)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 4px 24px rgba(0,0,0,0.45)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
                <path d="M6 2L3 5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
                <path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div
            className="sticky top-3 pointer-events-none"
            style={{
              gridArea: "1 / 1 / 2 / 2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "12px 12px 0",
              zIndex: 12,
            }}
          >
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(6px)",
                opacity: position > 8 ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              {beforeLabel}
            </span>
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(6px)",
                opacity: position < 92 ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              {afterLabel}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Arraste para comparar — role para ver o site completo
      </p>
    </div>
  )
}

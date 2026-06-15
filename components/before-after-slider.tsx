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
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const beforeRef    = useRef<HTMLDivElement>(null)
  const afterRef     = useRef<HTMLDivElement>(null)
  const syncing      = useRef(false)

  const [split, setSplit]     = useState(50)   // % of width given to "before"
  const [dragging, setDragging] = useState(false)

  /* ── sync scroll between the two panels ── */
  const syncScroll = useCallback((source: "before" | "after") => {
    if (syncing.current) return
    syncing.current = true
    const src = source === "before" ? beforeRef.current : afterRef.current
    const dst = source === "before" ? afterRef.current  : beforeRef.current
    if (src && dst) dst.scrollTop = src.scrollTop
    requestAnimationFrame(() => { syncing.current = false })
  }, [])

  /* ── divider drag ── */
  const updateSplit = useCallback((clientX: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100))
    setSplit(pct)
  }, [])

  const onMouseDownDivider  = (e: React.MouseEvent)  => { e.preventDefault(); setDragging(true) }
  const onTouchStartDivider = (e: React.TouchEvent)  => { setDragging(true) }

  const onMouseMove = useCallback((e: MouseEvent) => { if (dragging) updateSplit(e.clientX) }, [dragging, updateSplit])
  const onMouseUp   = useCallback(() => setDragging(false), [])
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging) { e.preventDefault(); updateSplit(e.touches[0].clientX) }
  }, [dragging, updateSplit])
  const onTouchEnd  = useCallback(() => setDragging(false), [])

  useEffect(() => {
    window.addEventListener("mousemove",  onMouseMove)
    window.addEventListener("mouseup",    onMouseUp)
    window.addEventListener("touchmove",  onTouchMove, { passive: false })
    window.addEventListener("touchend",   onTouchEnd)
    return () => {
      window.removeEventListener("mousemove",  onMouseMove)
      window.removeEventListener("mouseup",    onMouseUp)
      window.removeEventListener("touchmove",  onTouchMove)
      window.removeEventListener("touchend",   onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ── outer wrapper ── */}
      <div
        ref={wrapperRef}
        className="relative w-full rounded-2xl border border-border overflow-hidden select-none"
        style={{ height: "70vh", cursor: dragging ? "col-resize" : "auto" }}
      >

        {/* ── BEFORE panel ── */}
        <div
          ref={beforeRef}
          className="absolute inset-y-0 left-0 overflow-y-auto overflow-x-hidden"
          style={{ width: `${split}%` }}
          onScroll={() => syncScroll("before")}
        >
          {/* label */}
          <div className="sticky top-3 left-0 z-10 px-3 pointer-events-none">
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)" }}
            >
              {beforeLabel}
            </span>
          </div>
          {/* image — full natural width of this panel */}
          <img
            src={beforeSrc}
            alt={beforeLabel}
            draggable={false}
            style={{ width: `${100 / (split / 100)}%`, maxWidth: "none", display: "block" }}
          />
        </div>

        {/* ── AFTER panel ── */}
        <div
          ref={afterRef}
          className="absolute inset-y-0 right-0 overflow-y-auto overflow-x-hidden"
          style={{ width: `${100 - split}%` }}
          onScroll={() => syncScroll("after")}
        >
          {/* label */}
          <div className="sticky top-3 right-0 z-10 px-3 flex justify-end pointer-events-none">
            <span
              className="px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase text-white"
              style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)" }}
            >
              {afterLabel}
            </span>
          </div>
          {/* image — full natural width of this panel */}
          <img
            src={afterSrc}
            alt={afterLabel}
            draggable={false}
            style={{ width: `${100 / ((100 - split) / 100)}%`, maxWidth: "none", display: "block" }}
          />
        </div>

        {/* ── Draggable divider ── */}
        <div
          className="absolute inset-y-0 z-20 flex items-center justify-center"
          style={{
            left: `${split}%`,
            transform: "translateX(-50%)",
            width: 40,
            cursor: "col-resize",
          }}
          onMouseDown={onMouseDownDivider}
          onTouchStart={onTouchStartDivider}
        >
          {/* line */}
          <div
            className="absolute inset-y-0 w-px"
            style={{
              left: "50%",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          />
          {/* knob */}
          <div
            className="relative size-11 rounded-full flex items-center justify-center gap-0.5"
            style={{
              background: "var(--background)",
              border: "2.5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.45)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M6 2L3 5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"/>
            </svg>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"/>
            </svg>
          </div>
        </div>

      </div>

      <p className="text-xs text-muted-foreground text-center">
        Arraste o divisor para comparar — role para ver o site completo
      </p>
    </div>
  )
}

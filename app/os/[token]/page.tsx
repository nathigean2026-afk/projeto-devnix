"use client"

import { use, useEffect, useRef, useState } from "react"
import { getOSByToken } from "@/app/actions/leads"
import type { Quote } from "@/lib/db/schema"
import { QuoteDocument } from "@/components/admin-quotes"
import { Sun, Moon, Printer, PenLine, Check, Trash2 } from "lucide-react"

export default function OSPublicaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [quote, setQuote] = useState<Quote | null | "loading">("loading")
  const [theme, setTheme] = useState<"dark" | "light">("light")

  useEffect(() => {
    getOSByToken(token).then(q => setQuote(q))
  }, [token])

  if (quote === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-2xl font-black">Ordem de Serviço não encontrada</p>
        <p className="text-muted-foreground text-sm text-center">
          O link pode ter expirado ou sido removido. Entre em contato com a Elevanthe.
        </p>
        <a href="https://elevanthe.com" className="text-sm underline text-muted-foreground hover:text-foreground">
          elevanthe.com
        </a>
      </div>
    )
  }

  const osRef = `OS-${String(quote.id).padStart(4, "0")}`

  // ── Assinatura digital ──────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signedAt, setSignedAt] = useState<Date | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    setIsDrawing(true)
    lastPos.current = getPos(e)
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const pos = getPos(e)
    ctx.strokeStyle = theme === "dark" ? "#fff" : "#111"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  function endDraw() { setIsDrawing(false); lastPos.current = null }

  function clearSignature() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSigned(false)
  }

  function confirmSignature() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const hasPixels = Array.from(data).some((v, i) => i % 4 === 3 && v > 0)
    if (!hasPixels) { alert("Por favor, assine no campo antes de confirmar."); return }
    setSigned(true)
    setSignedAt(new Date())
    setSigning(false)
  }

  return (
    <div
      className="min-h-screen py-8 px-4 transition-colors"
      style={{ background: theme === "dark" ? "#080808" : "#f1f5f9" }}
    >
      {/* Barra de controles */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <p className="text-xs font-mono" style={{ color: theme === "dark" ? "#666" : "#888" }}>
          Ordem de Serviço {osRef} · elevanthe.com
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            title="Alternar tema"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
            style={{
              borderColor: theme === "dark" ? "#333" : "#d1d5db",
              background: theme === "dark" ? "#1a1a1a" : "#fff",
              color: theme === "dark" ? "#ccc" : "#555",
            }}
          >
            {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            {theme === "dark" ? "Tema claro" : "Tema escuro"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
            style={{
              borderColor: theme === "dark" ? "#333" : "#d1d5db",
              background: theme === "dark" ? "#1a1a1a" : "#fff",
              color: theme === "dark" ? "#ccc" : "#555",
            }}
          >
            <Printer className="size-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Documento OS */}
      <div className="max-w-3xl mx-auto">
        <QuoteDocument quote={quote} mode="os" theme={theme} />

        {/* Assinatura Digital */}
        <div className="mt-6 rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${theme === "dark" ? "#2a2a2a" : "#e5e7eb"}`, background: theme === "dark" ? "#111" : "#fff" }}>
          <div className="px-5 py-4 border-b flex items-center gap-3"
            style={{ borderColor: theme === "dark" ? "#2a2a2a" : "#e5e7eb" }}>
            <PenLine className="size-4" style={{ color: theme === "dark" ? "#999" : "#555" }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: theme === "dark" ? "#fff" : "#111" }}>Aceite e Assinatura Digital</p>
              <p className="text-xs mt-0.5" style={{ color: theme === "dark" ? "#666" : "#888" }}>
                Assine digitalmente para confirmar o aceite desta Ordem de Serviço
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {signed ? (
              /* Assinatura confirmada */
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="size-12 rounded-full flex items-center justify-center" style={{ background: "#22c55e20" }}>
                  <Check className="size-6 text-green-400" />
                </div>
                <p className="text-sm font-bold text-green-400">Assinatura confirmada!</p>
                <p className="text-xs text-center" style={{ color: theme === "dark" ? "#666" : "#888" }}>
                  {quote.clientName} · {osRef}<br />
                  {signedAt?.toLocaleString("pt-BR")}
                </p>
                <a
                  href={`https://wa.me/5587988219342?text=${encodeURIComponent(
                    `Olá! Assinei digitalmente a Ordem de Serviço ${osRef}. Podemos avançar?`
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "#25d366", color: "#fff" }}
                >
                  Avisar Elevanthe via WhatsApp
                </a>
              </div>
            ) : signing ? (
              /* Área de desenho da assinatura */
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme === "dark" ? "#666" : "#888" }}>
                  Assine com o dedo ou mouse no campo abaixo
                </p>
                <div className="relative rounded-xl overflow-hidden"
                  style={{ border: `2px dashed ${theme === "dark" ? "#333" : "#d1d5db"}`, background: theme === "dark" ? "#0a0a0a" : "#f8fafc" }}>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={180}
                    className="w-full touch-none cursor-crosshair block"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                  />
                  <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] pointer-events-none"
                    style={{ color: theme === "dark" ? "#333" : "#cbd5e1" }}>
                    Assine aqui
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearSignature}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                    style={{ borderColor: theme === "dark" ? "#333" : "#e5e7eb", color: theme === "dark" ? "#999" : "#666", background: "transparent" }}>
                    <Trash2 className="size-3.5" />Limpar
                  </button>
                  <button onClick={confirmSignature}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: theme === "dark" ? "#fff" : "#111", color: theme === "dark" ? "#000" : "#fff" }}>
                    <Check className="size-4" />Confirmar Assinatura
                  </button>
                </div>
              </div>
            ) : (
              /* Botão inicial para abrir área de assinatura */
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSigning(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95"
                  style={{ background: theme === "dark" ? "#fff" : "#111", color: theme === "dark" ? "#000" : "#fff" }}
                >
                  <PenLine className="size-4" />Assinar esta Ordem de Serviço
                </button>
                <a
                  href={`mailto:contato@elevanthe.com?subject=OS ${osRef} — ${quote.clientName}`}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ border: `1px solid ${theme === "dark" ? "#333" : "#d1d5db"}`, background: "transparent", color: theme === "dark" ? "#ccc" : "#555" }}
                >
                  Contato por E-mail
                </a>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-6 pb-4 text-xs" style={{ color: "#666" }}>
          Ordem de Serviço gerada por Elevanthe Tecnologia · elevanthe.com
        </p>
      </div>
    </div>
  )
}

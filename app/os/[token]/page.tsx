"use client"

import { use, useEffect, useState } from "react"
import { getOSByToken } from "@/app/actions/leads"
import type { Quote } from "@/lib/db/schema"
import { QuoteDocument } from "@/components/admin-quotes"
import { Sun, Moon, Printer } from "lucide-react"

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

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/5587981215180?text=${encodeURIComponent(
              `Olá! Recebi a Ordem de Serviço ${osRef} e gostaria de confirmar o aceite. Podemos avançar?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ background: "#25d366", color: "#fff" }}
          >
            Confirmar Aceite via WhatsApp
          </a>
          <a
            href={`mailto:contato@elevanthe.com?subject=OS ${osRef} — ${quote.clientName}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              border: `1px solid ${theme === "dark" ? "#333" : "#d1d5db"}`,
              background: theme === "dark" ? "#1a1a1a" : "#fff",
              color: theme === "dark" ? "#fff" : "#111",
            }}
          >
            Contato por E-mail
          </a>
        </div>

        <p className="text-center mt-6 pb-4 text-xs" style={{ color: "#666" }}>
          Ordem de Serviço gerada por Elevanthe Tecnologia · elevanthe.com
        </p>
      </div>
    </div>
  )
}

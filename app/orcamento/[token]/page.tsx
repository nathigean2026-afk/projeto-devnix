import { notFound } from "next/navigation"
import { getQuoteByToken } from "@/app/actions/leads"
import type { QuoteItem } from "@/lib/db/schema"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const quote = await getQuoteByToken(token)
  if (!quote) return { title: "Orçamento não encontrado" }
  return {
    title: `Proposta para ${quote.clientName} — Elevanthe`,
    description: quote.objective ?? "Proposta comercial da Elevanthe Tecnologia",
  }
}

function fmtBRL(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(d))
}

export default async function OrcamentoPublicoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const quote = await getQuoteByToken(token)
  if (!quote) notFound()

  const items = quote.items as QuoteItem[]
  const total = items.reduce((s, i) => s + i.price, 0)

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-0">

        {/* Documento */}
        <div className="rounded-2xl border border-border overflow-hidden shadow-xl">

          {/* Cabeçalho */}
          <div className="px-6 sm:px-10 py-8 flex items-start justify-between gap-4"
            style={{ background: "var(--foreground)", color: "var(--background)" }}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-1">Proposta Comercial</p>
              <h1 className="text-2xl sm:text-3xl font-black">Elevanthe</h1>
              <p className="text-xs opacity-60 mt-1">Tecnologia que Eleva Negócios</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] opacity-60 uppercase tracking-wide">Data</p>
              <p className="text-sm font-bold">{fmtDate(quote.createdAt)}</p>
              <p className="text-[10px] opacity-60 mt-2 uppercase tracking-wide">Referência</p>
              <p className="text-sm font-mono font-bold">ELV-{String(quote.id).padStart(4, "0")}</p>
            </div>
          </div>

          <div className="px-6 sm:px-10 py-8 space-y-8">

            {/* Para */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Proposta elaborada para</p>
              <p className="text-xl font-bold">{quote.clientName}</p>
              {quote.clientEmail && <p className="text-sm text-muted-foreground mt-0.5">{quote.clientEmail}</p>}
              {quote.clientWhatsapp && <p className="text-sm text-muted-foreground">{quote.clientWhatsapp}</p>}
            </div>

            {/* Contexto */}
            {(quote.problem || quote.objective || quote.expectedResult) && (
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Entendimento do Projeto</p>
                {quote.problem && (
                  <div className="rounded-xl border border-border p-4 bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 font-semibold">Problema / Necessidade Identificada</p>
                    <p className="text-sm leading-relaxed">{quote.problem}</p>
                  </div>
                )}
                {quote.objective && (
                  <div className="rounded-xl border border-border p-4 bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 font-semibold">Objetivo do Projeto</p>
                    <p className="text-sm leading-relaxed">{quote.objective}</p>
                  </div>
                )}
                {quote.expectedResult && (
                  <div className="rounded-xl border border-border p-4 bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 font-semibold">Resultado Esperado</p>
                    <p className="text-sm leading-relaxed">{quote.expectedResult}</p>
                  </div>
                )}
              </div>
            )}

            {/* Itens */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Escopo e Investimento</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border" style={{ background: "var(--secondary)" }}>
                      <th className="text-left px-5 py-3 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Serviço / Entregável</th>
                      <th className="text-right px-5 py-3 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold w-32">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={item.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">{item.name}</p>
                          {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-bold tabular-nums">{fmtBRL(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "var(--foreground)", color: "var(--background)" }}>
                      <td className="px-5 py-4 font-bold text-sm uppercase tracking-wide">Investimento Total</td>
                      <td className="px-5 py-4 text-right font-black text-lg tabular-nums">{fmtBRL(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Prazo */}
            {quote.deadline && (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/30">
                <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Prazo Estimado de Entrega</p>
                  <p className="text-sm font-bold">{quote.deadline}</p>
                </div>
              </div>
            )}

            {/* Rodapé */}
            <div className="pt-2 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Esta proposta é válida por <strong>30 dias</strong> a partir da data de emissão. Os valores cobrem o escopo descrito acima.
                Alterações de escopo acordadas após o início do projeto poderão gerar valores adicionais, sempre comunicados previamente.
              </p>
              <p className="text-xs text-muted-foreground">
                Dúvidas ou para aceitar a proposta, entre em contato:{" "}
                <strong>contato@elevanthe.com</strong> · WhatsApp <strong>+55 87 98121-5180</strong>
              </p>
            </div>
          </div>

          {/* Footer da marca */}
          <div className="px-6 sm:px-10 py-4 border-t border-border flex items-center justify-between"
            style={{ background: "var(--secondary)" }}>
            <p className="text-xs font-bold">Elevanthe Tecnologia</p>
            <p className="text-[11px] text-muted-foreground">elevanthe.com</p>
          </div>
        </div>

        {/* CTA de aceite */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/5587981215180?text=${encodeURIComponent(`Olá! Gostaria de aceitar a proposta ELV-${String(quote.id).padStart(4, "0")}. Podemos avançar?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Aceitar esta Proposta
          </a>
          <a
            href={`mailto:contato@elevanthe.com?subject=Proposta ELV-${String(quote.id).padStart(4, "0")} — ${quote.clientName}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-all"
          >
            Tirar Dúvidas por E-mail
          </a>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6 pb-4">
          Proposta gerada pela plataforma Elevanthe · Referência ELV-{String(quote.id).padStart(4, "0")}
        </p>
      </div>
    </div>
  )
}

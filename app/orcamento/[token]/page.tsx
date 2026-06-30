import { notFound } from "next/navigation"
import { getQuoteByToken } from "@/app/actions/leads"
import type { QuoteItem, QuotePaymentMethod } from "@/lib/db/schema"
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

function itemFinalPrice(item: QuoteItem): number {
  if (!item.discount || item.discount <= 0) return item.price
  if (item.discountType === "percent") return Math.max(0, item.price * (1 - item.discount / 100))
  return Math.max(0, item.price - item.discount)
}

function calcSubtotal(items: QuoteItem[]): number {
  return items.reduce((s, i) => s + itemFinalPrice(i), 0)
}

function calcTotal(items: QuoteItem[], gDiscount: number, gDiscountType: string): number {
  const sub = calcSubtotal(items)
  if (!gDiscount || gDiscount <= 0) return sub
  if (gDiscountType === "percent") return Math.max(0, sub * (1 - gDiscount / 100))
  return Math.max(0, sub - gDiscount)
}

const PAYMENT_ICON: Record<string, string> = {
  pix: "Pix",
  boleto: "Boleto",
  cartao: "Cartão",
  transferencia: "Transferência",
}

export default async function OrcamentoPublicoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const quote = await getQuoteByToken(token)
  if (!quote) notFound()

  const items = quote.items as QuoteItem[]
  const payments = (quote.paymentMethods as QuotePaymentMethod[]) ?? []
  const subtotal = calcSubtotal(items)
  const total = calcTotal(items, quote.globalDiscount ?? 0, quote.globalDiscountType ?? "fixed")
  const globalDiscountValue = subtotal - total

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-0">

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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 font-semibold">Problema / Necessidade</p>
                    <p className="text-sm leading-relaxed">{quote.problem}</p>
                  </div>
                )}
                {quote.objective && (
                  <div className="rounded-xl border border-border p-4 bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 font-semibold">Objetivo</p>
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

            {/* Itens + totais */}
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
                    {items.map((item, i) => {
                      const final = itemFinalPrice(item)
                      const hasDisc = item.discount && item.discount > 0
                      return (
                        <tr key={item.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold">{item.name}</p>
                            {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                            {hasDisc && (
                              <p className="text-[10px] text-green-400 mt-0.5 font-medium">
                                Desconto aplicado: {item.discountType === "percent" ? `${item.discount}%` : fmtBRL(item.discount!)}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {hasDisc && <p className="text-xs text-muted-foreground line-through tabular-nums">{fmtBRL(item.price)}</p>}
                            <p className="text-sm font-bold tabular-nums">{fmtBRL(final)}</p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    {subtotal !== total && (
                      <>
                        <tr className="border-t border-border">
                          <td className="px-5 py-2.5 text-sm text-muted-foreground">Subtotal</td>
                          <td className="px-5 py-2.5 text-right text-sm tabular-nums text-muted-foreground">{fmtBRL(subtotal)}</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="px-5 py-2.5 text-sm text-green-400 font-semibold">
                            Desconto{quote.globalDiscountType === "percent" ? ` (${quote.globalDiscount}%)` : " especial"}
                          </td>
                          <td className="px-5 py-2.5 text-right text-sm text-green-400 font-semibold tabular-nums">
                            -{fmtBRL(globalDiscountValue)}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr style={{ background: "var(--foreground)", color: "var(--background)" }}>
                      <td className="px-5 py-4 font-bold text-sm uppercase tracking-wide">Investimento Total</td>
                      <td className="px-5 py-4 text-right font-black text-lg tabular-nums">{fmtBRL(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Formas de pagamento */}
            {payments.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Formas de Pagamento</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {payments.map(p => (
                    <div key={p.method} className="rounded-xl border border-border p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide">{p.label}</span>
                        {(p.discount ?? 0) > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400 font-semibold border border-green-400/20">
                            -{p.discount}% desconto
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-black tabular-nums">{fmtBRL(p.value)}</p>
                      {p.method === "cartao" && p.installments && p.installments > 1 && (
                        <p className="text-xs text-muted-foreground">
                          ou {p.installments}x de <strong>{fmtBRL(Math.round(p.value / p.installments))}</strong> sem juros
                        </p>
                      )}
                      {p.method === "cartao" && p.installments === 1 && (
                        <p className="text-xs text-muted-foreground">à vista no cartão</p>
                      )}
                      {p.method === "pix" && <p className="text-xs text-muted-foreground">pagamento instantâneo</p>}
                      {p.method === "boleto" && <p className="text-xs text-muted-foreground">vencimento em 3 dias úteis</p>}
                      {p.method === "transferencia" && <p className="text-xs text-muted-foreground">TED / PIX chave CNPJ</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                Dúvidas ou para aceitar a proposta:{" "}
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

        {/* CTA */}
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

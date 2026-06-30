"use client"

import { useState, useTransition } from "react"
import { QRCodeSVG } from "qrcode.react"
import type { Quote, QuoteItem, QuotePaymentMethod } from "@/lib/db/schema"
import {
  createQuote, updateQuote, deleteQuote, generateShareLink,
} from "@/app/actions/leads"
import {
  Plus, Trash2, FileText, Check, ChevronRight, ChevronDown,
  Copy, Link2, X, Pencil, Clock, Send, CheckCircle2,
  Package, Server, Globe, Code, Smartphone, ShoppingCart,
  Wrench, MessageSquare, Tag, CreditCard, Percent, QrCode,
  ClipboardList, Key,
} from "lucide-react"

// ── Catálogo ──────────────────────────────────────────────────────────────────
const CATALOG: { category: string; icon: React.ElementType; items: Omit<QuoteItem, "id">[] }[] = [
  {
    category: "Sites e Landing Pages", icon: Globe,
    items: [
      { name: "Landing Page profissional", description: "1 página otimizada para conversão, responsiva, com SEO", price: 1800 },
      { name: "Site institucional (até 5 páginas)", description: "Home, Serviços, Sobre, Contato e mais", price: 3500 },
      { name: "Site com blog integrado", description: "CMS simples para publicar artigos", price: 2800 },
      { name: "One-page com animações avançadas", description: "Scroll animado, parallax, microinterações", price: 2400 },
    ],
  },
  {
    category: "E-commerce", icon: ShoppingCart,
    items: [
      { name: "Loja virtual básica", description: "Catálogo, carrinho, checkout, até 50 produtos", price: 5500 },
      { name: "Loja completa com painel admin", description: "Gestão de estoque, pedidos e clientes", price: 8900 },
      { name: "Integração com gateway de pagamento", description: "Stripe, Mercado Pago ou PagSeguro", price: 1200 },
    ],
  },
  {
    category: "Sistemas Web", icon: Code,
    items: [
      { name: "Painel administrativo sob medida", description: "Dashboard com gestão de dados, usuários e relatórios", price: 6500 },
      { name: "Sistema de agendamento online", description: "Calendário, confirmações automáticas, notificações", price: 4200 },
      { name: "CRM básico personalizado", description: "Gestão de leads, funil e histórico de clientes", price: 7500 },
      { name: "Portal de clientes", description: "Área logada para o cliente acompanhar projetos/pedidos", price: 3800 },
    ],
  },
  {
    category: "Aplicativos Mobile", icon: Smartphone,
    items: [
      { name: "App mobile (React Native)", description: "iOS e Android a partir de um único código", price: 9800 },
      { name: "App mobile simples (webview)", description: "Conversão de site em app nas lojas", price: 2500 },
    ],
  },
  {
    category: "Funcionalidades Extras", icon: Wrench,
    items: [
      { name: "Sistema de login e autenticação", description: "Login com e-mail/senha, sessões seguras", price: 900 },
      { name: "Painel de personalização para cliente", description: "O cliente edita textos, cores e imagens sem código", price: 1400 },
      { name: "Integração com API externa", description: "Conectar com ERPs, CRMs, marketplaces, etc.", price: 1100 },
      { name: "Chat / suporte integrado", description: "Widget de chat ao vivo ou chatbot", price: 800 },
      { name: "Notificações por e-mail (Resend)", description: "Confirmações automáticas e alertas", price: 500 },
      { name: "Dashboard com gráficos e relatórios", description: "Visualização de dados em tempo real", price: 1800 },
      { name: "Multi-idioma (i18n)", description: "Versão do site em mais de um idioma", price: 1200 },
    ],
  },
  {
    category: "Hospedagem e Infra", icon: Server,
    items: [
      { name: "Hospedagem na Elevanthe (Vercel Pro)", description: "Deploy automático, CDN global, SSL — por mês", price: 120 },
      { name: "Banco de dados gerenciado (Neon)", description: "PostgreSQL serverless — por mês", price: 80 },
      { name: "Configuração de domínio próprio", description: "DNS, SSL e subdomínios", price: 200 },
      { name: "Hospedagem por conta do cliente", description: "Setup e orientação para o cliente hospedar", price: 350 },
    ],
  },
  {
    category: "Pacotes de Suporte", icon: Package,
    items: [
      { name: "Suporte mensal básico (5h/mês)", description: "Ajustes, atualizações e correções", price: 450 },
      { name: "Suporte mensal avançado (15h/mês)", description: "Manutenção completa e novas funcionalidades", price: 1100 },
      { name: "Treinamento do cliente (2h)", description: "Onboarding e capacitação para usar o sistema", price: 300 },
    ],
  },
]

const PAYMENT_LABELS: Record<QuotePaymentMethod["method"], string> = {
  pix: "Pix",
  boleto: "Boleto Bancário",
  cartao: "Cartão de Crédito",
  transferencia: "Transferência Bancária",
}

const PIX_KEY_TYPES = [
  { value: "cpf",       label: "CPF" },
  { value: "cnpj",      label: "CNPJ" },
  { value: "email",     label: "E-mail" },
  { value: "telefone",  label: "Telefone" },
  { value: "aleatoria", label: "Chave Aleatória" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtBRL(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d))
}

function uid() { return Math.random().toString(36).slice(2, 10) }

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

// ── QuoteBuilder ──────────────────────────────────────────────────────────────
function QuoteBuilder({ initial, onSave, onCancel }: { initial?: Quote; onSave: (q: Quote) => void; onCancel: () => void }) {
  const [clientName, setClientName] = useState(initial?.clientName ?? "")
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail ?? "")
  const [clientWhatsapp, setClientWhatsapp] = useState(initial?.clientWhatsapp ?? "")
  const [problem, setProblem] = useState(initial?.problem ?? "")
  const [objective, setObjective] = useState(initial?.objective ?? "")
  const [expectedResult, setExpectedResult] = useState(initial?.expectedResult ?? "")
  const [deadline, setDeadline] = useState(initial?.deadline ?? "")
  const [items, setItems] = useState<QuoteItem[]>((initial?.items as QuoteItem[]) ?? [])
  const [customName, setCustomName] = useState("")
  const [customDesc, setCustomDesc] = useState("")
  const [customPrice, setCustomPrice] = useState("")
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [gDiscount, setGDiscount] = useState(initial?.globalDiscount ?? 0)
  const [gDiscountType, setGDiscountType] = useState<"fixed" | "percent">(
    (initial?.globalDiscountType as "fixed" | "percent") ?? "fixed"
  )
  const [payments, setPayments] = useState<QuotePaymentMethod[]>(
    (initial?.paymentMethods as QuotePaymentMethod[]) ?? []
  )
  // PIX
  const [pixKeyType, setPixKeyType] = useState(initial?.pixKeyType ?? "")
  const [pixKey, setPixKey] = useState(initial?.pixKey ?? "")
  const [saving, startSave] = useTransition()

  const subtotal = calcSubtotal(items)
  const total = calcTotal(items, gDiscount, gDiscountType)
  const globalDiscountValue = subtotal - total

  function toggleCategory(cat: string) {
    setOpenCategories(p => ({ ...p, [cat]: !p[cat] }))
  }

  function toggleItem(item: Omit<QuoteItem, "id">) {
    setItems(prev => {
      const exists = prev.find(i => i.name === item.name)
      if (exists) return prev.filter(i => i.name !== item.name)
      return [...prev, { ...item, id: uid() }]
    })
  }

  function addCustomItem() {
    if (!customName || !customPrice) return
    setItems(prev => [...prev, { id: uid(), name: customName, description: customDesc || undefined, price: Number(customPrice) }])
    setCustomName(""); setCustomDesc(""); setCustomPrice("")
  }

  function removeItem(id: string) { setItems(prev => prev.filter(i => i.id !== id)) }

  function updateItem(id: string, patch: Partial<QuoteItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  function recalcPaymentValue(p: QuotePaymentMethod, currentTotal: number): QuotePaymentMethod {
    const disc = p.discount ?? 0
    const value = Math.round(currentTotal * (1 - disc / 100))
    const installmentValue = p.installments && p.installments > 0 ? Math.round(value / p.installments) : undefined
    return { ...p, value, installmentValue }
  }

  function addPayment(method: QuotePaymentMethod["method"]) {
    if (payments.find(p => p.method === method)) return
    const base: QuotePaymentMethod = {
      method,
      label: PAYMENT_LABELS[method],
      value: Math.round(total),
      discount: method === "pix" ? 5 : 0,
      installments: method === "cartao" ? 1 : undefined,
    }
    const calculated = recalcPaymentValue(base, total)
    setPayments(prev => [...prev, calculated])
  }

  function removePayment(method: QuotePaymentMethod["method"]) {
    setPayments(prev => prev.filter(p => p.method !== method))
  }

  function updatePayment(method: QuotePaymentMethod["method"], patch: Partial<QuotePaymentMethod>) {
    setPayments(prev => prev.map(p => {
      if (p.method !== method) return p
      const merged = { ...p, ...patch }
      const disc = merged.discount ?? 0
      const value = patch.value !== undefined ? patch.value : Math.round(total * (1 - disc / 100))
      const installmentValue = merged.installments && merged.installments > 0
        ? Math.round(value / merged.installments) : undefined
      return { ...merged, value, installmentValue }
    }))
  }

  function handleSave() {
    if (!clientName) return
    startSave(async () => {
      const payload = {
        clientName, clientEmail: clientEmail || null, clientWhatsapp: clientWhatsapp || null,
        problem: problem || null, objective: objective || null,
        expectedResult: expectedResult || null, deadline: deadline || null,
        items, total: Math.round(total),
        globalDiscount: gDiscount, globalDiscountType: gDiscountType,
        paymentMethods: payments,
        pixKeyType: pixKeyType || null, pixKey: pixKey || null,
        status: initial?.status ?? "rascunho",
        shareToken: initial?.shareToken ?? null, shareExpiresAt: initial?.shareExpiresAt ?? null,
      }
      let saved: Quote
      if (initial) {
        await updateQuote(initial.id, payload)
        saved = { ...initial, ...payload, updatedAt: new Date() }
      } else {
        saved = await createQuote(payload) as Quote
      }
      onSave(saved)
    })
  }

  const INPUT = "w-full px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-foreground/30 transition"
  const LABEL = "text-[10px] text-muted-foreground uppercase tracking-wide block mb-1"

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">

      {/* ── Esquerda: dados + catálogo ── */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-4 pr-0 lg:pr-2">

        {/* Cliente */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Cliente</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={LABEL}>Nome *</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} className={INPUT} placeholder="João Silva" /></div>
            <div><label className={LABEL}>E-mail</label>
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} type="email" className={INPUT} placeholder="joao@empresa.com" /></div>
            <div><label className={LABEL}>WhatsApp</label>
              <input value={clientWhatsapp} onChange={e => setClientWhatsapp(e.target.value)} className={INPUT} placeholder="+55 87 99999-9999" /></div>
          </div>
        </div>

        {/* Contexto */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Contexto do Projeto</p>
          <div className="space-y-2">
            <div><label className={LABEL}>Problema / Necessidade</label>
              <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={2} className={INPUT + " resize-none"} placeholder="O cliente não tem presença online..." /></div>
            <div><label className={LABEL}>Objetivo</label>
              <textarea value={objective} onChange={e => setObjective(e.target.value)} rows={2} className={INPUT + " resize-none"} placeholder="Criar site profissional para atrair clientes..." /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><label className={LABEL}>Resultado Esperado</label>
                <textarea value={expectedResult} onChange={e => setExpectedResult(e.target.value)} rows={2} className={INPUT + " resize-none"} placeholder="Aumentar captação de leads em 40%..." /></div>
              <div><label className={LABEL}>Prazo Estimado</label>
                <input value={deadline} onChange={e => setDeadline(e.target.value)} className={INPUT} placeholder="Ex: 30 dias, até 15/08/2026" /></div>
            </div>
          </div>
        </div>

        {/* Catálogo */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Catálogo de Serviços</p>
          </div>
          {CATALOG.map(cat => {
            const Icon = cat.icon
            const isOpen = !!openCategories[cat.category]
            return (
              <div key={cat.category} className="border-b border-border last:border-0">
                <button onClick={() => toggleCategory(cat.category)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition text-left">
                  <Icon className="size-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium">{cat.category}</span>
                  {isOpen ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 space-y-1.5">
                    {cat.items.map(item => {
                      const selected = items.some(i => i.name === item.name)
                      return (
                        <button key={item.name} onClick={() => toggleItem(item)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${selected ? "border-foreground/30 bg-foreground/5" : "border-border hover:bg-secondary"}`}>
                          <div className={`size-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${selected ? "border-foreground bg-foreground" : "border-border"}`}>
                            {selected && <Check className="size-3 text-background" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            {item.description && <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>}
                          </div>
                          <span className="text-sm font-bold tabular-nums shrink-0">{fmtBRL(item.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Item personalizado */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Item Personalizado</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input value={customName} onChange={e => setCustomName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-foreground/30"
              placeholder="Nome do item" />
            <input value={customDesc} onChange={e => setCustomDesc(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-foreground/30"
              placeholder="Descrição (opcional)" />
            <div className="flex gap-2">
              <input value={customPrice} onChange={e => setCustomPrice(e.target.value)} type="number" min={0}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-foreground/30"
                placeholder="Valor R$" />
              <button onClick={addCustomItem} disabled={!customName || !customPrice}
                className="px-3 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 transition">
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Direita: resumo + desconto + pagamento ── */}
      <div className="w-full lg:w-[26rem] shrink-0 flex flex-col gap-3 overflow-y-auto">

        {/* Itens selecionados */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Itens do Orçamento</p>
            <span className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-border">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                <Package className="size-5 opacity-25" />
                <p className="text-xs">Selecione itens do catálogo</p>
              </div>
            ) : items.map(item => {
              const finalPrice = itemFinalPrice(item)
              const hasDisc = item.discount && item.discount > 0
              return (
                <div key={item.id} className="px-3 py-2.5 group space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasDisc && (
                        <span className="text-[10px] line-through text-muted-foreground tabular-nums">{fmtBRL(item.price)}</span>
                      )}
                      <input type="number" min={0} value={item.price}
                        onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                        className="w-24 px-2 py-1 text-xs font-mono text-right rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                      />
                      <button onClick={() => removeItem(item.id)}
                        className="size-6 rounded flex items-center justify-center text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                  {/* Desconto por item */}
                  <div className="flex items-center gap-1.5 pl-0">
                    <Tag className="size-3 text-muted-foreground shrink-0" />
                    <span className="text-[10px] text-muted-foreground">Desconto:</span>
                    <input type="number" min={0}
                      value={item.discount ?? 0}
                      onChange={e => updateItem(item.id, { discount: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 text-[11px] font-mono text-right rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                    />
                    <select value={item.discountType ?? "fixed"}
                      onChange={e => updateItem(item.id, { discountType: e.target.value as "fixed" | "percent" })}
                      className="px-1.5 py-0.5 text-[11px] rounded border border-border bg-secondary outline-none">
                      <option value="fixed">R$</option>
                      <option value="percent">%</option>
                    </select>
                    {hasDisc && (
                      <span className="text-[10px] text-green-400 font-semibold tabular-nums ml-auto">= {fmtBRL(finalPrice)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Subtotal + desconto global + total */}
          <div className="border-t border-border divide-y divide-border">
            <div className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-sm font-semibold tabular-nums">{fmtBRL(subtotal)}</span>
            </div>
            <div className="px-3 py-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Percent className="size-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Desconto Global</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} value={gDiscount}
                  onChange={e => setGDiscount(Number(e.target.value))}
                  className="flex-1 px-2 py-1.5 text-sm font-mono rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                  placeholder="0"
                />
                <select value={gDiscountType}
                  onChange={e => setGDiscountType(e.target.value as "fixed" | "percent")}
                  className="px-2 py-1.5 text-sm rounded border border-border bg-secondary outline-none">
                  <option value="fixed">R$ fixo</option>
                  <option value="percent">% do total</option>
                </select>
              </div>
              {gDiscount > 0 && (
                <p className="text-[11px] text-green-400 font-semibold">Economia: -{fmtBRL(globalDiscountValue)}</p>
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total</span>
              <span className="text-lg font-black tabular-nums">{fmtBRL(total)}</span>
            </div>
          </div>
        </div>

        {/* Formas de pagamento */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <CreditCard className="size-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Formas de Pagamento</p>
          </div>

          <div className="px-3 pt-3 pb-2 flex flex-wrap gap-1.5">
            {(["pix", "cartao", "boleto", "transferencia"] as QuotePaymentMethod["method"][]).map(method => {
              const active = payments.some(p => p.method === method)
              return (
                <button key={method} onClick={() => active ? removePayment(method) : addPayment(method)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                    active ? "border-foreground/40 bg-foreground/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary"
                  }`}>
                  {active && <Check className="size-3" />}
                  {method === "pix" ? "Pix" : method === "cartao" ? "Cartão" : method === "boleto" ? "Boleto" : "Transferência"}
                </button>
              )
            })}
          </div>

          {payments.length === 0 ? (
            <p className="px-4 pb-3 text-[11px] text-muted-foreground">Nenhuma forma selecionada</p>
          ) : (
            <div className="divide-y divide-border">
              {payments.map(p => (
                <div key={p.method} className="px-3 py-3 space-y-2.5">
                  {/* Cabeçalho da forma */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{p.label}</span>
                    <button onClick={() => removePayment(p.method)}
                      className="size-5 rounded flex items-center justify-center text-muted-foreground hover:text-red-400 transition">
                      <X className="size-3" />
                    </button>
                  </div>

                  {/* Desconto + valor final */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">Desconto (%)</label>
                      <input type="number" min={0} max={100}
                        value={p.discount ?? 0}
                        onChange={e => updatePayment(p.method, { discount: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-xs font-mono rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">Valor Final (R$)</label>
                      <input type="number" min={0}
                        value={p.value}
                        onChange={e => updatePayment(p.method, { value: Number(e.target.value), discount: 0 })}
                        className="w-full px-2 py-1.5 text-xs font-mono rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                      />
                    </div>
                  </div>

                  {/* Valor resumo */}
                  <p className="text-xs font-bold tabular-nums text-right">
                    {fmtBRL(p.value)}
                    {(p.discount ?? 0) > 0 && <span className="text-green-400 text-[10px] ml-1">(-{p.discount}%)</span>}
                  </p>

                  {/* Parcelamento (cartão) */}
                  {p.method === "cartao" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-muted-foreground block">Parcelamento</label>
                      <div className="flex flex-wrap gap-1">
                        {[1,2,3,4,5,6,8,10,12].map(n => (
                          <button key={n} onClick={() => updatePayment("cartao", { installments: n })}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                              p.installments === n ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary text-muted-foreground"
                            }`}>
                            {n}x
                          </button>
                        ))}
                      </div>
                      {p.installments && p.installments > 1 && (
                        <p className="text-[11px] text-muted-foreground">
                          {p.installments}x de {fmtBRL(Math.round(p.value / p.installments))} sem juros
                        </p>
                      )}
                    </div>
                  )}

                  {/* Dados bancários (transferência) */}
                  {p.method === "transferencia" && (
                    <div className="space-y-2 rounded-lg border border-border bg-secondary/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Dados Bancários</p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          { key: "banco",    label: "Banco",     ph: "Ex: Nubank" },
                          { key: "agencia",  label: "Agência",   ph: "Ex: 0001" },
                          { key: "conta",    label: "Conta",     ph: "Ex: 123456-7" },
                          { key: "titular",  label: "Titular",   ph: "Nome" },
                          { key: "cpfCnpj",  label: "CPF/CNPJ",  ph: "000.000.000-00" },
                        ].map(f => (
                          <div key={f.key} className={f.key === "titular" || f.key === "cpfCnpj" ? "col-span-2" : ""}>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">{f.label}</label>
                            <input
                              value={(p as any)[f.key] ?? ""}
                              onChange={e => updatePayment("transferencia", { [f.key]: e.target.value } as any)}
                              placeholder={f.ph}
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linha digitável (boleto) */}
                  {p.method === "boleto" && (
                    <div className="space-y-1.5 rounded-lg border border-border bg-secondary/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Dados do Boleto</p>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Beneficiário</label>
                        <input
                          value={(p as any).beneficiario ?? ""}
                          onChange={e => updatePayment("boleto", { beneficiario: e.target.value } as any)}
                          placeholder="Nome da empresa"
                          className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Linha Digitável (opcional)</label>
                        <input
                          value={(p as any).linhaDigitavel ?? ""}
                          onChange={e => updatePayment("boleto", { linhaDigitavel: e.target.value } as any)}
                          placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
                          className="w-full px-2 py-1 text-xs font-mono rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Vencimento</label>
                        <input type="date"
                          value={(p as any).vencimento ?? ""}
                          onChange={e => updatePayment("boleto", { vencimento: e.target.value } as any)}
                          className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chave PIX para QR Code */}
        <div className="rounded-xl border border-border p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <QrCode className="size-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Chave PIX (QR Code)</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Tipo de Chave</label>
              <select value={pixKeyType} onChange={e => setPixKeyType(e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border border-border bg-secondary outline-none focus:border-foreground/30">
                <option value="">Selecione...</option>
                {PIX_KEY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">
                {pixKeyType ? PIX_KEY_TYPES.find(t => t.value === pixKeyType)?.label ?? "Chave" : "Chave"}
              </label>
              <input value={pixKey} onChange={e => setPixKey(e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border border-border bg-secondary outline-none focus:border-foreground/30"
                placeholder={
                  pixKeyType === "cpf" ? "000.000.000-00" :
                  pixKeyType === "cnpj" ? "00.000.000/0000-00" :
                  pixKeyType === "email" ? "contato@empresa.com" :
                  pixKeyType === "telefone" ? "+5587999999999" :
                  "Chave aleatória"
                }
              />
            </div>
          </div>
          {pixKey && (
            <div className="flex items-center justify-center pt-1">
              <div className="p-2 bg-white rounded-xl">
                <QRCodeSVG value={pixKey} size={96} />
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 pb-4">
          <button onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !clientName}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:opacity-80"
            style={{ background: "var(--foreground)", color: "var(--background)" }}>
            {saving ? <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="size-4" />}
            {initial ? "Salvar" : "Criar Orçamento"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── QuoteDocument — componente de documento compartilhado ─────────────────────
export function QuoteDocument({ quote, mode = "orcamento" }: { quote: Quote; mode?: "orcamento" | "os" }) {
  const items = quote.items as QuoteItem[]
  const payments = (quote.paymentMethods as QuotePaymentMethod[]) ?? []
  const subtotal = calcSubtotal(items)
  const total = calcTotal(items, quote.globalDiscount ?? 0, quote.globalDiscountType ?? "fixed")
  const globalDiscountValue = subtotal - total
  const isOS = mode === "os"

  return (
    <div className="rounded-2xl border border-border overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-6 sm:px-8 py-6 flex items-start justify-between gap-4"
        style={{ background: "var(--foreground)", color: "var(--background)" }}>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-1">
            {isOS ? "Ordem de Serviço" : "Proposta Comercial"}
          </p>
          <h1 className="text-xl sm:text-2xl font-black leading-tight">Elevanthe</h1>
          <p className="text-[11px] opacity-60 mt-0.5">Tecnologia que Eleva Negócios</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] opacity-60 uppercase tracking-wide">Data</p>
          <p className="text-sm font-bold">{fmtDate(quote.createdAt)}</p>
          <p className="text-[10px] opacity-60 mt-1 uppercase tracking-wide">Ref.</p>
          <p className="text-xs font-mono font-bold">
            {isOS ? "OS" : "ELV"}-{String(quote.id).padStart(4, "0")}
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 space-y-6">
        {/* Para */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
            {isOS ? "Cliente / Contratante" : "Para"}
          </p>
          <p className="text-base font-bold">{quote.clientName}</p>
          {quote.clientEmail && <p className="text-sm text-muted-foreground">{quote.clientEmail}</p>}
          {quote.clientWhatsapp && <p className="text-sm text-muted-foreground">{quote.clientWhatsapp}</p>}
        </div>

        {/* Contexto */}
        {(quote.problem || quote.objective || quote.expectedResult) && (
          <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              {isOS ? "Descrição do Serviço" : "Entendimento do Projeto"}
            </p>
            {quote.problem && <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Problema / Necessidade</p>
              <p className="text-sm leading-relaxed">{quote.problem}</p>
            </div>}
            {quote.objective && <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Objetivo</p>
              <p className="text-sm leading-relaxed">{quote.objective}</p>
            </div>}
            {quote.expectedResult && <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Resultado Esperado</p>
              <p className="text-sm leading-relaxed">{quote.expectedResult}</p>
            </div>}
          </div>
        )}

        {/* Tabela de itens */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
            {isOS ? "Serviços a Executar" : "O que será entregue"}
          </p>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border" style={{ background: "var(--secondary)" }}>
                  <th className="text-left px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Item</th>
                  {isOS && <th className="text-center px-3 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold w-20">Status</th>}
                  <th className="text-right px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold w-28">Valor</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const final = itemFinalPrice(item)
                  const hasDisc = item.discount && item.discount > 0
                  return (
                    <tr key={item.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/30"}`}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.description && <p className="text-[11px] text-muted-foreground">{item.description}</p>}
                        {hasDisc && (
                          <p className="text-[10px] text-green-400 mt-0.5">
                            Desconto: {item.discountType === "percent" ? `${item.discount}%` : fmtBRL(item.discount!)}
                          </p>
                        )}
                      </td>
                      {isOS && (
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
                            Pendente
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        {hasDisc && <p className="text-[11px] text-muted-foreground line-through tabular-nums">{fmtBRL(item.price)}</p>}
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
                      <td colSpan={isOS ? 2 : 1} className="px-4 py-2 text-xs text-muted-foreground">Subtotal</td>
                      <td className="px-4 py-2 text-right text-sm tabular-nums text-muted-foreground">{fmtBRL(subtotal)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td colSpan={isOS ? 2 : 1} className="px-4 py-2 text-xs text-green-400 font-semibold">
                        Desconto{quote.globalDiscountType === "percent" ? ` (${quote.globalDiscount}%)` : " global"}
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-green-400 font-semibold tabular-nums">-{fmtBRL(globalDiscountValue)}</td>
                    </tr>
                  </>
                )}
                <tr style={{ background: "var(--foreground)", color: "var(--background)" }}>
                  <td colSpan={isOS ? 2 : 1} className="px-4 py-3 text-sm font-bold uppercase tracking-wide">
                    {isOS ? "Valor Total do Serviço" : "Total do Projeto"}
                  </td>
                  <td className="px-4 py-3 text-right text-base font-black tabular-nums">{fmtBRL(total)}</td>
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
                <div key={p.method} className="rounded-xl border border-border p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{p.label}</span>
                    {(p.discount ?? 0) > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400 font-semibold border border-green-400/20">
                        -{p.discount}% desc.
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-black tabular-nums">{fmtBRL(p.value)}</p>
                  {p.method === "cartao" && p.installments && p.installments > 1 && (
                    <p className="text-[11px] text-muted-foreground">
                      ou {p.installments}x de {fmtBRL(Math.round(p.value / p.installments))} sem juros
                    </p>
                  )}
                  {/* Dados bancários da transferência */}
                  {p.method === "transferencia" && ((p as any).banco || (p as any).conta) && (
                    <div className="pt-1.5 border-t border-border space-y-0.5">
                      {(p as any).banco && <p className="text-[11px] text-muted-foreground">Banco: <span className="text-foreground font-medium">{(p as any).banco}</span></p>}
                      {(p as any).agencia && <p className="text-[11px] text-muted-foreground">Agência: <span className="text-foreground font-medium">{(p as any).agencia}</span></p>}
                      {(p as any).conta && <p className="text-[11px] text-muted-foreground">Conta: <span className="text-foreground font-medium">{(p as any).conta}</span></p>}
                      {(p as any).titular && <p className="text-[11px] text-muted-foreground">Titular: <span className="text-foreground font-medium">{(p as any).titular}</span></p>}
                      {(p as any).cpfCnpj && <p className="text-[11px] text-muted-foreground">CPF/CNPJ: <span className="text-foreground font-medium">{(p as any).cpfCnpj}</span></p>}
                    </div>
                  )}
                  {/* Linha digitável do boleto */}
                  {p.method === "boleto" && (p as any).linhaDigitavel && (
                    <div className="pt-1.5 border-t border-border">
                      {(p as any).beneficiario && <p className="text-[11px] text-muted-foreground mb-0.5">Beneficiário: <span className="text-foreground font-medium">{(p as any).beneficiario}</span></p>}
                      <p className="text-[10px] text-muted-foreground mb-0.5">Linha digitável:</p>
                      <p className="text-[11px] font-mono break-all">{(p as any).linhaDigitavel}</p>
                      {(p as any).vencimento && <p className="text-[11px] text-muted-foreground mt-0.5">Vencimento: <span className="text-foreground font-medium">{new Date((p as any).vencimento).toLocaleDateString("pt-BR")}</span></p>}
                    </div>
                  )}
                  {/* QR Code PIX */}
                  {p.method === "pix" && quote.pixKey && (
                    <div className="pt-1.5 border-t border-border flex items-center gap-3">
                      <div className="p-1.5 bg-white rounded-lg shrink-0">
                        <QRCodeSVG value={quote.pixKey} size={72} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          {quote.pixKeyType ? PIX_KEY_TYPES.find(t => t.value === quote.pixKeyType)?.label : "Chave PIX"}
                        </p>
                        <p className="text-xs font-mono font-semibold break-all">{quote.pixKey}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prazo */}
        {quote.deadline && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/40">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Prazo Estimado</p>
              <p className="text-sm font-semibold">{quote.deadline}</p>
            </div>
          </div>
        )}

        {/* Assinatura (apenas OS) */}
        {isOS && (
          <div className="pt-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="border-t border-border pt-2">
                <p className="text-[10px] text-muted-foreground">Contratante</p>
                <p className="text-xs font-semibold">{quote.clientName}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="border-t border-border pt-2">
                <p className="text-[10px] text-muted-foreground">Prestador de Serviço</p>
                <p className="text-xs font-semibold">Elevanthe Tecnologia</p>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="pt-2 border-t border-border">
          {isOS ? (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Esta ordem de serviço autoriza a execução dos itens listados acima conforme acordado entre as partes.
              Alterações de escopo deverão ser formalizadas por escrito. Válido mediante assinatura das partes.
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Este orçamento é uma proposta inicial e pode ser ajustado conforme a evolução do projeto.
              Os valores cobrem o escopo descrito acima. Alterações de escopo poderão gerar valores adicionais.
              Válido por 30 dias a partir da data de emissão.
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-2">
            Dúvidas? Fale conosco: <strong>contato@elevanthe.com</strong> · WhatsApp <strong>+55 87 98121-5180</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── QuotePreview ──────────────────────────────────────────────────────────────
function QuotePreview({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const [docMode, setDocMode] = useState<"orcamento" | "os">("orcamento")
  const [shareToken, setShareToken] = useState(quote.shareToken ?? "")
  const [expiryDays, setExpiryDays] = useState(7)
  const [generating, startGen] = useTransition()
  const [copied, setCopied] = useState(false)
  const shareUrl = shareToken ? `${typeof window !== "undefined" ? window.location.origin : ""}/orcamento/${shareToken}` : ""

  function handleGenLink() {
    startGen(async () => {
      const token = await generateShareLink(quote.id, expiryDays)
      setShareToken(token)
    })
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleWhatsApp() {
    const wa = quote.clientWhatsapp?.replace(/\D/g, "") ?? ""
    const docLabel = docMode === "os" ? "uma Ordem de Serviço" : "um orçamento detalhado"
    const text = encodeURIComponent(`Olá ${quote.clientName}! Preparei ${docLabel} para o seu projeto. Acesse aqui: ${shareUrl}`)
    const url = wa ? `https://wa.me/${wa}?text=${text}` : `https://wa.me/?text=${text}`
    try { (window.top ?? window).open(url, "_blank") } catch { window.open(url, "_blank") }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{quote.clientName} — #{quote.id}</span>
        </div>
        {/* Toggle Orçamento / OS */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-secondary">
          <button onClick={() => setDocMode("orcamento")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${docMode === "orcamento" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            <FileText className="size-3" />Orçamento
          </button>
          <button onClick={() => setDocMode("os")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${docMode === "os" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            <ClipboardList className="size-3" />Ordem de Serviço
          </button>
        </div>
        <button onClick={onClose} className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
          <QuoteDocument quote={quote} mode={docMode} />

          {/* Link compartilhável */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Link Compartilhável</p>
            {!shareToken ? (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <label className="text-xs text-muted-foreground shrink-0">Expira em</label>
                  <select value={expiryDays} onChange={e => setExpiryDays(Number(e.target.value))}
                    className="px-2 py-1.5 rounded-lg border border-border bg-secondary text-sm outline-none">
                    {[1,3,7,15,30].map(d => <option key={d} value={d}>{d} dia{d > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <button onClick={handleGenLink} disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ background: "var(--foreground)", color: "var(--background)" }}>
                  <Link2 className="size-4" />Gerar Link
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
                  <p className="flex-1 text-xs font-mono truncate">{shareUrl}</p>
                  <button onClick={() => handleCopy(shareUrl)} className="shrink-0 text-muted-foreground hover:text-foreground transition">
                    {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleCopy(shareUrl)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition">
                    <Copy className="size-3.5" />Copiar link
                  </button>
                  <button onClick={handleWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#25d366]/30 text-[#25d366] bg-[#25d366]/10 hover:bg-[#25d366]/20 text-xs font-semibold transition">
                    <MessageSquare className="size-3.5" />Enviar no WhatsApp
                  </button>
                  <button onClick={() => setShareToken("")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition text-muted-foreground">
                    <Link2 className="size-3.5" />Novo link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── QuotesAdmin — painel principal ────────────────────────────────────────────
export function QuotesAdmin({ initialQuotes, onQuotesChange }: { initialQuotes: Quote[]; onQuotesChange: (q: Quote[]) => void }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [view, setView] = useState<"list" | "builder" | "preview">("list")
  const [editingQuote, setEditingQuote] = useState<Quote | undefined>(undefined)
  const [previewQuote, setPreviewQuote] = useState<Quote | undefined>(undefined)
  const [, startDelete] = useTransition()

  function syncQuotes(updated: Quote[]) { setQuotes(updated); onQuotesChange(updated) }

  function handleSave(saved: Quote) {
    const exists = quotes.find(q => q.id === saved.id)
    const updated = exists ? quotes.map(q => q.id === saved.id ? saved : q) : [saved, ...quotes]
    syncQuotes(updated)
    setView("preview")
    setPreviewQuote(saved)
  }

  function handleEdit(quote: Quote) { setEditingQuote(quote); setView("builder") }

  function handleDelete(id: number) {
    if (!confirm("Excluir este orçamento permanentemente?")) return
    startDelete(async () => {
      await deleteQuote(id)
      syncQuotes(quotes.filter(q => q.id !== id))
    })
  }

  function handlePreview(quote: Quote) { setPreviewQuote(quote); setView("preview") }

  const STATUS_COLOR: Record<string, string> = {
    rascunho: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    enviado:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    aprovado: "bg-green-500/10 text-green-400 border-green-500/20",
    recusado: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  if (view === "builder") {
    return (
      <div className="flex flex-col h-full p-4 space-y-3">
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => { setView("list"); setEditingQuote(undefined) }}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition">
            <ChevronRight className="size-4 rotate-180" />Voltar
          </button>
          <span className="text-sm font-bold">{editingQuote ? `Editar #${editingQuote.id}` : "Novo Orçamento"}</span>
        </div>
        <div className="flex-1 min-h-0">
          <QuoteBuilder initial={editingQuote} onSave={handleSave} onCancel={() => { setView("list"); setEditingQuote(undefined) }} />
        </div>
      </div>
    )
  }

  if (view === "preview" && previewQuote) {
    return (
      <div className="flex flex-col h-full">
        <QuotePreview quote={previewQuote} onClose={() => { setView("list"); setPreviewQuote(undefined) }} />
        <div className="shrink-0 px-4 py-3 border-t border-border flex gap-2">
          <button onClick={() => handleEdit(previewQuote)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
            <Pencil className="size-4" />Editar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Orçamentos</h2>
          <p className="text-xs text-muted-foreground">{quotes.length} orçamento{quotes.length !== 1 ? "s" : ""} criado{quotes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setEditingQuote(undefined); setView("builder") }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition"
          style={{ background: "var(--foreground)", color: "var(--background)" }}>
          <Plus className="size-4" />Novo Orçamento
        </button>
      </div>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <div className="size-14 rounded-2xl border border-border flex items-center justify-center bg-secondary">
            <FileText className="size-6 opacity-30" />
          </div>
          <p className="text-sm">Nenhum orçamento ainda</p>
          <button onClick={() => setView("builder")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition"
            style={{ background: "var(--foreground)", color: "var(--background)" }}>
            <Plus className="size-4" />Criar primeiro orçamento
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {quotes.map(quote => {
            const qItems = quote.items as QuoteItem[]
            const qTotal = calcTotal(qItems, quote.globalDiscount ?? 0, quote.globalDiscountType ?? "fixed")
            const qPayments = (quote.paymentMethods as QuotePaymentMethod[]) ?? []
            return (
              <div key={quote.id} className="rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-secondary/40 transition group">
                <div className="size-10 rounded-xl flex items-center justify-center border border-border bg-secondary shrink-0">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-bold truncate">{quote.clientName}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLOR[quote.status] ?? STATUS_COLOR["rascunho"]}`}>
                      {quote.status}
                    </span>
                    {quote.shareToken && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-500/20 bg-blue-500/10 text-blue-400">
                        <Link2 className="size-2.5" />Link ativo
                      </span>
                    )}
                    {quote.pixKey && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-border text-muted-foreground">
                        <QrCode className="size-2.5" />PIX
                      </span>
                    )}
                    {qPayments.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-border text-muted-foreground">
                        <CreditCard className="size-2.5" />{qPayments.length} forma{qPayments.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{qItems.length} item{qItems.length !== 1 ? "s" : ""} · {fmtBRL(qTotal)} · {fmtDate(quote.createdAt)}</p>
                  {quote.objective && <p className="text-[11px] text-muted-foreground truncate mt-0.5 opacity-70">{quote.objective}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handlePreview(quote)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition">
                    <FileText className="size-3.5" />Ver
                  </button>
                  <button onClick={() => handleEdit(quote)}
                    className="size-8 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition text-muted-foreground">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => handleDelete(quote.id)}
                    className="size-8 rounded-xl border border-border flex items-center justify-center hover:text-red-400 hover:border-red-400/20 transition text-muted-foreground">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

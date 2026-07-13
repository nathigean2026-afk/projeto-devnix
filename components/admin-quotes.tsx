"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import type { Quote, QuoteItem, QuotePaymentMethod, ClientIntake } from "@/lib/db/schema"
import {
  getQuotes, createQuote, updateQuote, deleteQuote,
  generateShareLink, generateOSShareLink, sendWameMessage,
} from "@/app/actions/leads"
import {
  Plus, Trash2, FileText, Check, ChevronRight, ChevronDown,
  Copy, Link2, X, Pencil, Clock, Send, CheckCircle2,
  Package, Server, Globe, Code, Smartphone, ShoppingCart,
  Wrench, MessageSquare, Tag, CreditCard, Percent, QrCode,
  ClipboardList, Sun, Moon, Printer, Building2, ChevronUp, Info,
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

function fmtBRL(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(d))
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

// ── QuoteIntakePanel ──────────────────────────────────────────────────────────
// Perguntas iniciais sobre o negócio do cliente, domínio e hospedagem
function QuoteIntakePanel({ intake, onChange }: {
  intake: ClientIntake
  onChange: (v: ClientIntake) => void
}) {
  const set = <K extends keyof ClientIntake>(k: K, v: ClientIntake[K]) =>
    onChange({ ...intake, [k]: v })

  const INPUT = "w-full px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-foreground/30 transition"
  const LABEL = "text-[10px] text-muted-foreground uppercase tracking-wide block mb-1"
  const TA = INPUT + " resize-none"

  // Tooltips de ajuda
  const DOMAIN_TIPS: Record<string, { title: string; desc: string }> = {
    sim: {
      title: "Domínio próprio",
      desc: "O endereço do seu site na internet, ex: suaempresa.com ou suaempresa.com.br. Com domínio próprio você também pode ter e-mail profissional como contato@suaempresa.com.br, o que passa muito mais credibilidade para seus clientes.",
    },
    nao: {
      title: "Sem domínio por enquanto",
      desc: "O site ficará disponível num endereço provisório (ex: suaempresa.vercel.app). Você pode adicionar um domínio próprio depois.",
    },
    ja_tenho: {
      title: "Já possui domínio",
      desc: "Ótimo! Vamos configurar o seu domínio existente para apontar para o novo site.",
    },
  }

  const HOSTING_TIPS: Record<string, { title: string; desc: string }> = {
    elevanthe: {
      title: "Hospedagem gerenciada pela Elevanthe",
      desc: "A Elevanthe cuida de tudo: servidor, backups, atualizações e segurança. Há um custo mensal pago diretamente para a Elevanthe. Recomendado para quem não quer se preocupar com infraestrutura.",
    },
    proprio: {
      title: "Hospedagem por conta do cliente",
      desc: "Você contrata e paga diretamente um provedor (ex: Hostinger, AWS, etc). A Elevanthe configura tudo e te orienta. Você tem controle total, mas é responsável pela renovação e manutenção do servidor.",
    },
    nao_sabe: {
      title: "Ainda não decidi",
      desc: "Sem problema! Conversamos sobre as opções e custos durante o processo.",
    },
  }

  const [domainTip, setDomainTip] = useState<string | null>(null)
  const [hostingTip, setHostingTip] = useState<string | null>(null)

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
        <Building2 className="size-3.5 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Perguntas Iniciais — Conhecendo o Cliente</p>
        <span className="ml-auto text-[10px] text-muted-foreground">Campos opcionais — pule e preencha depois se preferir</span>
      </div>

      <div className="p-4 space-y-5">

        {/* Dados da empresa */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Dados da Empresa</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-3">
              <label className={LABEL}>Nome da empresa</label>
              <input value={intake.companyName ?? ""} onChange={e => set("companyName", e.target.value)} className={INPUT} placeholder="Barbearia Maktub" />
            </div>
            <div>
              <label className={LABEL}>Ano de fundação</label>
              <input value={intake.foundedYear ?? ""} onChange={e => set("foundedYear", e.target.value)} className={INPUT} placeholder="2018" />
            </div>
            <div>
              <label className={LABEL}>Cidade</label>
              <input value={intake.city ?? ""} onChange={e => set("city", e.target.value)} className={INPUT} placeholder="Juazeiro do Norte" />
            </div>
            <div>
              <label className={LABEL}>Funcionários</label>
              <input value={intake.employees ?? ""} onChange={e => set("employees", e.target.value)} className={INPUT} placeholder="1-5" />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label className={LABEL}>Ramo / Setor</label>
              <input value={intake.sector ?? ""} onChange={e => set("sector", e.target.value)} className={INPUT} placeholder="Beleza, Serviços, Alimentação..." />
            </div>
          </div>
        </div>

        {/* Identidade */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Identidade do Negócio</p>
          <div className="space-y-2">
            <div><label className={LABEL}>Como surgiu a empresa?</label>
              <textarea value={intake.origin ?? ""} onChange={e => set("origin", e.target.value)} rows={2} className={TA} placeholder="Conte a história..." /></div>
            <div><label className={LABEL}>O que motivou a criação?</label>
              <textarea value={intake.motivation ?? ""} onChange={e => set("motivation", e.target.value)} rows={2} className={TA} placeholder="Qual foi o gatilho?" /></div>
            <div><label className={LABEL}>Quais problemas a empresa resolve?</label>
              <textarea value={intake.problemSolved ?? ""} onChange={e => set("problemSolved", e.target.value)} rows={2} className={TA} placeholder="O que o cliente resolve ao contratar vocês?" /></div>
          </div>
        </div>

        {/* Missão / Visão / Valores */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Missão, Visão e Valores</p>
          <div className="space-y-2">
            <div><label className={LABEL}>Missão — qual o propósito da empresa?</label>
              <textarea value={intake.mission ?? ""} onChange={e => set("mission", e.target.value)} rows={2} className={TA} placeholder="Por que vocês existem?" /></div>
            <div><label className={LABEL}>Visão — onde deseja chegar?</label>
              <textarea value={intake.vision ?? ""} onChange={e => set("vision", e.target.value)} rows={2} className={TA} placeholder="Como se vê daqui a 5 anos?" /></div>
            <div><label className={LABEL}>Valores — o que é inegociável?</label>
              <textarea value={intake.values ?? ""} onChange={e => set("values", e.target.value)} rows={2} className={TA} placeholder="Transparência, qualidade, pontualidade..." /></div>
          </div>
        </div>

        {/* Mercado */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Mercado e Posicionamento</p>
          <div className="space-y-2">
            <div><label className={LABEL}>Público-alvo — quem são seus clientes?</label>
              <textarea value={intake.targetAudience ?? ""} onChange={e => set("targetAudience", e.target.value)} rows={2} className={TA} placeholder="Homens 25-45 anos, donos de pequenos negócios..." /></div>
            <div><label className={LABEL}>Diferenciais — o que faz vocês serem melhores?</label>
              <textarea value={intake.differentials ?? ""} onChange={e => set("differentials", e.target.value)} rows={2} className={TA} placeholder="Atendimento personalizado, entrega em 24h..." /></div>
            <div><label className={LABEL}>Concorrentes</label>
              <input value={intake.competitors ?? ""} onChange={e => set("competitors", e.target.value)} className={INPUT} placeholder="Empresa X, Empresa Y..." /></div>
            <div><label className={LABEL}>Redes sociais</label>
              <input value={intake.socialMedia ?? ""} onChange={e => set("socialMedia", e.target.value)} className={INPUT} placeholder="@empresa no Instagram, Facebook.com/empresa..." /></div>
          </div>
        </div>

        {/* Branding */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Branding e Assets</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Possui logotipo?</label>
              <div className="flex gap-2 mt-1">
                {[{v: true, l: "Sim"}, {v: false, l: "Não"}].map(opt => (
                  <button key={String(opt.v)} type="button"
                    onClick={() => set("hasLogo", opt.v)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${intake.hasLogo === opt.v ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
                  >{opt.l}</button>
                ))}
              </div>
            </div>
            <div><label className={LABEL}>Cores da marca (hex ou nomes)</label>
              <input value={intake.brandColors ?? ""} onChange={e => set("brandColors", e.target.value)} className={INPUT} placeholder="#1a1a1a, dourado, azul navy" /></div>
          </div>
          {intake.hasLogo && (
            <div className="mt-3"><label className={LABEL}>URL do logotipo</label>
              <input value={intake.logoUrl ?? ""} onChange={e => set("logoUrl", e.target.value)} className={INPUT} placeholder="https://drive.google.com/... ou /logo.png" /></div>
          )}
        </div>

        {/* Dom��nio */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Domínio</p>
          <p className="text-xs text-muted-foreground mb-3">
            O senhor gostaria de ter um domínio próprio para o site?
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(["sim", "nao", "ja_tenho"] as const).map(opt => {
              const labels: Record<typeof opt, string> = { sim: "Sim, quero", nao: "Não agora", ja_tenho: "Já tenho" }
              return (
                <div key={opt} className="relative">
                  <button type="button"
                    onClick={() => { set("wantsDomain", opt); setDomainTip(domainTip === opt ? null : opt) }}
                    className={`w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${intake.wantsDomain === opt ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
                  >
                    {labels[opt]}
                    <Info className={`size-3 ${intake.wantsDomain === opt ? "opacity-60" : "text-muted-foreground"}`} />
                  </button>
                </div>
              )
            })}
          </div>
          {/* Tooltip explicativo */}
          {intake.wantsDomain && DOMAIN_TIPS[intake.wantsDomain] && (
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-foreground/80 space-y-1">
              <p className="font-semibold text-blue-400">{DOMAIN_TIPS[intake.wantsDomain!].title}</p>
              <p className="leading-relaxed">{DOMAIN_TIPS[intake.wantsDomain!].desc}</p>
            </div>
          )}
          {intake.wantsDomain === "sim" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className={LABEL}>Nome desejado</label>
                <input value={intake.domainName ?? ""} onChange={e => set("domainName", e.target.value)} className={INPUT} placeholder="suaempresa" /></div>
              <div><label className={LABEL}>Extensão</label>
                <select value={intake.domainType ?? ".com.br"} onChange={e => set("domainType", e.target.value)} className={INPUT}>
                  {[".com.br", ".com", ".net", ".org", ".io", ".app", ".dev"].map(ext => (
                    <option key={ext} value={ext}>{ext}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {intake.wantsDomain === "ja_tenho" && (
            <div className="mt-3"><label className={LABEL}>Qual é o domínio atual?</label>
              <input value={intake.domainName ?? ""} onChange={e => set("domainName", e.target.value)} className={INPUT} placeholder="suaempresa.com.br" /></div>
          )}
        </div>

        {/* Hospedagem */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Hospedagem</p>
          <p className="text-xs text-muted-foreground mb-3">
            O senhor prefere que a Elevanthe cuide da hospedagem, ou prefere contratar por conta própria?
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(["elevanthe", "proprio", "nao_sabe"] as const).map(opt => {
              const labels: Record<typeof opt, string> = { elevanthe: "Elevanthe cuida", proprio: "Faço eu mesmo", nao_sabe: "Não sei ainda" }
              return (
                <button key={opt} type="button"
                  onClick={() => set("hostingOption", opt)}
                  className={`flex flex-col gap-0.5 items-center justify-center px-2 py-3 rounded-xl border text-center text-xs font-semibold transition-all ${intake.hostingOption === opt ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
                >
                  {labels[opt]}
                </button>
              )
            })}
          </div>
          {intake.hostingOption && HOSTING_TIPS[intake.hostingOption] && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-foreground/80 space-y-1">
              <p className="font-semibold text-amber-400">{HOSTING_TIPS[intake.hostingOption].title}</p>
              <p className="leading-relaxed">{HOSTING_TIPS[intake.hostingOption].desc}</p>
            </div>
          )}
          <div className="mt-3"><label className={LABEL}>Observações sobre hospedagem</label>
            <textarea value={intake.hostingNotes ?? ""} onChange={e => set("hostingNotes", e.target.value)} rows={2} className={TA} placeholder="Alguma preferência ou dúvida?" />
          </div>
        </div>

        {/* Manutenção */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">Manutenção</p>
          <p className="text-xs text-muted-foreground mb-3">O senhor gostaria de contratar manutenção mensal para o site?</p>
          <div className="flex gap-2 mb-3">
            {[{v: true, l: "Sim, quero"}, {v: false, l: "Não agora"}].map(opt => (
              <button key={String(opt.v)} type="button"
                onClick={() => set("wantsMaintenance", opt.v)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${intake.wantsMaintenance === opt.v ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
              >{opt.l}</button>
            ))}
          </div>
          {intake.wantsMaintenance && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs mb-3">
              <p className="font-semibold text-emerald-400 mb-1">Planos de manutenção disponíveis</p>
              <p className="text-foreground/70 leading-relaxed">Suporte básico (5h/mês) a partir de R$450/mês — ajustes, atualizações e correções de bugs. Suporte avançado (15h/mês) a partir de R$1.100/mês — novas funcionalidades e manutenção completa.</p>
            </div>
          )}
          <div><label className={LABEL}>Observações</label>
            <textarea value={intake.maintenanceNotes ?? ""} onChange={e => set("maintenanceNotes", e.target.value)} rows={2} className={TA} placeholder="Alguma preferência de plano ou dúvida?" /></div>
        </div>

        {/* Notas gerais */}
        <div>
          <label className={LABEL}>Anotações livres / feedback do cliente</label>
          <textarea value={intake.notes ?? ""} onChange={e => set("notes", e.target.value)} rows={3} className={TA} placeholder="Qualquer observação adicional sobre a conversa..." />
        </div>

      </div>
    </div>
  )
}

// ── QuoteBuilder ──────────────────────────────────────────────────────────────
function QuoteBuilder({ initial, onSave, onCancel }: {
  initial?: Quote
  onSave: (q: Quote) => void
  onCancel: () => void
}) {
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
  const [pixKeyType, setPixKeyType] = useState(initial?.pixKeyType ?? "")
  const [pixKey, setPixKey] = useState(initial?.pixKey ?? "")
  const [clientIntake, setClientIntake] = useState<ClientIntake>((initial?.clientIntake as ClientIntake) ?? {})
  const [showIntake, setShowIntake] = useState(false)
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

  function addPayment(method: QuotePaymentMethod["method"]) {
    if (payments.find(p => p.method === method)) return
    const base: QuotePaymentMethod = {
      method,
      label: PAYMENT_LABELS[method],
      value: Math.round(total),
      discount: method === "pix" ? 5 : 0,
      installments: method === "cartao" ? 1 : undefined,
    }
    const disc = base.discount ?? 0
    const value = Math.round(total * (1 - disc / 100))
    setPayments(prev => [...prev, { ...base, value }])
  }

  function removePayment(method: QuotePaymentMethod["method"]) {
    setPayments(prev => prev.filter(p => p.method !== method))
  }

  function updatePayment(method: QuotePaymentMethod["method"], patch: Partial<QuotePaymentMethod & Record<string, any>>) {
    setPayments(prev => prev.map(p => {
      if (p.method !== method) return p
      const merged = { ...p, ...patch }
      if (patch.discount !== undefined) {
        merged.value = Math.round(total * (1 - (patch.discount) / 100))
      }
      if (merged.installments && merged.installments > 0) {
        merged.installmentValue = Math.round(merged.value / merged.installments)
      }
      return merged
    }))
  }

  function handleSave() {
    if (!clientName) return
    startSave(async () => {
      const payload = {
        clientName, clientEmail: clientEmail || null, clientWhatsapp: clientWhatsapp || null,
        problem: problem || null, objective: objective || null,
        expectedResult: expectedResult || null, deadline: deadline || null,
        clientIntake: Object.keys(clientIntake).length > 0 ? clientIntake : null,
        items, total: Math.round(total),
        globalDiscount: gDiscount, globalDiscountType: gDiscountType,
        paymentMethods: payments,
        pixKeyType: pixKeyType || null, pixKey: pixKey || null,
        status: initial?.status ?? "rascunho",
        shareToken: initial?.shareToken ?? null,
        shareExpiresAt: initial?.shareExpiresAt ?? null,
        osShareToken: initial?.osShareToken ?? null,
        osShareExpiresAt: initial?.osShareExpiresAt ?? null,
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
      <div className="flex-1 min-w-0 overflow-y-auto space-y-4 pr-0 lg:pr-2 pb-4">

        {/* Cliente */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Cliente</p>
            <button
              type="button"
              onClick={() => setShowIntake(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                showIntake ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"
              }`}
            >
              <Building2 className="size-3.5" />
              Perguntas iniciais
              {Object.keys(clientIntake).filter(k => (clientIntake as Record<string,unknown>)[k]).length > 0 && (
                <span className="size-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {Object.keys(clientIntake).filter(k => (clientIntake as Record<string,unknown>)[k]).length}
                </span>
              )}
              {showIntake ? <ChevronUp className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={LABEL}>Nome *</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} className={INPUT} placeholder="João Silva" /></div>
            <div><label className={LABEL}>E-mail</label>
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} type="email" className={INPUT} placeholder="joao@empresa.com" /></div>
            <div><label className={LABEL}>WhatsApp</label>
              <input value={clientWhatsapp} onChange={e => setClientWhatsapp(e.target.value)} className={INPUT} placeholder="+55 87 99999-9999" /></div>
          </div>
        </div>

        {/* Intake (perguntas iniciais) */}
        {showIntake && (
          <QuoteIntakePanel intake={clientIntake} onChange={setClientIntake} />
        )}

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
      {/* Altura fixa no desktop para forçar scroll interno */}
      <div className="w-full lg:w-[27rem] shrink-0 flex flex-col gap-3 lg:h-full lg:overflow-y-auto pb-4">

        {/* Itens selecionados */}
        <div className="rounded-xl border border-border overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Itens do Orçamento</p>
            <span className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-border">
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
                  <div className="flex items-center gap-1.5">
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
        <div className="rounded-xl border border-border overflow-hidden shrink-0">
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
            /* Scroll interno para os cards de pagamento */
            <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {payments.map(p => (
                <div key={p.method} className="px-3 py-3 space-y-2.5">
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
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { key: "banco",   label: "Banco",    ph: "Ex: Nubank" },
                          { key: "agencia", label: "Agência",  ph: "Ex: 0001" },
                          { key: "conta",   label: "Conta",    ph: "Ex: 123456-7" },
                          { key: "titular", label: "Titular",  ph: "Nome completo", full: true },
                          { key: "cpfCnpj", label: "CPF/CNPJ", ph: "000.000.000-00", full: true },
                        ].map(f => (
                          <div key={f.key} className={f.full ? "col-span-2" : ""}>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">{f.label}</label>
                            <input
                              value={(p as any)[f.key] ?? ""}
                              onChange={e => updatePayment("transferencia", { [f.key]: e.target.value })}
                              placeholder={f.ph}
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dados do boleto */}
                  {p.method === "boleto" && (
                    <div className="space-y-1.5 rounded-lg border border-border bg-secondary/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Dados do Boleto</p>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Beneficiário</label>
                        <input
                          value={(p as any).beneficiario ?? ""}
                          onChange={e => updatePayment("boleto", { beneficiario: e.target.value })}
                          placeholder="Nome da empresa / pessoa"
                          className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">CPF / CNPJ do beneficiário</label>
                        <input
                          value={(p as any).cpfCnpj ?? ""}
                          onChange={e => updatePayment("boleto", { cpfCnpj: e.target.value })}
                          placeholder="000.000.000-00"
                          className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Banco emissor</label>
                        <input
                          value={(p as any).banco ?? ""}
                          onChange={e => updatePayment("boleto", { banco: e.target.value })}
                          placeholder="Ex: Bradesco, Itaú, Sicoob"
                          className="w-full px-2 py-1 text-xs rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Linha Digitável (opcional)</label>
                        <input
                          value={(p as any).linhaDigitavel ?? ""}
                          onChange={e => updatePayment("boleto", { linhaDigitavel: e.target.value })}
                          placeholder="00000.00000 00000.000000 0 00000000000000"
                          className="w-full px-2 py-1 text-xs font-mono rounded border border-border bg-background outline-none focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-0.5">Vencimento</label>
                        <input type="date"
                          value={(p as any).vencimento ?? ""}
                          onChange={e => updatePayment("boleto", { vencimento: e.target.value })}
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
        <div className="rounded-xl border border-border p-3.5 space-y-2.5 shrink-0">
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
        <div className="flex gap-2 shrink-0">
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

// ── QuoteDocument — documento visual ─────────────────────────────────────────
export function QuoteDocument({
  quote,
  mode = "orcamento",
  theme = "dark",
}: {
  quote: Quote
  mode?: "orcamento" | "os"
  theme?: "light" | "dark"
}) {
  const items = quote.items as QuoteItem[]
  const payments = (quote.paymentMethods as QuotePaymentMethod[]) ?? []
  const subtotal = calcSubtotal(items)
  const total = calcTotal(items, quote.globalDiscount ?? 0, quote.globalDiscountType ?? "fixed")
  const globalDiscountValue = subtotal - total
  const isOS = mode === "os"
  const isDark = theme === "dark"

  const bg = isDark ? "#0a0a0a" : "#ffffff"
  const fg = isDark ? "#ffffff" : "#0a0a0a"
  const muted = isDark ? "#888" : "#666"
  const border = isDark ? "#222" : "#e5e7eb"
  const secondary = isDark ? "#141414" : "#f9fafb"
  const accent = isDark ? "#1a1a1a" : "#f3f4f6"

  const ref = isOS
    ? `OS-${String(quote.id).padStart(4, "0")}`
    : `ELV-${String(quote.id).padStart(4, "0")}`

  return (
    <div style={{ background: bg, color: fg, borderRadius: 16, overflow: "hidden", border: `1px solid ${border}` }}>

      {/* ── Cabeçalho ── */}
      <div style={{ background: fg, color: bg, padding: "28px 36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Image
              src={isDark ? "/logo-icon-light.webp" : "/logo-icon-dark.webp"}
              alt="Elevanthe"
              width={52}
              height={52}
              style={{ width: 52, height: 52, objectFit: "contain" }}
            />
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.55, marginBottom: 3 }}>
                {isOS ? "Ordem de Serviço" : "Proposta Comercial"}
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, margin: 0 }}>ELEVANTHE</h1>
              <p style={{ fontSize: 10, opacity: 0.55, marginTop: 3 }}>TECNOLOGIA QUE ELEVA NEGÓCIOS</p>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 9, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.1em" }}>Data</p>
            <p style={{ fontSize: 13, fontWeight: 700 }}>{fmtDate(quote.createdAt)}</p>
            <p style={{ fontSize: 9, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>Referência</p>
            <p style={{ fontSize: 13, fontWeight: 900, fontFamily: "monospace" }}>{ref}</p>
            {quote.deadline && (
              <>
                <p style={{ fontSize: 9, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>Prazo</p>
                <p style={{ fontSize: 11, fontWeight: 700 }}>{quote.deadline}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Cliente ── */}
        <div>
          <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>
            {isOS ? "Cliente / Contratante" : "Proposta elaborada para"}
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{quote.clientName}</p>
          {quote.clientEmail && <p style={{ fontSize: 13, color: muted }}>{quote.clientEmail}</p>}
          {quote.clientWhatsapp && <p style={{ fontSize: 13, color: muted }}>{quote.clientWhatsapp}</p>}
        </div>

        {/* ── Linha separadora ── */}
        <div style={{ height: 1, background: border }} />

        {/* ── Contexto / Descrição ── */}
        {(quote.problem || quote.objective || quote.expectedResult) && (
          <div>
            <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>
              {isOS ? "Descrição do Serviço" : "Entendimento do Projeto"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quote.problem && (
                <div style={{ background: accent, borderRadius: 10, padding: "12px 16px", border: `1px solid ${border}` }}>
                  <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>
                    Problema / Necessidade
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{quote.problem}</p>
                </div>
              )}
              {quote.objective && (
                <div style={{ background: accent, borderRadius: 10, padding: "12px 16px", border: `1px solid ${border}` }}>
                  <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Objetivo</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{quote.objective}</p>
                </div>
              )}
              {quote.expectedResult && (
                <div style={{ background: accent, borderRadius: 10, padding: "12px 16px", border: `1px solid ${border}` }}>
                  <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Resultado Esperado</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{quote.expectedResult}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tabela de itens ── */}
        <div>
          <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>
            {isOS ? "Serviços a Executar" : "Escopo e Investimento"}
          </p>
          <div style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
            {/* Cabeçalho da tabela */}
            <div style={{ display: "grid", gridTemplateColumns: isOS ? "1fr 80px 100px" : "1fr 100px", background: secondary, padding: "10px 16px", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Serviço / Entregável</span>
              {isOS && <span style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, textAlign: "center" }}>Status</span>}
              <span style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, textAlign: "right" }}>Valor</span>
            </div>

            {items.map((item, i) => {
              const final = itemFinalPrice(item)
              const hasDisc = item.discount && item.discount > 0
              return (
                <div key={item.id} style={{
                  display: "grid",
                  gridTemplateColumns: isOS ? "1fr 80px 100px" : "1fr 100px",
                  padding: "12px 16px",
                  borderBottom: i < items.length - 1 ? `1px solid ${border}` : "none",
                  background: i % 2 === 0 ? "transparent" : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                    {item.description && <p style={{ fontSize: 11, color: muted, marginTop: 2 }}>{item.description}</p>}
                    {hasDisc && (
                      <p style={{ fontSize: 10, color: "#4ade80", marginTop: 2, fontWeight: 600 }}>
                        Desconto: {item.discountType === "percent" ? `${item.discount}%` : fmtBRL(item.discount!)}
                      </p>
                    )}
                  </div>
                  {isOS && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 99, border: "1px solid rgba(250,204,21,0.3)", background: "rgba(250,204,21,0.1)", color: "#fbbf24" }}>
                        Pendente
                      </span>
                    </div>
                  )}
                  <div style={{ textAlign: "right" }}>
                    {hasDisc && <p style={{ fontSize: 11, color: muted, textDecoration: "line-through" }}>{fmtBRL(item.price)}</p>}
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{fmtBRL(final)}</p>
                  </div>
                </div>
              )
            })}

            {/* Footer da tabela */}
            {subtotal !== total && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isOS ? "1fr 80px 100px" : "1fr 100px", padding: "8px 16px", borderTop: `1px solid ${border}`, background: secondary }}>
                  <span style={{ gridColumn: isOS ? "1 / 3" : "1", fontSize: 12, color: muted }}>Subtotal</span>
                  <span style={{ textAlign: "right", fontSize: 12, color: muted }}>{fmtBRL(subtotal)}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isOS ? "1fr 80px 100px" : "1fr 100px", padding: "8px 16px", background: secondary }}>
                  <span style={{ gridColumn: isOS ? "1 / 3" : "1", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>
                    Desconto{quote.globalDiscountType === "percent" ? ` (${quote.globalDiscount}%)` : " especial"}
                  </span>
                  <span style={{ textAlign: "right", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>-{fmtBRL(globalDiscountValue)}</span>
                </div>
              </>
            )}
            <div style={{ display: "grid", gridTemplateColumns: isOS ? "1fr 80px 100px" : "1fr 100px", padding: "14px 16px", background: fg, color: bg }}>
              <span style={{ gridColumn: isOS ? "1 / 3" : "1", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {isOS ? "Valor Total do Serviço" : "Investimento Total"}
              </span>
              <span style={{ textAlign: "right", fontSize: 17, fontWeight: 900 }}>{fmtBRL(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Formas de pagamento ── */}
        {payments.length > 0 && (
          <div>
            <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>
              Formas de Pagamento
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {payments.map(p => (
                <div key={p.method} style={{ border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", background: accent }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.label}</span>
                    {(p.discount ?? 0) > 0 && (
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 99, border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.1)", color: "#4ade80", fontWeight: 700 }}>
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{fmtBRL(p.value)}</p>
                  {p.method === "cartao" && p.installments && p.installments > 1 && (
                    <p style={{ fontSize: 11, color: muted }}>
                      {p.installments}x de <strong>{fmtBRL(Math.round(p.value / p.installments))}</strong> sem juros
                    </p>
                  )}
                  {p.method === "cartao" && p.installments === 1 && (
                    <p style={{ fontSize: 11, color: muted }}>à vista no cartão</p>
                  )}
                  {/* PIX QR Code */}
                  {p.method === "pix" && quote.pixKey && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                      <div style={{ padding: 6, background: "#fff", borderRadius: 8, flexShrink: 0 }}>
                        <QRCodeSVG value={quote.pixKey} size={60} />
                      </div>
                      <div>
                        <p style={{ fontSize: 9, color: muted, marginBottom: 2 }}>
                          {quote.pixKeyType ? PIX_KEY_TYPES.find(t => t.value === quote.pixKeyType)?.label : "Chave PIX"}
                        </p>
                        <p style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, wordBreak: "break-all" }}>{quote.pixKey}</p>
                      </div>
                    </div>
                  )}
                  {/* Boleto */}
                  {p.method === "boleto" && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                      {(p as any).beneficiario && <p style={{ fontSize: 11, color: muted }}>Beneficiário: <strong style={{ color: fg }}>{(p as any).beneficiario}</strong></p>}
                      {(p as any).banco && <p style={{ fontSize: 11, color: muted }}>Banco: <strong style={{ color: fg }}>{(p as any).banco}</strong></p>}
                      {(p as any).vencimento && <p style={{ fontSize: 11, color: muted }}>Vencimento: <strong style={{ color: fg }}>{new Date((p as any).vencimento + "T12:00:00").toLocaleDateString("pt-BR")}</strong></p>}
                      {(p as any).linhaDigitavel && (
                        <div style={{ marginTop: 4 }}>
                          <p style={{ fontSize: 9, color: muted, marginBottom: 2 }}>Linha digitável:</p>
                          <p style={{ fontSize: 10, fontFamily: "monospace", wordBreak: "break-all" }}>{(p as any).linhaDigitavel}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Transferência */}
                  {p.method === "transferencia" && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                      {(p as any).banco && <p style={{ fontSize: 11, color: muted }}>Banco: <strong style={{ color: fg }}>{(p as any).banco}</strong></p>}
                      {(p as any).agencia && <p style={{ fontSize: 11, color: muted }}>Agência: <strong style={{ color: fg }}>{(p as any).agencia}</strong></p>}
                      {(p as any).conta && <p style={{ fontSize: 11, color: muted }}>Conta: <strong style={{ color: fg }}>{(p as any).conta}</strong></p>}
                      {(p as any).titular && <p style={{ fontSize: 11, color: muted }}>Titular: <strong style={{ color: fg }}>{(p as any).titular}</strong></p>}
                      {(p as any).cpfCnpj && <p style={{ fontSize: 11, color: muted }}>CPF/CNPJ: <strong style={{ color: fg }}>{(p as any).cpfCnpj}</strong></p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Assinaturas (OS) ── */}
        {isOS && (
          <div>
            <div style={{ height: 1, background: border, marginBottom: 24 }} />
            <p style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 20 }}>
              Aceite e Assinaturas
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[
                { label: "Contratante", name: quote.clientName },
                { label: "Prestador de Serviço", name: "Elevanthe Tecnologia" },
              ].map(sig => (
                <div key={sig.label}>
                  <div style={{ height: 48, borderBottom: `1px solid ${border}`, marginBottom: 8 }} />
                  <p style={{ fontSize: 11, fontWeight: 700 }}>{sig.name}</p>
                  <p style={{ fontSize: 10, color: muted }}>{sig.label}</p>
                  <p style={{ fontSize: 10, color: muted, marginTop: 4 }}>Data: ____/____/________</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Rodapé ── */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
          {isOS ? (
            <p style={{ fontSize: 11, color: muted, lineHeight: 1.7 }}>
              Esta Ordem de Serviço autoriza a Elevanthe Tecnologia a executar os itens listados acima conforme acordado entre as partes.
              Alterações de escopo deverão ser formalizadas por escrito antes da execução. Válida mediante aceite digital ou assinatura.
            </p>
          ) : (
            <p style={{ fontSize: 11, color: muted, lineHeight: 1.7 }}>
              Esta proposta é válida por <strong>30 dias</strong> a partir da data de emissão.
              Os valores cobrem exclusivamente o escopo descrito acima. Alterações de escopo poderão gerar valores adicionais, sempre comunicados previamente.
            </p>
          )}
          <p style={{ fontSize: 11, color: muted, marginTop: 8 }}>
            Dúvidas ou aceite: <strong style={{ color: fg }}>contato@elevanthe.com</strong> &middot; WhatsApp <strong style={{ color: fg }}>+55 87 98821-9342</strong> &middot; <strong style={{ color: fg }}>elevanthe.com</strong>
          </p>
        </div>
      </div>

      {/* ── Footer da marca ── */}
      <div style={{ background: secondary, borderTop: `1px solid ${border}`, padding: "12px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src={isDark ? "/logo-full-light.webp" : "/logo-full-dark.webp"}
            alt="Elevanthe"
            width={100}
            height={28}
            style={{ height: 24, width: "auto", objectFit: "contain" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 10, color: muted }}>{ref} &middot; elevanthe.com</p>
        </div>
      </div>
    </div>
  )
}

// ── SharePanel — painel de link compartilhável ─────────────────���───────────
function SharePanel({
  label,
  token,
  expiryDays,
  setExpiryDays,
  onGenerate,
  onClear,
  generating,
  shareUrl,
  onWhatsApp,
}: {
  label: string
  token: string
  expiryDays: number
  setExpiryDays: (n: number) => void
  onGenerate: () => void
  onClear: () => void
  generating: boolean
  shareUrl: string
  onWhatsApp: () => void
}) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    try {
      navigator.clipboard.writeText(shareUrl)
    } catch {
      const el = document.createElement("textarea")
      el.value = shareUrl
      el.style.cssText = "position:fixed;opacity:0"
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{label}</p>
      {!token ? (
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-muted-foreground shrink-0">Expira em</label>
          <select value={expiryDays} onChange={e => setExpiryDays(Number(e.target.value))}
            className="px-2 py-1.5 rounded-lg border border-border bg-secondary text-sm outline-none">
            {[1,3,7,15,30].map(d => <option key={d} value={d}>{d} dia{d > 1 ? "s" : ""}</option>)}
          </select>
          <button onClick={onGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--foreground)", color: "var(--background)" }}>
            <Link2 className="size-4" />Gerar Link
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
            <p className="flex-1 text-xs font-mono truncate">{shareUrl}</p>
            <button onClick={handleCopy} className="shrink-0 text-muted-foreground hover:text-foreground transition">
              {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition">
              <Copy className="size-3.5" />Copiar
            </button>
            <button onClick={onWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#25d366]/30 text-[#25d366] bg-[#25d366]/10 hover:bg-[#25d366]/20 text-xs font-semibold transition">
              <MessageSquare className="size-3.5" />WhatsApp
            </button>
            <button onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary transition text-muted-foreground">
              <Link2 className="size-3.5" />Novo link
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── IntakeReadView — exibe intake salvo em modo somente leitura ───────────────
function IntakeReadView({ intake }: { intake: ClientIntake }) {
  const ROW = ({ label, value }: { label: string; value?: string | boolean | null }) => {
    if (value === undefined || value === null || value === "" || value === false) return null
    const display = value === true ? "Sim" : String(value)
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-sm leading-relaxed">{display}</span>
      </div>
    )
  }

  const DOMAIN_LABELS: Record<string, string> = { sim: "Sim, quer domínio", nao: "Não por enquanto", ja_tenho: "Já possui domínio" }
  const HOSTING_LABELS: Record<string, string> = { elevanthe: "Elevanthe gerencia", proprio: "Cliente gerencia próprio", nao_sabe: "Ainda não decidiu" }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
        <Building2 className="size-3.5 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Perguntas Iniciais — Dados do Cliente</p>
      </div>
      <div className="p-4 space-y-5">

        {/* Empresa */}
        {(intake.companyName || intake.sector || intake.city || intake.foundedYear || intake.employees) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Empresa</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ROW label="Nome" value={intake.companyName} />
              <ROW label="Setor" value={intake.sector} />
              <ROW label="Cidade" value={intake.city} />
              <ROW label="Fundação" value={intake.foundedYear} />
              <ROW label="Funcionários" value={intake.employees} />
            </div>
          </div>
        )}

        {/* Identidade */}
        {(intake.origin || intake.motivation || intake.problemSolved) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Identidade</p>
            <div className="space-y-2">
              <ROW label="Como surgiu" value={intake.origin} />
              <ROW label="Motivação" value={intake.motivation} />
              <ROW label="Problema que resolve" value={intake.problemSolved} />
            </div>
          </div>
        )}

        {/* Missão / Visão / Valores */}
        {(intake.mission || intake.vision || intake.values) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Missão / Visão / Valores</p>
            <div className="space-y-2">
              <ROW label="Missão" value={intake.mission} />
              <ROW label="Visão" value={intake.vision} />
              <ROW label="Valores" value={intake.values} />
            </div>
          </div>
        )}

        {/* Mercado */}
        {(intake.targetAudience || intake.differentials || intake.competitors || intake.socialMedia) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Mercado</p>
            <div className="space-y-2">
              <ROW label="Público-alvo" value={intake.targetAudience} />
              <ROW label="Diferenciais" value={intake.differentials} />
              <ROW label="Concorrentes" value={intake.competitors} />
              <ROW label="Redes sociais" value={intake.socialMedia} />
            </div>
          </div>
        )}

        {/* Branding */}
        {(intake.hasLogo !== undefined || intake.brandColors || intake.logoUrl) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Branding</p>
            <div className="grid grid-cols-2 gap-3">
              <ROW label="Possui logotipo" value={intake.hasLogo} />
              <ROW label="Cores da marca" value={intake.brandColors} />
              {intake.logoUrl && <ROW label="URL do logo" value={intake.logoUrl} />}
            </div>
          </div>
        )}

        {/* Domínio */}
        {intake.wantsDomain && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Domínio</p>
            <div className="grid grid-cols-2 gap-3">
              <ROW label="Decisão" value={DOMAIN_LABELS[intake.wantsDomain] ?? intake.wantsDomain} />
              {intake.domainName && <ROW label="Nome/domínio" value={intake.domainName + (intake.domainType ?? "")} />}
            </div>
          </div>
        )}

        {/* Hospedagem */}
        {intake.hostingOption && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Hospedagem</p>
            <div className="space-y-2">
              <ROW label="Opção" value={HOSTING_LABELS[intake.hostingOption] ?? intake.hostingOption} />
              <ROW label="Observações" value={intake.hostingNotes} />
            </div>
          </div>
        )}

        {/* Manutenção */}
        {intake.wantsMaintenance !== undefined && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-3">Manutenção</p>
            <div className="space-y-2">
              <ROW label="Quer manutenção" value={intake.wantsMaintenance} />
              <ROW label="Observações" value={intake.maintenanceNotes} />
            </div>
          </div>
        )}

        {intake.notes && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-2">Anotações livres</p>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{intake.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── QuotePreview ──────────────────────────────────────────────────────────────
function QuotePreview({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const [docMode, setDocMode] = useState<"orcamento" | "os">("orcamento")
  const [docTheme, setDocTheme] = useState<"dark" | "light">("dark")

  // Se já tem token e não expirou, inicializa direto — sem precisar gerar
  const shareTokenValid = quote.shareToken && (!quote.shareExpiresAt || new Date(quote.shareExpiresAt) > new Date())
  const osTokenValid = quote.osShareToken && (!quote.osShareExpiresAt || new Date(quote.osShareExpiresAt) > new Date())

  const [shareToken, setShareToken] = useState(shareTokenValid ? (quote.shareToken ?? "") : "")
  const [shareExpiryDays, setShareExpiryDays] = useState(7)
  const [generatingShare, startShare] = useTransition()

  const [osToken, setOsToken] = useState(osTokenValid ? (quote.osShareToken ?? "") : "")
  const [osExpiryDays, setOsExpiryDays] = useState(7)
  const [generatingOS, startOS] = useTransition()

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const shareUrl = shareToken ? `${origin}/orcamento/${shareToken}` : ""
  const osUrl = osToken ? `${origin}/os/${osToken}` : ""

  function handleGenShare() {
    startShare(async () => {
      const token = await generateShareLink(quote.id, shareExpiryDays)
      setShareToken(token)
    })
  }

  function handleGenOS() {
    startOS(async () => {
      const token = await generateOSShareLink(quote.id, osExpiryDays)
      setOsToken(token)
    })
  }

  const [wameSending, setWameSending] = useState(false)
  const [wameStatus, setWameStatus] = useState<"idle" | "ok" | "error">("idle")
  const [wameError, setWameError] = useState("")

  async function sendWhatsApp(url: string, docLabel: string) {
    const wa = quote.clientWhatsapp?.replace(/\D/g, "") ?? ""
    const message = `Olá ${quote.clientName}! Preparei ${docLabel} para o seu projeto. Acesse aqui: ${url}`
    if (wa) {
      setWameSending(true)
      setWameStatus("idle")
      const result = await sendWameMessage(wa, message)
      setWameSending(false)
      if (result.ok) {
        setWameStatus("ok")
        setTimeout(() => setWameStatus("idle"), 3000)
      } else {
        setWameStatus("error")
        setWameError(result.error ?? "Erro desconhecido")
        // fallback: abre wa.me
        const href = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`
        try { (window.top ?? window).open(href, "_blank") } catch { window.open(href, "_blank") }
      }
    } else {
      const href = `https://wa.me/?text=${encodeURIComponent(message)}`
      try { (window.top ?? window).open(href, "_blank") } catch { window.open(href, "_blank") }
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0 flex-wrap">
        <FileText className="size-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-semibold flex-1 truncate">{quote.clientName} — #{quote.id}</span>

        {/* Toggle Orçamento / OS */}
        <div className="flex items-center gap-0.5 p-1 rounded-xl border border-border bg-secondary">
          <button onClick={() => setDocMode("orcamento")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${docMode === "orcamento" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            <FileText className="size-3" />Orçamento
          </button>
          <button onClick={() => setDocMode("os")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${docMode === "os" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            <ClipboardList className="size-3" />Ordem de Serviço
          </button>
        </div>

        {/* Toggle tema */}
        <button onClick={() => setDocTheme(t => t === "dark" ? "light" : "dark")}
          title={docTheme === "dark" ? "Mudar para claro" : "Mudar para escuro"}
          className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition shrink-0">
          {docTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>

        <button onClick={onClose} className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition shrink-0">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
          <QuoteDocument quote={quote} mode={docMode} theme={docTheme} />

          {/* Links compartilháveis */}
          <div className="rounded-xl border border-border p-4 space-y-5">
            {/* Feedback wame */}
            {wameSending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <span className="size-1.5 rounded-full bg-[#25d366] animate-pulse" />
                Enviando via WhatsApp...
              </div>
            )}
            {wameStatus === "ok" && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                <Check className="size-3.5" />Mensagem enviada com sucesso via WhatsApp!
              </div>
            )}
            {wameStatus === "error" && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <p className="font-semibold">Erro ao enviar pelo wame — abrindo wa.me como fallback</p>
                <p className="opacity-70 mt-0.5">{wameError}</p>
              </div>
            )}
            <SharePanel
              label="Link do Orçamento"
              token={shareToken}
              expiryDays={shareExpiryDays}
              setExpiryDays={setShareExpiryDays}
              onGenerate={handleGenShare}
              onClear={() => setShareToken("")}
              generating={generatingShare}
              shareUrl={shareUrl}
              onWhatsApp={() => sendWhatsApp(shareUrl, "um orçamento detalhado")}
            />
            <div className="border-t border-border" />
            <SharePanel
              label="Link da Ordem de Serviço"
              token={osToken}
              expiryDays={osExpiryDays}
              setExpiryDays={setOsExpiryDays}
              onGenerate={handleGenOS}
              onClear={() => setOsToken("")}
              generating={generatingOS}
              shareUrl={osUrl}
              onWhatsApp={() => sendWhatsApp(osUrl, "uma Ordem de Serviço")}
            />
          </div>

          {/* Perguntas iniciais (intake) — visualização somente leitura */}
          {quote.clientIntake && Object.keys(quote.clientIntake as object).some(k => (quote.clientIntake as Record<string,unknown>)[k]) && (
            <IntakeReadView intake={quote.clientIntake as ClientIntake} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── QuotesAdmin — painel principal ────────────────────────────────────────────
export function QuotesAdmin({ initialQuotes, onQuotesChange }: {
  initialQuotes: Quote[]
  onQuotesChange: (q: Quote[]) => void
}) {
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

  function handleEdit(q: Quote) { setEditingQuote(q); setView("builder") }
  function handleDelete(id: number) {
    if (!confirm("Excluir este orçamento permanentemente?")) return
    startDelete(async () => {
      await deleteQuote(id)
      syncQuotes(quotes.filter(q => q.id !== id))
    })
  }
  function handlePreview(q: Quote) { setPreviewQuote(q); setView("preview") }

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
          <QuoteBuilder
            initial={editingQuote}
            onSave={handleSave}
            onCancel={() => { setView("list"); setEditingQuote(undefined) }}
          />
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
          {quotes.map(q => {
            const items = q.items as QuoteItem[]
            const total = calcTotal(items, q.globalDiscount ?? 0, q.globalDiscountType ?? "fixed")
            return (
              <div key={q.id} className="rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-secondary/50 transition group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">ELV-{String(q.id).padStart(4, "0")}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${STATUS_COLOR[q.status] ?? STATUS_COLOR.rascunho}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold truncate">{q.clientName}</p>
                  <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} · {fmtBRL(total)}</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handlePreview(q)} title="Visualizar"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition">
                    <FileText className="size-3.5" />Ver
                  </button>
                  <button onClick={() => handleEdit(q)} title="Editar"
                    className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => handleDelete(q.id)} title="Excluir"
                    className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary hover:text-red-400 transition text-muted-foreground">
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

"use client"

import { Code2, Clock, Shield, Lightbulb, Package, HeartHandshake } from "lucide-react"

const stats = [
  { value: "3+", label: "Anos de experiência" },
  { value: "50+", label: "Projetos entregues" },
  { value: "100%", label: "Código do cliente" },
  { value: "24h", label: "Resposta garantida" },
]

const techs = ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Python", "Tailwind CSS", "REST APIs"]

const differentials = [
  {
    icon: Code2,
    title: "Código 100% seu",
    desc: "Todo projeto entregue com código-fonte original. Você tem total controle e propriedade.",
  },
  {
    icon: Shield,
    title: "Domínio total",
    desc: "Sem dependência de terceiros. Você hospeda onde quiser, com quem quiser.",
  },
  {
    icon: Lightbulb,
    title: "Foco no problema real",
    desc: "Analiso sua necessidade antes de propor qualquer solução. O objetivo é resolver, não só entregar.",
  },
  {
    icon: Clock,
    title: "Manutenção por contrato",
    desc: "Preço combinado previamente, sem surpresas. Seu site sempre funcionando.",
  },
  {
    icon: Package,
    title: "Templates adaptados",
    desc: "Projetos prontos que adapto ao seu banco de dados. Mais rápido e acessível.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte direto",
    desc: "Comunicação direta comigo. Sem intermediários — você sabe exatamente o que acontece.",
  },
]

export function AboutSection() {
  return (
    <section id="sobre" className="relative py-32 overflow-hidden">
      {/* Divisor */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Bloco superior: texto + stats ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start mb-28">
          {/* Texto */}
          <div>
            <p className="section-label mb-5">Sobre mim</p>
            <h2 className="text-4xl sm:text-5xl font-black text-[#eef4f0] leading-tight tracking-tight mb-7">
              Desenvolvedor que{" "}
              <span className="text-[#5cff8a] glow-text-sm">resolve problemas</span>
            </h2>
            <p className="text-[#7a9985] text-[15px] leading-relaxed mb-5">
              Sou desenvolvedor web full-stack com foco em criar soluções digitais que funcionam de verdade.
              Não entrego apenas código — entrego{" "}
              <span className="text-[#eef4f0] font-medium">autonomia total ao cliente</span>.
            </p>
            <p className="text-[#7a9985] text-[15px] leading-relaxed mb-5">
              Atuo em projetos desde sites simples e landing pages até plataformas analíticas e sistemas
              empresariais. Cada projeto começa com uma conversa: você me conta o problema,
              eu proponho a solução mais adequada.
            </p>
            <p className="text-[#7a9985] text-[15px] leading-relaxed mb-8">
              Acredito que o cliente deve ter{" "}
              <span className="text-[#eef4f0] font-medium">total domínio do que foi construído</span>.
              Por isso, todos os projetos incluem código original — sem amarrações.
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 text-[11px] font-mono rounded-lg bg-[#111f16] border border-white/7 text-[#7a9985] hover:border-[#5cff8a]/30 hover:text-[#5cff8a] transition-all duration-200 cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats — bento 2×2 */}
          <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/7"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#0c1710] px-8 py-10 flex flex-col items-center justify-center gap-2 text-center hover:bg-[#0f1e14] transition-colors duration-300 group"
              >
                <span
                  className="text-4xl font-black text-[#5cff8a] leading-none group-hover:glow-text transition-all"
                  style={{ textShadow: "0 0 24px rgba(92,255,138,0.35)" }}
                >
                  {s.value}
                </span>
                <span className="text-[12px] text-[#7a9985]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Texto grande com marquee — igual à seção "Get a refund" do vídeo ── */}
        <div className="relative overflow-hidden py-4 mb-28 select-none" aria-hidden="true">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-[72px] sm:text-[96px] font-black tracking-tight text-[#5cff8a] opacity-[0.07] shrink-0"
              >
                Código original · Entrega no prazo · 100% personalizado · Suporte real ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── Diferenciais ─────────────────────────── */}
        <div className="mb-12">
          <p className="section-label mb-5">Por que me escolher</p>
          <h3 className="text-3xl sm:text-4xl font-black text-[#eef4f0] tracking-tight mb-12">
            Diferenciais que fazem a{" "}
            <span className="text-[#5cff8a] glow-text-sm">diferença</span>
          </h3>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-white/7"
          style={{ gap: "1px", background: "rgba(255,255,255,0.06)" }}
        >
          {differentials.map((d) => {
            const Icon = d.icon
            return (
              <div
                key={d.title}
                className="group bg-[#0c1710] p-7 flex gap-5 hover:bg-[#0f1e14] transition-colors duration-300 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-[#5cff8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="size-9 rounded-xl bg-[#111f16] border border-white/7 flex items-center justify-center flex-shrink-0 group-hover:border-[#5cff8a]/30 group-hover:bg-[#5cff8a]/8 transition-all duration-300 mt-0.5">
                  <Icon className="size-4 text-[#7a9985] group-hover:text-[#5cff8a] transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-semibold text-[#eef4f0] mb-1.5">{d.title}</h4>
                  <p className="text-[12.5px] text-[#7a9985] leading-relaxed">{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

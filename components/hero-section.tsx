"use client"

import { ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Glow radial verde centralizado */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.03) 40%, transparent 70%)",
        }}
      />
      {/* Glow superior menor */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-8 animate-fade-up">
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse-glow" />
          <span className="text-xs font-medium text-zinc-400 tracking-wide">
            Disponível para novos projetos
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[86px] font-bold leading-[0.94] tracking-tight text-white animate-fade-up delay-100 text-balance">
          Sem Limites no{" "}
          <span className="text-green-400 text-glow">Desenvolvimento</span>
          <br />
          Web. Conquiste a Internet.
        </h1>

        {/* Sub */}
        <p className="mt-7 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed animate-fade-up delay-200">
          De pequenas landing pages a grandes aplicações empresariais e plataformas
          personalizadas. Construo soluções web rápidas, escaláveis e bonitas — e o
          código-fonte é sempre seu.
        </p>

        {/* Checks */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 animate-fade-up delay-300">
          {["Código original entregue", "100% personalizado", "Suporte incluído", "Manutenção sob demanda"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <CheckCircle className="size-3.5 text-green-400" />
              {t}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-9 animate-fade-up delay-400">
          <a
            href="#contato"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-green-400 text-black text-sm font-bold hover:bg-green-300 transition-all duration-200 group glow-green"
          >
            Me Contrate
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#contato"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-green-400/30 text-green-400 text-sm font-semibold bg-green-400/[0.04] hover:bg-green-400/[0.08] hover:border-green-400/50 transition-all duration-200"
          >
            Consulta Grátis
          </a>
        </div>

        {/* Floating tech visual */}
        <div className="mt-20 relative w-full max-w-2xl animate-fade-up delay-500">
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-6 glow-green-sm">
            {/* Dot row */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="size-2.5 rounded-full bg-red-500/60" />
              <span className="size-2.5 rounded-full bg-yellow-500/60" />
              <span className="size-2.5 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">devpro ~ main</span>
            </div>
            {/* Code lines */}
            <div className="font-mono text-sm space-y-1.5 text-left">
              <p><span className="text-green-400">const</span> <span className="text-blue-400">solution</span> = <span className="text-green-400">await</span> <span className="text-yellow-400">devpro</span>.<span className="text-blue-300">build</span>{"({"}</p>
              <p className="pl-6"><span className="text-orange-400">client</span>: <span className="text-green-300">&quot;Você&quot;</span>,</p>
              <p className="pl-6"><span className="text-orange-400">problem</span>: <span className="text-green-300">&quot;Qualquer desafio&quot;</span>,</p>
              <p className="pl-6"><span className="text-orange-400">ownership</span>: <span className="text-blue-300">true</span>,</p>
              <p className="pl-6"><span className="text-orange-400">quality</span>: <span className="text-green-300">&quot;enterprise&quot;</span>,</p>
              <p>{"});"}</p>
              <p className="mt-2 text-zinc-500">{"// "}<span className="text-green-400 animate-pulse">&#9646;</span> Projeto entregue com sucesso</p>
            </div>
          </div>
          {/* Glow sob o card */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(74,222,128,0.18) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        </div>
      </div>
    </section>
  )
}

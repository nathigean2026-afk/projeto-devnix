// Server Component — sem "use client"
// O h1 é renderizado no servidor e enviado no HTML inicial.
// Isso garante que o LCP element (o título do hero) esteja
// disponível imediatamente, sem aguardar hydration do JS.

import { ArrowRight } from "lucide-react"

const TAGS = ["Sites", "Software", "E-commerce", "Plataformas", "Landing Pages", "Blogs", "Sistemas", "APIs"]

export function HeroContent() {
  return (
    <>
      {/* Tag badge */}
      <div
        className="flex items-center gap-3 mb-10 pointer-events-auto animate-fade-in"
        style={{ animationDelay: "0ms", animationFillMode: "both" }}
      >
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-muted-foreground"
          style={{ background: "var(--secondary)" }}
        >
          <span className="size-1.5 rounded-full bg-foreground opacity-60 animate-pulse" />
          <span className="label-sm">Desenvolvedor Full-Stack · Disponível</span>
        </span>
      </div>

      {/* Headline — elemento LCP, renderizado no servidor */}
      <div className="overflow-hidden mb-1">
        <h1
          className="text-display text-foreground hero-h1-slide"
          style={{
            fontSize: "clamp(54px,10vw,136px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            animationDelay: "0ms",
          }}
        >
          Seu site
        </h1>
      </div>
      <div className="overflow-hidden mb-1">
        <h1
          className="text-display hero-h1-slide"
          style={{
            fontSize: "clamp(54px,10vw,136px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1.5px var(--foreground)",
            opacity: 0.45,
            animationDelay: "60ms",
          }}
        >
          é sua
        </h1>
      </div>
      <div className="overflow-hidden">
        <h1
          className="text-display text-foreground hero-h1-slide"
          style={{
            fontSize: "clamp(54px,10vw,136px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            animationDelay: "120ms",
          }}
        >
          identidade.
        </h1>
      </div>

      {/* CTA row */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-14 pointer-events-auto animate-fade-in-up"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
          Construo sites, software e plataformas que pertencem a você. Código-fonte
          entregue, personalizado do zero, sem limites de escala.
        </p>
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href="#contato"
            className="group flex items-center gap-3 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Começar Projeto
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#servicos"
            className="flex items-center gap-3 px-7 py-4 rounded-full border border-border text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300"
          >
            Ver Serviços
          </a>
        </div>
      </div>

      {/* Marquee strip */}
      <div
        className="mt-16 overflow-hidden animate-fade-in"
        style={{ animationDelay: "600ms", animationFillMode: "both" }}
        aria-hidden="true"
      >
        <div className="flex w-max marquee-track">
          {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
            <div key={i} className="flex items-center gap-6 px-6">
              <span className="label-sm text-muted-foreground whitespace-nowrap">{tag}</span>
              <span className="size-1 rounded-full bg-border flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

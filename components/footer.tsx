"use client"

import { Mail, GitBranch, AtSign, Link2 } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const footerLinks = {
  Serviços: [
    "Sites Profissionais",
    "Software Personalizado",
    "Plataformas Analíticas",
    "Landing Pages",
    "E-commerce",
    "Blogs & Conteúdo",
  ],
  Navegação: ["Serviços", "Processo", "Preços", "FAQ", "Contato"],
}

const socials = [
  { Icon: GitBranch, href: "https://github.com", label: "GitHub" },
  { Icon: Link2, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: AtSign, href: "https://instagram.com", label: "Instagram" },
  { Icon: Mail, href: "mailto:contato@devnix.com.br", label: "E-mail" },
]

export function Footer() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === "dark"

  return (
    <footer
      className="relative overflow-hidden border-t border-border"
      style={{ background: "var(--secondary)" }}
    >
      {/* Giant background text */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[clamp(80px,18vw,220px)] font-black text-foreground tracking-tight leading-none whitespace-nowrap"
          style={{ opacity: 0.025, letterSpacing: "-0.04em" }}
        >
          Devnix
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* CTA Banner */}
        <div
          className="relative rounded-2xl border border-border p-8 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "var(--background)" }}
        >
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Pronto para começar?</h3>
            <p className="text-sm text-muted-foreground">
              Entre em contato e receba uma proposta sem compromisso em até 24h.
            </p>
          </div>
          <a
            href="#contato"
            className="flex items-center gap-2 px-7 py-4 rounded-full text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-300 hover:opacity-75"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Iniciar Projeto
          </a>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5 w-fit group" aria-label="Devnix">
              <Image
                src="/logo-full.png"
                alt="Devnix — Soluções Web Inteligentes"
                width={160}
                height={46}
                className={`object-contain transition-all duration-300${mounted && !isDark ? " brightness-0" : ""}`}
                style={{ height: "auto" }}
              />
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mb-6">
              Desenvolvimento web inteligente. Sites, software, plataformas analíticas e soluções
              digitais sob medida. Código 100% entregue ao cliente.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200"
                  style={{ background: "var(--background)" }}
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="label-sm text-foreground mb-5">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground opacity-50">
            &copy; {new Date().getFullYear()} Devnix. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground opacity-50">
            Feito com <span className="opacity-80">&#9829;</span> por Devnix
          </p>
        </div>
      </div>
    </footer>
  )
}


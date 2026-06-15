"use client"

import { Code2, Mail, GitBranch, AtSign, Link2, ArrowUpRight } from "lucide-react"

const footerLinks = {
  Serviços: [
    "Sites Profissionais",
    "Software Personalizado",
    "Plataformas Analíticas",
    "Landing Pages",
    "E-commerce",
    "Blogs & Conteúdo",
  ],
  Projetos: [
    "Portfólio",
    "Projetos Pré-prontos",
    "Cases de sucesso",
    "Depoimentos",
  ],
  Empresa: [
    "Sobre mim",
    "Como funciona",
    "Preços",
    "Contato",
  ],
}

const socials = [
  { icon: GitBranch, href: "https://github.com", label: "GitHub" },
  { icon: Link2, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: AtSign, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:contato@devpro.com.br", label: "E-mail" },
]

export function Footer() {
  const scrollTo = (href: string) => {
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border bg-card">
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.2 155 / 50%), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => scrollTo("#inicio")}
              className="flex items-center gap-2 mb-5 group"
            >
              <div className="size-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-primary transition-all">
                <Code2 className="size-5 text-primary" />
              </div>
              <span className="font-bold text-lg">
                Dev<span className="text-primary">Pro</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Desenvolvimento web profissional. Sites, software personalizado, plataformas analíticas
              e soluções digitais sob medida. Código 100% entregue ao cliente.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="size-9 rounded-lg border border-border bg-muted flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all duration-200"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-5">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-foreground text-xl mb-1">Pronto para começar?</h3>
            <p className="text-sm text-muted-foreground">
              Entre em contato e receba uma proposta sem compromisso em até 24h.
            </p>
          </div>
          <button
            onClick={() => scrollTo("#contato")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 neon-glow whitespace-nowrap flex-shrink-0"
          >
            Iniciar projeto
            <ArrowUpRight className="size-4" />
          </button>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} DevPro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span>Feito com</span>
            <span className="text-primary mx-1">♥</span>
            <span>por</span>
            <span className="text-foreground font-medium ml-1">DevPro</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

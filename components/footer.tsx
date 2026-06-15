import { Code2, Mail, GitBranch, AtSign, Link2 } from "lucide-react"

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
  { Icon: Mail, href: "mailto:contato@devpro.com.br", label: "E-mail" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-800/60 bg-zinc-950">
      {/* "Let's Talk" gigantesco que se mistura ao fundo */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[clamp(80px,18vw,220px)] font-black text-white tracking-tight leading-none whitespace-nowrap"
          style={{ opacity: 0.025 }}
        >
          Let&apos;s Talk
        </span>
      </div>

      {/* Glow sutil no topo */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* CTA Banner */}
        <div className="relative rounded-2xl border border-green-400/15 bg-green-400/[0.03] p-8 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 100% at 10% 50%, rgba(74,222,128,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-1">Pronto para começar?</h3>
            <p className="text-sm text-zinc-500">
              Entre em contato e receba uma proposta sem compromisso em até 24h.
            </p>
          </div>
          <a
            href="#contato"
            className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-green-400 text-black font-bold text-sm hover:bg-green-300 transition-all duration-200 whitespace-nowrap glow-green"
          >
            Iniciar Projeto
          </a>
        </div>

        {/* Grid de links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Marca */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5 w-fit">
              <Code2 className="size-5 text-green-400" />
              <span className="text-white font-bold text-base tracking-tight">
                Dev<span className="text-green-400">Pro</span>
              </span>
              <span className="size-1.5 rounded-full bg-green-400 mb-2.5 animate-pulse-glow" />
            </a>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mb-6">
              Desenvolvimento web profissional. Sites, software, plataformas analíticas e soluções
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
                  className="size-8 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-600 hover:border-green-400/30 hover:text-green-400 hover:bg-green-400/[0.05] transition-all duration-200"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links de navegação */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-5">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-xs text-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors duration-200">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-zinc-800/60">
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} DevPro. Todos os direitos reservados.
          </p>
          <p className="text-xs text-zinc-700">
            Feito com{" "}
            <span className="text-green-400/60">&#9829;</span> por{" "}
            <span className="text-zinc-500">DevPro</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { Code2, Mail, GitBranch, AtSign, Link2, ArrowRight } from "lucide-react"

const footerLinks = {
  Serviços: [
    "Sites Profissionais",
    "Software Personalizado",
    "Plataformas Analíticas",
    "Landing Pages",
    "E-commerce",
    "Blogs & Conteúdo",
  ],
  Projetos: ["Portfólio", "Projetos Pré-prontos", "Cases de sucesso", "Depoimentos"],
  Empresa: ["Sobre mim", "Como funciona", "Preços", "Contato"],
}

const socials = [
  { Icon: GitBranch, href: "https://github.com", label: "GitHub" },
  { Icon: Link2, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: AtSign, href: "https://instagram.com", label: "Instagram" },
  { Icon: Mail, href: "mailto:contato@devpro.com.br", label: "E-mail" },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/7 bg-[#080e0a]">
      {/* Linha de brilho no topo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,255,138,0.5), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* CTA banner */}
        <div
          className="relative rounded-2xl border border-[#5cff8a]/15 bg-[#5cff8a]/4 p-8 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
        >
          {/* Glow sutil atrás */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(92,255,138,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h3 className="font-black text-[#eef4f0] text-xl mb-1">Pronto para começar?</h3>
            <p className="text-[13px] text-[#7a9985]">
              Entre em contato e receba uma proposta sem compromisso em até 24h.
            </p>
          </div>
          <Link
            href="#contato"
            className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5cff8a] text-[#0c1710] font-bold text-sm hover:bg-[#7aff9e] transition-all duration-200 whitespace-nowrap flex-shrink-0 group"
            style={{ boxShadow: "0 0 22px rgba(92,255,138,0.4)" }}
          >
            Iniciar projeto
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#home" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div
                className="size-8 rounded-lg border border-[#5cff8a]/25 bg-[#5cff8a]/8 flex items-center justify-center"
                style={{ boxShadow: "0 0 12px rgba(92,255,138,0.12)" }}
              >
                <Code2 className="size-4 text-[#5cff8a]" />
              </div>
              <span className="text-[15px] font-bold text-[#eef4f0]">
                Dev<span className="text-[#5cff8a]">Pro</span>
              </span>
            </Link>
            <p className="text-[13px] text-[#536860] leading-relaxed max-w-xs mb-7">
              Desenvolvimento web profissional. Sites, software, plataformas analíticas e soluções
              digitais sob medida. Código 100% entregue ao cliente.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-8 rounded-lg border border-white/7 bg-[#111f16] flex items-center justify-center text-[#536860] hover:border-[#5cff8a]/25 hover:text-[#5cff8a] hover:bg-[#5cff8a]/6 transition-all duration-200"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categorias */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold text-[#eef4f0] uppercase tracking-widest mb-5">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-[13px] text-[#536860] hover:text-[#c8d9cd] cursor-pointer transition-colors duration-200">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/6">
          <p className="text-[12px] text-[#536860]">
            &copy; {new Date().getFullYear()} DevPro. Todos os direitos reservados.
          </p>
          <p className="text-[12px] text-[#536860]">
            Feito com <span className="text-[#5cff8a]">♥</span> por{" "}
            <span className="text-[#c8d9cd]">DevPro</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

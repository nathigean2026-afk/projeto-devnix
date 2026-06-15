"use client"

import { useState, useEffect } from "react"
import { Menu, X, Code2 } from "lucide-react"

const links = [
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1.5 group">
          <Code2 className="size-5 text-green-400" />
          <span className="text-white font-bold text-base tracking-tight">
            Dev<span className="text-green-400">Pro</span>
          </span>
          <span className="size-1.5 rounded-full bg-green-400 mb-2.5 animate-pulse-glow" />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contato"
          className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-green-400 border border-green-400/40 rounded-lg bg-green-400/[0.05] hover:bg-green-400/[0.10] hover:border-green-400/60 transition-all duration-200 glow-green-sm"
        >
          Iniciar Projeto
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-white/[0.06] px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-zinc-300 hover:text-green-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-2.5 text-sm font-semibold text-green-400 border border-green-400/40 rounded-lg text-center bg-green-400/[0.05]"
          >
            Iniciar Projeto
          </a>
        </div>
      )}
    </header>
  )
}

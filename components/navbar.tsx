"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Code2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Início", href: "#home" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Preços", href: "#precos" },
  { label: "Contato", href: "#contato" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("#home")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0c1710]/85 backdrop-blur-2xl border-b border-white/6"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2.5 group">
            <div
              className="relative size-8 flex items-center justify-center rounded-lg border border-[#5cff8a]/25 bg-[#5cff8a]/8"
              style={{ boxShadow: "0 0 14px rgba(92,255,138,0.15)" }}
            >
              <Code2 className="size-4 text-[#5cff8a]" />
            </div>
            <span className="text-[15px] font-bold text-[#eef4f0] tracking-tight">
              Dev<span className="text-[#5cff8a]">Pro</span>
            </span>
          </Link>

          {/* Links desktop */}
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-all duration-200",
                  active === link.href
                    ? "text-[#eef4f0]"
                    : "text-[#7a9985] hover:text-[#c8d9cd]"
                )}
              >
                {active === link.href && (
                  <span className="absolute inset-0 rounded-lg bg-white/7" />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTAs desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="#contato"
              className="text-[13px] font-medium text-[#7a9985] hover:text-[#c8d9cd] transition-colors px-3 py-1.5"
            >
              Falar comigo
            </Link>
            <Link
              href="#contato"
              className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-xl bg-[#5cff8a] text-[#0c1710] hover:bg-[#7aff9e] transition-all duration-200 group"
              style={{ boxShadow: "0 0 22px rgba(92,255,138,0.35)" }}
            >
              Iniciar projeto
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Hamburguer mobile */}
          <button
            className="md:hidden p-1.5 text-[#7a9985] hover:text-[#eef4f0] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-[#0c1710]/98 border-b border-white/7 px-6 py-5 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                  active === link.href
                    ? "text-[#5cff8a] bg-[#5cff8a]/8"
                    : "text-[#7a9985] hover:text-[#eef4f0]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-white/6">
              <Link
                href="#contato"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5cff8a] text-[#0c1710] text-sm font-bold"
              >
                Iniciar projeto
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

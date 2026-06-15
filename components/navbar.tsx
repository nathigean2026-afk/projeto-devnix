"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const links = [
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Projetos", href: "#projetos" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="transition-all duration-500"
          style={{
            margin: scrolled ? "12px 24px" : "0",
            borderRadius: scrolled ? "16px" : "0",
            background: scrolled
              ? isDark
                ? "rgba(8,8,8,0.88)"
                : "rgba(250,250,250,0.88)"
              : "transparent",
            backdropFilter: scrolled ? "blur(24px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
            border: scrolled ? "1px solid var(--border)" : "1px solid transparent",
            boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.18)" : "none",
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group" aria-label="Devnix — Soluções Web Inteligentes">
              {/* Mobile: icon only */}
              <Image
                src="/logo-icon.png"
                alt="Devnix"
                width={56}
                height={56}
                className={`object-contain block sm:hidden transition-all duration-300${mounted && !isDark ? " brightness-0" : ""}`}
                style={{ height: "auto" }}
                priority
              />
              {/* Desktop: full logo */}
              <Image
                src="/logo-full.png"
                alt="Devnix — Soluções Web Inteligentes"
                width={260}
                height={75}
                className={`object-contain hidden sm:block transition-all duration-300${mounted && !isDark ? " brightness-0" : ""}`}
                style={{ height: "auto" }}
                priority
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="size-8 rounded-full flex items-center justify-center border border-border hover:bg-secondary transition-all duration-200"
                  aria-label="Alternar tema"
                >
                  {isDark
                    ? <Sun className="size-3.5 text-muted-foreground" />
                    : <Moon className="size-3.5 text-muted-foreground" />}
                </button>
              )}
              <a
                href="#contato"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-75 hover:scale-95"
                style={{ background: "var(--foreground)", color: "var(--background)" }}
              >
                Falar Agora
              </a>
              <button
                className="md:hidden size-8 flex items-center justify-center rounded-full border border-border"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-20 px-8 pb-12"
            style={{ background: "var(--background)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Logo mobile */}
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-full.png"
                alt="Devnix"
                width={200}
                height={58}
                className={`object-contain transition-all duration-300${mounted && !isDark ? " brightness-0" : ""}`}
                style={{ height: "auto" }}
              />
            </div>
            <nav className="flex flex-col mt-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-5xl font-black py-3 border-b border-border hover:text-muted-foreground transition-colors"
                  style={{ letterSpacing: "-0.03em" }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto">
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase"
                style={{ background: "var(--foreground)", color: "var(--background)" }}
              >
                Falar Agora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


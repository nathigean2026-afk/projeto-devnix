"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"

// Corner bracket SVG
function Corner({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M1 13V1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SignInPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error: err } = await authClient.signIn.email({ email, password })
    if (err) {
      setError("E-mail ou senha inválidos. Tente novamente.")
      setLoading(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  const isDark = !mounted || resolvedTheme === "dark"

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(242,242,242,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Card with corner brackets */}
        <div className="relative">
          {/* Corner brackets */}
          <Corner className="absolute -top-px -left-px text-muted-foreground/50" />
          <Corner className="absolute -top-px -right-px text-muted-foreground/50 rotate-90" />
          <Corner className="absolute -bottom-px -left-px text-muted-foreground/50 -rotate-90" />
          <Corner className="absolute -bottom-px -right-px text-muted-foreground/50 rotate-180" />

          <div
            className="rounded-2xl border border-border px-8 py-9"
            style={{ background: "var(--card)" }}
          >
            {/* Badge label */}
            <div className="flex items-center gap-2 mb-7">
              <span
                className="size-1.5 rounded-full animate-pulse"
                style={{ background: "var(--foreground)" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "var(--muted-foreground)" }}
              >
                Painel Interno&nbsp;·&nbsp;Devnix
              </span>
            </div>

            {/* Title */}
            <div className="mb-7">
              <h1
                className="text-3xl font-black leading-tight"
                style={{ letterSpacing: "-0.04em", color: "var(--foreground)" }}
              >
                Acesso{" "}
                <span
                  className="inline-block border-b-2 pb-0.5"
                  style={{ borderColor: "var(--foreground)" }}
                >
                  restrito.
                </span>
              </h1>
              <p
                className="text-sm mt-2 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Ambiente dedicado à administração.
                <br />
                Entre com suas credenciais para continuar.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: "var(--muted-foreground)" }}
                  htmlFor="email"
                >
                  <Mail className="size-3" />
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--secondary)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    // @ts-ignore
                    "--tw-ring-color": "var(--foreground)",
                  }}
                  placeholder="admin@devnix.com.br"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: "var(--muted-foreground)" }}
                  htmlFor="password"
                >
                  <Lock className="size-3" />
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border px-4 py-3 pr-12 text-sm transition focus:outline-none focus:ring-2"
                    style={{
                      background: "var(--secondary)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider uppercase transition-opacity hover:opacity-70"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? "ocultar" : "ver"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    borderColor: "rgba(239,68,68,0.2)",
                    color: "rgb(252,165,165)",
                  }}
                  role="alert"
                >
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold tracking-wide uppercase transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                      aria-hidden="true"
                    />
                    Entrando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="size-3.5" />
                    Entrar no painel
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-[10px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: "var(--muted-foreground)" }}
              >
                Sem conta de acesso?
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
              >
                Contas de administrador são criadas internamente.
              </p>
            </div>
          </div>
        </div>

        {/* Logo below card */}
        <div className="flex justify-center mt-8">
          <Image
            src="/logo-full.png"
            alt="Devnix"
            width={100}
            height={28}
            className={`object-contain transition-all duration-300 opacity-40 hover:opacity-70${!isDark ? " brightness-0" : ""}`}
            style={{ width: "auto", maxHeight: "24px" }}
            loading="eager"
            priority
          />
        </div>
      </div>
    </div>
  )
}

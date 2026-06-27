"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden dot-pattern"
      style={{ background: "var(--background)" }}
    >
      {/* Radial vignette — mesma do hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--background) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.055) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center gap-8">

        {/* Logo */}
        {mounted && (
          <div className="animate-fade-in">
            <Image
              src="/logo-full-dark.png"
              alt="Elevanthe"
              width={160}
              height={44}
              className="object-contain"
              style={{ width: "auto", maxHeight: "40px", mixBlendMode: "multiply" }}
              priority
            />
          </div>
        )}

        {/* CARD com neon-card sweep border — igual pricing */}
        <div className="neon-card neon-card-featured w-full rounded-2xl animate-scale-in">
          {/* Inner surface */}
          <div
            className="rounded-2xl px-8 py-9 flex flex-col gap-7"
            style={{ background: "var(--card)" }}
          >

            {/* Header */}
            <div className="flex flex-col gap-2">
              {/* Status pill */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ background: "#f2f2f2", boxShadow: "0 0 6px rgba(242,242,242,0.6)" }}
                  aria-hidden="true"
                />
                <span className="label-sm" style={{ color: "var(--muted-foreground)" }}>
                  Painel Interno
                </span>
              </div>

              <h1
                className="text-display"
                style={{ fontSize: "clamp(28px,5vw,36px)", color: "var(--foreground)" }}
              >
                Área restrita
              </h1>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Entre com suas credenciais para acessar o painel de gerenciamento.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "var(--border)" }} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-1.5 label-sm"
                  style={{ color: "var(--muted-foreground)" }}
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
                  placeholder="admin@elevanthe.com"
                  className="w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none"
                  style={{
                    background: "var(--secondary)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.07)"
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="flex items-center gap-1.5 label-sm"
                  style={{ color: "var(--muted-foreground)" }}
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all focus:outline-none"
                    style={{
                      background: "var(--secondary)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.07)"
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "var(--border)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-60"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm animate-fade-in"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    borderColor: "rgba(239,68,68,0.22)",
                    color: "#fca5a5",
                  }}
                  role="alert"
                >
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit — mesmo estilo do botão hero */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold tracking-[0.08em] uppercase transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                  letterSpacing: "0.1em",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                      aria-hidden="true"
                    />
                    Verificando...
                  </>
                ) : (
                  <>
                    Entrar no painel
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p
              className="text-center label-sm"
              style={{ color: "var(--muted-foreground)", opacity: 0.45 }}
            >
              Acesso restrito — credenciais gerenciadas internamente
            </p>
          </div>
        </div>

        {/* Tagline abaixo */}
        <p
          className="label-sm animate-fade-in delay-400"
          style={{ color: "var(--muted-foreground)", opacity: 0.3 }}
        >
          Elevanthe &mdash; Tecnologia que Eleva Negócios
        </p>
      </div>
    </div>
  )
}

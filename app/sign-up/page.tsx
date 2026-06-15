"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error: err } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    if (err) {
      setError(err.message ?? "Erro ao criar conta.")
      setLoading(false)
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Image
            src="/logo-full.png"
            alt="Devnix"
            width={160}
            height={46}
            className={`object-contain transition-all duration-300${mounted && resolvedTheme !== "dark" ? " brightness-0" : ""}`}
            style={{ height: "auto", maxHeight: "46px" }}
            loading="eager"
            priority
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-foreground mb-1 text-editorial">Criar conta admin</h1>
          <p className="text-muted-foreground text-sm mb-8">Crie o primeiro acesso administrativo da Devnix.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                placeholder="Seu nome" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                placeholder="admin@devnix.com.br" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                placeholder="Mínimo 8 caracteres" />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-foreground text-background font-semibold py-3 text-sm tracking-wide hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Já tem conta?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline">Entrar</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Devnix — Soluções Web Inteligentes
        </p>
      </div>
    </div>
  )
}

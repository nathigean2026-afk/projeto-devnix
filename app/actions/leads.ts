"use server"

import { db } from "@/lib/db"
import { leads, quotes } from "@/lib/db/schema"
import type { Quote, NewQuote, QuoteItem } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { randomBytes } from "crypto"

async function getGeoFromIp(ip: string): Promise<{ city: string; region: string; country: string; isp: string } | null> {
  try {
    // ip-api.com: gratuito, sem chave, retorna city/region/country/isp
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,regionName,country,isp`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    if (data.status !== "success") return null
    return { city: data.city, region: data.regionName, country: data.country, isp: data.isp }
  } catch {
    return null
  }
}

export async function submitLead(data: {
  name: string
  email: string
  phone?: string
  whatsapp?: string
  subject?: string
  message: string
  plan?: string
  turnstileToken?: string
}) {
  // Valida Turnstile apenas quando ambos secret e token estiverem presentes
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (secret && data.turnstileToken) {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: data.turnstileToken }),
    })
    const result = await res.json()
    if (!result.success) throw new Error("Turnstile verification failed")
  }

  // Captura IP real (Vercel seta x-forwarded-for)
  const hdrs = await headers()
  const rawIp = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? hdrs.get("x-real-ip")
    ?? null
  const ip = rawIp && rawIp !== "::1" && rawIp !== "127.0.0.1" ? rawIp : null
  const geo = ip ? await getGeoFromIp(ip) : null

  await db.insert(leads).values({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    whatsapp: data.whatsapp || null,
    subject: data.subject || null,
    message: data.message,
    plan: data.plan || null,
    status: "novo",
    ip,
    city: geo?.city ?? null,
    region: geo?.region ?? null,
    country: geo?.country ?? null,
    isp: geo?.isp ?? null,
  })

  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const wa = data.whatsapp?.replace(/\D/g, "") ?? ""
      await resend.emails.send({
        from: "Elevanthe <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `Novo lead: ${data.name} — ${data.subject ?? "Sem assunto"}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">Novo Lead Elevanthe</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Um novo cliente entrou em contato pelo site</p>
          </div>
          <div style="padding:28px 24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.05em;width:110px;">Nome</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-weight:600;">${data.name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:11px;text-transform:uppercase;">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;"><a href="mailto:${data.email}" style="color:#3b82f6;text-decoration:none;">${data.email}</a></td></tr>
              ${data.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:11px;text-transform:uppercase;">Telefone</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;">${data.phone}</td></tr>` : ""}
              ${data.whatsapp ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:11px;text-transform:uppercase;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;"><a href="https://wa.me/${wa}" style="color:#25d366;text-decoration:none;">${data.whatsapp}</a></td></tr>` : ""}
              ${data.plan ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:11px;text-transform:uppercase;">Plano</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;">${data.plan}</td></tr>` : ""}
              <tr><td style="padding:12px 0 0;color:#666;font-size:11px;text-transform:uppercase;vertical-align:top;">Mensagem</td><td style="padding:12px 0 0;line-height:1.7;color:#ccc;">${data.message}</td></tr>
            </table>
            <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap;">
              <a href="mailto:${data.email}" style="display:inline-block;padding:11px 22px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Responder por E-mail</a>
              ${wa ? `<a href="https://wa.me/${wa}" style="display:inline-block;padding:11px 22px;background:#25d366;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Abrir WhatsApp</a>` : ""}
            </div>
          </div>
          <div style="padding:14px 24px;border-top:1px solid #1a1a1a;text-align:center;color:#444;font-size:11px;">Elevanthe — Tecnologia que Eleva Negócios</div>
        </div>`,
      })
    } catch (err) {
      console.error("[Elevanthe] Erro ao enviar email de notificação:", err)
    }
  }

  revalidatePath("/admin")
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function getLeads() {
  await requireAdmin()
  return db.select().from(leads).orderBy(desc(leads.createdAt))
}

export async function markLeadRead(id: number) {
  await requireAdmin()
  await db.update(leads).set({ readAt: new Date(), status: "lido" }).where(eq(leads.id, id))
  revalidatePath("/admin")
}

export async function updateLeadStatus(id: number, status: string) {
  await requireAdmin()
  const updateData: { status: string; readAt?: Date } = { status }
  if (status !== "novo") updateData.readAt = new Date()
  await db.update(leads).set(updateData).where(eq(leads.id, id))
  revalidatePath("/admin")
}

export async function deleteLead(id: number) {
  await requireAdmin()
  await db.delete(leads).where(eq(leads.id, id))
  revalidatePath("/admin")
}

// ── Quote actions ─────────────────────────────────────────────────────────────

export async function getQuotes() {
  await requireAdmin()
  return db.select().from(quotes).orderBy(desc(quotes.createdAt))
}

export async function createQuote(data: Omit<NewQuote, "id" | "createdAt" | "updatedAt">) {
  await requireAdmin()
  const [row] = await db.insert(quotes).values({
    ...data,
    updatedAt: new Date(),
  }).returning()
  revalidatePath("/admin")
  return row
}

export async function updateQuote(id: number, data: Partial<Omit<NewQuote, "id" | "createdAt">>) {
  await requireAdmin()
  await db.update(quotes).set({ ...data, updatedAt: new Date() }).where(eq(quotes.id, id))
  revalidatePath("/admin")
}

export async function deleteQuote(id: number) {
  await requireAdmin()
  await db.delete(quotes).where(eq(quotes.id, id))
  revalidatePath("/admin")
}

export async function generateShareLink(id: number, expiresInDays: number) {
  await requireAdmin()
  const token = randomBytes(20).toString("hex")
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
  await db.update(quotes).set({
    shareToken: token,
    shareExpiresAt: expiresAt,
    updatedAt: new Date(),
  }).where(eq(quotes.id, id))
  revalidatePath("/admin")
  return token
}

// Rota pública — sem requireAdmin
export async function getQuoteByToken(token: string): Promise<Quote | null> {
  const [row] = await db.select().from(quotes).where(eq(quotes.shareToken, token))
  if (!row) return null
  if (row.shareExpiresAt && row.shareExpiresAt < new Date()) return null
  return row
}


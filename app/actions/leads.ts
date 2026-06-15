"use server"

import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function submitLead(data: {
  name: string
  email: string
  phone?: string
  whatsapp?: string
  subject?: string
  message: string
  plan?: string
}) {
  await db.insert(leads).values({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    whatsapp: data.whatsapp || null,
    subject: data.subject || null,
    message: data.message,
    plan: data.plan || null,
    status: "novo",
  })
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
  await db
    .update(leads)
    .set({ readAt: new Date(), status: "lido" })
    .where(eq(leads.id, id))
  revalidatePath("/admin")
}

export async function updateLeadStatus(id: number, status: string) {
  await requireAdmin()
  await db.update(leads).set({ status }).where(eq(leads.id, id))
  revalidatePath("/admin")
}

export async function deleteLead(id: number) {
  await requireAdmin()
  await db.delete(leads).where(eq(leads.id, id))
  revalidatePath("/admin")
}

"use server"

import { db } from "@/lib/db"
import { projects_db, type NewProject } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function getProjects() {
  return db.select().from(projects_db).orderBy(desc(projects_db.createdAt))
}

export async function getProjectBySlug(slug: string) {
  const rows = await db.select().from(projects_db).where(eq(projects_db.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function createProject(data: Omit<NewProject, "id" | "createdAt" | "updatedAt">) {
  await requireAdmin()
  await db.insert(projects_db).values({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  revalidatePath("/projetos")
  revalidatePath("/admin")
}

export async function updateProject(
  id: number,
  data: Partial<Omit<NewProject, "id" | "createdAt" | "updatedAt">>
) {
  await requireAdmin()
  await db
    .update(projects_db)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects_db.id, id))
  revalidatePath("/projetos")
  revalidatePath("/admin")
  if (data.slug) revalidatePath(`/projetos/${data.slug}`)
}

export async function deleteProject(id: number) {
  await requireAdmin()
  await db.delete(projects_db).where(eq(projects_db.id, id))
  revalidatePath("/projetos")
  revalidatePath("/admin")
}

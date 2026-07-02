// Funções de leitura puras — sem "use server" — seguras para uso em RSCs
import { db } from "./index"
import { projects_db } from "./schema"
import { asc, desc } from "drizzle-orm"

export async function queryProjects() {
  return db
    .select()
    .from(projects_db)
    .orderBy(asc(projects_db.sortOrder), desc(projects_db.createdAt))
}

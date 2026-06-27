/**
 * Script para criar o usuário administrador da Elevanthe.
 * Rode uma vez: node scripts/create-admin.mjs
 *
 * Defina as variáveis:
 *   ADMIN_EMAIL=seu@email.com
 *   ADMIN_PASSWORD=suasenha
 *   ADMIN_NAME="Seu Nome"
 */
import { createAuthClient } from "better-auth/client"

const email = process.env.ADMIN_EMAIL ?? "contato@elevanthe.com"
const password = process.env.ADMIN_PASSWORD ?? "nathigean10*"
const name = process.env.ADMIN_NAME ?? "Admin Elevanthe"

const baseURL = process.env.BETTER_AUTH_URL
  ?? process.env.V0_RUNTIME_URL
  ?? "http://localhost:3000"

const client = createAuthClient({ baseURL })

const { data, error } = await client.signUp.email({ email, password, name })

if (error) {
  console.error("Erro ao criar admin:", error.message)
  process.exit(1)
}

console.log("Admin criado com sucesso!")
console.log("ID:", data?.user?.id)
console.log("E-mail:", data?.user?.email)

import { betterAuth } from "better-auth"
import { Pool } from "pg"

const productionUrl = process.env.BETTER_AUTH_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  ?? process.env.V0_RUNTIME_URL
  ?? "http://localhost:3000"

const trustedOrigins = [
  productionUrl,
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  // Allow all v0 preview subdomains
  "https://*.vusercontent.net",
  "https://*.v0.app",
].filter(Boolean) as string[]

export const auth = betterAuth({
  baseURL: productionUrl,
  trustedOrigins,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  advanced: {
    // Required for cross-site iframe (v0 preview) AND wildcard origin support
    defaultCookieAttributes: { sameSite: "none", secure: true },
    crossSubDomainCookies: { enabled: true },
  },
})

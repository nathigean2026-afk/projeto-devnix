import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

// ── Better Auth tables ───────────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
})

// ── App tables ───────────────────────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  subject: text("subject"),
  message: text("message").notNull(),
  plan: text("plan"),
  status: text("status").notNull().default("novo"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  readAt: timestamp("readAt"),
  // Geolocalização
  ip: text("ip"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  isp: text("isp"),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert

// ── Quotes (Orçamentos) ───────────────────────────────────────────────────────
export type QuoteItem = {
  id: string
  name: string
  description?: string
  price: number          // preço original
  discount?: number      // desconto no item (valor em R$ ou %)
  discountType?: "fixed" | "percent"
  category?: string
}

export type QuotePaymentMethod = {
  method: "pix" | "boleto" | "cartao" | "transferencia"
  label: string
  value: number           // valor final nessa forma
  discount?: number       // desconto extra (%) para essa forma
  installments?: number   // parcelas (cartão)
  installmentValue?: number
}

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  // Cliente
  clientName: text("clientName").notNull(),
  clientEmail: text("clientEmail"),
  clientWhatsapp: text("clientWhatsapp"),
  // Contexto do projeto
  problem: text("problem"),
  objective: text("objective"),
  expectedResult: text("expectedResult"),
  deadline: text("deadline"),
  // Itens selecionados (array JSON)
  items: jsonb("items").notNull().default([]).$type<QuoteItem[]>(),
  total: integer("total").notNull().default(0),
  // Desconto global
  globalDiscount: integer("globalDiscount").notNull().default(0),
  globalDiscountType: text("globalDiscountType").notNull().default("fixed"),
  // Formas de pagamento
  paymentMethods: jsonb("paymentMethods").notNull().default([]).$type<QuotePaymentMethod[]>(),
  // Chave PIX para QR Code
  pixKeyType: text("pixKeyType"),  // cpf | cnpj | email | telefone | aleatoria
  pixKey: text("pixKey"),
  // Status
  status: text("status").notNull().default("rascunho"),
  // Link público compartilhável — orçamento
  shareToken: text("shareToken").unique(),
  shareExpiresAt: timestamp("shareExpiresAt"),
  // Link público compartilhável — ordem de serviço
  osShareToken: text("osShareToken").unique(),
  osShareExpiresAt: timestamp("osShareExpiresAt"),
  // Metadados
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert

// ── Projects table ───────────────────────────────────────────────────────────
// Each row stores a full project. JSON columns hold arrays of strings/objects.
export const projects_db = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  desc: text("desc").notNull(),
  cover: text("cover").notNull().default("saas"), // key in COVERS map
  // tech stack badges
  tech: jsonb("tech").notNull().default([]).$type<string[]>(),
  // challenge / solution / results
  challenge: text("challenge"),
  solution: text("solution"),
  results: jsonb("results").notNull().default([]).$type<string[]>(),
  duration: text("duration"),
  // full stack list
  stack: jsonb("stack").notNull().default([]).$type<string[]>(),
  // optional live url
  liveUrl: text("liveUrl"),
  // before/after: stored as JSON { before: url, after: url } or null
  beforeAfter: jsonb("beforeAfter").$type<{ before: string; after: string } | null>(),
  // gallery screenshots: [{ src, caption }]
  screenshots: jsonb("screenshots").notNull().default([]).$type<{ src: string; caption: string }[]>(),
  // layout hint for homepage grid
  col: text("col").default(""),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export type ProjectRow = typeof projects_db.$inferSelect
export type NewProject = typeof projects_db.$inferInsert

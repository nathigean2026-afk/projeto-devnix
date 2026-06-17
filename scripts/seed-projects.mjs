import pg from "pg"
const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const projects = [
  {
    slug: "maktub-barbearia",
    title: "Maktub Barbearia",
    category: "Site + Sistema de Gestão",
    desc: "Site público com agendamento online + painel admin completo com CRM, fluxo de caixa, analytics e auditoria.",
    cover: "barbearia",
    tech: ["Next.js 16", "Neon PostgreSQL", "Better Auth"],
    col: "lg:col-span-2",
    liveUrl: "https://v0-maktubebarbearia.vercel.app",
    beforeAfter: { before: "/images/maktub-before.png", after: "/images/maktub-after.png" },
    challenge: "A Maktub Barbearia operava com um site básico em Python/Flask sem visual profissional, agendamentos feitos exclusivamente por WhatsApp e zero visibilidade sobre receita, clientes recorrentes ou performance do negócio.",
    solution: "Sistema completo em Next.js 16 com dois mundos: site público (agendamento passo a passo, galeria de cortes, cardápio de serviços, mapa) e painel admin autenticado com dashboard de KPIs, CRM de clientes, fluxo de caixa, analytics com gráficos e log de auditoria.",
    results: ["Agendamento 100% online — zero dependência do WhatsApp", "Painel admin com CRM, caixa e analytics em tempo real", "Autenticação segura com Better Auth + roles admin/barbeiro", "Banco de dados PostgreSQL no Neon com Drizzle ORM", "Deploy automatizado na Vercel com CI/CD"],
    duration: "2 semanas",
    stack: ["Next.js 16", "TypeScript", "Neon (PostgreSQL)", "Drizzle ORM", "Better Auth", "Tailwind CSS v4", "shadcn/ui", "Recharts", "Vercel"],
    screenshots: [],
  },
  {
    slug: "plataforma-saas-gestao",
    title: "Plataforma SaaS de Gestão",
    category: "Software Personalizado",
    desc: "Sistema completo com dashboard analítico, controle de estoque, vendas e relatórios em tempo real.",
    cover: "saas",
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
    col: "lg:col-span-2",
    challenge: "Uma empresa de médio porte precisava substituir planilhas desorganizadas por um sistema centralizado que permitisse múltiplos usuários, controle de estoque em tempo real e geração automática de relatórios gerenciais.",
    solution: "Desenvolvemos uma plataforma SaaS multi-tenant com autenticação por papéis (admin, gestor, operador), dashboard com gráficos em tempo real via WebSocket, módulo de estoque com alertas automáticos e relatórios exportáveis em PDF e Excel.",
    results: ["Redução de 70% no tempo de geração de relatórios", "Visibilidade em tempo real do estoque", "Acesso simultâneo de 50+ usuários", "Código-fonte 100% entregue ao cliente"],
    duration: "4 meses",
    stack: ["Next.js 14", "TypeScript", "PostgreSQL", "Drizzle ORM", "WebSocket", "Recharts", "PDF generation"],
    screenshots: [
      { src: "/images/saas-screen-1.png", caption: "Dashboard principal com KPIs e gráfico de receita" },
      { src: "/images/saas-screen-2.png", caption: "Módulo de controle de estoque e produtos" },
      { src: "/images/saas-screen-3.png", caption: "Analytics de vendas por período e categoria" },
    ],
  },
  {
    slug: "ecommerce-moda",
    title: "E-commerce de Moda",
    category: "Loja Virtual",
    desc: "Loja com catálogo, carrinho, checkout e painel admin completo — código entregue.",
    cover: "ecommerce",
    tech: ["React", "Stripe", "Node.js"],
    col: "",
    challenge: "Uma marca de moda independente precisava de uma loja online que transmitisse sua identidade visual única, suportasse pagamentos seguros e tivesse um painel admin intuitivo para gerenciar produtos e pedidos sem depender de terceiros.",
    solution: "E-commerce completo com catálogo filtrado por categoria/tamanho/cor, carrinho persistente, checkout com Stripe, rastreamento de pedidos e painel admin para cadastro de produtos com upload de imagens múltiplas.",
    results: ["Lançamento em 2 meses", "Taxa de conversão 3x acima da média do segmento", "Painel admin sem necessidade de desenvolvedor", "Código-fonte e infraestrutura do cliente"],
    duration: "2 meses",
    stack: ["React", "Node.js", "Stripe", "MongoDB", "Cloudinary", "Tailwind CSS"],
    screenshots: [
      { src: "/images/ecommerce-screen-1.png", caption: "Homepage com hero e vitrine de produtos" },
      { src: "/images/ecommerce-screen-2.png", caption: "Página de produto com seletor de tamanho e cor" },
      { src: "/images/ecommerce-screen-3.png", caption: "Painel admin de gestão de pedidos" },
    ],
  },
  {
    slug: "dashboard-analitico",
    title: "Dashboard Analítico",
    category: "Plataforma Analítica",
    desc: "BI com gráficos em tempo real, múltiplas fontes de dados e exportação de relatórios.",
    cover: "dashboard",
    tech: ["React", "D3.js", "SQL"],
    col: "",
    challenge: "Um grupo empresarial com múltiplas filiais precisava consolidar dados de diferentes sistemas legados (ERP, CRM, planilhas) em uma única visão executiva, com atualização em tempo real e exportação para apresentações.",
    solution: "Dashboard analítico com conectores para 5 fontes de dados distintas, normalização e cache inteligente, visualizações interativas com D3.js e Recharts, filtros por período/filial/produto e exportação em PDF/Excel.",
    results: ["Consolidação de 5 sistemas em 1 painel", "Atualização a cada 5 minutos automaticamente", "Relatórios executivos em 1 clique", "Adoção imediata pelo time de diretores"],
    duration: "3 meses",
    stack: ["React", "D3.js", "PostgreSQL", "Python (ETL)", "Redis", "FastAPI"],
    screenshots: [
      { src: "/images/dashboard-screen-1.png", caption: "Visão executiva com KPIs consolidados de todas as filiais" },
      { src: "/images/dashboard-screen-2.png", caption: "Análise comparativa entre filiais e exportação de relatórios" },
    ],
  },
  {
    slug: "portal-imobiliario",
    title: "Portal Imobiliário",
    category: "Site Profissional",
    desc: "Portal com busca avançada, mapa interativo, tour virtual e CRM integrado.",
    cover: "portal",
    tech: ["Next.js", "Mapbox", "Prisma"],
    col: "",
    challenge: "Uma imobiliária regional queria digitalizar toda sua operação: substituir o atendimento por WhatsApp por um portal moderno com busca georreferenciada, tour virtual dos imóveis e CRM próprio para gestão de leads.",
    solution: "Portal imobiliário completo com mapa Mapbox interativo, filtros avançados por preço/bairro/tipo, galeria de fotos com tour 360°, sistema de agendamento de visitas e CRM para acompanhamento de cada lead do funil.",
    results: ["500+ imóveis cadastrados no lançamento", "Tempo médio de resposta reduzido de 6h para 15min", "Tour virtual reduziu visitas desnecessárias em 40%", "SEO resultou em 3x mais tráfego orgânico"],
    duration: "5 meses",
    stack: ["Next.js", "Mapbox GL", "Prisma", "PostgreSQL", "AWS S3", "Pannellum (360°)"],
    screenshots: [
      { src: "/images/portal-screen-1.png", caption: "Busca de imóveis com filtros avançados e grid de resultados" },
      { src: "/images/portal-screen-2.png", caption: "Página do imóvel com galeria, mapa e agendamento de visita" },
    ],
  },
  {
    slug: "landing-page-saas",
    title: "Landing Page SaaS",
    category: "Landing Page",
    desc: "Página de alta conversão com animações, depoimentos, preços e formulário integrado.",
    cover: "landing",
    tech: ["Next.js", "Framer Motion"],
    col: "",
    challenge: "Uma startup SaaS precisava de uma landing page que comunicasse claramente o valor do produto, transmitisse credibilidade para potenciais clientes corporativos e convertesse visitantes em leads qualificados para o time de vendas.",
    solution: "Landing page com animações suaves em Framer Motion, seção de pricing dinâmica com toggle mensal/anual, depoimentos com carrossel, FAQ interativo, formulário de demo com integração ao CRM e rastreamento de conversões.",
    results: ["Taxa de conversão de 8,4% (média do setor: 2-3%)", "Tempo no site aumentou 2,5x vs. versão anterior", "Leads qualificados cresceram 120% no primeiro mês", "Core Web Vitals 100 no Lighthouse"],
    duration: "3 semanas",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS", "HubSpot API", "Vercel Analytics"],
    screenshots: [
      { src: "/images/landing-screen-1.png", caption: "Hero section com CTA de alta conversão" },
      { src: "/images/landing-screen-2.png", caption: "Seção de pricing com planos e toggle mensal/anual" },
    ],
  },
  {
    slug: "blog-especializado",
    title: "Blog Especializado",
    category: "Blog & Conteúdo",
    desc: "Plataforma com CMS headless, SEO otimizado, categorias e pesquisa full-text.",
    cover: "blog",
    tech: ["Next.js", "MDX", "Algolia"],
    col: "lg:col-span-2",
    challenge: "Um especialista em finanças pessoais queria publicar conteúdo de forma independente, sem depender de plataformas como Medium ou WordPress, com controle total sobre SEO, monetização e design.",
    solution: "Blog com CMS headless em Markdown/MDX, geração estática via Next.js para máxima performance, pesquisa full-text com Algolia, sistema de categorias e tags, newsletter integrada, monetização com Google AdSense e planos pagos.",
    results: ["Score 98+ no Lighthouse em todas as métricas", "Indexação no Google em menos de 48h", "Newsletter com 2.000+ assinantes em 3 meses", "Tempo de carregamento médio: 0.8s"],
    duration: "6 semanas",
    stack: ["Next.js", "MDX", "Algolia", "Resend", "Stripe (planos pagos)", "Vercel Edge"],
    screenshots: [
      { src: "/images/blog-screen-1.png", caption: "Homepage com artigo em destaque e grid de posts" },
      { src: "/images/blog-screen-2.png", caption: "Página de artigo com tipografia otimizada e sidebar" },
    ],
  },
]

for (const p of projects) {
  await pool.query(
    `INSERT INTO projects (slug, title, category, "desc", cover, tech, col, "liveUrl", "beforeAfter", challenge, solution, results, duration, stack, screenshots)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (slug) DO NOTHING`,
    [p.slug, p.title, p.category, p.desc, p.cover, JSON.stringify(p.tech), p.col ?? "", p.liveUrl ?? null, p.beforeAfter ? JSON.stringify(p.beforeAfter) : null, p.challenge ?? null, p.solution ?? null, JSON.stringify(p.results), p.duration ?? null, JSON.stringify(p.stack), JSON.stringify(p.screenshots)]
  )
  console.log("Seeded:", p.slug)
}

await pool.end()
console.log("Done")

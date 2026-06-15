import { Globe, Code2, BarChart3, Layout, ShoppingCart, Wrench, BookOpen, Smartphone } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Sites Profissionais",
    desc: "Do institucional ao e-commerce. Responsivo, rápido e com SEO otimizado desde o primeiro commit.",
  },
  {
    icon: Code2,
    title: "Software Personalizado",
    desc: "Você tem o problema — eu analiso e construo a solução exata. Nada genérico, tudo sob medida.",
  },
  {
    icon: BarChart3,
    title: "Plataformas Analíticas",
    desc: "Dashboards em tempo real, relatórios interativos e BI para decisões mais rápidas.",
  },
  {
    icon: Layout,
    title: "Landing Pages",
    desc: "Páginas de alta conversão para campanhas, lançamentos e captação de leads.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Lojas virtuais completas com carrinho, pagamento e painel admin — código entregue.",
  },
  {
    icon: BookOpen,
    title: "Blogs & Conteúdo",
    desc: "Plataformas de blog com CMS integrado, SEO avançado e estrutura escalável.",
  },
  {
    icon: Smartphone,
    title: "Projetos Pré-prontos",
    desc: "Templates prontos adaptados ao seu banco de dados. Rápido, econômico, sob mensalidade.",
  },
  {
    icon: Wrench,
    title: "Manutenção & Suporte",
    desc: "Atualizações, correções e melhorias com preço combinado. Sem surpresas.",
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="relative py-28">
      {/* Radial bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(74,222,128,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-green-400 tracking-[0.15em] uppercase mb-4">
            — Serviços
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Tudo que você precisa{" "}
              <br className="hidden sm:block" />
              para <span className="text-green-400">ter sucesso online</span>.
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Código-fonte original sempre incluso. Você tem total domínio sobre o que foi construído.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="service-card group relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4 cursor-default"
              >
                <div className="size-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-green-400/30 group-hover:bg-green-400/[0.06] transition-all duration-300">
                  <Icon className="size-5 text-zinc-400 group-hover:text-green-400 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

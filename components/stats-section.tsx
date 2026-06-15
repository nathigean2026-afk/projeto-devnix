export function StatsSection() {
  const stats = [
    { value: "+50", label: "Projetos Entregues" },
    { value: "100%", label: "Satisfação dos Clientes" },
    { value: "+5", label: "Anos de Experiência" },
    { value: "24h", label: "Suporte Responsivo" },
  ]

  return (
    <section className="relative py-8 border-y border-white/[0.06]">
      {/* Subtle glow border top */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.25), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.15), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.06]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 gap-1">
              <span className="text-4xl md:text-5xl font-bold text-white text-glow tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-zinc-500 font-medium text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

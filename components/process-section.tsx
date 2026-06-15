import { MessageSquare, Code2, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Consultoria",
    desc: "Entendemos o seu problema, objetivos e orçamento. Sem compromisso e sem enrolação. A solução certa começa aqui.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Desenvolvimento",
    desc: "Construção focada, com atualizações constantes. Você acompanha cada etapa e pode solicitar ajustes durante o processo.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Lançamento",
    desc: "Entrego o projeto funcionando e o código-fonte é seu. Suporte pós-lançamento e manutenção conforme combinado.",
  },
]

export function ProcessSection() {
  return (
    <section id="processo" className="relative py-28">
      {/* Top divider glow */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.15), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-green-400 tracking-[0.15em] uppercase mb-4">
            — Como funciona
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            Seu caminho para um{" "}
            <span className="text-green-400">site profissional</span>.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-[38px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, rgba(74,222,128,0.4), rgba(74,222,128,0.1), rgba(74,222,128,0.4))",
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative flex flex-col items-start md:items-center md:text-center gap-5 px-0 md:px-8">
                {/* Step circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className="size-[72px] rounded-full border border-green-400/30 bg-zinc-900 flex flex-col items-center justify-center gap-0.5"
                    style={{
                      boxShadow: "0 0 25px rgba(74,222,128,0.12), 0 0 50px rgba(74,222,128,0.05)",
                    }}
                  >
                    <Icon className="size-5 text-green-400" />
                    <span className="text-[10px] font-bold text-zinc-500 font-mono">{step.number}</span>
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-full border border-green-400/15 animate-pulse-glow"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export type GlossaryCategory =
  | "Marketing & Vendas"
  | "Finanças"
  | "Gestão & Estratégia"
  | "Operações & Qualidade"
  | "Produto & Cliente"

export type GlossaryTerm = {
  slug: string
  term: string
  category: GlossaryCategory
  what: string
  practice: string
  why: string
  related: string[]
}

export const CATEGORY_COLORS: Record<GlossaryCategory, { dot: string; badge: string }> = {
  "Marketing & Vendas":    { dot: "#6366f1", badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  "Finanças":              { dot: "#22c55e", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  "Gestão & Estratégia":   { dot: "#eab308", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  "Operações & Qualidade": { dot: "#f97316", badge: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  "Produto & Cliente":     { dot: "#ec4899", badge: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
}

// Light-theme badge variants (used inline)
export const CATEGORY_COLORS_LIGHT: Record<GlossaryCategory, string> = {
  "Marketing & Vendas":    "#6366f1",
  "Finanças":              "#16a34a",
  "Gestão & Estratégia":   "#ca8a04",
  "Operações & Qualidade": "#ea580c",
  "Produto & Cliente":     "#db2777",
}

export const glossaryTerms: GlossaryTerm[] = [
  // ── FINANÇAS ────────────────────────────────────────────
  {
    slug: "break-even",
    term: "Break-even — Ponto de Equilíbrio",
    category: "Finanças",
    what: "O nível de receita em que a empresa não tem lucro nem prejuízo. Tudo acima é lucro.",
    practice:
      "Seus custos fixos somam R$ 200 mil/mês, margem de contribuição é 50%. Break-even = R$ 400 mil de receita. Acima disso, cada real é lucro.",
    why: "Saber o break-even é saber quanto precisa vender pra dormir tranquilo.",
    related: ["Margem de Contribuição", "Burn Rate"],
  },
  {
    slug: "burn-rate",
    term: "Burn Rate",
    category: "Finanças",
    what: "Quanto a empresa queima de caixa por mês quando gasta mais do que recebe.",
    practice:
      "Sua startup tem R$ 600 mil no caixa e gasta R$ 100 mil/mês a mais do que fatura. Burn rate = R$ 100 mil/mês.",
    why: "Controlar o burn é controlar o prazo que você tem pra crescer ou virar rentável.",
    related: ["Runway", "Fluxo de Caixa"],
  },
  {
    slug: "ebitda",
    term: "EBITDA",
    category: "Finanças",
    what: "O lucro da operação antes de descontar juros, impostos e depreciação. Mostra a saúde do negócio em si.",
    practice:
      "Sua empresa fatura R$ 10 milhões, custos operacionais somam R$ 7 milhões. EBITDA = R$ 3 milhões. É o que sobra antes de gastos financeiros e contábeis.",
    why: "Investidores e bancos olham EBITDA pra decidir se você é financiável. Ele reflete o negócio, não o financiamento.",
    related: ["Margem de Contribuição", "Fluxo de Caixa"],
  },
  {
    slug: "fluxo-de-caixa",
    term: "Fluxo de Caixa",
    category: "Finanças",
    what: "O movimento real de entradas e saídas de dinheiro da empresa num período.",
    practice:
      "Em março entraram R$ 500 mil (vendas recebidas) e saíram R$ 470 mil (folha, fornecedores, impostos). Caixa positivo de R$ 30 mil. Note: vender R$ 800 mil em março não significa receber em março.",
    why: "Empresa quebra por falta de caixa, não por falta de lucro.",
    related: ["Burn Rate", "Capital de Giro", "Runway"],
  },
  {
    slug: "margem-de-contribuicao",
    term: "Margem de Contribuição",
    category: "Finanças",
    what: "Quanto sobra de cada venda depois de tirar os custos variáveis (que mudam com cada unidade vendida).",
    practice:
      "Você vende um produto por R$ 100, gasta R$ 40 com matéria-prima e comissão. Margem de contribuição = R$ 60 (60%). Esses R$ 60 cobrem custo fixo e geram lucro.",
    why: "Mostra quanto cada venda contribui pra pagar a conta da empresa. Margem baixa exige volume alto.",
    related: ["Break-even — Ponto de Equilíbrio", "EBITDA"],
  },
  {
    slug: "payback",
    term: "Payback",
    category: "Finanças",
    what: "O tempo que leva pra um investimento se pagar.",
    practice:
      "Você gasta R$ 2 mil pra adquirir um cliente que paga R$ 500/mês. Payback = 4 meses. Em SaaS, payback abaixo de 12 meses é considerado saudável.",
    why: "Payback longo trava caixa e limita o quanto você pode crescer com recursos próprios.",
    related: ["CAC — Custo de Aquisição de Cliente", "LTV — Lifetime Value", "ROI — Retorno sobre Investimento"],
  },
  {
    slug: "roi",
    term: "ROI — Retorno sobre Investimento",
    category: "Finanças",
    what: "Quanto você ganhou em relação ao que gastou. Mede se um investimento valeu a pena.",
    practice:
      "Você gastou R$ 20 mil numa campanha e gerou R$ 80 mil em receita. ROI = (80 − 20) / 20 = 300%. Cada real investido virou três de lucro.",
    why: "Sem ROI, você decide por achismo. Com ROI, você corta o que dá prejuízo e dobra o que dá retorno.",
    related: ["Payback", "EBITDA", "KPI — Indicador Chave de Performance"],
  },
  {
    slug: "runway",
    term: "Runway",
    category: "Finanças",
    what: "Quantos meses sua empresa aguenta com o caixa atual, mantendo o burn rate.",
    practice:
      "Você tem R$ 1,8 milhão no caixa e queima R$ 150 mil/mês. Runway = 12 meses. Se em 12 meses não virar break-even ou captar mais, fecha.",
    why: "Define com que urgência você precisa crescer ou cortar custos.",
    related: ["Burn Rate", "Fluxo de Caixa", "Break-even — Ponto de Equilíbrio"],
  },
  {
    slug: "margens-negativas",
    term: "Margens Negativas",
    category: "Finanças",
    what: "Quando o custo de produzir ou entregar um produto é maior do que o preço cobrado. Você perde dinheiro em cada venda.",
    practice:
      "Você cobra R$ 80 por um serviço que custa R$ 95 pra executar. Margem = -R$ 15. Crescer assim acelera o rombo: quanto mais vende, mais perde.",
    why: "Margem negativa é a armadilha silenciosa. Muita empresa cresce em faturamento e quebra ao mesmo tempo.",
    related: ["Margem de Contribuição", "Break-even — Ponto de Equilíbrio", "EBITDA"],
  },
  {
    slug: "rentabilidade",
    term: "Rentabilidade",
    category: "Finanças",
    what: "Relação entre o lucro gerado e o capital investido ou a receita obtida. Mede a eficiência financeira do negócio.",
    practice:
      "Você investe R$ 500 mil no negócio e gera R$ 75 mil de lucro líquido no ano. Rentabilidade = 15% ao ano. Comparar com a taxa Selic revela se o negócio compensa o risco.",
    why: "Faturamento alto não é sinônimo de rentabilidade. Negócio rentável é o que sobra depois de pagar tudo.",
    related: ["ROI — Retorno sobre Investimento", "Margem de Contribuição", "EBITDA"],
  },

  // ── MARKETING & VENDAS ──────────────────────────────────
  {
    slug: "crm",
    term: "CRM — Gestão de Relacionamento com Cliente",
    category: "Marketing & Vendas",
    what: "Software (e processo) que centraliza histórico de cada cliente e lead: contatos, conversas, pedidos, oportunidades.",
    practice:
      "Vendedor abre o CRM e vê: o cliente comprou em 2022, abriu chamado em janeiro, pediu cotação em março. Em vez de 'como posso ajudar?', começa a conversa do ponto certo.",
    why: "Memória organizacional vale ouro. Sem CRM, o vendedor que sair leva metade do relacionamento na cabeça.",
    related: ["Pipeline de Vendas", "Customer Success"],
  },
  {
    slug: "churn",
    term: "Churn",
    category: "Marketing & Vendas",
    what: "A taxa de clientes que cancelam o serviço num período.",
    practice:
      "Você tinha 200 clientes em janeiro. Em fevereiro, 10 cancelaram. Churn mensal = 5%. Parece pouco, mas em 12 meses você perde 60% da base se não substituir.",
    why: "Churn alto é balde furado. Você enche de cliente novo e a base não cresce.",
    related: ["LTV — Lifetime Value", "Customer Success", "Onboarding", "NPS — Net Promoter Score"],
  },
  {
    slug: "funil-de-vendas",
    term: "Funil de Vendas",
    category: "Marketing & Vendas",
    what: "O caminho que um lead percorre, do primeiro contato até virar cliente, dividido em etapas.",
    practice:
      "1.000 visitantes no site → 100 viram lead → 30 são qualificados → 10 fecham. Cada etapa é menor que a anterior, daí o nome funil.",
    why: "Mostra onde você está perdendo gente e em qual etapa precisa investir esforço.",
    related: ["Lead", "MQL e SQL — Leads Qualificados", "Pipeline de Vendas", "Taxa de Conversão"],
  },
  {
    slug: "icp",
    term: "ICP — Perfil de Cliente Ideal",
    category: "Marketing & Vendas",
    what: "A descrição da empresa que mais se beneficia do seu produto e fica mais tempo com você.",
    practice:
      "Sua SaaS funciona melhor com indústrias de 50 a 200 funcionários, faturamento entre R$ 10 e 50 milhões, com setor financeiro estruturado. Fora disso, você converte menos e o cliente cancela mais rápido.",
    why: "Vender pra quem não é seu ICP gasta o dobro e dura metade.",
    related: ["Persona", "Churn", "Product-Market Fit"],
  },
  {
    slug: "lead",
    term: "Lead",
    category: "Marketing & Vendas",
    what: "Pessoa ou empresa que demonstrou interesse no que você vende e deixou alguma forma de contato.",
    practice:
      "Alguém baixou seu e-book em troca do email, pediu uma demonstração ou preencheu um formulário pedindo proposta. Não é cliente ainda, mas pode virar.",
    why: "Lead é o combustível do funil. Sem entrada de leads, não tem venda no fim.",
    related: ["Funil de Vendas", "MQL e SQL — Leads Qualificados", "Inbound Marketing", "Outbound Marketing"],
  },
  {
    slug: "ltv",
    term: "LTV — Lifetime Value",
    category: "Marketing & Vendas",
    what: "Quanto de receita um cliente gera, em média, durante todo o tempo que fica com você.",
    practice:
      "Ticket mensal de R$ 1 mil, cliente fica 24 meses em média: LTV = R$ 24 mil. Comparado a um CAC de R$ 2 mil, a relação é 12x — saudável (acima de 3x já é bom).",
    why: "Mostra até quanto você pode investir pra adquirir cliente sem perder dinheiro.",
    related: ["CAC — Custo de Aquisição de Cliente", "Churn", "MRR e ARR — Receita Recorrente"],
  },
  {
    slug: "pipeline-de-vendas",
    term: "Pipeline de Vendas",
    category: "Marketing & Vendas",
    what: "A lista de oportunidades em aberto que seus vendedores estão trabalhando, organizada por etapa.",
    practice:
      "O pipeline tem 30 oportunidades em 'Proposta enviada' totalizando R$ 600 mil e 12 em 'Negociação' somando R$ 280 mil. Você consegue prever quanto vai entrar nos próximos 60 dias.",
    why: "Pipeline saudável é receita previsível. Pipeline magro é demissão à vista.",
    related: ["Funil de Vendas", "MQL e SQL — Leads Qualificados", "CRM — Gestão de Relacionamento com Cliente"],
  },
  {
    slug: "seo",
    term: "SEO — Otimização para Buscadores",
    category: "Marketing & Vendas",
    what: "Conjunto de técnicas que faz seu site aparecer no topo do Google quando alguém busca algo relacionado ao seu negócio.",
    practice:
      "Você publica um artigo sobre 'como reduzir CAC' otimizado pra essa busca. Em alguns meses, ele rankeia, recebe visitas grátis todo dia e gera leads sem você pagar por clique.",
    why: "Tráfego de SEO é cumulativo: o que você publicou ano passado ainda traz cliente hoje.",
    related: ["Inbound Marketing", "Lead"],
  },
  {
    slug: "up-sell-cross-sell",
    term: "Up-sell e Cross-sell",
    category: "Marketing & Vendas",
    what: "Up-sell é vender um plano maior pro mesmo cliente. Cross-sell é vender um produto complementar.",
    practice:
      "Cliente está no plano básico de R$ 500/mês. Up-sell: subir pro plano premium de R$ 1.500. Cross-sell: vender um módulo extra de R$ 300. Em ambos, o CAC é zero.",
    why: "Cliente atual é o que vende mais barato. Quem ignora up/cross-sell deixa dinheiro em cima da mesa.",
    related: ["Ticket Médio", "LTV — Lifetime Value", "Customer Success"],
  },

  // ── GESTÃO & ESTRATÉGIA ─────────────────────────────────
  {
    slug: "benchmarking",
    term: "Benchmarking",
    category: "Gestão & Estratégia",
    what: "Comparar suas práticas com os melhores do mercado pra aprender com eles.",
    practice:
      "Sua taxa de conversão é 1,5%. O benchmark do setor é 3,2%. Você estuda os líderes e adapta o que funciona pra sua realidade.",
    why: "Sem referência externa, você melhora no vácuo. Benchmark conecta esforço com resultado real.",
    related: ["KPI — Indicador Chave de Performance", "SWOT — Análise FOFA"],
  },
  {
    slug: "cultura-organizacional",
    term: "Cultura Organizacional",
    category: "Gestão & Estratégia",
    what: "O conjunto de valores, comportamentos e normas que define como sua empresa opera no dia a dia.",
    practice:
      "Cultura forte aparece em coisas concretas: como se contrata, como se demite, o que é elogiado em reunião, o que é tolerado. Não está num quadro na parede, está nos hábitos.",
    why: "Estratégia perde pra cultura. Se a cultura não sustenta o plano, o plano não sai do papel.",
    related: ["OKR — Objetivos e Resultados-Chave", "Stakeholder"],
  },
  {
    slug: "kpi",
    term: "KPI — Indicador Chave de Performance",
    category: "Gestão & Estratégia",
    what: "A métrica que você acompanha pra saber se está atingindo um objetivo importante.",
    practice:
      "Objetivo: dobrar a receita em 1 ano. KPIs: número de leads/mês, taxa de conversão, ticket médio. Cada um aponta se você está no caminho.",
    why: "Sem KPI, você navega de olhos fechados. Com KPI errado, segue na direção errada com confiança.",
    related: ["OKR — Objetivos e Resultados-Chave", "ROI — Retorno sobre Investimento", "Taxa de Conversão"],
  },
  {
    slug: "pdca",
    term: "PDCA",
    category: "Gestão & Estratégia",
    what: "Ciclo de melhoria contínua: Planejar (Plan), Executar (Do), Checar (Check), Agir (Act).",
    practice:
      "Plan: aumentar conversão da landing em 30 dias. Do: testa nova headline. Check: mediu, conversão subiu de 2% pra 2,8%. Act: padroniza a mudança e parte pro próximo teste.",
    why: "Resolve problema com método em vez de achismo. Funciona em qualquer área.",
    related: ["5W2H", "Taxa de Conversão", "Six Sigma"],
  },
  {
    slug: "swot",
    term: "SWOT — Análise FOFA",
    category: "Gestão & Estratégia",
    what: "Matriz de análise estratégica: Forças, Fraquezas, Oportunidades e Ameaças.",
    practice:
      "Forças: produto sólido. Fraquezas: time comercial pequeno. Oportunidades: concorrente saiu do mercado. Ameaças: novo regulamento. Combina forças com oportunidades pra agir.",
    why: "Força você a olhar a empresa com honestidade antes de decidir movimento estratégico.",
    related: ["Benchmarking", "Cadeia de Valor"],
  },
  {
    slug: "5w2h",
    term: "5W2H",
    category: "Gestão & Estratégia",
    what: "Checklist de planejamento com 7 perguntas: O quê, Por quê, Onde, Quando, Quem, Como e Quanto.",
    practice:
      "Plano de ação pra reduzir churn. O quê? Implementar onboarding. Por quê? Cliente cancela no 2º mês. Onde? No CS. Quando? Próximos 30 dias. Quem? Maria. Como? Reuniões semanais. Quanto? R$ 5 mil.",
    why: "Reunião sem 5W2H vira intenção. Com 5W2H, vira plano.",
    related: ["PDCA", "OKR — Objetivos e Resultados-Chave", "Kanban"],
  },
  {
    slug: "matriz-bcg",
    term: "Matriz BCG",
    category: "Gestão & Estratégia",
    what: "Ferramenta de análise de portfólio que classifica produtos ou unidades de negócio em 4 quadrantes: Estrela, Vaca Leiteira, Ponto de Interrogação e Abacaxi.",
    practice:
      "Seu produto A tem alta participação de mercado e alto crescimento (Estrela — invista). O produto B tem alta participação mas cresce pouco (Vaca Leiteira — extraia caixa). O produto C cresce mas você tem pouca fatia (Interrogação — decida se entra ou sai). O produto D: baixo crescimento, baixa fatia (Abacaxi — elimine).",
    why: "Ajuda a distribuir capital entre produtos com critério, em vez de tratar todos igual.",
    related: ["SWOT — Análise FOFA", "KPI — Indicador Chave de Performance", "Rentabilidade"],
  },
  {
    slug: "analise-pvm",
    term: "Análise PVM — Preço, Volume e Mix",
    category: "Gestão & Estratégia",
    what: "Técnica que decompõe a variação de receita em três fatores: mudança de preço, mudança de volume vendido e mudança no mix de produtos.",
    practice:
      "Sua receita caiu R$ 200 mil vs. o mês anterior. A análise PVM revela: preço +R$ 50 mil (você subiu tabela), volume -R$ 300 mil (vendeu menos unidades), mix +R$ 50 mil (vendeu mais produtos premium). O problema é volume, não preço.",
    why: "Sem PVM, você trata a queda de receita com remédio errado. Com PVM, você age na causa real.",
    related: ["KPI — Indicador Chave de Performance", "Margem de Contribuição", "Curva ABC"],
  },

  // ── OPERAÇÕES & QUALIDADE ───────────────────────────────
  {
    slug: "jit",
    term: "JIT — Just in Time",
    category: "Operações & Qualidade",
    what: "Sistema de produção em que insumos chegam exatamente quando vão ser usados, eliminando estoque parado.",
    practice:
      "Em vez de manter 30 dias de matéria-prima no galpão, você combina com o fornecedor entrega semanal exata. Capital de giro liberado, menos espaço, menos perda.",
    why: "Estoque parado é dinheiro parado. JIT bem feito libera caixa que pode ir pra crescer.",
    related: ["Lean", "Capital de Giro", "Supply Chain — Cadeia de Suprimentos"],
  },
  {
    slug: "kanban",
    term: "Kanban",
    category: "Operações & Qualidade",
    what: "Sistema visual de gestão de tarefas com colunas (geralmente 'A fazer', 'Fazendo', 'Feito') e cartões.",
    practice:
      "Quadro com 3 colunas. Cada tarefa é um cartão. Equipe puxa cartão da esquerda pra direita conforme avança. Limita quantos cartões podem estar em 'Fazendo' pra evitar gargalo.",
    why: "Torna o trabalho visível. O que é invisível não é gerenciado.",
    related: ["Lean", "PDCA", "5W2H"],
  },
  {
    slug: "lead-time",
    term: "Lead Time",
    category: "Operações & Qualidade",
    what: "O tempo total entre o pedido do cliente e a entrega final.",
    practice:
      "Cliente pede um móvel sob medida. Lead time = 30 dias (10 de produção, 5 de acabamento, 15 de transporte). Reduzir pra 20 dias é vantagem competitiva real.",
    why: "Cliente prefere quem entrega rápido. Lead time menor é vendas a mais sem mudar preço.",
    related: ["Supply Chain — Cadeia de Suprimentos", "JIT — Just in Time", "Produtividade"],
  },
  {
    slug: "lean",
    term: "Lean",
    category: "Operações & Qualidade",
    what: "Filosofia de gestão focada em eliminar desperdício e entregar mais valor com menos recurso.",
    practice:
      "Sua equipe gasta 4 horas/semana fazendo um relatório que ninguém lê. Lean diz: corta. Cada hora poupada é hora aplicada em algo que o cliente percebe.",
    why: "Empresas enxutas reagem mais rápido. Empresas inchadas viram lentas e caras.",
    related: ["Kanban", "Six Sigma", "JIT — Just in Time", "Produtividade"],
  },
  {
    slug: "produtividade",
    term: "Produtividade",
    category: "Operações & Qualidade",
    what: "Relação entre o que se produz e os recursos usados pra produzir. Quanto mais saída por hora ou real investido, mais produtivo.",
    practice:
      "Equipe de 5 pessoas atende 200 chamados/dia. Com novo software, atende 350 sem aumentar equipe. Produtividade subiu 75%.",
    why: "Crescer sem aumentar custo é o caminho mais curto pra aumentar margem.",
    related: ["Lean", "Escalabilidade", "Six Sigma"],
  },
  {
    slug: "six-sigma",
    term: "Six Sigma",
    category: "Operações & Qualidade",
    what: "Metodologia de redução de defeitos em processos, baseada em dados, mirando 3,4 defeitos por milhão de oportunidades.",
    practice:
      "Sua linha de produção tem 2% de defeito. Six Sigma usa estatística pra achar a causa raiz, eliminar variação e levar a falha pra perto de zero.",
    why: "Defeito é custo escondido (retrabalho, devolução, reputação). Reduzir defeito é margem direta.",
    related: ["Lean", "PDCA", "Produtividade"],
  },
  {
    slug: "controle-de-validade",
    term: "Controle de Validade",
    category: "Operações & Qualidade",
    what: "Processo de rastreamento dos prazos de vencimento de produtos em estoque, garantindo que nada seja vendido ou usado fora da validade.",
    practice:
      "Uma distribuidora de alimentos usa o método FEFO (First Expired, First Out): o produto que vence primeiro sai primeiro. Sistema alerta automaticamente quando há itens a 30, 15 e 7 dias do vencimento.",
    why: "Produto vencido é prejuízo duplo: perda do custo e risco de responsabilidade legal. Controle rigoroso elimina perda silenciosa.",
    related: ["Controle de Estoque Parado", "Curva ABC", "JIT — Just in Time"],
  },
  {
    slug: "controle-de-estoque-parado",
    term: "Controle de Estoque Parado",
    category: "Operações & Qualidade",
    what: "Identificação e gestão de itens que ficam sem movimentação por um período determinado, consumindo capital e espaço sem gerar retorno.",
    practice:
      "Após análise, você descobre que 30% dos SKUs não saem há 90 dias, representando R$ 200 mil parados. Ação: promoção direcionada, devolução ao fornecedor ou write-off contábil para liberar espaço e caixa.",
    why: "Estoque parado é capital morto. Cada real em produto que não gira é um real que não financia crescimento.",
    related: ["Curva ABC", "JIT — Just in Time", "Controle de Validade"],
  },
  {
    slug: "curva-abc",
    term: "Curva ABC",
    category: "Operações & Qualidade",
    what: "Classificação de itens (produtos, clientes, fornecedores) em três grupos por grau de importância: A (mais críticos, ~20% que representam ~80% do resultado), B (intermediários) e C (menos relevantes).",
    practice:
      "Você tem 500 SKUs. A análise revela: 50 produtos (A) respondem por 78% do faturamento, 100 produtos (B) por 15% e 350 produtos (C) por 7%. Concentre atenção em A, gerencie B e revise se C compensa.",
    why: "Sem Curva ABC, você trata cliente R$ 500 mil/ano igual ao de R$ 2 mil. Priorizar o que move a agulha é a base da eficiência operacional.",
    related: ["Controle de Estoque Parado", "KPI — Indicador Chave de Performance", "Produtividade"],
  },
  {
    slug: "analise-rfm",
    term: "Análise RFM",
    category: "Operações & Qualidade",
    what: "Método de segmentação de clientes baseado em três dimensões: Recência (há quanto tempo comprou), Frequência (quantas vezes comprou) e Valor Monetário (quanto gastou).",
    practice:
      "Você pontua cada cliente de 1 a 5 em cada dimensão. Cliente com R=5, F=5, M=5 é seu campeão — merece tratamento VIP e programa de fidelidade. Cliente R=1, F=1, M=1 está prestes a sair — acione reativação urgente.",
    why: "RFM transforma base de clientes em mapa de oportunidades. Ação certa pro cliente certo no momento certo.",
    related: ["Churn", "LTV — Lifetime Value", "Customer Success", "CRM — Gestão de Relacionamento com Cliente"],
  },

  // ── PRODUTO & CLIENTE ───────────────────────────────────
  {
    slug: "customer-success",
    term: "Customer Success",
    category: "Produto & Cliente",
    what: "Área focada em garantir que o cliente alcance o resultado prometido pelo produto, prevenindo cancelamento.",
    practice:
      "Após a venda, o CS faz onboarding, acompanha uso, resolve atritos e avisa quando vê risco de churn antes do cliente reclamar. Ativo, não reativo.",
    why: "Cliente que tem sucesso fica, indica e gasta mais. CS bem feito multiplica LTV sem multiplicar CAC.",
    related: ["Onboarding", "Churn", "NPS — Net Promoter Score", "LTV — Lifetime Value"],
  },
  {
    slug: "jornada-do-cliente",
    term: "Jornada do Cliente",
    category: "Produto & Cliente",
    what: "O caminho completo que o cliente percorre, desde antes de conhecer sua marca até virar promotor (ou cancelar).",
    practice:
      "Etapas: descoberta, consideração, decisão, uso, expansão, advocacia. Em cada etapa, você desenha a experiência ideal.",
    why: "Quem entende a jornada toda intervém nos pontos certos. Quem só pensa em venda, perde tudo depois dela.",
    related: ["Onboarding", "Customer Success", "Persona"],
  },
  {
    slug: "mvp",
    term: "MVP — Produto Mínimo Viável",
    category: "Produto & Cliente",
    what: "A versão mais simples do produto que já entrega valor pro cliente e pode ser testada no mercado real.",
    practice:
      "Você quer lançar uma plataforma com 20 funcionalidades. MVP: lança com as 3 que resolvem o problema central. Testa, aprende, evolui. Em vez de 12 meses, sai em 6 semanas.",
    why: "Acelera aprendizado. Muito produto morre porque foi construído inteiro antes de saber se alguém queria.",
    related: ["Product-Market Fit", "Lean", "PDCA"],
  },
]

// Build letter index
export function buildLetterIndex(terms: GlossaryTerm[]) {
  const map: Record<string, GlossaryTerm[]> = {}
  for (const t of terms) {
    const letter = t.term[0].toUpperCase()
    if (!map[letter]) map[letter] = []
    map[letter].push(t)
  }
  return map
}

export const CATEGORIES = Array.from(
  new Set(glossaryTerms.map((t) => t.category))
) as GlossaryCategory[]

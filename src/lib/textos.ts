import type { Lingua } from "./idioma";

/** Dicionário de interface. O conteúdo dos apoios vive em `apoios-en.ts`. */
export const TEXTOS: Record<string, { pt: string; en: string }> = {
  // ===== Cabeçalho =====
  temaClaroAria: { pt: "Ativar modo claro", en: "Switch to light mode" },
  temaEscuroAria: { pt: "Ativar modo escuro", en: "Switch to dark mode" },
  temaClaroTitulo: { pt: "Modo claro", en: "Light mode" },
  temaEscuroTitulo: { pt: "Modo escuro", en: "Dark mode" },
  linguaAria: { pt: "Mudar para inglês", en: "Switch to Portuguese" },

  // ===== Página principal =====
  guiaApoios: { pt: "Guia de Apoios Sociais", en: "Social Benefits Guide" },
  tooltipInfo: {
    pt: "Informação de fontes oficiais. As respostas orientam a pesquisa, mas não confirmam o direito aos apoios.",
    en: "Information from official sources. These answers guide your search but do not confirm entitlement to benefits.",
  },
  sobreInfo: { pt: "Sobre esta informação", en: "About this information" },
  filtrosRapidos: { pt: "Filtros rápidos", en: "Quick filters" },
  filtrarTemas: { pt: "Filtrar por área temática", en: "Filter by topic area" },
  maisFiltros: { pt: "Mais filtros", en: "More filters" },
  limparFiltros: { pt: "Limpar filtros", en: "Clear filters" },
  fIdade: { pt: "Quantos anos tem?", en: "How old are you?" },
  idadePlaceholder: { pt: "Idade", en: "Age" },
  anos: { pt: "anos", en: "years" },
  exemploIdade: { pt: "Ex.: 22", en: "e.g. 22" },
  fHabitacao: { pt: "Como é a sua habitação?", en: "What is your housing situation?" },
  habitacaoArrendada: { pt: "Arrendada com contrato", en: "Rented with a contract" },
  habitacaoPropria: { pt: "Casa própria", en: "Own home" },
  fFilhos: { pt: "Tem filhos a cargo?", en: "Do you have dependent children?" },
  filhosSim: { pt: "Sim", en: "Yes" },
  filhosNao: { pt: "Não", en: "No" },
  filhosMonoparental: { pt: "Família monoparental", en: "Single-parent family" },
  fTemas: { pt: "Áreas de apoio", en: "Support areas" },
  fDistrito: { pt: "Onde vive?", en: "Where do you live?" },
  todosDistritos: { pt: "Todos os distritos", en: "All districts" },
  fAgregado: { pt: "Quantas pessoas vivem em sua casa?", en: "How many people live in your home?" },
  pessoas: { pt: "pessoas", en: "people" },
  exemploAgregado: { pt: "Ex.: 3", en: "e.g. 3" },
  fRendimento: {
    pt: "Quanto entra, por ano, em sua casa?",
    en: "How much comes in per year, in your home?",
  },
  exemploRendimento: { pt: "Ex.: 12 000", en: "e.g. 12,000" },
  notaRendimentoPrefix: {
    pt: "Rendimento bruto antes dos descontos. O IAS vale",
    en: "Gross income before deductions. The IAS is worth",
  },
  notaRendimentoSufixo: { pt: "em 2026.", en: "in 2026." },
  maisFiltrosAria: { pt: "Mais filtros", en: "More filters" },
  apoiosRecomendados: { pt: "Apoios recomendados", en: "Recommended benefits" },
  apoiosExplorar: { pt: "Apoios a explorar", en: "Benefits to explore" },
  possivelApoio1: {
    pt: "possível apoio que pode aplicar-se",
    en: "possible benefit may apply",
  },
  possivelApoios: {
    pt: "possíveis apoios que podem aplicar-se",
    en: "possible benefits may apply",
  },
  contagemCatalogo: { pt: "apoios no catálogo total", en: "benefits in the full catalogue" },
  verDescartados: {
    pt: "Ver apoios descartados pelos filtros",
    en: "Show benefits excluded by the filters",
  },
  verTodos: { pt: "Todos", en: "All" },
  verMenos: { pt: "Mostrar menos", en: "Show less" },
  descartadosNota: {
    pt: "Estes apoios não são compatíveis com a sua idade, situação profissional ou composição da casa.",
    en: "These benefits are not compatible with your age, work situation or household composition.",
  },
  podeAplicar: {
    pt: "Pode aplicar-se · confirmar condições",
    en: "May apply to you · check the conditions",
  },
  naoCorresponde: { pt: "Não corresponde ao perfil", en: "Not a match for this profile" },
  valorEstimado: { pt: "valor estimado", en: "estimated amount" },
  condicoesTitulo: { pt: "Condições a confirmar", en: "Conditions to confirm" },
  excertoOficial: { pt: "Excerto oficial sincronizado", en: "Official excerpt synced" },
  atualizadoEm: { pt: "atualizado em", en: "updated on" },
  fontePrefix: { pt: "Fonte:", en: "Source:" },
  consultadaEm: { pt: "Consultada em", en: "Consulted on" },
  saberMais: { pt: "Saber mais na fonte oficial", en: "Learn more at the official source" },
  fichaGov: { pt: "Ficha sincronizada em gov.pt", en: "Record synced from gov.pt" },
  notaConteudoOficial: {
    pt: "Os apoios descobertos automaticamente apresentam o conteúdo oficial em português.",
    en: "Benefits discovered automatically show the official content in Portuguese.",
  },

  // ===== Situações e temas (rótulos; os valores de filtragem mantêm-se em português) =====
  situacaoEstudante: { pt: "Estudante", en: "Student" },
  situacaoTrabalhador: { pt: "Trabalhador", en: "Worker" },
  situacaoDesempregado: { pt: "Desempregado", en: "Unemployed" },
  situacaoReformado: { pt: "Reformado", en: "Retired" },
  temaTodos: { pt: "Todos", en: "All" },
  temaCatalogo: { pt: "Catálogo Principal", en: "Main catalogue" },
  "temaSubsídios e Prestações": { pt: "Subsídios e Prestações", en: "Benefits and Allowances" },
  "temaFamília e Crianças": { pt: "Família e Crianças", en: "Family and Children" },
  "temaPensões e Reforma": { pt: "Pensões e Reforma", en: "Pensions and Retirement" },
  "temaAção Social": { pt: "Ação Social", en: "Social Action" },
  "temaEducação e Juventude": { pt: "Educação e Juventude", en: "Education and Youth" },
  temaHabitação: { pt: "Habitação", en: "Housing" },
  "temaComplementos Sociais": { pt: "Complementos Sociais", en: "Social Supplements" },
  "temaDeficiência e Inclusão": { pt: "Deficiência e Inclusão", en: "Disability and Inclusion" },
  "temaEmprego e Desemprego": { pt: "Emprego e Desemprego", en: "Employment and Unemployment" },
  "temaFamília e Parentalidade": { pt: "Família e Parentalidade", en: "Family and Parenting" },
  "temaDependência e Cuidadores": { pt: "Dependência e Cuidadores", en: "Dependency and Carers" },
  "temaEnergia e Serviços Essenciais": {
    pt: "Energia e Serviços Essenciais",
    en: "Energy and Essential Services",
  },
  distritoAcores: { pt: "Região Autónoma dos Açores", en: "Azores (Autonomous Region)" },
  distritoMadeira: { pt: "Região Autónoma da Madeira", en: "Madeira (Autonomous Region)" },

  // ===== Pesquisa gov.pt =====
  pesquisaGovTitulo: {
    pt: "Procurar outros serviços e apoios em gov.pt",
    en: "Search for other services and benefits on gov.pt",
  },
  pesquisaGovDesc: {
    pt: "Pesquise diretamente no catálogo público do portal gov.pt para encontrar outras medidas, licenças ou apoios específicos.",
    en: "Search the public catalogue of gov.pt directly to find other measures, licences or specific benefits.",
  },
  termoPesquisaAria: { pt: "Termo a pesquisar em gov.pt", en: "Search term for gov.pt" },
  placeholderPesquisa: {
    pt: "Ex.: parentalidade, arrendamento, bolsa, deficiência",
    en: "e.g. parenting, renting, grant, disability",
  },
  pesquisarGov: { pt: "Pesquisar em gov.pt", en: "Search gov.pt" },
  aPesquisar: { pt: "A pesquisar...", en: "Searching..." },
  abrirFicha: { pt: "Abrir ficha oficial em gov.pt", en: "Open the official record on gov.pt" },
  semResultados: {
    pt: "Não foram encontrados serviços em gov.pt para essa pesquisa.",
    en: "No services were found on gov.pt for that search.",
  },
  sugestaoHabitação: { pt: "Habitação", en: "Housing" },
  sugestaoParentalidade: { pt: "Parentalidade", en: "Parenting" },
  sugestaoDeficiência: { pt: "Deficiência", en: "Disability" },
  sugestaoBolsaDeEstudo: { pt: "Bolsa de estudo", en: "Study grant" },

  // ===== Rodapé =====
  footerTagline: {
    pt: "Um guia rápido e anónimo para descobrir os apoios do Estado português.",
    en: "A quick, anonymous guide to discovering Portuguese state benefits.",
  },
  sede: { pt: "Sede", en: "Head office" },
  explorarTitulo: { pt: "Explorar", en: "Explore" },
  explorarApoios: { pt: "Apoios a explorar", en: "Benefits to explore" },
  explorarFaq: { pt: "Perguntas e respostas", en: "Questions and answers" },
  explorarFontes: { pt: "Fontes oficiais", en: "Official sources" },
  explorarPrivacidade: { pt: "Política de Privacidade", en: "Privacy Policy" },
  faleConnosco: { pt: "Fale connosco", en: "Get in touch" },
  mensagemAria: { pt: "A sua mensagem", en: "Your message" },
  mensagemPlaceholder: { pt: "Escreva a sua mensagem…", en: "Write your message…" },
  enviarEmail: { pt: "Enviar por email", en: "Send by email" },
  emailAssunto: { pt: "Contacto WeHelp", en: "WeHelp contact" },
  emailLinha1: {
    pt: "Abre o seu programa de email com a mensagem pronta a enviar",
    en: "Opens your email program with the message ready to send",
  },
  emailOu: { pt: "ou", en: "or" },
  emailLinha3: { pt: "entre em contacto connosco através de", en: "get in touch with us at" },
  sigaNos: { pt: "Siga-nos", en: "Follow us" },
  direitos: {
    pt: "© 2026 WeHelp. Todos os direitos reservados.",
    en: "© 2026 WeHelp. All rights reserved.",
  },

  // ===== Páginas =====
  voltar: { pt: "Voltar", en: "Back" },
  faqTitulo: { pt: "Perguntas e respostas", en: "Questions and answers" },
  faqDesc: {
    pt: "Tudo o que precisa de saber sobre o IAS e sobre como ler os resultados do WeHelp.",
    en: "Everything you need to know about the IAS and how to read your WeHelp results.",
  },
  duvidasTitulo: { pt: "Ainda tem dúvidas?", en: "Still have questions?" },
  duvidasDesc: {
    pt: "Consulte as perguntas e respostas para esclarecer como funciona o guia, o que é o IAS e como interpretar os apoios apresentados.",
    en: "Check the questions and answers to understand how the guide works, what the IAS is and how to read the benefits presented.",
  },
  duvidasBotao: {
    pt: "Ir para perguntas e respostas",
    en: "Go to questions and answers",
  },
  iasFaqTitulo: { pt: "Dúvidas frequentes", en: "Frequently asked questions" },
  iasQ1: {
    pt: "O que é o IAS e quanto vale em 2026?",
    en: "What is the IAS and what is it worth in 2026?",
  },
  iasSignifica: { pt: "significa", en: "means" },
  iasNomeCompleto: {
    pt: "Indexante dos Apoios Sociais",
    en: "Indexante dos Apoios Sociais (the State's social support reference index)",
  },
  iasExplica: {
    pt: "É um valor de referência que o Estado usa para calcular montantes de prestações e alguns limites de acesso.",
    en: "It is a reference value the State uses to calculate benefit amounts and some eligibility thresholds.",
  },
  iasEm: { pt: "Em", en: "In" },
  iasVigor: { pt: "desde 1 de janeiro.", en: "since 1 January." },
  iasExemploLimite: { pt: "Por exemplo, um limite de", en: "For example, a limit of" },
  iasCorrespondeA: { pt: "corresponde a", en: "corresponds to" },
  iasArredondado: {
    pt: "arredondado aos cêntimos. São exemplos de conversão, não valores que todos recebem.",
    en: "rounded to the cent. These are conversion examples, not amounts everyone receives.",
  },
  iasNaoSalario: {
    pt: "O IAS não é o salário mínimo nem um pagamento automático. Cada apoio tem as suas próprias regras: o limite pode ser mensal, anual, por pessoa ou para toda a casa.",
    en: "The IAS is not the minimum wage and no payment is automatic. Each benefit has its own rules: the threshold may be monthly, annual, per person or for the whole household.",
  },
  consultarOficial: {
    pt: "Consultar o valor oficial · Portaria n.º 480-A/2025/1",
    en: "See the official value · Portaria n.º 480-A/2025/1",
  },
  iasQ2: {
    pt: "Estes resultados confirmam que tenho direito?",
    en: "Do these results confirm my entitlement?",
  },
  iasResposta2: {
    pt: "Não. São apoios que podem aplicar-se ao seu caso. As respostas ajudam a orientar, mas faltam informações como descontos para a Segurança Social, património, filhos, incapacidade ou contrato de arrendamento. Em cada apoio encontra as condições a confirmar e a ligação à fonte oficial. O rendimento bruto anual da casa não substitui o cálculo legal de recursos de cada apoio.",
    en: "No. These are benefits that may apply to your situation. The answers help point you in the right direction, but information such as Social Security contributions, assets, children, disability or a rental contract is missing. Each benefit lists the conditions to confirm and the link to its official source. The household's gross annual income does not replace the legal resource calculation of each benefit.",
  },
  fontesTitulo: { pt: "Fontes oficiais", en: "Official sources" },
  fontesDesc: {
    pt: "O WeHelp orienta a pesquisa, mas a informação que conta é a das fontes oficiais. Confirme sempre as condições, os montantes e os prazos nestes portais antes de pedir um apoio.",
    en: "WeHelp points you in the right direction, but the information that counts is that of the official sources. Always confirm the conditions, amounts and deadlines on these portals before applying.",
  },
  fonteSegNome: { pt: "Segurança Social", en: "Social Security" },
  fonteSegDesc: {
    pt: "Guias práticos e condições de acesso às prestações sociais (abono, RSI, pensões, desemprego).",
    en: "Practical guides and access conditions for social benefits (child benefit, RSI, pensions, unemployment).",
  },
  fonteGovNome: { pt: "gov.pt", en: "gov.pt" },
  fonteGovDesc: {
    pt: "Portal dos serviços públicos, com os formulários e prazos de cada pedido.",
    en: "The public services portal, with the forms and deadlines for each application.",
  },
  fonteCidadaoNome: { pt: "Portal do Cidadão", en: "Citizen Portal" },
  fonteCidadaoDesc: {
    pt: "Serviços digitais do Estado e informação sobre direitos e apoios.",
    en: "Digital public services and information on rights and benefits.",
  },
  fonteDgesNome: { pt: "DGES — Bolsas de estudo", en: "DGES — Study grants" },
  fonteDgesDesc: {
    pt: "Regulamento e candidatura às bolsas de estudo do ensino superior.",
    en: "Rules and application for higher education study grants.",
  },
  privBadge: { pt: "Privacidade em primeiro lugar", en: "Privacy first" },
  privTitulo: { pt: "Política de Privacidade", en: "Privacy Policy" },
  privDesc: {
    pt: "O WeHelp foi desenhado para ser anónimo desde o primeiro clique. Esta página explica, de forma simples, como tratamos (e sobretudo como não tratamos) os seus dados.",
    en: "WeHelp was designed to be anonymous from the first click. This page simply explains how we handle (and above all how we do not handle) your data.",
  },
  priv1Titulo: { pt: "Triagem anónima", en: "Anonymous screening" },
  priv1Texto: {
    pt: "As respostas que dá no questionário (idade, distrito, situação profissional, agregado familiar e rendimento) são usadas apenas no seu navegador para calcular os apoios que podem aplicar-se. Não são enviadas para nenhum servidor nem guardadas por nós.",
    en: "The answers you give in the questionnaire (age, district, work situation, household size and income) are used only in your browser to work out which benefits may apply. They are not sent to any server and we do not store them.",
  },
  priv2Titulo: { pt: "Sem contas nem identificação", en: "No accounts and no identification" },
  priv2Texto: {
    pt: "O WeHelp não pede nome, email, login nem qualquer dado de identificação. Não usamos cookies de rastreamento nem ferramentas de análise que o identifiquem pessoalmente.",
    en: "WeHelp does not ask for your name, email, login or any identifying data. We use no tracking cookies and no analytics tools that identify you personally.",
  },
  priv3Titulo: { pt: "Contacto por email", en: "Contact by email" },
  priv3Texto: {
    pt: 'Se nos contactar através da caixa "Fale connosco", a mensagem é enviada a partir do seu próprio programa de email para contacto@wehelp.pt. Nesse caso, ficamos com o seu endereço de email apenas para responder ao seu pedido.',
    en: 'If you contact us through the "Get in touch" box, the message is sent from your own email program to contacto@wehelp.pt. In that case we keep your email address only to reply to your request.',
  },
  priv4Titulo: { pt: "Ligações externas", en: "External links" },
  priv4Texto: {
    pt: "Os cartões de apoio e as fontes oficiais ligam a sites externos (por exemplo Segurança Social, gov.pt e DGES). Esses sites têm as suas próprias políticas de privacidade, que deve consultar.",
    en: "Benefit cards and official sources link to external sites (such as Social Security, gov.pt and DGES). Those sites have their own privacy policies, which you should consult.",
  },
  priv5Titulo: { pt: "Alterações a esta política", en: "Changes to this policy" },
  priv5Texto: {
    pt: "Se esta política mudar, a versão atualizada fica disponível nesta página. Última atualização: outubro de 2026.",
    en: "If this policy changes, the updated version will be available on this page. Last updated: October 2026.",
  },

  // ===== Verificação de acumulação (stack) =====
  stackAdicionarAria: {
    pt: "Adicionar à verificação de acumulação",
    en: "Add to the stacking check",
  },
  stackRemoverAria: {
    pt: "Remover da verificação de acumulação",
    en: "Remove from the stacking check",
  },
  stackTitulo: { pt: "Verificação de acumulação", en: "Stacking check" },
  stackLimpar: { pt: "Limpar seleção", en: "Clear selection" },
  stackRemoverChip: { pt: "Remover da seleção", en: "Remove from selection" },
  stackTudoOk: {
    pt: "Não foram detetadas incompatibilidades nas regras verificadas. Isto não confirma que estes apoios possam ser acumulados.",
    en: "No incompatibilities were found in the checked rules. This does not confirm that these benefits can be combined.",
  },
  stackPerfilTitulo: {
    pt: "Incompatíveis para a mesma pessoa",
    en: "Incompatible for the same person",
  },
  stackPorConfirmar: {
    pt: "Combinações por confirmar junto das entidades competentes",
    en: "Combinations to confirm with the relevant authorities",
  },
  stackFonte: { pt: "Fonte oficial", en: "Official source" },
  stackConflitoTitulo: { pt: "Não podem ser acumulados", en: "These cannot be combined" },
  stackDependenciaTitulo: { pt: "Pré-requisito por confirmar", en: "Prerequisite to confirm" },
  stackSugestao: { pt: "Sugestão", en: "Suggestion" },
  stackBaseLegal: { pt: "Base legal", en: "Legal basis" },
  stackForaPerfil: { pt: "fora do seu perfil atual", en: "outside your current profile" },
  stackAviso: {
    pt: "Verificação para a mesma pessoa e o mesmo período. Apoios de outros membros da casa podem ter regras diferentes. Selecionar um apoio não prova que já o recebe; a decisão final cabe à entidade competente.",
    en: "Check for the same person and period. Benefits for other household members may follow different rules. Selecting a benefit does not prove you receive it; the relevant authority makes the final decision.",
  },

  // ===== Packs de apoios =====
  packsTitulo: {
    pt: "Packs de apoios combinados",
    en: "Combined benefit bundles",
  },
  packsDescricao: {
    pt: "Conjuntos de apoios legais que podem ser pedidos em conjunto e fazem sentido para diferentes fases da vida.",
    en: "Groups of state benefits that can legally be claimed together and make sense for different life stages.",
  },
  packsDisponiveis: { pt: "packs recomendados", en: "recommended bundles" },
  packApoiosIncluidos: { pt: "Apoios incluídos no pack", en: "Benefits included in this bundle" },
  packAdicionarTodos: { pt: "Adicionar pack à verificação", en: "Add bundle to check" },
  packRemoverTodos: { pt: "Remover pack da verificação", en: "Remove bundle from check" },
  packCompativelTag: { pt: "100% compatíveis entre si", en: "100% compatible with each other" },
  packVerificado: { pt: "Sem conflitos legais", en: "No legal conflicts" },
  packApoiosContagem: { pt: "apoios combinados", en: "combined benefits" },
  apoiosContagemCurta: { pt: "apoios", en: "benefits" },
};

/** Devolve o texto da chave no idioma ativo, com fallback para português. */
export function tx(lingua: Lingua, chave: string): string {
  const entrada = TEXTOS[chave];
  if (!entrada) return chave;
  return entrada[lingua] ?? entrada.pt;
}

/** Rótulo de um tema do catálogo (chave = tema em português, como vem do scraper). */
export function rotuloTema(lingua: Lingua, tema: string): string {
  if (tema === "Todos") return tx(lingua, "temaTodos");
  if (tema === "Catálogo Principal") return tx(lingua, "temaCatalogo");
  return tx(lingua, `tema${tema}`);
}

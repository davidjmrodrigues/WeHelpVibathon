/**
 * Módulo de Gestão da Wishlist e Motor de Compatibilidade entre Apoios Sociais
 *
 * Princípios de Engenharia e Regras de Negócio:
 * - Operação exclusivamente no cliente (browser/node) sem dependência de base de dados externa;
 * - Respeito integral pela privacidade absoluta (nenhum dado pessoal ou identificador é persistido em servidores);
 * - Deteção precoce de conflitos legais mútuos (exclusividade de acumulação) e dependências obrigatórias;
 * - Fornece suporte a "Packs de Apoios" (conjuntos populares, consistentes e pré-validados).
 */

export type TipoConflito = "incompatibilidade_legal" | "dependencia_em_falta";

export interface ConflitoApoio {
  tipo: "incompatibilidade_legal";
  apoioA: string;
  apoioB: string;
  motivo: string;
  baseLegal?: string;
  sugestao: string;
}

export interface DependenciaEmFalta {
  tipo: "dependencia_em_falta";
  apoioId: string;
  requerApoioId: string;
  motivo: string;
}

export interface ResultadoValidacaoWishlist {
  valida: boolean;
  conflitos: ConflitoApoio[];
  dependenciasEmFalta: DependenciaEmFalta[];
  totalApoios: number;
  apoiosIdentificados: string[];
}

export interface ItemWishlist {
  id: string;
  adicionadoEm: string;
  origem?: "individual" | "pack";
  packOrigemId?: string;
}

export interface Wishlist {
  itens: ItemWishlist[];
  atualizadoEm: string;
}

export interface PackApoios {
  id: string;
  nome: string;
  descricao: string;
  publicoAlvo: string;
  apoioIds: string[];
  destaque?: boolean;
}

interface RegraIncompatibilidade {
  idA: string;
  idB: string;
  motivo: string;
  baseLegal?: string;
  sugestao: string;
}

interface RegraDependencia {
  apoioId: string;
  requerApoios: string[]; // requer pelo menos um destes apoios
  motivo: string;
}

/**
 * Matriz oficial de regras de exclusividade / incompatibilidade legal na Segurança Social e Estado Português
 */
export const REGRAS_INCOMPATIBILIDADE: RegraIncompatibilidade[] = [
  {
    idA: "psi",
    idB: "bonificacaodeficiencia",
    motivo:
      "A Prestação Social para a Inclusão (PSI) e a Bonificação por Deficiência do abono de família não podem ser acumuladas pelo mesmo titular.",
    baseLegal: "Decreto-Lei n.º 126-A/2017 e Guia Prático da Segurança Social (PSI).",
    sugestao:
      "Geralmente a PSI oferece um montante de referência mais abrangente para a autonomia; consulte o serviço competente para optar pela mais vantajosa.",
  },
  {
    idA: "pensaosocial",
    idB: "desemprego",
    motivo:
      "A Pensão Social de Velhice é incompatível com o Subsídio de Desemprego. Atingida a idade legal de velhice, cessa o subsídio de desemprego.",
    baseLegal: "Decreto-Lei n.º 220/2006 e regime jurídico de proteção no desemprego.",
    sugestao:
      "Se tiver idade de reforma e não reunir carreira contributiva, a Pensão Social de Velhice acompanhada do CES é a prestação de destino.",
  },
  {
    idA: "pensaosocial",
    idB: "desempregosocial",
    motivo:
      "A Pensão Social de Velhice não pode ser auferida em simultâneo com o Subsídio Social de Desemprego.",
    baseLegal: "Regulamento das Prestações Não Contributivas da Segurança Social.",
    sugestao: "Opte pela prestação adequada à sua idade definitiva de aposentação.",
  },
  {
    idA: "desemprego",
    idB: "desempregosocial",
    motivo:
      "O Subsídio de Desemprego (contributivo) e o Subsídio Social de Desemprego inicial destinam-se à mesma perda de rendimento e são regimes alternativos.",
    baseLegal: "Decreto-Lei n.º 220/2006.",
    sugestao:
      "O subsídio social de desemprego é apenas acionado se não cumprir o prazo de 360 dias do regime normal ou após o seu esgotamento (subsequente).",
  },
  {
    idA: "parentalinicial",
    idB: "parentalsocial",
    motivo:
      "O Subsídio Parental Inicial (contributivo) e o Subsídio Social Parental (não contributivo) são vias alternativas para a mesma licença de nascimento.",
    baseLegal: "Decreto-Lei n.º 91/2009 (Proteção social na parentalidade).",
    sugestao:
      "Se tiver pelo menos 6 meses de descontos registados tem direito ao regime contributivo pleno; o social destina-se a quem não tem garantia de descontos.",
  },
  {
    idA: "pensaoinvalidez",
    idB: "pensaosocial",
    motivo:
      "A Pensão de Invalidez do regime contributivo não acumula com a Pensão Social de Velhice não contributiva.",
    baseLegal: "Regime Geral de Segurança Social.",
    sugestao: "Mantenha a Pensão de Invalidez, que será convertida em Pensão de Velhice aos 66 anos e 9 meses.",
  },
  {
    idA: "subsidiodoenca",
    idB: "desemprego",
    motivo:
      "O Subsídio de Doença pleno não é acumulável com o Subsídio de Desemprego para o mesmo período de ausência de trabalho.",
    baseLegal: "Decreto-Lei n.º 28/2004 e Decreto-Lei n.º 220/2006.",
    sugestao:
      "Durante o período de doença clinicamente certificada com baixa médica, o subsídio de desemprego suspende-se e vigora a proteção na doença.",
  },
  {
    idA: "bolsadges",
    idB: "bolsasegsocial",
    motivo:
      "A Bolsa de Estudo DGES destina-se exclusivamente ao Ensino Superior, enquanto a Bolsa da Segurança Social se destina ao Ensino Secundário.",
    baseLegal: "Regulamento de Atribuição de Bolsas a Estudantes do Ensino Superior e Guia da Segurança Social.",
    sugestao: "Selecione a bolsa correspondente ao nível de ensino que está atualmente a frequentar.",
  },
];

/**
 * Regras oficiais de pré-requisitos / dependências entre apoios
 */
export const REGRAS_DEPENDENCIA: RegraDependencia[] = [
  {
    apoioId: "garantiainfancia",
    requerApoios: ["abono"],
    motivo:
      "A Garantia para a Infância é um complemento direto do Abono de Família para crianças até aos 18 anos inseridas no 1.º escalão.",
  },
  {
    apoioId: "abonomonoparental",
    requerApoios: ["abono", "prenatal"],
    motivo:
      "A majoração para famílias monoparentais exige ter previamente concedido o Abono de Família ou o Abono de Família Pré-Natal.",
  },
  {
    apoioId: "abononumerosa",
    requerApoios: ["abono"],
    motivo:
      "A majoração para famílias numerosas incide sobre o Abono de Família atribuído a crianças até 36 meses.",
  },
  {
    apoioId: "tarifagas",
    requerApoios: ["tarifaeletricidade", "csi", "rsi", "desemprego", "desempregosocial", "abono", "psi"],
    motivo:
      "A Tarifa Social de Gás Natural requer que o titular seja beneficiário de uma prestação social elegível ou da Tarifa Social de Eletricidade.",
  },
];

/**
 * Catálogo Curado de Packs de Apoios (Bundles)
 * Conjuntos populares de benefícios compatíveis entre si, concebidos para cenários de vida concretos.
 */
export const PACKS_RECOMENDADOS: PackApoios[] = [
  {
    id: "pack-jovem-trabalhador",
    nome: "Pack Jovem Trabalhador",
    descricao:
      "Combinação ideal para jovens até 35 anos em início de atividade profissional com arrendamento habitacional.",
    publicoAlvo: "Jovens dos 18 aos 35 anos a trabalhar por conta de outrem ou recibos verdes.",
    apoioIds: ["irsjovem", "porta65", "sub23"],
    destaque: true,
  },
  {
    id: "pack-estudante-superior",
    nome: "Pack Universitário Deslocado",
    descricao:
      "Conjunto de ação social escolar e mobilidade para quem estuda no ensino superior.",
    publicoAlvo: "Estudantes inscritos no ensino superior público ou privado com necessidade de apoio.",
    apoioIds: ["bolsadges", "sub23", "porta65"],
    destaque: true,
  },
  {
    id: "pack-familia-filhos",
    nome: "Pack Família com Crianças",
    descricao:
      "Rede completa de proteção à parentalidade, sustento dos filhos e desagravamento das despesas domésticas.",
    publicoAlvo: "Famílias com dependentes menores e despesas com energia.",
    apoioIds: ["abono", "garantiainfancia", "tarifaeletricidade"],
    destaque: true,
  },
  {
    id: "pack-senior",
    nome: "Pack Sénior e Idade Maior",
    descricao:
      "Reforço de rendimentos e isenções essenciais para reformados e pessoas a partir dos 66 anos e 9 meses.",
    publicoAlvo: "Pessoas em idade legal de velhice com baixos rendimentos ou em risco de pobreza.",
    apoioIds: ["csi", "tarifaeletricidade", "isencaotaxas"],
    destaque: false,
  },
  {
    id: "pack-desemprego-transicao",
    nome: "Pack Proteção no Desemprego",
    descricao:
      "Apoio ao rendimento e redução imediata dos encargos fixos com serviços de eletricidade e gás durante a transição profissional.",
    publicoAlvo: "Trabalhadores em situação de desemprego involuntário inscritos no centro de emprego.",
    apoioIds: ["desemprego", "tarifaeletricidade", "tarifagas"],
    destaque: false,
  },
];

/**
 * Cria uma estrutura de Wishlist vazia
 */
export function criarWishlist(): Wishlist {
  return {
    itens: [],
    atualizadoEm: new Date().toISOString(),
  };
}

/**
 * Adiciona um apoio à Wishlist (se ainda não existir)
 */
export function adicionarApoio(
  wishlist: Wishlist,
  apoioId: string,
  origem: "individual" | "pack" = "individual",
  packOrigemId?: string,
): Wishlist {
  const idNormalizado = apoioId.trim();
  if (!idNormalizado) return wishlist;

  const jaExiste = wishlist.itens.some((item) => item.id === idNormalizado);
  if (jaExiste) return wishlist;

  const novoItem: ItemWishlist = {
    id: idNormalizado,
    adicionadoEm: new Date().toISOString(),
    origem,
    ...(packOrigemId !== undefined ? { packOrigemId } : {}),
  };

  return {
    itens: [...wishlist.itens, novoItem],
    atualizadoEm: new Date().toISOString(),
  };
}

/**
 * Remove um apoio da Wishlist
 */
export function removerApoio(wishlist: Wishlist, apoioId: string): Wishlist {
  const idNormalizado = apoioId.trim();
  const itensFiltrados = wishlist.itens.filter((item) => item.id !== idNormalizado);

  return {
    itens: itensFiltrados,
    atualizadoEm: new Date().toISOString(),
  };
}

/**
 * Limpa todos os apoios da Wishlist
 */
export function limparWishlist(): Wishlist {
  return criarWishlist();
}

/**
 * Motor central de compatibilidade: analisa um conjunto de IDs de apoios e identifica
 * incompatibilidades legais mútuas e dependências em falta.
 */
export function validarCompatibilidadeWishlist(apoioIds: string[]): ResultadoValidacaoWishlist {
  const idsUnicos = Array.from(new Set(apoioIds.map((id) => id.trim()).filter(Boolean)));
  const conflitos: ConflitoApoio[] = [];
  const dependenciasEmFalta: DependenciaEmFalta[] = [];

  // 1. Verificação de Incompatibilidades Mútuas Diretas (Pares A vs B)
  for (const regra of REGRAS_INCOMPATIBILIDADE) {
    const temA = idsUnicos.includes(regra.idA);
    const temB = idsUnicos.includes(regra.idB);

    if (temA && temB) {
      conflitos.push({
        tipo: "incompatibilidade_legal",
        apoioA: regra.idA,
        apoioB: regra.idB,
        motivo: regra.motivo,
        ...(regra.baseLegal !== undefined ? { baseLegal: regra.baseLegal } : {}),
        sugestao: regra.sugestao,
      });
    }
  }

  // 2. Verificação de Pré-requisitos e Dependências
  for (const regra of REGRAS_DEPENDENCIA) {
    if (idsUnicos.includes(regra.apoioId)) {
      const cumpreDependencia = regra.requerApoios.some((requerido) => idsUnicos.includes(requerido));
      if (!cumpreDependencia) {
        dependenciasEmFalta.push({
          tipo: "dependencia_em_falta",
          apoioId: regra.apoioId,
          requerApoioId: regra.requerApoios[0]!,
          motivo: regra.motivo,
        });
      }
    }
  }

  const valida = conflitos.length === 0 && dependenciasEmFalta.length === 0;

  return {
    valida,
    conflitos,
    dependenciasEmFalta,
    totalApoios: idsUnicos.length,
    apoiosIdentificados: idsUnicos,
  };
}

/**
 * Pesquisa e devolve um Pack por ID
 */
export function obterPack(packId: string): PackApoios | undefined {
  return PACKS_RECOMENDADOS.find((p) => p.id === packId);
}

/**
 * Aplica um Pack de Apoios à Wishlist em bloco e devolve a wishlist resultante e o relatório de validação
 */
export function aplicarPack(
  wishlist: Wishlist,
  packId: string,
): {
  wishlist: Wishlist;
  resultado: ResultadoValidacaoWishlist;
  pack?: PackApoios;
} {
  const pack = obterPack(packId);
  if (!pack) {
    return {
      wishlist,
      resultado: validarCompatibilidadeWishlist(wishlist.itens.map((i) => i.id)),
    };
  }

  let novaWishlist = { ...wishlist };
  for (const id of pack.apoioIds) {
    novaWishlist = adicionarApoio(novaWishlist, id, "pack", pack.id);
  }

  const resultado = validarCompatibilidadeWishlist(novaWishlist.itens.map((i) => i.id));

  return {
    wishlist: novaWishlist,
    resultado,
    pack,
  };
}

const CHAVE_STORAGE = "wehelp_wishlist_v1";

/**
 * Adaptador seguro para leitura da Wishlist a partir do localStorage
 */
export function carregarWishlistLocal(): Wishlist {
  if (typeof window === "undefined" || !window.localStorage) {
    return criarWishlist();
  }
  try {
    const raw = window.localStorage.getItem(CHAVE_STORAGE);
    if (!raw) return criarWishlist();
    const parsed = JSON.parse(raw) as Wishlist;
    if (!Array.isArray(parsed?.itens)) return criarWishlist();
    return parsed;
  } catch {
    return criarWishlist();
  }
}

/**
 * Adaptador seguro para gravação da Wishlist no localStorage
 */
export function guardarWishlistLocal(wishlist: Wishlist): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(wishlist));
  } catch {
    // Falha silenciosa em ambientes de navegação anónima estrita / cotas
  }
}


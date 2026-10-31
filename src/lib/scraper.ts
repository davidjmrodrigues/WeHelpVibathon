export interface DadosOficiaisExtraidos {
  id: string;
  fonteUrl: string;
  tituloOficial?: string | undefined;
  resumoOficial?: string | undefined;
  entidadeOficial?: string | undefined;
  atualizadoEm?: string | undefined;
  condicoesExtraidas?: string[] | undefined;
  linkCandidatura?: string | undefined;
  consultadoEm: string;
  sucesso: boolean;
}

export interface ApoioDescoberto {
  id: string;
  titulo: string;
  descricao: string;
  url: string;
  tema: string;
  entidade: string;
  consultadoEm: string;
  condicoes: string[];
}

export interface RespostaSincronizacao {
  sincronizadoEm: string;
  totalFontes: number;
  fontesComSucesso: number;
  totalDescobertos: number;
  apoios: Record<string, DadosOficiaisExtraidos>;
  apoiosDescobertos: ApoioDescoberto[];
}

export interface ResultadoPesquisaGov {
  titulo: string;
  descricao: string;
  url: string;
  categoria: string;
}

export const FONTES_SCRAPER: Record<string, string> = {
  porta65: "https://www.gov.pt/servicos/candidatar-se-ao-porta-65-jovem",
  sub23: "https://www.gov.pt/noticias/jovens-ate-aos-23-anos-ja-podem-usar-passe-gratuito",
  irsjovem: "https://www.gov.pt/servicos/pedir-o-irs-jovem",
  bolsadges:
    "https://www.gov.pt/servicos/candidatar-se-a-uma-bolsa-de-estudo-para-o-ensino-superior",
  desemprego: "https://www.gov.pt/servicos/requerer-o-subsidio-de-desemprego",
  rsi: "https://www.gov.pt/servicos/pedir-o-rendimento-social-de-insercao",
  tarifaeletricidade:
    "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
  tarifagas:
    "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
  abono: "https://www.gov.pt/servicos/requerer-o-abono-de-familia-para-criancas-e-jovens",
  prenatal: "https://www.gov.pt/servicos/requerer-o-abono-de-familia-pre-natal",
  garantiainfancia:
    "https://www.gov.pt/noticias/seguranca-social-lanca-apoio-para-criancas-e-jovens-carenciados",
  psi: "https://www.gov.pt/servicos/requerer-a-prestacao-social-para-a-inclusao",
  csi: "https://www.gov.pt/servicos/pedir-o-complemento-solidario-para-idosos",
  pensaosocial: "https://www.gov.pt/servicos/requerer-a-pensao-social-de-velhice",
  cuidador:
    "https://www.gov.pt/servicos/requerer-o-subsidio-de-apoio-ao-cuidador-informal-principal",
  desempregosocial: "https://www.gov.pt/servicos/requerer-o-subsidio-social-de-desemprego",
  parentalinicial: "https://www.gov.pt/servicos/requerer-o-subsidio-inicial",
  parentalsocial: "https://www.gov.pt/servicos/requerer-o-subsidio-social-parental",
  abonomonoparental:
    "https://www.gov.pt/servicos/requerer-a-majoracao-do-abono-para-familias-monoparentais",
  abononumerosa:
    "https://www.gov.pt/servicos/requerer-a-majoracao-do-abono-para-familias-numerosas",
  bonificacaodeficiencia:
    "https://www.gov.pt/servicos/requerer-a-bonificacao-por-deficiencia-do-abono-de-familia-para-criancas-e-jovens",
  educacaoespecial: "https://www.gov.pt/servicos/requerer-o-subsidio-de-educacao-especial",
  bolsasegsocial:
    "https://www.gov.pt/servicos/obter-informacoes-sobre-a-bolsa-de-estudo-seguranca-social-",
  complementodependencia:
    "https://www.gov.pt/servicos/obter-informacoes-sobre-o-complemento-por-dependencia",
  pensaoinvalidez: "https://www.gov.pt/servicos/obter-informacoes-sobre-a-pensao-de-invalidez",
  subsidiodoenca: "https://www.gov.pt/servicos/obter-informacoes-sobre-o-subsidio-de-doenca",
  isencaotaxas:
    "https://www.gov.pt/servicos/pedir-a-isencao-de-taxas-moderadoras-por-insuficiencia-economica",
  protecaojuridica: "https://www.gov.pt/servicos/pedir-protecao-juridica",
  mobilidadeilhas: "https://www.gov.pt/servicos/pedir-o-subsidio-social-de-mobilidade",
  porta65mais: "https://www.portaldahabitacao.pt/porta-65-jovem1",
};

export const CONSULTAS_DESCOBERTA_GOV: Array<{ termo: string; tema: string }> = [
  { termo: "subsídio", tema: "Subsídios e Prestações" },
  { termo: "abono", tema: "Família e Crianças" },
  { termo: "pensão", tema: "Pensões e Reforma" },
  { termo: "apoio social", tema: "Ação Social" },
  { termo: "bolsa de estudo", tema: "Educação e Juventude" },
  { termo: "arrendamento", tema: "Habitação" },
  { termo: "complemento", tema: "Complementos Sociais" },
  { termo: "prestação social", tema: "Deficiência e Inclusão" },
  { termo: "desemprego", tema: "Emprego e Desemprego" },
  { termo: "parental", tema: "Família e Parentalidade" },
  { termo: "cuidador", tema: "Dependência e Cuidadores" },
  { termo: "tarifa social", tema: "Energia e Serviços Essenciais" },
];

const ENTIDADES_HTML: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&ccedil;": "ç",
  "&atilde;": "ã",
  "&otilde;": "õ",
  "&aacute;": "á",
  "&eacute;": "é",
  "&iacute;": "í",
  "&oacute;": "ó",
  "&uacute;": "ú",
  "&acirc;": "â",
  "&ecirc;": "ê",
  "&ocirc;": "ô",
  "&agrave;": "à",
};

export function limparTextoOficial(texto: string | undefined | null): string {
  if (!texto) return "";
  return texto
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&[a-z0-9#]+;/gi, (m) => ENTIDADES_HTML[m.toLowerCase()] ?? " ")
    .replace(/\+\+|\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatarDataOficial(valor: string | undefined | null): string | undefined {
  if (!valor) return undefined;
  const ponto = valor.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (ponto) return `${ponto[1]}/${ponto[2]}/${ponto[3]}`;
  const iso = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return valor;
}

export function extrairDadosGovNextData(
  id: string,
  fonteUrl: string,
  html: string,
  consultadoEm: string,
): DadosOficiaisExtraidos | null {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i,
  );
  if (!match?.[1]) return null;

  try {
    const json = JSON.parse(match[1]) as {
      props?: {
        pageProps?: {
          seoInfoResp?: {
            pagetitle?: string;
            dateModified?: string;
            url?: string;
          };
          serverSideContent?: {
            serviceTitle?: {
              title?: string;
              description?: string;
              lastUpdatedAt?: string;
              buttonUrl?: string;
            };
            entitySection?: {
              entityName?: string;
            };
            who?: {
              descriptions?: Array<{ description?: string }>;
            };
          };
          results?: {
            title?: string;
            description?: string;
            lastModified?: string;
            url?: string;
          };
          newsData?: {
            title?: string;
            description?: string;
            publicationDate?: string;
            lastModified?: string;
            url?: string;
          };
        };
      };
    };

    const pageProps = json.props?.pageProps;
    if (!pageProps) return null;

    if (pageProps.serverSideContent) {
      const ssc = pageProps.serverSideContent;
      const seo = pageProps.seoInfoResp;
      const tituloOficial = limparTextoOficial(ssc.serviceTitle?.title ?? seo?.pagetitle);
      const resumoOficial = limparTextoOficial(ssc.serviceTitle?.description);
      const entidadeOficial = limparTextoOficial(ssc.entitySection?.entityName);
      const atualizadoEm = formatarDataOficial(
        ssc.serviceTitle?.lastUpdatedAt ?? seo?.dateModified,
      );
      const condicoesExtraidas = (ssc.who?.descriptions ?? [])
        .map((d) => limparTextoOficial(d.description))
        .filter((t) => t.length > 0)
        .slice(0, 3);
      const linkCandidatura =
        ssc.serviceTitle?.buttonUrl || (seo?.url ? `https://www.gov.pt${seo.url}` : fonteUrl);

      return {
        id,
        fonteUrl,
        tituloOficial: tituloOficial || undefined,
        resumoOficial: resumoOficial || undefined,
        entidadeOficial: entidadeOficial || undefined,
        atualizadoEm,
        condicoesExtraidas: condicoesExtraidas.length > 0 ? condicoesExtraidas : undefined,
        linkCandidatura,
        consultadoEm,
        sucesso: Boolean(tituloOficial || resumoOficial),
      };
    }

    if (pageProps.results) {
      const r = pageProps.results;
      const tituloOficial = limparTextoOficial(r.title);
      const resumoOficial = limparTextoOficial(r.description);
      return {
        id,
        fonteUrl,
        tituloOficial: tituloOficial || undefined,
        resumoOficial: resumoOficial || undefined,
        entidadeOficial: "gov.pt",
        atualizadoEm: formatarDataOficial(r.lastModified),
        linkCandidatura: r.url ? `https://www.gov.pt${r.url}` : fonteUrl,
        consultadoEm,
        sucesso: Boolean(tituloOficial || resumoOficial),
      };
    }

    if (pageProps.newsData) {
      const n = pageProps.newsData;
      const tituloOficial = limparTextoOficial(n.title);
      const resumoOficial = limparTextoOficial(n.description);
      return {
        id,
        fonteUrl,
        tituloOficial: tituloOficial || undefined,
        resumoOficial: resumoOficial || undefined,
        entidadeOficial: "gov.pt",
        atualizadoEm: formatarDataOficial(n.lastModified ?? n.publicationDate),
        linkCandidatura: n.url ? `https://www.gov.pt${n.url}` : fonteUrl,
        consultadoEm,
        sucesso: Boolean(tituloOficial || resumoOficial),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function extrairDadosHtmlGenerico(
  id: string,
  fonteUrl: string,
  html: string,
  consultadoEm: string,
): DadosOficiaisExtraidos {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  const dataMatch = html.match(/Atualizado em\s*(\d{2}\.\d{2}\.\d{4})/i);

  const tituloOficial = limparTextoOficial(h1Match?.[1] ?? titleMatch?.[1]);
  const resumoOficial = limparTextoOficial(metaDescMatch?.[1]);

  return {
    id,
    fonteUrl,
    tituloOficial: tituloOficial || undefined,
    resumoOficial: resumoOficial || undefined,
    atualizadoEm: formatarDataOficial(dataMatch?.[1]),
    linkCandidatura: fonteUrl,
    consultadoEm,
    sucesso: Boolean(tituloOficial),
  };
}

let cacheSincronizacao: { expiraEm: number; dados: RespostaSincronizacao } | null = null;
// Intervalo de atualização dos dados oficiais: uma vez por dia.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function rasparFonteUnica(
  id: string,
  url: string,
  consultadoEm: string,
): Promise<DadosOficiaisExtraidos> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WeHelp/1.0; +https://www.gov.pt)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      return { id, fonteUrl: url, consultadoEm, sucesso: false };
    }
    const html = await res.text();
    const dadosGov = extrairDadosGovNextData(id, url, html, consultadoEm);
    if (dadosGov && dadosGov.sucesso) {
      return dadosGov;
    }
    return extrairDadosHtmlGenerico(id, url, html, consultadoEm);
  } catch {
    return { id, fonteUrl: url, consultadoEm, sucesso: false };
  } finally {
    clearTimeout(timeout);
  }
}

const REGEX_APOIO_RELEVANTE =
  /(apoio|subs[íi]dio|abono|pens[ãa]o|bolsa|arrendamento|habita[çc][ãa]o|complemento|presta[çc][ãa]o|desemprego|parental|cuidador|defici[êe]ncia|invalidez|idoso|social|isen[çc][ãa]o|prote[çc][ãa]o|tarifa|porta 65|jovem)/i;

const REGEX_EXCLUIR_ADMINISTRATIVO =
  /(certid[ãa]o de [óo]bito|cancelar o cart[ãa]o|alterar a morada|registo criminal|passaporte|carta de condu[çc][ãa]o)/i;

export async function descobrirCatalogoAlargadoGovPt(
  consultadoEm: string,
): Promise<ApoioDescoberto[]> {
  const urlsCatalogoBase = new Set(Object.values(FONTES_SCRAPER));
  const mapa = new Map<string, ApoioDescoberto>();

  await Promise.all(
    CONSULTAS_DESCOBERTA_GOV.map(async ({ termo, tema }) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch("https://www.gov.pt/api/post-search-result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; WeHelp/1.0; +https://www.gov.pt)",
          },
          body: JSON.stringify({
            method: "POST",
            body: {
              id: "services_search_template",
              params: {
                size: "35",
                start: "0",
                hasThemes: false,
                hasSubThemes: false,
                value: termo,
                category: "",
              },
            },
          }),
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        const extraidos = extrairResultadosPesquisaGov(json);
        for (const item of extraidos) {
          if (urlsCatalogoBase.has(item.url) || mapa.has(item.url)) continue;
          const textoCompleto = `${item.titulo} ${item.descricao}`;
          if (
            !REGEX_APOIO_RELEVANTE.test(textoCompleto) ||
            REGEX_EXCLUIR_ADMINISTRATIVO.test(textoCompleto)
          ) {
            continue;
          }
          const slug = item.url.split("/").pop() ?? item.titulo;
          mapa.set(item.url, {
            id: `gov-${slug}`,
            titulo: item.titulo,
            descricao:
              item.descricao ||
              "Serviço oficial de apoio ou prestação pública disponibilizado no portal gov.pt.",
            url: item.url,
            tema,
            entidade: "gov.pt · Catálogo Oficial de Serviços Públicos",
            consultadoEm,
            condicoes: [
              "Confirmar o enquadramento pessoal, familiar e contributivo na ficha oficial do serviço em gov.pt.",
              "Verificar prazos legais de candidatura, documentos exigidos e eventuais condições de recursos indexadas ao IAS.",
            ],
          });
        }
      } catch {
        // Ignorar falha individual de categoria para não bloquear as restantes
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  return Array.from(mapa.values());
}

export async function sincronizarApoiosOficiais(forcar = false): Promise<RespostaSincronizacao> {
  const agora = Date.now();
  if (!forcar && cacheSincronizacao && cacheSincronizacao.expiraEm > agora) {
    return cacheSincronizacao.dados;
  }

  const hoje = new Date().toLocaleDateString("pt-PT");
  const entradas = Object.entries(FONTES_SCRAPER);
  const urlsUnicos = Array.from(new Set(entradas.map(([, u]) => u)));
  const cachePorUrl = new Map<string, DadosOficiaisExtraidos>();

  const [, apoiosDescobertos] = await Promise.all([
    Promise.all(
      urlsUnicos.map(async (url) => {
        const resultado = await rasparFonteUnica(url, url, hoje);
        cachePorUrl.set(url, resultado);
      }),
    ),
    descobrirCatalogoAlargadoGovPt(hoje),
  ]);

  const apoios: Record<string, DadosOficiaisExtraidos> = {};
  let fontesComSucesso = 0;

  for (const [id, url] of entradas) {
    const base = cachePorUrl.get(url);
    const registo: DadosOficiaisExtraidos = base
      ? { ...base, id }
      : { id, fonteUrl: url, consultadoEm: hoje, sucesso: false };
    if (registo.sucesso) fontesComSucesso += 1;
    apoios[id] = registo;
  }

  const resposta: RespostaSincronizacao = {
    sincronizadoEm: hoje,
    totalFontes: entradas.length,
    fontesComSucesso,
    totalDescobertos: apoiosDescobertos.length,
    apoios,
    apoiosDescobertos,
  };

  cacheSincronizacao = {
    expiraEm: agora + CACHE_TTL_MS,
    dados: resposta,
  };

  return resposta;
}

export function extrairResultadosPesquisaGov(payloadJson: unknown): ResultadoPesquisaGov[] {
  if (!payloadJson || typeof payloadJson !== "object") return [];
  const hitsObj = (
    payloadJson as { hits?: { hits?: Array<{ _source?: Record<string, unknown> }> } }
  ).hits;
  const lista = hitsObj?.hits;
  if (!Array.isArray(lista)) return [];

  const resultados: ResultadoPesquisaGov[] = [];
  for (const item of lista) {
    const src = item?._source;
    if (!src) continue;
    const titulo = limparTextoOficial(typeof src["title"] === "string" ? src["title"] : "");
    const descricao = limparTextoOficial(
      typeof src["description"] === "string" ? src["description"] : "",
    );
    const rawUrl = typeof src["url"] === "string" ? src["url"] : "";
    const categoria = limparTextoOficial(
      typeof src["category"] === "string" ? src["category"] : "Serviços",
    );
    if (!titulo || !rawUrl) continue;
    const url = rawUrl.startsWith("http")
      ? rawUrl
      : `https://www.gov.pt${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
    resultados.push({ titulo, descricao, url, categoria });
  }
  return resultados;
}

export async function pesquisarServicosGovPt(termo: string): Promise<ResultadoPesquisaGov[]> {
  const limpo = termo.trim().slice(0, 100);
  if (!limpo) return [];

  const consultarTemplate = async (templateId: string): Promise<ResultadoPesquisaGov[]> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch("https://www.gov.pt/api/post-search-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; WeHelp/1.0; +https://www.gov.pt)",
        },
        body: JSON.stringify({
          method: "POST",
          body: {
            id: templateId,
            params: {
              size: "12",
              start: "0",
              hasThemes: false,
              hasSubThemes: false,
              value: limpo,
              category: "",
            },
          },
        }),
        signal: controller.signal,
      });
      if (!res.ok) return [];
      const json = (await res.json()) as unknown;
      return extrairResultadosPesquisaGov(json);
    } catch {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  };

  const servicos = await consultarTemplate("services_search_template");
  if (servicos.length > 0) return servicos;
  return consultarTemplate("geral_search_template");
}

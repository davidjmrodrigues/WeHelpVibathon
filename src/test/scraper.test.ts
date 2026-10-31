import { describe, expect, it } from "vitest";
import { APOIOS, avaliarApoioDescoberto } from "@/lib/apoios";
import {
  CONSULTAS_DESCOBERTA_GOV,
  FONTES_SCRAPER,
  extrairDadosGovNextData,
  extrairDadosHtmlGenerico,
  extrairResultadosPesquisaGov,
  formatarDataOficial,
  limparTextoOficial,
} from "@/lib/scraper";

describe("Scraper de fontes oficiais (gov.pt e DGEG)", () => {
  it("mapeia todos os 29 apoios do catálogo principal e define as 12 áreas de descoberta automática", () => {
    expect(APOIOS.length).toBeGreaterThanOrEqual(29);
    for (const apoio of APOIOS) {
      expect(FONTES_SCRAPER[apoio.id]).toBeDefined();
      expect(FONTES_SCRAPER[apoio.id]).toMatch(/^https:\/\//);
    }
    expect(CONSULTAS_DESCOBERTA_GOV.length).toBeGreaterThanOrEqual(12);
  });

  it("avalia conservadoramente no cliente os apoios descobertos pelo scraper", () => {
    // Trabalhador vs Desemprego
    expect(
      avaliarApoioDescoberto("Pedir o subsídio social de desemprego", "Apoio no desemprego", {
        idade: 30,
        distrito: "Lisboa",
        situacao: "Trabalhador",
        agregado: 2,
        rendimento: 15000,
      }).ok,
    ).toBe(false);

    // Açores e Madeira vs Continente
    expect(
      avaliarApoioDescoberto("Pedir o Subsídio Social de Mobilidade", "Apoio residentes ilhas", {
        idade: 30,
        distrito: "Faro",
        situacao: "Trabalhador",
        agregado: 1,
        rendimento: 12000,
      }).ok,
    ).toBe(false);
    expect(
      avaliarApoioDescoberto("Pedir o Subsídio Social de Mobilidade", "Apoio residentes ilhas", {
        idade: 30,
        distrito: "Região Autónoma dos Açores",
        situacao: "Trabalhador",
        agregado: 1,
        rendimento: 12000,
      }).ok,
    ).toBe(true);

    // Jovem de 22 anos descartado de velhice / aposentação
    expect(
      avaliarApoioDescoberto(
        "Pedir a aposentação (CGA)",
        "Reforma e aposentação dos funcionários públicos",
        {
          idade: 22,
          distrito: "Porto",
          situacao: "Trabalhador",
          agregado: 1,
          rendimento: 14000,
        },
      ).ok,
    ).toBe(false);
    expect(
      avaliarApoioDescoberto("Apoio a Lares de Idosos", "Resposta social para pessoas idosas", {
        idade: 22,
        distrito: "Coimbra",
        situacao: "Estudante",
        agregado: 1,
        rendimento: 0,
      }).ok,
    ).toBe(false);

    // Cidadão de 80 anos descartado de medidas jovens e bolsas de estudo
    expect(
      avaliarApoioDescoberto("Candidatura ao Porta 65 Jovem", "Apoio ao arrendamento para jovens", {
        idade: 80,
        distrito: "Lisboa",
        situacao: null,
        agregado: 1,
        rendimento: 6000,
      }).ok,
    ).toBe(false);
    expect(
      avaliarApoioDescoberto("Bolsa de Estudo para o Ensino Superior", "Ação social escolar", {
        idade: 80,
        distrito: "Braga",
        situacao: null,
        agregado: 1,
        rendimento: 6000,
      }).ok,
    ).toBe(false);
  });

  it("extrai corretamente uma página de serviço gov.pt a partir de __NEXT_DATA__", () => {
    const htmlMock = `
      <!DOCTYPE html>
      <html><body>
      <script id="__NEXT_DATA__" type="application/json">
      ${JSON.stringify({
        props: {
          pageProps: {
            seoInfoResp: {
              pagetitle: "Pedir o IRS Jovem",
              dateModified: "2026-03-30T10:00:00Z",
              url: "/servicos/pedir-o-irs-jovem",
            },
            serverSideContent: {
              serviceTitle: {
                title: "Pedir o IRS Jovem",
                description: "<p>O IRS Jovem é um benefício fiscal para jovens até 35 anos.</p>",
                lastUpdatedAt: "30.03.2026",
                buttonUrl: "https://irs.portaldasfinancas.gov.pt/escolherModoEntregaIRS.action",
              },
              entitySection: {
                entityName: "Autoridade Tributária e Aduaneira",
              },
              who: {
                descriptions: [
                  {
                    description:
                      "O IRS Jovem pode ser pedido por **pessoas até 35 anos** com rendimentos das categorias A ou B.",
                  },
                ],
              },
            },
          },
        },
      })}
      </script>
      </body></html>
    `;

    const extraido = extrairDadosGovNextData(
      "irsjovem",
      "https://www.gov.pt/servicos/pedir-o-irs-jovem",
      htmlMock,
      "31/10/2026",
    );

    expect(extraido).not.toBeNull();
    expect(extraido?.sucesso).toBe(true);
    expect(extraido?.tituloOficial).toBe("Pedir o IRS Jovem");
    expect(extraido?.resumoOficial).toBe(
      "O IRS Jovem é um benefício fiscal para jovens até 35 anos.",
    );
    expect(extraido?.entidadeOficial).toBe("Autoridade Tributária e Aduaneira");
    expect(extraido?.atualizadoEm).toBe("30/03/2026");
    expect(extraido?.condicoesExtraidas?.[0]).toContain("pessoas até 35 anos");
    expect(extraido?.linkCandidatura).toBe(
      "https://irs.portaldasfinancas.gov.pt/escolherModoEntregaIRS.action",
    );
  });

  it("extrai corretamente HTML genérico de portais complementares (ex.: DGEG)", () => {
    const htmlDgeg = `
      <html>
        <head>
          <title>Tarifa Social de Energia</title>
          <meta name="description" content="Informação oficial sobre a Tarifa Social de Eletricidade e Gás Natural." />
        </head>
        <body>
          <h1>Pol&#237;ticas de prote&#231;&#227;o ao consumidor de energia</h1>
          <p>Atualizado em 15.10.2026</p>
        </body>
      </html>
    `;

    const extraido = extrairDadosHtmlGenerico(
      "tarifaeletricidade",
      "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
      htmlDgeg,
      "31/10/2026",
    );

    expect(extraido.sucesso).toBe(true);
    expect(extraido.tituloOficial).toBe("Políticas de proteção ao consumidor de energia");
    expect(extraido.resumoOficial).toBe(
      "Informação oficial sobre a Tarifa Social de Eletricidade e Gás Natural.",
    );
    expect(extraido.atualizadoEm).toBe("15/10/2026");
  });

  it("normaliza a resposta de pesquisa Elasticsearch do gov.pt", () => {
    const payload = {
      hits: {
        hits: [
          {
            _source: {
              title: "Receber o abono de família para crianças e jovens",
              description:
                "<p>Apoio em dinheiro atribuído mensalmente para compensar os encargos familiares.</p>",
              url: "/servicos/requerer-o-abono-de-familia-para-criancas-e-jovens",
              category: "Serviços",
            },
          },
        ],
      },
    };

    const resultados = extrairResultadosPesquisaGov(payload);
    expect(resultados).toHaveLength(1);
    expect(resultados[0]).toEqual({
      titulo: "Receber o abono de família para crianças e jovens",
      descricao: "Apoio em dinheiro atribuído mensalmente para compensar os encargos familiares.",
      url: "https://www.gov.pt/servicos/requerer-o-abono-de-familia-para-criancas-e-jovens",
      categoria: "Serviços",
    });
  });

  it("limpa entidades HTML, Markdown e formata datas", () => {
    expect(
      limparTextoOficial("<p>Seguran&ccedil;a &amp; ++**Apoio**++ [link](https://gov.pt)</p>"),
    ).toBe("Segurança & Apoio link");
    expect(formatarDataOficial("14.09.2026")).toBe("14/09/2026");
    expect(formatarDataOficial("2026-10-26T14:31:36Z")).toBe("26/10/2026");
    expect(formatarDataOficial(undefined)).toBeUndefined();
    expect(limparTextoOficial(null)).toBe("");
  });

  it("extrai corretamente guias e notícias através de __NEXT_DATA__", () => {
    const htmlGuia = `
      <script id="__NEXT_DATA__" type="application/json">
      ${JSON.stringify({
        props: {
          pageProps: {
            results: {
              title: "Apoio à família: cuidador informal",
              description: "Saiba que medidas de apoio pode ter caso seja cuidador informal.",
              lastModified: "2026-10-26T14:31:36Z",
              url: "/guias/apoio-a-familia/cuidador-informal",
            },
          },
        },
      })}
      </script>
    `;
    const guiaExtraido = extrairDadosGovNextData(
      "cuidador",
      "https://www.gov.pt/guias/apoio-a-familia/cuidador-informal",
      htmlGuia,
      "31/10/2026",
    );
    expect(guiaExtraido?.sucesso).toBe(true);
    expect(guiaExtraido?.tituloOficial).toBe("Apoio à família: cuidador informal");
    expect(guiaExtraido?.atualizadoEm).toBe("26/10/2026");

    const htmlNoticia = `
      <script id="__NEXT_DATA__" type="application/json">
      ${JSON.stringify({
        props: {
          pageProps: {
            newsData: {
              title: "Jovens até aos 23 anos já podem usar passe gratuito",
              description: "<p>O novo passe gratuito para jovens está disponível.</p>",
              publicationDate: "2024-12-03T00:00:00Z",
              url: "/noticias/jovens-ate-aos-23-anos-ja-podem-usar-passe-gratuito",
            },
          },
        },
      })}
      </script>
    `;
    const noticiaExtraida = extrairDadosGovNextData(
      "sub23",
      "https://www.gov.pt/noticias/jovens-ate-aos-23-anos-ja-podem-usar-passe-gratuito",
      htmlNoticia,
      "31/10/2026",
    );
    expect(noticiaExtraida?.sucesso).toBe(true);
    expect(noticiaExtraida?.tituloOficial).toBe(
      "Jovens até aos 23 anos já podem usar passe gratuito",
    );
    expect(noticiaExtraida?.atualizadoEm).toBe("03/12/2024");
  });

  it("aplica fallback robusto perante JSON inválido ou páginas sem __NEXT_DATA__", () => {
    const htmlCorrompido = `<script id="__NEXT_DATA__" type="application/json">{ invalid json</script>`;
    expect(
      extrairDadosGovNextData("teste", "https://gov.pt", htmlCorrompido, "31/10/2026"),
    ).toBeNull();

    const htmlSemNextData = `<html><head><title>Página de Exemplo</title></head><body><h1>Apoio Público</h1></body></html>`;
    const fallbackGenerico = extrairDadosHtmlGenerico(
      "teste",
      "https://gov.pt",
      htmlSemNextData,
      "31/10/2026",
    );
    expect(fallbackGenerico.sucesso).toBe(true);
    expect(fallbackGenerico.tituloOficial).toBe("Apoio Público");
  });

  it("trata payloads de pesquisa nulos, vazios ou sem _source sem lançar exceções", () => {
    expect(extrairResultadosPesquisaGov(null)).toEqual([]);
    expect(extrairResultadosPesquisaGov({})).toEqual([]);
    expect(extrairResultadosPesquisaGov({ hits: {} })).toEqual([]);
    expect(extrairResultadosPesquisaGov({ hits: { hits: [{}] } })).toEqual([]);
    expect(
      extrairResultadosPesquisaGov({
        hits: { hits: [{ _source: { title: "Sem URL", description: "Desc" } }] },
      }),
    ).toEqual([]);
  });
});

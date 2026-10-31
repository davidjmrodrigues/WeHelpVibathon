import { describe, expect, it } from "vitest";
import { APOIOS, SITUACOES, avaliarApoios, avaliarApoioDescoberto, type Perfil } from "@/lib/apoios";
import { APOIOS_EN, MOTIVOS_EN } from "@/lib/apoios-en";
import { TEXTOS, rotuloTema, tx } from "@/lib/textos";
import { CONSULTAS_DESCOBERTA_GOV } from "@/lib/scraper";

const PERFIS: Perfil[] = [];
for (const idade of [null, 10, 17, 22, 30, 40, 55, 66, 70]) {
  for (const agregado of [null, 1, 2, 3]) {
    for (const distrito of ["", "Lisboa", "Região Autónoma dos Açores"]) {
      for (const situacao of [null, "Estudante", "Trabalhador", "Desempregado"] as const) {
        PERFIS.push({ idade, agregado, distrito, situacao, rendimento: null });
      }
    }
  }
}

describe("Idioma: cobertura das traduções PT/EN", () => {
  it("mantém as chaves de situação em português (a elegibilidade depende delas)", () => {
    expect(SITUACOES).toEqual(["Estudante", "Trabalhador", "Desempregado", "Reformado"]);
    expect(TEXTOS["situacaoEstudante"]?.pt).toBe("Estudante");
    expect(TEXTOS["situacaoTrabalhador"]?.en).toBe("Worker");
    expect(TEXTOS["situacaoReformado"]?.en).toBe("Retired");
  });

  it("cobre com inglês todos os apoios do catálogo verificado", () => {
    for (const apoio of APOIOS) {
      expect(APOIOS_EN[apoio.id], `Falta tradução EN para o apoio ${apoio.id}`).toBeDefined();
      const en = APOIOS_EN[apoio.id]!;
      expect(en.titulo.length).toBeGreaterThan(3);
      expect(en.descricao.length).toBeGreaterThan(20);
      expect(en.valor.length).toBeGreaterThan(3);
      expect(en.periodo.length).toBeGreaterThan(10);
      expect(en.condicoes.length).toBe(apoio.condicoes.length);
    }
  });

  it("cobre com inglês todos os motivos de exclusão gerados pelo catálogo", () => {
    const emFalta: string[] = [];
    for (const perfil of PERFIS) {
      for (const apoio of avaliarApoios(perfil)) {
        if (apoio.resultado.motivo && !(apoio.resultado.motivo in MOTIVOS_EN)) {
          emFalta.push(apoio.resultado.motivo);
        }
      }
    }
    expect(emFalta).toEqual([]);
  });

  it("cobre com inglês os motivos gerados pelas regras heurísticas de apoios descobertos", () => {
    // Um exemplo representativo por tema de descoberta automática.
    for (const { tema } of CONSULTAS_DESCOBERTA_GOV) {
      const resultado = avaliarApoioDescoberto(`subsídio ${tema}`, "desemprego ou bolsa de estudo", {
        idade: 70,
        distrito: "Lisboa",
        situacao: "Trabalhador",
        agregado: 1,
        rendimento: null,
      });
      if (resultado.motivo) {
        expect(MOTIVOS_EN[resultado.motivo], `Motivo sem EN: ${resultado.motivo}`).toBeTruthy();
      }
    }
  });

  it("devolve o texto em inglês e faz fallback para português em chaves desconhecidas", () => {
    expect(tx("en", "maisFiltros")).toBe("More filters");
    expect(tx("pt", "maisFiltros")).toBe("Mais filtros");
    expect(tx("en", "chaveInexistente")).toBe("chaveInexistente");
  });

  it("rotula os temas em ambos os idiomas", () => {
    expect(rotuloTema("pt", "Todos")).toBe("Todos");
    expect(rotuloTema("en", "Todos")).toBe("All");
    expect(rotuloTema("en", "Catálogo Principal")).toBe("Main catalogue");
    expect(rotuloTema("en", "Habitação")).toBe("Housing");
    expect(rotuloTema("pt", "Habitação")).toBe("Habitação");
  });
});

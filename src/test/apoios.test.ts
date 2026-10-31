import { describe, expect, it } from "vitest";
import { APOIOS, avaliarApoios, type Perfil } from "@/lib/apoios";
import { multiplicarIAS } from "@/lib/ias";

const base: Perfil = {
  idade: null,
  distrito: "",
  situacao: null,
  agregado: null,
  rendimento: null,
};
function resultado(id: string, patch: Partial<Perfil>) {
  const apoio = avaliarApoios({ ...base, ...patch }).find((a) => a.id === id);
  if (!apoio) throw new Error(`Apoio ausente: ${id}`);
  return apoio.resultado.ok;
}

describe("Catálogo oficial e triagem conservadora", () => {
  it("inclui os quatro apoios originais e pelo menos dez adicionais", () => {
    expect(APOIOS.length).toBeGreaterThanOrEqual(14);
    for (const id of ["porta65", "sub23", "irsjovem", "bolsadges"]) {
      expect(APOIOS.some((a) => a.id === id)).toBe(true);
    }
    expect(new Set(APOIOS.map((a) => a.id)).size).toBe(APOIOS.length);
  });
  it("não exclui o passe aos 23 anos nem exige ser estudante", () => {
    expect(resultado("sub23", { idade: 23, situacao: "Trabalhador" })).toBe(true);
    expect(resultado("sub23", { idade: 24 })).toBe(false);
  });
  it("considera a exceção de casal até 37 anos no Porta 65", () => {
    expect(resultado("porta65", { idade: 17 })).toBe(false);
    expect(resultado("porta65", { idade: 18 })).toBe(true);
    expect(resultado("porta65", { idade: 37 })).toBe(true);
    expect(resultado("porta65", { idade: 38 })).toBe(false);
  });
  it("casa própria exclui apoios ao arrendamento; arrendada mantém", () => {
    expect(resultado("porta65", { idade: 25, habitacao: "propria" })).toBe(false);
    expect(resultado("porta65", { idade: 25, habitacao: "arrendada" })).toBe(true);
    expect(resultado("sub23", { idade: 22, habitacao: "propria" })).toBe(true);
  });
  it("sem filhos a cargo exclui apoios a agregados com crianças", () => {
    expect(resultado("abono", { filhos: "nao" })).toBe(false);
    expect(resultado("abono", { filhos: "sim" })).toBe(true);
    expect(resultado("abono", { filhos: "monoparental" })).toBe(true);
    expect(resultado("sub23", { idade: 22, filhos: "nao" })).toBe(true);
  });
  it("não aplica o antigo teto fictício de rendimento do Porta 65", () => {
    expect(resultado("porta65", { idade: 25, rendimento: 31000 })).toBe(true);
  });
  it("IRS Jovem aplica-se entre 18 e 35 anos a trabalhadores e 55 IAS não é poupança de imposto", () => {
    expect(resultado("irsjovem", { idade: 17 })).toBe(false);
    expect(resultado("irsjovem", { idade: 18 })).toBe(true);
    expect(resultado("irsjovem", { idade: 35 })).toBe(true);
    expect(resultado("irsjovem", { idade: 36 })).toBe(false);
    expect(resultado("irsjovem", { idade: 80 })).toBe(false);
    expect(resultado("irsjovem", { idade: 25, situacao: "Desempregado" })).toBe(false);
    expect(multiplicarIAS(55)).toBe(29542.15);
  });
  it("não aplica os limites fictícios de idade e rendimento à bolsa DGES", () => {
    expect(resultado("bolsadges", { idade: 40, situacao: "Estudante", rendimento: 10000 })).toBe(
      true,
    );
  });
  it("não classifica o subsídio normal de desemprego como adequado a quem trabalha", () => {
    expect(resultado("desemprego", { situacao: "Trabalhador" })).toBe(false);
    expect(resultado("desemprego", { situacao: "Desempregado" })).toBe(true);
  });
  it("exclui CSI abaixo da idade legal de acesso à pensão de velhice (66 anos e 9 meses)", () => {
    expect(resultado("csi", { idade: 22 })).toBe(false);
    expect(resultado("csi", { idade: 40 })).toBe(false);
    expect(resultado("csi", { idade: 65 })).toBe(false);
    expect(resultado("csi", { idade: 66 })).toBe(true);
  });
  it("garante que jovem de 22 anos não é elegível para apoios de velhice e reforma", () => {
    expect(resultado("csi", { idade: 22 })).toBe(false);
    expect(resultado("pensaosocial", { idade: 22 })).toBe(false);
  });
  it("garante que cidadão de 80 anos não é elegível para IRS Jovem nem medidas jovens", () => {
    expect(resultado("irsjovem", { idade: 80 })).toBe(false);
    expect(resultado("porta65", { idade: 80 })).toBe(false);
    expect(resultado("sub23", { idade: 80 })).toBe(false);
    expect(resultado("bolsasegsocial", { idade: 80 })).toBe(false);
    expect(resultado("desemprego", { idade: 80 })).toBe(false);
  });
  it("mantém os 66 anos da pensão social por faltar verificar nove meses", () => {
    expect(resultado("pensaosocial", { idade: 65 })).toBe(false);
    expect(resultado("pensaosocial", { idade: 66 })).toBe(true);
  });
  it("respeita o intervalo etário do cuidador e mantém o caso de meses desconhecidos", () => {
    expect(resultado("cuidador", { idade: 17 })).toBe(false);
    expect(resultado("cuidador", { idade: 18 })).toBe(true);
    expect(resultado("cuidador", { idade: 66 })).toBe(true);
    expect(resultado("cuidador", { idade: 67 })).toBe(false);
  });
  it("não exclui apoios de saúde e inclusão sem presunção indevida de incapacidade", () => {
    for (const id of ["psi", "isencaotaxas", "protecaojuridica"]) {
      expect(resultado(id, { idade: 50, agregado: 1 })).toBe(true);
    }
  });
  it("exclui apoios de infância para pessoa isolada adulta sem dependentes", () => {
    expect(resultado("abono", { idade: 80, agregado: 1 })).toBe(false);
    expect(resultado("prenatal", { idade: 80, agregado: 1 })).toBe(false);
    expect(resultado("garantiainfancia", { idade: 80, agregado: 1 })).toBe(false);
  });
  it("não confunde rendimento bruto da casa com os recursos legais de cada apoio", () => {
    for (const id of ["rsi", "tarifaeletricidade", "tarifagas", "abono", "prenatal", "csi"]) {
      expect(resultado(id, { rendimento: 50000 })).toBe(true);
    }
  });
  it("exclui apoios de jovens para reformados mesmo sem idade indicada", () => {
    expect(resultado("porta65", { situacao: "Reformado" })).toBe(false);
    expect(resultado("sub23", { situacao: "Reformado" })).toBe(false);
    expect(resultado("irsjovem", { situacao: "Reformado" })).toBe(false);
  });
});

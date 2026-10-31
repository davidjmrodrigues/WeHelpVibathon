import { describe, expect, it } from "vitest";
import { APOIOS, avaliarApoios, type Perfil } from "@/lib/apoios";
import { multiplicarIAS } from "@/lib/ias";

const base: Perfil = { idade: null, distrito: "", situacao: null, agregado: null, rendimento: null };
function resultado(id: string, patch: Partial<Perfil>) {
  const apoio = avaliarApoios({ ...base, ...patch }).find(a => a.id === id);
  if (!apoio) throw new Error(`Apoio ausente: ${id}`);
  return apoio.resultado.ok;
}

describe("Catálogo oficial e triagem conservadora", () => {
  it("inclui os quatro apoios originais e pelo menos dez adicionais", () => {
    expect(APOIOS.length).toBeGreaterThanOrEqual(14);
    for (const id of ["porta65", "sub23", "irsjovem", "bolsadges"]) {
      expect(APOIOS.some(a => a.id === id)).toBe(true);
    }
    expect(new Set(APOIOS.map(a => a.id)).size).toBe(APOIOS.length);
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
  it("não aplica o antigo teto fictício de rendimento do Porta 65", () => {
    expect(resultado("porta65", { idade: 25, rendimento: 31000 })).toBe(true);
  });
  it("IRS Jovem termina aos 35 anos e 55 IAS não é poupança de imposto", () => {
    expect(resultado("irsjovem", { idade: 35 })).toBe(true);
    expect(resultado("irsjovem", { idade: 36 })).toBe(false);
    expect(multiplicarIAS(55)).toBe(29542.15);
  });
  it("não aplica os limites fictícios de idade e rendimento à bolsa DGES", () => {
    expect(resultado("bolsadges", { idade: 40, situacao: "Estudante", rendimento: 10000 })).toBe(true);
  });
  it("não classifica o subsídio normal de desemprego como adequado a quem trabalha", () => {
    expect(resultado("desemprego", { situacao: "Trabalhador" })).toBe(false);
    expect(resultado("desemprego", { situacao: "Desempregado" })).toBe(true);
  });
  it("não exclui CSI pela idade por existir a via de invalidez", () => {
    expect(resultado("csi", { idade: 40 })).toBe(true);
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
  it("não presume filhos, gravidez ou incapacidade a partir da idade do requerente", () => {
    for (const id of ["abono", "prenatal", "garantiainfancia", "psi"]) {
      expect(resultado(id, { idade: 50, agregado: 1 })).toBe(true);
    }
  });
  it("não confunde rendimento bruto da casa com os recursos legais de cada apoio", () => {
    for (const id of ["rsi", "tarifaeletricidade", "tarifagas", "abono", "prenatal", "csi"]) {
      expect(resultado(id, { rendimento: 50000 })).toBe(true);
    }
  });
});
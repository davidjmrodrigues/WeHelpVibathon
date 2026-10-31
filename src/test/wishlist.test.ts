import { describe, expect, it } from "vitest";
import {
  PACKS_RECOMENDADOS,
  REGRAS_DEPENDENCIA,
  REGRAS_INCOMPATIBILIDADE,
  adicionarApoio,
  aplicarPack,
  carregarWishlistLocal,
  criarWishlist,
  guardarWishlistLocal,
  limparWishlist,
  obterPack,
  removerApoio,
  validarCompatibilidadeWishlist,
} from "@/lib/wishlist";

describe("Motor de Wishlist e Validação de Compatibilidade entre Apoios", () => {
  it("cria uma wishlist vazia e adiciona apoios de forma idempotente", () => {
    let wishlist = criarWishlist();
    expect(wishlist.itens).toHaveLength(0);

    wishlist = adicionarApoio(wishlist, "porta65");
    expect(wishlist.itens).toHaveLength(1);
    expect(wishlist.itens[0]!.id).toBe("porta65");
    expect(wishlist.itens[0]!.origem).toBe("individual");

    // Tentativa de adicionar o mesmo apoio não duplica
    wishlist = adicionarApoio(wishlist, "porta65");
    expect(wishlist.itens).toHaveLength(1);

    wishlist = adicionarApoio(wishlist, "irsjovem");
    expect(wishlist.itens).toHaveLength(2);

    wishlist = removerApoio(wishlist, "porta65");
    expect(wishlist.itens).toHaveLength(1);
    expect(wishlist.itens[0]!.id).toBe("irsjovem");

    wishlist = limparWishlist();
    expect(wishlist.itens).toHaveLength(0);
  });

  it("avalia como válida uma lista de apoios compatíveis", () => {
    const res = validarCompatibilidadeWishlist(["irsjovem", "porta65", "sub23"]);
    expect(res.valida).toBe(true);
    expect(res.conflitos).toHaveLength(0);
    expect(res.dependenciasEmFalta).toHaveLength(0);
    expect(res.totalApoios).toBe(3);
  });

  it("deteta incompatibilidade direta entre Prestação Social para a Inclusão e Bonificação por Deficiência", () => {
    const res = validarCompatibilidadeWishlist(["psi", "bonificacaodeficiencia"]);
    expect(res.valida).toBe(false);
    expect(res.conflitos).toHaveLength(1);

    const conflito = res.conflitos[0];
    expect(conflito!.tipo).toBe("incompatibilidade_legal");
    expect(conflito!.apoioA).toBe("psi");
    expect(conflito!.apoioB).toBe("bonificacaodeficiencia");
    expect(conflito!.motivo).toContain("não podem ser acumuladas pelo mesmo titular");
    expect(conflito!.sugestao).toBeTruthy();
    expect(conflito!.baseLegal).toBeTruthy();
  });

  it("deteta incompatibilidade direta entre Pensão Social de Velhice e Subsídio de Desemprego", () => {
    const res = validarCompatibilidadeWishlist(["pensaosocial", "desemprego"]);
    expect(res.valida).toBe(false);
    expect(res.conflitos.some((c) => c.apoioA === "pensaosocial" && c.apoioB === "desemprego")).toBe(
      true,
    );
  });

  it("deteta incompatibilidade entre regimes alternativos de desemprego e parentalidade", () => {
    const desempregoRes = validarCompatibilidadeWishlist(["desemprego", "desempregosocial"]);
    expect(desempregoRes.valida).toBe(false);
    expect(desempregoRes.conflitos.some((c) => c.apoioB === "desempregosocial")).toBe(true);

    const parentalRes = validarCompatibilidadeWishlist(["parentalinicial", "parentalsocial"]);
    expect(parentalRes.valida).toBe(false);
    expect(parentalRes.conflitos.some((c) => c.apoioB === "parentalsocial")).toBe(true);
  });

  it("deteta incompatibilidade de nível de ensino entre Bolsa DGES e Bolsa Secundário da Seg. Social", () => {
    const res = validarCompatibilidadeWishlist(["bolsadges", "bolsasegsocial"]);
    expect(res.valida).toBe(false);
    expect(res.conflitos.some((c) => c.apoioA === "bolsadges" && c.apoioB === "bolsasegsocial")).toBe(
      true,
    );
  });

  it("deteta dependência em falta: Garantia para a Infância requer Abono de Família", () => {
    const semAbono = validarCompatibilidadeWishlist(["garantiainfancia"]);
    expect(semAbono.valida).toBe(false);
    expect(semAbono.dependenciasEmFalta).toHaveLength(1);
    expect(semAbono.dependenciasEmFalta[0]!.apoioId).toBe("garantiainfancia");
    expect(semAbono.dependenciasEmFalta[0]!.requerApoioId).toBe("abono");

    // Ao juntar o Abono de Família, a dependência fica satisfeita
    const comAbono = validarCompatibilidadeWishlist(["garantiainfancia", "abono"]);
    expect(comAbono.valida).toBe(true);
    expect(comAbono.dependenciasEmFalta).toHaveLength(0);
  });

  it("deteta dependência de majoração monoparental face a abono ou pré-natal", () => {
    const semBase = validarCompatibilidadeWishlist(["abonomonoparental"]);
    expect(semBase.valida).toBe(false);
    expect(semBase.dependenciasEmFalta.some((d) => d.apoioId === "abonomonoparental")).toBe(true);

    const comPrenatal = validarCompatibilidadeWishlist(["abonomonoparental", "prenatal"]);
    expect(comPrenatal.valida).toBe(true);
  });

  it("resolve conflitos ao remover o apoio incompatível da wishlist", () => {
    let w = criarWishlist();
    w = adicionarApoio(w, "desemprego");
    w = adicionarApoio(w, "pensaosocial");

    let validacao = validarCompatibilidadeWishlist(w.itens.map((i) => i.id));
    expect(validacao.valida).toBe(false);

    w = removerApoio(w, "pensaosocial");
    validacao = validarCompatibilidadeWishlist(w.itens.map((i) => i.id));
    expect(validacao.valida).toBe(true);
  });

  describe("Packs de Apoios Recomendados", () => {
    it("disponibiliza pelo menos 5 packs curados para diferentes perfis", () => {
      expect(PACKS_RECOMENDADOS.length).toBeGreaterThanOrEqual(5);
      const ids = PACKS_RECOMENDADOS.map((p) => p.id);
      expect(new Set(ids).size).toBe(PACKS_RECOMENDADOS.length);
    });

    it("garante que TODOS os packs recomendados são 100% compatíveis e sem dependências em falta", () => {
      for (const pack of PACKS_RECOMENDADOS) {
        const res = validarCompatibilidadeWishlist(pack.apoioIds);
        expect(
          res.valida,
          `O pack "${pack.nome}" (${pack.id}) não deveria ter conflitos nem dependências em falta. Conflitos: ${JSON.stringify(res.conflitos)}, Dependências: ${JSON.stringify(res.dependenciasEmFalta)}`,
        ).toBe(true);
        expect(res.conflitos).toHaveLength(0);
        expect(res.dependenciasEmFalta).toHaveLength(0);
      }
    });

    it("aplica um pack completo à wishlist registando a proveniência", () => {
      const wInicial = criarWishlist();
      const resultadoPack = aplicarPack(wInicial, "pack-jovem-trabalhador");

      expect(resultadoPack.pack).toBeDefined();
      expect(resultadoPack.pack?.nome).toBe("Pack Jovem Trabalhador");
      expect(resultadoPack.resultado.valida).toBe(true);
      expect(resultadoPack.wishlist.itens.length).toBe(3);

      for (const item of resultadoPack.wishlist.itens) {
        expect(item.origem).toBe("pack");
        expect(item.packOrigemId).toBe("pack-jovem-trabalhador");
      }
    });

    it("ignora pack inexistente sem corromper a wishlist", () => {
      const wInicial = adicionarApoio(criarWishlist(), "sub23");
      const { wishlist, pack } = aplicarPack(wInicial, "pack-fantasma");

      expect(pack).toBeUndefined();
      expect(wishlist.itens).toHaveLength(1);
    });
  });

  describe("Persistência local segura", () => {
    it("gere o armazenamento local sem lançar exceções em ambientes sem window", () => {
      const w = adicionarApoio(criarWishlist(), "porta65");
      expect(() => guardarWishlistLocal(w)).not.toThrow();
      const carregada = carregarWishlistLocal();
      expect(carregada).toBeDefined();
      expect(Array.isArray(carregada.itens)).toBe(true);
    });
  });
});


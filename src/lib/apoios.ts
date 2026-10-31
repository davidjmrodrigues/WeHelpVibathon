export const IAS_VALUE = 537.13;

export type Situacao = "Estudante" | "Trabalhador" | "Desempregado";

export interface Perfil {
  idade: number | null;
  distrito: string;
  situacao: Situacao | null;
  agregado: number | null;
  rendimento: number | null;
}

export interface ResultadoElegibilidade {
  ok: boolean;
  motivo?: string;
}

export interface Apoio {
  id: string;
  titulo: string;
  descricao: string;
  valor: string;
  link: string;
  elegivel: (p: Perfil) => ResultadoElegibilidade;
}

export const DISTRITOS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro",
  "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal",
  "Viana do Castelo", "Vila Real", "Viseu", "Região Autónoma dos Açores", "Região Autónoma da Madeira",
];

export const SITUACOES: Situacao[] = ["Estudante", "Trabalhador", "Desempregado"];

export const APOIOS: Apoio[] = [
  {
    id: "porta65",
    titulo: "Porta 65 Jovem",
    descricao: "Apoio ao arrendamento para jovens, que comparticipa uma parte da renda mensal.",
    valor: "Até 300 €/mês",
    link: "https://www.portugal.gov.pt/pt/gc23/comunicacao/noticia?i=porta-65-jovem",
    // Regra: 18–35 anos e rendimento anual abaixo de 4× IAS × 14 por agregado
    elegivel: (p) => {
      if (p.idade !== null && (p.idade < 18 || p.idade > 35))
        return { ok: false, motivo: "Idade fora do intervalo 18–35 anos" };
      if (p.rendimento !== null && p.rendimento > IAS_VALUE * 4 * 14)
        return { ok: false, motivo: "Rendimento acima de 4× IAS × 14" };
      return { ok: true };
    },
  },
  {
    id: "sub23",
    titulo: "Passe Sub23",
    descricao: "Passe de transportes públicos gratuito para estudantes até aos 23 anos.",
    valor: "Até 40 €/mês",
    link: "https://www.portugal.gov.pt/pt/gc23/comunicacao/noticia?i=passe-sub23",
    elegivel: (p) => {
      if (p.idade !== null && p.idade > 23)
        return { ok: false, motivo: "Idade superior a 23 anos" };
      if (p.situacao !== null && p.situacao !== "Estudante")
        return { ok: false, motivo: "Apenas para estudantes" };
      return { ok: true };
    },
  },
  {
    id: "irsjovem",
    titulo: "IRS Jovem",
    descricao: "Isenção parcial de IRS sobre rendimentos do trabalho para jovens até aos 35 anos.",
    valor: "Poupança até 55 × IAS/ano",
    link: "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/IRS_Jovem/Paginas/default.aspx",
    elegivel: (p) => {
      if (p.idade !== null && (p.idade < 18 || p.idade > 35))
        return { ok: false, motivo: "Idade fora do intervalo 18–35 anos" };
      if (p.situacao !== null && p.situacao !== "Trabalhador")
        return { ok: false, motivo: "Apenas para trabalhadores" };
      return { ok: true };
    },
  },
  {
    id: "bolsadges",
    titulo: "Bolsa de Estudo DGES",
    descricao: "Bolsa anual para estudantes do ensino superior com carência económica.",
    valor: "Até 16 × IAS/ano",
    link: "https://www.dges.gov.pt/guias/indbolsa.asp",
    // Regra: estudante, até 24 anos, rendimento do agregado até 16× IAS
    elegivel: (p) => {
      if (p.situacao !== null && p.situacao !== "Estudante")
        return { ok: false, motivo: "Apenas para estudantes do ensino superior" };
      if (p.idade !== null && p.idade > 24)
        return { ok: false, motivo: "Idade superior a 24 anos" };
      if (p.rendimento !== null && p.rendimento > IAS_VALUE * 16)
        return { ok: false, motivo: "Rendimento acima de 16× IAS" };
      return { ok: true };
    },
  },
];

export interface ApoioAvaliado extends Apoio {
  resultado: ResultadoElegibilidade;
}

/** Avalia todos os apoios e ordena: elegíveis primeiro, não elegíveis no fim. */
export const avaliarApoios = (p: Perfil): ApoioAvaliado[] =>
  APOIOS.map((a) => ({ ...a, resultado: a.elegivel(p) })).sort(
    (a, b) => Number(b.resultado.ok) - Number(a.resultado.ok),
  );

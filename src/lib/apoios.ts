export const IAS_VALUE = 537.13;

export type Situacao = "Estudante" | "Trabalhador" | "Desempregado";

export interface Perfil {
  idade: number;
  distrito: string;
  situacao: Situacao;
  agregado: number;
  rendimento: number;
}

export interface Apoio {
  id: string;
  titulo: string;
  descricao: string;
  valor: string;
  link: string;
  elegivel: (p: Perfil) => boolean;
}

export const DISTRITOS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro",
  "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal",
  "Viana do Castelo", "Vila Real", "Viseu", "Região Autónoma dos Açores", "Região Autónoma da Madeira",
];

export const APOIOS: Apoio[] = [
  {
    id: "porta65",
    titulo: "Porta 65 Jovem",
    descricao: "Apoio ao arrendamento para jovens, que comparticipa uma parte da renda mensal.",
    valor: "Até 300 €/mês",
    link: "https://www.portugal.gov.pt/pt/gc23/comunicacao/noticia?i=porta-65-jovem",
    // Regra: 18–35 anos e rendimento anual abaixo de 4× IAS × 14 por agregado
    elegivel: (p) => p.idade >= 18 && p.idade <= 35 && p.rendimento <= IAS_VALUE * 4 * 14,
  },
  {
    id: "sub23",
    titulo: "Passe Sub23",
    descricao: "Passe de transportes públicos gratuito para estudantes até aos 23 anos.",
    valor: "Até 40 €/mês",
    link: "https://www.portugal.gov.pt/pt/gc23/comunicacao/noticia?i=passe-sub23",
    elegivel: (p) => p.idade <= 23 && p.situacao === "Estudante",
  },
  {
    id: "irsjovem",
    titulo: "IRS Jovem",
    descricao: "Isenção parcial de IRS sobre rendimentos do trabalho para jovens até aos 35 anos.",
    valor: "Poupança até 55 × IAS/ano",
    link: "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/IRS_Jovem/Paginas/default.aspx",
    elegivel: (p) => p.idade >= 18 && p.idade <= 35 && p.situacao === "Trabalhador",
  },
];

export const calcularApoios = (p: Perfil) => APOIOS.filter((a) => a.elegivel(p));

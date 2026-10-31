import { euros, multiplicarIAS } from "./ias";
export { IAS_VALUE } from "./ias";

export type Situacao = "Estudante" | "Trabalhador" | "Desempregado";
export interface Perfil {
  idade: number | null;
  distrito: string;
  situacao: Situacao | null;
  agregado: number | null;
  rendimento: number | null;
}
export interface ResultadoElegibilidade { ok: boolean; motivo?: string; }
export interface Apoio {
  id: string;
  titulo: string;
  descricao: string;
  valor: string;
  entidade: string;
  link: string;
  condicoes: string[];
  periodo: string;
  verificadoEm: string;
  elegivel: (p: Perfil) => ResultadoElegibilidade;
}
export const DISTRITOS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro",
  "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal",
  "Viana do Castelo", "Vila Real", "Viseu", "Região Autónoma dos Açores", "Região Autónoma da Madeira",
];
export const SITUACOES: Situacao[] = ["Estudante", "Trabalhador", "Desempregado"];
const possivel = (): ResultadoElegibilidade => ({ ok: true });
const fora = (motivo: string): ResultadoElegibilidade => ({ ok: false, motivo });
const SS = "Segurança Social";
const DATA = "31/10/2026";
type Registo = Omit<Apoio, "verificadoEm" | "elegivel"> & { elegivel?: Apoio["elegivel"] };
const REGISTOS: Registo[] = [
  {
    id: "porta65", titulo: "Porta 65 Jovem", entidade: "Portal da Habitação · IHRU",
    descricao: "Apoio ao arrendamento de habitação permanente, através de uma percentagem da renda. O montante depende da candidatura e das regras aplicáveis.",
    valor: "Percentagem variável da renda", link: "https://www.portaldahabitacao.pt/porta-65-jovem1",
    periodo: "FAQ oficial consultada em outubro de 2026; sem data editorial visível.",
    condicoes: ["Regra geral: 18 a 35 anos. Num casal, um dos elementos pode ter até 37 anos, se o outro cumprir o limite de 35.", "Verificar residência permanente, tipologia, propriedade de outra habitação, relação com o senhorio e incompatibilidades com outros apoios.", "A renda não pode ultrapassar 60% do rendimento médio mensal bruto da casa. Aplicam-se limites de rendimento mensal corrigido ligados à renda máxima de referência e à retribuição mínima mensal garantida, não ao IAS.", "É possível candidatar-se sem contrato, sujeito à celebração no prazo previsto após aprovação."],
    elegivel: p => p.idade !== null && (p.idade < 18 || p.idade > 37) ? fora("Fora das idades previstas, incluindo a exceção para casais") : possivel(),
  },
  {
    id: "sub23", titulo: "Passe gratuito para jovens", entidade: "gov.pt · Transportes públicos",
    descricao: "Gratuitidade do passe abrangido pela medida para jovens até aos 23 anos, estudantes e não estudantes. Não equivale à gratuitidade de todos os serviços de transporte.",
    valor: "Passe abrangido gratuito", link: "https://www.gov.pt/noticias/jovens-ate-aos-23-anos-ja-podem-usar-passe-gratuito",
    periodo: "Medida anunciada em dezembro de 2024; confirmar cobertura e condições atuais com o operador.",
    condicoes: ["Até aos 23 anos, independentemente de ser estudante.", "Comprovar a idade e pedir ou ativar o passe junto do operador. Confirmar os serviços e a área abrangidos."],
    elegivel: p => p.idade !== null && p.idade > 23 ? fora("Idade superior a 23 anos") : possivel(),
  },
  {
    id: "irsjovem", titulo: "IRS Jovem", entidade: "Autoridade Tributária · gov.pt",
    descricao: "Isenção de IRS sobre rendimentos de trabalho dependente ou independente, até dez anos e dentro do limite etário. As taxas são 100% no primeiro ano, 75% do segundo ao quarto, 50% do quinto ao sétimo e 25% do oitavo ao décimo.",
    valor: `Limite de isenção: ${euros(multiplicarIAS(55))}/ano`, link: "https://www.gov.pt/servicos/pedir-o-irs-jovem",
    periodo: "Rendimentos de 2026. O limite de 55 IAS é de rendimento isento, não de poupança em imposto.",
    condicoes: ["Ter até 35 anos e rendimentos das categorias A e/ou B no ano fiscal relevante.", "Verificar anos de rendimentos contabilizados, situação de dependente, exclusões, incompatibilidades e situação tributária.", "55 IAS = 29 542,15 € em 2026. A poupança efetiva depende do rendimento e do IRS que seria devido; não corresponde a receber esse valor."],
    elegivel: p => p.idade !== null && p.idade > 35 ? fora("Idade superior a 35 anos") : possivel(),
  },
  {
    id: "bolsadges", titulo: "Bolsa de estudo DGES", entidade: "Direção-Geral do Ensino Superior",
    descricao: "Apoio de ação social para estudantes do ensino superior, sujeito à avaliação de rendimentos, património e condições académicas.",
    valor: "Montante variável", link: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo",
    periodo: "Simulador oficial consultado refere 2025/2026; confirmar o regulamento e prazos de 2026/2027 nos serviços de ação social.",
    condicoes: ["Inscrição num curso abrangido, requisitos académicos e enquadramento de residência ou nacionalidade.", "Avaliação dos rendimentos, património e situação tributária e contributiva segundo o regulamento do ano letivo.", "O simulador é indicativo e não vincula os serviços. Não se aplica aqui o antigo limite fictício de 24 anos ou de 16 IAS de rendimento da casa."],
  },
  {
    id: "desemprego", titulo: "Subsídio de desemprego", entidade: SS,
    descricao: "Prestação em dinheiro para compensar a perda de remuneração por desemprego involuntário de trabalhadores abrangidos.",
    valor: "Depende das remunerações anteriores", link: "https://www.gov.pt/servicos/requerer-o-subsidio-de-desemprego",
    periodo: "Página oficial atualizada em 15/09/2026.",
    condicoes: ["Desemprego involuntário, carreira contributiva suficiente e enquadramento num regime abrangido.", "Inscrição para emprego, disponibilidade para trabalhar e cumprimento do prazo do pedido.", "O rendimento anual da casa não permite calcular a remuneração de referência nem o valor da prestação."],
    elegivel: p => p.situacao === "Trabalhador" ? fora("O subsídio destina-se a situações de desemprego; os apoios parciais têm regras próprias") : possivel(),
  },
  {
    id: "rsi", titulo: "Rendimento Social de Inserção", entidade: SS,
    descricao: "Prestação mensal para pessoas e famílias com baixos recursos, associada a um contrato de inserção social e profissional.",
    valor: "Montante variável conforme os recursos", link: "https://seg-social.pt/rendimento-social-de-insercao",
    periodo: "Guia oficial publicado em 03/07/2026.",
    condicoes: ["Residência legal nas condições aplicáveis e avaliação dos rendimentos e património da casa.", "Para pessoa isolada, o guia indica rendimentos mensais brutos inferiores a 247,56 €. Não é um pagamento fixo para todas as pessoas.", "Património mobiliário até 60 IAS: 32 227,80 € em 2026. Compromisso com o contrato de inserção e inscrição para emprego quando aplicável.", "Regra geral a partir dos 18 anos, com exceções. O filtro de idade não avalia essas exceções."],
  },
  {
    id: "tarifaeletricidade", titulo: "Tarifa social de eletricidade", entidade: "DGEG · ERSE",
    descricao: "Desconto na eletricidade para consumidores economicamente vulneráveis. A atribuição é normalmente automática, após verificação das condições.",
    valor: "Desconto médio de 33,8%", link: "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
    periodo: "Folheto ERSE de outubro de 2026; desconto médio indicado para janeiro de 2026, sem taxas e impostos.",
    condicoes: ["Contrato em nome do beneficiário, consumo doméstico na habitação permanente e potência contratada até 6,9 kVA.", "Receber uma prestação elegível ou cumprir a condição legal de rendimento: base anual de 6 272,64 €, acrescida de 50% por elemento sem rendimentos, até ao máximo previsto de dez.", "O número de pessoas da casa não informa quantas não têm rendimentos. Não aplicamos automaticamente essa fórmula.", "33,8% é um desconto médio sem taxas e impostos, não uma redução garantida da fatura final nessa percentagem."],
  },
  {
    id: "tarifagas", titulo: "Tarifa social de gás natural", entidade: "DGEG · ERSE",
    descricao: "Desconto no gás natural canalizado para consumidores que recebem prestações sociais abrangidas. Não se aplica ao gás engarrafado.",
    valor: "Desconto médio de 31,2%", link: "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
    periodo: "Outubro de 2026 a setembro de 2027; percentagem média sem taxas e impostos.",
    condicoes: ["Contrato em nome do beneficiário, habitação permanente, fornecimento em baixa pressão e consumo anual até 500 m³.", "Receber uma prestação abrangida, como CSI, RSI, prestação de desemprego, primeiro escalão do abono ou determinadas prestações de invalidez ou inclusão.", "A alternativa de baixos rendimentos da tarifa de eletricidade não é automaticamente aplicável ao gás. O desconto médio não corresponde à redução de toda a fatura."],
  },
  {
    id: "abono", titulo: "Abono de família para crianças e jovens", entidade: SS,
    descricao: "Apoio mensal para ajudar nas despesas de sustento e educação de crianças e jovens. O montante varia com o escalão, a idade e as majorações aplicáveis.",
    valor: "Depende do escalão e da idade", link: "https://seg-social.pt/abono-de-familia-para-criancas-e-jovens",
    periodo: "Guia oficial publicado em 14/07/2026.",
    condicoes: ["Existência de crianças ou jovens abrangidos e residência em Portugal ou situação equiparada.", "Escalão de rendimentos elegível e património mobiliário da casa até 128 911,20 € em 2026.", "A partir dos 16 anos, frequência dos níveis de ensino exigidos. Regra geral, o jovem não pode exercer atividade profissional, com exceções.", "São necessárias as idades de cada criança e a composição relevante para majorações. A idade introduzida no filtro é a sua, não a dos seus filhos."],
  },
  {
    id: "prenatal", titulo: "Abono de família pré-natal", entidade: SS,
    descricao: "Apoio mensal durante a gravidez, a partir da 13.ª semana, sujeito a condições de residência, rendimentos e património.",
    valor: "88,43 € a 190,98 €/mês por bebé", link: "https://www.gov.pt/servicos/requerer-o-abono-de-familia-pre-natal",
    periodo: "Tabela de 2026; guia oficial publicado em 24/07/2026.",
    condicoes: ["Gravidez com pelo menos 13 semanas, comprovativo médico e residência ou equiparação.", "Escalões 1 a 4: 190,98 €, 161,65 €, 132,07 € e 88,43 € mensais por bebé. O quinto escalão não recebe.", "Património mobiliário até 128 911,20 €. O rendimento de referência tem um divisor próprio, não o total de pessoas da casa.", "O número de bebés e a majoração monoparental de 35%, quando aplicável, alteram o valor."],
  },
  {
    id: "garantiainfancia", titulo: "Garantia para a Infância", entidade: SS,
    descricao: "Complemento do abono de família para menores de 18 anos de famílias com rendimentos muito baixos.",
    valor: "Abono + garantia: até 127,33 €/mês", link: "https://www.seg-social.pt/documents/10152/19882026/4004+-+Garantia+para+a+infancia",
    periodo: "Guia oficial publicado em 02/07/2026; montante conjunto de referência de 2026.",
    condicoes: ["Criança com menos de 18 anos, abono de família no primeiro escalão e rendimento de referência abaixo do limite específico.", "127,33 € é o total mensal do abono mais a garantia, não 127,33 € adicionais.", "Para beneficiários que já recebem abono em 2026, o guia usa rendimentos de 2024 e IAS de 2024, com limite de referência de 2 495,37 €.", "Não confundir esta prestação mensal da Segurança Social com o Complemento Garantia para a Infância de natureza fiscal."],
  },
  {
    id: "psi", titulo: "Prestação Social para a Inclusão", entidade: SS,
    descricao: "Apoio às pessoas com deficiência, com uma componente base e um eventual complemento sujeito a condições próprias.",
    valor: "Base de referência: 333,64 €/mês (adulto)", link: "https://www.gov.pt/servicos/requerer-a-prestacao-social-para-a-inclusao",
    periodo: "Guia oficial publicado em 03/07/2026; valores de referência de 2026.",
    condicoes: ["Residência legal e incapacidade certificada, em regra de pelo menos 60%, com regras próprias para pensionistas de invalidez.", "Verificar datas do atestado e da deficiência, nomeadamente quando a certificação ou o pedido ocorre após os 55 anos.", "Base de referência: 333,64 € por mês para adulto; 166,82 € para menor de 18 anos, antes das majorações. O valor efetivo pode depender de incapacidade e rendimentos.", "O complemento exige avaliação de recursos. Não se somam automaticamente valores máximos da base e do complemento."],
  },
  {
    id: "csi", titulo: "Complemento Solidário para Idosos", entidade: SS,
    descricao: "Complemento mensal para pessoas com baixos recursos que cumpram as condições de idade ou de pensão de invalidez, residência e rendimentos.",
    valor: "Variável · até 670 €/mês, titular isolado", link: "https://www.gov.pt/pt/servicos/pedir-o-complemento-solidario-para-idosos",
    periodo: "Guia oficial publicado em 21/05/2026.",
    condicoes: ["Na via normal de velhice, idade de 66 anos e 9 meses em 2026 e residência em Portugal durante pelo menos seis anos seguidos.", "Pensionistas de invalidez sem PSI têm uma via própria, sem essa idade mínima; por isso não excluímos apenas pela idade.", "Limite anual individual de recursos: 8 040 €. Para casal abrangido, 14 070 €, mantendo-se o limite individual.", "670 € é o limite mensal para titular isolado, não um pagamento fixo. Verificar pensões, rendimentos, património e recursos do cônjuge."],
  },
  {
    id: "pensaosocial", titulo: "Pensão social de velhice", entidade: SS,
    descricao: "Pensão para pessoas na idade legal de acesso à velhice, com baixos rendimentos e sem proteção contributiva suficiente, nas situações abrangidas.",
    valor: "285,23 € ou 308,07 €/mês, com CES", link: "https://www.gov.pt/servicos/requerer-a-pensao-social-de-velhice",
    periodo: "Guia oficial publicado em 21/05/2026; montantes de 2026.",
    condicoes: ["Idade legal de 66 anos e 9 meses em 2026. Aos 66 anos é preciso confirmar os meses; o filtro só recolhe anos.", "Residência e nacionalidade ou enquadramento internacional abrangidos, ausência de proteção contributiva suficiente.", "Rendimentos mensais brutos até 214,85 € para pessoa isolada ou 322,28 € para casal.", "Base de 262,40 € e Complemento Extraordinário de Solidariedade (CES): total de 285,23 € abaixo dos 70 anos ou 308,07 € a partir dos 70. O guia prevê pagamento a dobrar em julho e dezembro."],
    elegivel: p => p.idade !== null && p.idade < 66 ? fora("Ainda não atingiu a idade legal de 66 anos e 9 meses") : possivel(),
  },
  {
    id: "cuidador", titulo: "Subsídio de apoio ao cuidador informal principal", entidade: SS,
    descricao: "Prestação em dinheiro sujeita a condição de recursos para quem tem o estatuto reconhecido de cuidador informal principal.",
    valor: "Montante variável", link: "https://www.gov.pt/guias/apoio-a-familia/cuidador-informal",
    periodo: "Página oficial com limite expresso de 2026; datas editoriais indicadas de janeiro e outubro de 2026.",
    condicoes: ["Estatuto de cuidador informal principal reconhecido, coabitação e prestação permanente de cuidados nas condições previstas.", "Entre os 18 anos e a idade legal da pensão de velhice; confirmar os meses no limite superior.", "Rendimento de referência mensal da casa inferior a 698,27 € em 2026. Este valor é um limite de acesso, não o montante do subsídio.", "Verificar rendimentos ponderados, remunerações incompatíveis, dependência e prestações da pessoa cuidada."],
    elegivel: p => p.idade !== null && (p.idade < 18 || p.idade >= 67) ? fora("Fora do intervalo entre 18 anos e a idade legal de velhice") : possivel(),
  },
];
export const APOIOS: Apoio[] = REGISTOS.map(a => ({ ...a, verificadoEm: DATA, elegivel: a.elegivel ?? possivel }));
export interface ApoioAvaliado extends Apoio { resultado: ResultadoElegibilidade; }
/** True means not ruled out by known fields, NEVER verified entitlement. */
export const avaliarApoios = (p: Perfil): ApoioAvaliado[] => APOIOS.map(a => ({ ...a, resultado: a.elegivel(p) })).sort((a, b) => Number(b.resultado.ok) - Number(a.resultado.ok));

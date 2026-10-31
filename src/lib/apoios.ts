import { IAS_VALUE, euros, multiplicarIAS } from "./ias";
export { IAS_VALUE } from "./ias";

export type Situacao = "Estudante" | "Trabalhador" | "Desempregado" | "Reformado";
export type Habitacao = "arrendada" | "propria";
export type Filhos = "sim" | "nao" | "monoparental";
export interface Perfil {
  idade: number | null;
  distrito: string;
  situacao: Situacao | null;
  agregado: number | null;
  rendimento: number | null;
  habitacao?: Habitacao | null;
  filhos?: Filhos | null;
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
  entidade: string;
  link: string;
  condicoes: string[];
  periodo: string;
  verificadoEm: string;
  elegivel: (p: Perfil) => ResultadoElegibilidade;
}
export const DISTRITOS = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Região Autónoma dos Açores",
  "Região Autónoma da Madeira",
];
export const SITUACOES: Situacao[] = ["Estudante", "Trabalhador", "Desempregado", "Reformado"];
const possivel = (): ResultadoElegibilidade => ({ ok: true });
const fora = (motivo: string): ResultadoElegibilidade => ({ ok: false, motivo });
const SS = "Segurança Social";
const DATA = "31/10/2026";
type Registo = Omit<Apoio, "verificadoEm" | "elegivel"> & { elegivel?: Apoio["elegivel"] };
const REGISTOS: Registo[] = [
  {
    id: "porta65",
    titulo: "Porta 65 Jovem",
    entidade: "Portal da Habitação · IHRU",
    descricao:
      "Apoio ao arrendamento de habitação permanente, através de uma percentagem da renda. O montante depende da candidatura e das regras aplicáveis.",
    valor: "Percentagem variável da renda",
    link: "https://www.portaldahabitacao.pt/porta-65-jovem1",
    periodo: "FAQ oficial consultada em outubro de 2026; sem data editorial visível.",
    condicoes: [
      "Regra geral: 18 a 35 anos. Num casal, um dos elementos pode ter até 37 anos, se o outro cumprir o limite de 35.",
      "Verificar residência permanente, tipologia, propriedade de outra habitação, relação com o senhorio e incompatibilidades com outros apoios.",
      "A renda não pode ultrapassar 60% do rendimento médio mensal bruto da casa. Aplicam-se limites de rendimento mensal corrigido ligados à renda máxima de referência e à retribuição mínima mensal garantida, não ao IAS.",
      "É possível candidatar-se sem contrato, sujeito à celebração no prazo previsto após aprovação.",
    ],
    elegivel: (p) =>
      p.idade !== null && (p.idade < 18 || p.idade > 37)
        ? fora("Fora das idades previstas, incluindo a exceção para casais")
        : possivel(),
  },
  {
    id: "sub23",
    titulo: "Passe gratuito para jovens",
    entidade: "gov.pt · Transportes públicos",
    descricao:
      "Gratuitidade do passe abrangido pela medida para jovens até aos 23 anos, estudantes e não estudantes. Não equivale à gratuitidade de todos os serviços de transporte.",
    valor: "Passe abrangido gratuito",
    link: "https://www.gov.pt/noticias/jovens-ate-aos-23-anos-ja-podem-usar-passe-gratuito",
    periodo:
      "Medida anunciada em dezembro de 2024; confirmar cobertura e condições atuais com o operador.",
    condicoes: [
      "Até aos 23 anos, independentemente de ser estudante.",
      "Comprovar a idade e pedir ou ativar o passe junto do operador. Confirmar os serviços e a área abrangidos.",
    ],
    elegivel: (p) =>
      p.idade !== null && p.idade > 23 ? fora("Idade superior a 23 anos") : possivel(),
  },
  {
    id: "irsjovem",
    titulo: "IRS Jovem",
    entidade: "Autoridade Tributária · gov.pt",
    descricao:
      "Isenção de IRS sobre rendimentos de trabalho dependente ou independente, até dez anos e dentro do limite etário. As taxas são 100% no primeiro ano, 75% do segundo ao quarto, 50% do quinto ao sétimo e 25% do oitavo ao décimo.",
    valor: `Limite de isenção: ${euros(multiplicarIAS(55))}/ano`,
    link: "https://www.gov.pt/servicos/pedir-o-irs-jovem",
    periodo:
      "Rendimentos de 2026. O limite de 55 IAS é de rendimento isento, não de poupança em imposto.",
    condicoes: [
      "Ter até 35 anos e rendimentos das categorias A e/ou B no ano fiscal relevante.",
      "Verificar anos de rendimentos contabilizados, situação de dependente, exclusões, incompatibilidades e situação tributária.",
      "55 IAS = 29 542,15 € em 2026. A poupança efetiva depende do rendimento e do IRS que seria devido; não corresponde a receber esse valor.",
    ],
    elegivel: (p) => {
      if (p.idade !== null && (p.idade < 18 || p.idade > 35)) {
        return fora("O IRS Jovem destina-se a jovens entre os 18 e os 35 anos");
      }
      if (p.situacao === "Desempregado") {
        return fora(
          "O IRS Jovem aplica-se a rendimentos de trabalho dependente ou independente (categorias A e B)",
        );
      }
      return possivel();
    },
  },
  {
    id: "bolsadges",
    titulo: "Bolsa de estudo DGES",
    entidade: "Direção-Geral do Ensino Superior",
    descricao:
      "Apoio de ação social para estudantes do ensino superior, sujeito à avaliação de rendimentos, património e condições académicas.",
    valor: "Montante variável",
    link: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo",
    periodo:
      "Simulador oficial consultado refere 2025/2026; confirmar o regulamento e prazos de 2026/2027 nos serviços de ação social.",
    condicoes: [
      "Inscrição num curso abrangido, requisitos académicos e enquadramento de residência ou nacionalidade.",
      "Avaliação dos rendimentos, património e situação tributária e contributiva segundo o regulamento do ano letivo.",
      "O simulador é indicativo e não vincula os serviços. Não se aplica aqui o antigo limite fictício de 24 anos ou de 16 IAS de rendimento da casa.",
    ],
    elegivel: (p) =>
      p.situacao !== null && p.situacao !== "Estudante"
        ? fora("Destina-se exclusivamente a estudantes matriculados no ensino superior")
        : p.idade !== null && p.idade >= 67
          ? fora("Destina-se a estudantes antes da idade legal de reforma de velhice")
          : possivel(),
  },
  {
    id: "desemprego",
    titulo: "Subsídio de desemprego",
    entidade: SS,
    descricao:
      "Prestação em dinheiro para compensar a perda de remuneração por desemprego involuntário de trabalhadores abrangidos.",
    valor: "Depende das remunerações anteriores",
    link: "https://www.gov.pt/servicos/requerer-o-subsidio-de-desemprego",
    periodo: "Página oficial atualizada em 15/09/2026.",
    condicoes: [
      "Desemprego involuntário, carreira contributiva suficiente e enquadramento num regime abrangido.",
      "Inscrição para emprego, disponibilidade para trabalhar e cumprimento do prazo do pedido.",
      "O rendimento anual da casa não permite calcular a remuneração de referência nem o valor da prestação.",
    ],
    elegivel: (p) => {
      if (p.situacao === "Trabalhador") {
        return fora(
          "O subsídio destina-se a situações de desemprego; os apoios parciais têm regras próprias",
        );
      }
      if (p.idade !== null && p.idade >= 67) {
        return fora(
          "Atingida a idade legal de reforma por velhice, cessa a proteção no desemprego",
        );
      }
      return possivel();
    },
  },
  {
    id: "rsi",
    titulo: "Rendimento Social de Inserção",
    entidade: SS,
    descricao:
      "Prestação mensal para pessoas e famílias com baixos recursos, associada a um contrato de inserção social e profissional.",
    valor: "Montante variável conforme os recursos",
    link: "https://seg-social.pt/rendimento-social-de-insercao",
    periodo: "Guia oficial publicado em 03/07/2026.",
    condicoes: [
      "Residência legal nas condições aplicáveis e avaliação dos rendimentos e património da casa.",
      "Para pessoa isolada, o guia indica rendimentos mensais brutos inferiores a 247,56 €. Não é um pagamento fixo para todas as pessoas.",
      "Património mobiliário até 60 IAS: 32 227,80 € em 2026. Compromisso com o contrato de inserção e inscrição para emprego quando aplicável.",
      "Regra geral a partir dos 18 anos, com exceções. O filtro de idade não avalia essas exceções.",
    ],
  },
  {
    id: "tarifaeletricidade",
    titulo: "Tarifa social de eletricidade",
    entidade: "DGEG · ERSE",
    descricao:
      "Desconto na eletricidade para consumidores economicamente vulneráveis. A atribuição é normalmente automática, após verificação das condições.",
    valor: "Desconto médio de 33,8%",
    link: "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
    periodo:
      "Folheto ERSE de outubro de 2026; desconto médio indicado para janeiro de 2026, sem taxas e impostos.",
    condicoes: [
      "Contrato em nome do beneficiário, consumo doméstico na habitação permanente e potência contratada até 6,9 kVA.",
      "Receber uma prestação elegível ou cumprir a condição legal de rendimento: base anual de 6 272,64 €, acrescida de 50% por elemento sem rendimentos, até ao máximo previsto de dez.",
      "O número de pessoas da casa não informa quantas não têm rendimentos. Não aplicamos automaticamente essa fórmula.",
      "33,8% é um desconto médio sem taxas e impostos, não uma redução garantida da fatura final nessa percentagem.",
    ],
  },
  {
    id: "tarifagas",
    titulo: "Tarifa social de gás natural",
    entidade: "DGEG · ERSE",
    descricao:
      "Desconto no gás natural canalizado para consumidores que recebem prestações sociais abrangidas. Não se aplica ao gás engarrafado.",
    valor: "Desconto médio de 31,2%",
    link: "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
    periodo: "Outubro de 2026 a setembro de 2027; percentagem média sem taxas e impostos.",
    condicoes: [
      "Contrato em nome do beneficiário, habitação permanente, fornecimento em baixa pressão e consumo anual até 500 m³.",
      "Receber uma prestação abrangida, como CSI, RSI, prestação de desemprego, primeiro escalão do abono ou determinadas prestações de invalidez ou inclusão.",
      "A alternativa de baixos rendimentos da tarifa de eletricidade não é automaticamente aplicável ao gás. O desconto médio não corresponde à redução de toda a fatura.",
    ],
  },
  {
    id: "abono",
    titulo: "Abono de família para crianças e jovens",
    entidade: SS,
    descricao:
      "Apoio mensal para ajudar nas despesas de sustento e educação de crianças e jovens. O montante varia com o escalão, a idade e as majorações aplicáveis.",
    valor: "Depende do escalão e da idade",
    link: "https://seg-social.pt/abono-de-familia-para-criancas-e-jovens",
    periodo: "Guia oficial publicado em 14/07/2026.",
    condicoes: [
      "Existência de crianças ou jovens abrangidos e residência em Portugal ou situação equiparada.",
      "Escalão de rendimentos elegível e património mobiliário da casa até 128 911,20 € em 2026.",
      "A partir dos 16 anos, frequência dos níveis de ensino exigidos. Regra geral, o jovem não pode exercer atividade profissional, com exceções.",
      "São necessárias as idades de cada criança e a composição relevante para majorações. A idade introduzida no filtro é a sua, não a dos seus filhos.",
    ],
    elegivel: (p) =>
      p.agregado === 1 && p.idade !== null && p.idade >= 25
        ? fora(
            "Destina-se a agregados com crianças/jovens a cargo ou jovens até aos 24 anos em formação",
          )
        : possivel(),
  },
  {
    id: "prenatal",
    titulo: "Abono de família pré-natal",
    entidade: SS,
    descricao:
      "Apoio mensal durante a gravidez, a partir da 13.ª semana, sujeito a condições de residência, rendimentos e património.",
    valor: "88,43 € a 190,98 €/mês por bebé",
    link: "https://www.gov.pt/servicos/requerer-o-abono-de-familia-pre-natal",
    periodo: "Tabela de 2026; guia oficial publicado em 24/07/2026.",
    condicoes: [
      "Gravidez com pelo menos 13 semanas, comprovativo médico e residência ou equiparação.",
      "Escalões 1 a 4: 190,98 €, 161,65 €, 132,07 € e 88,43 € mensais por bebé. O quinto escalão não recebe.",
      "Património mobiliário até 128 911,20 €. O rendimento de referência tem um divisor próprio, não o total de pessoas da casa.",
      "O número de bebés e a majoração monoparental de 35%, quando aplicável, alteram o valor.",
    ],
    elegivel: (p) =>
      p.idade !== null && (p.idade < 14 || p.idade > 55)
        ? fora("Destina-se a mulheres grávidas a partir da 13.ª semana de gestação")
        : possivel(),
  },
  {
    id: "garantiainfancia",
    titulo: "Garantia para a Infância",
    entidade: SS,
    descricao:
      "Complemento do abono de família para menores de 18 anos de famílias com rendimentos muito baixos.",
    valor: "Abono + garantia: até 127,33 €/mês",
    link: "https://www.seg-social.pt/documents/10152/19882026/4004+-+Garantia+para+a+infancia",
    periodo: "Guia oficial publicado em 02/07/2026; montante conjunto de referência de 2026.",
    condicoes: [
      "Criança com menos de 18 anos, abono de família no primeiro escalão e rendimento de referência abaixo do limite específico.",
      "127,33 € é o total mensal do abono mais a garantia, não 127,33 € adicionais.",
      "Para beneficiários que já recebem abono em 2026, o guia usa rendimentos de 2024 e IAS de 2024, com limite de referência de 2 495,37 €.",
      "Não confundir esta prestação mensal da Segurança Social com o Complemento Garantia para a Infância de natureza fiscal.",
    ],
    elegivel: (p) =>
      p.agregado === 1 && p.idade !== null && p.idade >= 18
        ? fora("Destina-se a agregados com crianças ou jovens menores de 18 anos")
        : possivel(),
  },
  {
    id: "psi",
    titulo: "Prestação Social para a Inclusão",
    entidade: SS,
    descricao:
      "Apoio às pessoas com deficiência, com uma componente base e um eventual complemento sujeito a condições próprias.",
    valor: "Base de referência: 333,64 €/mês (adulto)",
    link: "https://www.gov.pt/servicos/requerer-a-prestacao-social-para-a-inclusao",
    periodo: "Guia oficial publicado em 03/07/2026; valores de referência de 2026.",
    condicoes: [
      "Residência legal e incapacidade certificada, em regra de pelo menos 60%, com regras próprias para pensionistas de invalidez.",
      "Verificar datas do atestado e da deficiência, nomeadamente quando a certificação ou o pedido ocorre após os 55 anos.",
      "Base de referência: 333,64 € por mês para adulto; 166,82 € para menor de 18 anos, antes das majorações. O valor efetivo pode depender de incapacidade e rendimentos.",
      "O complemento exige avaliação de recursos. Não se somam automaticamente valores máximos da base e do complemento.",
    ],
  },
  {
    id: "csi",
    titulo: "Complemento Solidário para Idosos",
    entidade: SS,
    descricao:
      "Complemento mensal para pessoas com baixos recursos que cumpram as condições de idade ou de pensão de invalidez, residência e rendimentos.",
    valor: "Variável · até 670 €/mês, titular isolado",
    link: "https://www.gov.pt/pt/servicos/pedir-o-complemento-solidario-para-idosos",
    periodo: "Guia oficial publicado em 21/05/2026.",
    condicoes: [
      "Na via normal de velhice, idade de 66 anos e 9 meses em 2026 e residência em Portugal durante pelo menos seis anos seguidos.",
      "Pensionistas de invalidez sem PSI têm uma via própria, sem essa idade mínima; por isso não excluímos apenas pela idade.",
      "Limite anual individual de recursos: 8 040 €. Para casal abrangido, 14 070 €, mantendo-se o limite individual.",
      "670 € é o limite mensal para titular isolado, não um pagamento fixo. Verificar pensões, rendimentos, património e recursos do cônjuge.",
    ],
    elegivel: (p) =>
      p.idade !== null && p.idade < 66
        ? fora(
            "Destina-se a pessoas a partir da idade legal de acesso à pensão de velhice (66 anos e 9 meses)",
          )
        : possivel(),
  },
  {
    id: "pensaosocial",
    titulo: "Pensão social de velhice",
    entidade: SS,
    descricao:
      "Pensão para pessoas na idade legal de acesso à velhice, com baixos rendimentos e sem proteção contributiva suficiente, nas situações abrangidas.",
    valor: "285,23 € ou 308,07 €/mês, com CES",
    link: "https://www.gov.pt/servicos/requerer-a-pensao-social-de-velhice",
    periodo: "Guia oficial publicado em 21/05/2026; montantes de 2026.",
    condicoes: [
      "Idade legal de 66 anos e 9 meses em 2026. Aos 66 anos é preciso confirmar os meses; o filtro só recolhe anos.",
      "Residência e nacionalidade ou enquadramento internacional abrangidos, ausência de proteção contributiva suficiente.",
      "Rendimentos mensais brutos até 214,85 € para pessoa isolada ou 322,28 € para casal.",
      "Base de 262,40 € e Complemento Extraordinário de Solidariedade (CES): total de 285,23 € abaixo dos 70 anos ou 308,07 € a partir dos 70. O guia prevê pagamento a dobrar em julho e dezembro.",
    ],
    elegivel: (p) => {
      if (p.idade !== null && p.idade < 66) {
        return fora("Ainda não atingiu a idade legal de 66 anos e 9 meses");
      }
      if (p.situacao === "Trabalhador") {
        return fora(
          "Destina-se a quem não tem atividade profissional e carece de proteção contributiva",
        );
      }
      return possivel();
    },
  },
  {
    id: "cuidador",
    titulo: "Subsídio de apoio ao cuidador informal principal",
    entidade: SS,
    descricao:
      "Prestação em dinheiro sujeita a condição de recursos para quem tem o estatuto reconhecido de cuidador informal principal.",
    valor: "Montante variável",
    link: "https://www.gov.pt/guias/apoio-a-familia/cuidador-informal",
    periodo:
      "Página oficial com limite expresso de 2026; datas editoriais indicadas de janeiro e outubro de 2026.",
    condicoes: [
      "Estatuto de cuidador informal principal reconhecido, coabitação e prestação permanente de cuidados nas condições previstas.",
      "Entre os 18 anos e a idade legal da pensão de velhice; confirmar os meses no limite superior.",
      "Rendimento de referência mensal da casa inferior a 698,27 € em 2026. Este valor é um limite de acesso, não o montante do subsídio.",
      "Verificar rendimentos ponderados, remunerações incompatíveis, dependência e prestações da pessoa cuidada.",
    ],
    elegivel: (p) => {
      if (p.idade !== null && (p.idade < 18 || p.idade >= 67)) {
        return fora("Fora do intervalo entre 18 anos e a idade legal de velhice");
      }
      if (p.agregado !== null && p.agregado < 2) {
        return fora("Requer coabitação com a pessoa cuidada (mínimo de 2 pessoas na habitação)");
      }
      return possivel();
    },
  },
  {
    id: "desempregosocial",
    titulo: "Subsídio social de desemprego",
    entidade: SS,
    descricao:
      "Prestação atribuída a quem se encontra em desemprego involuntário e não reúne o prazo de garantia para o subsídio de desemprego ou já esgotou a sua concessão, sujeita a condição de recursos.",
    valor: `Indexado ao IAS (${euros(IAS_VALUE)} ref.)`,
    link: "https://www.gov.pt/servicos/requerer-o-subsidio-social-de-desemprego",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Desemprego involuntário, inscrição no centro de emprego e cumprimento do prazo de garantia específico.",
      "Rendimento mensal por pessoa do agregado familiar (ponderado segundo a escala legal) até 80% do IAS.",
      "Património mobiliário do agregado familiar inferior a 240 vezes o IAS.",
    ],
    elegivel: (p) => {
      if (p.situacao === "Trabalhador") {
        return fora("Destina-se a situações de desemprego involuntário");
      }
      if (p.idade !== null && p.idade >= 67) {
        return fora(
          "Atingida a idade legal de reforma por velhice, cessa o subsídio social de desemprego",
        );
      }
      return possivel();
    },
  },
  {
    id: "parentalinicial",
    titulo: "Subsídio parental inicial",
    entidade: SS,
    descricao:
      "Prestação em dinheiro atribuída ao pai e/ou à mãe durante a licença parental por nascimento de filho, para substituir os rendimentos de trabalho perdidos.",
    valor: "80% a 100% da remuneração de referência",
    link: "https://www.gov.pt/servicos/requerer-o-subsidio-inicial",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Gozar a licença parental e cumprir o prazo de garantia de descontos para a Segurança Social.",
      "A percentagem depende da duração escolhida (120, 150 ou 180 dias) e da partilha da licença entre os progenitores.",
      "Caso não tenha descontos suficientes, pode verificar o subsídio social parental sujeito a condição de recursos.",
    ],
    elegivel: (p) =>
      p.idade !== null && (p.idade < 15 || p.idade > 60)
        ? fora("Destina-se a progenitores por nascimento ou adoção recente de filho")
        : possivel(),
  },
  {
    id: "parentalsocial",
    titulo: "Subsídio social parental",
    entidade: SS,
    descricao:
      "Apoio mensal em dinheiro para progenitores sem descontos suficientes para o subsídio parental contributivo e com baixos recursos.",
    valor: `Percentagem do IAS (${euros(IAS_VALUE)} ref.)`,
    link: "https://www.gov.pt/servicos/requerer-o-subsidio-social-parental",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Residência em Portugal e ausência de prazo de garantia para o subsídio parental contributivo.",
      "Rendimentos mensais por pessoa do agregado (ponderados) não superiores a 80% do IAS.",
      "Património mobiliário do agregado até 240 IAS.",
    ],
    elegivel: (p) =>
      p.idade !== null && (p.idade < 15 || p.idade > 60)
        ? fora("Destina-se a progenitores por nascimento ou adoção recente de filho")
        : possivel(),
  },
  {
    id: "abonomonoparental",
    titulo: "Majoração do abono para famílias monoparentais",
    entidade: SS,
    descricao:
      "Acréscimo de 50% ao valor do abono de família e do abono pré-natal para crianças e jovens que vivam com um único adulto responsável.",
    valor: "Acréscimo de 50% sobre o abono",
    link: "https://www.gov.pt/servicos/requerer-a-majoracao-do-abono-para-familias-monoparentais",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Direito ao abono de família para crianças e jovens (1.º ao 4.º escalão) ou abono pré-natal.",
      "Agregado constituído por uma única pessoa adulta a viver com as crianças ou jovens titulares.",
      "Não requerer um pedido autónomo se a composição monoparental já constar na Segurança Social.",
    ],
    elegivel: (p) =>
      p.agregado !== null && p.agregado < 2
        ? fora("A majoração monoparental pressupõe pelo menos um adulto e um menor ou gravidez")
        : possivel(),
  },
  {
    id: "abononumerosa",
    titulo: "Majoração do abono para famílias numerosas",
    entidade: SS,
    descricao:
      "Acréscimo mensal ao abono de família para crianças até aos 36 meses quando existem duas ou mais crianças no agregado familiar.",
    valor: "Variável conforme escalão e n.º de filhos",
    link: "https://www.gov.pt/servicos/requerer-a-majoracao-do-abono-para-familias-numerosas",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Criança titular de abono de família com idade até 36 meses inserida em agregado com dois ou mais filhos.",
      "Enquadramento nos escalões de rendimentos elegíveis do abono de família.",
    ],
    elegivel: (p) =>
      p.agregado !== null && p.agregado < 3
        ? fora("Requer agregado com pelo menos duas crianças além do titular adulto")
        : possivel(),
  },
  {
    id: "bonificacaodeficiencia",
    titulo: "Bonificação por deficiência do abono de família",
    entidade: SS,
    descricao:
      "Acréscimo mensal ao abono de família para crianças e jovens com deficiência até aos 24 anos que necessitem de apoio pedagógico ou terapêutico.",
    valor: "Variável conforme a idade e monoparentalidade",
    link: "https://www.gov.pt/servicos/requerer-a-bonificacao-por-deficiencia-do-abono-de-familia-para-criancas-e-jovens",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Crianças e jovens com menos de 24 anos com certificação médica de deficiência para efeitos desta prestação.",
      "Não acumula com a Prestação Social para a Inclusão (PSI) atribuída ao mesmo titular.",
    ],
    elegivel: (p) =>
      p.agregado === 1 && p.idade !== null && p.idade >= 25
        ? fora(
            "Destina-se a crianças e jovens dependentes até aos 24 anos com necessidades especiais",
          )
        : possivel(),
  },
  {
    id: "educacaoespecial",
    titulo: "Subsídio de educação especial",
    entidade: SS,
    descricao:
      "Apoio mensal para compensar encargos com a frequência de estabelecimentos adequados ou apoio individual especializado a crianças e jovens com deficiência.",
    valor: "Variável conforme despesas e rendimentos",
    link: "https://www.gov.pt/servicos/requerer-o-subsidio-de-educacao-especial",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Crianças e jovens com menos de 24 anos com redução permanente de capacidade comprovada.",
      "Frequência de instituição de educação especial ou apoio especializado prescrito medicamente.",
    ],
    elegivel: (p) =>
      p.agregado === 1 && p.idade !== null && p.idade >= 25
        ? fora(
            "Destina-se a crianças e jovens dependentes até aos 24 anos com necessidades especiais",
          )
        : possivel(),
  },
  {
    id: "bolsasegsocial",
    titulo: "Bolsa de estudo da Segurança Social (ensino secundário)",
    entidade: SS,
    descricao:
      "Prestação pecuniária mensal para combater o abandono escolar e apoiar jovens de famílias com baixos recursos que frequentem o ensino secundário ou equivalente.",
    valor: "Indexado ao escalão do abono de família",
    link: "https://www.gov.pt/servicos/obter-informacoes-sobre-a-bolsa-de-estudo-seguranca-social-",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Jovem titular de abono de família no 1.º ou 2.º escalão de rendimentos.",
      "Matrícula e frequência de curso do ensino secundário (10.º, 11.º ou 12.º ano) ou nível equivalente, com idade inferior a 18 anos no início do ano letivo.",
      "Aproveitamento escolar ao longo do ensino secundário.",
    ],
    elegivel: (p) => {
      if (p.situacao !== null && p.situacao !== "Estudante") {
        return fora("Destina-se exclusivamente a estudantes do ensino secundário");
      }
      if (p.idade !== null && p.idade >= 20) {
        return fora("Destina-se a estudantes no ensino secundário (limite regular de 18-19 anos)");
      }
      return possivel();
    },
  },
  {
    id: "complementodependencia",
    titulo: "Complemento por dependência",
    entidade: SS,
    descricao:
      "Prestação mensal em dinheiro atribuída a pensionistas (ou beneficiários abrangidos) que se encontram em situação de dependência e precisam da ajuda de terceira pessoa.",
    valor: "Percentagem da pensão social (1.º ou 2.º grau)",
    link: "https://www.gov.pt/servicos/obter-informacoes-sobre-o-complemento-por-dependencia",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Certificação da situação de dependência pelo sistema de verificação de incapacidades da Segurança Social.",
      "Aplica-se a pensionistas de invalidez, velhice e sobrevivência ou beneficiários de regimes não contributivos.",
    ],
  },
  {
    id: "pensaoinvalidez",
    titulo: "Pensão de invalidez",
    entidade: SS,
    descricao:
      "Prestação mensal atribuída a beneficiários que, antes da idade de reforma, fiquem com incapacidade permanente para o trabalho por causa não profissional.",
    valor: "Depende da carreira contributiva e grau",
    link: "https://www.gov.pt/servicos/obter-informacoes-sobre-a-pensao-de-invalidez",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Incapacidade permanente (relativa ou absoluta) certificada pelo Sistema de Verificação de Incapacidades.",
      "Cumprimento do prazo de garantia de descontos (3 ou 5 anos conforme o tipo de invalidez).",
    ],
    elegivel: (p) =>
      p.idade !== null && p.idade >= 67
        ? fora(
            "A partir da idade legal de reforma a pensão de invalidez converte-se em pensão de velhice",
          )
        : possivel(),
  },
  {
    id: "subsidiodoenca",
    titulo: "Subsídio de doença",
    entidade: SS,
    descricao:
      "Prestação em dinheiro atribuída para compensar a perda de remuneração resultante de impedimento temporário para o trabalho por motivo de doença certificada.",
    valor: "55% a 75% da remuneração de referência",
    link: "https://www.gov.pt/servicos/obter-informacoes-sobre-o-subsidio-de-doenca",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Certificado de Incapacidade Temporária emitido pelos serviços de saúde (SNS) e prazo de garantia de 6 meses com registo de remunerações.",
      "Cumprimento do índice de profissionalidade quando aplicável e dos deveres de permanência no domicílio.",
    ],
  },
  {
    id: "isencaotaxas",
    titulo: "Isenção de taxas moderadoras por insuficiência económica",
    entidade: "SNS · Administração Central do Sistema de Saúde",
    descricao:
      "Dispensa do pagamento de taxas moderadoras nas prestações de saúde do Serviço Nacional de Saúde para agregados com baixos rendimentos.",
    valor: "Isenção aplicável no SNS",
    link: "https://www.gov.pt/servicos/pedir-a-isencao-de-taxas-moderadoras-por-insuficiencia-economica",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Rendimento médio mensal do agregado familiar (apurado pela Autoridade Tributária) não superior a 1,5 vezes o IAS.",
      "Para cálculo da AT, os rendimentos anuais do agregado são divididos por 12 meses e pelo número de sujeitos passivos.",
    ],
  },
  {
    id: "protecaojuridica",
    titulo: "Proteção jurídica (apoio judiciário)",
    entidade: "Segurança Social · Ministério da Justiça",
    descricao:
      "Apoio do Estado para assegurar o acesso ao direito e aos tribunais (dispensa de taxa de justiça, pagamento faseado ou nomeação de advogado) a quem não tem meios económicos suficientes.",
    valor: "Dispensa total ou pagamento faseado",
    link: "https://www.gov.pt/servicos/pedir-protecao-juridica",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Demonstração de insuficiência económica calculada segundo a fórmula legal de rendimentos, património e encargos permanentes do agregado familiar.",
      "Requerimento apresentado junto dos serviços da Segurança Social antes da primeira intervenção processual.",
    ],
  },
  {
    id: "mobilidadeilhas",
    titulo: "Subsídio Social de Mobilidade (Açores e Madeira)",
    entidade: "gov.pt · Mobilidade e Transportes",
    descricao:
      "Reembolso parcial do custo de viagens aéreas e marítimas entre as Regiões Autónomas (Açores e Madeira) e o Continente ou entre as duas regiões para residentes e estudantes elegíveis.",
    valor: "Reembolso acima do teto máximo elegível",
    link: "https://www.gov.pt/servicos/pedir-o-subsidio-social-de-mobilidade",
    periodo: "Serviço oficial gov.pt consultado em outubro de 2026.",
    condicoes: [
      "Residência habitual numa das Regiões Autónomas (Açores ou Madeira) ou estatuto de estudante elegível.",
      "Apresentação da fatura, bilhete, cartões de embarque e comprovativos de elegibilidade e situação tributária e contributiva regularizada.",
    ],
    elegivel: (p) =>
      p.distrito !== "" &&
      p.distrito !== "Região Autónoma dos Açores" &&
      p.distrito !== "Região Autónoma da Madeira" &&
      p.situacao !== "Estudante"
        ? fora(
            "Destina-se a residentes nas Regiões Autónomas dos Açores e da Madeira ou estudantes deslocados elegíveis",
          )
        : possivel(),
  },
  {
    id: "porta65mais",
    titulo: "Porta 65+ (Arrendamento por quebra de rendimentos ou monoparentalidade)",
    entidade: "Portal da Habitação · IHRU",
    descricao:
      "Vertente do programa Porta 65 alargada sem o limite geral de idade de 35 anos para agregados monoparentais ou com quebra de rendimentos superior a 20%.",
    valor: "Percentagem variável da renda",
    link: "https://www.portaldahabitacao.pt/porta-65-jovem1",
    periodo: "Portal da Habitação consultado em outubro de 2026.",
    condicoes: [
      "Agregado monoparental ou comprovativo de quebra de rendimentos superior a 20% face aos três meses anteriores ou ao período homólogo.",
      "Cumprimento das regras de contrato de arrendamento permanente, limites de renda e taxa de esforço do programa.",
    ],
    elegivel: (p) =>
      p.idade !== null && p.idade < 18
        ? fora("Requer maioridade para titularidade do contrato de arrendamento")
        : possivel(),
  },
];
export const APOIOS: Apoio[] = REGISTOS.map((a) => ({
  ...a,
  verificadoEm: DATA,
  elegivel: a.elegivel ?? possivel,
}));
export interface ApoioAvaliado extends Apoio {
  resultado: ResultadoElegibilidade;
}
/** True means not ruled out by known fields, NEVER verified entitlement. */
export const avaliarApoios = (p: Perfil): ApoioAvaliado[] =>
  APOIOS.map((a) => ({ ...a, resultado: avaliarComFiltrosExtras(a, p) })).sort(
    (a, b) => Number(b.resultado.ok) - Number(a.resultado.ok),
  );

/**
 * Conservative post-filters for the housing and dependent-children quick fields.
 * They only rule supports out; they never confirm entitlement.
 */
function avaliarComFiltrosExtras(a: Apoio, p: Perfil): ResultadoElegibilidade {
  const base = a.elegivel(p);
  if (!base.ok) return base;
  if (p.habitacao === "propria" && a.condicoes.some((c) => /arrend/i.test(c))) {
    return fora("Exige habitação arrendada com contrato");
  }
  if (
    p.filhos === "nao" &&
    a.condicoes.some((c) => /filhos?|crianças?|descendentes?|progenitor/i.test(c))
  ) {
    return fora("Destina-se a agregados com filhos ou dependentes a cargo");
  }
  return base;
}

/**
 * Browser-only conservative evaluation for additional benefits discovered live by the scraper.
 * Only rules out explicit hard incompatibilities with the 5 profile fields.
 */
export function avaliarApoioDescoberto(
  titulo: string,
  descricao: string,
  p: Perfil,
): ResultadoElegibilidade {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  // Desemprego
  if (
    p.situacao === "Trabalhador" &&
    /subs[íi]dio.*desemprego/.test(texto) &&
    !/parcial/.test(texto)
  ) {
    return fora("Destina-se a situações de desemprego involuntário");
  }
  if (p.idade !== null && p.idade >= 67 && /subs[íi]dio.*desemprego/.test(texto)) {
    return fora("Atingida a idade legal de reforma por velhice, cessa a proteção no desemprego");
  }

  // Velhice / Reforma / Aposentação / Idosos / Terceira Idade / CGA
  if (
    p.idade !== null &&
    p.idade < 65 &&
    /(idoso|idosos|velhice|aposenta[çc]|reforma\b|terceira idade|cga\b|complemento solidário para idosos)/i.test(
      texto,
    ) &&
    !/invalidez/i.test(texto)
  ) {
    return fora("Medida direcionada a pessoas idosas ou na idade legal de reforma por velhice");
  }

  // Juventude / Estudantes
  if (
    p.idade !== null &&
    p.idade > 35 &&
    /(porta 65-jovem|porta 65 jovem|irs jovem|sub23|passe.*jovem|medida jovem|ensino secund[áa]rio|apoio aos jovens)/i.test(
      texto,
    )
  ) {
    return fora("Ultrapassa o limite etário aplicável a medidas para a juventude");
  }

  // Estudantes
  if (
    p.situacao !== null &&
    p.situacao !== "Estudante" &&
    /(bolsa de estudo|a[çc][ãa]o social escolar)/i.test(texto)
  ) {
    return fora("Destina-se exclusivamente a estudantes matriculados");
  }
  if (
    p.idade !== null &&
    p.idade >= 67 &&
    /(bolsa de estudo|a[çc][ãa]o social escolar)/i.test(texto)
  ) {
    return fora("Destina-se a estudantes antes da idade legal de reforma por velhice");
  }

  // Crianças e infância para adultos isolados
  if (
    p.agregado === 1 &&
    p.idade !== null &&
    p.idade >= 25 &&
    /(abono de fam[íi]lia|garantia para a inf[âa]ncia|bonifica[çc][ãa]o por defici[êe]ncia|educa[çc][ãa]o especial|creche feliz)/i.test(
      texto,
    )
  ) {
    return fora("Destina-se a agregados com crianças ou jovens dependentes a cargo");
  }

  // Residentes nas Ilhas (Açores e Madeira)
  if (
    p.distrito !== "" &&
    p.distrito !== "Região Autónoma dos Açores" &&
    p.distrito !== "Região Autónoma da Madeira" &&
    p.situacao !== "Estudante" &&
    /subs[íi]dio social de mobilidade/.test(texto)
  ) {
    return fora("Destina-se a residentes nos Açores/Madeira ou estudantes deslocados elegíveis");
  }

  return possivel();
}

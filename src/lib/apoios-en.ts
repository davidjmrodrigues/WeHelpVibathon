import type { Lingua } from "./idioma";

/**
 * Overlay de inglês para o catálogo verificado. NÃO altera regras de elegibilidade:
 * substitui apenas os textos apresentados. Os apoios descobertos automaticamente
 * (gov.pt) mantêm o conteúdo oficial em português.
 */

export interface ApoioTextoEn {
  titulo: string;
  entidade: string;
  descricao: string;
  valor: string;
  periodo: string;
  condicoes: string[];
}

export const APOIOS_EN: Record<string, ApoioTextoEn> = {
  porta65: {
    titulo: "Porta 65 Jovem (Young Renting Programme)",
    entidade: "Housing Portal · IHRU",
    descricao:
      "Support for renting a permanent home, covering a percentage of the rent. The amount depends on the application and the applicable rules.",
    valor: "Variable percentage of the rent",
    periodo: "Official FAQ consulted in October 2026; no visible editorial date.",
    condicoes: [
      "As a rule: aged 18 to 35. In a couple, one member may be up to 37 if the other meets the 35 limit.",
      "Check permanent residence, household typology, ownership of another home, relationship with the landlord and conflicts with other benefits.",
      "The rent cannot exceed 60% of the household's average gross monthly income. Monthly corrected income limits apply, linked to the maximum reference rent and the guaranteed minimum monthly wage, not to the IAS.",
      "You may apply without a contract, subject to signing within the deadline set after approval.",
    ],
  },
  sub23: {
    titulo: "Free public transport pass for young people",
    entidade: "gov.pt · Public transport",
    descricao:
      "Free pass covered by the measure for young people up to 23, students and non-students alike. Not the same as free access to every transport service.",
    valor: "Covered pass is free",
    periodo: "Measure announced in December 2024; confirm current coverage and conditions with the operator.",
    condicoes: [
      "Up to 23 years old, whether or not you are a student.",
      "Prove your age and request or activate the pass with the operator. Confirm the services and area covered.",
    ],
  },
  irsjovem: {
    titulo: "IRS Jovem (Young Person's Income Tax Relief)",
    entidade: "Tax Authority · gov.pt",
    descricao:
      "Exemption from income tax on dependent or self-employed work income, for up to ten years within the age limit. The rates are 100% in the first year, 75% from the second to the fourth, 50% from the fifth to the seventh and 25% from the eighth to the tenth.",
    valor: "Exemption limit: €29,542.15/year",
    periodo: "Income for 2026. The 55 IAS limit is exempt income, not a saving in tax paid.",
    condicoes: [
      "Be up to 35 years old and have category A and/or B income in the relevant tax year.",
      "Check the years of income counted, dependent status, exclusions, conflicts with other regimes and tax situation.",
      "55 IAS = €29,542.15 in 2026. The actual saving depends on your income and the IRS that would be due; it is not an amount you receive.",
    ],
  },
  bolsadges: {
    titulo: "DGES higher education grant",
    entidade: "Directorate-General for Higher Education",
    descricao:
      "Social support for higher education students, subject to assessment of income, assets and academic conditions.",
    valor: "Variable amount",
    periodo:
      "Official simulator consulted refers to 2025/2026; confirm the 2026/2027 regulations and deadlines with the social action services.",
    condicoes: [
      "Enrolment in a covered course, academic requirements and residence or nationality framework.",
      "Assessment of income, assets and tax and social security situation under the regulations for the academic year.",
      "The simulator is indicative and does not bind the services. The old fictional limit of 24 years or 16 IAS of household income does not apply here.",
    ],
  },
  desemprego: {
    titulo: "Unemployment benefit",
    entidade: "Social Security",
    descricao:
      "Cash benefit to compensate for the loss of earnings due to involuntary unemployment for covered workers.",
    valor: "Depends on previous earnings",
    periodo: "Official page updated on 15/09/2026.",
    condicoes: [
      "Involuntary unemployment, sufficient contribution record and coverage under a protected scheme.",
      "Registration for employment, availability to work and meeting the application deadline.",
      "The household's annual income does not determine the reference earnings or the amount of the benefit.",
    ],
  },
  rsi: {
    titulo: "Social Integration Income (RSI)",
    entidade: "Social Security",
    descricao:
      "Monthly benefit for people and families with very low resources, linked to a social and professional integration agreement.",
    valor: "Variable amount depending on resources",
    periodo: "Official guide published on 03/07/2026.",
    condicoes: [
      "Legal residence under the applicable conditions and assessment of the household's income and assets.",
      "For a single person, the guide indicates gross monthly income below €247.56. It is not a fixed payment for everyone.",
      "Financial assets up to 60 IAS: €32,227.80 in 2026. Commitment to the integration agreement and registration for employment where applicable.",
      "As a rule from age 18, with exceptions. The age filter does not assess those exceptions.",
    ],
  },
  tarifaeletricidade: {
    titulo: "Social electricity tariff",
    entidade: "DGEG · ERSE",
    descricao:
      "Discount on electricity for economically vulnerable consumers. It is normally granted automatically, after the conditions are checked.",
    valor: "Average discount of 33.8%",
    periodo:
      "ERSE leaflet from October 2026; average discount indicated for January 2026, excluding taxes and levies.",
    condicoes: [
      "Contract in the beneficiary's name, domestic consumption at the permanent home and contracted power up to 6.9 kVA.",
      "Receiving an eligible benefit or meeting the legal income condition: annual base of €6,272.64, plus 50% per member without income, up to the legal maximum of ten.",
      "The number of people in the home does not tell how many have no income. We do not apply that formula automatically.",
      "33.8% is an average discount excluding taxes and levies, not a guaranteed reduction of the final bill by that percentage.",
    ],
  },
  tarifagas: {
    titulo: "Social natural gas tariff",
    entidade: "DGEG · ERSE",
    descricao:
      "Discount on piped natural gas for consumers receiving covered social benefits. It does not apply to bottled gas.",
    valor: "Average discount of 31.2%",
    periodo: "October 2026 to September 2027; average percentage excluding taxes and levies.",
    condicoes: [
      "Contract in the beneficiary's name, permanent home, low-pressure supply and annual consumption up to 500 m³.",
      "Receiving a covered benefit, such as CSI, RSI, unemployment benefit, the first bracket of child benefit or certain disability or inclusion benefits.",
      "The low-income alternative of the electricity tariff is not automatically applicable to gas. The average discount does not reduce the whole bill.",
    ],
  },
  abono: {
    titulo: "Child benefit for children and young people",
    entidade: "Social Security",
    descricao:
      "Monthly support to help with the upkeep and education of children and young people. The amount varies with the income bracket, age and applicable supplements.",
    valor: "Depends on bracket and age",
    periodo: "Official guide published on 14/07/2026.",
    condicoes: [
      "Covered children or young people and residence in Portugal or an equivalent situation.",
      "Eligible income bracket and household financial assets up to €128,911.20 in 2026.",
      "From age 16, enrolment in the required levels of education. As a rule the young person cannot be in paid work, with exceptions.",
      "Each child's age and the relevant household composition are needed for supplements. The age entered in the filter is yours, not your children's.",
    ],
  },
  prenatal: {
    titulo: "Pre-natal family benefit",
    entidade: "Social Security",
    descricao:
      "Monthly support during pregnancy, from the 13th week, subject to residence, income and asset conditions.",
    valor: "€88.43 to €190.98/month per baby",
    periodo: "2026 table; official guide published on 24/07/2026.",
    condicoes: [
      "Pregnancy of at least 13 weeks, medical proof and residence or equivalence.",
      "Brackets 1 to 4: €190.98, €161.65, €132.07 and €88.43 monthly per baby. The fifth bracket receives nothing.",
      "Financial assets up to €128,911.20. The reference income has its own divisor, not the total number of people in the home.",
      "The number of babies and the 35% single-parent supplement, where applicable, change the amount.",
    ],
  },
  garantiainfancia: {
    titulo: "Child Guarantee (Garantia para a Infância)",
    entidade: "Social Security",
    descricao:
      "Supplement to child benefit for children under 18 in families with very low incomes.",
    valor: "Benefit + guarantee: up to €127.33/month",
    periodo: "Official guide published on 02/07/2026; combined reference amount for 2026.",
    condicoes: [
      "Child under 18, child benefit in the first bracket and reference income below the specific limit.",
      "€127.33 is the total monthly amount of the benefit plus the guarantee, not €127.33 on top.",
      "For beneficiaries already receiving child benefit in 2026, the guide uses 2024 income and the 2024 IAS, with a reference limit of €2,495.37.",
      "Do not confuse this Social Security monthly benefit with the tax-side Child Guarantee supplement.",
    ],
  },
  psi: {
    titulo: "Social Inclusion Benefit (PSI)",
    entidade: "Social Security",
    descricao:
      "Support for people with disabilities, with a base component and a possible supplement subject to its own conditions.",
    valor: "Reference base: €333.64/month (adult)",
    periodo: "Official guide published on 03/07/2026; reference values for 2026.",
    condicoes: [
      "Legal residence and certified incapacity, as a rule of at least 60%, with specific rules for invalidity pensioners.",
      "Check the dates of the medical report and of the disability, especially when certification or the application happens after age 55.",
      "Reference base: €333.64 per month for an adult; €166.82 for a person under 18, before supplements. The effective amount may depend on incapacity and income.",
      "The supplement requires a resource assessment. Maximum base and supplement values are not added automatically.",
    ],
  },
  csi: {
    titulo: "Solidarity Supplement for the Elderly (CSI)",
    entidade: "Social Security",
    descricao:
      "Monthly supplement for people with low resources who meet the age or invalidity pension conditions, plus residence and income requirements.",
    valor: "Variable · up to €670/month, single claimant",
    periodo: "Official guide published on 21/05/2026.",
    condicoes: [
      "On the ordinary old-age route, an age of 66 years and 9 months in 2026 and residence in Portugal for at least six consecutive years.",
      "Invalidity pensioners without the PSI have their own route, without that minimum age; so we do not exclude on age alone.",
      "Individual annual resource limit: €8,040. For a covered couple, €14,070, while the individual limit remains.",
      "€670 is the monthly limit for a single claimant, not a fixed payment. Check pensions, income, assets and the spouse's resources.",
    ],
  },
  pensaosocial: {
    titulo: "Social old-age pension",
    entidade: "Social Security",
    descricao:
      "Pension for people at the legal old-age age with low income and no sufficient contributory protection, in the covered situations.",
    valor: "€285.23 or €308.07/month, with CES",
    periodo: "Official guide published on 21/05/2026; amounts for 2026.",
    condicoes: [
      "Legal age of 66 years and 9 months in 2026. At exactly 66 the months must be confirmed; the filter only collects years.",
      "Residence and nationality or international framework covered, and no sufficient contributory protection.",
      "Gross monthly income up to €214.85 for a single person or €322.28 for a couple.",
      "Base of €262.40 plus the Extraordinary Solidarity Supplement (CES): a total of €285.23 under 70 or €308.07 from 70. The guide provides for double payment in July and December.",
    ],
  },
  cuidador: {
    titulo: "Support benefit for the main informal carer",
    entidade: "Social Security",
    descricao:
      "Cash benefit subject to a resource condition for people recognised as main informal carers.",
    valor: "Variable amount",
    periodo:
      "Official page with an express 2026 limit; editorial dates indicated as January and October 2026.",
    condicoes: [
      "Recognition as a main informal carer, cohabitation and permanent provision of care under the specified conditions.",
      "Between 18 and the legal old-age age; confirm the months at the upper limit.",
      "Household monthly reference income below €698.27 in 2026. This figure is an eligibility threshold, not the amount of the benefit.",
      "Check weighted income, incompatible earnings, the cared-for person's dependency and benefits.",
    ],
  },
  desempregosocial: {
    titulo: "Social unemployment benefit",
    entidade: "Social Security",
    descricao:
      "Benefit for people involuntarily unemployed who do not meet the contribution period for the standard unemployment benefit or have exhausted it, subject to a resource condition.",
    valor: "Indexed to the IAS (€537.13 ref.)",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Involuntary unemployment, registration with the employment centre and meeting the specific contribution period.",
      "Monthly income per household member (weighted under the legal scale) up to 80% of the IAS.",
      "Household financial assets below 240 times the IAS.",
    ],
  },
  parentalinicial: {
    titulo: "Initial parental benefit",
    entidade: "Social Security",
    descricao:
      "Cash benefit paid to the father and/or mother during parental leave after the birth of a child, to replace lost work income.",
    valor: "80% to 100% of reference earnings",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Taking the parental leave and meeting the Social Security contribution period.",
      "The percentage depends on the duration chosen (120, 150 or 180 days) and on sharing the leave between the parents.",
      "If you have insufficient contributions, check the means-tested social parental benefit.",
    ],
  },
  parentalsocial: {
    titulo: "Social parental benefit",
    entidade: "Social Security",
    descricao:
      "Monthly cash support for parents without enough contributions for the contributory parental benefit and with low resources.",
    valor: "Percentage of the IAS (€537.13 ref.)",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Residence in Portugal and absence of the contribution period for the contributory parental benefit.",
      "Monthly income per household member (weighted) not exceeding 80% of the IAS.",
      "Household financial assets up to 240 IAS.",
    ],
  },
  abonomonoparental: {
    titulo: "Single-parent supplement to child benefit",
    entidade: "Social Security",
    descricao:
      "An extra 50% added to the child benefit and the pre-natal benefit for children and young people living with a single responsible adult.",
    valor: "An extra 50% on the benefit",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Entitlement to child benefit (brackets 1 to 4) or the pre-natal benefit.",
      "Household made up of a single adult living with the children or young people who are beneficiaries.",
      "No separate application is needed if the single-parent composition is already registered with Social Security.",
    ],
  },
  abononumerosa: {
    titulo: "Large-family supplement to child benefit",
    entidade: "Social Security",
    descricao:
      "Monthly extra added to child benefit for children up to 36 months when there are two or more children in the household.",
    valor: "Variable by bracket and number of children",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "A child receiving child benefit aged up to 36 months, in a household with two or more children.",
      "Placement in the eligible income brackets of child benefit.",
    ],
  },
  bonificacaodeficiencia: {
    titulo: "Disability supplement to child benefit",
    entidade: "Social Security",
    descricao:
      "Monthly extra added to child benefit for children and young people with a disability up to 24 who need pedagogical or therapeutic support.",
    valor: "Variable by age and single-parent status",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Children and young people under 24 with medical certification of disability for the purposes of this benefit.",
      "It does not combine with the Social Inclusion Benefit (PSI) granted to the same person.",
    ],
  },
  educacaoespecial: {
    titulo: "Special education benefit",
    entidade: "Social Security",
    descricao:
      "Monthly support to cover the costs of attending suitable establishments or specialised individual support for children and young people with disabilities.",
    valor: "Variable by costs and income",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Children and young people under 24 with proven permanent reduction of capacity.",
      "Attendance at a special education institution or medically prescribed specialised support.",
    ],
  },
  bolsasegsocial: {
    titulo: "Social Security study grant (secondary education)",
    entidade: "Social Security",
    descricao:
      "Monthly cash benefit to fight school dropout and support young people from low-income families attending secondary or equivalent education.",
    valor: "Indexed to the child benefit bracket",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Young person receiving child benefit in the 1st or 2nd income bracket.",
      "Enrolment and attendance of a secondary education course (10th, 11th or 12th year) or equivalent level, under 18 at the start of the school year.",
      "Satisfactory school progress throughout secondary education.",
    ],
  },
  complementodependencia: {
    titulo: "Dependency supplement",
    entidade: "Social Security",
    descricao:
      "Monthly cash benefit for pensioners (or covered beneficiaries) in a situation of dependency who need help from a third person.",
    valor: "Percentage of the social pension (1st or 2nd degree)",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Certification of the dependency situation by the Social Security incapacity verification system.",
      "Applies to invalidity, old-age and survivors' pensioners or beneficiaries of non-contributory schemes.",
    ],
  },
  pensaoinvalidez: {
    titulo: "Invalidity pension",
    entidade: "Social Security",
    descricao:
      "Monthly benefit for beneficiaries who, before retirement age, are left with a permanent incapacity for work from a non-occupational cause.",
    valor: "Depends on contribution record and degree",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Permanent incapacity (relative or absolute) certified by the Incapacity Verification System.",
      "Meeting the contribution period (3 or 5 years depending on the type of invalidity).",
    ],
  },
  subsidiodoenca: {
    titulo: "Sickness benefit",
    entidade: "Social Security",
    descricao:
      "Cash benefit to compensate for the loss of earnings caused by a temporary incapacity for work due to certified illness.",
    valor: "55% to 75% of reference earnings",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Temporary Incapacity Certificate issued by the health services (SNS) and a 6-month contribution period with recorded earnings.",
      "Meeting the professionalism index where applicable and the duties of staying at home.",
    ],
  },
  isencaotaxas: {
    titulo: "Exemption from user fees for economic hardship",
    entidade: "SNS · Central Administration of the Health System",
    descricao:
      "Exemption from paying user fees for National Health Service care for households with low income.",
    valor: "Exemption applied within the SNS",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Average monthly household income (assessed by the Tax Authority) not exceeding 1.5 times the IAS.",
      "For the Tax Authority's calculation, the household's annual income is divided by 12 months and by the number of taxpayers.",
    ],
  },
  protecaojuridica: {
    titulo: "Legal protection (legal aid)",
    entidade: "Social Security · Ministry of Justice",
    descricao:
      "State support to guarantee access to law and the courts (exemption from court fees, staged payment or appointment of a lawyer) for those without sufficient financial means.",
    valor: "Full exemption or staged payment",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Demonstrated economic hardship, calculated under the legal formula of income, assets and permanent expenses of the household.",
      "Application submitted to the Social Security services before the first procedural step.",
    ],
  },
  mobilidadeilhas: {
    titulo: "Social Mobility Subsidy (Azores and Madeira)",
    entidade: "gov.pt · Mobility and Transport",
    descricao:
      "Partial reimbursement of the cost of air and sea travel between the Autonomous Regions (Azores and Madeira) and the Mainland, or between the two regions, for eligible residents and students.",
    valor: "Reimbursement above the eligible cap",
    periodo: "Official gov.pt service consulted in October 2026.",
    condicoes: [
      "Habitual residence in one of the Autonomous Regions (Azores or Madeira) or eligible student status.",
      "Presentation of the invoice, ticket, boarding passes and proof of eligibility, with a regular tax and social security situation.",
    ],
  },
  porta65mais: {
    titulo: "Porta 65+ (Renting after loss of income or single parenthood)",
    entidade: "Housing Portal · IHRU",
    descricao:
      "Stream of the Porta 65 programme extended beyond the general 35 age limit for single-parent households or households with an income drop above 20%.",
    valor: "Variable percentage of the rent",
    periodo: "Housing Portal consulted in October 2026.",
    condicoes: [
      "Single-parent household or proof of an income drop above 20% compared with the previous three months or the same period last year.",
      "Compliance with the programme's rules on permanent tenancy contracts, rent limits and rent-to-income ratio.",
    ],
  },
};

/** Tradução dos motivos de exclusão (chave = texto exato em português). */
export const MOTIVOS_EN: Record<string, string> = {
  "Exige habitação arrendada com contrato": "Requires rented housing with a contract",
  "Destina-se a agregados com filhos ou dependentes a cargo":
    "Intended for households with children or dependents",
  "Fora das idades previstas, incluindo a exceção para casais":
    "Outside the applicable ages, including the exception for couples",
  "Destina-se a jovens (18 a 35 anos), incompatível com a situação de reformado":
    "Intended for young people (18 to 35 years old), incompatible with being retired",
  "Destina-se a jovens até aos 23 anos, incompatível com a situação de reformado":
    "Intended for young people up to 23 years old, incompatible with being retired",
  "Destina-se a situações de desemprego involuntário, incompatível com a situação de reformado":
    "Intended for situations of involuntary unemployment, incompatible with being retired",
  "Destina-se a quem não tem proteção contributiva; quem está reformado já recebe pensão":
    "Intended for those without contributory coverage; retired people already receive a pension",
  "O subsídio de cuidador informal principal aplica-se até à idade legal da pensão de velhice":
    "The main informal carer allowance applies up to the legal old-age pension age",
  "A pensão de invalidez converte-se em pensão de velhice na idade legal de reforma":
    "The invalidity pension converts into an old-age pension at the legal retirement age",
  "Destina-se a compensar a perda de remuneração por impedimento temporário para o trabalho":
    "Intended to compensate lost pay for temporary inability to work",
  "Idade superior a 23 anos": "Older than 23",
  "O IRS Jovem destina-se a jovens entre os 18 e os 35 anos":
    "IRS Jovem is for young people between 18 and 35",
  "O IRS Jovem aplica-se a rendimentos de trabalho dependente ou independente (categorias A e B)":
    "IRS Jovem applies to dependent or self-employed work income (categories A and B)",
  "Destina-se exclusivamente a estudantes matriculados no ensino superior":
    "Intended exclusively for students enrolled in higher education",
  "Destina-se a estudantes antes da idade legal de reforma de velhice":
    "For students before the legal old-age retirement age",
  "O subsídio destina-se a situações de desemprego; os apoios parciais têm regras próprias":
    "The benefit is for unemployment situations; partial benefits have their own rules",
  "Atingida a idade legal de reforma por velhice, cessa a proteção no desemprego":
    "At the legal old-age retirement age, unemployment protection ends",
  "Destina-se a agregados com crianças/jovens a cargo ou jovens até aos 24 anos em formação":
    "For households with children or young dependants, or young people in training up to 24",
  "Destina-se a mulheres grávidas a partir da 13.ª semana de gestação":
    "For pregnant women from the 13th week of pregnancy",
  "Destina-se a agregados com crianças ou jovens menores de 18 anos":
    "For households with children or young people under 18",
  "Destina-se a pessoas a partir da idade legal de acesso à pensão de velhice (66 anos e 9 meses)":
    "For people from the legal age for the old-age pension (66 years and 9 months)",
  "Ainda não atingiu a idade legal de 66 anos e 9 meses":
    "You have not yet reached the legal age of 66 years and 9 months",
  "Destina-se a quem não tem atividade profissional e carece de proteção contributiva":
    "For people without paid work who lack contributory protection",
  "Fora do intervalo entre 18 anos e a idade legal de velhice":
    "Outside the range between age 18 and the legal old-age age",
  "Requer coabitação com a pessoa cuidada (mínimo de 2 pessoas na habitação)":
    "Requires cohabitation with the cared-for person (at least 2 people in the home)",
  "Destina-se a situações de desemprego involuntário":
    "For situations of involuntary unemployment",
  "Atingida a idade legal de reforma por velhice, cessa o subsídio social de desemprego":
    "At the legal old-age retirement age, the social unemployment benefit ends",
  "Destina-se a progenitores por nascimento ou adoção recente de filho":
    "For parents by birth or recent adoption of a child",
  "A majoração monoparental pressupõe pelo menos um adulto e um menor ou gravidez":
    "The single-parent supplement requires at least one adult and a minor or a pregnancy",
  "Requer agregado com pelo menos duas crianças além do titular adulto":
    "Requires a household with at least two children besides the adult",
  "Destina-se a crianças e jovens dependentes até aos 24 anos com necessidades especiais":
    "For dependent children and young people up to 24 with special needs",
  "Destina-se exclusivamente a estudantes do ensino secundário":
    "Intended exclusively for secondary education students",
  "Destina-se a estudantes no ensino secundário (limite regular de 18-19 anos)":
    "For secondary education students (regular limit of 18-19 years)",
  "A partir da idade legal de reforma a pensão de invalidez converte-se em pensão de velhice":
    "From the legal retirement age the invalidity pension converts into an old-age pension",
  "Destina-se a residentes nas Regiões Autónomas dos Açores e da Madeira ou estudantes deslocados elegíveis":
    "For residents of the Azores and Madeira Autonomous Regions or eligible displaced students",
  "Requer maioridade para titularidade do contrato de arrendamento":
    "Requires legal adulthood to hold the tenancy contract",
  "Medida direcionada a pessoas idosas ou na idade legal de reforma por velhice":
    "Measure aimed at older people or those at the legal old-age retirement age",
  "Ultrapassa o limite etário aplicável a medidas para a juventude":
    "Over the age limit applicable to youth measures",
  "Destina-se exclusivamente a estudantes matriculados":
    "Intended exclusively for enrolled students",
  "Destina-se a agregados com crianças ou jovens dependentes a cargo":
    "For households with dependent children or young people in their care",
  "Destina-se a residentes nos Açores/Madeira ou estudantes deslocados elegíveis":
    "For residents of the Azores/Madeira or eligible displaced students",
  // Motivos do motor de compatibilidade (src/lib/wishlist.ts)
  "A Prestação Social para a Inclusão (PSI) e a Bonificação por Deficiência do abono de família não podem ser acumuladas pelo mesmo titular.":
    "The Social Inclusion Benefit (PSI) and the family allowance disability supplement cannot be received by the same person.",
  "A Pensão Social de Velhice é incompatível com o Subsídio de Desemprego. Atingida a idade legal de velhice, cessa o subsídio de desemprego.":
    "The non-contributory old-age pension is incompatible with the unemployment benefit. At the legal old-age age, the unemployment benefit ends.",
  "A Pensão Social de Velhice não pode ser auferida em simultâneo com o Subsídio Social de Desemprego.":
    "The non-contributory old-age pension cannot be received at the same time as the social unemployment benefit.",
  "O Subsídio de Desemprego (contributivo) e o Subsídio Social de Desemprego inicial destinam-se à mesma perda de rendimento e são regimes alternativos.":
    "The (contributory) unemployment benefit and the initial social unemployment benefit cover the same loss of income and are alternative schemes.",
  "O Subsídio Parental Inicial (contributivo) e o Subsídio Social Parental (não contributivo) são vias alternativas para a mesma licença de nascimento.":
    "The initial parental benefit (contributory) and the social parental benefit (non-contributory) are alternative routes for the same birth leave.",
  "A Pensão de Invalidez do regime contributivo não acumula com a Pensão Social de Velhice não contributiva.":
    "The contributory invalidity pension does not combine with the non-contributory old-age pension.",
  "O Subsídio de Doença pleno não é acumulável com o Subsídio de Desemprego para o mesmo período de ausência de trabalho.":
    "The full sickness benefit cannot be combined with the unemployment benefit for the same period off work.",
  "A Bolsa de Estudo DGES destina-se exclusivamente ao Ensino Superior, enquanto a Bolsa da Segurança Social se destina ao Ensino Secundário.":
    "The DGES grant is exclusively for higher education, while the Social Security grant is for secondary education.",
  "A Garantia para a Infância é um complemento direto do Abono de Família para crianças até aos 18 anos inseridas no 1.º escalão.":
    "The Childhood Guarantee is a direct supplement to the family allowance for children under 18 in the first bracket.",
  "A majoração para famílias monoparentais exige ter previamente concedido o Abono de Família ou o Abono de Família Pré-Natal.":
    "The single-parent supplement requires prior award of the family allowance or the pre-natal family allowance.",
  "A majoração para famílias numerosas incide sobre o Abono de Família atribuído a crianças até 36 meses.":
    "The large-family supplement applies to the family allowance granted for children up to 36 months.",
  "A Tarifa Social de Gás Natural requer que o titular seja beneficiário de uma prestação social elegível ou da Tarifa Social de Eletricidade.":
    "The social gas tariff requires the holder to already receive an eligible social benefit or the social electricity tariff.",
};

/** Tradução dos nomes das entidades apresentadas no cartão. */
export const ENTIDADES_EN: Record<string, string> = {
  "Segurança Social": "Social Security",
  "Portal da Habitação · IHRU": "Housing Portal · IHRU",
  "gov.pt · Transportes públicos": "gov.pt · Public transport",
  "Autoridade Tributária · gov.pt": "Tax Authority · gov.pt",
  "Direção-Geral do Ensino Superior": "Directorate-General for Higher Education",
  "SNS · Administração Central do Sistema de Saúde": "SNS · Central Administration of the Health System",
  "Segurança Social · Ministério da Justiça": "Social Security · Ministry of Justice",
  "gov.pt · Mobilidade e Transportes": "gov.pt · Mobility and Transport",
};

export function traduzEntidade(lingua: Lingua, entidade: string): string {
  if (lingua === "en") return ENTIDADES_EN[entidade] ?? entidade;
  return entidade;
}

export function traduzMotivo(lingua: Lingua, motivo: string): string {
  if (lingua === "en") return MOTIVOS_EN[motivo] ?? motivo;
  return motivo;
}

# Relatório Técnico: Motor de Wishlist, Validação de Compatibilidade e Packs de Apoios

**Data:** 31 de outubro de 2026  
**Módulo:** [`src/lib/wishlist.ts`](file:///home/davidrodrigues/sources/WeHelpVibathon/src/lib/wishlist.ts)  
**Testes:** [`src/test/wishlist.test.ts`](file:///home/davidrodrigues/sources/WeHelpVibathon/src/test/wishlist.test.ts)  
**Ambiente:** Cliente / Node.js (latência zero, sem dependência de base de dados externa)  
**Conformidade de Privacidade:** 100% anónimo (sem PII, sem persistência remota)

---

## 1. Visão Geral e Objetivos

O módulo de **Wishlist e Compatibilidade** responde à necessidade do cidadão de reunir um conjunto personalizado de apoios sociais num cesto ("wishlist" ou plano individual) e verificar automaticamente se:
1. **Existem incompatibilidades legais diretas** entre os apoios selecionados (regras de exclusividade e proibição de acumulação segundo a Segurança Social e a legislação portuguesa);
2. **Existem dependências ou pré-requisitos em falta** (apoios que exigem que outro benefício esteja previamente atribuído);
3. **Pode usufruir de "Packs de Apoios" temáticos** (combinações populares pré-validadas de benefícios que combinam entre si).

O desenvolvimento respeita estritamente o princípio acordado: **lógica e motor de negócio no backend/core, sem qualquer interferência ou alteração na camada de frontend/UI nesta fase.**

---

## 2. Arquitetura e Decisões de Design (Alinhadas via `/grill-me`)

| Dimensão | Decisão Adotada | Justificação Técnica / Legal |
| :--- | :--- | :--- |
| **Localização da Lógica** | Módulo TypeScript puro no cliente (`src/lib/wishlist.ts`) | Latência zero, execução offline e preservação da garantia de privacidade total (*zero server PII storage*). |
| **Comportamento perante Conflitos** | Adiciona livremente mas deteta e sinaliza ativamente todos os conflitos | Permite ao cidadão comparar opções em simultâneo sem bloqueios rígidos de interface, recebendo diagnósticos claros com base legal e recomendações de escolha. |
| **Tipos de Relações Analisadas** | 1. Incompatibilidade Mútua Direta<br>2. Dependência / Pré-requisito | Modela fielmente tanto as proibições legais de acumulação quanto os apoios dependentes (ex.: complementos e majorações). |
| **Fronteira de Validação** | Estritamente intra-apoios ($A \leftrightarrow B$) | A validação do cesto foca-se na coexistência jurídica dos apoios entre si, mantendo o motor desacoplado do perfil do utilizador. |
| **Packs de Apoios** | Catálogo curado de 5 packs populares totalmente validados | Cria soluções práticas ("out of the box") para cenários de vida reais (jovens, estudantes, famílias, idosos e desempregados). |

---

## 3. Matriz de Incompatibilidades Legais Implementada

O motor avalia pares de apoios $A$ e $B$ com base nos regimes jurídicos em vigor:

1. **`psi` vs `bonificacaodeficiencia`:**
   - *Motivo:* A Prestação Social para a Inclusão (PSI) e a Bonificação por Deficiência do abono de família não podem ser acumuladas pelo mesmo titular.
   - *Base Legal:* Decreto-Lei n.º 126-A/2017 e Guia Prático da Segurança Social.
2. **`pensaosocial` vs `desemprego` & `pensaosocial` vs `desempregosocial`:**
   - *Motivo:* Atingida a idade legal de reforma por velhice, cessa a proteção no subsídio de desemprego e inicia-se o regime de pensão social com CES.
   - *Base Legal:* Decreto-Lei n.º 220/2006.
3. **`desemprego` vs `desempregosocial`:**
   - *Motivo:* O regime contributivo pleno e o regime social inicial são vias alternativas para a mesma situação de perda involuntária de emprego.
4. **`parentalinicial` vs `parentalsocial`:**
   - *Motivo:* O regime contributivo e o regime social parental são mutuamente exclusivos para o mesmo nascimento ou adoção.
5. **`pensaoinvalidez` vs `pensaosocial`:**
   - *Motivo:* Uma pensão contributiva de invalidez não acumula com a pensão social de velhice do regime não contributivo.
6. **`subsidiodoenca` vs `desemprego`:**
   - *Motivo:* A incapacidade temporária absoluta para o trabalho suspende o subsídio de desemprego durante o período de baixa médica.
7. **`bolsadges` vs `bolsasegsocial`:**
   - *Motivo:* Ensino Superior vs Ensino Secundário (níveis de ensino incompatíveis para o mesmo estudante).

---

## 4. Matriz de Dependências / Pré-Requisitos

1. **`garantiainfancia` $\rightarrow$ requer `abono`:**
   - A Garantia para a Infância é um complemento financeiro reservado a quem já recebe Abono de Família no 1.º escalão.
2. **`abonomonoparental` $\rightarrow$ requer `abono` ou `prenatal`:**
   - A majoração de 50% incide sobre o valor base do abono de família ou pré-natal.
3. **`abononumerosa` $\rightarrow$ requer `abono`:**
   - A majoração para 2 ou mais filhos incide sobre o abono até aos 36 meses.
4. **`tarifagas` $\rightarrow$ requer prestação abrangida:**
   - O desconto na tarifa social de gás canalizado pressupõe atribuição de eletricidade social, CSI, RSI, desemprego, abono ou PSI.

---

## 5. Catálogo de Packs de Apoios Recomendados

| ID do Pack | Nome | Apoios Integrados | Cenário / Público-Alvo |
| :--- | :--- | :--- | :--- |
| `pack-jovem-trabalhador` | **Pack Jovem Trabalhador** | `irsjovem`, `porta65`, `sub23` | Jovens até 35 anos com rendimentos de trabalho e habitação arrendada. |
| `pack-estudante-superior` | **Pack Universitário Deslocado** | `bolsadges`, `sub23`, `porta65` | Estudantes do ensino superior com despesas de deslocação e alojamento. |
| `pack-familia-filhos` | **Pack Família com Crianças** | `abono`, `garantiainfancia`, `tarifaeletricidade` | Agregados familiares com dependentes menores e encargos domésticos. |
| `pack-senior` | **Pack Sénior e Idade Maior** | `csi`, `tarifaeletricidade`, `isencaotaxas` | Reformados e pessoas com 66 anos e 9 meses com baixos rendimentos. |
| `pack-desemprego-transicao` | **Pack Proteção no Desemprego** | `desemprego`, `tarifaeletricidade`, `tarifagas` | Cidadãos em transição profissional inscritos no IEFP com redução de despesas fixas. |

> [!NOTE]
> Todos os 5 packs foram formalmente testados nos testes unitários e possuem **100% de compatibilidade interna (zero conflitos e zero dependências em falta)**.

---

## 6. Cobertura de Testes Automatizados

A suíte em [`src/test/wishlist.test.ts`](file:///home/davidrodrigues/sources/WeHelpVibathon/src/test/wishlist.test.ts) valida 14 cenários essenciais:
- Criação, adição idempotente (evita duplicados), remoção e limpeza;
- Validação positiva de listas compatíveis;
- Deteção precisa de conflitos diretos (PSI vs Bonificação, Pensão Social vs Desemprego, Bolsas DGES vs Secundário);
- Deteção e resolução de dependências em falta (ex.: adicionar Garantia para a Infância isolada gera erro; juntar Abono resolve);
- Validação automática de integridade dos 5 Packs Recomendados;
- Aplicação de pack à wishlist em lote com registo de proveniência (`origem: "pack"`, `packOrigemId`);
- Comportamento resiliente em ambientes sem `localStorage` ou com dados corrompidos.

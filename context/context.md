# 🇵🇹 Plataforma de Apoios Sociais - MVP Hackathon

## 💡 Sobre o Projeto
Muitos cidadãos em Portugal perdem apoios sociais, bolsas e benefícios simplesmente por falta de informação ou pela complexidade de perceberem se são elegíveis. 
Este projeto é uma plataforma web (construída em Lovable num dia) que funciona como um motor de busca de direitos sociais: o utilizador preenche um formulário rápido e anónimo, e a plataforma cruza esses dados com as regras do Estado para recomendar apoios sociais, bolsas de estudo e outros benefícios.

---

## 📖 Glossário Técnico: O que é o IAS?
**IAS (Indexante dos Apoios Sociais)** é o valor financeiro de referência utilizado pelo Estado Português para calcular a atribuição e o limite da maioria das prestações sociais (como o Rendimento Social de Inserção, limites de acesso ao Abono de Família, isenção de taxas moderadoras, etc.). 

**Por que é crucial para a nossa lógica de negócio?** 
Em vez de a lei dizer "só tem direito quem ganha até 1500€", a lei diz "só tem direito quem ganha até 3 vezes o IAS". Ao definirmos o IAS como uma **constante global** no nosso código (ex: `const IAS_VALUE = 537.13`), conseguimos calcular as elegibilidades de dezenas de apoios diferentes. Se o valor mudar no próximo ano, só precisamos de alterar uma linha de código em vez de reescrever todas as regras de cada subsídio.

---

## 🎯 Escopo do Projeto (MVP 24 Horas)
Para garantir a entrega durante a hackathon, o projeto restringe-se a uma aplicação web responsiva composta por um questionário dinâmico e um painel de resultados. 
A base de dados será alojada localmente (ou num backend rápido como o Supabase) e pré-populada com os 8 a 10 apoios sociais mais representativos e fáceis de validar (ex: Porta 65 Jovem, Bolsa DGES, IRS Jovem, Passe Sub23, RSI, Escalões de Abono de Família). O motor de decisão corre no lado do cliente para garantir latência zero.

## 👥 Público-Alvo Principal
1. **Estudantes Universitários:** À procura de bolsas de estudo, passes gratuitos, e apoios para alojamento de deslocados.
2. **Jovens Profissionais:** Em início de carreira, interessados em benefícios fiscais (IRS Jovem) e apoio ao arrendamento (Porta 65).
3. **Pessoas em Situação de Vulnerabilidade / Trabalhadores de Baixo Rendimento:** Cidadãos que desconhecem a totalidade da rede de proteção da Segurança Social (RSI, abonos, tarifas sociais).

## ✨ Principais Funcionalidades (Key Features)
* **Wizard de Triagem Anónimo:** Formulário interativo rápido e sem barreira de login, focando em: idade, distrito, situação profissional, composição do agregado familiar e rendimento bruto anual.
* **Motor de Matching Instantâneo:** Lógica de filtragem que cruza os dados do utilizador com os requisitos de cada subsídio, gerando resultados em tempo real.
* **Cartões de Benefício Acionáveis:** Dashboard final que lista os apoios elegíveis, detalha o valor financeiro estimado e inclui um "Call to Action" com link direto para o portal oficial do Estado (ePortugal, DGES, Segurança Social).
* **Painel "Apoios a Ficar de Olho":** Uma secção secundária mostrando apoios para os quais a pessoa *quase* cumpre os requisitos (ex: falta apenas um ano de idade ou o rendimento excede por muito pouco).

## ⚙️ Regras de Negócio
* **Privacidade Absoluta:** Nenhuma informação de identificação pessoal (PII) é guardada. A simulação ocorre na sessão local para remover qualquer atrito legal ou de desconfiança por parte do utilizador.
* **Cálculo Indexado ao IAS:** O valor do IAS serve de base matemática (multiplicador) para calcular o escalão de "baixo rendimento" do agregado familiar.
* **Filtros Eliminatórios (Hard Blocks):** Regras de idade e situação profissional operam no topo do funil para poupar processamento. (Ex: se o utilizador tem 30 anos, a avaliação do passe Sub23 é imediatamente cortada).
* **Gestão de Exclusividade (Nice to have):** Regras básicas de conflito que avisam o utilizador caso dois apoios elegíveis não possam ser acumulados por lei.
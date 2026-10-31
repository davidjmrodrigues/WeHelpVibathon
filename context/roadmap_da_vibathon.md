# 🗺️ Roadmap de Implementação (Vibathon 24h)

Este roadmap assume que o Lovable vai gerar a estrutura base através do First Prompt. O vosso trabalho nas horas seguintes será iterar e adicionar as lógicas específicas da vossa plataforma.

## 🏗️ Fase 1: Fundação e Mockups (Horas 1-4)
* **Geração Base:** Submeter o *First Prompt* no Lovable e ajustar o design inicial (cores, tipografia, garantir que é mobile-friendly).
* **Mapeamento de Dados:** Criar um ficheiro JSON ou Array no código com a estrutura dos 8 a 10 apoios sociais principais (Porta 65, Bolsa DGES, RSI, Abono de Família, etc.).
* **Filtros Eliminatórios Base:** Implementar os "Hard Blocks" básicos de idade e situação profissional (ex: cortar Passe Sub23 para quem tem mais de 23 anos e não é estudante).

## 🧮 Fase 2: Motor de Decisão e Matemática (Horas 4-10)
* **Lógica do IAS:** Implementar as fórmulas matemáticas reais usando a constante do IAS (`IAS_VALUE = 537.13`). Por exemplo, calcular o rendimento *per capita* do agregado e verificar se é inferior a N vezes o IAS.
* **Afinar Matching:** Ligar os dados inseridos no formulário aos requisitos exatos dos 8-10 apoios inseridos na Fase 1.
* **Call to Actions Reais:** Adicionar os links verdadeiros nos cartões de benefício, a apontar para os portais oficiais do Estado (ePortugal, DGES, Segurança Social Direta).

## ✨ Fase 3: Funcionalidades Avançadas / "Uau Factor" (Horas 10-18)
* **Painel "Apoios a Ficar de Olho":** Adicionar a lógica para apoios de "quase match". (Ex: o rendimento passa o limite por muito pouco, ou falta apenas 1 ano para ter a idade mínima exigida).
* **Gestão de Exclusividade (Nice to have):** Implementar os avisos de conflito de acumulação (ex: colocar um alerta no cartão a dizer "Atenção: Este apoio não é acumulável com o RSI").
* **Privacidade e Estado:** Garantir que um *refresh* na página limpa os dados, ou mantê-los estritamente na *Session Storage* para garantir a "Privacidade Absoluta" sem guardar dados de identificação.

## 🎤 Fase 4: Polimento e Pitch (Horas 18-24)
* **Bugs e Edge Cases:** Testar perfis extremos no formulário (ex: rendimento 0, idades muito altas ou muito baixas) para garantir que a aplicação não quebra ou dá resultados errados.
* **Refinar Copy e UX:** Garantir que a linguagem da plataforma é super acessível, empática e clara, dado o público-alvo diversificado.
* **Preparar a Demo:** Criar 3 perfis fictícios ("Personas") prontos a usar durante a apresentação ao júri. Isto ajudará a demonstrar o motor a funcionar em tempo real de forma fluida durante o pitch.
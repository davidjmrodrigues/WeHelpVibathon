# Meus Apoios — Identidade visual

> **Meus Apoios** é um nome de trabalho. Pode ser trocado sem mexer no resto.

Plataforma web, anónima e sem login, que cruza cinco respostas rápidas com as regras do Estado e mostra os apoios sociais a que a pessoa pode ter direito.

## Como usar este pacote

| Ficheiro | Para quê |
|---|---|
| `IDENTIDADE-VISUAL.md` | Este guia: cores, letra, formas, movimento e tom de voz. |
| `tokens.css` | As cores e medidas prontas a colar no projeto (claro e escuro). |
| `logo.svg` e `azulejo-tile.svg` | O logótipo e o mosaico do padrão. |
| `lovable-prompt.md` | O primeiro prompt para colar no Lovable. |
| `rules.ts` | O motor de elegibilidade, indexado ao IAS. |

Ordem sugerida: criar o projeto no Lovable com o prompt, ligar o GitHub logo a seguir, e só depois fazer commit do `rules.ts`, do `tokens.css` e dos SVG no repositório.

## Conceito

**Confiança institucional com calor humano.** É um serviço que lida com direitos e dinheiro, por isso tem de parecer sério e claro. Mas fala com pessoas, algumas em situação difícil, por isso não pode parecer um portal frio nem uma app de marketing.

Três ideias seguram o resto:

1. **Papel e verde.** Fundo de um verde-sálvia muito claro, como papel, em vez de branco ou cinzento tecnológico.
2. **Um toque de azulejo.** Um padrão geométrico discreto, só no topo de alguns ecrãs. É a única decoração.
3. **Texto como uma pessoa fala.** Frases curtas, tratamento por "si", sem jargão.

## Cores

Nome provisório do conjunto: **verde**. Os valores em HSL estão em `tokens.css`.

### Modo claro

| Papel | Hex | Uso |
|---|---|---|
| Fundo | `#E9F2EA` | Fundo da página |
| Superfície | `#F7FBF7` | Campos, opções, cartões |
| Texto | `#13251B` | Texto principal |
| Texto secundário | `#4A5F52` | Descrições, legendas |
| Linha | `#CFE0D2` | Separadores entre linhas (decorativo) |
| Borda de campo | `#6F8A78` | Contorno de campos e opções (ver Acessibilidade) |
| Principal | `#0E7A4F` | Botões, progresso, seleção, valores dos apoios |
| Sobre o principal | `#FFFFFF` | Texto dentro dos botões |
| Principal suave | `#D6EBDD` | Fundo da opção selecionada |
| Verde profundo | `#0A5C3A` | Detalhes: azulejo, logótipo, valor total, slider, links |
| Aviso | `#A8480A` | "Quase lá" |
| Fundo do aviso | `#FBEBD3` | Realces de aviso |

### Modo escuro

| Papel | Hex | Uso |
|---|---|---|
| Fundo | `#0C1A14` | Fundo da página |
| Superfície | `#14261D` | Campos, opções, cartões |
| Texto | `#E6EFE8` | Texto principal |
| Texto secundário | `#9FB3A6` | Descrições, legendas |
| Linha | `#24392E` | Separadores |
| Borda de campo | `#5F7B6A` | Contorno de campos e opções |
| Principal | `#4FD28F` | Botões, progresso, seleção, valores |
| Sobre o principal | `#0C1A14` | Texto dentro dos botões |
| Principal suave | `#173A2A` | Fundo da opção selecionada |
| Menta | `#8FE3B5` | Detalhes: azulejo, logótipo, valor total |
| Aviso | `#F5B84A` | "Quase lá" |
| Fundo do aviso | `#2B2313` | Realces de aviso |

### Regras de uso das cores

- **Verde = bom.** Apoio elegível, botão principal, progresso.
- **Âmbar = quase.** Só para "a ficar de olho".
- **Sem vermelho para "não elegível".** A pessoa pode estar numa situação sensível e vermelho soa a reprovação. Um apoio que não se aplica simplesmente não aparece. O vermelho fica reservado para erros reais de formulário.
- **O verde profundo (claro) e a menta (escuro) só em detalhes.** Nunca em botões, para os botões se distinguirem dos detalhes.

## Tipografia

**Roboto** (Google Fonts, licença aberta), usada em tudo. Escolhida por ser a letra mais reconhecida e legível em qualquer ecrã.

| Elemento | Tamanho / altura de linha | Peso |
|---|---|---|
| Título da página inicial | 40 / 1,08 | 600 |
| Título de cada passo | 32 / 1,12 | 600 |
| Título de um apoio | 20 / 1,2 | 600 |
| Número grande (idade, pessoas) | 112 | 600 |
| Rendimento | 60 | 600 |
| Valor total nos resultados | 64 | 600 |
| Texto corrido | 17 / 1,55 | 400 |
| Texto de apoio | 15–16 | 400 |
| Secundário | 14 | 400 |
| Legendas | 12–13 | 400 |

- Títulos com espaçamento entre letras ligeiramente apertado: `-0.015em` a `-0.03em` nos números grandes.
- Todos os números com `font-variant-numeric: tabular-nums`, para não saltarem quando mudam.
- Se a Roboto carregada não tiver o peso 600, usar 700.

## Forma e espaçamento

- **Cantos moderados.** Botões, opções e botões de mais/menos: `14px`. Campos e botões de ação secundários: `12px`. Nada em pílula e nada quase quadrado.
- **Margem lateral dos ecrãs: `24px`.** Espaço entre elementos: `10–12px`.
- **Botão principal: `56px` de altura**, largura total. Alvos de toque nunca abaixo de `44px`.
- **Resultados em lista, não em cartões.** Linhas separadas por um traço fino (`--border`), sem caixas à volta. Cada linha: marca à esquerda, nome em Roboto 20, entidade por baixo, valor à direita.
- **Sem ícones dentro de quadrados coloridos.** Os ícones aparecem soltos, em traço fino, sempre com `aria-hidden`.

## Logótipo e padrão de azulejo

- **Logótipo (`logo.svg`):** um losango com um círculo vazado ao centro, em verde profundo. Aparece a 20px antes do nome.
- **Nome:** "Meus Apoios", Roboto 600, 20px.
- **Padrão (`azulejo-tile.svg`):** mosaico de 28×28 com um losango em traço e pontos nos cantos, a repetir. Aparece como **uma faixa no topo** da página inicial (132px de altura) e dos resultados (44px). Nunca mais do que uma faixa por ecrã e nunca atrás de texto.

## Movimento

O movimento ajuda a perceber o que está a acontecer. Nada decorativo.

| Onde | O quê | Duração |
|---|---|---|
| Mudança de passo | O conteúdo desliza 16px da direita e aparece | 300 ms |
| Barra de progresso | Cinco segmentos que ganham cor | 300 ms |
| Resultados | Cada linha entra de baixo (12px), uma a uma | 450 ms, desfasadas 90 ms, a começar aos 150 ms |
| Abrir um apoio | A seta roda 180° e os detalhes aparecem | 250 ms |
| Valor total | Conta de zero até ao valor | 1100 ms, abrandando no fim |
| Toque nos botões | Encolhem ligeiramente (`scale .98`; botões de mais/menos `.92`) | 150 ms |

- **Curva de todas as entradas:** `cubic-bezier(.2, .8, .2, 1)`.
- **Só `transform` e `opacity`**, para correr bem em telemóveis fracos.
- **`prefers-reduced-motion`:** com a opção ativa, todas as animações e transições ficam quase instantâneas e o total aparece já calculado.
- Sem ecrãs de "a calcular..." falsos. O resultado é imediato.

## Tom de voz

Tratar a pessoa por **"si"**, em português de Portugal, com frases curtas.

| Em vez de | Escrever |
|---|---|
| Descubra o seu potencial de poupança | Há apoios que são seus e que talvez ainda não saiba. |
| Insira a sua idade | Quantos anos tem? |
| Situação profissional | O que faz neste momento? |
| Dimensão do agregado familiar | Com quantas pessoas vive? |
| Rendimento bruto anual do agregado | Quanto entra, por ano, em sua casa? |
| Elegibilidade confirmada | Encontrámos 2 apoios para si. |
| Quase elegível | E há um quase ao seu alcance |

- Dizer "rendimento da casa" nos textos. A palavra "agregado" fica no código.
- Explicar o IAS numa frase, no ecrã do rendimento: "a referência que o Estado usa para quase todos os limites".
- Dizer sempre porque falta pouco: "O rendimento da casa fica cerca de 8% acima do limite."
- Rodapé dos resultados: é uma estimativa para orientar, não uma decisão. Confirmar no portal oficial.
- Sem emojis, sem pontos de exclamação, sem "desbloqueie".

## Acessibilidade

Rácios de contraste medidos (mínimo 4,5:1 para texto, 3:1 para elementos de interface):

| Par | Claro | Escuro |
|---|---|---|
| Texto sobre fundo | 14,0 | 15,2 |
| Texto secundário sobre fundo | 6,0 | 8,1 |
| Branco (ou fundo escuro) sobre o botão principal | 5,4 | 9,3 |
| Principal sobre fundo | 4,7 | 9,3 |
| Verde profundo / menta sobre fundo | 7,1 | 11,8 |
| Aviso sobre fundo | 5,1 | 10,1 |

- **Bordas de campos e opções:** a linha decorativa (`--border`) tem só 1,2:1 e **não serve** de contorno de campo. Usar `--input`, que dá cerca de 3,3:1 no claro e 3,9:1 no escuro. O protótipo ainda usa a linha fina nos campos, mas no código final deve usar `--input`.
- Botões e campos reais (`button`, `input`, `select`, `label`), nunca `div` clicáveis.
- Botões só com ícone levam `aria-label`.
- Foco visível: contorno de 3px na cor principal.
- Cor nunca é a única pista: apoio elegível leva um ✓ e "quase lá" leva um olho, além da cor.
- Funciona em ecrã de telemóvel (390px de largura de referência) e cresce com um contentor limitado em ecrãs maiores.

## O que não fazer

- Não usar azul, vermelho ou gradientes de fundo.
- Não pôr o azulejo em mais do que uma faixa por ecrã, nem atrás de texto.
- Não usar pílulas nem cantos de mais de 14px.
- Não pôr caixas coloridas atrás de ícones.
- Não animar para além do que está na tabela de movimento.
- Não guardar nem enviar dados pessoais: o cálculo corre no cliente.

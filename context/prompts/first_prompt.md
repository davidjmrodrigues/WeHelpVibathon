# 🚀 First Prompt para o Lovable

*Copia e cola o texto abaixo diretamente no chat do Lovable para gerar a base do teu projeto:*

> Cria uma aplicação web responsiva em português chamada 'WeHelp'. O objetivo é ajudar os cidadãos portugueses a descobrirem a que apoios do Estado têm direito de forma rápida e anónima. 
> 
> A aplicação deve ter 2 ecrãs principais que funcionam inteiramente no lado do cliente (sem backend para já, usa apenas o estado local/React):
> 
> 1. **Wizard de Triagem (Ecrã Inicial):** Um formulário interativo (estilo Typeform, passo a passo) com os seguintes campos:
> - Idade (número)
> - Distrito (dropdown com distritos de Portugal)
> - Situação Profissional (dropdown: Estudante, Trabalhador, Desempregado)
> - Tamanho do Agregado Familiar (número)
> - Rendimento Bruto Anual do Agregado (número em euros)
> 
> 2. **Dashboard de Resultados:** Após submeter o formulário, mostra os resultados calculados instantaneamente. Cria uma interface com cartões para os 'Apoios Elegíveis'. Cada cartão deve ter: Título do Apoio, Breve Descrição, Valor Estimado (placeholder) e um botão 'Saber mais' (link externo).
> 
> **Lógica inicial:** Define uma constante global no código `IAS_VALUE = 537.13`. Cria 3 apoios mockados (ex: Porta 65, Passe Sub23, IRS Jovem) com regras muito simples e hardcoded para demonstrar o motor de matching a funcionar cruzando os dados do formulário.
# Auditoria de acumulações — 31/10/2026

Revistos os 30 apoios curados (435 pares), as regras existentes, dependências e packs. Os restantes IDs descobertos em gov.pt não têm regras de acumulação verificadas e permanecem por confirmar. Esta auditoria não certifica todas as acumulações legalmente possíveis.

## Âmbito e resultado

A comparação considera o mesmo titular e período. Não extrapolar para pessoas diferentes do agregado. Ausência de conflito não comprova acumulação; cada par sem uma exclusão estabelecida é apresentado como por confirmar. Os packs são conjuntos sem conflitos detetados, não combinações juridicamente certificadas.

Separadas incompatibilidades de perfil (idades sem sobreposição, níveis de ensino) das exclusões de pagamento simultâneo. Pensão social de velhice não combina no mesmo titular com IRS Jovem, passe jovem ou Porta 65 Jovem, mesmo considerando a exceção de casal até 37 anos.

## Novas exclusões documentadas

- Doença com desemprego social, invalidez, pensão social de velhice ou proteção parental (inicial/social): guia ISS de doença, v4.55, 14/07/2026, §G2, p.18. Fonte: https://www.seg-social.pt/ptss/pssd/documento/cmrxnsbwd0003ht3wzdfsh8rk
- Cuidador informal principal com prestações de desemprego, CSI ou pensão social de velhice: guia ISS v1.25, 30/06/2026, §J2, p.23. Não excluir genericamente pensão de invalidez: a relativa tem uma exceção. Fonte: https://www.seg-social.pt/storage1/files/8004-EstatutoCuidadorInformalPrincipalCuidadorInformalNaoPrincipal-v1-25-ugQiTzkgzlR4GrjulqrDsw.pdf
- PSI com pensão social de velhice: guia ISS v4.39, 21/05/2026, §G2, p.9. Fonte: https://www.seg-social.pt/ptss/pssd/documento/cmc1zy5i500n7kl2ynj8bh0nm
- Parental inicial com desemprego contributivo/social: suspensão do pagamento do desemprego, não perda permanente do direito. Fonte: https://www.seg-social.pt/ptss/pssd/menu/familia/maternidade-paternidade/subsidio-parental-inicial

Corrigida a sugestão anterior que pressupunha atribuição automática de subsídio de doença a quem recebe desemprego.

## Limites e condições não resolvidas

- CSI tem uma via por invalidez antes da idade de velhice; não gerar incompatibilidade etária automática com apoios jovens. CSI/PSI exige conhecer a via concreta.
- Porta 65 Jovem/Porta 65+ permanece por confirmar: não foi obtida cláusula oficial explícita de não acumulação para codificar um bloqueio definitivo.
- Não derivar limites etários da idade do requerente para benefícios dos filhos. Não excluir PSI/invalidez genericamente.
- Tarifa elétrica não prova acesso à tarifa de gás. Retirada essa dependência suficiente; escalão do abono, regime de prestação e condições do contrato continuam por verificar.
- Selecionar uma prestação não prova que esteja concedida; ausência na seleção não prova que não seja recebida. Dependências são pré-requisitos por confirmar.

As regras de elegibilidade dos filtros não foram alteradas. Cobertura de regressões em src/test/wishlist.test.ts.
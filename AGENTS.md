<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Regras de Arquitetura e Engenharia
- Keep cumulation separate from eligibility: wishlist rules distinguish same-person profile contradictions from legal exclusions; unreviewed pairs (including scraped IDs) remain unconfirmed, never approved by absence of a conflict.
- Keep eligibility rules in the browser-only support engine (`src/lib/apoios.ts`); presentation changes must not change matching rules.
- Define visual roles centrally in `src/styles.css` and use the shared `Button` (`@/components/ui/button`) for controls so the supplied identity remains consistent across views.
- Coordinate filter clearing with an outgoing/incoming results fade and measured container-height animation; keep the existing icon animation and eligibility engine independent.
- Store dated official sources and unverified mandatory conditions with every benefit; matching is conservative discovery, never a legal entitlement decision, because the five profile fields cannot establish full eligibility.
- Keep IAS and cent-rounded conversions in `src/lib/ias.ts` as the single monetary reference for the catalogue and FAQ.
- Theme changes use full-page View Transition snapshots with a CSS circular incoming reveal; synchronize React inside the capture callback and suppress child transitions. Browsers without View Transitions use a separate incoming-theme layer; the reveal runs regardless of reduced-motion (user-triggered), and animation does not depend on Web Animations pseudo-element support.
- Bilingual PT/EN: interface strings live in `src/lib/textos.ts` (`tx`, `rotuloTema`) and the language context in `src/lib/idioma.tsx`; English for the verified catalogue lives in the overlay `src/lib/apoios-en.ts` (texts, exclusion reasons and entities keyed by their exact Portuguese value). Filter values, support IDs and eligibility rules stay Portuguese in `src/lib/apoios.ts` so matching is untouched by language. Benefits discovered live from gov.pt keep their official Portuguese content.

## Mapa de Documentação e Fontes de Contexto para Agentes (Directório `context/`)
Antes de implementar ou modificar qualquer funcionalidade, regra de negócio, estilo ou integração, consulta obrigatoriamente a pasta `context/`:

- **Visão do Produto e Regras de Negócio:**
  - [`context/context.md`](context/context.md): Visão geral do WeHelp, personas-alvo, glossário técnico e fórmulas indexadas ao IAS, filtros eliminatórios (*hard blocks*) e garantias de privacidade absoluta.
- **Identidade Visual e Design System:**
  - [`context/visual_identity/IDENTIDADE-VISUAL.md`](context/visual_identity/IDENTIDADE-VISUAL.md): Guia oficial de cores (papel e verde em HSL/OKLCH), tipografia (Roboto), formato dos elementos (cantos de 14px, sem pílulas, resultados em lista limpa), padrão decorativo de azulejo e tom de voz (tratamento por "si" em português europeu).
- **Fontes Oficiais e Critérios Editoriais:**
  - [`context/apoios-fontes.md`](context/apoios-fontes.md): Legislação oficial (Portaria do IAS, guias da Segurança Social, regulamentos da DGES/IES e ERSE/DGEG), datas de consulta e premissas de neutralidade informativa.
- **Relatórios Técnicos de Funcionalidades (Reports):**
  - [`context/reports/`](context/reports/): Documentação detalhada sobre arquitetura de subsistemas completos.
  - [`context/reports/scraper-e-sincronizacao-oficial.md`](context/reports/scraper-e-sincronizacao-oficial.md): Relatório exaustivo do scraper e sincronização em tempo real (legalidade/RGPD, arquitetura anti-CORS no servidor, timeouts, cache de 15min, fallback em 4 camadas e cobertura de testes em `src/test/scraper.test.ts`).
- **Prompts de Referência para Lovable e Modelos IA:**
  - [`context/prompts/first_prompt.md`](context/prompts/first_prompt.md): Prompt inicial gerador da fundação do projeto.
  - [`context/prompts/scraper_prompt.md`](context/prompts/scraper_prompt.md): Prompt estruturado com diagnóstico técnico de portais públicos e especificações do scraper.
- **Roadmap da Hackathon:**
  - [`context/roadmap_da_vibathon.md`](context/roadmap_da_vibathon.md): Cronograma das 4 fases da hackathon de 24h (Fundação, Motor de Decisão, Uau Factor, Polimento & Pitch).

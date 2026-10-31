# 📚 Diretório de Contexto do WeHelp

Este diretório centraliza todo o conhecimento estratégico, requisitos legais, identidade visual, relatórios técnicos e prompts do projeto **WeHelp**.

---

## 📂 Estrutura de Documentos

```
context/
├── context.md                    # Visão geral, personas, glossário do IAS e escopo do MVP
├── apoios-fontes.md              # Fontes legais, enquadramento das portarias e critérios editoriais
├── roadmap_da_vibathon.md        # Planeamento de entrega e roadmap da maratona de 24h
├── visual_identity/
│   ├── IDENTIDADE-VISUAL.md      # Design system: cores, tipografia Roboto, espaçamento, movimento e tom de voz
│   └── prints só gerais.png      # Referências visuais
├── reports/
│   └── scraper-e-sincronizacao-oficial.md # Relatório técnico de scraping, conformidade legal, resiliência e testes
└── prompts/
    ├── first_prompt.md           # Primeiro prompt para o Lovable
    └── scraper_prompt.md         # Diagnóstico técnico de portais oficiais e prompt do scraper
```

---

## 🧭 Onde Encontrar Cada Informação

| O que precisas saber? | Ficheiro a consultar |
|---|---|
| **O que é o projeto e quem são os utilizadores?** | [`context.md`](context.md) — Conceito da app, personas (estudantes, jovens, vulnerabilidade) e regras fundamentais. |
| **Como calcular ou referenciar o IAS?** | [`context.md`](context.md) e [`apoios-fontes.md`](apoios-fontes.md) — Portaria n.º 480-A/2025/1 (537,13 € em 2026) e regras matemáticas. |
| **Que cores, letras e componentes usar?** | [`visual_identity/IDENTIDADE-VISUAL.md`](visual_identity/IDENTIDADE-VISUAL.md) — Paleta papel e verde, Roboto, cantos 14px, sem pílulas, tratamentos por "si". |
| **De onde vêm as regras e os links dos apoios?** | [`apoios-fontes.md`](apoios-fontes.md) — Portais oficiais (`gov.pt`, IHRU, DGEG, DGES/IES) e limites fiscais. |
| **Como funciona a sincronização e scraping?** | [`reports/scraper-e-sincronizacao-oficial.md`](reports/scraper-e-sincronizacao-oficial.md) — Arquitetura de rede, extração de JSON embutido (`__NEXT_DATA__`), API Elasticsearch, fallbacks e testes. |
| **Quais são os prompts enviados à IA?** | [`prompts/`](prompts/) — Histórico dos prompts que geraram e expandiram a aplicação no Lovable. |
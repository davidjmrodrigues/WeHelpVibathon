import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { BotaoIdioma } from "@/components/botao-idioma";
import { LogoWeHelp } from "@/components/logo-wehelp";
import { SiteFooter } from "@/components/site-footer";
import { Azulejo, AzulejoPadrao } from "@/components/azulejo";
import { IAS_SOURCE } from "@/lib/ias";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";

export const Route = createFileRoute("/fontes")({
  component: PaginaFontes,
  head: () => ({
    meta: [
      { title: "Fontes oficiais — WeHelp" },
      {
        name: "description",
        content:
          "Fontes oficiais dos apoios do Estado português em 2026: Segurança Social, gov.pt, DGES, IHRU, DGEG/ERSE, Autoridade Tributária e Diário da República.",
      },
      { property: "og:title", content: "Fontes oficiais — WeHelp" },
      {
        property: "og:description",
        content:
          "Fontes oficiais dos apoios do Estado português em 2026: Segurança Social, gov.pt, DGES, IHRU, DGEG/ERSE, Autoridade Tributária e Diário da República.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const FONTES = [
  { chaveNome: "fonteSegNome", chaveDesc: "fonteSegDesc", href: "https://seg-social.pt" },
  { chaveNome: "fonteGovNome", chaveDesc: "fonteGovDesc", href: "https://www.gov.pt" },
  {
    chaveNome: "fonteDgesNome",
    chaveDesc: "fonteDgesDesc",
    href: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo",
  },
  {
    chaveNome: "fonteIhruNome",
    chaveDesc: "fonteIhruDesc",
    href: "https://www.portaldahabitacao.pt/porta-65-jovem1",
  },
  {
    chaveNome: "fonteEnergiaNome",
    chaveDesc: "fonteEnergiaDesc",
    href: "https://www.dgeg.gov.pt/pt/areas-transversais/politicas-de-protecao-ao-consumidor-de-energia/tarifa-social-de-energia/",
  },
  {
    chaveNome: "fonteAtNome",
    chaveDesc: "fonteAtDesc",
    href: "https://portaldasfinancas.gov.pt",
  },
  {
    chaveNome: "fonteDreNome",
    chaveDesc: "fonteDreDesc",
    href: "https://files.diariodarepublica.pt/1s/2025/12/25001/0000200002.pdf",
  },
];

function PaginaFontes() {
  const { lingua } = useIdioma();
  const t = (chave: string) => tx(lingua, chave);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="WeHelp — início">
            <LogoWeHelp className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <BotaoIdioma />
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-opacity hover:opacity-70"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("voltar")}
            </Link>
          </div>
        </div>
      </header>

      <Azulejo />

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{t("fontesTitulo")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("fontesDesc")}</p>

        <div className="relative mt-8 overflow-hidden rounded-xl border border-border bg-card p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08] [color:var(--detail)]"
          >
            <AzulejoPadrao id="azulejo-fontes" className="h-full w-full" />
          </div>
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-secondary/60 px-3 py-1 text-xs font-medium text-detail">
                <Check aria-hidden="true" className="size-3.5" />
                {t("fontesRevisaoBadge")}
              </span>
              <span className="text-xs text-muted-foreground">· IAS 2026 = 537,13 €</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("fontesIasNota")}
            </p>
            <div className="mt-3">
              <a
                href={IAS_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-detail transition-opacity hover:opacity-75"
              >
                {t("fontesConsultarDRE")}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {FONTES.map((f) => (
            <li key={f.href}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 py-6"
              >
                <span>
                  <span className="text-xl font-semibold leading-tight">{t(f.chaveNome)}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {t(f.chaveDesc)}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-opacity group-hover:opacity-70"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          {t("fontesAvisoLegal")}
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

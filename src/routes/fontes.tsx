import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BotaoIdioma } from "@/components/botao-idioma";
import { SiteFooter } from "@/components/site-footer";
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
          "As fontes oficiais onde pode confirmar a informação sobre os apoios do Estado português: Segurança Social, gov.pt, Portal do Cidadão e DGES.",
      },
      { property: "og:title", content: "Fontes oficiais — WeHelp" },
      {
        property: "og:description",
        content:
          "As fontes oficiais onde pode confirmar a informação sobre os apoios do Estado português: Segurança Social, gov.pt, Portal do Cidadão e DGES.",
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
    chaveNome: "fonteCidadaoNome",
    chaveDesc: "fonteCidadaoDesc",
    href: "https://www.portaldocidadao.pt",
  },
  {
    chaveNome: "fonteDgesNome",
    chaveDesc: "fonteDgesDesc",
    href: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo",
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
            <span className="brand-mark" aria-hidden="true" />
            <span className="text-xl font-semibold">WeHelp</span>
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

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{t("fontesTitulo")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("fontesDesc")}</p>

        <ul className="mt-10 divide-y divide-border border-y border-border">
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
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{t(f.chaveDesc)}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-muted-foreground transition-opacity group-hover:opacity-70"
                />
              </a>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}

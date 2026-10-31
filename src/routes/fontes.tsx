import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

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
  {
    nome: "Segurança Social",
    href: "https://seg-social.pt",
    descricao: "Guias práticos e condições de acesso às prestações sociais (abono, RSI, pensões, desemprego).",
  },
  {
    nome: "gov.pt",
    href: "https://www.gov.pt",
    descricao: "Portal dos serviços públicos, com os formulários e prazos de cada pedido.",
  },
  {
    nome: "Portal do Cidadão",
    href: "https://www.portaldocidadao.pt",
    descricao: "Serviços digitais do Estado e informação sobre direitos e apoios.",
  },
  {
    nome: "DGES — Bolsas de estudo",
    href: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo",
    descricao: "Regulamento e candidatura às bolsas de estudo do ensino superior.",
  },
];

function PaginaFontes() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="WeHelp — início">
            <span className="brand-mark" aria-hidden="true" />
            <span className="text-xl font-semibold">WeHelp</span>
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-opacity hover:opacity-70"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Fontes oficiais</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          O WeHelp orienta a pesquisa, mas a informação que conta é a das fontes oficiais. Confirme sempre as
          condições, os montantes e os prazos nestes portais antes de pedir um apoio.
        </p>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {FONTES.map((f) => (
            <li key={f.nome}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 py-6"
              >
                <span>
                  <span className="text-xl font-semibold leading-tight">{f.nome}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{f.descricao}</span>
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

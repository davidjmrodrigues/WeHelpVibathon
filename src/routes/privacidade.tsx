import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { BotaoIdioma } from "@/components/botao-idioma";
import { LogoWeHelp } from "@/components/logo-wehelp";
import { SiteFooter } from "@/components/site-footer";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";

export const Route = createFileRoute("/privacidade")({
  component: PaginaPrivacidade,
  head: () => ({
    meta: [
      { title: "Política de Privacidade — WeHelp" },
      {
        name: "description",
        content:
          "Política de privacidade do WeHelp: a triagem é anónima, corre no seu navegador e não guardamos as suas respostas.",
      },
      { property: "og:title", content: "Política de Privacidade — WeHelp" },
      {
        property: "og:description",
        content:
          "Política de privacidade do WeHelp: a triagem é anónima, corre no seu navegador e não guardamos as suas respostas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const SECCOES = [
  { chaveTitulo: "priv1Titulo", chaveTexto: "priv1Texto" },
  { chaveTitulo: "priv2Titulo", chaveTexto: "priv2Texto" },
  { chaveTitulo: "priv3Titulo", chaveTexto: "priv3Texto" },
  { chaveTitulo: "priv4Titulo", chaveTexto: "priv4Texto" },
  { chaveTitulo: "priv5Titulo", chaveTexto: "priv5Texto" },
];

function PaginaPrivacidade() {
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

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="size-3.5" />
          {t("privBadge")}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">{t("privTitulo")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("privDesc")}</p>

        <div className="mt-10 space-y-8">
          {SECCOES.map((s) => (
            <section key={s.chaveTitulo}>
              <h2 className="text-lg font-semibold">{t(s.chaveTitulo)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(s.chaveTexto)}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

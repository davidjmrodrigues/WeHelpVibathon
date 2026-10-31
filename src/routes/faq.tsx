import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { IasFaq } from "@/components/ias-faq";
import { LogoWeHelp } from "@/components/logo-wehelp";
import { BotaoIdioma } from "@/components/botao-idioma";
import { SiteFooter } from "@/components/site-footer";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";

export const Route = createFileRoute("/faq")({
  component: PaginaFaq,
  head: () => ({
    meta: [
      { title: "Perguntas e respostas — WeHelp" },
      {
        name: "description",
        content:
          "O que é o IAS, quanto vale em 2026 e como ler os resultados do WeHelp. Perguntas frequentes com valores reais e fontes oficiais.",
      },
      { property: "og:title", content: "Perguntas e respostas — WeHelp" },
      {
        property: "og:description",
        content:
          "O que é o IAS, quanto vale em 2026 e como ler os resultados do WeHelp. Perguntas frequentes com valores reais e fontes oficiais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function PaginaFaq() {
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
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{t("faqTitulo")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("faqDesc")}</p>
        <div className="mt-10">
          <IasFaq />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

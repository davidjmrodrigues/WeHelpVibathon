import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

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
  {
    titulo: "Triagem anónima",
    texto:
      "As respostas que dá no questionário (idade, distrito, situação profissional, agregado familiar e rendimento) são usadas apenas no seu navegador para calcular os apoios que podem aplicar-se. Não são enviadas para nenhum servidor nem guardadas por nós.",
  },
  {
    titulo: "Sem contas nem identificação",
    texto:
      "O WeHelp não pede nome, email, login nem qualquer dado de identificação. Não usamos cookies de rastreamento nem ferramentas de análise que o identifiquem pessoalmente.",
  },
  {
    titulo: "Contacto por email",
    texto:
      "Se nos contactar através da caixa \"Fale connosco\", a mensagem é enviada a partir do seu próprio programa de email para contacto@wehelp.pt. Nesse caso, ficamos com o seu endereço de email apenas para responder ao seu pedido.",
  },
  {
    titulo: "Ligações externas",
    texto:
      "Os cartões de apoio e as fontes oficiais ligam a sites externos (por exemplo Segurança Social, gov.pt e DGES). Esses sites têm as suas próprias políticas de privacidade, que deve consultar.",
  },
  {
    titulo: "Alterações a esta política",
    texto:
      "Se esta política mudar, a versão atualizada fica disponível nesta página. Última atualização: outubro de 2026.",
  },
];

function PaginaPrivacidade() {
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
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="size-3.5" />
          Privacidade em primeiro lugar
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">Política de Privacidade</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          O WeHelp foi desenhado para ser anónimo desde o primeiro clique. Esta página explica, de forma simples,
          como tratamos (e sobretudo como não tratamos) os seus dados.
        </p>

        <div className="mt-10 space-y-8">
          {SECCOES.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-lg font-semibold">{s.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.texto}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

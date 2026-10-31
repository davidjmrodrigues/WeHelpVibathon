import { Instagram, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";
import { LogoWeHelp } from "@/components/logo-wehelp";

const SOCIAIS = [
  { nome: "LinkedIn", href: "https://www.linkedin.com/company/wehelp", Icone: Linkedin },
  { nome: "Instagram", href: "https://www.instagram.com/wehelp.pt", Icone: Instagram },
];

const EXPLORAR = [
  { href: "#apoios", chave: "explorarApoios" },
  { href: "/faq", chave: "explorarFaq" },
  { href: "/fontes", chave: "explorarFontes" },
  { href: "/privacidade", chave: "explorarPrivacidade" },
];

const LIGACAO = "text-sm text-secondary-foreground/80 underline-offset-4 transition-opacity hover:opacity-70 hover:underline";

export function SiteFooter() {
  const { lingua } = useIdioma();
  const t = (chave: string) => tx(lingua, chave);
  const [mensagem, setMensagem] = useState("");
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] lg:gap-14">
          <div>
            <a href="/" className="inline-flex" aria-label="WeHelp — início">
              <LogoWeHelp className="h-24 w-auto" />
            </a>
            <div className="mt-7">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">{t("sigaNos")}</h2>
              <ul className="mt-4 flex gap-2.5">
                {SOCIAIS.map(({ nome, href, Icone }) => (
                  <li key={nome}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={nome}
                      title={nome}
                      className="flex size-9 items-center justify-center rounded-lg border border-secondary-foreground/25 text-secondary-foreground/80 transition-opacity hover:opacity-70"
                    >
                      <Icone aria-hidden="true" className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <address className="mt-7 not-italic text-sm leading-relaxed text-secondary-foreground/80">
              <p className="font-semibold text-secondary-foreground">{t("sede")}</p>
              <p className="mt-1.5">UalgTecCampus</p>
              <p>Campus da Penha · Ualg</p>
              <p>8005-139 Faro, Portugal</p>
            </address>
          </div>
          <div className="flex flex-col gap-9">
            <nav aria-label={t("explorarTitulo")}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">{t("explorarTitulo")}</h2>
              <ul className="mt-4 space-y-3">
                {EXPLORAR.map(l => <li key={l.chave}><a href={l.href} className={LIGACAO}>{t(l.chave)}</a></li>)}
              </ul>
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">{t("faleConnosco")}</h2>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const destino = `mailto:contacto@wehelp.pt?subject=${encodeURIComponent(t("emailAssunto"))}&body=${encodeURIComponent(mensagem)}`;
                window.location.href = destino;
                setMensagem("");
              }}
            >
              <label htmlFor="footer-mensagem" className="sr-only">{t("mensagemAria")}</label>
              <textarea
                id="footer-mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
                rows={3}
                placeholder={t("mensagemPlaceholder")}
                className="w-full resize-none rounded-lg border border-secondary-foreground/25 bg-transparent px-3 py-2.5 text-sm text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary-foreground/40"
              />
              <button
                type="submit"
                className="mt-2.5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-secondary-foreground/25 text-sm font-medium text-secondary-foreground transition-opacity hover:opacity-70"
              >
                <Send aria-hidden="true" className="size-4" />
                {t("enviarEmail")}
              </button>
              <p className="mt-2 text-center text-xs leading-relaxed text-secondary-foreground/60">
                {t("emailLinha1")}
                <br />
                <span className="font-semibold text-secondary-foreground">{t("emailOu")}</span>
                <br />
                {t("emailLinha3")}{" "}
                <strong className="font-semibold text-secondary-foreground">contacto@wehelp.pt</strong>.
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/15">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs leading-relaxed text-secondary-foreground/60">
          <p>{t("direitos")}</p>
        </div>
      </div>
    </footer>
  );
}

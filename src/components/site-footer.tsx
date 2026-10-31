import { Github, Instagram, Linkedin, LockKeyhole, Twitter } from "lucide-react";

const SOCIAIS = [
  { nome: "LinkedIn", href: "https://www.linkedin.com/company/wehelp", Icone: Linkedin },
  { nome: "Instagram", href: "https://www.instagram.com/wehelp.pt", Icone: Instagram },
  { nome: "X (Twitter)", href: "https://x.com/wehelp_pt", Icone: Twitter },
  { nome: "GitHub", href: "https://github.com/wehelp-pt", Icone: Github },
];

const EXPLORAR = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Apoios a explorar", href: "#apoios" },
  { rotulo: "IAS e dúvidas frequentes", href: "#ias-faq" },
];

const FONTES = [
  { rotulo: "Segurança Social", href: "https://seg-social.pt" },
  { rotulo: "gov.pt", href: "https://www.gov.pt" },
  { rotulo: "Portal do Cidadão", href: "https://www.portaldocidadao.pt" },
  { rotulo: "DGES — Bolsas de estudo", href: "https://www.dges.gov.pt/pt/pagina/bolsas-de-estudo" },
];

const LIGACAO = "text-sm text-secondary-foreground/80 underline-offset-4 transition-opacity hover:opacity-70 hover:underline";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] lg:gap-14">
          <div>
            <a href="/" className="inline-flex items-center gap-2.5" aria-label="WeHelp — início">
              <span className="brand-mark" aria-hidden="true" />
              <span className="text-xl font-semibold">WeHelp</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-secondary-foreground/80">
              Um guia rápido e anónimo para descobrir os apoios do Estado português.
            </p>
            <address className="mt-7 not-italic text-sm leading-relaxed text-secondary-foreground/80">
              <p className="font-semibold text-secondary-foreground">Sede</p>
              <p className="mt-1.5">UalgTecCampus</p>
              <p>Campus da Penha · Ualg</p>
              <p>8005-139 Faro, Portugal</p>
              <p className="mt-2">
                <a href="mailto:contacto@wehelp.pt" className={LIGACAO}>contacto@wehelp.pt</a>
              </p>
            </address>
          </div>
          <div className="flex flex-col gap-9">
            <nav aria-label="Explorar o site">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">Explorar</h2>
              <ul className="mt-4 space-y-3">
                {EXPLORAR.map(l => <li key={l.rotulo}><a href={l.href} className={LIGACAO}>{l.rotulo}</a></li>)}
              </ul>
            </nav>
            <nav aria-label="Fontes oficiais">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">Fontes oficiais</h2>
              <ul className="mt-4 space-y-3">
                {FONTES.map(l => (
                  <li key={l.rotulo}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={LIGACAO}>{l.rotulo}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/60">Siga-nos</h2>
            <ul className="mt-4 flex gap-2.5">
              {SOCIAIS.map(({ nome, href, Icone }) => (
                <li key={nome}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={nome}
                    title={nome}
                    className="flex size-11 items-center justify-center rounded-lg border border-secondary-foreground/25 text-secondary-foreground/80 transition-opacity hover:opacity-70"
                  >
                    <Icone aria-hidden="true" className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs leading-relaxed text-secondary-foreground/70 md:items-center">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p className="max-w-2xl">
              Esta orientação não é uma decisão de atribuição. Os montantes dependem das condições de cada apoio.
              Confirme a informação e eventuais alterações na fonte oficial antes de pedir.
            </p>
            <p className="flex shrink-0 items-center gap-2">
              <LockKeyhole aria-hidden="true" className="size-3.5" />
              Não pedimos nome, email nem login. Não guardamos as suas respostas.
            </p>
          </div>
          <p className="text-secondary-foreground/60">© 2026 WeHelp. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

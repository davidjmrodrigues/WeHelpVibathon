import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";
import { IAS_SOURCE, IAS_VALUE, IAS_YEAR, euros, multiplicarIAS } from "@/lib/ias";

export function IasFaq() {
  const { lingua } = useIdioma();
  const t = (chave: string) => tx(lingua, chave);
  return (
    <section id="ias-faq" aria-labelledby="ias-heading" className="mb-10 scroll-mt-24 border-y border-border py-5">
      <h2 id="ias-heading" className="mb-3 text-xl font-semibold">{t("iasFaqTitulo")}</h2>
      <details open className="group">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 font-semibold">
          {t("iasQ1")}
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-detail group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pb-4 pt-2 text-base leading-relaxed text-muted-foreground">
          <p>
            IAS {t("iasSignifica")} <strong className="text-foreground">{t("iasNomeCompleto")}</strong>.{" "}
            {t("iasExplica")}{" "}
            <strong className="text-detail">
              {t("iasEm")} {IAS_YEAR}, 1 IAS = {euros(IAS_VALUE)}
            </strong>
            , {t("iasVigor")}
          </p>
          <p>
            {t("iasExemploLimite")}{" "}
            <strong className="text-foreground">
              2 IAS {t("iasCorrespondeA")} {euros(multiplicarIAS(2))}
            </strong>
            . {t("iasExemploLimite")}{" "}
            <strong className="text-foreground">
              2,5 IAS {t("iasCorrespondeA")} {euros(multiplicarIAS(2.5))}
            </strong>
            , {t("iasArredondado")}
          </p>
          <p>{t("iasNaoSalario")}</p>
          <Button asChild variant="link" className="h-auto min-h-11 whitespace-normal px-0 text-detail"><a href={IAS_SOURCE} target="_blank" rel="noopener noreferrer">{t("consultarOficial")} <ArrowUpRight aria-hidden="true" /></a></Button>
        </div>
      </details>
      <details className="group border-t border-border">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-3 font-semibold">{t("iasQ2")}<ChevronDown aria-hidden="true" className="size-4 shrink-0 text-detail group-open:rotate-180" /></summary>
        <p className="pb-4 text-base leading-relaxed text-muted-foreground">{t("iasResposta2")}</p>
      </details>
    </section>
  );
}

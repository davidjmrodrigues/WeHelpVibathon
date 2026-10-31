import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const IAS_SOURCE = "https://files.diariodarepublica.pt/1s/2025/12/25001/0000200002.pdf";

export function IasFaq() {
  return (
    <section aria-labelledby="ias-heading" className="mb-10 border-y border-border py-5">
      <h2 id="ias-heading" className="mb-3 text-xl font-semibold">IAS e dúvidas frequentes</h2>
      <details open className="group">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 font-semibold">
          O que é o IAS e quanto vale em 2026?
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-detail group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pb-4 pt-2 text-base leading-relaxed text-muted-foreground">
          <p>IAS significa <strong className="text-foreground">Indexante dos Apoios Sociais</strong>. É um valor de referência que o Estado usa para calcular montantes de prestações e alguns limites de acesso. <strong className="text-detail">Em 2026, 1 IAS = 537,13 €</strong>, desde 1 de janeiro.</p>
          <p>Por exemplo, um limite de <strong className="text-foreground">2 IAS corresponde a 1 074,26 €</strong>. Um limite de <strong className="text-foreground">2,5 IAS corresponde a 1 342,83 €</strong>, arredondado aos cêntimos. São exemplos de conversão, não valores que todos recebem.</p>
          <p>O IAS não é o salário mínimo nem um pagamento automático. Cada apoio tem as suas próprias regras: o limite pode ser mensal, anual, por pessoa ou para toda a casa.</p>
          <Button asChild variant="link" className="h-auto min-h-11 whitespace-normal px-0 text-detail"><a href={IAS_SOURCE} target="_blank" rel="noopener noreferrer">Consultar o valor oficial · Portaria n.º 480-A/2025/1 <ArrowUpRight aria-hidden="true" /></a></Button>
        </div>
      </details>
      <details className="group border-t border-border">
        <summary className="flex cursor-pointer items-center justify-between gap-4 py-3 font-semibold">Estes resultados confirmam que tenho direito?<ChevronDown aria-hidden="true" className="size-4 shrink-0 text-detail group-open:rotate-180" /></summary>
        <p className="pb-4 text-base leading-relaxed text-muted-foreground">Não. São apoios que podem aplicar-se ao seu caso. As respostas ajudam a orientar, mas faltam informações como descontos para a Segurança Social, património, filhos, incapacidade ou contrato de arrendamento. Em cada apoio encontra as condições a confirmar e a ligação à fonte oficial. O rendimento bruto anual da casa não substitui o cálculo legal de recursos de cada apoio.</p>
      </details>
    </section>
  );
}
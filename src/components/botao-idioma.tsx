import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIdioma } from "@/lib/idioma";
import { tx } from "@/lib/textos";

/** Botão de troca de idioma PT/EN, usado no cabeçalho de todas as páginas. */
export function BotaoIdioma() {
  const { lingua, alternar } = useIdioma();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={alternar}
      aria-label={tx(lingua, "linguaAria")}
      title={lingua === "pt" ? "English" : "Português"}
      className="gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      <Languages aria-hidden="true" className="size-4" />
      {lingua === "pt" ? "EN" : "PT"}
    </Button>
  );
}

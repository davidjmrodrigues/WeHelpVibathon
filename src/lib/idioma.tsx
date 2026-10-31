import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lingua = "pt" | "en";
const CHAVE = "wehelp-lingua";

interface ContextoIdioma {
  lingua: Lingua;
  alternar: () => void;
}

const Contexto = createContext<ContextoIdioma>({ lingua: "pt", alternar: () => {} });

/**
 * Fornece o idioma ativo (PT por defeito). O valor guardado no navegador
 * aplica-se depois da hidratação, como no tema, para não haver mismatch de SSR.
 */
export function FornecedorIdioma({ children }: { children: ReactNode }) {
  const [lingua, setLingua] = useState<Lingua>("pt");

  useEffect(() => {
    try {
      const guardada = window.localStorage.getItem(CHAVE);
      if (guardada === "en" || guardada === "pt") setLingua(guardada);
    } catch {
      // Sem acesso ao armazenamento: mantém português.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lingua;
  }, [lingua]);

  const alternar = () => {
    setLingua((atual) => {
      const nova = atual === "pt" ? "en" : "pt";
      try {
        window.localStorage.setItem(CHAVE, nova);
      } catch {
        // Sem acesso ao armazenamento: apenas a sessão atual muda.
      }
      return nova;
    });
  };

  return <Contexto.Provider value={{ lingua, alternar }}>{children}</Contexto.Provider>;
}

export function useIdioma(): ContextoIdioma {
  return useContext(Contexto);
}

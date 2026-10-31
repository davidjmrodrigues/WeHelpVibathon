export type Tema = "claro" | "escuro";

const raiz = () => document.getElementById("wehelp-root");
let aAnimar = false;

export function temaAtual(): Tema {
  if (typeof document === "undefined") return "claro";
  return raiz()?.classList.contains("dark") ? "escuro" : "claro";
}

function distanciaAteCanto(x: number, y: number): number {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

/**
 * Revela o snapshot completo do novo tema sobre o antigo, em ambas as direções.
 * O callback deve sincronizar o estado React antes da captura do novo snapshot.
 */
export async function alternarTemaComCirculo(
  x: number,
  y: number,
  aplicarEstado: (tema: Tema) => void,
): Promise<void> {
  const el = raiz();
  if (!el || aAnimar) return;
  const destino: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
  let aplicado = false;
  const aplicar = () => {
    if (aplicado) return;
    aplicado = true;
    el.classList.toggle("dark", destino === "escuro");
    aplicarEstado(destino);
  };

  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    aplicar();
    return;
  }

  aAnimar = true;
  document.documentElement.setAttribute("data-theme-transition", "");
  try {
    const transicao = document.startViewTransition(aplicar);
    // Também cobre falhas na captura, sem deixar uma rejeição por tratar.
    const terminado = transicao.finished.catch(() => undefined);
    try {
      await transicao.ready;
      const animacao = document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${distanciaAteCanto(x, y)}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.65,0,.35,1)", fill: "both", pseudoElement: "::view-transition-new(root)" },
      );
      await animacao.finished;
    } catch {
      transicao.skipTransition();
    }
    await terminado;
  } catch {
    aplicar();
  } finally {
    document.documentElement.removeAttribute("data-theme-transition");
    aAnimar = false;
  }
}

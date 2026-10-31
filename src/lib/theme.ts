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

async function revelarCamada(el: HTMLElement, destino: Tema, x: number, y: number, aplicar: () => void) {
  const camada = document.createElement("div");
  camada.className = "theme-reveal-layer";
  camada.setAttribute("aria-hidden", "true");
  camada.inert = true;
  const copia = el.cloneNode(true) as HTMLElement;
  copia.removeAttribute("id");
  copia.classList.toggle("dark", destino === "escuro");
  camada.append(copia);
  document.body.append(camada);
  // Preserve form values and the visible scroll position in the incoming layer.
  const originais = el.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select");
  copia.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach((campo, i) => {
    const original = originais[i];
    if (original) campo.value = original.value;
  });
  camada.scrollTop = window.scrollY;
  const raio = distanciaAteCanto(x, y);
  try {
    await new Promise<void>(resolve => {
      let inicio: number | undefined;
      const passo = (agora: number) => {
        inicio ??= agora;
        const t = Math.min((agora - inicio) / 750, 1);
        const suave = t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        camada.style.clipPath = `circle(${raio * suave}px at ${x}px ${y}px)`;
        if (t < 1) requestAnimationFrame(passo);
        else resolve();
      };
      requestAnimationFrame(passo);
    });
    aplicar();
  } finally {
    camada.remove();
  }
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


  aAnimar = true;
  document.documentElement.setAttribute("data-theme-transition", "");
  const html = document.documentElement;
  html.style.setProperty("--theme-reveal-x", `${x}px`);
  html.style.setProperty("--theme-reveal-y", `${y}px`);
  html.style.setProperty("--theme-reveal-radius", `${distanciaAteCanto(x, y)}px`);
  try {
    if (!document.startViewTransition) {
      await revelarCamada(el, destino, x, y, aplicar);
      return;
    }
    const transicao = document.startViewTransition(aplicar);
    // Também cobre falhas na captura, sem deixar uma rejeição por tratar.
    const terminado = transicao.finished.catch(() => undefined);
    try {
      await transicao.ready;
    } catch {
      transicao.skipTransition();
    }
    await terminado;
  } catch {
    aplicar();
  } finally {
    document.documentElement.removeAttribute("data-theme-transition");
    for (const nome of ["--theme-reveal-x", "--theme-reveal-y", "--theme-reveal-radius"]) html.style.removeProperty(nome);
    aAnimar = false;
  }
}

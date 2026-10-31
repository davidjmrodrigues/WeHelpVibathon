// Tema claro/escuro: o interruptor vive no DOM (classe .dark no elemento raiz da página).
// Tudo corre dentro de funções chamadas por eventos — nada ao nível do módulo (SSR/Cloudflare).

export type Tema = "claro" | "escuro";

const raiz = () => document.getElementById("wehelp-root");

export function temaAtual(): Tema {
  if (typeof document === "undefined") return "claro";
  return raiz()?.classList.contains("dark") ? "escuro" : "claro";
}

function fundoDe(tema: Tema): string {
  const el = raiz();
  if (!el) return "#fff";
  if (tema === temaAtual()) return getComputedStyle(el).backgroundColor;
  // Lê o fundo do tema de destino sem o aplicar: mede um elemento temporário com a classe alternada.
  el.classList.toggle("dark");
  const cor = getComputedStyle(el).backgroundColor;
  el.classList.toggle("dark");
  return cor;
}

function distanciaAteCanto(x: number, y: number): number {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

/**
 * Expande um círculo a partir do ponto (x, y) até cobrir o ecrã com a cor do novo tema,
 * troca a classe .dark a meio e desvanece o círculo no fim.
 */
export function alternarTemaComCirculo(
  x: number,
  y: number,
  circulo: HTMLElement,
  aoTerminar: (tema: Tema) => void,
): void {
  const el = raiz();
  if (!el) return;
  const destino: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
  const cor = fundoDe(destino);
  const raioFinal = distanciaAteCanto(x, y);

  circulo.style.background = cor;
  circulo.style.left = `${x}px`;
  circulo.style.top = `${y}px`;
  circulo.style.opacity = "1";
  circulo.style.transform = "translate(-50%, -50%) scale(0)";

  const duracao = 750;
  const metade = duracao * 0.5;
  let inicio: number | null = null;
  let trocado = false;

  const passo = (agora: number) => {
    if (inicio === null) inicio = agora;
    const t = Math.min((agora - inicio) / duracao, 1);
    // ease-in-out cúbico: começa devagar (círculo visível a crescer) e acelera
    const suave = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const escala = (suave * raioFinal * 2) / 44; // o círculo tem 44px de diâmetro
    circulo.style.transform = `translate(-50%, -50%) scale(${escala})`;

    if (!trocado && agora - inicio >= metade) {
      trocado = true;
      el.classList.toggle("dark", destino === "escuro");
    }
    if (t < 1) {
      requestAnimationFrame(passo);
    } else {
      circulo.style.transition = "opacity 260ms ease";
      circulo.style.opacity = "0";
      window.setTimeout(() => {
        circulo.style.transition = "";
        circulo.style.transform = "translate(-50%, -50%) scale(0)";
        aoTerminar(destino);
      }, 280);
    }
  };
  requestAnimationFrame(passo);
}

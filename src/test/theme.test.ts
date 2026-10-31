import { afterEach, describe, expect, it, vi } from "vitest";
import { alternarTemaComCirculo, temaAtual } from "../lib/theme";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

function preparar(escuro = false, reduzido = false) {
  document.body.innerHTML = `<div id="wehelp-root" class="${escuro ? "dark" : ""}"></div>`;
  vi.stubGlobal("matchMedia", () => ({ matches: reduzido }));
}

describe("theme snapshot coordination", () => {
  it.each([false, true])("only changes theme inside the snapshot callback (dark=%s)", async escuro => {
    preparar(escuro);
    let capturar: (() => void) | undefined;
    let pronto: (() => void) | undefined;
    const ready = new Promise<void>(resolve => { pronto = resolve; });
    const start = vi.fn((callback: () => void) => {
      capturar = callback;
      return { ready, finished: ready, skipTransition: vi.fn() };
    });
    vi.stubGlobal("document", document);
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: start });
    const animate = vi.fn(() => ({ finished: Promise.resolve() }));
    Object.defineProperty(document.documentElement, "animate", { configurable: true, value: animate });
    const estado = vi.fn();
    const transicao = alternarTemaComCirculo(100, 40, estado);
    expect(temaAtual()).toBe(escuro ? "escuro" : "claro");
    expect(estado).not.toHaveBeenCalled();
    // Repeated clicks cannot schedule overlapping snapshots.
    await alternarTemaComCirculo(100, 40, estado);
    expect(start).toHaveBeenCalledTimes(1);
    capturar?.();
    pronto?.();
    await transicao;
    expect(temaAtual()).toBe(escuro ? "claro" : "escuro");
    expect(estado).toHaveBeenCalledExactlyOnceWith(escuro ? "claro" : "escuro");
    expect(animate).toHaveBeenCalledWith(
      { clipPath: ["circle(0px at 100px 40px)", expect.stringMatching(/^circle\([\d.]+px at 100px 40px\)$/)] },
      expect.objectContaining({ duration: 750, pseudoElement: "::view-transition-new(root)" }),
    );
    expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
  });

  it.each(["reduced motion", "unsupported browser"])("switches immediately for %s", async mode => {
    preparar(false, mode === "reduced motion");
    const start = vi.fn();
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: mode === "reduced motion" ? start : undefined });
    const estado = vi.fn();
    await alternarTemaComCirculo(100, 40, estado);
    expect(start).not.toHaveBeenCalled();
    expect(temaAtual()).toBe("escuro");
    expect(estado).toHaveBeenCalledExactlyOnceWith("escuro");
  });
});
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
    expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
  });

  it("switches immediately for reduced motion", async () => {
    preparar(false, true);
    const start = vi.fn();
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: start });
    const estado = vi.fn();
    await alternarTemaComCirculo(100, 40, estado);
    expect(start).not.toHaveBeenCalled();
    expect(temaAtual()).toBe("escuro");
    expect(estado).toHaveBeenCalledExactlyOnceWith("escuro");
  });

  it.each([false, true])("keeps the old theme until the fallback layer finishes (dark=%s)", async escuro => {
    preparar(escuro);
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.push(callback); return frames.length; });
    const estado = vi.fn();
    const transicao = alternarTemaComCirculo(100, 40, estado);
    expect(temaAtual()).toBe(escuro ? "escuro" : "claro");
    expect(estado).not.toHaveBeenCalled();
    frames.shift()?.(0);
    frames.shift()?.(375);
    expect(estado).not.toHaveBeenCalled();
    frames.shift()?.(750);
    await transicao;
    expect(temaAtual()).toBe(escuro ? "claro" : "escuro");
    expect(estado).toHaveBeenCalledExactlyOnceWith(escuro ? "claro" : "escuro");
  });
});
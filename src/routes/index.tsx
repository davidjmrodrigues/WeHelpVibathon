import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DISTRITOS,
  IAS_VALUE,
  SITUACOES,
  avaliarApoios,
  type Perfil,
  type Situacao,
} from "@/lib/apoios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia de Apoios Sociais — Descubra os benefícios do Estado a que tem direito" },
      { name: "description", content: "Feed interativo de apoios sociais do Estado português, atualizado em tempo real conforme o seu perfil." },
      { property: "og:title", content: "Guia de Apoios Sociais" },
      { property: "og:description", content: "Descubra em tempo real, de forma anónima, a que apoios do Estado tem direito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

interface Filtros {
  idade: string;
  distrito: string;
  situacao: Situacao | "";
  agregado: string;
  rendimento: string;
}

const FILTROS_VAZIOS: Filtros = { idade: "", distrito: "", situacao: "", agregado: "", rendimento: "" };

function Index() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const perfil: Perfil = useMemo(
    () => ({
      idade: filtros.idade === "" ? null : Number(filtros.idade),
      distrito: filtros.distrito,
      situacao: filtros.situacao === "" ? null : filtros.situacao,
      agregado: filtros.agregado === "" ? null : Number(filtros.agregado),
      rendimento: filtros.rendimento === "" ? null : Number(filtros.rendimento),
    }),
    [filtros],
  );

  const apoios = useMemo(() => avaliarApoios(perfil), [perfil]);
  const totalElegiveis = apoios.filter((a) => a.resultado.ok).length;

  const set = (patch: Partial<Filtros>) => setFiltros((f) => ({ ...f, ...patch }));

  const painel = (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="idade" className="mb-1.5 block text-sm font-semibold text-foreground">Idade</label>
        <div className="flex items-center gap-2">
          <input
            id="idade" type="number" min={0} inputMode="numeric" placeholder="Ex: 22"
            value={filtros.idade}
            onChange={(e) => set({ idade: e.target.value })}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:border-primary"
          />
          <span className="text-sm text-muted-foreground">anos</span>
        </div>
      </div>

      <div>
        <label htmlFor="distrito" className="mb-1.5 block text-sm font-semibold text-foreground">Distrito</label>
        <select
          id="distrito" value={filtros.distrito}
          onChange={(e) => set({ distrito: e.target.value })}
          className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:border-primary"
        >
          <option value="">Todos</option>
          {DISTRITOS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-foreground">Situação profissional</legend>
        <div className="flex flex-wrap gap-2">
          {SITUACOES.map((s) => (
            <button
              key={s} type="button"
              onClick={() => set({ situacao: filtros.situacao === s ? "" : s })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filtros.situacao === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="agregado" className="mb-1.5 block text-sm font-semibold text-foreground">Agregado familiar</label>
        <div className="flex items-center gap-2">
          <input
            id="agregado" type="number" min={1} inputMode="numeric" placeholder="Ex: 3"
            value={filtros.agregado}
            onChange={(e) => set({ agregado: e.target.value })}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:border-primary"
          />
          <span className="text-sm text-muted-foreground">pessoas</span>
        </div>
      </div>

      <div>
        <label htmlFor="rendimento" className="mb-1.5 block text-sm font-semibold text-foreground">Rendimento bruto anual</label>
        <div className="flex items-center gap-2">
          <input
            id="rendimento" type="number" min={0} inputMode="numeric" placeholder="Ex: 12000"
            value={filtros.rendimento}
            onChange={(e) => set({ rendimento: e.target.value })}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:border-primary"
          />
          <span className="text-sm text-muted-foreground">€</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFiltros(FILTROS_VAZIOS)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
      >
        Limpar filtros
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="font-display text-xl font-bold text-primary sm:text-2xl">
            Guia de <span className="text-accent-foreground">Apoios Sociais</span>
          </h1>
          <span className="hidden text-xs text-muted-foreground sm:block">100% anónimo · nada é guardado</span>
          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground lg:hidden"
          >
            {filtrosAbertos ? "Fechar filtros ✕" : "Filtros ☰"}
          </button>
        </div>
        {filtrosAbertos && (
          <div className="border-t border-border px-4 py-5 sm:px-6 lg:hidden">{painel}</div>
        )}
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display mb-5 text-lg font-bold text-card-foreground">O seu perfil</h2>
            {painel}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">O seu feed de apoios</p>
            <h2 className="font-display mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              {totalElegiveis > 0
                ? `${totalElegiveis} apoio${totalElegiveis > 1 ? "s" : ""} elegível${totalElegiveis > 1 ? "eis" : ""} para si`
                : "Nenhum apoio elegível de momento"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              O feed atualiza automaticamente a cada alteração nos filtros.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {apoios.map((a) => (
              <article
                key={a.id}
                className={`flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-300 ${
                  a.resultado.ok
                    ? "border-primary/40 bg-card ring-1 ring-primary/20 hover:-translate-y-1 hover:shadow-md"
                    : "border-border bg-card opacity-55"
                }`}
              >
                {a.resultado.ok ? (
                  <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    ✓ Elegível
                  </span>
                ) : (
                  <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Não elegível · {a.resultado.motivo}
                  </span>
                )}
                <h3 className="font-display mt-4 text-xl font-bold text-card-foreground">{a.titulo}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.descricao}</p>
                <p className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">Valor estimado</p>
                <p className="font-display text-2xl font-bold text-primary">{a.valor}</p>
                <a
                  href={a.link} target="_blank" rel="noopener noreferrer"
                  className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-center font-semibold text-primary-foreground hover:opacity-90"
                >
                  Saber mais ↗
                </a>
              </article>
            ))}
          </div>

          <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            Estimativas indicativas. Referência IAS 2026: {IAS_VALUE.toLocaleString("pt-PT")} €.
          </p>
        </main>
      </div>
    </div>
  );
}

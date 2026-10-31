import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DISTRITOS, IAS_VALUE, calcularApoios, type Perfil, type Situacao } from "@/lib/apoios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeHelp — Descubra os apoios do Estado a que tem direito" },
      { name: "description", content: "Triagem rápida e anónima dos apoios do Estado português para o seu perfil." },
      { property: "og:title", content: "WeHelp — Apoios do Estado" },
      { property: "og:description", content: "Descubra em 1 minuto, de forma anónima, a que apoios tem direito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Form = { idade: string; distrito: string; situacao: string; agregado: string; rendimento: string };

const PASSOS: { key: keyof Form; pergunta: string; tipo: "num" | "select"; opcoes?: string[]; sufixo?: string }[] = [
  { key: "idade", pergunta: "Que idade tem?", tipo: "num", sufixo: "anos" },
  { key: "distrito", pergunta: "Em que distrito vive?", tipo: "select", opcoes: DISTRITOS },
  { key: "situacao", pergunta: "Qual é a sua situação profissional?", tipo: "select", opcoes: ["Estudante", "Trabalhador", "Desempregado"] },
  { key: "agregado", pergunta: "Quantas pessoas tem o seu agregado familiar?", tipo: "num", sufixo: "pessoas" },
  { key: "rendimento", pergunta: "Qual o rendimento bruto anual do agregado?", tipo: "num", sufixo: "€" },
];

function Index() {
  const [passo, setPasso] = useState(0);
  const [form, setForm] = useState<Form>({ idade: "", distrito: "", situacao: "", agregado: "", rendimento: "" });
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const atual = PASSOS[passo];
  const valor = form[atual.key];
  const valido = atual.tipo === "num" ? valor !== "" && Number(valor) >= (atual.key === "agregado" ? 1 : 0) : valor !== "";

  const avancar = () => {
    if (!valido) return;
    if (passo < PASSOS.length - 1) return setPasso(passo + 1);
    setPerfil({
      idade: Number(form.idade), distrito: form.distrito, situacao: form.situacao as Situacao,
      agregado: Number(form.agregado), rendimento: Number(form.rendimento),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <button onClick={() => { setPerfil(null); setPasso(0); }} className="font-display text-2xl font-bold text-primary">
          We<span className="text-accent-foreground">Help</span>
        </button>
        <span className="text-xs text-muted-foreground">100% anónimo · nada é guardado</span>
      </header>

      {!perfil ? (
        <main className="mx-auto flex max-w-2xl flex-col px-6 pt-10 pb-20 sm:pt-20">
          <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((passo + 1) / PASSOS.length) * 100}%` }} />
          </div>
          <form key={passo} onSubmit={(e) => { e.preventDefault(); avancar(); }} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="mb-3 text-sm font-medium text-primary">Pergunta {passo + 1} de {PASSOS.length}</p>
            <h1 className="font-display mb-8 text-3xl font-bold text-foreground sm:text-5xl">{atual.pergunta}</h1>
            {atual.tipo === "num" ? (
              <div className="flex items-baseline gap-3 border-b-2 border-primary pb-2">
                <input autoFocus type="number" min={0} inputMode="numeric" value={valor}
                  onChange={(e) => setForm({ ...form, [atual.key]: e.target.value })}
                  className="w-full bg-transparent text-3xl text-foreground outline-none" placeholder="0" />
                <span className="text-xl text-muted-foreground">{atual.sufixo}</span>
              </div>
            ) : atual.opcoes!.length <= 4 ? (
              <div className="grid gap-3">
                {atual.opcoes!.map((o, i) => (
                  <button type="button" key={o} onClick={() => setForm({ ...form, [atual.key]: o })}
                    className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-lg transition ${valor === o ? "border-primary bg-secondary" : "border-border hover:border-primary/50"}`}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary text-sm text-primary">{String.fromCharCode(65 + i)}</span>
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <select autoFocus value={valor} onChange={(e) => setForm({ ...form, [atual.key]: e.target.value })}
                className="w-full rounded-xl border-2 border-border bg-card px-4 py-4 text-xl text-foreground outline-none focus:border-primary">
                <option value="">Selecione…</option>
                {atual.opcoes!.map((o) => <option key={o}>{o}</option>)}
              </select>
            )}
            <div className="mt-10 flex items-center gap-4">
              <button type="submit" disabled={!valido}
                className="rounded-xl bg-primary px-7 py-3 text-lg font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
                {passo === PASSOS.length - 1 ? "Ver resultados" : "OK ↵"}
              </button>
              {passo > 0 && <button type="button" onClick={() => setPasso(passo - 1)} className="text-muted-foreground hover:text-foreground">← Voltar</button>}
            </div>
          </form>
        </main>
      ) : (
        <Resultados perfil={perfil} onReiniciar={() => { setPerfil(null); setPasso(0); }} />
      )}
    </div>
  );
}

function Resultados({ perfil, onReiniciar }: { perfil: Perfil; onReiniciar: () => void }) {
  const apoios = calcularApoios(perfil);
  return (
    <main className="mx-auto max-w-5xl px-6 pt-8 pb-20 animate-in fade-in duration-500">
      <p className="text-sm font-medium text-primary">Os seus resultados</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-5xl">
        {apoios.length > 0 ? `Encontrámos ${apoios.length} apoio${apoios.length > 1 ? "s" : ""} para si` : "Não encontrámos apoios elegíveis"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {perfil.idade} anos · {perfil.distrito} · {perfil.situacao} · {perfil.agregado} pessoa(s) · {perfil.rendimento.toLocaleString("pt-PT")} €/ano
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {apoios.map((a) => (
          <article key={a.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">Elegível</span>
            <h2 className="font-display mt-4 text-xl font-bold text-card-foreground">{a.titulo}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.descricao}</p>
            <p className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">Valor estimado</p>
            <p className="font-display text-2xl font-bold text-primary">{a.valor}</p>
            <a href={a.link} target="_blank" rel="noopener noreferrer"
              className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-center font-semibold text-primary-foreground hover:opacity-90">
              Saber mais ↗
            </a>
          </article>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">Estimativas indicativas. Referência IAS 2026: {IAS_VALUE.toLocaleString("pt-PT")} €.</p>
        <button onClick={onReiniciar} className="rounded-xl border-2 border-primary px-5 py-2 font-semibold text-primary hover:bg-secondary">Recomeçar</button>
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  CircleHelp,
  ChevronDown,
  ArrowUpRight,
  LockKeyhole,
  Moon,
  Sun,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Info,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import {
  DISTRITOS,
  IAS_VALUE,
  SITUACOES,
  avaliarApoios,
  avaliarApoioDescoberto,
  type ApoioAvaliado,
  type Perfil,
  type Situacao,
} from "@/lib/apoios";
import type {
  ApoioDescoberto,
  DadosOficiaisExtraidos,
  RespostaSincronizacao,
  ResultadoPesquisaGov,
} from "@/lib/scraper";
import { alternarTemaComCirculo, temaAtual, type Tema } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeHelp — Encontre os seus apoios sociais" },
      {
        name: "description",
        content:
          "Encontre os apoios do Estado português que podem ser para si. Uma estimativa rápida, anónima e sem guardar os seus dados.",
      },
      { property: "og:title", content: "WeHelp — Encontre os seus apoios sociais" },
      {
        property: "og:description",
        content:
          "Os seus apoios sociais, de forma simples e anónima. Sem login e sem guardar dados.",
      },
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
const FILTROS_VAZIOS: Filtros = {
  idade: "",
  distrito: "",
  situacao: "",
  agregado: "",
  rendimento: "",
};
const CAMPO = "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground";

function Azulejo() {
  return (
    <div className="azulejo-band" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="azulejo" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M14 1 27 14 14 27 1 14Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="14" cy="14" r="2.2" fill="currentColor" />
            <circle cx="0" cy="0" r="2" fill="currentColor" />
            <circle cx="28" cy="28" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#azulejo)" />
      </svg>
    </div>
  );
}

function Index() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [tema, setTema] = useState<Tema>(() => temaAtual());
  const [sincronizando, setSincronizando] = useState(false);
  const [dadosOficiais, setDadosOficiais] = useState<Record<string, DadosOficiaisExtraidos>>({});
  const [apoiosDescobertos, setApoiosDescobertos] = useState<ApoioDescoberto[]>([]);
  const [temaSelecionado, setTemaSelecionado] = useState<string>("Todos");
  const [estadoSincronizacao, setEstadoSincronizacao] = useState<string>("");
  const [termoGov, setTermoGov] = useState("");
  const [pesquisandoGov, setPesquisandoGov] = useState(false);
  const [resultadosGov, setResultadosGov] = useState<ResultadoPesquisaGov[]>([]);
  const [pesquisaGovRealizada, setPesquisaGovRealizada] = useState(false);
  const escuro = tema === "escuro";

  const aoCarregarTema = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    void alternarTemaComCirculo(r.left + r.width / 2, r.top + r.height / 2, (novoTema) => {
      flushSync(() => setTema(novoTema));
    });
  };

  const sincronizarComFontes = async (forcar = false) => {
    setSincronizando(true);
    try {
      const res = await fetch(`/api/sincronizar-apoios${forcar ? "?forcar=1" : ""}`);
      if (!res.ok) throw new Error("Falha ao sincronizar");
      const json = (await res.json()) as RespostaSincronizacao;
      setDadosOficiais(json.apoios ?? {});
      const descobertos = json.apoiosDescobertos ?? [];
      setApoiosDescobertos(descobertos);
      setEstadoSincronizacao(
        `Sincronizado em ${json.sincronizadoEm} · ${json.fontesComSucesso} fichas verificadas + ${descobertos.length} apoios oficiais em tempo real de gov.pt.`,
      );
    } catch {
      if (forcar) {
        setEstadoSincronizacao(
          "Não foi possível contactar os portais oficiais neste momento. A apresentar o catálogo local verificado.",
        );
      }
    } finally {
      setSincronizando(false);
    }
  };

  useEffect(() => {
    void sincronizarComFontes(false);
  }, []);

  const executarPesquisaGov = async (termo: string) => {
    const limpo = termo.trim();
    if (!limpo) return;
    setPesquisandoGov(true);
    setPesquisaGovRealizada(true);
    try {
      const res = await fetch(`/api/pesquisar-gov?q=${encodeURIComponent(limpo)}`);
      if (!res.ok) throw new Error("Falha na pesquisa");
      const json = (await res.json()) as { resultados?: ResultadoPesquisaGov[] };
      setResultadosGov(json.resultados ?? []);
    } catch {
      setResultadosGov([]);
    } finally {
      setPesquisandoGov(false);
    }
  };

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

  const apoiosBase = useMemo(() => avaliarApoios(perfil), [perfil]);

  const apoiosExtraAvaliados: Array<ApoioAvaliado & { tema?: string }> = useMemo(
    () =>
      apoiosDescobertos.map((d) => ({
        id: d.id,
        titulo: d.titulo,
        descricao: d.descricao,
        valor: `Consultar ficha (${d.tema})`,
        entidade: d.entidade,
        link: d.url,
        condicoes: d.condicoes,
        periodo: `Extraído automaticamente do catálogo oficial gov.pt em ${d.consultadoEm}.`,
        verificadoEm: d.consultadoEm,
        elegivel: (p: Perfil) => avaliarApoioDescoberto(d.titulo, d.descricao, p),
        resultado: avaliarApoioDescoberto(d.titulo, d.descricao, perfil),
        tema: d.tema,
      })),
    [apoiosDescobertos, perfil],
  );

  const temasDisponiveis = useMemo(() => {
    const t = new Set<string>(["Todos", "Catálogo Principal"]);
    for (const d of apoiosDescobertos) t.add(d.tema);
    return Array.from(t);
  }, [apoiosDescobertos]);

  const todosApoios = useMemo(() => {
    if (temaSelecionado === "Catálogo Principal") return apoiosBase;
    if (temaSelecionado !== "Todos") {
      return apoiosExtraAvaliados.filter((a) => a.tema === temaSelecionado);
    }
    return [...apoiosBase, ...apoiosExtraAvaliados];
  }, [apoiosBase, apoiosExtraAvaliados, temaSelecionado]);

  const elegiveis = todosApoios.filter((a) => a.resultado.ok);
  const outros = todosApoios.filter((a) => !a.resultado.ok);
  const set = (patch: Partial<Filtros>) => setFiltros((f) => ({ ...f, ...patch }));

  const avancadosAtivos = [
    filtros.idade,
    filtros.distrito,
    filtros.agregado,
    filtros.rendimento,
  ].filter((v) => v !== "").length;

  const temFiltrosAtivos = filtros.situacao !== "" || avancadosAtivos > 0;

  const painelAvancado = (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="f-idade" className="mb-2 block text-base font-semibold">
          Quantos anos tem?
        </label>
        <div className="flex items-center gap-3">
          <input
            id="f-idade"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Ex.: 22"
            value={filtros.idade}
            onChange={(e) => set({ idade: e.target.value })}
            className={CAMPO}
          />
          <span className="text-sm text-muted-foreground">anos</span>
        </div>
      </div>
      <div>
        <label htmlFor="f-distrito" className="mb-2 block text-base font-semibold">
          Onde vive?
        </label>
        <select
          id="f-distrito"
          value={filtros.distrito}
          onChange={(e) => set({ distrito: e.target.value })}
          className={CAMPO}
        >
          <option value="">Todos os distritos</option>
          {DISTRITOS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-agregado" className="mb-2 block text-base font-semibold">
          Quantas pessoas vivem em sua casa?
        </label>
        <div className="flex items-center gap-3">
          <input
            id="f-agregado"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Ex.: 3"
            value={filtros.agregado}
            onChange={(e) => set({ agregado: e.target.value })}
            className={CAMPO}
          />
          <span className="text-sm text-muted-foreground">pessoas</span>
        </div>
      </div>
      <div>
        <label htmlFor="f-rendimento" className="mb-2 block text-base font-semibold">
          Quanto entra, por ano, em sua casa?
        </label>
        <div className="flex items-center gap-3">
          <input
            id="f-rendimento"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Ex.: 12 000"
            value={filtros.rendimento}
            onChange={(e) => set({ rendimento: e.target.value })}
            className={CAMPO}
          />
          <span className="text-sm text-muted-foreground">€</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Rendimento bruto antes dos descontos. O IAS vale{" "}
          {IAS_VALUE.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} € em 2026.
        </p>
      </div>
    </div>
  );

  const lista = (items: typeof todosApoios, disponivel: boolean) => (
    <div className="border-t border-border">
      {items.map((a) => {
        const extraido = dadosOficiais[a.id];
        const verificadoEm = extraido?.sucesso ? extraido.consultadoEm : a.verificadoEm;
        return (
          <details
            key={a.id}
            className={`support-row border-b border-border ${disponivel ? "" : "opacity-60"}`}
          >
            <summary className="flex cursor-pointer items-start gap-3 py-6 focus-visible:rounded-md">
              {disponivel ? (
                <CircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-detail" />
              ) : (
                <span aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground">
                  —
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold leading-tight">{a.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.entidade}</p>
                <p
                  className={`mt-2 text-sm ${disponivel ? "text-detail" : "text-muted-foreground"}`}
                >
                  {disponivel
                    ? "Pode aplicar-se · confirmar condições"
                    : `Não corresponde ao perfil · ${a.resultado.motivo}`}
                </p>
              </div>
              <div className="hidden max-w-48 shrink-0 text-right sm:block">
                <p
                  className={`text-base font-semibold ${disponivel ? "text-primary" : "text-muted-foreground"}`}
                >
                  {a.valor}
                </p>
                <span className="text-xs text-muted-foreground">valor estimado</span>
              </div>
              <ChevronDown
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-muted-foreground"
              />
            </summary>
            <div className="pb-6 pl-8">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                {a.descricao}
              </p>
              <p className="mt-3 font-semibold text-primary sm:hidden">{a.valor}</p>
              <h4 className="mt-4 text-sm font-semibold">Condições a confirmar</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {a.condicoes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {extraido?.sucesso && extraido.resumoOficial && (
                <div className="mt-4 border-l-2 border-primary pl-4">
                  <p className="text-xs font-semibold text-detail">
                    Excerto oficial sincronizado ({extraido.entidadeOficial ?? "gov.pt"}
                    {extraido.atualizadoEm ? ` · atualizado em ${extraido.atualizadoEm}` : ""})
                  </p>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {extraido.resumoOficial}
                  </p>
                  {extraido.condicoesExtraidas && extraido.condicoesExtraidas.length > 0 && (
                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
                      {extraido.condicoesExtraidas[0]}
                    </p>
                  )}
                </div>
              )}
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.periodo}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Fonte: {a.entidade} · Consultada em {verificadoEm}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  variant="link"
                  className="h-auto min-h-11 whitespace-normal px-0 text-detail"
                >
                  <a href={a.link} target="_blank" rel="noopener noreferrer">
                    Saber mais na fonte oficial <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
                {extraido?.sucesso && extraido.fonteUrl !== a.link && (
                  <Button
                    asChild
                    variant="link"
                    className="h-auto min-h-11 whitespace-normal px-0 text-detail"
                  >
                    <a href={extraido.fonteUrl} target="_blank" rel="noopener noreferrer">
                      Ficha sincronizada em gov.pt <ArrowUpRight aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );

  return (
    <div id="wehelp-root" className={escuro ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-20 border-b border-border bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
            <a href="/" aria-label="WeHelp — início" className="flex items-center gap-2.5">
              <span className="brand-mark" aria-hidden="true" />
              <span className="text-xl font-semibold">WeHelp</span>
            </a>
            <div className="flex items-center gap-2">
              <span className="mr-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <LockKeyhole aria-hidden="true" className="size-3.5" />
                Anónimo
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
                title={escuro ? "Modo claro" : "Modo escuro"}
                onClick={aoCarregarTema}
              >
                {escuro ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </header>
        <Azulejo />
        <div className="mx-auto max-w-6xl px-6 py-10 lg:py-12">
          <main className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm font-medium text-detail">Guia de Apoios Sociais</p>
              <span className="group relative inline-flex">
                <button
                  type="button"
                  aria-label="Sobre esta informação"
                  aria-expanded={infoAberto}
                  onClick={() => setInfoAberto((v) => !v)}
                  onBlur={() => setInfoAberto(false)}
                  className="flex size-6 items-center justify-center rounded-full text-detail transition-opacity hover:opacity-70"
                >
                  <Info aria-hidden="true" className="size-4" />
                </button>
                <span
                  role="tooltip"
                  className={`absolute left-0 top-full z-10 mt-2 w-72 rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-muted-foreground shadow-md ${infoAberto ? "block" : "hidden"} group-hover:block`}
                >
                  Informação de fontes oficiais. As respostas orientam a pesquisa, mas não confirmam
                  o direito aos apoios.
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtros rápidos">
              {SITUACOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filtros.situacao === s}
                  onClick={() => set({ situacao: filtros.situacao === s ? "" : s })}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors ${filtros.situacao === s ? "border-primary/70 bg-secondary/70 text-foreground" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`}
                >
                  {s}
                  {filtros.situacao === s && (
                    <Check aria-hidden="true" className="size-3.5 text-primary" />
                  )}
                </button>
              ))}
              <button
                type="button"
                aria-expanded={filtrosAbertos}
                aria-controls="filtros-avancados"
                onClick={() => setFiltrosAbertos((v) => !v)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors ${filtrosAbertos || avancadosAtivos > 0 ? "border-primary/70 bg-secondary/70 text-foreground" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`}
              >
                {filtrosAbertos ? (
                  <X aria-hidden="true" className="size-3.5" />
                ) : (
                  <SlidersHorizontal aria-hidden="true" className="size-3.5" />
                )}
                Mais filtros
                {avancadosAtivos > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {avancadosAtivos}
                  </span>
                )}
              </button>
              {temFiltrosAtivos && (
                <Button
                  variant="ghost"
                  className="min-h-9 rounded-full px-3 text-xs text-detail"
                  onClick={() => setFiltros(FILTROS_VAZIOS)}
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                  Limpar filtros
                </Button>
              )}
            </div>

            {filtrosAbertos && (
              <section
                id="filtros-avancados"
                aria-label="Mais filtros"
                className="mt-4 rounded-2xl border border-border bg-card p-6"
              >
                {painelAvancado}
              </section>
            )}

            {!temFiltrosAtivos && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Catálogo geral aberto:</strong> A apresentar
                  todos os apoios disponíveis ({todosApoios.length}). Indique a sua idade e situação
                  nos filtros acima para descartar medidas que não se destinam ao seu perfil (como
                  apoios de velhice para jovens ou medidas jovens para reformados).
                </p>
              </div>
            )}

            <div
              className="mb-4 mt-6 flex scroll-mt-24 flex-wrap items-baseline justify-between gap-3"
              id="apoios"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {temFiltrosAtivos ? "Apoios recomendados" : "Apoios a explorar"}
                </h2>
                <p className="mt-1 text-sm font-medium text-detail">
                  {temFiltrosAtivos
                    ? `${elegiveis.length} ${elegiveis.length === 1 ? "possível apoio que pode aplicar-se" : "possíveis apoios que podem aplicar-se"}`
                    : `${todosApoios.length} apoios no catálogo total`}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void sincronizarComFontes(true)}
                disabled={sincronizando}
                className="bg-card text-xs"
              >
                <RefreshCw
                  aria-hidden="true"
                  className={`size-3.5 ${sincronizando ? "animate-spin" : ""}`}
                />
                {sincronizando ? "A contactar portais..." : "Sincronizar fontes"}
              </Button>
            </div>

            {estadoSincronizacao && (
              <p role="status" className="mb-4 text-xs text-detail">
                {estadoSincronizacao}
              </p>
            )}

            {temasDisponiveis.length > 2 && (
              <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por área temática">
                {temasDisponiveis.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={temaSelecionado === t}
                    onClick={() => setTemaSelecionado(t)}
                    className={`text-xs ${temaSelecionado === t ? "border-primary bg-secondary" : "bg-card"}`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            )}

            {lista(elegiveis, true)}

            {temFiltrosAtivos && outros.length > 0 && (
              <details className="mt-10 rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  Ver apoios descartados pelos filtros ({outros.length})
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-xs text-muted-foreground">
                    Estes apoios não são compatíveis com a sua idade, situação profissional ou
                    composição da casa.
                  </p>
                  {lista(outros, false)}
                </div>
              </details>
            )}

            <section
              aria-labelledby="pesquisa-gov-heading"
              className="mt-10 border-t border-border pt-8"
            >
              <h2 id="pesquisa-gov-heading" className="text-xl font-semibold">
                Procurar outros serviços e apoios em gov.pt
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Pesquise diretamente no catálogo público do portal gov.pt para encontrar outras
                medidas, licenças ou apoios específicos.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  void executarPesquisaGov(termoGov);
                }}
              >
                <label htmlFor="campo-pesquisa-gov" className="sr-only">
                  Termo a pesquisar em gov.pt
                </label>
                <input
                  id="campo-pesquisa-gov"
                  type="search"
                  placeholder="Ex.: parentalidade, arrendamento, bolsa, deficiência"
                  value={termoGov}
                  onChange={(e) => setTermoGov(e.target.value)}
                  className={CAMPO}
                />
                <Button
                  type="submit"
                  disabled={pesquisandoGov || !termoGov.trim()}
                  className="h-14 shrink-0 px-6"
                >
                  <Search aria-hidden="true" />
                  {pesquisandoGov ? "A pesquisar..." : "Pesquisar em gov.pt"}
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Habitação", "Parentalidade", "Deficiência", "Bolsa de estudo"].map((sugestao) => (
                  <Button
                    key={sugestao}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-card text-xs"
                    onClick={() => {
                      setTermoGov(sugestao);
                      void executarPesquisaGov(sugestao);
                    }}
                  >
                    {sugestao}
                  </Button>
                ))}
              </div>
              {pesquisaGovRealizada &&
                !pesquisandoGov &&
                (resultadosGov.length > 0 ? (
                  <div className="mt-6 border-t border-border">
                    {resultadosGov.map((item) => (
                      <div key={item.url} className="border-b border-border py-5">
                        <p className="text-xs font-medium text-detail">gov.pt · {item.categoria}</p>
                        <h3 className="mt-1 text-lg font-semibold leading-snug">{item.titulo}</h3>
                        {item.descricao && (
                          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            {item.descricao}
                          </p>
                        )}
                        <Button
                          asChild
                          variant="link"
                          className="mt-2 h-auto min-h-11 whitespace-normal px-0 text-detail"
                        >
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Abrir ficha oficial em gov.pt <ArrowUpRight aria-hidden="true" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Não foram encontrados serviços em gov.pt para essa pesquisa.
                  </p>
                ))}
            </section>
          </main>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}

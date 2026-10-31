import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  CircleHelp,
  ChevronDown,
  ArrowUpRight,
  Moon,
  Sun,
  SlidersHorizontal,
  X,
  RotateCcw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWeHelp } from "@/components/logo-wehelp";
import { BotaoIdioma } from "@/components/botao-idioma";
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
import { APOIOS_EN, traduzEntidade, traduzMotivo } from "@/lib/apoios-en";
import { useIdioma, type Lingua } from "@/lib/idioma";
import { rotuloTema, tx } from "@/lib/textos";
import type {
  ApoioDescoberto,
  DadosOficiaisExtraidos,
  RespostaSincronizacao,
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
  habitacao: "" | "arrendada" | "propria";
  filhos: "" | "sim" | "nao" | "monoparental";
}
const FILTROS_VAZIOS: Filtros = {
  idade: "",
  distrito: "",
  situacao: "",
  agregado: "",
  rendimento: "",
  habitacao: "",
  filhos: "",
};
const CAMPO = "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground";
const LIMITE_INICIAL = 20;

function AzulejoPadrao({ id, className }: { id: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 1 27 14 14 27 1 14Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="14" cy="14" r="2.2" fill="currentColor" />
          <circle cx="0" cy="0" r="2" fill="currentColor" />
          <circle cx="28" cy="28" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Azulejo() {
  return (
    <div className="azulejo-band" aria-hidden="true">
      <AzulejoPadrao id="azulejo" />
    </div>
  );
}

interface TextoApoio {
  titulo: string;
  entidade: string;
  descricao: string;
  valor: string;
  periodo: string;
  condicoes: string[];
  link: string;
  verificadoEm: string;
}

function CartaoApoio({
  a,
  disponivel,
  extraido,
  verificadoEm,
  texto,
  lingua,
  t,
}: {
  a: ApoioAvaliado;
  disponivel: boolean;
  extraido: DadosOficiaisExtraidos | undefined;
  verificadoEm: string;
  texto: TextoApoio;
  lingua: Lingua;
  t: (chave: string) => string;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className={`support-row border-b border-border ${disponivel ? "" : "opacity-60"}`}>
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="flex w-full cursor-pointer items-start gap-3 py-6 text-left focus-visible:rounded-md"
      >
        {disponivel ? (
          <CircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-detail" />
        ) : (
          <span aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground">
            —
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold leading-tight">{texto.titulo}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{texto.entidade}</p>
          <p className={`mt-2 text-sm ${disponivel ? "text-detail" : "text-muted-foreground"}`}>
            {disponivel
              ? t("podeAplicar")
              : `${t("naoCorresponde")} · ${a.resultado.motivo ? traduzMotivo(lingua, a.resultado.motivo) : ""}`}
          </p>
        </div>
        <div className="hidden max-w-48 shrink-0 text-right sm:block">
          <p
            className={`text-base font-semibold ${disponivel ? "text-primary" : "text-muted-foreground"}`}
          >
            {texto.valor}
          </p>
          <span className="text-xs text-muted-foreground">{t("valorEstimado")}</span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={`apoio-seta mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out ${aberto ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`apoio-conteudo grid transition-all duration-300 ease-in-out ${aberto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pl-8">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {texto.descricao}
            </p>
            <p className="mt-3 font-semibold text-primary sm:hidden">{texto.valor}</p>
            <h4 className="mt-4 text-sm font-semibold">{t("condicoesTitulo")}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              {texto.condicoes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {extraido?.sucesso && extraido.resumoOficial && (
              <div className="mt-4 border-l-2 border-primary pl-4">
                <p className="text-xs font-semibold text-detail">
                  {t("excertoOficial")} ({extraido.entidadeOficial ?? "gov.pt"}
                  {extraido.atualizadoEm ? ` · ${t("atualizadoEm")} ${extraido.atualizadoEm}` : ""})
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
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{texto.periodo}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("fontePrefix")} {texto.entidade} · {t("consultadaEm")} {verificadoEm}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Button
                asChild
                variant="link"
                className="h-auto min-h-11 whitespace-normal px-0 text-detail"
              >
                <a href={texto.link} target="_blank" rel="noopener noreferrer">
                  {t("saberMais")} <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              {extraido?.sucesso && extraido.fonteUrl !== texto.link && (
                <Button
                  asChild
                  variant="link"
                  className="h-auto min-h-11 whitespace-normal px-0 text-detail"
                >
                  <a href={extraido.fonteUrl} target="_blank" rel="noopener noreferrer">
                    {t("fichaGov")} <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const { lingua } = useIdioma();
  const t = (chave: string) => tx(lingua, chave);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [limpando, setLimpando] = useState(false);
  const resultadosRef = useRef<HTMLDivElement>(null);
  const [verTodos, setVerTodos] = useState(false);
  const [tema, setTema] = useState<Tema>(() => temaAtual());
  const [dadosOficiais, setDadosOficiais] = useState<Record<string, DadosOficiaisExtraidos>>({});
  const [apoiosDescobertos, setApoiosDescobertos] = useState<ApoioDescoberto[]>([]);
  const [temaSelecionado, setTemaSelecionado] = useState<string>("Todos");
  const escuro = tema === "escuro";

  const aoCarregarTema = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    void alternarTemaComCirculo(r.left + r.width / 2, r.top + r.height / 2, (novoTema) => {
      flushSync(() => setTema(novoTema));
    });
  };

  const sincronizarComFontes = async (forcar = false) => {
    try {
      const res = await fetch(`/api/sincronizar-apoios${forcar ? "?forcar=1" : ""}`);
      if (!res.ok) throw new Error("Falha ao sincronizar");
      const json = (await res.json()) as RespostaSincronizacao;
      setDadosOficiais(json.apoios ?? {});
      setApoiosDescobertos(json.apoiosDescobertos ?? []);
    } catch {
      // Falha silenciosa: o catálogo local verificado continua disponível.
    }
  };

  useEffect(() => {
    void sincronizarComFontes(false);
  }, []);

  const perfil: Perfil = useMemo(
    () => ({
      idade: filtros.idade === "" ? null : Number(filtros.idade),
      distrito: filtros.distrito,
      situacao: filtros.situacao === "" ? null : filtros.situacao,
      agregado: filtros.agregado === "" ? null : Number(filtros.agregado),
      rendimento: filtros.rendimento === "" ? null : Number(filtros.rendimento),
      habitacao: filtros.habitacao === "" ? null : filtros.habitacao,
      filhos: filtros.filhos === "" ? null : filtros.filhos,
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
    const temas = new Set<string>(["Todos", "Catálogo Principal"]);
    for (const d of apoiosDescobertos) temas.add(d.tema);
    return Array.from(temas);
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

  const avancadosAtivos =
    [
      filtros.distrito,
      filtros.agregado,
      filtros.rendimento,
      filtros.habitacao,
      filtros.filhos,
    ].filter((v) => v !== "").length + (temaSelecionado !== "Todos" ? 1 : 0);

  const temFiltrosAtivos =
    filtros.situacao !== "" || filtros.idade !== "" || avancadosAtivos > 0;

  const visiveis =
    temFiltrosAtivos || verTodos ? elegiveis : elegiveis.slice(0, LIMITE_INICIAL);

  const limparTudo = () => {
    setFiltros(FILTROS_VAZIOS);
    setTemaSelecionado("Todos");
    setVerTodos(false);
  };

  const limparComAnimacao = () => {
    if (limpando) return;
    setLimpando(true);
    const resultados = resultadosRef.current;
    resultados?.classList.add("resultados-em-transicao", "resultados-animados");
    const saida = resultados?.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-8px)" }],
      { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" },
    );
    window.setTimeout(() => {
      if (!resultados?.isConnected) return;
      const alturaAnterior = resultados.getBoundingClientRect().height;
      flushSync(() => {
        limparTudo();
        setLimpando(false);
      });
      const alturaNova = resultados.getBoundingClientRect().height;
      saida?.cancel();
      resultados.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      const reposicionar = resultados.animate(
        [{ height: `${alturaAnterior}px` }, { height: `${alturaNova}px` }],
        { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      void reposicionar.finished.then(() => {
        resultados.classList.remove("resultados-em-transicao");
      }).catch(() => {
        resultados.classList.remove("resultados-em-transicao");
      });
    }, 350);
  };

  const textoApoio = (a: ApoioAvaliado) => {
    const en = lingua === "en" ? APOIOS_EN[a.id] : undefined;
    return {
      titulo: en?.titulo ?? a.titulo,
      entidade: traduzEntidade(lingua, a.entidade),
      descricao: en?.descricao ?? a.descricao,
      valor: en?.valor ?? a.valor,
      periodo: en?.periodo ?? a.periodo,
      condicoes: en?.condicoes ?? a.condicoes,
      link: a.link,
      verificadoEm: a.verificadoEm,
    };
  };

  const rutiloDistrito = (nome: string): string => {
    if (lingua === "en" && nome === "Região Autónoma dos Açores") return t("distritoAcores");
    if (lingua === "en" && nome === "Região Autónoma da Madeira") return t("distritoMadeira");
    return nome;
  };

  const classePilula = (ativo: boolean) =>
    `inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors ${ativo ? "border-primary/70 bg-secondary/70 text-foreground" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`;

  const painelAvancado = (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-base font-semibold">{t("fHabitacao")}</p>
        <div className="flex flex-wrap gap-2">
          {(["arrendada", "propria"] as const).map((h) => (
            <button
              key={h}
              type="button"
              aria-pressed={filtros.habitacao === h}
              onClick={() => set({ habitacao: filtros.habitacao === h ? "" : h })}
              className={classePilula(filtros.habitacao === h)}
            >
              {t(h === "arrendada" ? "habitacaoArrendada" : "habitacaoPropria")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-base font-semibold">{t("fFilhos")}</p>
        <div className="flex flex-wrap gap-2">
          {(["sim", "nao", "monoparental"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filtros.filhos === f}
              onClick={() => set({ filhos: filtros.filhos === f ? "" : f })}
              className={classePilula(filtros.filhos === f)}
            >
              {t(f === "sim" ? "filhosSim" : f === "nao" ? "filhosNao" : "filhosMonoparental")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="f-distrito" className="mb-2 block text-base font-semibold">
          {t("fDistrito")}
        </label>
        <select
          id="f-distrito"
          value={filtros.distrito}
          onChange={(e) => set({ distrito: e.target.value })}
          className={CAMPO}
        >
          <option value="">{t("todosDistritos")}</option>
          {DISTRITOS.map((d) => (
            <option key={d} value={d}>
              {rutiloDistrito(d)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-agregado" className="mb-2 block text-base font-semibold">
          {t("fAgregado")}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="f-agregado"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder={t("exemploAgregado")}
            value={filtros.agregado}
            onChange={(e) => set({ agregado: e.target.value })}
            className={CAMPO}
          />
          <span className="text-sm text-muted-foreground">{t("pessoas")}</span>
        </div>
      </div>
      <div>
        <label htmlFor="f-rendimento" className="mb-2 block text-base font-semibold">
          {t("fRendimento")}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="f-rendimento"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder={t("exemploRendimento")}
            value={filtros.rendimento}
            onChange={(e) => set({ rendimento: e.target.value })}
            className={CAMPO}
          />
          <span className="text-sm text-muted-foreground">€</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("notaRendimentoPrefix")}{" "}
          {IAS_VALUE.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} €{" "}
          {t("notaRendimentoSufixo")}
        </p>
      </div>
      {temasDisponiveis.length > 1 && (
        <div className="sm:col-span-2">
          <p className="mb-2 text-base font-semibold">{t("fTemas")}</p>
          <div className="flex flex-wrap gap-2">
            {temasDisponiveis.filter((temaFiltro) => temaFiltro !== "Todos").map((temaFiltro) => (
              <button
                key={temaFiltro}
                type="button"
                aria-pressed={temaSelecionado === temaFiltro}
                onClick={() =>
                  setTemaSelecionado(temaSelecionado === temaFiltro ? "Todos" : temaFiltro)
                }
                className={classePilula(temaSelecionado === temaFiltro)}
              >
                {rotuloTema(lingua, temaFiltro)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const lista = (items: typeof todosApoios, disponivel: boolean) => (
    <div className="border-t border-border">
      {items.map((a) => {
        const extraido = dadosOficiais[a.id];
        const verificadoEm = extraido?.sucesso ? extraido.consultadoEm : a.verificadoEm;
        return (
          <CartaoApoio
            key={a.id}
            a={a}
            disponivel={disponivel}
            extraido={extraido}
            verificadoEm={verificadoEm}
            texto={textoApoio(a)}
            lingua={lingua}
            t={t}
          />
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
              <LogoWeHelp className="h-10 w-auto" />
            </a>
            <div className="flex items-center gap-2">
              <BotaoIdioma />
              <Button
                variant="ghost"
                size="icon"
                aria-label={escuro ? t("temaClaroAria") : t("temaEscuroAria")}
                title={escuro ? t("temaClaroTitulo") : t("temaEscuroTitulo")}
                onClick={aoCarregarTema}
              >
                {escuro ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </header>
        <Azulejo />
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-6 lg:pb-12 lg:pt-8">
          <main className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm font-medium text-detail">{t("guiaApoios")}</p>
              <span className="group relative inline-flex">
                <button
                  type="button"
                  aria-label={t("sobreInfo")}
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
                  {t("tooltipInfo")}
                </span>
              </span>
            </div>

            <div
              className="flex flex-wrap items-center gap-2.5"
              role="group"
              aria-label={t("filtrosRapidos")}
            >
              <label className="sr-only" htmlFor="f-idade">
                {t("fIdade")}
              </label>
              <input
                id="f-idade"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t("idadePlaceholder")}
                aria-label={t("fIdade")}
                value={filtros.idade}
                onChange={(e) => set({ idade: e.target.value.replace(/\D/g, "") })}
                className="min-h-9 w-auto min-w-20 rounded-full border border-input/60 bg-card/40 px-4 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors [field-sizing:content] placeholder:text-muted-foreground"
              />
              {SITUACOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filtros.situacao === s}
                  onClick={() => set({ situacao: filtros.situacao === s ? "" : s })}
                  className={classePilula(filtros.situacao === s)}
                >
                  {t(`situacao${s}`)}
                </button>
              ))}
              {temFiltrosAtivos && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("limparFiltros")}
                  title={t("limparFiltros")}
                  className={`limpar-pill size-[34px] rounded-full border border-input/60 bg-card/40 text-detail backdrop-blur-sm transition-all duration-300 ease-in hover:bg-card/70 ${
                    limpando
                      ? "pointer-events-none -rotate-[360deg] scale-0 border-transparent opacity-0"
                      : ""
                  }`}
                  onClick={limparComAnimacao}
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                </Button>
              )}
              <button
                type="button"
                aria-expanded={filtrosAbertos}
                aria-controls="filtros-avancados"
                onClick={() => setFiltrosAbertos((v) => !v)}
                className={`${classePilula(filtrosAbertos || avancadosAtivos > 0)} ml-auto`}
              >
                {filtrosAbertos ? (
                  <X aria-hidden="true" className="size-3.5" />
                ) : (
                  <SlidersHorizontal aria-hidden="true" className="size-3.5" />
                )}
                {t("maisFiltros")}
                {avancadosAtivos > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {avancadosAtivos}
                  </span>
                )}
              </button>
            </div>

            {filtrosAbertos && (
              <section
                id="filtros-avancados"
                aria-label={t("maisFiltros")}
                className="mt-4 rounded-2xl border border-border bg-card p-6"
              >
                {painelAvancado}
              </section>
            )}

            <div ref={resultadosRef} className="flow-root">
            <div
              className="mb-4 mt-6 flex scroll-mt-24 flex-wrap items-baseline justify-between gap-3"
              id="apoios"
            >
              <h2 className="text-xl font-semibold">
                {temFiltrosAtivos ? t("apoiosRecomendados") : t("apoiosExplorar")}
              </h2>
              <p className="text-sm font-medium text-detail">
                {temFiltrosAtivos
                  ? `${elegiveis.length} ${t(elegiveis.length === 1 ? "possivelApoio1" : "possivelApoios")}`
                  : `${todosApoios.length} ${t("contagemCatalogo")}`}
              </p>
            </div>

            {lista(visiveis, true)}
            {!temFiltrosAtivos && elegiveis.length > LIMITE_INICIAL && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  aria-expanded={verTodos}
                  onClick={() => setVerTodos((v) => !v)}
                  className={classePilula(verTodos)}
                >
                  {verTodos
                    ? t("verMenos")
                    : `${t("verTodos")} (${elegiveis.length})`}
                </button>
              </div>
            )}
            {lingua === "en" && apoiosDescobertos.length > 0 && (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {t("notaConteudoOficial")}
              </p>
            )}

            {temFiltrosAtivos && outros.length > 0 && (
              <details className="mt-10 rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  {t("verDescartados")} ({outros.length})
                </summary>
                <div className="mt-4">
                  <p className="mb-4 text-xs text-muted-foreground">{t("descartadosNota")}</p>
                  {lista(outros, false)}
                </div>
              </details>
            )}
            </div>


          <section
            aria-labelledby="duvidas-heading"
            className="relative mt-10 overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.1] [color:var(--detail)]"
            >
              <AzulejoPadrao id="azulejo-card" className="h-full w-full" />
            </div>
            <div className="relative">
              <h2 id="duvidas-heading" className="text-lg font-semibold">
                {t("duvidasTitulo")}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t("duvidasDesc")}
              </p>
              <Button asChild className="mt-4">
                <Link to="/faq">{t("duvidasBotao")}</Link>
              </Button>
            </div>
          </section>
        </main>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}

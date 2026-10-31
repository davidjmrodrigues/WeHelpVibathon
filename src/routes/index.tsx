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
  Plus,
  Check,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWeHelp } from "@/components/logo-wehelp";
import { BotaoIdioma } from "@/components/botao-idioma";
import { SiteFooter } from "@/components/site-footer";
import { Azulejo, AzulejoPadrao } from "@/components/azulejo";
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
import {
  adicionarApoio,
  criarWishlist,
  guardarWishlistLocal,
  carregarWishlistLocal,
  limparWishlist,
  removerApoio,
  validarCompatibilidadeWishlist,
  PACKS_RECOMENDADOS,
  type Wishlist,
  type PackApoios,
} from "@/lib/wishlist";
import {
  APOIOS_EN,
  traduzEntidade,
  traduzMotivo,
  traduzSugestao,
  traduzPack,
} from "@/lib/apoios-en";
import { useIdioma, type Lingua } from "@/lib/idioma";
import { rotuloTema, tx } from "@/lib/textos";
import type { ApoioDescoberto, DadosOficiaisExtraidos, RespostaSincronizacao } from "@/lib/scraper";
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
  naStack,
  onAlternarStack,
}: {
  a: ApoioAvaliado;
  disponivel: boolean;
  extraido: DadosOficiaisExtraidos | undefined;
  verificadoEm: string;
  texto: TextoApoio;
  lingua: Lingua;
  t: (chave: string) => string;
  naStack: boolean;
  onAlternarStack: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className={`support-row border-b border-border ${disponivel ? "" : "opacity-60"}`}>
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
          className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 py-6 text-left focus-visible:rounded-md"
        >
          <div className="flex shrink-0 flex-col items-center gap-2">
            {disponivel ? (
              <CircleHelp aria-hidden="true" className="size-5 text-detail" />
            ) : (
              <span aria-hidden="true" className="size-5 text-muted-foreground">
                —
              </span>
            )}
            <ChevronDown
              aria-hidden="true"
              className={`apoio-seta size-4 text-muted-foreground transition-transform duration-300 ease-in-out ${aberto ? "rotate-180" : ""}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-tight">{texto.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{texto.entidade}</p>
            <p className={`mt-2 text-sm ${disponivel ? "text-detail" : "text-muted-foreground"}`}>
              {disponivel
                ? t("podeAplicar")
                : `${t("naoCorresponde")} · ${a.resultado.motivo ? traduzMotivo(lingua, a.resultado.motivo) : ""}`}
            </p>
          </div>
        </button>
        <div className="flex flex-col items-end gap-1 pt-6">
          <p
            className={`hidden text-base font-semibold sm:block ${disponivel ? "text-primary" : "text-muted-foreground"}`}
          >
            {texto.valor}
          </p>
          <button
            type="button"
            aria-pressed={naStack}
            aria-label={naStack ? t("stackRemoverAria") : t("stackAdicionarAria")}
            title={naStack ? t("stackRemoverAria") : t("stackAdicionarAria")}
            onClick={onAlternarStack}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 active:scale-95 ${
              naStack
                ? "border-primary/70 bg-secondary/70 text-foreground"
                : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {naStack ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>
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

function CartaoPack({
  pack,
  lingua,
  t,
  obterApoio,
}: {
  pack: PackApoios;
  lingua: Lingua;
  t: (chave: string) => string;
  obterApoio: (id: string) => { titulo: string; entidade: string; valor: string } | undefined;
}) {
  const [aberto, setAberto] = useState(false);
  const textoPack = traduzPack(lingua, pack);

  return (
    <div className="support-row border-b border-border">
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
          className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 py-6 text-left focus-visible:rounded-md"
        >
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Boxes aria-hidden="true" className="size-5 text-detail" />
            <ChevronDown
              aria-hidden="true"
              className={`apoio-seta size-4 text-muted-foreground transition-transform duration-300 ease-in-out ${aberto ? "rotate-180" : ""}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold leading-tight">{textoPack.nome}</h3>
              <span className="rounded-full border border-primary/40 bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-detail">
                {t("packVerificado")}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{textoPack.publicoAlvo}</p>
            <p className="mt-2 text-sm text-detail">
              {pack.apoioIds.length} {t("packApoiosContagem")} · {t("packCompativelTag")}
            </p>
          </div>
        </button>
        <div className="pt-6 text-right">
          <p className="text-base font-semibold text-primary">
            {pack.apoioIds.length} {t("apoiosContagemCurta")}
          </p>
        </div>
      </div>
      <div
        className={`apoio-conteudo grid transition-all duration-300 ease-in-out ${aberto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pl-8">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {textoPack.descricao}
            </p>
            <h4 className="mt-4 text-sm font-semibold">{t("packApoiosIncluidos")}</h4>
            <div className="mt-2.5 space-y-2">
              {pack.apoioIds.map((apoioId) => {
                const info = obterApoio(apoioId);
                return (
                  <div
                    key={apoioId}
                    className="flex flex-col justify-between gap-1 rounded-xl border border-border/80 bg-background/50 p-3 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {info?.titulo ?? apoioId}
                      </p>
                      <p className="text-xs text-muted-foreground">{info?.entidade}</p>
                    </div>
                    {info?.valor && (
                      <span className="text-xs font-semibold text-primary sm:text-right">
                        {info.valor}
                      </span>
                    )}
                  </div>
                );
              })}
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
  const [stack, setStack] = useState<Wishlist>(() => criarWishlist());
  const [saindoStack, setSaindoStack] = useState<ReadonlySet<string>>(new Set());
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

  useEffect(() => {
    setStack(carregarWishlistLocal());
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

  const temFiltrosAtivos = filtros.situacao !== "" || filtros.idade !== "" || avancadosAtivos > 0;

  const visiveis = temFiltrosAtivos || verTodos ? elegiveis : elegiveis.slice(0, LIMITE_INICIAL);

  const emTransicaoRef = useRef(false);

  const transicaoResultados = (aplicar: () => void, duracaoSaida = 250) => {
    if (emTransicaoRef.current) {
      aplicar();
      return;
    }
    emTransicaoRef.current = true;
    const resultados = resultadosRef.current;
    resultados?.classList.add("resultados-em-transicao", "resultados-animados");
    const saida = resultados?.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-6px)" },
      ],
      { duration: duracaoSaida, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" },
    );
    window.setTimeout(() => {
      if (!resultados?.isConnected) {
        emTransicaoRef.current = false;
        return;
      }
      const alturaAnterior = resultados.getBoundingClientRect().height;
      flushSync(aplicar);
      const alturaNova = resultados.getBoundingClientRect().height;
      saida?.cancel();
      resultados.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      const reposicionar = resultados.animate(
        [{ height: `${alturaAnterior}px` }, { height: `${alturaNova}px` }],
        { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      void reposicionar.finished
        .then(() => {
          resultados.classList.remove("resultados-em-transicao");
          emTransicaoRef.current = false;
        })
        .catch(() => {
          resultados.classList.remove("resultados-em-transicao");
          emTransicaoRef.current = false;
        });
    }, duracaoSaida);
  };

  const limparTudo = () => {
    setFiltros(FILTROS_VAZIOS);
    setTemaSelecionado("Todos");
    setVerTodos(false);
  };

  const limparComAnimacao = () => {
    if (limpando) return;
    setLimpando(true);
    window.setTimeout(() => {
      setLimpando(false);
      transicaoResultados(limparTudo, 250);
    }, 300);
  };

  const setComAnimacao = (patch: Partial<Filtros>) => transicaoResultados(() => set(patch));
  const setTemaComAnimacao = (novoTema: string) =>
    transicaoResultados(() => setTemaSelecionado(novoTema));

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

  const tituloDe = (id: string) => {
    const a = todosApoios.find((x) => x.id === id);
    if (!a) return id;
    return textoApoio(a).titulo;
  };

  const validacaoStack = useMemo(
    () => validarCompatibilidadeWishlist(stack.itens.map((i) => i.id)),
    [stack],
  );
  const assinaturaStack = `${validacaoStack.valida}|${validacaoStack.conflitos.map((c) => `${c.apoioA}>${c.apoioB}`).join(",")}|${validacaoStack.dependenciasEmFalta.map((d) => d.apoioId).join(",")}`;
  const stackIds = useMemo(() => new Set(stack.itens.map((i) => i.id)), [stack]);
  const okPorId = useMemo(
    () => new Map(todosApoios.map((x) => [x.id, x.resultado.ok] as const)),
    [todosApoios],
  );

  const alternarStack = (id: string) => {
    if (stack.itens.some((i) => i.id === id)) {
      setSaindoStack((s) => new Set(s).add(id));
      window.setTimeout(() => {
        setSaindoStack((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setStack((atual) => {
          const nova = removerApoio(atual, id);
          guardarWishlistLocal(nova);
          return nova;
        });
      }, 180);
      return;
    }
    setStack((atual) => {
      const nova = adicionarApoio(atual, id);
      guardarWishlistLocal(nova);
      return nova;
    });
  };

  const limparStack = () => {
    if (stack.itens.length === 0) return;
    setSaindoStack(new Set(stack.itens.map((i) => i.id)));
    window.setTimeout(() => {
      setSaindoStack(new Set());
      const nova = limparWishlist();
      guardarWishlistLocal(nova);
      setStack(nova);
    }, 180);
  };

  const obterInfoApoio = (id: string) => {
    const a = todosApoios.find((x) => x.id === id);
    if (!a) return undefined;
    const info = textoApoio(a);
    return {
      titulo: info.titulo,
      entidade: info.entidade,
      valor: info.valor,
    };
  };

  const rutiloDistrito = (nome: string): string => {
    if (lingua === "en" && nome === "Região Autónoma dos Açores") return t("distritoAcores");
    if (lingua === "en" && nome === "Região Autónoma da Madeira") return t("distritoMadeira");
    return nome;
  };

  const classePilula = (ativo: boolean) =>
    `inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors active:scale-95 ${ativo ? "border-primary/70 bg-secondary/70 text-foreground pilula-selecionada" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`;

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
              onClick={() => setComAnimacao({ habitacao: filtros.habitacao === h ? "" : h })}
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
              onClick={() => setComAnimacao({ filhos: filtros.filhos === f ? "" : f })}
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
            {temasDisponiveis
              .filter((temaFiltro) => temaFiltro !== "Todos")
              .map((temaFiltro) => (
                <button
                  key={temaFiltro}
                  type="button"
                  aria-pressed={temaSelecionado === temaFiltro}
                  onClick={() =>
                    setTemaComAnimacao(temaSelecionado === temaFiltro ? "Todos" : temaFiltro)
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
            naStack={stackIds.has(a.id)}
            onAlternarStack={() => alternarStack(a.id)}
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
                  onClick={() => setComAnimacao({ situacao: filtros.situacao === s ? "" : s })}
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

              <section
                aria-live="polite"
                inert={stack.itens.length === 0}
                className={`stack-painel pointer-events-none fixed inset-x-0 bottom-0 z-40 ${stack.itens.length === 0 ? "stack-painel-fechado" : ""}`}
              >
                <div className="stack-painel-interior">
                  <div className="mx-4 mb-6 rounded-xl border border-border bg-card p-4 shadow-xl pointer-events-auto sm:mx-auto sm:max-h-[70vh] sm:max-w-3xl sm:overflow-y-auto">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">
                        {t("stackTitulo")} · {stack.itens.length}
                      </h3>
                      <button
                        type="button"
                        onClick={limparStack}
                        className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        {t("stackLimpar")}
                      </button>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {stack.itens.map((item) => (
                        <li
                          key={item.id}
                          className={`stack-chip ${saindoStack.has(item.id) ? "stack-chip-saindo" : ""}`}
                        >
                          <button
                            type="button"
                            title={t("stackRemoverChip")}
                            onClick={() => alternarStack(item.id)}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/70 bg-secondary/70 px-3 text-xs font-medium text-foreground backdrop-blur-sm transition-opacity hover:opacity-80"
                          >
                            {tituloDe(item.id)}
                            {okPorId.get(item.id) === false && (
                              <span className="text-[10px] text-muted-foreground">
                                · {t("stackForaPerfil")}
                              </span>
                            )}
                            <X aria-hidden="true" className="size-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div key={assinaturaStack} className="stack-resultado mt-3 space-y-2">
                      {validacaoStack.valida ? (
                        <p className="text-sm font-medium text-primary">{t("stackTudoOk")}</p>
                      ) : (
                        <>
                          {validacaoStack.conflitos.map((c) => (
                            <div
                              key={`${c.apoioA}-${c.apoioB}`}
                              className="rounded-lg border-l-2 border-destructive bg-destructive/10 px-3 py-2"
                            >
                              <p className="text-sm font-semibold text-destructive">
                                {t(
                                  c.tipo === "incompatibilidade_perfil"
                                    ? "stackPerfilTitulo"
                                    : "stackConflitoTitulo",
                                )}
                              </p>
                              <p className="mt-1 text-xs font-medium">
                                {tituloDe(c.apoioA)} · {tituloDe(c.apoioB)}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {traduzMotivo(lingua, c.motivo)}
                              </p>
                              {c.baseLegal && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {t("stackBaseLegal")}: {c.baseLegal}
                                </p>
                              )}
                              {c.fontes?.map((url, i) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mr-3 text-xs text-primary underline"
                                >
                                  {t("stackFonte")} {i + 1} · {c.verificadoEm}
                                </a>
                              ))}
                              <p className="mt-1 text-xs leading-relaxed text-detail">
                                <span className="font-semibold">{t("stackSugestao")}:</span>{" "}
                                {traduzSugestao(lingua, c.sugestao)}
                              </p>
                            </div>
                          ))}
                          {validacaoStack.dependenciasEmFalta.map((d) => (
                            <div
                              key={d.apoioId}
                              className="rounded-lg border-l-2 border-border px-3 py-2"
                            >
                              <p className="text-sm font-semibold">{t("stackDependenciaTitulo")}</p>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {traduzMotivo(lingua, d.motivo)}
                              </p>
                            </div>
                          ))}
                        </>
                      )}
                      {validacaoStack.paresPorConfirmar.length > 0 && (
                        <details className="text-sm text-muted-foreground">
                          <summary className="cursor-pointer">
                            {t("stackPorConfirmar")} · {validacaoStack.paresPorConfirmar.length}
                          </summary>
                          <ul className="mt-2 space-y-1">
                            {validacaoStack.paresPorConfirmar.map((p) => (
                              <li key={`${p.apoioA}-${p.apoioB}`}>
                                {tituloDe(p.apoioA)} + {tituloDe(p.apoioB)}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {t("stackAviso")}
                    </p>
                  </div>
                </div>
              </section>

              {lista(visiveis, true)}
              {!temFiltrosAtivos && elegiveis.length > LIMITE_INICIAL && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    aria-expanded={verTodos}
                    onClick={() => setVerTodos((v) => !v)}
                    className={classePilula(verTodos)}
                  >
                    {verTodos ? t("verMenos") : `${t("verTodos")} (${elegiveis.length})`}
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
              id="packs-apoios"
              aria-labelledby="packs-heading"
              className="mt-12 border-t border-border pt-10"
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 id="packs-heading" className="text-xl font-semibold">
                    {t("packsTitulo")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("packsDescricao")}</p>
                </div>
                <p className="text-sm font-medium text-detail">
                  {PACKS_RECOMENDADOS.length} {t("packsDisponiveis")}
                </p>
              </div>

              <div className="border-t border-border">
                {PACKS_RECOMENDADOS.map((pack) => (
                  <CartaoPack
                    key={pack.id}
                    pack={pack}
                    lingua={lingua}
                    t={t}
                    obterApoio={obterInfoApoio}
                  />
                ))}
              </div>
            </section>

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

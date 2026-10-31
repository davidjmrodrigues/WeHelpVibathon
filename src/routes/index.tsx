import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { CircleHelp, ChevronDown, ArrowUpRight, LockKeyhole, Moon, Sun, SlidersHorizontal, X, RotateCcw, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IasFaq } from "@/components/ias-faq";
import { SiteFooter } from "@/components/site-footer";
import { DISTRITOS, IAS_VALUE, SITUACOES, avaliarApoios, type Perfil, type Situacao } from "@/lib/apoios";
import { alternarTemaComCirculo, temaAtual, type Tema } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "WeHelp — Encontre os seus apoios sociais" },
    { name: "description", content: "Encontre os apoios do Estado português que podem ser para si. Uma estimativa rápida, anónima e sem guardar os seus dados." },
    { property: "og:title", content: "WeHelp — Encontre os seus apoios sociais" },
    { property: "og:description", content: "Os seus apoios sociais, de forma simples e anónima. Sem login e sem guardar dados." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Index,
});

interface Filtros { idade: string; distrito: string; situacao: Situacao | ""; agregado: string; rendimento: string; }
const FILTROS_VAZIOS: Filtros = { idade: "", distrito: "", situacao: "", agregado: "", rendimento: "" };
const CAMPO = "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground";

function Azulejo() {
  return <div className="azulejo-band" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="azulejo" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M14 1 27 14 14 27 1 14Z" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="14" cy="14" r="2.2" fill="currentColor"/><circle cx="0" cy="0" r="2" fill="currentColor"/><circle cx="28" cy="28" r="2" fill="currentColor"/></pattern></defs><rect width="100%" height="100%" fill="url(#azulejo)"/></svg></div>;
}

function Index() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [tema, setTema] = useState<Tema>(() => temaAtual());
  const escuro = tema === "escuro";
  const aoCarregarTema = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    void alternarTemaComCirculo(r.left + r.width / 2, r.top + r.height / 2, novoTema => {
      flushSync(() => setTema(novoTema));
    });
  };
  const perfil: Perfil = useMemo(() => ({
    idade: filtros.idade === "" ? null : Number(filtros.idade), distrito: filtros.distrito,
    situacao: filtros.situacao === "" ? null : filtros.situacao,
    agregado: filtros.agregado === "" ? null : Number(filtros.agregado),
    rendimento: filtros.rendimento === "" ? null : Number(filtros.rendimento),
  }), [filtros]);
  const apoios = useMemo(() => avaliarApoios(perfil), [perfil]);
  const elegiveis = apoios.filter(a => a.resultado.ok);
  const outros = apoios.filter(a => !a.resultado.ok);
  const set = (patch: Partial<Filtros>) => setFiltros(f => ({ ...f, ...patch }));

  const avancadosAtivos = [filtros.idade, filtros.distrito, filtros.agregado, filtros.rendimento].filter(v => v !== "").length;

  const painelAvancado = <div className="grid gap-6 sm:grid-cols-2">
    <div><label htmlFor="f-idade" className="mb-2 block text-base font-semibold">Quantos anos tem?</label><div className="flex items-center gap-3"><input id="f-idade" type="number" min={0} inputMode="numeric" placeholder="Ex.: 22" value={filtros.idade} onChange={e => set({ idade: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">anos</span></div></div>
    <div><label htmlFor="f-distrito" className="mb-2 block text-base font-semibold">Onde vive?</label><select id="f-distrito" value={filtros.distrito} onChange={e => set({ distrito: e.target.value })} className={CAMPO}><option value="">Todos os distritos</option>{DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
    <div><label htmlFor="f-agregado" className="mb-2 block text-base font-semibold">Quantas pessoas vivem em sua casa?</label><div className="flex items-center gap-3"><input id="f-agregado" type="number" min={1} inputMode="numeric" placeholder="Ex.: 3" value={filtros.agregado} onChange={e => set({ agregado: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">pessoas</span></div></div>
    <div><label htmlFor="f-rendimento" className="mb-2 block text-base font-semibold">Quanto entra, por ano, em sua casa?</label><div className="flex items-center gap-3"><input id="f-rendimento" type="number" min={0} inputMode="numeric" placeholder="Ex.: 12 000" value={filtros.rendimento} onChange={e => set({ rendimento: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">€</span></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Rendimento bruto, antes dos descontos. O IAS vale {IAS_VALUE.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} € em 2026. Este rendimento não substitui o cálculo de recursos de cada apoio.</p></div>
  </div>;

  const lista = (items: typeof apoios, disponivel: boolean) => <div className="border-t border-border">{items.map(a => <details key={a.id} className={`support-row border-b border-border ${disponivel ? "" : "opacity-60"}`}>
    <summary className="flex cursor-pointer items-start gap-3 py-6 focus-visible:rounded-md">
      {disponivel ? <CircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-detail"/> : <span aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground">—</span>}
      <div className="min-w-0 flex-1"><h3 className="text-xl font-semibold leading-tight">{a.titulo}</h3><p className="mt-1 text-sm text-muted-foreground">{a.entidade}</p><p className={`mt-2 text-sm ${disponivel ? "text-detail" : "text-muted-foreground"}`}>{disponivel ? "Pode aplicar-se · confirmar condições" : `Não corresponde ao perfil · ${a.resultado.motivo}`}</p></div>
      <div className="hidden max-w-48 shrink-0 text-right sm:block"><p className={`text-base font-semibold ${disponivel ? "text-primary" : "text-muted-foreground"}`}>{a.valor}</p><span className="text-xs text-muted-foreground">valor estimado</span></div><ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground"/>
    </summary>
    <div className="pb-6 pl-8"><p className="max-w-xl text-base leading-relaxed text-muted-foreground">{a.descricao}</p><p className="mt-3 font-semibold text-primary sm:hidden">{a.valor}</p><h4 className="mt-4 text-sm font-semibold">Condições a confirmar</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">{a.condicoes.map(c => <li key={c}>{c}</li>)}</ul><p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.periodo}</p><p className="mt-2 text-xs text-muted-foreground">Fonte: {a.entidade} · Consultada em {a.verificadoEm}</p><Button asChild variant="link" className="mt-3 h-auto min-h-11 whitespace-normal px-0 text-detail"><a href={a.link} target="_blank" rel="noopener noreferrer">Saber mais na fonte oficial <ArrowUpRight aria-hidden="true"/></a></Button></div>
  </details>)}</div>;

  return <div id="wehelp-root" className={escuro ? "dark" : ""}><div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-background"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4"><a href="/" aria-label="WeHelp — início" className="flex items-center gap-2.5"><span className="brand-mark" aria-hidden="true"/><span className="text-xl font-semibold">WeHelp</span></a><div className="flex items-center gap-2"><span className="mr-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><LockKeyhole aria-hidden="true" className="size-3.5"/>Anónimo</span><Button variant="ghost" size="icon" aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"} title={escuro ? "Modo claro" : "Modo escuro"} onClick={aoCarregarTema}>{escuro ? <Sun aria-hidden="true"/> : <Moon aria-hidden="true"/>}</Button></div></div></header>
    <Azulejo/>
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-12">
      <main className="min-w-0"><div className="mb-4 flex items-center gap-2"><p className="text-sm font-medium text-detail">Guia de Apoios Sociais</p><span className="group relative inline-flex"><button type="button" aria-label="Sobre esta informação" aria-expanded={infoAberto} onClick={() => setInfoAberto(v => !v)} onBlur={() => setInfoAberto(false)} className="flex size-6 items-center justify-center rounded-full text-detail transition-opacity hover:opacity-70"><Info aria-hidden="true" className="size-4"/></button><span role="tooltip" className={`absolute left-0 top-full z-10 mt-2 w-72 rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-muted-foreground shadow-md ${infoAberto ? "block" : "hidden"} group-hover:block`}>Informação de fontes oficiais. As respostas orientam a pesquisa, mas não confirmam o direito aos apoios.</span></span></div>
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtros rápidos">
          {SITUACOES.map(s => <button key={s} type="button" aria-pressed={filtros.situacao === s} onClick={() => set({ situacao: filtros.situacao === s ? "" : s })} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors ${filtros.situacao === s ? "border-primary/70 bg-secondary/70 text-foreground" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`}>{s}{filtros.situacao === s && <Check aria-hidden="true" className="size-3.5 text-primary"/>}</button>)}
          <button type="button" aria-expanded={filtrosAbertos} aria-controls="filtros-avancados" onClick={() => setFiltrosAbertos(v => !v)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium backdrop-blur-sm transition-colors ${filtrosAbertos || avancadosAtivos > 0 ? "border-primary/70 bg-secondary/70 text-foreground" : "border-input/60 bg-card/40 text-muted-foreground hover:text-foreground"}`}>{filtrosAbertos ? <X aria-hidden="true" className="size-3.5"/> : <SlidersHorizontal aria-hidden="true" className="size-3.5"/>}Mais filtros{avancadosAtivos > 0 && <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{avancadosAtivos}</span>}</button>
          {(filtros.situacao !== "" || avancadosAtivos > 0) && <Button variant="ghost" className="min-h-9 rounded-full px-3 text-xs text-detail" onClick={() => setFiltros(FILTROS_VAZIOS)}><RotateCcw aria-hidden="true" className="size-3.5"/>Limpar filtros</Button>}
        </div>
        {filtrosAbertos && <section id="filtros-avancados" aria-label="Mais filtros" className="mt-4 rounded-2xl border border-border bg-card p-6">{painelAvancado}</section>}
        <div className="mb-4 mt-6 flex scroll-mt-24 items-baseline justify-between gap-3" id="apoios"><h2 className="text-xl font-semibold">Apoios a explorar</h2><p className="text-sm font-medium text-detail">{elegiveis.length} {elegiveis.length === 1 ? "possível apoio" : "possíveis apoios"}</p></div>
        {lista(elegiveis, true)}
        {outros.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-semibold">Outros apoios</h2>{lista(outros, false)}</section>}
        <div className="mt-10"><IasFaq/></div>
      </main>
    </div>
    <SiteFooter/>
  </div></div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { CircleHelp, ChevronDown, ArrowUpRight, LockKeyhole, Moon, Sun, SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IasFaq } from "@/components/ias-faq";
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
  const [tema, setTema] = useState<Tema>(() => temaAtual());
  const circuloRef = useRef<HTMLDivElement>(null);
  const escuro = tema === "escuro";
  const aoCarregarTema = (e: React.MouseEvent<HTMLButtonElement>) => {
    const circulo = circuloRef.current;
    if (!circulo) return;
    const r = e.currentTarget.getBoundingClientRect();
    alternarTemaComCirculo(r.left + r.width / 2, r.top + r.height / 2, circulo, setTema);
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

  const painel = (prefixo: string) => <div className="flex flex-col gap-6">
    <div><label htmlFor={`${prefixo}-idade`} className="mb-2 block text-base font-semibold">Quantos anos tem?</label><div className="flex items-center gap-3"><input id={`${prefixo}-idade`} type="number" min={0} inputMode="numeric" placeholder="Ex.: 22" value={filtros.idade} onChange={e => set({ idade: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">anos</span></div></div>
    <div><label htmlFor={`${prefixo}-distrito`} className="mb-2 block text-base font-semibold">Onde vive?</label><select id={`${prefixo}-distrito`} value={filtros.distrito} onChange={e => set({ distrito: e.target.value })} className={CAMPO}><option value="">Todos os distritos</option>{DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
    <fieldset><legend className="mb-2 text-base font-semibold">O que faz neste momento?</legend><div className="flex flex-col gap-2.5">{SITUACOES.map(s => <Button key={s} type="button" variant="outline" aria-pressed={filtros.situacao === s} onClick={() => set({ situacao: filtros.situacao === s ? "" : s })} className={`h-14 w-full justify-between text-base ${filtros.situacao === s ? "border-primary bg-secondary" : "bg-card"}`}>{s}{filtros.situacao === s && <Check aria-hidden="true" className="text-primary"/>}</Button>)}</div></fieldset>
    <div><label htmlFor={`${prefixo}-agregado`} className="mb-2 block text-base font-semibold">Quantas pessoas vivem em sua casa?</label><div className="flex items-center gap-3"><input id={`${prefixo}-agregado`} type="number" min={1} inputMode="numeric" placeholder="Ex.: 3" value={filtros.agregado} onChange={e => set({ agregado: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">pessoas</span></div></div>
    <div><label htmlFor={`${prefixo}-rendimento`} className="mb-2 block text-base font-semibold">Quanto entra, por ano, em sua casa?</label><div className="flex items-center gap-3"><input id={`${prefixo}-rendimento`} type="number" min={0} inputMode="numeric" placeholder="Ex.: 12 000" value={filtros.rendimento} onChange={e => set({ rendimento: e.target.value })} className={CAMPO}/><span className="text-sm text-muted-foreground">€</span></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Rendimento bruto, antes dos descontos. O IAS vale {IAS_VALUE.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} € em 2026. Este rendimento não substitui o cálculo de recursos de cada apoio.</p></div>
    <Button variant="ghost" className="justify-start px-0 text-detail" onClick={() => setFiltros(FILTROS_VAZIOS)}><RotateCcw aria-hidden="true"/>Limpar filtros</Button>
  </div>;

  const lista = (items: typeof apoios, disponivel: boolean) => <div className="border-t border-border">{items.map(a => <details key={a.id} className={`support-row border-b border-border ${disponivel ? "" : "opacity-60"}`}>
    <summary className="flex cursor-pointer items-start gap-3 py-6 focus-visible:rounded-md">
      {disponivel ? <CircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-detail"/> : <span aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground">—</span>}
      <div className="min-w-0 flex-1"><h3 className="text-xl font-semibold leading-tight">{a.titulo}</h3><p className="mt-1 text-sm text-muted-foreground">{a.entidade}</p><p className={`mt-2 text-sm ${disponivel ? "text-detail" : "text-muted-foreground"}`}>{disponivel ? "Pode aplicar-se · confirmar condições" : `Não corresponde ao perfil · ${a.resultado.motivo}`}</p></div>
      <div className="hidden max-w-48 shrink-0 text-right sm:block"><p className={`text-base font-semibold ${disponivel ? "text-primary" : "text-muted-foreground"}`}>{a.valor}</p><span className="text-xs text-muted-foreground">valor estimado</span></div><ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground"/>
    </summary>
    <div className="pb-6 pl-8"><p className="max-w-xl text-base leading-relaxed text-muted-foreground">{a.descricao}</p><p className="mt-3 font-semibold text-primary sm:hidden">{a.valor}</p><h4 className="mt-4 text-sm font-semibold">Condições a confirmar</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">{a.condicoes.map(c => <li key={c}>{c}</li>)}</ul><p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.periodo}</p><p className="mt-2 text-xs text-muted-foreground">Fonte: {a.entidade} · Consultada em {a.verificadoEm}</p><Button asChild variant="link" className="mt-3 h-auto min-h-11 whitespace-normal px-0 text-detail"><a href={a.link} target="_blank" rel="noopener noreferrer">Saber mais na fonte oficial <ArrowUpRight aria-hidden="true"/></a></Button></div>
  </details>)}</div>;

  return <div className={escuro ? "dark" : ""}><div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-background"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4"><a href="/" aria-label="WeHelp — início" className="flex items-center gap-2.5"><span className="brand-mark" aria-hidden="true"/><span className="text-xl font-semibold">WeHelp</span></a><div className="flex items-center gap-2"><span className="mr-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><LockKeyhole aria-hidden="true" className="size-3.5"/>Anónimo</span><Button variant="ghost" size="icon" aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"} title={escuro ? "Modo claro" : "Modo escuro"} onClick={() => setEscuro(v => !v)}>{escuro ? <Sun aria-hidden="true"/> : <Moon aria-hidden="true"/>}</Button><Button variant="outline" size="icon" className="lg:hidden" aria-label={filtrosAbertos ? "Fechar filtros" : "Abrir filtros"} title="Filtros" aria-expanded={filtrosAbertos} aria-controls="filtros-mobile" onClick={() => setFiltrosAbertos(v => !v)}>{filtrosAbertos ? <X aria-hidden="true"/> : <SlidersHorizontal aria-hidden="true"/>}</Button></div></div></header>
    <Azulejo/>
    {filtrosAbertos && <section id="filtros-mobile" aria-label="Filtros" className="border-b border-border px-6 py-8 lg:hidden"><h2 className="mb-6 text-xl font-semibold">Um pouco sobre si</h2>{painel("mobile")}<Button className="mt-6 h-14 w-full" onClick={() => setFiltrosAbertos(false)}>Ver apoios <Check aria-hidden="true"/></Button></section>}
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16 lg:py-12">
      <aside className="hidden lg:block"><div className="sticky top-24"><h2 className="mb-6 text-xl font-semibold">Um pouco sobre si</h2>{painel("desktop")}</div></aside>
      <main className="min-w-0"><p className="mb-3 text-sm font-medium text-detail">Guia de Apoios Sociais</p><h1 className="max-w-xl text-[32px] font-semibold leading-[1.12]">{elegiveis.length > 0 ? `${elegiveis.length} ${elegiveis.length === 1 ? "apoio que pode" : "apoios que podem"} aplicar-se ao seu caso.` : "Veja outros apoios e as suas condições."}</h1><p className="mb-6 mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">Informação de fontes oficiais. As respostas orientam a pesquisa, mas não confirmam o direito aos apoios.</p>
        <IasFaq/>
        <h2 className="mb-4 text-xl font-semibold">Apoios a explorar</h2>
        {lista(elegiveis, true)}
        {outros.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-semibold">Outros apoios</h2>{lista(outros, false)}</section>}
        <footer className="mt-10 border-t border-border pt-6"><p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Esta orientação não é uma decisão de atribuição. Os montantes dependem das condições de cada apoio. Confirme a informação e eventuais alterações na fonte oficial antes de pedir.</p><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole aria-hidden="true" className="size-3.5"/>Não pedimos nome, email nem login. Não guardamos as suas respostas.</p></footer>
      </main>
    </div>
  </div></div>;
}

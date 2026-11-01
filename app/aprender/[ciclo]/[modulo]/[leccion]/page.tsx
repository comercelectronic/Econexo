import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tira } from '@/components/Tira';
import { LessonTest } from '@/components/LessonTest';
import { CICLOS, cicloBySlug, lecciones, simuladorById, temario } from '@/lib/estudios';
import { published } from '@/lib/content';
import { TOOLS } from '@/lib/tools';
import { ArticleCard } from '@/components/ArticleCard';

export const dynamicParams = false;
export const generateStaticParams = () => CICLOS.flatMap((c) => c.modulos.filter((m) => m.live).flatMap((m) => lecciones(c.slug, m.slug).map((l) => ({ ciclo: c.slug, modulo: m.slug, leccion: l.slug }))));
type Props = { params: Promise<{ ciclo: string; modulo: string; leccion: string }> };

function find(ciclo: string, modulo: string, leccion: string) {
  const c = cicloBySlug(ciclo), m = c?.modulos.find((x) => x.slug === modulo && x.live);
  const ls = m ? lecciones(ciclo, modulo) : [], i = ls.findIndex((l) => l.slug === leccion);
  return c && m && i >= 0 ? { c, m, ls, i, l: ls[i] } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ciclo, modulo, leccion } = await params; const f = find(ciclo, modulo, leccion);
  return f ? { title: `${f.l.titulo} · ${f.m.name}`, description: f.l.objetivo, alternates: { canonical: f.l.url } } : {};
}

export default async function LeccionPage({ params }: Props) {
  const { ciclo, modulo, leccion } = await params; const f = find(ciclo, modulo, leccion);
  if (!f) notFound();
  const { c, m, ls, i, l } = f;
  const tm = temario(modulo), sim = simuladorById(m.simulador);
  const prev = ls[i - 1], next = ls[i + 1];
  const tools = TOOLS.filter((t) => t.codigos?.some((x) => l.codigos.includes(x)));
  const reading = published().filter((a) => a.modulos.includes(modulo) && a.codigos.some((x) => l.codigos.includes(x))).slice(0, 3);
  return (
    <article className="mx-auto max-w-4xl py-10">
      <p className="text-sm font-semibold text-teal"><Link href="/aprender/">Aprender</Link> · <Link href={`/aprender/${c.slug}/`}>{c.name}</Link> · <Link href={`/aprender/${c.slug}/${m.slug}/`}>{m.name}</Link></p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Lección {l.orden} de {ls.length}{l.area ? ` · ${l.area}` : ''}</p>
      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-navy md:text-5xl">{l.titulo}</h1>
      <p className="mt-3 text-lg text-muted">🎯 {l.objetivo}</p>
      {l.codigos.length > 0 && tm && (
        <p className="mt-4 flex flex-wrap gap-1.5">{l.codigos.map((k) => <span key={k} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy" title={tm.temario.find(([x]) => x === k)?.[1]}>Temario {k} · {tm.temario.find(([x]) => x === k)?.[1]}</span>)}</p>
      )}

      <div className="mt-8"><Tira panels={l.tira} titulo={l.titulo} /></div>

      <div className="prose-ec mt-10" dangerouslySetInnerHTML={{ __html: l.html }} />
      {l.ejemplo && <div className="mt-8 rounded-2xl border-l-4 border-teal bg-mist p-5"><p className="font-bold text-navy">Ejemplo</p><p className="mt-1" dangerouslySetInnerHTML={{ __html: l.ejemplo }} /></div>}
      {l.errores.length > 0 && <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5"><p className="font-bold text-amber-900">⚠️ Errores frecuentes</p><ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900">{l.errores.map((e) => <li key={e} dangerouslySetInnerHTML={{ __html: e }} />)}</ul></div>}

      <section className="mt-12"><h2 className="mb-4 text-2xl font-extrabold text-navy">Ponte a prueba</h2><LessonTest id={l.id} test={l.test} /></section>

      {sim && l.capitulo && (
        <section className="mt-10 rounded-2xl bg-navy p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-teal">Practica en el simulador</p>
          <p className="mt-1 text-xl font-extrabold">{sim.name} · capítulo {l.capitulo}{l.capitulo_titulo ? `: «${l.capitulo_titulo}»` : ''}</p>
          <p className="mt-1 text-sm text-white/75">En este capítulo aplicarás esta lección con un cliente. Tus decisiones tendrán consecuencias en tu agencia.</p>
          <a href={sim.url} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">Abrir el simulador →</a>
        </section>
      )}
      {tools.length > 0 && <section className="mt-10"><h2 className="text-xl font-extrabold text-navy">Herramientas relacionadas</h2><div className="mt-3 flex flex-wrap gap-2">{tools.map((t) => <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-teal">{t.name} →</Link>)}</div></section>}
      {reading.length > 0 && <section className="mt-10"><h2 className="mb-3 text-xl font-extrabold text-navy">Para saber más</h2><div className="grid gap-4 md:grid-cols-3">{reading.map((a) => <ArticleCard key={a.url} a={a} />)}</div></section>}

      <nav className="mt-12 flex justify-between gap-4 border-t border-line pt-6" aria-label="Lecciones">
        {prev ? <Link href={prev.url} className="max-w-[48%] text-sm"><span className="text-muted">← Anterior</span><br /><b className="text-navy">{prev.titulo}</b></Link> : <span />}
        {next ? <Link href={next.url} className="max-w-[48%] text-right text-sm"><span className="text-muted">Siguiente →</span><br /><b className="text-navy">{next.titulo}</b></Link> : <Link href={`/aprender/${c.slug}/${m.slug}/`} className="text-sm font-bold text-navy">Volver al módulo →</Link>}
      </nav>
    </article>
  );
}

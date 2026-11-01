import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Done, ModuleBar } from '@/components/Progress';
import { CICLOS, cicloBySlug, lecciones, simuladorById, temario } from '@/lib/estudios';
import { published } from '@/lib/content';
import { TOOLS } from '@/lib/tools';

export const dynamicParams = false;
export const generateStaticParams = () => CICLOS.flatMap((c) => c.modulos.filter((m) => m.live).map((m) => ({ ciclo: c.slug, modulo: m.slug })));
type Props = { params: Promise<{ ciclo: string; modulo: string }> };

function find(ciclo: string, modulo: string) {
  const c = cicloBySlug(ciclo), m = c?.modulos.find((x) => x.slug === modulo && x.live);
  return c && m ? { c, m } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ciclo, modulo } = await params; const f = find(ciclo, modulo);
  return f ? { title: `${f.m.name} · ${f.c.name}`, description: f.m.resumen, alternates: { canonical: `/aprender/${ciclo}/${modulo}/` } } : {};
}

export default async function ModuloPage({ params }: Props) {
  const { ciclo, modulo } = await params; const f = find(ciclo, modulo);
  if (!f) notFound();
  const { c, m } = f;
  const lessons = lecciones(ciclo, modulo), tm = temario(modulo), sim = simuladorById(m.simulador);
  const codes = new Set(lessons.flatMap((l) => l.codigos));
  const tools = TOOLS.filter((t) => t.codigos?.some((x) => codes.has(x)));
  const art = published().filter((a) => a.modulos.includes(modulo));
  const news = art.filter((a) => a.tipo === 'noticia'), resources = art.filter((a) => a.tipo !== 'noticia');
  return (
    <div className="py-10">
      <PageHero kicker={<><Link href="/aprender/">Aprender</Link> · <Link href={`/aprender/${c.slug}/`}>{c.name}</Link> · {c.grado === 'medio' ? 'Grado medio' : 'Grado superior'}</>} title={m.name} intro={m.resumen} nexo="explicando" eco="contento" dice={{ quien: 'nexo', texto: 'Empieza por la lección 1: tira, explicación y test.' }} />

      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-mist p-5"><ModuleBar ids={lessons.map((l) => l.id)} />
          {lessons[0] && <Link href={lessons[0].url} className="mt-4 inline-block rounded-lg bg-navy px-5 py-2.5 font-semibold text-white">Empezar por la lección 1 →</Link>}</div>
        {sim && (
          <div className="rounded-2xl bg-navy p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-teal">Simulador · parte práctica</p>
            <h2 className="mt-1 text-2xl font-extrabold">{sim.name}</h2>
            <p className="mt-1 text-sm text-white/75">{sim.desc}</p>
            <a href={sim.url} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">Jugar al simulador →</a>
          </div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">Lecciones</h2>
        <p className="mt-2 text-sm text-muted">En el mismo orden que el simulador: cada lección indica en qué capítulo la pondrás en práctica.</p>
        <ol className="mt-4 grid gap-2 md:grid-cols-2">
          {lessons.map((l) => (
            <li key={l.id}><Link href={l.url} className={`flex items-center gap-3 rounded-xl border px-4 py-3 hover:border-teal ${l.codigos.length ? 'border-line' : 'border-dashed border-line'}`}>
              <span className="w-7 shrink-0 font-display font-extrabold text-teal">{l.orden}</span>
              <span className="flex-1"><span className="block font-bold text-navy">{l.titulo}</span>
                <span className="text-xs text-muted">{l.codigos.length ? `Temario ${l.codigos.join(', ')}` : 'Complementaria: gestionar la agencia'} · Capítulo {l.capitulo}</span></span>
              <Done id={l.id} /></Link></li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">Las lecciones con borde discontinuo no forman parte del temario oficial, pero las necesitarás en el simulador.</p>
      </section>

      {tm && (
        <section className="mt-12">
          <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">Temario oficial</h2>
          <p className="mt-2 text-sm text-muted">Todos los puntos del temario y dónde se trabajan.</p>
          {Object.entries(tm.bloques).map(([b, name]) => (
            <details key={b} className="mt-3 rounded-xl border border-line p-4" open={b === '1'}>
              <summary className="cursor-pointer font-bold text-navy">{b}. {name}</summary>
              <ul className="mt-3 space-y-2">
                {tm.temario.filter(([k]) => k.split('.')[0] === b).map(([k, t]) => {
                  const ls = lessons.filter((l) => l.codigos.includes(k));
                  return (
                    <li key={k} className="text-sm"><b className="text-teal-dark">{k}</b> {t}{tm.ahora[k] && <span className="block text-xs text-muted">{tm.ahora[k]}</span>}
                      {ls.length > 0 && <span className="mt-1 flex flex-wrap gap-1.5">{ls.map((l) => <Link key={l.id} href={l.url} className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-navy hover:bg-teal/20">{l.titulo}</Link>)}</span>}</li>
                  );
                })}
              </ul>
            </details>
          ))}
        </section>
      )}

      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">Herramientas para practicar</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map((t) => <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-xl border border-line p-4 hover:border-teal"><b className="text-navy">{t.name}</b><p className="mt-1 text-sm text-muted">{t.short}</p></Link>)}</div>
        </section>
      )}
      {news.length > 0 && <section className="mt-12"><h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">Actualidad del módulo</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{news.slice(0, 6).map((a) => <ArticleCard key={a.url} a={a} />)}</div></section>}
      {resources.length > 0 && <section className="mt-12"><h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">Para saber más: guías y casos reales</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{resources.map((a) => <ArticleCard key={a.url} a={a} />)}</div></section>}
    </div>
  );
}

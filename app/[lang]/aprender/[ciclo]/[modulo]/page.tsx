import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Done, ModuleBar } from '@/components/Progress';
import { ciclosLive, lecciones, simuladorById, simUrl, temario } from '@/lib/estudios';
import { LANGS, isLang, l as lp, tr } from '@/lib/i18n';
import { published } from '@/lib/content';
import { TOOLS } from '@/lib/tools';

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => ciclosLive().flatMap((c) => c.modulos.map((m) => ({ lang, ciclo: c.slug, modulo: m.slug }))));
type Props = { params: Promise<{ lang: string; ciclo: string; modulo: string }> };

function find(ciclo: string, modulo: string) {
  const c = ciclosLive().find((x) => x.slug === ciclo), m = c?.modulos.find((x) => x.slug === modulo);
  return c && m ? { c, m } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ciclo, modulo } = await params; const f = find(ciclo, modulo);
  if (!f || !isLang(lang)) return {};
  const t = tr(lang);
  return { title: `${t(f.m.name)} · ${t(f.c.name)}`, description: f.m.resumen ? t(f.m.resumen) : undefined, alternates: { canonical: lp(lang, `/aprender/${ciclo}/${modulo}/`), languages: { ca: lp('ca', `/aprender/${ciclo}/${modulo}/`), es: lp('es', `/aprender/${ciclo}/${modulo}/`) } } };
}

export default async function ModuloPage({ params }: Props) {
  const { lang, ciclo, modulo } = await params; const f = find(ciclo, modulo);
  if (!f || !isLang(lang)) notFound();
  const t = tr(lang), { c, m } = f;
  const lessons = lecciones(lang, ciclo, modulo), tm = temario(lang, modulo), sim = simuladorById(m.simulador);
  const codes = new Set(lessons.flatMap((x) => x.codigos));
  const tools = TOOLS.filter((x) => x.codigos?.some((k) => codes.has(k)));
  const art = published(lang).filter((a) => a.modulos.includes(modulo));
  const news = art.filter((a) => a.tipo === 'noticia'), resources = art.filter((a) => a.tipo !== 'noticia');
  return (
    <div className="py-10">
      <PageHero kicker={<><Link href={lp(lang, '/aprender/')}>{t('Aprender')}</Link> · <Link href={lp(lang, `/aprender/${c.slug}/`)}>{t(c.name)}</Link> · {c.grado === 'medio' ? t('Grado medio') : t('Grado superior')}</>} title={t(m.name)} intro={m.resumen ? t(m.resumen) : undefined} nexo="explicando" eco="contento" dice={{ quien: 'nexo', texto: t('Empieza por la lección 1: tira, explicación y test.') }} />

      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-mist p-5"><ModuleBar ids={lessons.map((x) => x.id)} />
          {lessons[0] && <Link href={lp(lang, lessons[0].url)} className="mt-4 inline-block rounded-lg bg-navy px-5 py-2.5 font-semibold text-white">{t('Empezar por la lección 1 →')}</Link>}</div>
        {sim && (
          <div className="rounded-2xl bg-navy p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Simulador · parte práctica')}</p>
            <h2 className="mt-1 text-2xl font-extrabold">{sim.name}</h2>
            <p className="mt-1 text-sm text-white/75">{t(sim.desc)}</p>
            <a href={simUrl(sim, lang)} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">{t('Jugar al simulador →')}</a>
          </div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">{t('Lecciones')}</h2>
        <p className="mt-2 text-sm text-muted">{t('En el mismo orden que el simulador: cada lección indica en qué capítulo la pondrás en práctica.')}</p>
        <ol className="mt-4 grid gap-2 md:grid-cols-2">
          {lessons.map((x) => (
            <li key={x.id}><Link href={lp(lang, x.url)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 hover:border-teal ${x.codigos.length ? 'border-line' : 'border-dashed border-line'}`}>
              <span className="w-7 shrink-0 font-display font-extrabold text-teal">{x.orden}</span>
              <span className="flex-1"><span className="block font-bold text-navy">{x.titulo}</span>
                <span className="text-xs text-muted">{x.codigos.length ? `${t('Temario')} ${x.codigos.join(', ')}` : t('Complementaria: gestionar la agencia')} · {t('Capítulo')} {x.capitulo}</span></span>
              <Done id={x.id} /></Link></li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">{t('Las lecciones con borde discontinuo no forman parte del temario oficial, pero las necesitarás en el simulador.')}</p>
      </section>

      {tm && (
        <section className="mt-12">
          <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">{t('Temario oficial')}</h2>
          <p className="mt-2 text-sm text-muted">{t('Todos los puntos del temario y dónde se trabajan.')}</p>
          {Object.entries(tm.bloques).map(([b, name]) => (
            <details key={b} className="mt-3 rounded-xl border border-line p-4" open={b === '1'}>
              <summary className="cursor-pointer font-bold text-navy">{b}. {name}</summary>
              <ul className="mt-3 space-y-2">
                {tm.temario.filter(([k]) => k.split('.')[0] === b).map(([k, txt]) => {
                  const ls = lessons.filter((x) => x.codigos.includes(k));
                  return (
                    <li key={k} className="text-sm"><b className="text-teal-dark">{k}</b> {txt}{tm.ahora[k] && <span className="block text-xs text-muted">{tm.ahora[k]}</span>}
                      {ls.length > 0 && <span className="mt-1 flex flex-wrap gap-1.5">{ls.map((x) => <Link key={x.id} href={lp(lang, x.url)} className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-navy hover:bg-teal/20">{x.titulo}</Link>)}</span>}</li>
                  );
                })}
              </ul>
            </details>
          ))}
        </section>
      )}

      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">{t('Herramientas para practicar')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map((x) => <Link key={x.slug} href={lp(lang, `/herramientas/${x.slug}/`)} className="rounded-xl border border-line p-4 hover:border-teal"><b className="text-navy">{t(x.name)}</b><p className="mt-1 text-sm text-muted">{t(x.short)}</p></Link>)}</div>
        </section>
      )}
      {news.length > 0 && <section className="mt-12"><h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">{t('Actualidad del módulo')}</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{news.slice(0, 6).map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div></section>}
      {resources.length > 0 && <section className="mt-12"><h2 className="border-b-2 border-navy pb-2 text-2xl font-extrabold text-navy">{t('Para saber más: guías y casos reales')}</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{resources.map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div></section>}
    </div>
  );
}

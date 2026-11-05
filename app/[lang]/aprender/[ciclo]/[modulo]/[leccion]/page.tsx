import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tira } from '@/components/Tira';
import { LessonTest } from '@/components/LessonTest';
import { ciclosLive, lecciones, simuladorById, simUrl, temario } from '@/lib/estudios';
import { LANGS, isLang, l as lp, tr } from '@/lib/i18n';
import { published } from '@/lib/content';
import { TOOLS } from '@/lib/tools';
import { ArticleCard } from '@/components/ArticleCard';

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => ciclosLive().flatMap((c) => c.modulos.flatMap((m) => lecciones(lang, c.slug, m.slug).map((x) => ({ lang, ciclo: c.slug, modulo: m.slug, leccion: x.slug })))));
type Props = { params: Promise<{ lang: string; ciclo: string; modulo: string; leccion: string }> };

function find(lang: string, ciclo: string, modulo: string, leccion: string) {
  if (!isLang(lang)) return null;
  const c = ciclosLive().find((x) => x.slug === ciclo), m = c?.modulos.find((x) => x.slug === modulo);
  const ls = m ? lecciones(lang, ciclo, modulo) : [], i = ls.findIndex((x) => x.slug === leccion);
  return c && m && i >= 0 ? { c, m, ls, i, l: ls[i] } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ciclo, modulo, leccion } = await params; const f = find(lang, ciclo, modulo, leccion);
  if (!f || !isLang(lang)) return {};
  return { title: `${f.l.titulo} · ${tr(lang)(f.m.name)}`, description: f.l.objetivo, alternates: { canonical: lp(lang, f.l.url), languages: { ca: lp('ca', f.l.url), es: lp('es', f.l.url) } } };
}

export default async function LeccionPage({ params }: Props) {
  const { lang: raw, ciclo, modulo, leccion } = await params; const f = find(raw, ciclo, modulo, leccion);
  if (!f || !isLang(raw)) notFound();
  const lang = raw, t = tr(lang), { c, m, ls, i, l } = f;
  const tm = temario(lang, modulo), sim = simuladorById(m.simulador);
  const prev = ls[i - 1], next = ls[i + 1];
  const tools = TOOLS.filter((x) => x.codigos?.some((k) => l.codigos.includes(k)));
  const reading = published(lang).filter((a) => a.modulos.includes(modulo) && a.codigos.some((x) => l.codigos.includes(x))).slice(0, 3);
  return (
    <article className="mx-auto max-w-4xl py-10">
      <p className="text-sm font-semibold text-teal"><Link href={lp(lang, '/aprender/')}>{t('Aprender')}</Link> · <Link href={lp(lang, `/aprender/${c.slug}/`)}>{t(c.name)}</Link> · <Link href={lp(lang, `/aprender/${c.slug}/${m.slug}/`)}>{t(m.name)}</Link></p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">{t('Lección {0} de {1}', l.orden, ls.length)}{l.area ? ` · ${l.area}` : ''}</p>
      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-navy md:text-5xl">{l.titulo}</h1>
      <p className="mt-3 text-lg text-muted">🎯 {l.objetivo}</p>
      {l.codigos.length > 0 && tm && (
        <p className="mt-4 flex flex-wrap gap-1.5">{l.codigos.map((k) => <span key={k} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy" title={tm.temario.find(([x]) => x === k)?.[1]}>{t('Temario')} {k} · {tm.temario.find(([x]) => x === k)?.[1]}</span>)}</p>
      )}

      <div className="mt-8"><Tira panels={l.tira} titulo={l.titulo} lang={lang} /></div>

      <div className="prose-ec mt-10" dangerouslySetInnerHTML={{ __html: l.html }} />
      {l.ejemplo && <div className="mt-8 rounded-2xl border-l-4 border-teal bg-mist p-5"><p className="font-bold text-navy">{t('Ejemplo')}</p><p className="mt-1" dangerouslySetInnerHTML={{ __html: l.ejemplo }} /></div>}
      {l.errores.length > 0 && <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5"><p className="font-bold text-amber-900">⚠️ {t('Errores frecuentes')}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900">{l.errores.map((e) => <li key={e} dangerouslySetInnerHTML={{ __html: e }} />)}</ul></div>}

      <section className="mt-12"><h2 className="mb-4 text-2xl font-extrabold text-navy">{t('Ponte a prueba')}</h2><LessonTest id={l.id} test={l.test} /></section>

      {sim && l.capitulo && (
        <section className="mt-10 rounded-2xl bg-navy p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Practica en el simulador')}</p>
          <p className="mt-1 text-xl font-extrabold">{sim.name} · {t('capítulo')} {l.capitulo}{l.capitulo_titulo ? `: «${l.capitulo_titulo}»` : ''}</p>
          <p className="mt-1 text-sm text-white/75">{t('En este capítulo aplicarás esta lección con un cliente. Tus decisiones tendrán consecuencias en tu agencia.')}</p>
          <a href={simUrl(sim, lang)} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">{t('Abrir el simulador →')}</a>
        </section>
      )}
      {tools.length > 0 && <section className="mt-10"><h2 className="text-xl font-extrabold text-navy">{t('Herramientas relacionadas')}</h2><div className="mt-3 flex flex-wrap gap-2">{tools.map((x) => <Link key={x.slug} href={lp(lang, `/herramientas/${x.slug}/`)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-teal">{t(x.name)} →</Link>)}</div></section>}
      {reading.length > 0 && <section className="mt-10"><h2 className="mb-3 text-xl font-extrabold text-navy">{t('Para saber más')}</h2><div className="grid gap-4 md:grid-cols-3">{reading.map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div></section>}

      <nav className="mt-12 flex justify-between gap-4 border-t border-line pt-6" aria-label={t('Lecciones')}>
        {prev ? <Link href={lp(lang, prev.url)} className="max-w-[48%] text-sm"><span className="text-muted">{t('← Anterior')}</span><br /><b className="text-navy">{prev.titulo}</b></Link> : <span />}
        {next ? <Link href={lp(lang, next.url)} className="max-w-[48%] text-right text-sm"><span className="text-muted">{t('Siguiente →')}</span><br /><b className="text-navy">{next.titulo}</b></Link> : <Link href={lp(lang, `/aprender/${c.slug}/${m.slug}/`)} className="text-sm font-bold text-navy">{t('Volver al módulo →')}</Link>}
      </nav>
    </article>
  );
}

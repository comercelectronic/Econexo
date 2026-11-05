import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { Tira } from '@/components/Tira';
import { Bocadillo } from '@/components/Mascotas';
import { Avatar } from '@/components/Characters';
import { published } from '@/lib/content';
import { SIMULADORES, lecciones, liveModules, simUrl } from '@/lib/estudios';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { isLang, l, tr, type Lang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { alternates: { canonical: l(lang), languages: { ca: l('ca'), es: l('es') } } } : {};
}

const Block = ({ kicker, title, href, more, children }: { kicker: string; title: string; href?: string; more: string; children: React.ReactNode }) => (
  <section className="mt-14">
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-navy pb-2">
      <div><p className="text-xs font-bold tracking-widest text-teal">{kicker.toUpperCase()}</p><h2 className="text-2xl font-extrabold text-navy">{title}</h2></div>
      {href && <Link href={href} className="shrink-0 text-sm font-semibold text-blue hover:underline">{more} →</Link>}
    </div>
    {children}
  </section>
);

export default async function Home({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw, t = tr(lang);
  const mods = liveModules();
  const first = mods[0], firstLessons = first ? lecciones(lang, first.ciclo.slug, first.modulo.slug) : [];
  const sample = firstLessons.find((x) => x.id === 'L_metriques') || firstLessons[0];
  const all = published(lang), news = all.filter((a) => a.tipo === 'noticia').slice(0, 3);
  const reading = all.filter((a) => a.tipo !== 'noticia' && a.modulos.length).slice(0, 3);
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + l(lang), description: t(SITE.description), inLanguage: lang }} />
      <section className="mt-8 rounded-3xl bg-navy p-8 text-white md:p-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Comercio y Marketing · FP grado medio y superior')}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{t('Aprende con')} <span className="text-teal">NEXO</span>,<br />{t('no hagas el ')}<span className="text-uni">ECO</span></h1>
            <p className="mt-4 max-w-xl text-white/80">{t('Elige tu ciclo y tu módulo. En cada lección, ECO mete la pata en una tira cómica, NEXO te lo explica paso a paso, te pones a prueba con un test y lo practicas en un simulador.')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={l(lang, '/aprender/')} className="rounded-lg bg-teal px-5 py-3 font-semibold hover:bg-teal-dark">{t('Elige qué aprender →')}</Link>
              {first && <Link href={l(lang, `/aprender/${first.ciclo.slug}/${first.modulo.slug}/`)} className="rounded-lg bg-white/10 px-5 py-3 font-semibold hover:bg-white/20">{t(first.modulo.name)}</Link>}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Bocadillo quien="eco" texto={t('¡Voy a montar mi tienda online sin leer nada!')} className="max-w-xs" />
            <img src="/media/personajes/eco-y-nexo.webp" alt="ECO y NEXO" className="w-full max-w-sm rounded-2xl bg-white p-3" />
          </div>
        </div>
        <ol className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[['1', 'Elige tu módulo', 'Grado medio o superior, ciclo y módulo.'], ['2', 'Lee la tira y la lección', 'ECO mete la pata; NEXO lo explica.'], ['3', 'Ponte a prueba', 'Test de autoevaluación con explicaciones.'], ['4', 'Practica en el simulador', 'Toma decisiones con clientes y consecuencias.']].map(([n, a, d]) => (
            <li key={n} className="flex gap-3 rounded-xl bg-white/5 p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal font-bold">{n}</span><span><b>{t(a)}</b><br /><span className="text-white/70">{t(d)}</span></span></li>
          ))}
        </ol>
      </section>

      <Block kicker={t('Disponible')} title={t('Módulos para aprender ya')} href={l(lang, '/aprender/')} more={t('Ver todo')}>
        <div className="grid gap-5 md:grid-cols-2">
          {mods.map(({ ciclo, modulo }) => (
            <Link key={modulo.slug} href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className="rounded-2xl border-2 border-teal p-6 hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wide text-teal">{t(ciclo.name)} · {ciclo.grado === 'medio' ? t('Grado medio') : t('Grado superior')}</p>
              <h3 className="mt-1 text-2xl font-extrabold text-navy">{t(modulo.name)}</h3>
              <p className="mt-2 text-sm text-muted">{modulo.resumen ? t(modulo.resumen) : ''}</p>
              <p className="mt-3 text-sm font-bold text-teal-dark">{t('{0} lecciones · tiras cómicas · tests · simulador →', lecciones(lang, ciclo.slug, modulo.slug).length)}</p>
            </Link>
          ))}
        </div>
      </Block>

      {sample && first && (
        <Block kicker={t('Así es una lección')} title={sample.titulo} href={l(lang, sample.url)} more={t('Ver todo')}>
          <Tira panels={sample.tira} titulo={sample.titulo} lang={lang} />
          <p className="mt-4 text-center"><Link href={l(lang, sample.url)} className="font-semibold text-blue underline">{t('Leer la lección completa y hacer el test →')}</Link></p>
        </Block>
      )}

      <Block kicker={t('Practica')} title={t('Simuladores')} href={l(lang, '/simuladores/')} more={t('Ver todo')}>
        <div className="grid gap-5 md:grid-cols-2">{SIMULADORES.map((s) => (
          <div key={s.id} className="rounded-2xl bg-navy p-6 text-white"><h3 className="text-xl font-extrabold">{s.name}</h3><p className="mt-2 text-sm text-white/75">{t(s.desc)}</p><a href={simUrl(s, lang)} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold">{t('Jugar →')}</a></div>
        ))}</div>
      </Block>

      <Block kicker={t('Herramientas')} title={t('Calcula y practica gratis')} href={l(lang, '/herramientas/')} more={t('Ver todo')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{TOOLS.slice(0, 8).map((x) => (
          <Link key={x.slug} href={l(lang, `/herramientas/${x.slug}/`)} className="rounded-xl border border-line p-4 hover:border-teal"><Avatar id={x.dialogo?.[1]?.quien || 'nexo'} gesto={x.dialogo?.[1]?.gesto} className="h-10 w-10" /><span className="mt-2 block text-xs font-bold uppercase tracking-wide text-teal">{t(x.area)}</span><h3 className="mt-1 font-bold text-navy">{t(x.name)}</h3></Link>
        ))}</div>
      </Block>

      {(news.length > 0 || reading.length > 0) && (
        <Block kicker={t('Actualidad')} title={news.length ? t('Noticias de lo que estudias') : t('Casos reales y guías para tu módulo')} href={news.length ? l(lang, '/actualidad/') : undefined} more={t('Ver todo')}>
          <div className="grid gap-5 md:grid-cols-3">{(news.length ? news : reading).map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div>
        </Block>
      )}

      <div className="mt-14"><Newsletter /></div>
    </>
  );
}

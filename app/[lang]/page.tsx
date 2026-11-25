import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { Bocadillo } from '@/components/Mascotas';
import { Avatar } from '@/components/Characters';
import { published } from '@/lib/content';
import { SIMULADORES, lecciones, liveModules, simUrl } from '@/lib/estudios';
import { SimModulos } from '@/components/SimModulos';
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

// Portada: els simuladors són el producte principal; la teoria, les eines i l'actualitat queden en segon pla.
export default async function Home({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw, t = tr(lang);
  const mods = liveModules();
  const all = published(lang), news = all.filter((a) => a.tipo === 'noticia').slice(0, 3);
  const reading = all.filter((a) => a.tipo !== 'noticia' && a.modulos.length).slice(0, 3);
  const [star, ...rest] = SIMULADORES;
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + l(lang), description: t(SITE.description), inLanguage: lang }} />

      {/* Simulador destacat */}
      <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d2340] via-[#3b2b7a] to-[#c2378a] p-6 text-white md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f8b62d]">{t('Simuladores para Comercio y Marketing · FP')}</p>
        <div className="mt-3 grid items-center gap-8 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{t('Aprende comercio')} <span className="text-[#f8b62d]">{t('jugando')}</span></h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">{t('Simuladores y juegos para clase: tomas decisiones, ves sus consecuencias y el profesorado recibe las evidencias de cada resultado de aprendizaje.')}</p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f8b62d]">{t('Novedad')}{star.lema ? ' · ' + t(star.lema) : ''}</p>
              <h2 className="mt-1 text-2xl font-extrabold">{star.name}</h2>
              <p className="mt-1 text-sm text-white/80">{t(star.desc)}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={simUrl(star, lang)} target="_blank" rel="noopener" className="rounded-xl bg-[#f8b62d] px-6 py-3 text-lg font-extrabold text-[#1d2340] shadow-lg hover:brightness-105">{t('Jugar a {0} →', star.name)}</a>
              <a href="#simuladores" className="rounded-xl bg-white/15 px-5 py-3 font-semibold hover:bg-white/25">{t('Ver todos los simuladores')}</a>
            </div>
          </div>
          <div>
            {star.img && <a href={simUrl(star, lang)} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20 transition hover:scale-[1.01]"><img src={star.img} alt={t('Captura de {0}', star.name)} className="aspect-video w-full object-cover" /></a>}
            {star.galeria && <div className="mt-3 grid grid-cols-3 gap-3">{star.galeria.map((g) => <img key={g} src={g} alt={t('Captura de {0}', star.name)} loading="lazy" className="aspect-video w-full rounded-xl object-cover ring-2 ring-white/15" />)}</div>}
          </div>
        </div>
      </section>

      {/* Resta de simuladors */}
      <section id="simuladores" className="mt-12 scroll-mt-28">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold tracking-widest text-[#c2378a]">{t('JUEGA Y APRENDE')}</p><h2 className="text-3xl font-extrabold text-navy">{t('Elige tu simulador')}</h2></div>
          <Link href={l(lang, '/simuladores/')} className="shrink-0 text-sm font-semibold text-blue hover:underline">{t('Ver todo')} →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((s, i) => (
            <article key={s.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-line transition hover:-translate-y-1 hover:shadow-xl">
              {s.img && <a href={simUrl(s, lang)} target="_blank" rel="noopener" className="block overflow-hidden"><img src={s.img} alt={t('Captura de {0}', s.name)} loading="lazy" className="aspect-video w-full object-cover object-top transition group-hover:scale-105" /></a>}
              <div className={`flex flex-1 flex-col border-t-4 p-5 ${['border-[#1f7ae0]', 'border-[#1f9d6b]', 'border-[#f08a24]', 'border-[#c2378a]'][i % 4]}`}>
                {s.lema && <p className="text-xs font-bold uppercase tracking-widest text-[#c2378a]">{t(s.lema)}</p>}
                <h3 className="mt-1 text-2xl font-extrabold text-navy">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{t(s.desc)}</p>
                <div className="mt-3 rounded-xl bg-navy p-3 text-white"><SimModulos s={s} lang={lang} /></div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">{t('Idiomas')}: {t(s.idiomas)}</span>
                  <a href={simUrl(s, lang)} target="_blank" rel="noopener" className="rounded-xl bg-gradient-to-r from-[#e5483a] to-[#f08a24] px-5 py-2.5 font-bold text-white shadow">{t('Jugar →')}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Per què funcionen a classe */}
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[['🎯', 'Por resultados de aprendizaje', 'Cada misión trabaja un RA del currículo y se puede jugar sola en una sesión.'],
          ['📋', 'Evidencias para el profesorado', 'Estrellas, criterios de evaluación conseguidos e informe imprimible.'],
          ['🌐', 'Sin instalar nada', 'Funcionan en el navegador, en el ordenador del aula o en el móvil.']].map(([i, a, d]) => (
          <div key={a} className="rounded-2xl bg-[#fff6e0] p-5"><span className="text-3xl">{i}</span><h3 className="mt-2 font-extrabold text-navy">{t(a)}</h3><p className="mt-1 text-sm text-muted">{t(d)}</p></div>
        ))}
      </section>

      {/* Teoria (secundària) */}
      <Block kicker={t('Teoría')} title={t('Repasa la teoría de cada módulo')} href={l(lang, '/aprender/')} more={t('Ver todo')}>
        <div className="grid items-start gap-5 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4 sm:grid-cols-2">
            {mods.map(({ ciclo, modulo }) => (
              <Link key={modulo.slug} href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className="rounded-xl border border-line p-4 hover:border-teal">
                <p className="text-xs font-bold uppercase tracking-wide text-teal">{t(ciclo.name)}</p>
                <h3 className="mt-1 font-extrabold text-navy">{t(modulo.name)}</h3>
                <p className="mt-1 text-xs text-muted">{t('{0} lecciones · tiras cómicas · tests · simulador →', lecciones(lang, ciclo.slug, modulo.slug).length)}</p>
              </Link>
            ))}
          </div>
          <div className="hidden max-w-[220px] flex-col items-center gap-2 md:flex">
            <Bocadillo quien="eco" texto={t('¡Voy a montar mi tienda online sin leer nada!')} className="max-w-[220px] text-sm" />
            <img src="/media/personajes/eco-y-nexo.webp" alt="ECO y NEXO" className="w-48 rounded-2xl bg-white p-2" />
          </div>
        </div>
      </Block>

      <Block kicker={t('Herramientas')} title={t('Calcula y practica gratis')} href={l(lang, '/herramientas/')} more={t('Ver todo')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{TOOLS.slice(0, 4).map((x) => (
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

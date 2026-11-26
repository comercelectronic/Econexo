import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { published } from '@/lib/content';
import { SIMULADORES, liveModules, simUrl } from '@/lib/estudios';
import { SimCard, DocentPanel } from '@/components/SimCard';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { isLang, l, tr, type Lang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { alternates: { canonical: l(lang), languages: { ca: l('ca'), es: l('es') } } } : {};
}

// Portada: el joc destacat és el protagonista, després la graella per comparar simuladors i,
// al final, una franja compacta amb la teoria, les eines i l'actualitat.
export default async function Home({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw, t = tr(lang);
  const mods = liveModules();
  const all = published(lang), news = all.filter((a) => a.tipo === 'noticia').slice(0, 3);
  const reading = all.filter((a) => a.tipo !== 'noticia' && a.modulos.length).slice(0, 3);
  const extra = news.length ? news : reading;
  const [star, ...rest] = SIMULADORES;
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + l(lang), description: t(SITE.description), inLanguage: lang }} />

      {/* 1 · Joc destacat */}
      <section aria-labelledby="destacat" className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d2340] via-[#3b2b7a] to-[#c2378a] p-5 text-white md:mt-6 md:p-8">
        <h1 className="text-sm font-bold uppercase tracking-widest text-[#f8b62d]">{t('Aprende comercio')} {t('jugando')} · {t('Simuladores para Comercio y Marketing · FP')}</h1>
        <div className="mt-4 grid items-center gap-6 lg:grid-cols-[1fr_1.45fr] lg:gap-8">
          <div>
            <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">{t('Novedad')} · {star.name}</p>
            <h2 id="destacat" className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{t('¿Puedes salvar los escaparates de Barcelona?')}</h2>
            <p className="mt-3 text-lg text-white/90">{star.repte && t(star.repte)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={simUrl(star, lang)} target="_blank" rel="noopener" className="rounded-xl bg-[#f8b62d] px-6 py-3.5 text-lg font-extrabold text-[#1d2340] shadow-lg hover:brightness-105 focus-visible:outline-white">
                ▶ {t('Jugar a {0}', star.name)}
              </a>
              <a href="#simuladores" className="rounded-xl px-4 py-3 font-semibold text-white underline decoration-2 underline-offset-4 hover:bg-white/10">{t('Elige otro juego')} ↓</a>
            </div>
            <p className="mt-3 text-sm text-white/80">{t('Puedes jugar la historia completa o elegir una misión para hacer en clase.')}</p>
            <DocentPanel s={star} lang={lang} dark />
          </div>
          <div>
            {star.img && (
              <a href={simUrl(star, lang)} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/25">
                <img src={star.img} alt="" className="aspect-video w-full object-cover" />
              </a>
            )}
            {star.galeria && (
              <div className="mt-3 hidden grid-cols-3 gap-3 sm:grid">
                {star.galeria.map((g) => <img key={g} src={g} alt={t('Captura de {0}', star.name)} loading="lazy" className="aspect-video w-full rounded-xl object-cover ring-2 ring-white/20" />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2 · Graella de simuladors */}
      <section id="simuladores" aria-labelledby="tria" className="mt-10 scroll-mt-40">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#c2378a]">{t('Juega y aprende')}</p><h2 id="tria" className="text-3xl font-extrabold text-navy">{t('Elige tu simulador')}</h2></div>
          <Link href={l(lang, '/simuladores/')} className="text-sm font-semibold text-blue hover:underline">{t('Ver todo')} →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {rest.map((s, i) => <SimCard key={s.id} s={s} lang={lang} i={i} />)}
        </div>
      </section>

      {/* 3 · Continguts complementaris, en una franja compacta */}
      <section aria-label={t('Más contenidos')} className="mt-12 grid gap-4 rounded-2xl bg-mist p-5 text-sm md:grid-cols-3">
        <div>
          <h2 className="font-extrabold text-navy"><Link href={l(lang, '/aprender/')} className="hover:underline">📘 {t('Teoría')} →</Link></h2>
          <ul className="mt-2 grid gap-1">{mods.map(({ ciclo, modulo }) => <li key={modulo.slug}><Link href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className="text-blue hover:underline">{t(modulo.name)}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="font-extrabold text-navy"><Link href={l(lang, '/herramientas/')} className="hover:underline">🧮 {t('Herramientas')} →</Link></h2>
          <ul className="mt-2 grid gap-1">{TOOLS.slice(0, 4).map((x) => <li key={x.slug}><Link href={l(lang, `/herramientas/${x.slug}/`)} className="text-blue hover:underline">{t(x.name)}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="font-extrabold text-navy"><Link href={l(lang, '/actualidad/')} className="hover:underline">📰 {t('Actualidad')} →</Link></h2>
          <ul className="mt-2 grid gap-1">{extra.map((a) => <li key={a.url}><Link href={l(lang, a.url)} className="text-blue hover:underline">{a.titulo}</Link></li>)}</ul>
        </div>
      </section>

      <div className="mt-12"><Newsletter /></div>
    </>
  );
}

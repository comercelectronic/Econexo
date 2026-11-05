// Article (/finanzas/como-funciona-el-interes-compuesto/) o subsecció (/finanzas/inversiones/)
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { Newsletter } from '@/components/Newsletter';
import { bySection, findArticle, formatDate, related, isPreview, type Article } from '@/lib/content';
import { COUNTRIES, SITE, TYPES, liveSections, sectionBySlug } from '@/lib/site';
import { toolBySlug } from '@/lib/tools';
import { videosForGuide } from '@/lib/videos';
import { VideoCard } from '@/components/VideoCard';
import { Dialogue } from '@/components/Dialogue';
import { LANGS, isLang, l, tr, type Lang } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() {
  // Amb exportació estàtica cal almenys una ruta: si encara no hi ha res publicat, es genera una pàgina 404
  const params = LANGS.flatMap((lang) => liveSections().flatMap((s) => {
    const arts = bySection(lang, s.slug);
    const subs = s.subs.filter(([k]) => arts.some((a) => a.subseccion === k)).map(([k]) => ({ lang, seccion: s.slug, slug: k }));
    return [...arts.map((a) => ({ lang, seccion: s.slug, slug: a.slug })), ...subs];
  }));
  return params.length ? params : [{ lang: 'ca', seccion: 'casos', slug: 'sin-contenido' }];
}

type Props = { params: Promise<{ lang: string; seccion: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, seccion, slug } = await params;
  if (!isLang(lang)) return {};
  const a = findArticle(lang, seccion, slug);
  if (!a) { const sub = sectionBySlug(seccion)?.subs.find(([k]) => k === slug); return { title: sub ? tr(lang)(sub[1]) : undefined, alternates: { canonical: l(lang, `/${seccion}/${slug}/`) } }; }
  return {
    title: a.titulo, description: a.descripcion, alternates: { canonical: l(lang, a.url), languages: { ca: l('ca', a.url), es: l('es', a.url) } },
    robots: a.estado !== 'publicada' ? { index: false, follow: false } : undefined,
    openGraph: { type: 'article', title: a.titulo, description: a.descripcion, publishedTime: a.fecha, modifiedTime: a.actualizado, authors: [a.autor], images: a.imagen ? [a.imagen] : undefined }
  };
}

const Disclaimer = ({ lang }: { lang: Lang }) => {
  const t = tr(lang);
  return (
    <aside className="my-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
      <b>{t('Información educativa.')}</b> {t('Este contenido explica conceptos y escenarios con fines formativos. No es asesoramiento financiero, fiscal ni de inversión personalizado. Antes de tomar decisiones, consulta fuentes oficiales y, si lo necesitas, a un profesional habilitado. Las rentabilidades pasadas no garantizan rentabilidades futuras.')}
    </aside>
  );
};

function Sub({ lang, seccion, slug }: { lang: Lang; seccion: string; slug: string }) {
  const t = tr(lang);
  const s = sectionBySlug(seccion)!, sub = s.subs.find(([k]) => k === slug)!;
  const list = bySection(lang, seccion).filter((a) => a.subseccion === slug);
  return (
    <div className="py-10">
      <p className="text-sm font-semibold text-teal"><Link href={l(lang, `/${seccion}/`)}>{t(s.name)}</Link></p>
      <h1 className="text-4xl font-extrabold text-navy">{t(sub[1])}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{list.map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div>
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { lang: raw, seccion, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw, t = tr(lang);
  const a = findArticle(lang, seccion, slug);
  if (!a) { if (sectionBySlug(seccion)?.subs.some(([k]) => k === slug) && bySection(lang, seccion).some((x) => x.subseccion === slug)) return <Sub lang={lang} seccion={seccion} slug={slug} />; notFound(); }
  const s = sectionBySlug(seccion)!;
  const tool = a.herramienta ? toolBySlug(a.herramienta) : undefined;
  const rel = related(lang, a);
  const vids = videosForGuide(lang, a.url);
  const ld = {
    '@context': 'https://schema.org', '@type': a.tipo === 'noticia' ? 'NewsArticle' : 'Article', headline: a.titulo, description: a.descripcion,
    datePublished: a.fecha, dateModified: a.actualizado || a.fecha, inLanguage: lang, mainEntityOfPage: SITE.url + l(lang, a.url),
    author: { '@type': a.autor.startsWith('Redacci') ? 'Organization' : 'Person', name: a.autor }, publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/favicon.png' } }
  };
  return (
    <article className="mx-auto max-w-3xl py-10">
      <JsonLd data={ld} />
      {a.faq.length > 0 && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })) }} />}
      {isPreview && a.estado !== 'publicada' && <p className="mb-6 rounded-lg bg-amber-100 p-3 text-sm font-semibold text-warn">{t('Vista previa · estado: {0}. Este artículo no se publicará hasta que se marque como «publicada».', a.estado)}</p>}
      <nav className="text-sm font-semibold text-teal" aria-label={t('Ruta')}><Link href={l(lang, `/${seccion}/`)}>{t(s.name)}</Link>{a.subseccion && <> · <Link href={l(lang, `/${seccion}/${a.subseccion}/`)}>{t(s.subs.find(([k]) => k === a.subseccion)?.[1] || '')}</Link></>}</nav>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">{t(TYPES[a.tipo] || a.tipo)}{a.pais.length && a.pais[0] !== 'global' ? ' · ' + a.pais.map((c) => t(COUNTRIES[c] || c)).join(', ') : ''}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy md:text-5xl">{a.titulo}</h1>
      {a.subtitulo && <p className="mt-4 text-xl text-muted">{a.subtitulo}</p>}
      <p className="mt-5 border-y border-line py-3 text-sm text-muted">
        {t('Por')} <b className="text-navy">{a.autor}</b>{a.revisor && <> · {t('Revisado por')} {a.revisor}</>} · <time dateTime={a.fecha}>{formatDate(a.fecha, lang, a.tipo === 'noticia')}</time>
        {a.actualizado && <> · {t('Actualizado')}: <time dateTime={a.actualizado}>{formatDate(a.actualizado, lang)}</time></>} · {a.minutos} {t('min de lectura')}
      </p>
      {a.ficha && (
        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-mist p-5 text-sm sm:grid-cols-4">
          {Object.entries(a.ficha).map(([k, v]) => <div key={k}><dt className="text-xs font-semibold uppercase text-muted">{k}</dt><dd className="font-bold text-navy">{v}</dd></div>)}
        </dl>
      )}
      {a.tipo === 'financiero' && a.fecha_datos && <p className="mt-4 text-sm text-muted">{t('Datos de referencia a fecha de')} <b>{a.fecha_datos}</b>.</p>}
      {a.tipo === 'guia' && a.toc.length > 2 && (
        <nav className="mt-6 rounded-xl border border-line p-5" aria-label={t('Índice')}><p className="font-bold text-navy">{t('En esta guía')}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{a.toc.map((h) => <li key={h.id}><a className="text-blue hover:underline" href={`#${h.id}`}>{h.text}</a></li>)}</ol></nav>
      )}
      {a.dialogo.length > 0 && <div className="mt-8"><Dialogue lines={a.dialogo} lang={lang} raw /></div>}
      <div className="prose-ec mt-8" dangerouslySetInnerHTML={{ __html: a.html }} />
      {a.tipo === 'financiero' && <Disclaimer lang={lang} />}
      {tool && (
        <aside className="my-10 rounded-2xl bg-navy p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Herramienta relacionada')}</p>
          <h2 className="mt-1 text-2xl font-extrabold">{t(tool.name)}</h2><p className="mt-1 text-white/75">{t(tool.short)}</p>
          <Link href={l(lang, `/herramientas/${tool.slug}/`)} className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">{t('Abrir la herramienta →')}</Link></aside>
      )}
      {vids.length > 0 && <section className="my-10"><h2 className="mb-4 text-xl font-extrabold text-navy">▶ {t('Míralo con ECO y NEXO')}</h2><div className="grid gap-4 md:grid-cols-2">{vids.map((v) => <VideoCard key={v.slug} v={v} lang={lang} />)}</div></section>}
      {a.faq.length > 0 && (
        <section className="mt-10"><h2 className="text-2xl font-extrabold text-navy">{t('Preguntas frecuentes')}</h2>
          {a.faq.map((f) => <details key={f.p} className="mt-3 rounded-xl border border-line p-4"><summary className="cursor-pointer font-bold text-navy">{f.p}</summary><p className="mt-2 text-muted">{f.r}</p></details>)}</section>
      )}
      {a.fuentes.length > 0 && (
        <section className="mt-10 rounded-xl bg-mist p-5"><h2 className="font-bold text-navy">{t('Fuentes')}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{a.fuentes.map((f) => <li key={f.nombre}>{f.url ? <a href={f.url} rel="noopener" target="_blank" className="text-blue underline">{f.nombre}</a> : f.nombre}</li>)}</ul></section>
      )}
      {a.etiquetas.length > 0 && <p className="mt-6 flex flex-wrap gap-2">{a.etiquetas.map((e) => <span key={e} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy">#{e}</span>)}</p>}
      <AdSlot slot="articulo-final" />
      {rel.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-navy">{t('Te puede interesar')}</h2><div className="grid gap-4 md:grid-cols-3">{rel.map((r: Article) => <ArticleCard key={r.url} a={r} lang={lang} />)}</div></section>}
      <div className="mt-12"><Newsletter /></div>
    </article>
  );
}

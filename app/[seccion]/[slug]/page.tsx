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

export const dynamicParams = false;
export function generateStaticParams() {
  // Amb exportació estàtica cal almenys una ruta: si encara no hi ha res publicat, es genera una pàgina 404
  const params = liveSections().flatMap((s) => {
    const arts = bySection(s.slug);
    const subs = s.subs.filter(([k]) => arts.some((a) => a.subseccion === k)).map(([k]) => ({ seccion: s.slug, slug: k }));
    return [...arts.map((a) => ({ seccion: s.slug, slug: a.slug })), ...subs];
  });
  return params.length ? params : [{ seccion: 'casos', slug: 'sin-contenido' }];
}

type Props = { params: Promise<{ seccion: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seccion, slug } = await params;
  const a = findArticle(seccion, slug);
  if (!a) { const sub = sectionBySlug(seccion)?.subs.find(([k]) => k === slug); return { title: sub ? sub[1] : undefined, alternates: { canonical: `/${seccion}/${slug}/` } }; }
  return {
    title: a.titulo, description: a.descripcion, alternates: { canonical: a.url },
    robots: a.estado !== 'publicada' ? { index: false, follow: false } : undefined,
    openGraph: { type: 'article', title: a.titulo, description: a.descripcion, publishedTime: a.fecha, modifiedTime: a.actualizado, authors: [a.autor], images: a.imagen ? [a.imagen] : undefined }
  };
}

const Disclaimer = () => (
  <aside className="my-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
    <b>Información educativa.</b> Este contenido explica conceptos y escenarios con fines formativos. No es asesoramiento financiero, fiscal ni de inversión personalizado. Antes de tomar decisiones, consulta fuentes oficiales y, si lo necesitas, a un profesional habilitado. Las rentabilidades pasadas no garantizan rentabilidades futuras.
  </aside>
);

function Sub({ seccion, slug }: { seccion: string; slug: string }) {
  const s = sectionBySlug(seccion)!, sub = s.subs.find(([k]) => k === slug)!;
  const list = bySection(seccion).filter((a) => a.subseccion === slug);
  return (
    <div className="py-10">
      <p className="text-sm font-semibold text-teal"><Link href={`/${seccion}/`}>{s.name}</Link></p>
      <h1 className="text-4xl font-extrabold text-navy">{sub[1]}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{list.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { seccion, slug } = await params;
  const a = findArticle(seccion, slug);
  if (!a) { if (sectionBySlug(seccion)?.subs.some(([k]) => k === slug)) return <Sub seccion={seccion} slug={slug} />; notFound(); }
  const s = sectionBySlug(seccion)!;
  const tool = a.herramienta ? toolBySlug(a.herramienta) : undefined;
  const rel = related(a);
  const ld = {
    '@context': 'https://schema.org', '@type': a.tipo === 'noticia' ? 'NewsArticle' : 'Article', headline: a.titulo, description: a.descripcion,
    datePublished: a.fecha, dateModified: a.actualizado || a.fecha, inLanguage: 'es', mainEntityOfPage: SITE.url + a.url,
    author: { '@type': a.autor === SITE.defaultAuthor ? 'Organization' : 'Person', name: a.autor }, publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/favicon.svg' } }
  };
  return (
    <article className="mx-auto max-w-3xl py-10">
      <JsonLd data={ld} />
      {a.faq.length > 0 && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })) }} />}
      {isPreview && a.estado !== 'publicada' && <p className="mb-6 rounded-lg bg-amber-100 p-3 text-sm font-semibold text-warn">Vista previa · estado: {a.estado}. Este artículo no se publicará hasta que se marque como «publicada».</p>}
      <nav className="text-sm font-semibold text-teal" aria-label="Ruta"><Link href={`/${seccion}/`}>{s.name}</Link>{a.subseccion && <> · <Link href={`/${seccion}/${a.subseccion}/`}>{s.subs.find(([k]) => k === a.subseccion)?.[1]}</Link></>}</nav>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">{TYPES[a.tipo] || a.tipo}{a.pais.length && a.pais[0] !== 'global' ? ' · ' + a.pais.map((c) => COUNTRIES[c] || c).join(', ') : ''}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy md:text-5xl">{a.titulo}</h1>
      {a.subtitulo && <p className="mt-4 text-xl text-muted">{a.subtitulo}</p>}
      <p className="mt-5 border-y border-line py-3 text-sm text-muted">
        Por <b className="text-navy">{a.autor}</b>{a.revisor && <> · Revisado por {a.revisor}</>} · <time dateTime={a.fecha}>{formatDate(a.fecha, a.tipo === 'noticia')}</time>
        {a.actualizado && <> · Actualizado: <time dateTime={a.actualizado}>{formatDate(a.actualizado)}</time></>} · {a.minutos} min de lectura
      </p>
      {a.ficha && (
        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-mist p-5 text-sm sm:grid-cols-4">
          {Object.entries(a.ficha).map(([k, v]) => <div key={k}><dt className="text-xs font-semibold uppercase text-muted">{k}</dt><dd className="font-bold text-navy">{v}</dd></div>)}
        </dl>
      )}
      {a.tipo === 'financiero' && a.fecha_datos && <p className="mt-4 text-sm text-muted">Datos de referencia a fecha de <b>{a.fecha_datos}</b>.</p>}
      {a.tipo === 'guia' && a.toc.length > 2 && (
        <nav className="mt-6 rounded-xl border border-line p-5" aria-label="Índice"><p className="font-bold text-navy">En esta guía</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{a.toc.map((t) => <li key={t.id}><a className="text-blue hover:underline" href={`#${t.id}`}>{t.text}</a></li>)}</ol></nav>
      )}
      <div className="prose-ec mt-8" dangerouslySetInnerHTML={{ __html: a.html }} />
      {a.tipo === 'financiero' && <Disclaimer />}
      {tool && (
        <aside className="my-10 rounded-2xl bg-navy p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-teal">Herramienta relacionada</p>
          <h2 className="mt-1 text-2xl font-extrabold">{tool.name}</h2><p className="mt-1 text-white/75">{tool.short}</p>
          <Link href={`/herramientas/${tool.slug}/`} className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">Abrir la herramienta →</Link></aside>
      )}
      {a.faq.length > 0 && (
        <section className="mt-10"><h2 className="text-2xl font-extrabold text-navy">Preguntas frecuentes</h2>
          {a.faq.map((f) => <details key={f.p} className="mt-3 rounded-xl border border-line p-4"><summary className="cursor-pointer font-bold text-navy">{f.p}</summary><p className="mt-2 text-muted">{f.r}</p></details>)}</section>
      )}
      {a.fuentes.length > 0 && (
        <section className="mt-10 rounded-xl bg-mist p-5"><h2 className="font-bold text-navy">Fuentes</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{a.fuentes.map((f) => <li key={f.nombre}>{f.url ? <a href={f.url} rel="noopener" target="_blank" className="text-blue underline">{f.nombre}</a> : f.nombre}</li>)}</ul></section>
      )}
      {a.etiquetas.length > 0 && <p className="mt-6 flex flex-wrap gap-2">{a.etiquetas.map((t) => <span key={t} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-navy">#{t}</span>)}</p>}
      <AdSlot slot="articulo-final" />
      {rel.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-navy">Te puede interesar</h2><div className="grid gap-4 md:grid-cols-3">{rel.map((r: Article) => <ArticleCard key={r.url} a={r} />)}</div></section>}
      <div className="mt-12"><Newsletter /></div>
    </article>
  );
}

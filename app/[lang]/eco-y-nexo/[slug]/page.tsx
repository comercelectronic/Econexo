import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { YouTube } from '@/components/YouTube';
import { Avatar } from '@/components/Characters';
import { JsonLd } from '@/components/JsonLd';
import { Newsletter } from '@/components/Newsletter';
import { VideoCard } from '@/components/VideoCard';
import { UNIVERSE, characterById, serieName } from '@/lib/universo';
import { videos, videoBySlug, youtubeId } from '@/lib/videos';
import { published, formatDate, isPreview } from '@/lib/content';
import { toolBySlug } from '@/lib/tools';
import { SITE } from '@/lib/site';
import { LANGS, isLang, l, tr } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() {
  const v = LANGS.flatMap((lang) => videos(lang).map((x) => ({ lang, slug: x.slug })));
  return v.length ? v : [{ lang: 'ca', slug: 'sin-contenido' }];
}
type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const v = isLang(lang) ? videoBySlug(lang, slug) : undefined;
  if (!v || !isLang(lang)) return {};
  return { title: v.titulo, description: v.descripcion, alternates: { canonical: l(lang, v.url) }, robots: v.estado !== 'publicada' ? { index: false, follow: false } : undefined };
}

export default async function VideoPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const v = isLang(raw) ? videoBySlug(raw, slug) : undefined;
  if (!v || !isLang(raw)) notFound();
  const lang = raw, t = tr(lang);
  const id = youtubeId(v.youtube);
  const guide = v.guia ? published(lang).find((a) => a.url === v.guia) : undefined;
  const tool = v.herramienta ? toolBySlug(v.herramienta) : undefined;
  const more = videos(lang).filter((x) => x.slug !== v.slug && x.serie === v.serie).slice(0, 3);
  return (
    <article className="mx-auto max-w-4xl py-10">
      {id && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'VideoObject', name: v.titulo, description: v.descripcion, uploadDate: v.fecha, thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, inLanguage: lang, publisher: { '@type': 'Organization', name: SITE.name } }} />}
      {isPreview && v.estado !== 'publicada' && <p className="mb-6 rounded-lg bg-amber-100 p-3 text-sm font-semibold text-warn">{t('Vista previa · estado: {0}. No se publicará hasta que se marque como «publicada».', v.estado)}</p>}
      <p className="text-sm font-semibold text-teal"><Link href={l(lang, '/eco-y-nexo/')}>ECO y NEXO</Link> · <Link href={l(lang, `/eco-y-nexo/#${v.serie}`)}>{t(serieName(v.serie))}</Link></p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy md:text-5xl">{v.titulo}</h1>
      <p className="mt-3 text-lg text-muted">{v.descripcion}</p>
      <p className="mt-3 text-sm text-muted">{v.formato === 'short' ? 'Short' : t('Episodio')}{v.duracion ? ` · ${v.duracion}` : ''} · {formatDate(v.fecha, lang)}</p>
      <div className="mt-8"><YouTube id={id} title={v.titulo} vertical={v.formato === 'short'} cast={v.personajes} /></div>

      <section className="mt-10 grid gap-5 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl bg-mist p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-teal">{t('Lo que aprendes')}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-navy">{v.concepto}</h2>
          {v.aprendes.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5">{v.aprendes.map((x) => <li key={x}>{x}</li>)}</ul>}
        </div>
        <aside className="space-y-3">
          {guide && <Link href={l(lang, guide.url)} className="block rounded-2xl border border-line p-5 hover:border-teal"><p className="text-xs font-bold uppercase tracking-wide text-teal">{t('Guía completa')}</p><p className="mt-1 font-bold text-navy">{guide.titulo}</p></Link>}
          {tool && <Link href={l(lang, `/herramientas/${tool.slug}/`)} className="block rounded-2xl bg-navy p-5 text-white hover:bg-navy-2"><p className="text-xs font-bold uppercase tracking-wide text-teal">{t('Practica')}</p><p className="mt-1 font-bold">{t(tool.name)} →</p></Link>}
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-navy">{t('Guion')}</h2>
        <div className="mt-3 flex flex-wrap gap-3">{v.personajes.map((c) => { const ch = characterById(c); return ch ? <span key={c} className="flex items-center gap-2 rounded-full bg-mist py-1 pl-1 pr-3 text-sm font-bold" style={{ color: ch.color }}><Avatar id={c} className="h-8 w-8" />{ch.name}</span> : null; })}</div>
        <div className="prose-ec mt-5" dangerouslySetInnerHTML={{ __html: v.html }} />
        <p className="mt-6 font-display text-lg font-extrabold text-teal">{t(UNIVERSE.closing)}</p>
      </section>

      {more.length > 0 && <section className="mt-12"><h2 className="mb-4 text-xl font-extrabold text-navy">{t('Más de')} {t(serieName(v.serie))}</h2><div className="grid gap-5 md:grid-cols-3">{more.map((x) => <VideoCard key={x.slug} v={x} lang={lang} />)}</div></section>}
      <div className="mt-12"><Newsletter variant="nexo" /></div>
    </article>
  );
}

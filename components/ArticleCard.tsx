import Link from 'next/link';
import type { Article } from '@/lib/content';
import { formatDate } from '@/lib/content';
import { TYPES, sectionBySlug } from '@/lib/site';
import { l, tr, type Lang } from '@/lib/i18n';

const Kicker = ({ a, lang }: { a: Article; lang: Lang }) => {
  const t = tr(lang);
  return (
  <span className="text-xs font-bold uppercase tracking-wide text-teal">
    {t(TYPES[a.tipo] || a.tipo)}{a.seccion !== 'casos' && <> · {t(sectionBySlug(a.seccion)?.short || sectionBySlug(a.seccion)?.name || '')}</>}
    {a.estado !== 'publicada' && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-warn">{t('EN REVISIÓN')}</span>}
  </span>
  );
};

export function ArticleCard({ a, lang, variant = 'card' }: { a: Article; lang: Lang; variant?: 'hero' | 'card' | 'compact' }) {
  const t = tr(lang);
  if (variant === 'hero')
    return (
      <article className="rounded-2xl bg-mist p-6 md:p-10">
        <Kicker a={a} lang={lang} />
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-navy md:text-5xl"><Link href={l(lang, a.url)} className="hover:text-blue">{a.titulo}</Link></h2>
        <p className="mt-4 max-w-3xl text-lg text-muted">{a.subtitulo}</p>
        <p className="mt-5 text-sm text-muted">{a.autor} · <time dateTime={a.fecha}>{formatDate(a.fecha, lang)}</time> · {a.minutos} {t('min de lectura')}</p>
      </article>
    );
  if (variant === 'compact')
    return (
      <article className="border-b border-line py-3 last:border-0">
        <Kicker a={a} lang={lang} />
        <h3 className="mt-1 font-bold leading-snug text-navy"><Link href={l(lang, a.url)} className="hover:text-blue">{a.titulo}</Link></h3>
      </article>
    );
  return (
    <article className="flex flex-col rounded-xl border border-line p-5 transition hover:shadow-md">
      <Kicker a={a} lang={lang} />
      <h3 className="mt-2 text-lg font-bold leading-snug text-navy"><Link href={l(lang, a.url)} className="hover:text-blue">{a.titulo}</Link></h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{a.subtitulo}</p>
      <p className="mt-auto pt-4 text-xs text-muted"><time dateTime={a.fecha}>{formatDate(a.fecha, lang)}</time> · {a.minutos} min</p>
    </article>
  );
}

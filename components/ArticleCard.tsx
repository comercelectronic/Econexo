import Link from 'next/link';
import type { Article } from '@/lib/content';
import { formatDate } from '@/lib/content';
import { TYPES, sectionBySlug } from '@/lib/site';

const Kicker = ({ a }: { a: Article }) => (
  <span className="text-xs font-bold uppercase tracking-wide text-teal">
    {TYPES[a.tipo] || a.tipo}{a.seccion !== 'casos' && <> · {sectionBySlug(a.seccion)?.short || sectionBySlug(a.seccion)?.name}</>}
    {a.estado !== 'publicada' && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-warn">EN REVISIÓN</span>}
  </span>
);

export function ArticleCard({ a, variant = 'card' }: { a: Article; variant?: 'hero' | 'card' | 'compact' }) {
  if (variant === 'hero')
    return (
      <article className="rounded-2xl bg-mist p-6 md:p-10">
        <Kicker a={a} />
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-navy md:text-5xl"><Link href={a.url} className="hover:text-blue">{a.titulo}</Link></h2>
        <p className="mt-4 max-w-3xl text-lg text-muted">{a.subtitulo}</p>
        <p className="mt-5 text-sm text-muted">{a.autor} · <time dateTime={a.fecha}>{formatDate(a.fecha)}</time> · {a.minutos} min de lectura</p>
      </article>
    );
  if (variant === 'compact')
    return (
      <article className="border-b border-line py-3 last:border-0">
        <Kicker a={a} />
        <h3 className="mt-1 font-bold leading-snug text-navy"><Link href={a.url} className="hover:text-blue">{a.titulo}</Link></h3>
      </article>
    );
  return (
    <article className="flex flex-col rounded-xl border border-line p-5 transition hover:shadow-md">
      <Kicker a={a} />
      <h3 className="mt-2 text-lg font-bold leading-snug text-navy"><Link href={a.url} className="hover:text-blue">{a.titulo}</Link></h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{a.subtitulo}</p>
      <p className="mt-auto pt-4 text-xs text-muted"><time dateTime={a.fecha}>{formatDate(a.fecha)}</time> · {a.minutos} min</p>
    </article>
  );
}

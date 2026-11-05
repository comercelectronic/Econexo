import Link from 'next/link';
import type { Video } from '@/lib/videos';
import { serieName } from '@/lib/universo';
import { Avatar } from './Characters';
import { l, tr, type Lang } from '@/lib/i18n';

export function VideoCard({ v, lang }: { v: Video; lang: Lang }) {
  const t = tr(lang);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line transition hover:shadow-md">
      <Link href={l(lang, v.url)} className="relative flex h-36 items-center gap-2 bg-gradient-to-br from-navy to-teal-dark px-5">
        {v.personajes.slice(0, 3).map((c) => <Avatar key={c} id={c} className="h-14 w-14" />)}
        <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-navy">{v.formato === 'short' ? 'SHORT' : t('EPISODIO')}{v.duracion ? ` · ${v.duracion}` : ''}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-teal">{t(serieName(v.serie))}{v.estado !== 'publicada' && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-warn">{t('EN REVISIÓN')}</span>}</span>
        <h3 className="mt-2 font-bold leading-snug text-navy"><Link href={l(lang, v.url)} className="hover:text-blue">{v.titulo}</Link></h3>
        <p className="mt-2 text-sm text-muted">{t('Aprendes')}: {v.concepto}</p>
      </div>
    </article>
  );
}

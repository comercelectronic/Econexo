import Link from 'next/link';
import type { Video } from '@/lib/videos';
import { serieName } from '@/lib/cromo';
import { Avatar } from './Characters';

export function VideoCard({ v }: { v: Video }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line transition hover:shadow-md">
      <Link href={v.url} className="relative flex h-36 items-center gap-2 bg-gradient-to-br from-navy to-teal-dark px-5">
        {v.personajes.slice(0, 3).map((c) => <Avatar key={c} id={c} className="h-14 w-14" />)}
        <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-navy">{v.formato === 'short' ? 'SHORT' : 'EPISODIO'}{v.duracion ? ` · ${v.duracion}` : ''}</span>
        {!v.youtube && <span className="absolute bottom-3 right-3 rounded bg-amber-300 px-2 py-0.5 text-[10px] font-bold text-navy">PRÓXIMAMENTE</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-teal">{serieName(v.serie)}{v.estado !== 'publicada' && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-warn">EN REVISIÓN</span>}</span>
        <h3 className="mt-2 font-bold leading-snug text-navy"><Link href={v.url} className="hover:text-blue">{v.titulo}</Link></h3>
        <p className="mt-2 text-sm text-muted">Aprendes: {v.concepto}</p>
      </div>
    </article>
  );
}

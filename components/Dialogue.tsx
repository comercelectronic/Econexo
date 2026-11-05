// Diàleg breu entre ECO i NEXO: introdueix un concepte abans de l'explicació tècnica
import Link from 'next/link';
import { characterById, universeUrl, type Line } from '@/lib/universo';
import { Avatar } from './Characters';
import { l, tr, type Lang } from '@/lib/i18n';

export function Dialogue({ lines, lang, title = 'En 30 segundos', compact = false, raw = false }: { lines: Line[]; lang: Lang; title?: string; compact?: boolean; raw?: boolean }) {
  const t = tr(lang);
  if (!lines?.length) return null;
  return (
    <section className={`rounded-2xl border-2 border-uni/30 bg-uni-soft ${compact ? 'p-4' : 'p-5 md:p-6'}`} aria-label={t(title)}>
      <p className="mb-3 flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-uni-dark">
        <span>{t(title)}</span><Link href={l(lang, universeUrl())} className="normal-case tracking-normal text-uni-dark underline-offset-2 hover:underline">ECO y NEXO →</Link>
      </p>
      <ol className="space-y-3">
        {lines.map((ln, i) => {
          const c = characterById(ln.quien), right = ln.quien !== 'eco';
          return (
            <li key={i} className={`flex items-end gap-3 ${right ? 'flex-row-reverse' : ''}`}>
              <Avatar id={ln.quien} gesto={ln.gesto} className={compact ? 'h-11 w-11' : 'h-14 w-14'} />
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${right ? 'rounded-br-sm bg-white' : 'rounded-bl-sm bg-white'}`}>
                <p className={`text-[11px] font-extrabold uppercase tracking-wide ${right ? 'text-right' : ''}`} style={{ color: c?.color }}>{c?.name}</p>
                <p className="text-[0.98rem] leading-snug text-ink">{raw ? ln.texto : t(ln.texto)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

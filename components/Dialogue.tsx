// Diàleg breu entre CROMO i el PROFE SURICATA: introdueix un concepte abans de l'explicació tècnica
import Link from 'next/link';
import { characterById, universeUrl, type Line } from '@/lib/cromo';
import { Avatar } from './Characters';

export function Dialogue({ lines, title = 'En 30 segundos', compact = false }: { lines: Line[]; title?: string; compact?: boolean }) {
  if (!lines?.length) return null;
  return (
    <section className={`rounded-2xl border-2 border-cromo/30 bg-cromo-soft ${compact ? 'p-4' : 'p-5 md:p-6'}`} aria-label={title}>
      <p className="mb-3 flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-cromo-dark">
        <span>{title}</span><Link href={universeUrl()} className="normal-case tracking-normal text-cromo-dark underline-offset-2 hover:underline">Universo CROMO →</Link>
      </p>
      <ol className="space-y-3">
        {lines.map((l, i) => {
          const c = characterById(l.quien), right = l.quien !== 'cromo';
          return (
            <li key={i} className={`flex items-end gap-3 ${right ? 'flex-row-reverse' : ''}`}>
              <Avatar id={l.quien} gesto={l.gesto} className={compact ? 'h-11 w-11' : 'h-14 w-14'} />
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${right ? 'rounded-br-sm bg-white' : 'rounded-bl-sm bg-white'}`}>
                <p className={`text-[11px] font-extrabold uppercase tracking-wide ${right ? 'text-right' : ''}`} style={{ color: c?.color }}>{c?.name}</p>
                <p className="text-[0.98rem] leading-snug text-ink">{l.texto}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

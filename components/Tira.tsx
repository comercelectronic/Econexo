// Tira còmica en blanc i negre: tres vinyetes amb ECO i NEXO que introdueixen la lliçó.
// Cada personatge surt amb la pose que correspon al gest del seu bocadillo (public/media/personajes/<id>-<pose>.webp).
import type { Bocadillo } from '@/lib/estudios';
import { poseFor } from '@/lib/universo';
import { tr, type Lang } from '@/lib/i18n';

const NAMES: Record<string, string> = { eco: 'ECO', nexo: 'NEXO' };
const img = (id: string, gesto?: string) => { const p = poseFor(id, gesto); return p ? `/media/personajes/${id}-${p}.webp` : `/media/personajes/${id}-tira.webp`; };

export function Tira({ panels, titulo, lang }: { panels: Bocadillo[][]; titulo: string; lang: Lang }) {
  const t = tr(lang);
  if (!panels?.length) return null;
  return (
    <figure className="font-comic">
      <div className="grid gap-3 sm:grid-cols-3">
        {panels.map((bubbles, i) => {
          // cada personatge, amb el gest del seu últim bocadillo de la vinyeta
          const cast = [...new Set(bubbles.map((b) => b.quien))].map((q) => ({ q, gesto: [...bubbles].reverse().find((b) => b.quien === q)?.gesto }));
          return (
            <div key={i} className="relative flex min-h-52 flex-col sm:min-h-72 overflow-hidden rounded-sm border-[3px] border-black bg-white p-3">
              <span className="absolute right-2 top-1 text-xs font-bold text-black/40">{i + 1}</span>
              <div className="space-y-2">
                {bubbles.map((b, k) => (
                  <p key={k} className={`relative max-w-[92%] rounded-[18px] border-2 border-black bg-white px-3 py-2 text-[0.95rem] leading-snug text-black ${b.quien === 'eco' ? 'mr-auto' : 'ml-auto'}`}>
                    <b className="mr-1 text-xs tracking-wide">{NAMES[b.quien] || b.quien}:</b>{b.texto}
                    <span className={`absolute -bottom-[9px] h-4 w-4 rotate-45 border-b-2 border-r-2 border-black bg-white ${b.quien === 'eco' ? 'left-6' : 'right-6'}`} aria-hidden />
                  </p>
                ))}
              </div>
              <div className={`mt-auto flex items-end pt-3 ${cast.length > 1 ? 'justify-between' : cast[0].q === 'eco' ? 'justify-start' : 'justify-end'}`}>
                {cast.map((c) => <img key={c.q} src={img(c.q, c.gesto)} alt={NAMES[c.q]} loading="lazy" className="h-32 w-auto object-contain" />)}
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted">{t('Tira')}: {titulo}</figcaption>
    </figure>
  );
}

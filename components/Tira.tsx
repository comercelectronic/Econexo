// Tira còmica en blanc i negre: tres vinyetes amb ECO i NEXO que introdueixen la lliçó.
// Els personatges surten de public/media/personajes/<id>-tira.webp (dibuix en blanc i negre);
// si encara no existeix, es fa servir la il·lustració a color passada a escala de grisos.
import fs from 'node:fs';
import path from 'node:path';
import type { Bocadillo } from '@/lib/estudios';

const NAMES: Record<string, string> = { eco: 'ECO', nexo: 'NEXO' };
function img(id: string) {
  const bw = `/media/personajes/${id}-tira.webp`;
  return fs.existsSync(path.join(process.cwd(), 'public', bw)) ? { src: bw, bw: true } : { src: `/media/personajes/${id}-principal.webp`, bw: false };
}

export function Tira({ panels, titulo }: { panels: Bocadillo[][]; titulo: string }) {
  if (!panels?.length) return null;
  return (
    <figure className="font-comic">
      <div className="grid gap-3 sm:grid-cols-3">
        {panels.map((bubbles, i) => {
          const cast = [...new Set(bubbles.map((b) => b.quien))];
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
              <div className={`mt-auto flex items-end pt-3 ${cast.length > 1 ? 'justify-between' : cast[0] === 'eco' ? 'justify-start' : 'justify-end'}`}>
                {cast.map((c) => { const im = img(c); return <img key={c} src={im.src} alt={NAMES[c]} loading="lazy" className={`h-32 w-auto object-contain ${im.bw ? '' : 'grayscale contrast-125'}`} />; })}
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted">Tira: {titulo}</figcaption>
    </figure>
  );
}

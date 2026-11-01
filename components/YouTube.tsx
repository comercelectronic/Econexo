'use client';
// Reproductor amb «façana»: fins que el lector no prem play no es connecta a YouTube (ni cookies ni dades a Google).
// Després es carrega des de youtube-nocookie.com.
import { useState } from 'react';
import { Avatar } from './Characters';

export function YouTube({ id, title, vertical = false, cast = ['eco'] }: { id?: string; title: string; vertical?: boolean; cast?: string[] }) {
  const [on, setOn] = useState(false);
  const box = `relative mx-auto w-full overflow-hidden rounded-2xl bg-navy ${vertical ? 'aspect-[9/16] max-w-sm' : 'aspect-video'}`;
  if (!id)
    return (
      <div className={`${box} grid place-items-center text-center text-white`}>
        <div className="p-6"><div className="flex justify-center gap-2">{cast.map((c) => <Avatar key={c} id={c} className="h-14 w-14" />)}</div>
          <p className="mt-4 font-display text-xl font-extrabold">Próximamente en YouTube</p><p className="mt-1 text-sm text-white/70">Mientras tanto, lee el guion y la explicación.</p></div>
      </div>
    );
  if (on)
    return (
      <div className={box}>
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  return (
    <button onClick={() => setOn(true)} className={`${box} group block text-left text-white`} aria-label={`Reproducir vídeo: ${title}`}>
      <span className="absolute inset-0 bg-gradient-to-br from-navy via-navy-2 to-teal-dark" />
      <span className="absolute left-5 top-5 flex gap-2">{cast.map((c) => <Avatar key={c} id={c} className="h-12 w-12" />)}</span>
      <span className="absolute inset-0 grid place-items-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-navy shadow-lg transition group-hover:scale-110">▶</span></span>
      <span className="absolute bottom-5 left-5 right-5 font-display text-xl font-extrabold">{title}</span>
      <span className="absolute bottom-0 right-0 m-2 rounded bg-black/40 px-2 py-0.5 text-[10px]">Al reproducir, el vídeo se carga desde YouTube</span>
    </button>
  );
}

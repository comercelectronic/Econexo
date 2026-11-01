// Presència de ECO y NEXO a totes les pàgines: dibuix de línia amb un bocadillo de còmic.
import { POSES, characterById, poseFor } from '@/lib/universo';

export type Dice = { quien: string; texto: string };
// Acepta un gest (alegria, sorpresa…) o directament el nom d'una pose (explicando, contento…)
const src = (id: string, gesto?: string) => `/media/personajes/${id}-${POSES[id]?.includes(gesto || '') ? gesto : poseFor(id, gesto)}.webp`;

// Bocadillo de còmic (negre sobre blanc) amb cua cap al personatge
export function Bocadillo({ quien, texto, className = '' }: Dice & { className?: string }) {
  const c = characterById(quien);
  return (
    <p className={`relative rounded-2xl border-[3px] border-black bg-white px-4 py-2.5 font-comic text-[0.95rem] font-bold leading-snug text-black ${className}`}>
      <span className="mr-1 text-xs font-extrabold uppercase" style={{ color: c?.color }}>{c?.name}:</span>{texto}
      <span aria-hidden="true" className="absolute -bottom-[11px] left-8 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-black bg-white" />
    </p>
  );
}

// Un o dos personatges amb un bocadillo (per a capçaleres i marges de pàgina)
export function Mascotas({ eco, nexo, dice, size = 'h-36', className = '' }: { eco?: string; nexo?: string; dice?: Dice; size?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {dice && <Bocadillo {...dice} className="max-w-xs" />}
      <div className="flex items-end justify-center gap-1">
        {nexo !== undefined && <img src={src('nexo', nexo)} alt="NEXO" className={`${size} w-auto`} loading="lazy" />}
        {eco !== undefined && <img src={src('eco', eco)} alt="ECO" className={`${size} w-auto`} loading="lazy" />}
      </div>
    </div>
  );
}

// Capçalera de pàgina: títol a l'esquerra i personatges amb bocadillo a la dreta
export function PageHero({ kicker, title, intro, eco, nexo, dice, children }: { kicker?: React.ReactNode; title: string; intro?: React.ReactNode; eco?: string; nexo?: string; dice?: Dice; children?: React.ReactNode }) {
  return (
    <header className="grid items-center gap-6 border-b-2 border-navy pb-6 md:grid-cols-[1fr_auto]">
      <div>
        {kicker && <p className="text-sm font-semibold text-teal">{kicker}</p>}
        <h1 className="mt-1 text-4xl font-extrabold text-navy">{title}</h1>
        {intro && <p className="mt-2 max-w-3xl text-muted">{intro}</p>}
        {children}
      </div>
      <Mascotas eco={eco} nexo={nexo} dice={dice} className="md:min-w-64" />
    </header>
  );
}

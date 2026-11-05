'use client';
// Marca les lliçons superades (dades al navegador de l'alumne) i mostra el progrés del mòdul
import { useEffect, useState } from 'react';
import { readProgress } from './LessonTest';
import { useT } from './LangProvider';

export function useProgress() {
  const [p, setP] = useState<Record<string, number>>({});
  useEffect(() => setP(readProgress()), []);
  return p;
}
export function Done({ id }: { id: string }) {
  const t = useT();
  const p = useProgress();
  return p[id] >= 3 ? <span className="shrink-0 rounded-full bg-teal px-2 py-0.5 text-xs font-bold text-white" title={t('Lección superada')}>✔</span> : null;
}
export function ModuleBar({ ids }: { ids: string[] }) {
  const t = useT();
  const p = useProgress();
  const n = ids.filter((id) => p[id] >= 3).length;
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold text-navy"><span>{t('Tu progreso')}</span><span>{t('{0} de {1} lecciones', n, ids.length)}</span></div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-line"><div className="h-full rounded-full bg-teal transition-all" style={{ width: `${(n / ids.length) * 100}%` }} /></div>
      <p className="mt-1 text-xs text-muted">{t('Se guarda en este navegador. Supera el test de cada lección con 3 de 5.')}</p>
    </div>
  );
}

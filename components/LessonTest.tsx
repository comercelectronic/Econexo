'use client';
// Test d'autoavaluació de la lliçó. El progrés es desa al navegador de l'alumne (localStorage).
import { useMemo, useState } from 'react';
import type { Pregunta } from '@/lib/estudios';

export const PROGRESS_KEY = 'econexo-progreso';
export function readProgress(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}

function shuffle(n: number) { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export function LessonTest({ id, test }: { id: string; test: Pregunta[] }) {
  const [i, setI] = useState(0), [score, setScore] = useState(0), [picked, setPicked] = useState<number | null>(null), [round, setRound] = useState(0);
  const orders = useMemo(() => test.map((q) => shuffle(q.o.length)), [test, round]);
  if (!test.length) return null;
  const done = i >= test.length;
  if (done) {
    const pass = score >= Math.ceil(test.length * 0.6);
    return (
      <div className="rounded-2xl border-2 border-navy p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-teal">Resultado</p>
        <p className="mt-1 font-display text-4xl font-extrabold text-navy">{score} / {test.length}</p>
        <p className="mt-2 text-muted">{pass ? '¡Lección superada! Ya puedes pasar a la siguiente.' : 'Repasa la lección y vuelve a intentarlo: necesitas 3 de 5.'}</p>
        <button onClick={() => { setI(0); setScore(0); setPicked(null); setRound(round + 1); }} className="mt-4 rounded-lg bg-navy px-5 py-2.5 font-semibold text-white">Repetir el test</button>
      </div>
    );
  }
  const q = test[i], ok = picked === q.c;
  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    const s = score + (k === q.c ? 1 : 0);
    if (i === test.length - 1) {
      try { const p = readProgress(); p[id] = Math.max(p[id] || 0, s); localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch { /* sense desar */ }
    }
  };
  return (
    <div className="rounded-2xl border-2 border-navy p-5 md:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-teal">Pregunta {i + 1} de {test.length}</p>
      <p className="mt-2 text-lg font-bold text-navy">{q.p}</p>
      <div className="mt-4 grid gap-2">
        {orders[i].map((k) => (
          <button key={k} onClick={() => choose(k)} disabled={picked !== null}
            className={`rounded-xl border-2 px-4 py-3 text-left transition ${picked === null ? 'border-line hover:border-teal' : k === q.c ? 'border-teal bg-teal/10' : k === picked ? 'border-red-400 bg-red-50' : 'border-line opacity-60'}`}
            dangerouslySetInnerHTML={{ __html: q.o[k] }} />
        ))}
      </div>
      {picked !== null && (
        <div className={`mt-4 rounded-xl p-4 ${ok ? 'bg-teal/10' : 'bg-red-50'}`}>
          <p className="font-bold">{ok ? '✔ Correcto' : '✘ Incorrecto'}</p><p className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: q.por }} />
          <button onClick={() => { setScore(score + (ok ? 1 : 0)); setI(i + 1); setPicked(null); }} className="mt-3 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">{i === test.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>
        </div>
      )}
    </div>
  );
}

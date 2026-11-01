'use client';
// Cercador d'estudis: filtra per grau i per text, i mostra cicles i mòduls (els disponibles, enllaçats)
import Link from 'next/link';
import { useState } from 'react';

type M = { slug: string; name: string; live: boolean; lecciones?: number };
type C = { slug: string; name: string; grado: string; resumen: string; modulos: M[] };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function StudyFinder({ ciclos, initialGrado = 'todos' }: { ciclos: C[]; initialGrado?: string }) {
  const [grado, setGrado] = useState(initialGrado), [q, setQ] = useState(''), [solo, setSolo] = useState(false);
  const list = ciclos.filter((c) => grado === 'todos' || c.grado === grado).map((c) => ({
    ...c, modulos: c.modulos.filter((m) => (!solo || m.live) && (!q || norm(m.name + ' ' + c.name).includes(norm(q))))
  })).filter((c) => (!q && !solo) || c.modulos.length);
  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl bg-mist p-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Grado">
          {[['todos', 'Todos'], ['medio', 'Grado medio'], ['superior', 'Grado superior']].map(([k, n]) => (
            <button key={k} onClick={() => setGrado(k)} aria-pressed={grado === k} className={`rounded-full px-4 py-2 text-sm font-semibold ${grado === k ? 'bg-navy text-white' : 'bg-white text-navy'}`}>{n}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca un módulo: comercio electrónico, venta, almacén…" aria-label="Buscar módulo" className="flex-1 rounded-full border border-line bg-white px-4 py-2 outline-none focus:border-teal" />
        <label className="flex items-center gap-2 text-sm font-semibold text-navy"><input type="checkbox" checked={solo} onChange={(e) => setSolo(e.target.checked)} /> Solo disponibles</label>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {list.map((c) => (
          <section key={c.slug} className="rounded-2xl border border-line p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-teal">{c.grado === 'medio' ? 'Grado medio' : 'Grado superior'}</p>
            <h2 className="mt-1 text-xl font-extrabold text-navy"><Link href={`/estudiar/${c.slug}/`} className="hover:text-blue">{c.name}</Link></h2>
            <p className="mt-1 text-sm text-muted">{c.resumen}</p>
            {c.modulos.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {c.modulos.map((m) => (
                  <li key={m.slug}>
                    {m.live ? <Link href={`/estudiar/${c.slug}/${m.slug}/`} className="flex items-center justify-between gap-2 rounded-lg bg-teal/10 px-3 py-2 font-semibold text-navy hover:bg-teal/20"><span>{m.name}</span><span className="text-xs font-bold text-teal-dark">{m.lecciones} lecciones · simulador →</span></Link>
                      : <span className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-muted"><span>{m.name}</span><span className="text-xs">Próximamente</span></span>}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-muted">Módulos en preparación.</p>}
          </section>
        ))}
      </div>
      {!list.length && <p className="mt-6 text-muted">No hay resultados. Prueba con otra búsqueda.</p>}
    </div>
  );
}

'use client';
// Cercador d'estudis: filtra per grau i per text, i mostra cicles i mòduls (els disponibles, enllaçats)
import Link from 'next/link';
import { useState } from 'react';
import { useLang, useT } from './LangProvider';
import { l } from '@/lib/i18n';

type M = { slug: string; name: string; live: boolean; lecciones?: number };
type C = { slug: string; name: string; grado: string; resumen: string; modulos: M[] };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function StudyFinder({ ciclos, initialGrado = 'todos' }: { ciclos: C[]; initialGrado?: string }) {
  const t = useT(), lang = useLang();
  const [grado, setGrado] = useState(initialGrado), [q, setQ] = useState('');
  const list = ciclos.filter((c) => grado === 'todos' || c.grado === grado).map((c) => ({
    ...c, modulos: c.modulos.filter((m) => !q || norm(t(m.name) + ' ' + t(c.name)).includes(norm(q)))
  })).filter((c) => !q || c.modulos.length);
  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl bg-mist p-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('Grado')}>
          {[['todos', t('Todos')], ['medio', t('Grado medio')], ['superior', t('Grado superior')]].map(([k, n]) => (
            <button key={k} onClick={() => setGrado(k)} aria-pressed={grado === k} className={`rounded-full px-4 py-2 text-sm font-semibold ${grado === k ? 'bg-navy text-white' : 'bg-white text-navy'}`}>{n}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Busca un módulo: comercio electrónico, venta, almacén…')} aria-label={t('Buscar módulo')} className="flex-1 rounded-full border border-line bg-white px-4 py-2 outline-none focus:border-teal" />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {list.map((c) => (
          <section key={c.slug} className="rounded-2xl border border-line p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-teal">{c.grado === 'medio' ? t('Grado medio') : t('Grado superior')}</p>
            <h2 className="mt-1 text-xl font-extrabold text-navy"><Link href={l(lang, `/aprender/${c.slug}/`)} className="hover:text-blue">{t(c.name)}</Link></h2>
            <p className="mt-1 text-sm text-muted">{t(c.resumen)}</p>
            {c.modulos.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {c.modulos.map((m) => (
                  <li key={m.slug}>
                    {m.live ? <Link href={l(lang, `/aprender/${c.slug}/${m.slug}/`)} className="flex items-center justify-between gap-2 rounded-lg bg-teal/10 px-3 py-2 font-semibold text-navy hover:bg-teal/20"><span>{t(m.name)}</span><span className="text-xs font-bold text-teal-dark">{t('{0} lecciones · simulador →', m.lecciones ?? 0)}</span></Link>
                      : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
      {!list.length && <p className="mt-6 text-muted">{t('No hay resultados. Prueba con otra búsqueda.')}</p>}
    </div>
  );
}

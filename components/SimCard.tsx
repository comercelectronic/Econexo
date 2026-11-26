// Targeta d'un simulador (portada i pàgina de simuladors): captura, nom, repte, mòdul, botó «Juga» i,
// per al professorat, «Prepara la sessió» (desplegable natiu <details>, accessible amb el teclat).
import Link from 'next/link';
import { modulosDeSimulador, simUrl, type Simulador } from '@/lib/estudios';
import { l, tr, type Lang } from '@/lib/i18n';

export function DocentPanel({ s, lang, dark = false }: { s: Simulador; lang: Lang; dark?: boolean }) {
  const t = tr(lang), d = s.docent || {}, mods = modulosDeSimulador(s);
  const rows: [string, string | undefined][] = [
    [t('Duración'), d.durada && t(d.durada)], [t('Agrupamiento'), d.agrupament && t(d.agrupament)],
    [t('Resultados de aprendizaje'), d.ra && t(d.ra)], [t('Evidencias de evaluación'), d.evidencies && t(d.evidencies)]
  ];
  const theory = mods.filter((m) => m.modulo.live);
  const muted = dark ? 'text-white/75' : 'text-muted', label = dark ? 'text-[#f8b62d]' : 'text-[#3b2b7a]';
  return (
    <details className={`group mt-3 rounded-xl ${dark ? 'bg-white/10' : 'bg-[#f5f7ff]'}`}>
      <summary className={`flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm font-bold focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#f8b62d] ${dark ? 'text-white' : 'text-[#3b2b7a]'} [&::-webkit-details-marker]:hidden`}>
        <span>🧑‍🏫 {t('Prepara la sesión')}<span className="sr-only"> · {s.name}</span></span>
        <span aria-hidden="true" className="transition group-open:rotate-180">▾</span>
      </summary>
      <div className="px-4 pb-4 text-sm">
        <dl className="grid gap-2">
          <div><dt className={`text-xs font-bold uppercase tracking-wide ${label}`}>{mods.length > 1 ? t('Módulos') : t('Módulo')}</dt>
            <dd className={muted}>{mods.map(({ ciclo, modulo }) => `${t(modulo.name)} · ${t(ciclo.name)} (${ciclo.grado === 'medio' ? t('grado medio') : t('grado superior')})`).join(' / ')}</dd></div>
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><dt className={`text-xs font-bold uppercase tracking-wide ${label}`}>{k}</dt><dd className={muted}>{v}</dd></div>
          ))}
          {d.notes && <div><dt className={`text-xs font-bold uppercase tracking-wide ${label}`}>{t('Para saber')}</dt><dd className={muted}>{t(d.notes)}</dd></div>}
          <div><dt className={`text-xs font-bold uppercase tracking-wide ${label}`}>{t('Idiomas')}</dt><dd className={muted}>{t(s.idiomas)}</dd></div>
        </dl>
        <p className={`mt-3 ${muted}`}>{t(s.desc)}</p>
        {theory.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-2">
            {theory.map(({ ciclo, modulo }) => (
              <Link key={modulo.slug} href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className={`rounded-full px-3 py-1 font-semibold underline-offset-2 hover:underline ${dark ? 'bg-white/15 text-white' : 'bg-white text-[#1f7ae0] ring-1 ring-line'}`}>
                📘 {t('Teoría')}: {t(modulo.name)} →
              </Link>
            ))}
          </p>
        )}
      </div>
    </details>
  );
}

const ACCENTS = ['border-[#1f7ae0]', 'border-[#1f9d6b]', 'border-[#f08a24]', 'border-[#c2378a]'];

export function SimCard({ s, lang, i = 0 }: { s: Simulador; lang: Lang; i?: number }) {
  const t = tr(lang), href = simUrl(s, lang), mods = modulosDeSimulador(s);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-line">
      {s.img && (
        // La captura també obre el joc, però no és un segon punt de tabulació: el botó «Juga» ja ho fa.
        <a href={href} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
          <img src={s.img} alt="" loading="lazy" className="aspect-video w-full object-cover object-top transition hover:scale-105" />
        </a>
      )}
      <div className={`flex flex-1 flex-col border-t-4 p-5 ${ACCENTS[i % ACCENTS.length]}`}>
        <h3 className="text-2xl font-extrabold text-navy">{s.name}</h3>
        {s.repte && <p className="mt-2 text-base font-medium text-ink">{t(s.repte)}</p>}
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#3b2b7a]">{mods.map(({ modulo }) => t(modulo.name)).join(' · ')}</p>
        <div className="mt-4 flex-1" />
        <a href={href} target="_blank" rel="noopener" aria-label={t('Jugar a {0}', s.name)}
          className="block rounded-xl bg-gradient-to-r from-[#e5483a] to-[#f08a24] px-5 py-3 text-center text-lg font-extrabold text-white shadow hover:brightness-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1d2340]">
          ▶ {t('Jugar')}
        </a>
        <DocentPanel s={s} lang={lang} />
      </div>
    </article>
  );
}

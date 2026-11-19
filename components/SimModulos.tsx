// Per a quins mòduls serveix un simulador: etiquetes amb el mòdul i el cicle (enllaçades si el mòdul ja té pàgina)
import Link from 'next/link';
import { modulosDeSimulador, type Simulador } from '@/lib/estudios';
import { l, tr, type Lang } from '@/lib/i18n';

export function SimModulos({ s, lang, className = '' }: { s: Simulador; lang: Lang; className?: string }) {
  const t = tr(lang), mods = modulosDeSimulador(s);
  if (!mods.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-teal">{mods.length > 1 ? t('Módulos') : t('Módulo')}</span>
      {mods.map(({ ciclo, modulo }) => {
        const txt = <><b>{t(modulo.name)}</b> <span className="opacity-75">· {t(ciclo.name)} ({ciclo.grado === 'medio' ? t('grado medio') : t('grado superior')})</span></>;
        return modulo.live
          ? <Link key={modulo.slug} href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/20">{txt} →</Link>
          : <span key={modulo.slug} className="rounded-full bg-white/10 px-3 py-1 text-sm">{txt}</span>;
      })}
    </div>
  );
}

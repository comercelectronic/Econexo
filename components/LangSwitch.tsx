'use client';
// Selector de idioma: lleva a la misma página en el otro idioma (/ca/… ↔ /es/…)
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, LANG_NAMES, type Lang } from '@/lib/i18n';

export function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname() || `/${lang}/`;
  const rest = path.replace(/^\/(ca|es)(?=\/|$)/, '') || '/';
  return (
    <div role="group" aria-label="Idioma / Idioma" className="flex overflow-hidden rounded-full border border-line text-xs font-bold">
      {LANGS.map((k) => (
        <Link key={k} href={`/${k}${rest}`} hrefLang={k} lang={k} aria-current={k === lang ? 'true' : undefined}
          className={`px-3 py-1.5 ${k === lang ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-mist'}`}>{LANG_NAMES[k]}</Link>
      ))}
    </div>
  );
}

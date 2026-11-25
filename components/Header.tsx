import Link from 'next/link';
import { Logo } from './Logo';
import { Today } from './Today';
import { LangSwitch } from './LangSwitch';
import { SITE } from '@/lib/site';
import { sectionHasContent } from '@/lib/content';
import { l, tr, type Lang } from '@/lib/i18n';

export function Header({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const nav = [{ href: l(lang, '/simuladores/'), label: t('Simuladores') }, { href: l(lang, '/aprender/'), label: t('Teoría') }, { href: l(lang, '/herramientas/'), label: t('Herramientas') }, ...(sectionHasContent(lang, 'actualidad') ? [{ href: l(lang, '/actualidad/'), label: t('Actualidad') }] : [])];
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy text-white/80 text-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5">
          <Today lang={lang} />
          <span className="hidden sm:inline">{t(SITE.tagline)}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={l(lang)} aria-label={`${SITE.name}, ${t('portada')}`}><Logo lang={lang} /></Link>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} />
          <Link href={l(lang, '/simuladores/')} className="hidden rounded-full bg-gradient-to-r from-[#e5483a] to-[#f08a24] px-4 py-2 text-sm font-bold text-white shadow hover:brightness-105 sm:block">{t('Juega a los simuladores')}</Link>
        </div>
      </div>
      <nav aria-label={t('Secciones')} className="border-t border-line">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 text-sm font-semibold text-navy [scrollbar-width:none]">
          {nav.map((n) => (
            <li key={n.href}><Link href={n.href} className="block whitespace-nowrap px-3 py-2.5 hover:text-teal">{n.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import { Logo } from './Logo';
import { Today } from './Today';
import { SITE } from '@/lib/site';

export function Header() {
  const nav = [{ href: '/actualidad/', label: 'Actualidad' }, { href: '/aprender/', label: 'Aprender' }, { href: '/simuladores/', label: 'Simuladores' }, { href: '/herramientas/', label: 'Herramientas' }];
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy text-white/80 text-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5">
          <Today />
          <span className="hidden sm:inline">{SITE.tagline}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="ECOyNEXO, portada"><Logo /></Link>
        <Link href="/aprender/" className="hidden rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-dark sm:block">Empieza a aprender</Link>
      </div>
      <nav aria-label="Secciones" className="border-t border-line">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 text-sm font-semibold text-navy [scrollbar-width:none]">
          {nav.map((n) => (
            <li key={n.href}><Link href={n.href} className="block whitespace-nowrap px-3 py-2.5 hover:text-teal">{n.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

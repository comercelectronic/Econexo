import Link from 'next/link';
import { Logo } from './Logo';
import { liveSections } from '@/lib/site';
import { Today } from './Today';

export function Header() {
  const nav = [...liveSections().map((s) => ({ href: `/${s.slug}/`, label: s.short || s.name })), { href: '/videos/', label: '▶ Vídeos' }, { href: '/herramientas/', label: 'Herramientas' }];
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy text-white/80 text-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5">
          <Today />
          <span className="hidden sm:inline">{'Información que se convierte en conocimiento'}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="ECONEXO, portada"><Logo /></Link>
        <Link href="/#newsletter" className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-dark">Newsletter</Link>
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

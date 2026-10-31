import Link from 'next/link';
import { Logo } from './Logo';
import { SECTIONS, SITE } from '@/lib/site';

const INFO: [string, string][] = [
  ['quienes-somos', 'Quiénes somos'], ['politica-editorial', 'Política editorial'], ['como-verificamos', 'Cómo verificamos la información'],
  ['correcciones', 'Política de correcciones'], ['publicidad', 'Publicidad y colaboraciones'], ['contacto', 'Contacto'],
  ['aviso-legal', 'Aviso legal'], ['privacidad', 'Privacidad'], ['cookies', 'Cookies']
];

export function Footer() {
  return (
    <footer className="mt-16 bg-navy text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo dark />
          <p className="mt-4 text-sm">{SITE.slogan}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">Secciones</h2>
          <ul className="space-y-1.5 text-sm">
            {SECTIONS.filter((s) => s.live).map((s) => <li key={s.slug}><Link className="hover:text-teal" href={`/${s.slug}/`}>{s.name}</Link></li>)}
            <li><Link className="hover:text-teal" href="/universo-cromo/">Universo CROMO</Link></li>
            <li><Link className="hover:text-teal" href="/herramientas/">Herramientas</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">Próximamente</h2>
          <ul className="space-y-1.5 text-sm text-white/60">{SECTIONS.filter((s) => !s.live).map((s) => <li key={s.slug}>{s.name}</li>)}</ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">ECONEXO</h2>
          <ul className="space-y-1.5 text-sm">{INFO.map(([slug, label]) => <li key={slug}><Link className="hover:text-teal" href={`/${slug}/`}>{label}</Link></li>)}</ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} ECONEXO. Los contenidos son informativos y educativos; no constituyen asesoramiento financiero personalizado.</p>
    </footer>
  );
}

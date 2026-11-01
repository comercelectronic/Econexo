import Link from 'next/link';
import { Logo } from './Logo';
import { SECTIONS, SITE } from '@/lib/site';
import { sectionHasContent } from '@/lib/content';

const INFO: [string, string][] = [
  ['quienes-somos', 'Quiénes somos'], ['politica-editorial', 'Política editorial'], ['como-verificamos', 'Cómo verificamos la información'],
  ['correcciones', 'Política de correcciones'], ['publicidad', 'Publicidad y colaboraciones'], ['contacto', 'Contacto'],
  ['aviso-legal', 'Aviso legal'], ['privacidad', 'Privacidad'], ['cookies', 'Cookies']
];

export function Footer() {
  return (
    <footer className="mt-28 bg-navy text-white/80">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-4" aria-hidden="true">
        <img src="/media/personajes/nexo-satisfecha.webp" alt="" className="-mt-20 h-28 w-auto rounded-t-3xl bg-white px-3 pt-2" loading="lazy" />
        <img src="/media/personajes/eco-contento.webp" alt="" className="-mt-20 h-28 w-auto rounded-t-3xl bg-white px-3 pt-2" loading="lazy" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo dark />
          <p className="mt-4 text-sm">{SITE.slogan}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">Aprende</h2>
          <ul className="space-y-1.5 text-sm">
            {[['/aprender/', 'Aprender'], ...(sectionHasContent('actualidad') ? [['/actualidad/', 'Actualidad']] : []), ['/simuladores/', 'Simuladores'], ['/herramientas/', 'Herramientas'], ['/eco-y-nexo/', 'ECO y NEXO']].map(([h, n]) => <li key={h}><Link className="hover:text-teal" href={h}>{n}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">Recursos</h2>
          <ul className="space-y-1.5 text-sm">{SECTIONS.filter((s) => s.live && s.slug !== 'actualidad' && sectionHasContent(s.slug)).map((s) => <li key={s.slug}><Link className="hover:text-teal" href={`/${s.slug}/`}>{s.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-white">ECOyNEXO</h2>
          <ul className="space-y-1.5 text-sm">{INFO.map(([slug, label]) => <li key={slug}><Link className="hover:text-teal" href={`/${slug}/`}>{label}</Link></li>)}</ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">© {new Date().getFullYear()} ECOyNEXO. Los contenidos son informativos y educativos; no constituyen asesoramiento financiero personalizado.</p>
    </footer>
  );
}

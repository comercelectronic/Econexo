import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { notFound } from 'next/navigation';
import { CICLOS, cicloBySlug, lecciones } from '@/lib/estudios';

export const dynamicParams = false;
export const generateStaticParams = () => CICLOS.map((c) => ({ ciclo: c.slug }));
type Props = { params: Promise<{ ciclo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = cicloBySlug((await params).ciclo);
  return c ? { title: `${c.name} (${c.grado === 'medio' ? 'grado medio' : 'grado superior'})`, description: c.resumen, alternates: { canonical: `/aprender/${c.slug}/` } } : {};
}

export default async function CicloPage({ params }: Props) {
  const c = cicloBySlug((await params).ciclo);
  if (!c) notFound();
  return (
    <div className="py-10">
      <PageHero kicker={<><Link href="/aprender/">Aprender</Link> · {c.grado === 'medio' ? 'Grado medio' : 'Grado superior'}</>} title={c.name} intro={c.resumen} nexo="explicando" dice={{ quien: 'nexo', texto: 'Elige un módulo y te lo explico paso a paso.' }} />
      {c.modulos.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {c.modulos.map((m) => m.live ? (
            <Link key={m.slug} href={`/aprender/${c.slug}/${m.slug}/`} className="rounded-2xl border-2 border-teal p-5 hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wide text-teal">Disponible · {lecciones(c.slug, m.slug).length} lecciones · simulador</p>
              <h2 className="mt-1 text-xl font-extrabold text-navy">{m.name}</h2>
              {m.resumen && <p className="mt-2 text-sm text-muted">{m.resumen}</p>}
            </Link>
          ) : (
            <div key={m.slug} className="rounded-2xl border border-line p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted">Próximamente</p><h2 className="mt-1 text-lg font-bold text-muted">{m.name}</h2></div>
          ))}
        </div>
      ) : <p className="mt-8 rounded-xl bg-mist p-8 text-muted">Estamos preparando los módulos de este ciclo.</p>}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = { title: 'Herramientas gratuitas', description: 'Calculadoras y utilidades gratuitas de marketing, rentabilidad, analítica y finanzas personales.', alternates: { canonical: '/herramientas/' } };

export default function Tools() {
  return (
    <div className="py-10">
      <header className="border-b-2 border-navy pb-4">
        <h1 className="text-4xl font-extrabold text-navy">Herramientas</h1>
        <p className="mt-2 max-w-3xl text-muted">Calculadoras propias, gratuitas y sin registro. Cada una explica su fórmula, un ejemplo y sus limitaciones. Los cálculos se hacen en tu navegador: no guardamos los datos que introduces.</p>
      </header>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-2xl border border-line p-6 hover:border-teal hover:shadow-md">
            <span className="text-xs font-bold uppercase tracking-wide text-teal">{t.area}</span>
            <h2 className="mt-1 text-xl font-bold text-navy">{t.name}</h2>
            <p className="mt-2 text-muted">{t.short}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { Avatar } from '@/components/Characters';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = { title: 'Herramientas gratuitas', description: 'Calculadoras y utilidades gratuitas de marketing, rentabilidad, analítica y finanzas personales.', alternates: { canonical: '/herramientas/' } };

export default function Tools() {
  return (
    <div className="py-10">
      <PageHero title="Herramientas" intro="Calculadoras propias, gratuitas y sin registro. Cada una explica su fórmula, un ejemplo y sus limitaciones. Los cálculos se hacen en tu navegador: no guardamos los datos que introduces." eco="hablando" nexo="satisfecha" dice={{ quien: 'nexo', texto: 'Calcula antes de decidir. ECO, ¿me oyes?' }} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-2xl border border-line p-6 hover:border-teal hover:shadow-md">
            <div className="flex items-start gap-4">
              <Avatar id={t.dialogo?.[1]?.quien || 'nexo'} gesto={t.dialogo?.[1]?.gesto} className="h-14 w-14" />
              <div><span className="text-xs font-bold uppercase tracking-wide text-teal">{t.area}</span>
                <h2 className="mt-1 text-xl font-bold text-navy">{t.name}</h2>
                <p className="mt-2 text-muted">{t.short}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

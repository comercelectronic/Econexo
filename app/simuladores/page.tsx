import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { SIMULADORES, liveModules } from '@/lib/estudios';

export const metadata: Metadata = { title: 'Simuladores y juegos para practicar', description: 'Juegos y simuladores para practicar lo que aprendes en los ciclos de Comercio y Marketing.', alternates: { canonical: '/simuladores/' } };

export default function Simuladores() {
  return (
    <div className="py-10">
      <PageHero title="Simuladores" intro="Aprender haciendo: cada módulo tendrá su simulador o juego para aplicar lo que aprendes con casos y decisiones reales." eco="senalando" nexo="satisfecha" dice={{ quien: 'nexo', texto: 'Aquí equivocarse es gratis. Equivocarse en una empresa real, no tanto.' }} />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {SIMULADORES.map((s) => {
          const mods = liveModules().filter(({ modulo }) => modulo.simulador === s.id);
          return (
            <article key={s.id} className="rounded-2xl bg-navy p-6 text-white">
              <h2 className="text-2xl font-extrabold">{s.name}</h2>
              <p className="mt-2 text-white/80">{s.desc}</p>
              <p className="mt-3 text-sm text-white/70">Para: {mods.map(({ ciclo, modulo }) => <Link key={modulo.slug} href={`/aprender/${ciclo.slug}/${modulo.slug}/`} className="underline">{modulo.name} ({ciclo.name})</Link>)} · Idiomas: {s.idiomas}</p>
              <a href={s.url} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">Jugar →</a>
            </article>
          );
        })}
        <article className="rounded-2xl border-2 border-dashed border-line p-6 text-muted"><h2 className="text-xl font-extrabold">Próximamente</h2><p className="mt-2">Simuladores de punto de venta, almacén, atención al cliente y comercio internacional.</p></article>
      </div>
    </div>
  );
}

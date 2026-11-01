import type { Metadata } from 'next';
import { StudyFinder } from '@/components/StudyFinder';
import { CICLOS, lecciones } from '@/lib/estudios';

export const metadata: Metadata = {
  title: 'Qué quieres estudiar: ciclos de Comercio y Marketing',
  description: 'Lecciones, tiras cómicas, tests y simuladores para los ciclos de grado medio y superior de Comercio y Marketing.',
  alternates: { canonical: '/estudiar/' }
};

export default function Estudiar() {
  const data = CICLOS.map((c) => ({ ...c, modulos: c.modulos.map((m) => ({ ...m, lecciones: m.live ? lecciones(c.slug, m.slug).length : 0 })) }));
  return (
    <div className="py-10">
      <h1 className="text-4xl font-extrabold text-navy">¿Qué quieres estudiar?</h1>
      <p className="mt-2 max-w-3xl text-muted">Elige tu ciclo y tu módulo. Cada módulo tiene lecciones con tira cómica, explicación, test de autoevaluación y un simulador para practicar lo que aprendes.</p>
      <div className="mt-6"><StudyFinder ciclos={data} /></div>
    </div>
  );
}

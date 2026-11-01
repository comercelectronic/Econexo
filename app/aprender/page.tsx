import type { Metadata } from 'next';
import { PageHero } from '@/components/Mascotas';
import { StudyFinder } from '@/components/StudyFinder';
import { CICLOS, lecciones } from '@/lib/estudios';

export const metadata: Metadata = {
  title: 'Qué quieres aprender: ciclos de Comercio y Marketing',
  description: 'Lecciones, tiras cómicas, tests y simuladores para los ciclos de grado medio y superior de Comercio y Marketing.',
  alternates: { canonical: '/aprender/' }
};

export default function Aprender() {
  const data = CICLOS.map((c) => ({ ...c, modulos: c.modulos.map((m) => ({ ...m, lecciones: m.live ? lecciones(c.slug, m.slug).length : 0 })) }));
  return (
    <div className="py-10">
      <PageHero title="¿Qué quieres aprender?" intro="Elige tu ciclo y tu módulo. Cada módulo tiene lecciones con tira cómica, explicación, test de autoevaluación y un simulador para practicar lo que aprendes." nexo="explicando" eco="contento" dice={{ quien: 'eco', texto: '¡Yo ya me he apuntado a todo… sin leer nada!' }} />
      <div className="mt-8"><StudyFinder ciclos={data} /></div>
    </div>
  );
}

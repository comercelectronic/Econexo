import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { StudyFinder } from '@/components/StudyFinder';
import { ciclosLive, lecciones } from '@/lib/estudios';
import { isLang, l, tr } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  return { title: t('Qué quieres aprender: ciclos de Comercio y Marketing'), description: t('Lecciones, tiras cómicas, tests y simuladores para los ciclos de grado medio y superior de Comercio y Marketing.'),
    alternates: { canonical: l(lang, '/aprender/'), languages: { ca: l('ca', '/aprender/'), es: l('es', '/aprender/') } } };
}

export default async function Aprender({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  const data = ciclosLive().map((c) => ({ ...c, modulos: c.modulos.map((m) => ({ ...m, lecciones: lecciones(lang, c.slug, m.slug).length })) }));
  return (
    <div className="py-10">
      <PageHero title={t('¿Qué quieres aprender?')} intro={t('Elige tu ciclo y tu módulo. Cada módulo tiene lecciones con tira cómica, explicación, test de autoevaluación y un simulador para practicar lo que aprendes.')} nexo="explicando" eco="contento" dice={{ quien: 'eco', texto: t('¡Yo ya me he apuntado a todo… sin leer nada!') }} />
      <div className="mt-8"><StudyFinder ciclos={data} /></div>
    </div>
  );
}

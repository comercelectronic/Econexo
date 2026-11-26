import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { SIMULADORES } from '@/lib/estudios';
import { SimCard } from '@/components/SimCard';
import { isLang, l, tr } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  return { title: t('Simuladores y juegos para practicar'), description: t('Juegos y simuladores para practicar lo que aprendes en los ciclos de Comercio y Marketing.'), alternates: { canonical: l(lang, '/simuladores/'), languages: { ca: l('ca', '/simuladores/'), es: l('es', '/simuladores/') } } };
}

export default async function Simuladores({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <div className="py-10">
      <PageHero title={t('Simuladores')} intro={t('Aprender haciendo: aplica lo que aprendes con casos y decisiones reales.')} eco="senalando" nexo="satisfecha" dice={{ quien: 'nexo', texto: t('Aquí equivocarse es gratis. Equivocarse en una empresa real, no tanto.') }} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {SIMULADORES.map((s, i) => <SimCard key={s.id} s={s} lang={lang} i={i} />)}
      </div>
    </div>
  );
}

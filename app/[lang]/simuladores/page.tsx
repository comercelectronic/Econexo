import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { SIMULADORES, simUrl } from '@/lib/estudios';
import { SimModulos } from '@/components/SimModulos';
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
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {SIMULADORES.map((s) => {
          return (
            <article key={s.id} className="overflow-hidden rounded-2xl bg-navy text-white shadow-lg">
              {s.img && <a href={simUrl(s, lang)} target="_blank" rel="noopener"><img src={s.img} alt={t('Captura de {0}', s.name)} loading="lazy" className="aspect-video w-full object-cover object-top" /></a>}
              <div className="p-6">
                {s.lema && <p className="text-xs font-bold uppercase tracking-widest text-[#f8b62d]">{t(s.lema)}</p>}
                <h2 className="text-2xl font-extrabold">{s.name}</h2>
                <p className="mt-2 text-white/80">{t(s.desc)}</p>
                <SimModulos s={s} lang={lang} className="mt-4" />
                <p className="mt-3 text-sm text-white/70">{t('Idiomas')}: {t(s.idiomas)}</p>
                <a href={simUrl(s, lang)} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-gradient-to-r from-[#e5483a] to-[#f08a24] px-5 py-2.5 font-bold">{t('Jugar →')}</a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

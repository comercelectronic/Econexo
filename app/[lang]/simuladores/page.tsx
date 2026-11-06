import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { SIMULADORES, liveModules, simUrl } from '@/lib/estudios';
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
          const mods = liveModules().filter(({ modulo }) => modulo.simulador === s.id);
          return (
            <article key={s.id} className="rounded-2xl bg-navy p-6 text-white">
              <h2 className="text-2xl font-extrabold">{s.name}</h2>
              <p className="mt-2 text-white/80">{t(s.desc)}</p>
              <p className="mt-3 text-sm text-white/70">{(mods.length > 0 || s.modulos) && <>{t('Para')}: </>}{mods.map(({ ciclo, modulo }) => <Link key={modulo.slug} href={l(lang, `/aprender/${ciclo.slug}/${modulo.slug}/`)} className="underline">{t(modulo.name)} ({t(ciclo.name)})</Link>)}{s.modulos && t(s.modulos)}{(mods.length > 0 || s.modulos) && ' · '}{t('Idiomas')}: {t(s.idiomas)}</p>
              <a href={simUrl(s, lang)} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold hover:bg-teal-dark">{t('Jugar →')}</a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

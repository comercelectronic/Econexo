import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/Mascotas';
import { notFound } from 'next/navigation';
import { ciclosLive, lecciones } from '@/lib/estudios';
import { LANGS, isLang, l, tr } from '@/lib/i18n';

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => ciclosLive().map((c) => ({ lang, ciclo: c.slug })));
type Props = { params: Promise<{ lang: string; ciclo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ciclo } = await params;
  const c = ciclosLive().find((x) => x.slug === ciclo);
  if (!c || !isLang(lang)) return {};
  const t = tr(lang);
  return { title: `${t(c.name)} (${c.grado === 'medio' ? t('grado medio') : t('grado superior')})`, description: t(c.resumen), alternates: { canonical: l(lang, `/aprender/${c.slug}/`), languages: { ca: l('ca', `/aprender/${c.slug}/`), es: l('es', `/aprender/${c.slug}/`) } } };
}

export default async function CicloPage({ params }: Props) {
  const { lang, ciclo } = await params;
  const c = ciclosLive().find((x) => x.slug === ciclo);
  if (!c || !isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <div className="py-10">
      <PageHero kicker={<><Link href={l(lang, '/aprender/')}>{t('Aprender')}</Link> · {c.grado === 'medio' ? t('Grado medio') : t('Grado superior')}</>} title={t(c.name)} intro={t(c.resumen)} nexo="explicando" dice={{ quien: 'nexo', texto: t('Elige un módulo y te lo explico paso a paso.') }} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {c.modulos.map((m) => (
          <Link key={m.slug} href={l(lang, `/aprender/${c.slug}/${m.slug}/`)} className="rounded-2xl border-2 border-teal p-5 hover:shadow-md">
            <p className="text-xs font-bold uppercase tracking-wide text-teal">{t('Disponible · {0} lecciones · simulador', lecciones(lang, c.slug, m.slug).length)}</p>
            <h2 className="mt-1 text-xl font-extrabold text-navy">{t(m.name)}</h2>
            {m.resumen && <p className="mt-2 text-sm text-muted">{t(m.resumen)}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

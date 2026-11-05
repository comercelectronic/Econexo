import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { Avatar } from '@/components/Characters';
import { TOOLS } from '@/lib/tools';
import { isLang, l, tr } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  return { title: t('Herramientas gratuitas'), description: t('Calculadoras y utilidades gratuitas de marketing, ventas, rentabilidad, analítica y finanzas.'), alternates: { canonical: l(lang, '/herramientas/'), languages: { ca: l('ca', '/herramientas/'), es: l('es', '/herramientas/') } } };
}

export default async function Tools({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  return (
    <div className="py-10">
      <PageHero title={t('Herramientas')} intro={t('Calculadoras propias, gratuitas y sin registro. Cada una explica su fórmula, un ejemplo y sus limitaciones. Los cálculos se hacen en tu navegador: no guardamos los datos que introduces.')} eco="hablando" nexo="satisfecha" dice={{ quien: 'nexo', texto: t('Calcula antes de decidir. ECO, ¿me oyes?') }} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {TOOLS.map((x) => (
          <Link key={x.slug} href={l(lang, `/herramientas/${x.slug}/`)} className="rounded-2xl border border-line p-6 hover:border-teal hover:shadow-md">
            <div className="flex items-start gap-4">
              <Avatar id={x.dialogo?.[1]?.quien || 'nexo'} gesto={x.dialogo?.[1]?.gesto} className="h-14 w-14" />
              <div><span className="text-xs font-bold uppercase tracking-wide text-teal">{t(x.area)}</span>
                <h2 className="mt-1 text-xl font-bold text-navy">{t(x.name)}</h2>
                <p className="mt-2 text-muted">{t(x.short)}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

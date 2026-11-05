import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator } from '@/components/Calculators';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { TOOLS, toolBySlug } from '@/lib/tools';
import { LANGS, isLang, l, tr } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import { published } from '@/lib/content';
import { videosForTool } from '@/lib/videos';
import { VideoCard } from '@/components/VideoCard';
import { Dialogue } from '@/components/Dialogue';

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => TOOLS.map((x) => ({ lang, tool: x.slug })));
type Props = { params: Promise<{ lang: string; tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tool } = await params;
  const x = toolBySlug(tool);
  if (!x || !isLang(lang)) return {};
  const t = tr(lang);
  return { title: `${t(x.name)} ${t('gratis')}`, description: t(x.intro), alternates: { canonical: l(lang, `/herramientas/${x.slug}/`), languages: { ca: l('ca', `/herramientas/${x.slug}/`), es: l('es', `/herramientas/${x.slug}/`) } } };
}

export default async function ToolPage({ params }: Props) {
  const { lang, tool } = await params;
  const x = toolBySlug(tool);
  if (!x || !isLang(lang)) notFound();
  const t = tr(lang);
  const vids = videosForTool(lang, x.slug);
  const guide = x.guide && published(lang).some((a) => a.url === x.guide) ? x.guide : undefined;
  return (
    <div className="mx-auto max-w-4xl py-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: t(x.name), url: `${SITE.url}${l(lang, `/herramientas/${x.slug}/`)}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, inLanguage: lang }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: x.faq.map((f) => ({ '@type': 'Question', name: t(f.p), acceptedAnswer: { '@type': 'Answer', text: t(f.r) } })) }} />
      <p className="text-sm font-semibold text-teal"><Link href={l(lang, '/herramientas/')}>{t('Herramientas')}</Link> · {t(x.area)}</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">{t(x.name)}</h1>
      <p className="mt-3 text-lg text-muted">{t(x.intro)}</p>
      {x.dialogo && <div className="mt-6"><Dialogue lines={x.dialogo} lang={lang} title="Antes de calcular" compact /></div>}
      <div className="mt-8"><Calculator slug={x.slug} /></div>
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div><h2 className="text-xl font-extrabold text-navy">{t('Fórmula')}</h2><p className="mt-2">{t(x.formula)}</p></div>
        <div><h2 className="text-xl font-extrabold text-navy">{t('Ejemplo')}</h2><p className="mt-2">{t(x.example)}</p></div>
      </section>
      <section className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="font-bold text-amber-900">{t('Limitaciones')}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">{x.limits.map((m) => <li key={m}>{t(m)}</li>)}</ul>
      </section>
      {guide && <p className="mt-6"><Link href={l(lang, guide)} className="font-semibold text-blue underline">{t('Lee la guía completa →')}</Link></p>}
      <section className="mt-10"><h2 className="text-2xl font-extrabold text-navy">{t('Preguntas frecuentes')}</h2>
        {x.faq.map((f) => <details key={f.p} className="mt-3 rounded-xl border border-line p-4"><summary className="cursor-pointer font-bold text-navy">{t(f.p)}</summary><p className="mt-2 text-muted">{t(f.r)}</p></details>)}</section>
      {vids.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-navy">▶ {t('Míralo con ECO y NEXO')}</h2><div className="grid gap-4 md:grid-cols-2">{vids.map((v) => <VideoCard key={v.slug} v={v} lang={lang} />)}</div></section>}
      <AdSlot slot={`herramienta-${x.slug}`} />
    </div>
  );
}

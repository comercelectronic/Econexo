import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator } from '@/components/Calculators';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { TOOLS, toolBySlug } from '@/lib/tools';
import { SITE } from '@/lib/site';
import { videosForTool } from '@/lib/videos';
import { VideoCard } from '@/components/VideoCard';

export const dynamicParams = false;
export const generateStaticParams = () => TOOLS.map((t) => ({ tool: t.slug }));
type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = toolBySlug((await params).tool);
  return t ? { title: `${t.name} gratis`, description: t.intro, alternates: { canonical: `/herramientas/${t.slug}/` } } : {};
}

export default async function ToolPage({ params }: Props) {
  const t = toolBySlug((await params).tool);
  if (!t) notFound();
  return (
    <div className="mx-auto max-w-4xl py-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, url: `${SITE.url}/herramientas/${t.slug}/`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, inLanguage: 'es' }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })) }} />
      <p className="text-sm font-semibold text-teal"><Link href="/herramientas/">Herramientas</Link> · {t.area}</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">{t.name}</h1>
      <p className="mt-3 text-lg text-muted">{t.intro}</p>
      <div className="mt-8"><Calculator slug={t.slug} /></div>
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div><h2 className="text-xl font-extrabold text-navy">Fórmula</h2><p className="mt-2">{t.formula}</p></div>
        <div><h2 className="text-xl font-extrabold text-navy">Ejemplo</h2><p className="mt-2">{t.example}</p></div>
      </section>
      <section className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="font-bold text-amber-900">Limitaciones</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">{t.limits.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>
      {t.guide && <p className="mt-6"><Link href={t.guide} className="font-semibold text-blue underline">Lee la guía completa →</Link></p>}
      <section className="mt-10"><h2 className="text-2xl font-extrabold text-navy">Preguntas frecuentes</h2>
        {t.faq.map((f) => <details key={f.p} className="mt-3 rounded-xl border border-line p-4"><summary className="cursor-pointer font-bold text-navy">{f.p}</summary><p className="mt-2 text-muted">{f.r}</p></details>)}</section>
      {videosForTool(t.slug).length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl font-extrabold text-navy">▶ Míralo con CROMO</h2><div className="grid gap-4 md:grid-cols-2">{videosForTool(t.slug).map((v) => <VideoCard key={v.slug} v={v} />)}</div></section>}
      <AdSlot slot={`herramienta-${t.slug}`} />
    </div>
  );
}

// Página de una sección editorial (/ca/finanzas/) o de una página institucional (/ca/aviso-legal/)
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSlot } from '@/components/AdSlot';
import { bySection, pages, published, sectionHasContent } from '@/lib/content';
import { liveSections, sectionBySlug } from '@/lib/site';
import { LANGS, isLang, l, tr } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => [...liveSections().filter((s) => sectionHasContent(lang, s.slug)).map((s) => ({ lang, seccion: s.slug })), ...pages(lang).map((p) => ({ lang, seccion: p.slug }))]);
}

const HERO: Record<string, { nexo?: string; eco?: string; dice: { quien: string; texto: string } }> = {
  actualidad: { nexo: 'explicando', eco: 'sorprendido', dice: { quien: 'eco', texto: '¡Última hora! Bueno… me lo ha contado un primo.' } },
  casos: { nexo: 'esceptica', eco: 'avergonzado', dice: { quien: 'nexo', texto: 'Aprende de los errores de otros. Los de ECO ya los conoces.' } },
  finanzas: { nexo: 'explicando', eco: 'confuso', dice: { quien: 'nexo', texto: 'Primero aprende. Después invierte.' } },
  'inteligencia-artificial': { nexo: 'esceptica', eco: 'contento', dice: { quien: 'eco', texto: '¡Con IA lo petamos!' } },
  default: { nexo: 'explicando', eco: 'contento', dice: { quien: 'nexo', texto: 'Aquí lo explicamos paso a paso.' } }
};
type Props = { params: Promise<{ lang: string; seccion: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, seccion } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  const s = sectionBySlug(seccion), p = pages(lang).find((x) => x.slug === seccion);
  return { title: s ? t(s.name) : p?.titulo, description: s ? t(s.desc) : p?.descripcion, alternates: { canonical: l(lang, `/${seccion}/`), languages: { ca: l('ca', `/${seccion}/`), es: l('es', `/${seccion}/`) } } };
}

export default async function SectionPage({ params }: Props) {
  const { lang, seccion } = await params;
  if (!isLang(lang)) notFound();
  const t = tr(lang);
  const page = pages(lang).find((x) => x.slug === seccion);
  if (page)
    return (
      <article className="mx-auto max-w-3xl py-10">
        <h1 className="text-4xl font-extrabold text-navy">{page.titulo}</h1>
        {page.actualizado && <p className="mt-2 text-sm text-muted">{t('Última actualización')}: {page.actualizado}</p>}
        <div className="prose-ec mt-8" dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
    );
  const s = sectionBySlug(seccion);
  if (!s || !s.live || !sectionHasContent(lang, seccion)) notFound();
  const list = seccion === 'actualidad' ? published(lang) : bySection(lang, seccion);
  const used = new Set(list.map((a) => a.subseccion));
  const hero = HERO[s.slug] || HERO.default;
  return (
    <div className="py-10">
      <PageHero title={t(s.name)} intro={t(s.desc)} nexo={hero.nexo} eco={hero.eco} dice={{ quien: hero.dice.quien, texto: t(hero.dice.texto) }}>
        {s.subs.some(([k]) => used.has(k)) && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {s.subs.filter(([k]) => used.has(k)).map(([k, n]) => <li key={k}><Link href={l(lang, `/${s.slug}/${k}/`)} className="block rounded-full border border-line px-3 py-1 text-sm font-semibold text-navy hover:border-teal hover:text-teal">{t(n)}</Link></li>)}
          </ul>
        )}
      </PageHero>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {list.map((a, i) => <div key={a.url} className={i === 0 ? 'md:col-span-3' : ''}><ArticleCard a={a} lang={lang} variant={i === 0 ? 'hero' : 'card'} /></div>)}
      </div>
      <AdSlot slot={`seccion-${seccion}`} />
    </div>
  );
}

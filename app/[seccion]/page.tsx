// Pàgina d'una secció editorial (/marketing-digital/) o d'una pàgina institucional (/aviso-legal/)
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/Mascotas';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSlot } from '@/components/AdSlot';
import { bySection, byType, pages, sectionHasContent } from '@/lib/content';
import { liveSections, sectionBySlug } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return [...liveSections().filter((s) => sectionHasContent(s.slug)).map((s) => ({ seccion: s.slug })), ...pages().map((p) => ({ seccion: p.slug }))];
}

const HERO: Record<string, { nexo?: string; eco?: string; dice: { quien: string; texto: string } }> = {
  actualidad: { nexo: 'explicando', eco: 'sorprendido', dice: { quien: 'eco', texto: '¡Última hora! Bueno… me lo ha contado un primo.' } },
  casos: { nexo: 'esceptica', eco: 'avergonzado', dice: { quien: 'nexo', texto: 'Aprende de los errores de otros. Los de ECO ya los conoces.' } },
  finanzas: { nexo: 'explicando', eco: 'confuso', dice: { quien: 'nexo', texto: 'Primero aprende. Después invierte.' } },
  'inteligencia-artificial': { nexo: 'esceptica', eco: 'contento', dice: { quien: 'eco', texto: '¡Con IA lo petamos!' } },
  default: { nexo: 'explicando', eco: 'contento', dice: { quien: 'nexo', texto: 'Aquí lo explicamos paso a paso.' } }
};
type Props = { params: Promise<{ seccion: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seccion } = await params;
  const s = sectionBySlug(seccion), p = pages().find((x) => x.slug === seccion);
  const title = s ? s.name : p?.titulo;
  return { title, description: s ? s.desc : p?.descripcion, alternates: { canonical: `/${seccion}/` } };
}

export default async function SectionPage({ params }: Props) {
  const { seccion } = await params;
  const page = pages().find((x) => x.slug === seccion);
  if (page)
    return (
      <article className="mx-auto max-w-3xl py-10">
        <h1 className="text-4xl font-extrabold text-navy">{page.titulo}</h1>
        {page.actualizado && <p className="mt-2 text-sm text-muted">Última actualización: {page.actualizado}</p>}
        <div className="prose-ec mt-8" dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
    );
  const s = sectionBySlug(seccion);
  if (!s || !s.live) notFound();
  const list = seccion === 'actualidad' ? byType('noticia') : bySection(seccion);
  const used = new Set(list.map((a) => a.subseccion));
  return (
    <div className="py-10">
      <PageHero title={s.name} intro={s.desc} {...HERO[s.slug] || HERO.default}>
        {s.subs.some(([k]) => used.has(k)) && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {s.subs.filter(([k]) => used.has(k)).map(([k, n]) => <li key={k}><Link href={`/${s.slug}/${k}/`} className="block rounded-full border border-line px-3 py-1 text-sm font-semibold text-navy hover:border-teal hover:text-teal">{n}</Link></li>)}
          </ul>
        )}
      </PageHero>
      {list.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {list.map((a, i) => <div key={a.url} className={i === 0 ? 'md:col-span-3' : ''}><ArticleCard a={a} variant={i === 0 ? 'hero' : 'card'} /></div>)}
        </div>
      ) : <p className="mt-8 rounded-xl bg-mist p-8 text-muted">Muy pronto publicaremos los primeros contenidos de esta sección. Mientras tanto, prueba nuestras <Link href="/herramientas/" className="text-blue underline">herramientas</Link> o suscríbete a la <Link href="/#newsletter" className="text-blue underline">newsletter</Link>.</p>}
      <AdSlot slot={`seccion-${seccion}`} />
    </div>
  );
}

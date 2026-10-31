import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { published, bySection, byType, type Article } from '@/lib/content';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { videos } from '@/lib/videos';
import { VideoCard } from '@/components/VideoCard';
import { UNIVERSE } from '@/lib/cromo';

const Block = ({ n, kicker, title, href, children }: { n: string; kicker: string; title: string; href?: string; children: React.ReactNode }) => (
  <section className="mt-14">
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-navy pb-2">
      <div><p className="text-xs font-bold tracking-widest text-teal">{n} · {kicker.toUpperCase()}</p><h2 className="text-2xl font-extrabold text-navy">{title}</h2></div>
      {href && <Link href={href} className="shrink-0 text-sm font-semibold text-blue hover:underline">Ver todo →</Link>}
    </div>
    {children}
  </section>
);

export default function Home() {
  const all = published();
  // Cada article surt una sola vegada a la portada: cada bloc agafa els que encara no s'han mostrat
  const shown = new Set<string>();
  const take = (list: Article[], n: number) => { const out = list.filter((a) => !shown.has(a.url)).slice(0, n); out.forEach((a) => shown.add(a.url)); return out; };
  const [hero] = take([...all.filter((a) => a.destacado), ...all], 1);
  const news = byType('noticia');
  const latest = take(news.length ? news : all.filter((a) => a.tipo !== 'caso'), news.length ? 6 : 3);
  const finance = take(bySection('finanzas'), 3);
  const mkt = take([...bySection('marketing-digital'), ...bySection('inteligencia-artificial')].sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha)), 4);
  const learn = take(all.filter((a) => a.tipo === 'guia'), 4);
  const vids = videos().slice(0, 3);
  const analysis = take(all.filter((a) => a.tipo === 'caso' || a.tipo === 'analisis'), 6);
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, description: SITE.description, inLanguage: 'es' }} />
      <h1 className="sr-only">{SITE.name}: {SITE.claim}</h1>
      <section className="mt-8">
        <p className="mb-3 text-xs font-bold tracking-widest text-teal">01 · ACTUALIDAD</p>
        {hero ? <ArticleCard a={hero} variant="hero" /> : <div className="rounded-2xl bg-mist p-10 text-muted">Todavía no hay artículos publicados.</div>}
      </section>

      {latest.length > 0 && (
        <Block n="02" kicker={news.length ? 'Últimas noticias' : 'Lo último'} title={news.length ? 'Actualidad en directo' : 'Recién publicado'} href={news.length ? '/actualidad/' : undefined}>
          <div className="grid gap-5 md:grid-cols-3">{latest.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      {finance.length > 0 && (
        <Block n="03" kicker="Finanzas" title="Lo que necesitas saber sobre tu dinero" href="/finanzas/">
          <div className="grid gap-5 md:grid-cols-3">{finance.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      <AdSlot slot="home-1" />

      {mkt.length > 0 && (
        <Block n="04" kicker="Marketing y tecnología" title="Las herramientas que están transformando los negocios" href="/marketing-digital/">
          <div className="grid gap-5 md:grid-cols-2">{mkt.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      {learn.length > 0 && (
        <Block n="05" kicker="Aprende" title="Guías y tutoriales" href="/formacion/">
          <div className="grid gap-5 md:grid-cols-3">{learn.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      <Block n="06" kicker="Herramientas" title="Resuelve tus cálculos gratis" href="/herramientas/">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-xl border border-line p-5 hover:border-teal hover:shadow-md">
              <span className="text-xs font-bold uppercase tracking-wide text-teal">{t.area}</span>
              <h3 className="mt-1 font-bold text-navy">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{t.short}</p>
            </Link>
          ))}
        </div>
      </Block>

      <Block n="07" kicker="Universo CROMO" title="Aprende con CROMO y el Profe Suricata" href="/universo-cromo/">
        <Link href="/universo-cromo/" className="grid items-center gap-6 overflow-hidden rounded-2xl bg-navy text-white md:grid-cols-[1fr_auto]">
          <div className="p-6 md:p-8">
            <p className="font-display text-2xl font-extrabold md:text-3xl">{UNIVERSE.claim}</p>
            <p className="mt-2 max-w-xl text-white/75">CROMO comete todos los errores de marketing, economía y tecnología. El Profe Suricata le explica lo que de verdad funciona. Tú te ríes… y aprendes.</p>
            <span className="mt-4 inline-block rounded-lg bg-cromo px-4 py-2.5 font-semibold">Descubre el Universo CROMO →</span>
          </div>
          <div className="flex items-end justify-center gap-2 px-6 pt-4 md:pt-6">
            <img src="/media/personajes/cromo-principal.webp" alt="CROMO" className="h-48 w-auto md:h-60" />
            <img src="/media/personajes/profe-principal.webp" alt="Profe Suricata" className="h-44 w-auto rounded-t-xl md:h-56" />
          </div>
        </Link>
        {vids.length > 0 && <div className="mt-5 grid gap-5 md:grid-cols-3">{vids.map((v) => <VideoCard key={v.slug} v={v} />)}</div>}
      </Block>

      {analysis.length > 0 && (
        <Block n="08" kicker="Análisis" title="Más allá de la noticia: casos reales" href="/casos/">
          <div className="grid gap-5 md:grid-cols-3">{analysis.map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      <div className="mt-14"><Newsletter /></div>
    </>
  );
}

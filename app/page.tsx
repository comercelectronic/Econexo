import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { JsonLd } from '@/components/JsonLd';
import { Tira } from '@/components/Tira';
import { published } from '@/lib/content';
import { CICLOS, SIMULADORES, lecciones, liveModules } from '@/lib/estudios';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';

const Block = ({ kicker, title, href, children }: { kicker: string; title: string; href?: string; children: React.ReactNode }) => (
  <section className="mt-14">
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-navy pb-2">
      <div><p className="text-xs font-bold tracking-widest text-teal">{kicker.toUpperCase()}</p><h2 className="text-2xl font-extrabold text-navy">{title}</h2></div>
      {href && <Link href={href} className="shrink-0 text-sm font-semibold text-blue hover:underline">Ver todo →</Link>}
    </div>
    {children}
  </section>
);

export default function Home() {
  const mods = liveModules();
  const first = mods[0], firstLessons = first ? lecciones(first.ciclo.slug, first.modulo.slug) : [];
  const sample = firstLessons.find((l) => l.id === 'L_metriques') || firstLessons[0];
  const all = published(), news = all.filter((a) => a.tipo === 'noticia').slice(0, 3);
  const reading = all.filter((a) => a.tipo !== 'noticia' && a.modulos.length).slice(0, 3);
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, description: SITE.description, inLanguage: 'es' }} />
      <section className="mt-8 grid items-center gap-8 rounded-3xl bg-navy p-8 text-white md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal">Comercio y Marketing · FP grado medio y superior</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Aprende tu ciclo con lecciones claras, tiras cómicas y simuladores</h1>
          <p className="mt-4 max-w-xl text-white/80">Elige tu ciclo y tu módulo. En cada lección, ECO y NEXO te lo presentan en una tira, lo explicamos paso a paso, te pones a prueba con un test y lo practicas en un simulador.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/estudiar/" className="rounded-lg bg-teal px-5 py-3 font-semibold hover:bg-teal-dark">Elige qué estudiar →</Link>
            {first && <Link href={`/estudiar/${first.ciclo.slug}/${first.modulo.slug}/`} className="rounded-lg bg-white/10 px-5 py-3 font-semibold hover:bg-white/20">{first.modulo.name}</Link>}
          </div>
        </div>
        <ol className="grid gap-3 text-sm">
          {[['1', 'Elige tu módulo', 'Grado medio o superior, ciclo y módulo.'], ['2', 'Lee la tira y la lección', 'ECO mete la pata; NEXO lo explica.'], ['3', 'Ponte a prueba', 'Test de autoevaluación con explicaciones.'], ['4', 'Practica en el simulador', 'Toma decisiones con clientes y consecuencias.']].map(([n, t, d]) => (
            <li key={n} className="flex gap-3 rounded-xl bg-white/5 p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal font-bold">{n}</span><span><b>{t}</b><br /><span className="text-white/70">{d}</span></span></li>
          ))}
        </ol>
      </section>

      <Block kicker="Disponible" title="Módulos para estudiar ya" href="/estudiar/">
        <div className="grid gap-5 md:grid-cols-2">
          {mods.map(({ ciclo, modulo }) => (
            <Link key={modulo.slug} href={`/estudiar/${ciclo.slug}/${modulo.slug}/`} className="rounded-2xl border-2 border-teal p-6 hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wide text-teal">{ciclo.name} · {ciclo.grado === 'medio' ? 'Grado medio' : 'Grado superior'}</p>
              <h3 className="mt-1 text-2xl font-extrabold text-navy">{modulo.name}</h3>
              <p className="mt-2 text-sm text-muted">{modulo.resumen}</p>
              <p className="mt-3 text-sm font-bold text-teal-dark">{lecciones(ciclo.slug, modulo.slug).length} lecciones · tiras cómicas · tests · simulador →</p>
            </Link>
          ))}
          <div className="rounded-2xl border border-line p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Próximamente</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">{CICLOS.map((c) => <li key={c.slug}><Link href={`/estudiar/${c.slug}/`} className="hover:text-navy">{c.name}</Link> · {c.grado === 'medio' ? 'Grado medio' : 'Grado superior'}</li>)}</ul>
          </div>
        </div>
      </Block>

      {sample && first && (
        <Block kicker="Así es una lección" title={sample.titulo} href={sample.url}>
          <Tira panels={sample.tira} titulo={sample.titulo} />
          <p className="mt-4 text-center"><Link href={sample.url} className="font-semibold text-blue underline">Leer la lección completa y hacer el test →</Link></p>
        </Block>
      )}

      <Block kicker="Practica" title="Simuladores" href="/simuladores/">
        <div className="grid gap-5 md:grid-cols-2">{SIMULADORES.map((s) => (
          <div key={s.id} className="rounded-2xl bg-navy p-6 text-white"><h3 className="text-xl font-extrabold">{s.name}</h3><p className="mt-2 text-sm text-white/75">{s.desc}</p><a href={s.url} target="_blank" rel="noopener" className="mt-4 inline-block rounded-lg bg-teal px-4 py-2.5 font-semibold">Jugar →</a></div>
        ))}</div>
      </Block>

      <Block kicker="Herramientas" title="Calcula y practica gratis" href="/herramientas/">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{TOOLS.map((t) => (
          <Link key={t.slug} href={`/herramientas/${t.slug}/`} className="rounded-xl border border-line p-4 hover:border-teal"><span className="text-xs font-bold uppercase tracking-wide text-teal">{t.area}</span><h3 className="mt-1 font-bold text-navy">{t.name}</h3></Link>
        ))}</div>
      </Block>

      {(news.length > 0 || reading.length > 0) && (
        <Block kicker="Actualidad" title={news.length ? 'Noticias de lo que estudias' : 'Casos reales y guías para tu módulo'} href={news.length ? '/actualidad/' : undefined}>
          <div className="grid gap-5 md:grid-cols-3">{(news.length ? news : reading).map((a) => <ArticleCard key={a.url} a={a} />)}</div>
        </Block>
      )}

      <div className="mt-14"><Newsletter /></div>
    </>
  );
}

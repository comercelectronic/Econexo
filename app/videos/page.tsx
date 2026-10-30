import type { Metadata } from 'next';
import { Avatar } from '@/components/Characters';
import { VideoCard } from '@/components/VideoCard';
import { CHANNEL, CHARACTERS, SERIES } from '@/lib/cromo';
import { videos } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'Vídeos: CROMO, el marketing explicado sin tonterías',
  description: 'Vídeos cortos y episodios con humor para aprender marketing digital, IA, finanzas y negocios con CROMO, el camaleón que se cree un gurú.',
  alternates: { canonical: '/videos/' }
};

const Social = () => {
  const links = [['YouTube', CHANNEL.youtube], ['Instagram', CHANNEL.instagram], ['TikTok', CHANNEL.tiktok]].filter(([, u]) => u);
  return links.length ? <div className="mt-6 flex flex-wrap gap-3">{links.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy hover:bg-mist">{n} →</a>)}</div> : null;
};

export default function VideosPage() {
  const list = videos();
  const series = SERIES.filter(([k]) => list.some((v) => v.serie === k));
  return (
    <div className="py-10">
      <header className="grid items-center gap-8 rounded-3xl bg-navy p-8 text-white md:grid-cols-[auto_1fr] md:p-12">
        <Avatar id="cromo" className="h-32 w-32 md:h-44 md:w-44" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal">Vídeos de ECONEXO</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">CROMO</h1>
          <p className="mt-2 text-xl text-white/85">{CHANNEL.claim}</p>
          <p className="mt-4 max-w-2xl text-white/70">CROMO es un camaleón que se cree el mayor gurú del marketing… y lo hace todo mal. Te ríes de sus meteduras de pata y aprendes lo que de verdad funciona. Cada vídeo tiene aquí su guion, la explicación completa y una herramienta para practicar.</p>
          <Social />
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-navy">Los personajes</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTERS.map((c) => (
            <article key={c.id} className="rounded-2xl border border-line p-5">
              <Avatar id={c.id} className="h-20 w-20" />
              <h3 className="mt-3 text-lg font-extrabold" style={{ color: c.color }}>{c.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{c.role}</p>
              <p className="mt-2 text-sm text-ink">{c.bio}</p>
              <p className="mt-3 text-sm font-semibold italic text-navy">{c.quote}</p>
            </article>
          ))}
        </div>
      </section>

      {series.length ? series.map(([k, name, desc]) => (
        <section key={k} id={k} className="mt-12 scroll-mt-28">
          <div className="border-b-2 border-navy pb-2"><h2 className="text-2xl font-extrabold text-navy">{name}</h2><p className="text-sm text-muted">{desc}</p></div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">{list.filter((v) => v.serie === k).map((v) => <VideoCard key={v.slug} v={v} />)}</div>
        </section>
      )) : <p className="mt-12 rounded-xl bg-mist p-8 text-muted">Los primeros episodios de CROMO llegan muy pronto. Suscríbete a la newsletter para enterarte del estreno.</p>}
    </div>
  );
}

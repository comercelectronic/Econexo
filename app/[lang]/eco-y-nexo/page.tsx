// El mundo de ECO y NEXO: la marca educativa d'ECOyNEXO. Vídeos, guies il·lustrades i eines amb ECO i NEXO.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang, l, tr } from '@/lib/i18n';
import { Avatar } from '@/components/Characters';
import { Dialogue } from '@/components/Dialogue';
import { VideoCard } from '@/components/VideoCard';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { CHANNEL, CHARACTERS, POSES, SERIES, UNIVERSE } from '@/lib/universo';
import { videos } from '@/lib/videos';
import { published } from '@/lib/content';
import { TOOLS } from '@/lib/tools';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tr(lang);
  return { title: t('El mundo de ECO y NEXO: el marketing explicado sin tonterías'), description: t('Guías ilustradas y herramientas para aprender marketing digital, economía, tecnología e IA con humor, de la mano de ECO, el ajolote que lo repite todo, y NEXO, la pulpo que lo conecta todo.'),
    alternates: { canonical: l(lang, '/eco-y-nexo/'), languages: { ca: l('ca', '/eco-y-nexo/'), es: l('es', '/eco-y-nexo/') } } };
}

const SUBS: [string, string, string][] = [
  ['videos', 'Vídeos y animaciones', 'Shorts y episodios'], ['guias', 'Guías ilustradas', 'Conceptos explicados con ECO y NEXO'],
  ['herramientas', 'Herramientas con ECO y NEXO', 'Calcula y practica'], ['series', 'Series', 'Humor, economía, IA y errores empresariales']
];

export default async function Universe({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw, t = tr(lang);
  const list = videos(lang);
  const series = SERIES.filter(([k]) => list.some((v) => v.serie === k));
  const guides = published(lang).filter((a) => a.dialogo.length > 0);
  const tools = TOOLS.filter((x) => x.dialogo?.length);
  const social = [['YouTube', CHANNEL.youtube], ['Instagram', CHANNEL.instagram], ['TikTok', CHANNEL.tiktok], ['LinkedIn', CHANNEL.linkedin]].filter(([, u]) => u);
  const [eco, nexo] = CHARACTERS.filter((c) => c.main);
  return (
    <div className="py-10">
      <header className="relative overflow-hidden rounded-3xl bg-navy text-white">
        <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-uni">{t('ECOyNEXO presenta')}</p>
            <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">{t(UNIVERSE.name)}</h1>
            <p className="mt-3 text-xl text-white/85">{t(UNIVERSE.claim)}</p>
            <p className="mt-4 max-w-xl text-white/70">{t('ECO repite todo lo que oye a los «gurús» y mete la pata en cada moda. NEXO conecta los datos, las ideas y las herramientas, y le explica con paciencia (e ironía) lo que de verdad funciona. Juntos son ECOyNEXO. Tú te ríes… y aprendes marketing, economía y tecnología sin sentir que estás en clase.')}</p>
            <nav className="mt-6 flex flex-wrap gap-2" aria-label="ECO y NEXO">
              {SUBS.filter(([id]) => (id !== 'videos' && id !== 'series') || list.length > 0).filter(([id]) => id !== 'guias' || guides.length > 0).map(([id, n]) => <a key={id} href={`#${id}`} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">{t(n)}</a>)}
            </nav>
            {social.length > 0 && <div className="mt-4 flex flex-wrap gap-3">{social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener" className="text-sm font-bold text-uni underline-offset-2 hover:underline">{n} →</a>)}</div>}
          </div>
          <div className="m-4 flex items-end justify-center gap-4 rounded-2xl bg-white p-6 md:m-6">
            <img src={eco.image} alt={`${eco.name}, ${t('el ajolote protagonista')}`} className="h-auto w-[45%] max-w-[260px] object-contain" />
            <img src={nexo.image} alt={`${t(nexo.title || nexo.name)}, ${t('la pulpo experta')}`} className="h-auto w-[52%] max-w-[290px] object-contain" />
          </div>
        </div>
      </header>

      <section className="mt-14">
        <h2 className="text-3xl font-extrabold text-navy">{t('Los protagonistas')}</h2>
        <p className="mt-1 text-muted">{t('Personalidades opuestas, pero complementarias.')}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[eco, nexo].map((c) => (
            <article key={c.id} className="grid gap-5 rounded-3xl border border-line p-6 sm:grid-cols-[150px_1fr]">
              <img src={c.image} alt={c.name} className="mx-auto h-56 w-auto object-contain" />
              <div>
                <h3 className="text-2xl font-extrabold" style={{ color: c.color }}>{t(c.title || c.name)}</h3>
                <p className="text-sm font-bold uppercase tracking-wide text-muted">{t(c.role)}</p>
                <p className="mt-3 text-sm">{t(c.bio)}</p>
                {c.traits && <p className="mt-3 flex flex-wrap gap-1.5">{c.traits.map((r) => <span key={r} className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-navy">{t(r)}</span>)}</p>}
                {c.gag && <p className="mt-3 text-sm"><b className="text-navy">{t('Su sello:')}</b> {t(c.gag)}</p>}
                {c.represents && <p className="mt-3 text-sm"><b className="text-navy">{t('Qué representa:')}</b> {t(c.represents)}</p>}
                <ul className="mt-3 space-y-1 text-sm font-semibold italic text-navy">{c.phrases.map((p) => <li key={p}>{t(p)}</li>)}</ul>
                {POSES[c.id] && <div className="mt-4 flex flex-wrap gap-2">{POSES[c.id].map((p) => <img key={p} src={`/media/personajes/${c.id}-${p}.webp`} alt={`${c.name}: ${p}`} title={p} loading="lazy" className="h-16 w-auto rounded-lg border border-line bg-white p-1" />)}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">{t('Así funcionan juntos')}</h2>
          <p className="mt-2 text-muted">{t('ECO tiene una idea impulsiva. NEXO hace la pregunta inteligente. Y de ahí sale la explicación: se aprende sin la sensación de estar en clase.')}</p>
        </div>
        <Dialogue lang={lang} title="La fórmula" lines={[
          { quien: 'eco', gesto: 'alegria', texto: '¡Lo ha dicho un gurú: invierte 500 € en publicidad y vendes un montón!' },
          { quien: 'nexo', gesto: 'pensativo', texto: '¿Y tienes configurado el seguimiento de conversiones?' },
          { quien: 'eco', gesto: 'confusion', texto: '¿El seguimiento? ¡Yo sigo Instagram todos los días!' },
          { quien: 'nexo', gesto: 'paciencia', texto: 'Eso explica muchas cosas… Tengo ocho brazos y ninguno da abasto contigo.' }
        ]} />
      </section>

      {list.length > 0 && (
        <section id="videos" className="mt-14 scroll-mt-28">
          <div className="border-b-2 border-navy pb-2"><h2 className="text-3xl font-extrabold text-navy">{t('Vídeos y animaciones')}</h2><p className="text-sm text-muted">{t('Shorts de 45 segundos y episodios de 4 a 8 minutos. Cada vídeo tiene aquí su guion y la explicación completa.')}</p></div>
          <div id="series" className="scroll-mt-28">
            {series.map(([k, name, desc]) => (
              <div key={k} id={k} className="mt-8 scroll-mt-28">
                <h3 className="text-xl font-extrabold text-navy">{t(name)}</h3><p className="text-sm text-muted">{t(desc)}</p>
                <div className="mt-4 grid gap-5 md:grid-cols-3">{list.filter((v) => v.serie === k).map((v) => <VideoCard key={v.slug} v={v} lang={lang} />)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section id="guias" className="mt-14 scroll-mt-28">
          <div className="border-b-2 border-navy pb-2"><h2 className="text-3xl font-extrabold text-navy">{t('Guías ilustradas')}</h2><p className="text-sm text-muted">{t('ECO pregunta, NEXO responde y después llega la explicación completa.')}</p></div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">{guides.map((a) => <ArticleCard key={a.url} a={a} lang={lang} />)}</div>
        </section>
      )}

      {tools.length > 0 && (
        <section id="herramientas" className="mt-14 scroll-mt-28">
          <div className="border-b-2 border-navy pb-2"><h2 className="text-3xl font-extrabold text-navy">{t('Herramientas con ECO y NEXO')}</h2><p className="text-sm text-muted">{t('ECO mete los datos mal; NEXO te enseña a interpretarlos bien.')}</p></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((x) => (
              <Link key={x.slug} href={l(lang, `/herramientas/${x.slug}/`)} className="flex gap-3 rounded-2xl border border-line p-5 hover:border-uni hover:shadow-md">
                <Avatar id={x.dialogo![0].quien} gesto={x.dialogo![0].gesto} className="h-12 w-12" />
                <span><span className="block font-bold text-navy">{t(x.name)}</span><span className="text-sm text-muted">{t(x.short)}</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-xl font-extrabold text-navy">{t('También aparecen…')}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CHARACTERS.filter((c) => !c.main).map((c) => (
            <div key={c.id} className="flex gap-4 rounded-2xl border border-line p-4">
              <Avatar id={c.id} className="h-14 w-14" />
              <div><p className="font-extrabold" style={{ color: c.color }}>{c.name} <span className="text-xs font-bold uppercase text-muted">· {t(c.role)}</span></p><p className="text-sm">{t(c.bio)}</p><p className="mt-1 text-sm italic text-navy">{t(c.phrases[0])}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14"><Newsletter variant="nexo" /></div>
    </div>
  );
}

import type { MetadataRoute } from 'next';
import { published, pages } from '@/lib/content';
import { SITE, liveSections } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { videos } from '@/lib/videos';
import { CICLOS, lecciones } from '@/lib/estudios';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => SITE.url + p;
  return [
    { url: u('/'), changeFrequency: 'daily', priority: 1 },
    ...liveSections().map((s) => ({ url: u(`/${s.slug}/`), changeFrequency: 'daily' as const, priority: 0.8 })),
    { url: u('/herramientas/'), priority: 0.8 },
    ...TOOLS.map((t) => ({ url: u(`/herramientas/${t.slug}/`), priority: 0.8 })),
    ...published().filter((a) => a.estado === 'publicada').map((a) => ({ url: u(a.url), lastModified: a.actualizado || a.fecha, priority: 0.7 })),
    { url: u('/estudiar/'), changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: u('/simuladores/'), priority: 0.8 },
    ...CICLOS.map((c) => ({ url: u(`/estudiar/${c.slug}/`), priority: 0.8 })),
    ...CICLOS.flatMap((c) => c.modulos.filter((m) => m.live).flatMap((m) => [{ url: u(`/estudiar/${c.slug}/${m.slug}/`), priority: 0.9 }, ...lecciones(c.slug, m.slug).map((l) => ({ url: u(l.url), priority: 0.8 }))])),
    { url: u('/eco-y-nexo/'), changeFrequency: 'weekly' as const, priority: 0.8 },
    ...videos().filter((v) => v.estado === 'publicada').map((v) => ({ url: u(v.url), lastModified: v.fecha, priority: 0.7 })),
    ...pages().map((p) => ({ url: u(`/${p.slug}/`), priority: 0.3 }))
  ];
}

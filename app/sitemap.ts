import type { MetadataRoute } from 'next';
import { published, pages, sectionHasContent } from '@/lib/content';
import { SITE, liveSections } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { videos } from '@/lib/videos';
import { ciclosLive, lecciones } from '@/lib/estudios';
import { LANGS, l } from '@/lib/i18n';

export const dynamic = 'force-static';

// Cada página existe en catalán y en castellano: se publica con su alternativa (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, extra: Partial<MetadataRoute.Sitemap[number]> = {}) => {
    const languages = Object.fromEntries(LANGS.map((g) => [g, SITE.url + l(g, path)]));
    LANGS.forEach((g) => out.push({ url: SITE.url + l(g, path), priority, alternates: { languages }, ...extra }));
  };
  add('/', 1, { changeFrequency: 'daily' });
  add('/aprender/', 0.95, { changeFrequency: 'weekly' });
  add('/simuladores/', 0.8);
  add('/herramientas/', 0.8);
  TOOLS.forEach((x) => add(`/herramientas/${x.slug}/`, 0.8));
  liveSections().filter((s) => sectionHasContent('ca', s.slug) || sectionHasContent('es', s.slug)).forEach((s) => add(`/${s.slug}/`, 0.8, { changeFrequency: 'daily' }));
  published('es').filter((a) => a.estado === 'publicada').forEach((a) => add(a.url, 0.7, { lastModified: a.actualizado || a.fecha }));
  ciclosLive().forEach((c) => {
    add(`/aprender/${c.slug}/`, 0.8);
    c.modulos.forEach((m) => { add(`/aprender/${c.slug}/${m.slug}/`, 0.9); lecciones('es', c.slug, m.slug).forEach((x) => add(x.url, 0.8)); });
  });
  add('/eco-y-nexo/', 0.8, { changeFrequency: 'weekly' });
  videos('es').filter((v) => v.estado === 'publicada').forEach((v) => add(v.url, 0.7, { lastModified: v.fecha }));
  pages('es').forEach((p) => add(`/${p.slug}/`, 0.3));
  return out;
}

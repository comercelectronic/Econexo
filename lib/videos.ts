// Vídeos del canal ECO y NEXO (content/videos/<slug>.md). Cada vídeo es relaciona amb una guia i una eina d'ECOyNEXO.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { rootFor, SHOW_DRAFTS, PREVIEW_STATES, render, type Estado } from './content';
import type { Lang } from './i18n';

export type Video = {
  slug: string; url: string; titulo: string; descripcion: string; serie: string; formato: 'short' | 'episodio';
  youtube?: string; duracion?: string; personajes: string[]; concepto: string; aprendes: string[];
  guia?: string; herramienta?: string; fecha: string; estado: Estado; html: string;
};

const cache: Partial<Record<Lang, Video[]>> = {};
function all(lang: Lang): Video[] {
  if (cache[lang]) return cache[lang]!;
  const dir = path.join(rootFor(lang), 'videos');
  cache[lang] = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const slug = f.replace(/\.md$/, '');
    return {
      slug, url: `/eco-y-nexo/${slug}/`, titulo: data.titulo, descripcion: data.descripcion || '', serie: data.serie, formato: data.formato || 'short',
      youtube: data.youtube ? String(data.youtube).trim() : undefined, duracion: data.duracion, personajes: data.personajes || ['eco'],
      concepto: data.concepto || '', aprendes: data.aprendes || [], guia: data.guia, herramienta: data.herramienta,
      fecha: new Date(data.fecha).toISOString(), estado: data.estado || 'borrador', html: render(content, lang).html
    };
  });
  return cache[lang]!;
}

export function videos(lang: Lang): Video[] {
  const now = Date.now();
  return all(lang).filter((v) => (SHOW_DRAFTS ? PREVIEW_STATES.includes(v.estado) : v.estado === 'publicada' && Date.parse(v.fecha) <= now))
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
}
export const videoBySlug = (lang: Lang, s: string) => videos(lang).find((v) => v.slug === s);
// Vídeos relacionats amb un article (per la guia) o amb una eina
export const videosForGuide = (lang: Lang, url: string) => videos(lang).filter((v) => v.guia === url);
export const videosForTool = (lang: Lang, slug: string) => videos(lang).filter((v) => v.herramienta === slug);
// Accepta l'identificador de YouTube o un enllaç complet (watch, youtu.be o shorts)
export function youtubeId(v?: string) {
  if (!v) return undefined;
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : undefined;
}

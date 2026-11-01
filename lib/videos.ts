// Vídeos del canal ECO y NEXO (content/videos/<slug>.md). Cada vídeo es relaciona amb una guia i una eina d'ECOyNEXO.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROOT, SHOW_DRAFTS, PREVIEW_STATES, render, type Estado } from './content';

export type Video = {
  slug: string; url: string; titulo: string; descripcion: string; serie: string; formato: 'short' | 'episodio';
  youtube?: string; duracion?: string; personajes: string[]; concepto: string; aprendes: string[];
  guia?: string; herramienta?: string; fecha: string; estado: Estado; html: string;
};

let cache: Video[] | null = null;
function all(): Video[] {
  if (cache) return cache;
  const dir = path.join(ROOT, 'videos');
  cache = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const slug = f.replace(/\.md$/, '');
    return {
      slug, url: `/eco-y-nexo/${slug}/`, titulo: data.titulo, descripcion: data.descripcion || '', serie: data.serie, formato: data.formato || 'short',
      youtube: data.youtube ? String(data.youtube).trim() : undefined, duracion: data.duracion, personajes: data.personajes || ['eco'],
      concepto: data.concepto || '', aprendes: data.aprendes || [], guia: data.guia, herramienta: data.herramienta,
      fecha: new Date(data.fecha).toISOString(), estado: data.estado || 'borrador', html: render(content).html
    };
  });
  return cache;
}

export function videos(): Video[] {
  const now = Date.now();
  return all().filter((v) => (SHOW_DRAFTS ? PREVIEW_STATES.includes(v.estado) : v.estado === 'publicada' && Date.parse(v.fecha) <= now))
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
}
export const videoBySlug = (s: string) => videos().find((v) => v.slug === s);
// Vídeos relacionats amb un article (per la guia) o amb una eina
export const videosForGuide = (url: string) => videos().filter((v) => v.guia === url);
export const videosForTool = (slug: string) => videos().filter((v) => v.herramienta === slug);
// Accepta l'identificador de YouTube o un enllaç complet (watch, youtu.be o shorts)
export function youtubeId(v?: string) {
  if (!v) return undefined;
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : undefined;
}

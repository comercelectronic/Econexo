// Lectura dels continguts editorials (fitxers Markdown a /content/<secció>/<slug>.md).
// Només es publiquen els articles amb estat «publicada» i data ja arribada; a les previsualitzacions
// (ECONEXO_MOSTRAR_BORRADORES=1) també es veuen els que estan en revisió, amb un avís.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export type Source = { nombre: string; url?: string };
export type Faq = { p: string; r: string };
export type Estado = 'borrador' | 'revision' | 'aprobada' | 'programada' | 'publicada' | 'archivada';

export type Article = {
  seccion: string;
  slug: string;
  url: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  tipo: string;
  subseccion?: string;
  etiquetas: string[];
  autor: string;
  revisor?: string;
  fecha: string;
  actualizado?: string;
  estado: Estado;
  destacado: boolean;
  pais: string[];
  moneda?: string;
  imagen?: string;
  imagen_alt?: string;
  fuentes: Source[];
  faq: Faq[];
  herramienta?: string;
  ficha?: Record<string, string>;
  dialogo: { quien: string; gesto?: string; texto: string }[];
  fecha_datos?: string;
  html: string;
  toc: { id: string; text: string }[];
  minutos: number;
};

export const ROOT = path.join(process.cwd(), 'content');
export const SHOW_DRAFTS = process.env.ECONEXO_MOSTRAR_BORRADORES === '1';
export const PREVIEW_STATES: Estado[] = ['revision', 'aprobada', 'programada', 'publicada'];

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function render(md: string) {
  const toc: { id: string; text: string }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const inner = this.parser.parseInline(tokens);
    const text = inner.replace(/<[^>]+>/g, '');
    const id = slugify(text);
    if (depth === 2) toc.push({ id, text });
    return `<h${depth} id="${id}">${inner}</h${depth}>`;
  };
  const html = marked.parse(md, { renderer, async: false }) as string;
  return { html, toc };
}

let cache: Article[] | null = null;

export function allArticles(): Article[] {
  if (cache) return cache;
  const out: Article[] = [];
  if (!fs.existsSync(ROOT)) return (cache = out);
  for (const seccion of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, seccion);
    if (seccion === 'paginas' || seccion === 'videos' || !fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const slug = file.replace(/\.md$/, '');
      const { html, toc } = render(content);
      const words = content.split(/\s+/).length;
      out.push({
        seccion, slug, url: `/${seccion}/${slug}/`,
        titulo: data.titulo, subtitulo: data.subtitulo || '', descripcion: data.descripcion || data.subtitulo || '',
        tipo: data.tipo || 'guia', subseccion: data.subseccion, etiquetas: data.etiquetas || [],
        autor: data.autor || 'Redacción ECONEXO', revisor: data.revisor,
        fecha: new Date(data.fecha).toISOString(), actualizado: data.actualizado ? new Date(data.actualizado).toISOString() : undefined,
        estado: data.estado || 'borrador', destacado: !!data.destacado,
        pais: data.pais || ['global'], moneda: data.moneda, imagen: data.imagen, imagen_alt: data.imagen_alt,
        fuentes: data.fuentes || [], faq: data.faq || [], herramienta: data.herramienta, ficha: data.ficha, dialogo: data.dialogo || [], fecha_datos: data.fecha_datos,
        html, toc, minutos: Math.max(1, Math.round(words / 220))
      });
    }
  }
  return (cache = out);
}

// Articles visibles en aquesta compilació, del més recent al més antic
export function published(): Article[] {
  const now = Date.now();
  return allArticles()
    .filter((a) => (SHOW_DRAFTS ? PREVIEW_STATES.includes(a.estado) : a.estado === 'publicada' && Date.parse(a.fecha) <= now))
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
}

export const isPreview = SHOW_DRAFTS;
export const bySection = (s: string) => published().filter((a) => a.seccion === s);
export const byType = (t: string) => published().filter((a) => a.tipo === t);
export const findArticle = (s: string, slug: string) => published().find((a) => a.seccion === s && a.slug === slug);

export function related(a: Article, n = 3): Article[] {
  const score = (b: Article) => (b.seccion === a.seccion ? 2 : 0) + b.etiquetas.filter((t) => a.etiquetas.includes(t)).length * 3 + (b.subseccion && b.subseccion === a.subseccion ? 2 : 0);
  return published().filter((b) => b.url !== a.url).map((b) => [score(b), b] as const).filter(([s]) => s > 0).sort((x, y) => y[0] - x[0]).slice(0, n).map(([, b]) => b);
}

export type Page = { slug: string; titulo: string; descripcion: string; html: string; actualizado?: string };
export function pages(): Page[] {
  const dir = path.join(ROOT, 'paginas');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { slug: f.replace(/\.md$/, ''), titulo: data.titulo, descripcion: data.descripcion || '', html: render(content).html, actualizado: data.actualizado };
  });
}

export const formatDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' } : {}) }).format(new Date(iso));

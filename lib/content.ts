// Lectura dels continguts editorials (fitxers Markdown a /content/<secció>/<slug>.md).
// Només es publiquen els articles amb estat «publicada» i data ja arribada; a les previsualitzacions
// (ECONEXO_MOSTRAR_BORRADORES=1) també es veuen els que estan en revisió, amb un avís.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { LOCALES, type Lang } from './i18n';

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
  modulos: string[];
  codigos: string[];
  fecha_datos?: string;
  html: string;
  toc: { id: string; text: string }[];
  minutos: number;
};

// Cada idioma té la seva carpeta de continguts: content/ (castellà) i content-ca/ (català), amb les mateixes rutes i noms de fitxer
export const rootFor = (lang: Lang) => path.join(process.cwd(), lang === 'ca' ? 'content-ca' : 'content');
export const SHOW_DRAFTS = process.env.ECONEXO_MOSTRAR_BORRADORES === '1';
export const PREVIEW_STATES: Estado[] = ['revision', 'aprobada', 'programada', 'publicada'];

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Los enlaces internos de los textos (/privacidad/) llevan el prefijo del idioma: /ca/privacidad/ o /es/privacidad/
const prefix = (html: string, lang: Lang) => html.replace(/href="\/(?!ca\/|es\/|media\/)/g, `href="/${lang}/`);

export function render(md: string, lang: Lang) {
  const toc: { id: string; text: string }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const inner = this.parser.parseInline(tokens);
    const text = inner.replace(/<[^>]+>/g, '');
    const id = slugify(text);
    if (depth === 2) toc.push({ id, text });
    return `<h${depth} id="${id}">${inner}</h${depth}>`;
  };
  const html = prefix(marked.parse(md, { renderer, async: false }) as string, lang);
  return { html, toc };
}

const cache: Partial<Record<Lang, Article[]>> = {};

export function allArticles(lang: Lang): Article[] {
  if (cache[lang]) return cache[lang]!;
  const out: Article[] = [];
  const ROOT = rootFor(lang);
  if (!fs.existsSync(ROOT)) return (cache[lang] = out);
  for (const seccion of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, seccion);
    if (seccion === 'paginas' || seccion === 'videos' || seccion === 'modulos' || !fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const slug = file.replace(/\.md$/, '');
      const { html, toc } = render(content, lang);
      const words = content.split(/\s+/).length;
      out.push({
        seccion, slug, url: `/${seccion}/${slug}/`,
        titulo: data.titulo, subtitulo: data.subtitulo || '', descripcion: data.descripcion || data.subtitulo || '',
        tipo: data.tipo || 'guia', subseccion: data.subseccion, etiquetas: data.etiquetas || [],
        autor: data.autor || 'Redacción ECOyNEXO', revisor: data.revisor,
        fecha: new Date(data.fecha).toISOString(), actualizado: data.actualizado ? new Date(data.actualizado).toISOString() : undefined,
        estado: data.estado || 'borrador', destacado: !!data.destacado,
        pais: data.pais || ['global'], moneda: data.moneda, imagen: data.imagen, imagen_alt: data.imagen_alt,
        fuentes: data.fuentes || [], faq: data.faq || [], herramienta: data.herramienta, ficha: data.ficha, dialogo: data.dialogo || [], modulos: data.modulos || [], codigos: data.codigos || [], fecha_datos: data.fecha_datos,
        html, toc, minutos: Math.max(1, Math.round(words / 220))
      });
    }
  }
  return (cache[lang] = out);
}

// Articles visibles en aquesta compilació, del més recent al més antic
export function published(lang: Lang): Article[] {
  const now = Date.now();
  return allArticles(lang)
    .filter((a) => (SHOW_DRAFTS ? PREVIEW_STATES.includes(a.estado) : a.estado === 'publicada' && Date.parse(a.fecha) <= now))
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
}

export const isPreview = SHOW_DRAFTS;
// Seccions amb algun contingut visible en aquesta compilació (les buides no surten al menú, al mapa del web ni es generen)
export const sectionHasContent = (lang: Lang, slug: string) => (slug === 'actualidad' ? published(lang).length > 0 : published(lang).some((a) => a.seccion === slug));
export const bySection = (lang: Lang, s: string) => published(lang).filter((a) => a.seccion === s);
export const byType = (lang: Lang, t: string) => published(lang).filter((a) => a.tipo === t);
export const findArticle = (lang: Lang, s: string, slug: string) => published(lang).find((a) => a.seccion === s && a.slug === slug);

export function related(lang: Lang, a: Article, n = 3): Article[] {
  const score = (b: Article) => (b.seccion === a.seccion ? 2 : 0) + b.etiquetas.filter((t) => a.etiquetas.includes(t)).length * 3 + (b.subseccion && b.subseccion === a.subseccion ? 2 : 0);
  return published(lang).filter((b) => b.url !== a.url).map((b) => [score(b), b] as const).filter(([s]) => s > 0).sort((x, y) => y[0] - x[0]).slice(0, n).map(([, b]) => b);
}

export type Page = { slug: string; titulo: string; descripcion: string; html: string; actualizado?: string };
export function pages(lang: Lang): Page[] {
  const dir = path.join(rootFor(lang), 'paginas');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { slug: f.replace(/\.md$/, ''), titulo: data.titulo, descripcion: data.descripcion || '', html: render(content, lang).html, actualizado: data.actualizado };
  });
}

export const formatDate = (iso: string, lang: Lang, withTime = false) =>
  new Intl.DateTimeFormat(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' } : {}) }).format(new Date(iso));

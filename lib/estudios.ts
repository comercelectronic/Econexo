// Estudis de la família professional de Comerç i Màrqueting: graus, cicles, mòduls, lliçons i simuladors.
// Cada mòdul disponible té les lliçons a content/modulos/<mòdul>/*.md i el temari a data/<mòdul>.json.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { render } from './content';
import type { Lang } from './i18n';

export const GRADOS = [
  { id: 'medio', name: 'Grado medio' },
  { id: 'superior', name: 'Grado superior' }
] as const;

export type Simulador = { id: string; name: string; desc: string; url: string; idiomas: string; interno?: boolean; modulos?: string };
export const SIMULADORES: Simulador[] = [
  {
    id: 'agencia-digital', name: 'Agència Digital',
    desc: 'Dirige tu propia agencia de marketing digital en Vic: clientes reales, decisiones con consecuencias, proyectos que corrige la IA y tu profesor, mundo explorable y mercado entre las agencias de tu clase.',
    url: 'https://agenciadigitalosona.netlify.app/', idiomas: 'Catalán, castellano e inglés'
  },
  {
    id: 'supermercat-petit', name: 'Cas Supermercat Petit', interno: true,
    desc: 'Un caso de clase en equipos y en dos sesiones: un escape room de una hora (dinamización del punto de venta y hojas de cálculo) y un murdoku para descubrir quién atacó a la profe en el supermercado del instituto.',
    url: '/jocs/supermercat-petit/', idiomas: 'Catalán',
    modulos: 'Aplicaciones informáticas para el comercio · Dinamización del punto de venta'
  }
];

export type Modulo = { slug: string; name: string; live: boolean; horas?: string; resumen?: string; simulador?: string };
export type Ciclo = { slug: string; name: string; grado: 'medio' | 'superior'; resumen: string; modulos: Modulo[] };

const m = (name: string, slug?: string): Modulo => ({ slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name, live: false });

export const CICLOS: Ciclo[] = [
  {
    slug: 'actividades-comerciales', name: 'Actividades Comerciales', grado: 'medio',
    resumen: 'Vender, atender al cliente, gestionar un pequeño comercio y vender por internet.',
    modulos: [
      { slug: 'comercio-electronico', name: 'Comercio electrónico', live: true, simulador: 'agencia-digital',
        resumen: 'Plan de marketing digital, tienda online, pagos y logística, mantenimiento de la web, redes sociales y entornos web 2.0. Con el simulador Agència Digital como parte práctica.' },
      m('Marketing en la actividad comercial'), m('Gestión de un pequeño comercio'), m('Técnicas de almacén'), m('Gestión de compras'),
      m('Venta técnica'), m('Dinamización del punto de venta'), m('Procesos de venta'), m('Aplicaciones informáticas para el comercio'),
      m('Servicios de atención comercial')
    ]
  },
  { slug: 'comercializacion-productos-alimentarios', name: 'Comercialización de Productos Alimentarios', grado: 'medio', resumen: 'Venta y comercialización de productos de alimentación.', modulos: [] },
  { slug: 'marketing-y-publicidad', name: 'Marketing y Publicidad', grado: 'superior', resumen: 'Planes de marketing, publicidad, investigación comercial y medios digitales.', modulos: [] },
  { slug: 'gestion-ventas-espacios-comerciales', name: 'Gestión de Ventas y Espacios Comerciales', grado: 'superior', resumen: 'Dirección de ventas, equipos comerciales y espacios de venta.', modulos: [] },
  { slug: 'comercio-internacional', name: 'Comercio Internacional', grado: 'superior', resumen: 'Importación, exportación, logística y marketing internacional.', modulos: [] },
  { slug: 'transporte-y-logistica', name: 'Transporte y Logística', grado: 'superior', resumen: 'Gestión del transporte, almacenes y cadena de suministro.', modulos: [] }
];

// El simulador se abre en el idioma de la web (se puede cambiar dentro del juego)
export const simUrl = (s: Simulador, lang: Lang) => (s.interno ? s.url : `${s.url}?lang=${lang}`);
// Solo se muestra lo que ya está disponible: ciclos con algún módulo activo y, dentro de cada uno, solo sus módulos activos
export const ciclosLive = (): Ciclo[] => CICLOS.filter((c) => c.modulos.some((m) => m.live)).map((c) => ({ ...c, modulos: c.modulos.filter((m) => m.live) }));
export const cicloBySlug = (s: string) => CICLOS.find((c) => c.slug === s);
export const liveModules = () => CICLOS.flatMap((c) => c.modulos.filter((x) => x.live).map((x) => ({ ciclo: c, modulo: x })));
export const simuladorById = (id?: string) => SIMULADORES.find((s) => s.id === id);

export type Bocadillo = { quien: string; gesto?: string; texto: string };
export type Pregunta = { p: string; o: string[]; c: number; por: string };
export type Leccion = {
  id: string; slug: string; url: string; titulo: string; objetivo: string; orden: number; codigos: string[]; area: string;
  capitulo?: string; capitulo_titulo?: string; tira: Bocadillo[][]; ejemplo: string; errores: string[]; test: Pregunta[]; html: string;
};
export type Temario = { bloques: Record<string, string>; temario: [string, string][]; ahora: Record<string, string> };

const cache: Record<string, Leccion[]> = {};
export function lecciones(lang: Lang, ciclo: string, modulo: string): Leccion[] {
  const key = `${lang}/${ciclo}/${modulo}`;
  if (cache[key]) return cache[key];
  const dir = path.join(process.cwd(), lang === 'ca' ? 'content-ca' : 'content', 'modulos', modulo);
  const list = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const slug = f.replace(/\.md$/, '');
    return {
      id: data.id || slug, slug, url: `/aprender/${ciclo}/${modulo}/${slug}/`, titulo: data.titulo, objetivo: data.objetivo || '', orden: data.orden || 999,
      codigos: data.codigos || [], area: data.area || '', capitulo: data.capitulo, capitulo_titulo: data.capitulo_titulo,
      tira: data.tira || [], ejemplo: data.ejemplo || '', errores: data.errores || [], test: data.test || [], html: render(content, lang).html
    } as Leccion;
  }).filter((l) => l.titulo).sort((a, b) => a.orden - b.orden);
  return (cache[key] = list);
}

export function temario(lang: Lang, modulo: string): Temario | null {
  const f = path.join(process.cwd(), 'data', lang === 'ca' ? `${modulo}.ca.json` : `${modulo}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

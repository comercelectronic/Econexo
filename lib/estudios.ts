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

// para: mòduls (ciclo/modulo de CICLOS) per als quals serveix el simulador
export type Simulador = { id: string; name: string; desc: string; url: string; idiomas: string; interno?: boolean; para: { ciclo: string; modulo: string }[] };
export const SIMULADORES: Simulador[] = [
  {
    id: 'agencia-digital', name: 'Agència Digital',
    desc: 'Dirige tu propia agencia de marketing digital en Vic: clientes reales, decisiones con consecuencias, proyectos que corrige la IA y tu profesor, mundo explorable y mercado entre las agencias de tu clase.',
    url: '/jocs/agencia-digital/', idiomas: 'Catalán, castellano e inglés',
    para: [{ ciclo: 'actividades-comerciales', modulo: 'comercio-electronico' }]
  },
  {
    id: 'supermercat-petit', name: 'Cas Supermercat Petit', interno: true,
    desc: 'Un caso de clase en equipos y en dos sesiones: un escape room de una hora (dinamización del punto de venta y hojas de cálculo) y un murdoku para descubrir quién atacó a la profe en el supermercado del instituto.',
    url: '/jocs/supermercat-petit/', idiomas: 'Catalán',
    para: [{ ciclo: 'actividades-comerciales', modulo: 'aplicaciones-informaticas-para-el-comercio' }, { ciclo: 'actividades-comerciales', modulo: 'dinamizacion-del-punto-de-venta' }]
  },
  {
    id: 'mercadeja', name: 'Mercadeja', interno: true,
    desc: 'Juego de tienda: cada alumno empieza con una tienda de barrio y la hace crecer hasta una gran empresa. Decide producto, precio, distribución y promoción y atiende a los clientes con su muñeco. Cuentas de alumno con panel del profesor, retos de clase con ranking en directo y lecciones del currículo de marketing.',
    url: '/jocs/mercadeja/', idiomas: 'Catalán',
    para: [{ ciclo: 'actividades-comerciales', modulo: 'marketing-en-la-actividad-comercial' }]
  },
  {
    id: 'palet', name: 'Palet', interno: true,
    desc: 'Juego de almacén: empiezas de mozo y la jefa te asciende (o te despide). Eliges el almacén (alimentación, frigorífico, cross-docking, comercio electrónico o recambios), con estanterías convencionales, dinámicas, móviles, compactas, cantilever y de picking. Recepción, ubicación, picking con FEFO, palés bien montados y camiones que salen a su hora, con el reloj en marcha y la seguridad en juego.',
    url: '/jocs/palet/', idiomas: 'Catalán',
    para: [{ ciclo: 'actividades-comerciales', modulo: 'tecnicas-de-almacen' }]
  }
];

// practica: com s'anomenen les parts del simulador on es practica cada lliçó (per defecte, «capítols» d'Agència Digital)
export type Practica = { etiqueta: string; orden: string; texto: string; complementaria: string };
export type Modulo = { slug: string; name: string; live: boolean; horas?: string; resumen?: string; simulador?: string; practica?: Practica };
export const PRACTICA_CAPITULOS: Practica = { etiqueta: 'Capítulo', orden: 'En el mismo orden que el simulador: cada lección indica en qué capítulo la pondrás en práctica.', texto: 'En este capítulo aplicarás esta lección con un cliente. Tus decisiones tendrán consecuencias en tu agencia.', complementaria: 'Complementaria: gestionar la agencia' };
export type Ciclo = { slug: string; name: string; grado: 'medio' | 'superior'; resumen: string; modulos: Modulo[] };

const m = (name: string, slug?: string): Modulo => ({ slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name, live: false });

export const CICLOS: Ciclo[] = [
  {
    slug: 'actividades-comerciales', name: 'Actividades Comerciales', grado: 'medio',
    resumen: 'Vender, atender al cliente, gestionar un pequeño comercio y vender por internet.',
    modulos: [
      { slug: 'comercio-electronico', name: 'Comercio electrónico', live: true, simulador: 'agencia-digital',
        resumen: 'Plan de marketing digital, tienda online, pagos y logística, mantenimiento de la web, redes sociales y entornos web 2.0. Con el simulador Agència Digital como parte práctica.' },
      { slug: 'marketing-en-la-actividad-comercial', name: 'Marketing en la actividad comercial', live: true, simulador: 'mercadeja',
        resumen: 'Conceptos de marketing, mercado y consumidor, investigación comercial y las cuatro P: producto, precio, distribución y comunicación, hasta el plan de marketing. Con el simulador Mercadeja como parte práctica.',
        practica: { etiqueta: 'Fase', orden: 'Cada lección indica en qué fase de tu empresa de Mercadeja la pondrás en práctica: de tienda de barrio a gran empresa.', texto: 'En esta fase de Mercadeja aplicarás esta lección en tu tienda: tus decisiones cambian qué compran los clientes y el resultado de cada día.', complementaria: 'Complementaria' } },
      m('Gestión de un pequeño comercio'), { slug: 'tecnicas-de-almacen', name: 'Técnicas de almacén', live: true, simulador: 'palet',
        resumen: 'Organización del almacén, recepción, ubicación, conservación, stocks e inventarios, preparación de pedidos y expedición, equipos de manipulación y prevención de riesgos. Con el simulador Palet como parte práctica.',
        practica: { etiqueta: 'Nivel', orden: 'Cada lección indica en qué nivel de tu carrera en el simulador Palet la pondrás en práctica: de mozo de almacén a jefe de almacén.', texto: 'En este nivel de Palet aplicarás esta lección en el almacén, con el reloj en marcha y la jefa vigilando.', complementaria: 'Complementaria' } }, m('Gestión de compras'),
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
// Mòduls d'un simulador, amb el seu cicle (live: si el mòdul ja té pàgina)
export const modulosDeSimulador = (s: Simulador) => s.para.flatMap(({ ciclo, modulo }) => { const c = cicloBySlug(ciclo), m = c?.modulos.find((x) => x.slug === modulo); return c && m ? [{ ciclo: c, modulo: m }] : []; });

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

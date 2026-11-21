// Material recomanat amb enllaços d'afiliat d'Amazon.es (fitxes de producte amb l'identificador d'afiliat).
// Cada lliçó mostra el llibre de text del mòdul i una recomanació del seu bloc del temari.
// Una recomanació només es mostra quan té `url`: l'enllaç d'un producte concret (SiteStripe o amazon.es/dp/ASIN).
import { SITE } from './site';

export type Recomendacion = { titulo: string; desc: string; q?: string; url?: string };

// Només enllaços a fitxes de producte (amazon.es/dp/…): les pàgines de cerca d'Amazon fallen sovint («Lo sentimos»)
// quan s'hi arriba des d'un altre web. `q` és la cerca per trobar el producte a Amazon i copiar-ne l'enllaç (SiteStripe).
const ambTag = (u: string) => { try { const x = new URL(u); x.searchParams.set('tag', SITE.amazonTag); return x.toString(); } catch { return u; } };
export const ambTagAmazon = (u: string) => ambTag(u);
export const amazonUrl = (r: Recomendacion) => ambTag(r.url || '');

// Per mòdul: «llibre» (llibre de text) i una recomanació per a cada bloc del temari
export const RECOMENDADOS: Record<string, Record<string, Recomendacion>> = {
  'tecnicas-de-almacen': {
    'llibre': { titulo: "Libro de texto: Técnicas de almacén (2.ª edición, 2023)", desc: "El libro del módulo, para repasar recepción, ubicación, picking y stocks.", q: "Técnicas de almacén grado medio libro", url: 'https://www.amazon.es/dp/8428359431' },
    '1': { titulo: "Libros de organización de almacenes", desc: "Distribución en planta, zonas y sistemas de almacenaje.", q: "libro organización y gestión de almacenes" },
    '2': { titulo: "Libros de compras y aprovisionamiento", desc: "Del pedido al proveedor a la recepción de la mercancía.", q: "libro gestión de compras aprovisionamiento" },
    '3': { titulo: "Libros de logística y almacenaje", desc: "Conservación, cadena de frío y unidades de carga.", q: "libro logística almacenaje" },
    '4': { titulo: "Libros de gestión de stocks e inventarios", desc: "Stock de seguridad, punto de pedido, FIFO y FEFO.", q: "libro gestión de stocks inventarios" },
    '5': { titulo: "Libros de preparación de pedidos y distribución", desc: "Picking, rutas, embalaje y expedición.", q: "libro preparación de pedidos picking distribución" },
    '6': { titulo: "Manuales de carretillas elevadoras", desc: "Normas de uso de la carretilla y el transpalé.", q: "manual carretillero carretillas elevadoras" },
    '7': { titulo: "Libros de prevención de riesgos laborales", desc: "Nivel básico de PRL: manipulación de cargas, EPI y emergencias.", q: "libro prevención de riesgos laborales nivel básico" },
    '8': { titulo: "Libros de logística 4.0 y SGA", desc: "Sistemas de gestión de almacén, trazabilidad e indicadores.", q: "libro logística 4.0 sistemas de gestión de almacén" }
  },
  'marketing-en-la-actividad-comercial': {
    'llibre': { titulo: "Libro de texto: Marketing en la actividad comercial (grado medio)", desc: "El libro del módulo, para seguir la teoría de clase.", q: "Marketing en la actividad comercial grado medio libro", url: 'https://www.amazon.es/dp/8448624246' },
    '1': { titulo: "Libros de marketing para empezar", desc: "Los conceptos básicos con casos reales de marcas.", q: "libro marketing para principiantes" },
    '2': { titulo: "Libros sobre el comportamiento del consumidor", desc: "Por qué compramos lo que compramos.", q: "libro comportamiento del consumidor" },
    '3': { titulo: "Libros de investigación de mercados", desc: "Encuestas, fuentes de información y análisis de datos.", q: "libro investigación de mercados" },
    '4': { titulo: "Libros de marca y producto", desc: "Branding, ciclo de vida y diseño de productos.", q: "libro branding marca producto" },
    '5': { titulo: "Libros de estrategia de precios", desc: "Cómo se fijan los precios y la psicología del precio.", q: "libro estrategia de precios" },
    '6': { titulo: "Libros de distribución comercial y retail", desc: "Canales, tiendas y logística comercial.", q: "libro distribución comercial retail" },
    '7': { titulo: "Libros de publicidad y comunicación", desc: "Campañas, mensajes y medios.", q: "libro publicidad comunicación comercial" },
    '8': { titulo: "Libros sobre el plan de marketing", desc: "Paso a paso, del análisis a las acciones.", q: "libro plan de marketing paso a paso" }
  },
  'comercio-electronico': {
    'llibre': { titulo: "Libro de texto: Comercio electrónico (grado medio)", desc: "El libro del módulo, con la teoría de la tienda online.", q: "Comercio electrónico grado medio libro", url: 'https://www.amazon.es/dp/8448196848' },
    '1': { titulo: "Libros de marketing digital", desc: "Estrategia, embudo de ventas y métricas.", q: "libro marketing digital" },
    '2': { titulo: "Libros para crear una tienda online", desc: "Catálogo, pagos, envíos y atención al cliente.", q: "libro crear tienda online ecommerce" },
    '3': { titulo: "Libros de SEO y posicionamiento web", desc: "Cómo hacer que una web salga en Google.", q: "libro SEO posicionamiento web" },
    '4': { titulo: "Libros de community manager", desc: "Gestionar comunidades y atender a los usuarios en la red.", q: "libro community manager" },
    '5': { titulo: "Libros de marketing en redes sociales", desc: "Instagram, TikTok y contenidos que funcionan.", q: "libro marketing redes sociales" }
  }
};

// Recomanacions d'una lliçó: el llibre de text i les dels blocs dels seus continguts (sense repetir)
export function recomanacions(modulo: string, codigos: string[] = []): Recomendacion[] {
  const m = RECOMENDADOS[modulo]; if (!m) return [];
  const blocs = [...new Set(codigos.map((c) => c.split('.')[0]))].filter((b) => m[b]);
  return [m.llibre, ...blocs.slice(0, 2).map((b) => m[b]), ...(blocs.length ? [] : [m['1']])].filter((r) => r && r.url);
}

// Programa de recompenses: Amazon paga un import fix per cada alta a la prova de Prime Student (només per a universitaris)
export const PRIME_STUDENT = { url: 'https://www.amazon.es/joinstudent', titulo: 'Prime Student: 90 días de prueba', desc: 'Para estudiantes universitarios mayores de 18 años: envío rápido gratuito, Prime Video y descuentos para estudiantes. Tras la prueba, 24,95 €/año.' };
export const PRIME = { url: 'https://www.amazon.es/pruebaprime', titulo: 'Amazon Prime: periodo de prueba gratis', desc: 'Para mayores de 18 años: envío en 1 día gratis en más de un millón de productos y acceso prioritario a las ofertas flash. Si no la cancelas, al acabar la prueba se paga la cuota de Prime.' };

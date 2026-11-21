// Material recomanat amb enllaços d'afiliat d'Amazon.es (cerques a Amazon amb l'identificador d'afiliat).
// Per canviar una recomanació per un producte concret, posa-hi `url` amb l'enllaç d'afiliat que dona el panell d'Amazon.
import { SITE } from './site';

export type Recomendacion = { titulo: string; desc: string; q?: string; url?: string };

export const amazonUrl = (r: Recomendacion) => r.url || `https://www.amazon.es/s?k=${encodeURIComponent(r.q || r.titulo)}&tag=${SITE.amazonTag}`;

export const RECOMENDADOS: Record<string, Recomendacion[]> = {
  'marketing-en-la-actividad-comercial': [
    { titulo: 'Libro de texto: Marketing en la actividad comercial (FP)', desc: 'El libro del módulo, para seguir la teoría de clase.', q: 'Marketing en la actividad comercial ciclo formativo libro' },
    { titulo: 'Libros de marketing para empezar', desc: 'Manuales sencillos con casos reales de marcas.', q: 'libro marketing para principiantes' }
  ],
  'tecnicas-de-almacen': [
    { titulo: 'Libro de texto: Técnicas de almacén (FP)', desc: 'El libro del módulo, para repasar recepción, ubicación, picking y stocks.', q: 'Técnicas de almacén ciclo formativo libro' },
    { titulo: 'Libros de logística y gestión de almacenes', desc: 'Para profundizar en organización del almacén e inventarios.', q: 'libro logística gestión de almacenes' }
  ],
  'comercio-electronico': [
    { titulo: 'Libro de texto: Comercio electrónico (FP)', desc: 'El libro del módulo, con la teoría de la tienda online.', q: 'Comercio electrónico ciclo formativo libro' },
    { titulo: 'Libros de marketing digital y SEO', desc: 'Para aprender a atraer visitas y vender en línea.', q: 'libro marketing digital SEO' }
  ]
};

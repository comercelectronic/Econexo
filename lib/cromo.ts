// Univers de CROMO: personatges i sèries dels vídeos d'ECONEXO (YouTube, Shorts, Reels i TikTok).
// Les dades són editables: si canvia el disseny o el nom d'un personatge, només cal tocar aquest fitxer.

export const CHANNEL = {
  name: 'CROMO',
  claim: 'El marketing explicado sin tonterías.',
  closing: 'No seas CROMO. Aprende marketing de verdad.',
  // Enllaços dels canals: es mostren quan tinguin valor
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || ''
};

export type Character = { id: string; name: string; role: string; bio: string; quote: string; color: string };

export const CHARACTERS: Character[] = [
  { id: 'cromo', name: 'CROMO', role: 'El gurú', color: '#2fb36a',
    bio: 'Un camaleón que se cree el mayor experto en marketing digital del mundo. Cambia de estrategia con cada moda, usa palabras técnicas que no entiende y compra todas las herramientas nuevas. Sus resultados suelen ser un desastre, pero es imposible no quererlo.',
    quote: '«¡Esto con inteligencia artificial lo petamos!»' },
  { id: 'profe', name: 'PROFE', role: 'La experta', color: '#3478C5',
    bio: 'Sabe de verdad de marketing y lo explica claro. Intenta que CROMO aprenda… y pierde la paciencia en cada episodio.',
    quote: '«CROMO, tener seguidores no significa tener una comunidad».' },
  { id: 'presu', name: 'DON PRESU', role: 'El financiero', color: '#c8932a',
    bio: 'Solo piensa en costes, márgenes y rentabilidad. Aparece cada vez que CROMO quiere gastar dinero en publicidad.',
    quote: '«Muy bonito. ¿Y el ROI dónde está?»' },
  { id: 'chatarra', name: 'CHATARRA', role: 'La IA', color: '#7a5ac8',
    bio: 'El robot de inteligencia artificial de la oficina. A veces salva a CROMO; otras le da respuestas tan absurdas que lo empeora todo.',
    quote: '«He optimizado tu estrategia: ahora regalamos todos los productos».' }
];

export const SERIES: [string, string, string][] = [
  ['cromo-y-el-marketing', 'CROMO y el marketing', 'Errores de marketing que todos hemos visto (o cometido).'],
  ['cromo-contra-google', 'CROMO contra Google', 'SEO, Google Ads y publicidad digital.'],
  ['cromo-y-la-ia', 'CROMO y la IA', 'Qué hacer (y qué no) con la inteligencia artificial.'],
  ['cromo-se-hace-empresario', 'CROMO se hace empresario', 'Emprendimiento y gestión.'],
  ['cromo-pierde-dinero', 'CROMO pierde dinero', 'Finanzas, márgenes y rentabilidad de la publicidad.'],
  ['cromo-aprende-excel', 'CROMO aprende Excel', 'Ofimática y productividad.'],
  ['el-consejo-del-profe', 'El consejo del Profe', 'Formación rápida en un minuto.']
];
export const serieName = (k: string) => (SERIES.find((s) => s[0] === k) || [k, k])[1];
export const characterById = (id: string) => CHARACTERS.find((c) => c.id === id);

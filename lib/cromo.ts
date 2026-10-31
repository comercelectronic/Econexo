// Universo CROMO: la marca educativa d'ECONEXO. Personatges, expressions, sèries i dades dels canals.
// Si canvia un disseny o un nom, només cal tocar aquest fitxer (i les imatges de public/media/personajes/).

export const UNIVERSE = { slug: 'universo-cromo', name: 'Universo CROMO', claim: 'El marketing explicado sin tonterías.', closing: 'No seas CROMO. Aprende marketing de verdad.' };
export const CHANNEL = {
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || ''
};

export type Character = {
  id: string; name: string; role: string; main: boolean; color: string;
  bio: string; represents?: string; traits?: string[]; phrases: string[];
  image?: string; faces?: Record<string, string>;
};

const face = (id: string, names: string[]) => Object.fromEntries(names.map((n) => [n, `/media/personajes/${id}-${n}.webp`]));

export const CHARACTERS: Character[] = [
  {
    id: 'cromo', name: 'CROMO', role: 'El protagonista que siempre mete la pata', main: true, color: '#2f9e44',
    bio: 'Un camaleón impulsivo, curioso y muy presumido. Cree que lo sabe todo de tecnología y negocios, se apunta a todas las modas (IA, TikTok, criptomonedas, SEO…) y quiere ganar dinero rápido. Comete errores porque no investiga ni planifica, pero es simpático y no tiene mala intención.',
    represents: 'A quienes quieren emprender, hacer marketing o ganar dinero en internet sin tener todavía los conocimientos necesarios. Todos hemos cometido errores parecidos.',
    traits: ['Impulsivo', 'Curioso', 'Presumido', 'Fan de todas las modas', 'Simpático'],
    phrases: ['«¡Esto con inteligencia artificial lo petamos!»', '«¡He visto un vídeo que dice que funciona!»', '«Esto es fácil, ¡yo lo hago!»', '«¡Pero si tengo 10.000 seguidores!»'],
    image: '/media/personajes/cromo-principal.webp',
    faces: { neutral: '/media/personajes/cromo-frontal.webp', ...face('cromo', ['alegria', 'sorpresa', 'enfado', 'confusion', 'verguenza', 'hablando', 'senalando']) }
  },
  {
    id: 'profe', name: 'PROFE SURICATA', role: 'El conocimiento y el sentido común', main: true, color: '#3478C5',
    bio: 'Inteligente, observador y analítico. Tranquilo y paciente, con un humor irónico y sutil. Conoce la economía, el marketing y la tecnología, y explica lo complejo de forma sencilla. No se deja impresionar por las ocurrencias de CROMO… y sabe ponerlo en su sitio.',
    represents: 'El conocimiento, el pensamiento crítico, la formación y las decisiones basadas en datos.',
    traits: ['Inteligente', 'Paciente', 'Irónico', 'Didáctico', 'Con sentido del humor'],
    phrases: ['«Antes de hacerlo, ¿has pensado si es rentable?»', '«CROMO, una cosa es tener seguidores y otra vender».', '«Los datos no mienten. Tu interpretación, quizá sí».', '«Primero aprende. Después invierte».'],
    image: '/media/personajes/profe-principal.webp',
    faces: { neutral: '/media/personajes/profe-pensativo.webp', ...face('profe', ['alegria', 'pensativo', 'sorpresa', 'guino', 'esceptico', 'paciencia']) }
  },
  { id: 'presu', name: 'DON PRESU', role: 'El financiero', main: false, color: '#c8932a',
    bio: 'Solo piensa en costes, márgenes y rentabilidad. Aparece cada vez que CROMO quiere gastar dinero.', phrases: ['«Muy bonito. ¿Y el ROI dónde está?»'] },
  { id: 'chatarra', name: 'CHATARRA', role: 'La IA de la oficina', main: false, color: '#7a5ac8',
    bio: 'A veces salva a CROMO; otras le da respuestas tan absurdas que lo empeora todo.', phrases: ['«He optimizado tu estrategia: ahora regalamos todos los productos».'] }
];

export const SERIES: [string, string, string][] = [
  ['cromo-y-el-marketing', 'CROMO y el marketing', 'Errores de marketing que todos hemos visto (o cometido).'],
  ['cromo-contra-google', 'CROMO contra Google', 'SEO, Google Ads y publicidad digital.'],
  ['cromo-y-la-ia', 'CROMO y la IA', 'Qué hacer (y qué no) con la inteligencia artificial.'],
  ['cromo-se-hace-empresario', 'CROMO se hace empresario', 'Errores empresariales y emprendimiento.'],
  ['cromo-pierde-dinero', 'CROMO pierde dinero', 'Economía explicada fácil: márgenes, finanzas y rentabilidad.'],
  ['cromo-aprende-excel', 'CROMO aprende Excel', 'Ofimática y productividad.'],
  ['el-consejo-del-profe', 'El consejo del Profe Suricata', 'Formación rápida en un minuto.']
];
export const serieName = (k: string) => (SERIES.find((s) => s[0] === k) || [k, k])[1];
export const characterById = (id: string) => CHARACTERS.find((c) => c.id === id);

// Diàleg breu entre personatges (articles, eines i pàgines de l'univers)
export type Line = { quien: string; gesto?: string; texto: string };
export const universeUrl = (p = '') => `/${UNIVERSE.slug}/${p}`;

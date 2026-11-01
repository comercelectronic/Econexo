// El mundo de ECO y NEXO: la marca educativa d'ECOyNEXO. Personatges, expressions, sèries i dades dels canals.
// Junts formen el nom del mitjà: ECO (l'ajolot que repeteix tot el que sent) i NEXO (la pop que ho connecta tot).
// Si canvia un disseny o un nom, només cal tocar aquest fitxer (i les imatges de public/media/personajes/).

export const UNIVERSE = {
  slug: 'eco-y-nexo', name: 'El mundo de ECO y NEXO', short: 'ECO y NEXO',
  claim: 'Comercio y marketing explicados sin tonterías.', closing: 'Aprende con NEXO, no hagas el ECO.'
};
export const CHANNEL = {
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || ''
};

export type Character = {
  id: string; name: string; title?: string; role: string; main: boolean; color: string;
  bio: string; represents?: string; traits?: string[]; phrases: string[]; gag?: string;
  image?: string; faces?: Record<string, string>;
};

// Poses en dibuix de línia (public/media/personajes/<id>-<pose>.webp) i cares retallades (cara-<id>-<pose>.webp).
// Els guions fan servir gestos (alegria, sorpresa, confusion…): GESTOS els tradueix a la pose dibuixada que hi encaixa.
const P = '/media/personajes/';
export const POSES: Record<string, string[]> = {
  eco: ['contento', 'sorprendido', 'avergonzado', 'confuso', 'hablando', 'enfadado', 'senalando'],
  nexo: ['esceptica', 'explicando', 'tapandose', 'satisfecha', 'enfadada']
};
const GESTOS: Record<string, Record<string, string>> = {
  eco: { neutral: 'contento', alegria: 'contento', sorpresa: 'sorprendido', enfado: 'enfadado', confusion: 'confuso', verguenza: 'avergonzado', hablando: 'hablando', senalando: 'senalando' },
  nexo: { neutral: 'esceptica', esceptico: 'esceptica', pensativo: 'explicando', sorpresa: 'explicando', paciencia: 'tapandose', guino: 'satisfecha', alegria: 'satisfecha', enfado: 'enfadada' }
};
// Pose del personatge per a un gest (o la pose base si el gest no existeix)
export const poseFor = (id: string, gesto?: string) => (GESTOS[id] && (GESTOS[id][gesto || 'neutral'] || GESTOS[id].neutral)) || '';
const faces = (id: string) => Object.fromEntries(Object.keys(GESTOS[id]).map((g) => [g, `${P}cara-${id}-${GESTOS[id][g]}.webp`]));

export const CHARACTERS: Character[] = [
  {
    id: 'eco', name: 'ECO', role: 'El ajolote que lo repite todo', main: true, color: '#e8644a',
    bio: 'Entusiasta, impulsivo, optimista hasta el absurdo y bastante presumido. Repite todo lo que ve en TikTok, YouTube o LinkedIn como si fuera la verdad absoluta. Mete la pata en cada moda… y es imposible no quererlo.',
    gag: 'Como los ajolotes de verdad, se regenera: cada desastre lo tumba, pero al día siguiente vuelve con una idea nueva (igual de mala). Sus branquias cambian de color según la moda que sigue.',
    represents: 'A quienes quieren emprender, hacer marketing o ganar dinero en internet sin formarse antes. Todos hemos hecho alguna vez algo parecido.',
    traits: ['Entusiasta', 'Impulsivo', 'Optimista', 'Presumido', 'Simpático'],
    phrases: ['«¡Esto con inteligencia artificial lo petamos!»', '«¡Lo ha dicho un gurú en un vídeo de 15 segundos!»', '«Esto es facilísimo, ¡lo hago yo!»', '«¡Pero si tengo 10.000 seguidores!»', '«Tranquila, ¡mañana me regenero!»'],
    image: P + 'eco-principal.webp', faces: faces('eco')
  },
  {
    id: 'nexo', name: 'NEXO', title: 'La Profe NEXO', role: 'La pulpo que lo conecta todo', main: true, color: '#0c8a85',
    bio: 'Inteligente, tranquila, observadora y paciente… hasta cierto punto. Tiene un humor irónico y seco, explica lo complejo con ejemplos cotidianos y no se deja impresionar por ninguna moda. A veces admite que ella también se equivocó de joven.',
    gag: 'Hace ocho cosas a la vez: un brazo en el Excel, otro en el gráfico, otro en la calculadora y otro con el café. Cuando ECO la lía, se tapa la cara con tres tentáculos. Si se enfada de verdad, se le escapa un poco de tinta.',
    represents: 'El pensamiento crítico, la formación y las decisiones basadas en datos.',
    traits: ['Inteligente', 'Paciente', 'Irónica', 'Didáctica', 'Con sentido del humor'],
    phrases: ['«Antes de hacerlo, ¿has pensado si es rentable?»', '«ECO, una cosa es tener seguidores y otra, vender».', '«Los datos no mienten. Tu interpretación, quizá sí».', '«Primero aprende. Después invierte».', '«Tengo ocho brazos y ninguno da abasto contigo».'],
    image: P + 'nexo-principal.webp', faces: faces('nexo')
  },
  { id: 'presu', name: 'DON PRESU', role: 'El financiero', main: false, color: '#c8932a',
    bio: 'Solo piensa en costes, márgenes y rentabilidad. Aparece cada vez que ECO quiere gastar dinero.', phrases: ['«Muy bonito. ¿Y el ROI dónde está?»'] },
  { id: 'chatarra', name: 'CHATARRA', role: 'La IA de la oficina', main: false, color: '#7a5ac8',
    bio: 'A veces salva a ECO; otras le da respuestas tan absurdas que lo empeora todo.', phrases: ['«He optimizado tu estrategia: ahora regalamos todos los productos».'] }
];

export const SERIES: [string, string, string][] = [
  ['eco-y-el-marketing', 'ECO y el marketing', 'Errores de marketing que todos hemos visto (o cometido).'],
  ['eco-contra-google', 'ECO contra Google', 'SEO, Google Ads y publicidad digital.'],
  ['eco-y-la-ia', 'ECO y la IA', 'Qué hacer (y qué no) con la inteligencia artificial.'],
  ['eco-se-hace-empresario', 'ECO se hace empresario', 'Errores empresariales y emprendimiento.'],
  ['eco-pierde-dinero', 'ECO pierde dinero', 'Economía explicada fácil: márgenes, finanzas y rentabilidad.'],
  ['eco-aprende-excel', 'ECO aprende Excel', 'Ofimática y productividad.'],
  ['el-consejo-de-nexo', 'El consejo de NEXO', 'Formación rápida en un minuto.']
];
export const serieName = (k: string) => (SERIES.find((s) => s[0] === k) || [k, k])[1];
export const characterById = (id: string) => CHARACTERS.find((c) => c.id === id);

// Diàleg breu entre personatges (articles, eines i pàgines de l'univers)
export type Line = { quien: string; gesto?: string; texto: string };
export const universeUrl = (p = '') => `/${UNIVERSE.slug}/${p}`;

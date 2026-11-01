// Configuració general del mitjà: nom, dominis i àrees editorials.
// Les àrees amb `live: false` ja tenen URL reservada però no es publiquen fins que tinguin contingut.

export const SITE = {
  name: 'ECONEXO',
  claim: 'Aprende Comercio y Marketing',
  tagline: 'Aprende. Practica. Avanza.',
  slogan: 'Lecciones, simuladores y herramientas para estudiar los ciclos de Comercio y Marketing.',
  description: 'Lecciones, tiras cómicas, tests, simuladores y herramientas para estudiar los ciclos de FP de Comercio y Marketing, con la actualidad de lo que estudias.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ecoynexo.com',
  locale: 'es',
  defaultAuthor: 'Redacción ECONEXO'
};

export type Section = { slug: string; name: string; short?: string; desc: string; live: boolean; subs: [string, string][] };

export const SECTIONS: Section[] = [
  { slug: 'actualidad', name: 'Actualidad', desc: 'Noticias relacionadas con lo que estudias: comercio, marketing, e-commerce, consumo y tecnología, conectadas con los módulos y el temario.', live: true,
    subs: [['ultima-hora', 'Última hora'], ['empresas', 'Empresas'], ['mercados', 'Mercados'], ['emprendimiento', 'Emprendimiento'], ['internacional', 'Internacional']] },
  { slug: 'marketing-digital', name: 'Marketing digital', short: 'Marketing', desc: 'SEO, SEM, publicidad digital, analítica, email, contenidos, e-commerce y estrategia.', live: true,
    subs: [['seo', 'SEO'], ['sem', 'SEM y Google Ads'], ['meta-ads', 'Meta Ads'], ['email-marketing', 'Email marketing'], ['analitica', 'Analítica digital'], ['contenidos', 'Marketing de contenidos'], ['afiliacion', 'Afiliación'], ['ecommerce', 'E-commerce'], ['conversion', 'CRO y conversión'], ['branding', 'Branding'], ['estrategia', 'Estrategias digitales']] },
  { slug: 'inteligencia-artificial', name: 'Inteligencia artificial', short: 'IA', desc: 'Novedades, herramientas, tutoriales y uso responsable de la IA en empresas y marketing.', live: true,
    subs: [['noticias-ia', 'Noticias'], ['herramientas-ia', 'Herramientas'], ['ia-empresas', 'IA para empresas'], ['ia-marketing', 'IA para marketing'], ['automatizacion', 'Automatización'], ['tutoriales-ia', 'Tutoriales']] },
  { slug: 'finanzas', name: 'Finanzas', desc: 'Finanzas personales y empresariales: ahorro, inversión, crédito y fiscalidad, con fines educativos.', live: true,
    subs: [['finanzas-personales', 'Finanzas personales'], ['ahorro', 'Ahorro'], ['inversiones', 'Inversiones'], ['bancos', 'Bancos y cuentas'], ['prestamos', 'Préstamos e hipotecas'], ['finanzas-empresariales', 'Finanzas empresariales'], ['fiscalidad', 'Fiscalidad']] },
  { slug: 'casos', name: 'Casos', desc: 'Historias reales de empresas: qué hicieron, qué pasó y qué podemos aprender.', live: true,
    subs: [['casos-marketing', 'Marketing'], ['casos-crisis', 'Crisis y reputación'], ['casos-crecimiento', 'Crecimiento'], ['casos-datos', 'Datos y medición'], ['casos-ia', 'Tecnología e IA']] },
  { slug: 'formacion', name: 'Aprende', desc: 'Guías prácticas, tutoriales y conceptos explicados paso a paso.', live: true,
    subs: [['guias', 'Guías prácticas'], ['tutoriales', 'Tutoriales'], ['diccionario', 'Diccionario'], ['plantillas', 'Plantillas']] },
  { slug: 'economia', name: 'Economía', desc: 'Economía española, latinoamericana y mundial.', live: false, subs: [] },
  { slug: 'tecnologia', name: 'Tecnología', desc: 'Actualidad tecnológica, software, ciberseguridad e innovación.', live: false, subs: [] },
  { slug: 'redes-sociales', name: 'Redes sociales', desc: 'Plataformas, creadores y comunicación corporativa.', live: false, subs: [] },
  { slug: 'empresas', name: 'Empresas', desc: 'Emprendimiento, gestión, ventas y estrategia empresarial.', live: false, subs: [] },
  { slug: 'ofimatica', name: 'Ofimática', desc: 'Excel, Google Workspace y productividad.', live: false, subs: [] }
];

export const liveSections = () => SECTIONS.filter((s) => s.live);
export const sectionBySlug = (slug: string) => SECTIONS.find((s) => s.slug === slug);

export const TYPES: Record<string, string> = {
  noticia: 'Noticia', guia: 'Guía', financiero: 'Guía financiera', caso: 'Caso real', analisis: 'Análisis', opinion: 'Opinión'
};

export const COUNTRIES: Record<string, string> = {
  global: 'España y Latinoamérica', ES: 'España', MX: 'México', AR: 'Argentina', CO: 'Colombia', CL: 'Chile', PE: 'Perú'
};

// Catàleg d'eines pròpies. Cada eina té la seva pàgina a /herramientas/<slug>/ amb calculadora, fórmula, exemple i limitacions.
import type { Line } from './universo';

export type Tool = { slug: string; name: string; area: string; short: string; intro: string; formula: string; example: string; limits: string[]; faq: { p: string; r: string }[]; guide?: string; dialogo?: Line[]; codigos?: string[] };

export const TOOLS: Tool[] = [
  {
    slug: 'calculadora-roas', codigos: ['1.6'],
    dialogo: [{ quien: 'eco', gesto: 'alegria', texto: '¡He gastado 100 € en anuncios y he facturado 500 €! ¿Soy rico?' }, { quien: 'nexo', gesto: 'pensativo', texto: 'Tienes un ROAS de 5: 5 € de ventas por cada euro de publicidad. Ahora mete tu margen y veremos si ganas dinero… o solo vendes.' }], name: 'Calculadora de ROAS', area: 'Marketing', short: 'Rentabilidad de tu inversión publicitaria y ROAS de equilibrio.',
    intro: 'Calcula cuántos euros (o pesos) de ingresos genera cada unidad invertida en publicidad y, con tu margen bruto, a partir de qué ROAS empiezas a ganar dinero.',
    formula: 'ROAS = ingresos atribuidos ÷ inversión publicitaria. ROAS de equilibrio = 1 ÷ margen bruto (en tanto por uno).',
    example: 'Inviertes 500 € y la campaña genera 2.000 € de ventas: ROAS = 4. Si tu margen bruto es del 30 %, el ROAS de equilibrio es 1 ÷ 0,30 ≈ 3,33: con un ROAS de 4 ganas dinero; con 3, pierdes.',
    limits: ['Los ingresos «atribuidos» dependen del modelo de atribución de cada plataforma, que suele sobrestimar su propio impacto.', 'No incluye costes fijos ni el trabajo de gestión de la campaña.', 'Un ROAS alto no siempre es incremental: parte de esas ventas se habrían producido igualmente.'],
    faq: [{ p: '¿Qué es un buen ROAS?', r: 'El que supera tu ROAS de equilibrio con margen suficiente para cubrir el resto de costes. No hay una cifra universal: depende del margen de cada negocio.' }, { p: '¿Es lo mismo ROAS que ROI?', r: 'No. El ROAS compara ingresos con inversión publicitaria; el ROI compara el beneficio con la inversión total.' }],
    guide: '/marketing-digital/como-calcular-el-roas/'
  },
  {
    slug: 'calculadora-roi', codigos: ['1.1', '3.9'],
    dialogo: [{ quien: 'eco', gesto: 'senalando', texto: 'La feria me costó 600 € y vendí 3.000 €. ¡ROI del 400 %!' }, { quien: 'nexo', gesto: 'esceptico', texto: 'El ROI se calcula con el beneficio, no con las ventas. ¿Cuánto margen te dejaron esos 3.000 €?' }], name: 'Calculadora de ROI', area: 'Rentabilidad', short: 'Retorno de una inversión en marketing o en un proyecto.',
    intro: 'Calcula el retorno de la inversión (ROI) de una campaña, una herramienta o un proyecto a partir de lo que has invertido y del beneficio que ha generado.',
    formula: 'ROI (%) = (beneficio generado − inversión) ÷ inversión × 100. El beneficio generado es el margen, no la facturación.',
    example: 'Una feria cuesta 600 € y te trae dos clientes que dejan 1.500 € de margen: ROI = (1.500 − 600) ÷ 600 × 100 = 150 %.',
    limits: ['Usa el margen (ingresos menos costes variables), no la facturación bruta.', 'No tiene en cuenta el tiempo: un ROI del 50 % en un mes no es lo mismo que en tres años.', 'Si los resultados se repiten en el futuro (clientes recurrentes), el ROI de un periodo corto los infravalora.'],
    faq: [{ p: '¿Un ROI negativo siempre es malo?', r: 'En el periodo medido, la inversión no se ha recuperado. Puede ser aceptable si capta clientes que seguirán comprando (mira también el LTV).' }]
  },
  {
    slug: 'generador-utm', codigos: ['1.1', '3.10'],
    dialogo: [{ quien: 'eco', gesto: 'confusion', texto: 'Analytics dice que mis visitas vienen de «direct». ¿Tengo fans que escriben mi web de memoria?' }, { quien: 'nexo', gesto: 'guino', texto: 'O no has etiquetado los enlaces de la newsletter. Prueba con esto.' }], name: 'Generador de UTM', area: 'Analítica', short: 'Etiqueta los enlaces de tus campañas para medirlas en Analytics.',
    intro: 'Crea enlaces con parámetros UTM para saber en Google Analytics de qué campaña, canal y fuente viene cada visita.',
    formula: 'URL?utm_source=fuente&utm_medium=medio&utm_campaign=campaña (y opcionalmente utm_term y utm_content).',
    example: 'Una newsletter de noviembre: https://tuweb.com/oferta/?utm_source=newsletter&utm_medium=email&utm_campaign=noviembre',
    limits: ['Usa siempre minúsculas y los mismos nombres: «Email» y «email» se cuentan como medios distintos.', 'No uses UTM en enlaces internos de tu propia web: rompen la atribución de la sesión.'],
    faq: [{ p: '¿Qué significa UTM?', r: 'Urchin Tracking Module: viene de Urchin, la empresa que Google compró en 2005 y que dio origen a Google Analytics.' }]
  },
  {
    slug: 'calculadora-engagement', codigos: ['4.6', '4.8', '4.10'], name: 'Calculadora de engagement', area: 'Redes sociales', short: 'Mide si tus seguidores interactúan de verdad con tu contenido.',
    dialogo: [{ quien: 'eco', gesto: 'alegria', texto: '¡Tengo 10.000 seguidores! Soy un influencer, ¿no?' }, { quien: 'nexo', gesto: 'esceptico', texto: 'Con 3 «me gusta» por publicación… Vamos a calcular tu tasa de interacción, ECO.' }],
    intro: 'Calcula la tasa de interacción (engagement) de una cuenta o de una publicación a partir de los seguidores y de los «me gusta», comentarios, compartidos y guardados.',
    formula: 'Tasa de interacción por seguidores = (me gusta + comentarios + compartidos + guardados) ÷ número de publicaciones ÷ seguidores × 100. Si conoces el alcance, también se puede calcular sobre el alcance.',
    example: 'Una cuenta con 10.000 seguidores que suma 1.200 interacciones en 10 publicaciones tiene una media de 120 interacciones por publicación: 120 ÷ 10.000 × 100 = 1,2 %.',
    limits: ['Cada red y cada sector tienen medias distintas: compárate sobre todo contigo mismo a lo largo del tiempo.', 'Las cuentas con muchos seguidores suelen tener tasas más bajas.', 'Interacción no es venta: mide también clics, contactos y conversiones.', 'Seguidores comprados o inactivos hunden la tasa y el alcance.'],
    faq: [{ p: '¿Qué tasa de engagement es buena?', r: 'Depende de la red, del sector y del tamaño de la cuenta. Lo útil es seguir tu propia evolución y compararte con cuentas parecidas a la tuya.' }, { p: '¿Por qué los comentarios valen más que los «me gusta»?', r: 'Porque requieren más esfuerzo y suelen indicar un interés mayor. Algunas marcas ponderan cada tipo de interacción.' }]
  },
  {
    slug: 'interes-compuesto', codigos: ['3.9'],
    dialogo: [{ quien: 'eco', gesto: 'hablando', texto: 'Quiero hacerme rico en tres días. ¿Qué rentabilidad pongo? ¿El 300 %?' }, { quien: 'nexo', gesto: 'paciencia', texto: 'Pon algo prudente y sube los años. Verás que el ingrediente secreto no es el porcentaje: es el tiempo.' }], name: 'Calculadora de interés compuesto', area: 'Finanzas', short: 'Simula cómo crece un ahorro o una inversión con el tiempo.',
    intro: 'Simula cómo evoluciona un capital con aportaciones periódicas y una rentabilidad anual supuesta, y compáralo con lo que has aportado y con el efecto de la inflación.',
    formula: 'Cada mes: saldo = saldo × (1 + r/12) + aportación, donde r es la rentabilidad anual supuesta. Valor real = valor nominal ÷ (1 + inflación)^años.',
    example: '10.000 € iniciales y 100 € al mes durante 20 años a un 5 % anual suponen 34.000 € aportados y unos 68.200 € finales (en términos nominales, sin impuestos ni comisiones).',
    limits: ['Es una simulación educativa: la rentabilidad real no es constante y puede ser negativa.', 'No incluye comisiones, impuestos ni cambios de aportación.', 'Las rentabilidades pasadas no garantizan rentabilidades futuras. No es asesoramiento financiero personalizado.'],
    faq: [{ p: '¿Qué rentabilidad debo poner?', r: 'Usa escenarios prudentes y compara varios (por ejemplo, 2 %, 4 % y 6 %). Ninguna cifra está garantizada.' }, { p: '¿Por qué importa la inflación?', r: 'Porque reduce el poder adquisitivo: el mismo dinero dentro de 20 años comprará menos cosas.' }],
    guide: '/finanzas/como-funciona-el-interes-compuesto/'
  }
];

export const toolBySlug = (s: string) => TOOLS.find((t) => t.slug === s);

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
  },
  {
    slug: 'calculadora-margen-precio', codigos: ['2.1', '2.2'], name: 'Calculadora de margen y precio de venta', area: 'Ventas',
    short: 'Del coste de compra al precio de venta con IVA, con margen y markup.',
    dialogo: [{ quien: 'eco', gesto: 'alegria', texto: 'Lo compro a 10 € y lo vendo a 15 €. ¡Un 50 % de beneficio!' }, { quien: 'nexo', gesto: 'esceptico', texto: 'Eso es el markup. Tu margen sobre la venta es del 33 %. Y aún no has contado el IVA ni tus gastos.' }],
    intro: 'Calcula a qué precio vender un producto para conseguir el margen que quieres, y comprueba cuánto es en margen, en markup y con IVA incluido.',
    formula: 'Precio sin IVA = coste ÷ (1 − margen). Markup = (precio − coste) ÷ coste. Precio con IVA = precio sin IVA × (1 + IVA).',
    example: 'Compras a 10 € y quieres un margen del 40 % sobre la venta: precio = 10 ÷ 0,60 = 16,67 € sin IVA, que son 20,17 € con un IVA del 21 %. El markup es del 66,7 %.',
    limits: ['Margen (sobre el precio de venta) y markup (sobre el coste) no son lo mismo: un margen del 40 % equivale a un markup del 66,7 %.', 'No incluye gastos fijos, comisiones de plataformas ni devoluciones.', 'Revisa el tipo de IVA aplicable a tu producto.'],
    faq: [{ p: '¿Cuál es la diferencia entre margen y markup?', r: 'El margen se calcula sobre el precio de venta y el markup sobre el coste. Con el mismo producto, el markup siempre es mayor que el margen.' }, { p: '¿El margen incluye el IVA?', r: 'No. El IVA no es ingreso del comercio: se cobra al cliente y se ingresa a Hacienda. Los márgenes se calculan siempre sin IVA.' }]
  },
  {
    slug: 'calculadora-iva', name: 'Calculadora de IVA', area: 'Ventas',
    short: 'Añade o quita el IVA de un precio en un segundo.',
    dialogo: [{ quien: 'eco', gesto: 'confusion', texto: 'El cliente paga 121 €. ¿Le quito el 21 % y ya tengo la base?' }, { quien: 'nexo', gesto: 'paciencia', texto: 'No: 121 ÷ 1,21 = 100. Si restas el 21 % de 121, te sale una base equivocada. Prueba con la calculadora.' }],
    intro: 'Calcula el precio con IVA a partir de la base imponible, o la base y el IVA a partir de un precio final.',
    formula: 'Total = base × (1 + IVA). Base = total ÷ (1 + IVA). IVA = total − base.',
    example: 'Una base de 100 € con un IVA del 21 % da un total de 121 €. Si el cliente paga 121 €, la base es 121 ÷ 1,21 = 100 € y el IVA es 21 €.',
    limits: ['Los tipos de IVA (general, reducido, superreducido) dependen del producto y del país o territorio.', 'No sustituye el asesoramiento fiscal: hay operaciones exentas y regímenes especiales.'],
    faq: [{ p: '¿Qué tipos de IVA hay en España?', r: 'El general del 21 %, el reducido del 10 % y el superreducido del 4 %, según el producto o servicio. Consulta siempre la normativa vigente.' }, { p: '¿Por qué no se resta el porcentaje al total?', r: 'Porque el IVA se calcula sobre la base, no sobre el total. Para quitar un 21 % hay que dividir entre 1,21.' }]
  },
  {
    slug: 'punto-de-equilibrio', codigos: ['3.9'], name: 'Calculadora del punto de equilibrio', area: 'Rentabilidad',
    short: 'Cuántas unidades tienes que vender para no perder dinero.',
    dialogo: [{ quien: 'eco', gesto: 'alegria', texto: '¡Abro la tienda online! Solo cuesta 800 € al mes entre web, herramientas y cuota.' }, { quien: 'nexo', gesto: 'pensativo', texto: '¿Y cuántos productos tienes que vender solo para llegar a cero? Ese es el punto de equilibrio.' }],
    intro: 'Calcula cuántas unidades y cuánta facturación necesitas para cubrir tus costes fijos, y cuánto ganas (o pierdes) con las ventas que esperas.',
    formula: 'Margen de contribución = precio − coste variable. Unidades de equilibrio = costes fijos ÷ margen de contribución. Ingresos de equilibrio = unidades × precio.',
    example: 'Costes fijos de 800 €/mes, precio de 40 € y coste variable de 25 €: margen de contribución 15 €; equilibrio = 800 ÷ 15 ≈ 54 unidades al mes (2.133 € de facturación).',
    limits: ['Supone un solo producto, precio y coste variable constantes.', 'Los costes fijos pueden cambiar al crecer (más personal, más espacio).', 'No tiene en cuenta cuánto tardan en llegar las ventas ni los cobros.'],
    faq: [{ p: '¿Qué son costes fijos y variables?', r: 'Los fijos no cambian con las ventas (alquiler, cuotas, sueldos). Los variables sí (coste del producto, envío, comisión de pago).' }, { p: '¿Qué hago si el equilibrio es inalcanzable?', r: 'Sube el precio, baja el coste variable o reduce los costes fijos. Si ninguna es posible, el modelo no es viable tal como está.' }]
  },
  {
    slug: 'calculadora-descuentos', codigos: ['2.1'], name: 'Calculadora de descuentos y rebajas', area: 'Ventas',
    short: 'Precio final, ahorro y descuento real de una o dos rebajas seguidas.',
    dialogo: [{ quien: 'eco', gesto: 'hablando', texto: '¡Rebajas del 30 % más un 20 % extra! ¡Es un 50 % de descuento!' }, { quien: 'nexo', gesto: 'guino', texto: 'Son un 44 %: el segundo descuento se aplica al precio ya rebajado. Compruébalo.' }],
    intro: 'Calcula el precio final tras un descuento, o tras dos descuentos encadenados, y descubre el porcentaje real de rebaja.',
    formula: 'Precio final = precio × (1 − d1) × (1 − d2). Descuento total = 1 − (1 − d1) × (1 − d2).',
    example: 'Un producto de 100 € con un 30 % y un 20 % extra cuesta 100 × 0,70 × 0,80 = 56 €: el descuento real es del 44 %, no del 50 %.',
    limits: ['Los descuentos se aplican en cadena, no se suman.', 'En España, al anunciar una rebaja hay que indicar también el precio anterior (el más bajo de los últimos 30 días, según la normativa de consumidores).'],
    faq: [{ p: '¿Por qué no se suman los descuentos?', r: 'Porque el segundo se aplica sobre un precio que ya es más bajo. Un 30 % más un 20 % equivale a un 44 %.' }, { p: '¿Cómo calculo el precio antes del descuento?', r: 'Divide el precio final entre (1 − descuento): si pagas 70 € con un 30 % de rebaja, el original era 70 ÷ 0,70 = 100 €.' }]
  },
  {
    slug: 'metricas-publicidad', codigos: ['1.6'], name: 'Calculadora de CTR, CPC, CPM y CPA', area: 'Marketing',
    short: 'Las métricas clave de una campaña de anuncios, calculadas de una vez.',
    dialogo: [{ quien: 'eco', gesto: 'sorpresa', texto: '¡Mi anuncio ha tenido 50.000 impresiones! ¡Soy viral!' }, { quien: 'nexo', gesto: 'esceptico', texto: 'Impresiones no es dinero. Mira el CTR, el CPC y cuánto te cuesta cada venta.' }],
    intro: 'Introduce los datos de tu campaña (impresiones, clics, coste y conversiones) y obtén el CTR, CPC, CPM, tasa de conversión y CPA.',
    formula: 'CTR = clics ÷ impresiones. CPC = coste ÷ clics. CPM = coste ÷ impresiones × 1.000. Tasa de conversión = conversiones ÷ clics. CPA = coste ÷ conversiones.',
    example: '20.000 impresiones, 400 clics, 240 € de coste y 12 ventas: CTR 2 %, CPC 0,60 €, CPM 12 €, conversión 3 % y CPA 20 €.',
    limits: ['Cada plataforma puede contar los clics y las conversiones de forma distinta.', 'Un CPA bajo no sirve si el cliente deja poco margen: compáralo con el beneficio por venta.'],
    faq: [{ p: '¿Qué es un buen CTR?', r: 'Depende del canal y del sector. Compáralo con tus campañas anteriores y con las medias de tu sector.' }, { p: '¿Qué diferencia hay entre CPC y CPA?', r: 'El CPC es lo que pagas por cada clic; el CPA es lo que pagas por cada conversión (venta, contacto…).' }]
  },
  {
    slug: 'tasa-conversion-ticket-medio', codigos: ['3.9', '3.10', '3.11'], name: 'Tasa de conversión y ticket medio', area: 'Comercio electrónico',
    short: 'Mide tu tienda online y calcula cuánto ganarías si mejoras la conversión.',
    dialogo: [{ quien: 'eco', gesto: 'confusion', texto: 'Tengo 5.000 visitas al mes y solo 40 pedidos. ¡La gente no sabe comprar!' }, { quien: 'nexo', gesto: 'pensativo', texto: 'Tu tasa de conversión es del 0,8 %. Veamos cuánto subirían las ventas si la mejoras un poco.' }],
    intro: 'Calcula la tasa de conversión, el ticket medio y los ingresos por visita de una tienda online, y simula el efecto de mejorar la conversión.',
    formula: 'Tasa de conversión = pedidos ÷ visitas. Ticket medio = ingresos ÷ pedidos. Ingresos por visita = ingresos ÷ visitas.',
    example: '5.000 visitas, 40 pedidos y 2.000 € de ingresos: conversión 0,8 %, ticket medio 50 € y 0,40 € por visita. Si la conversión mejora un 25 % (de 0,8 a 1 %), serían 50 pedidos y 2.500 €.',
    limits: ['La conversión depende de la fuente del tráfico: el de búsqueda y el de redes se comportan distinto.', 'Mejorar la conversión no sirve si baja el ticket medio o el margen.'],
    faq: [{ p: '¿Qué conversión es normal en una tienda online?', r: 'Suele moverse entre el 1 % y el 3 %, pero varía mucho según el sector y el precio del producto.' }, { p: '¿Cómo mejoro la conversión?', r: 'Cuida la ficha de producto, simplifica el carrito y el pago, muestra opiniones y costes de envío claros y acelera la web.' }]
  },
  {
    slug: 'calculadora-ltv-cac', codigos: ['1.10'], name: 'Calculadora de LTV y CAC', area: 'Marketing',
    short: 'Cuánto vale un cliente a lo largo de su vida y cuánto cuesta conseguirlo.',
    dialogo: [{ quien: 'eco', gesto: 'verguenza', texto: 'Conseguir un cliente me cuesta 60 € y en su primera compra me deja 20 €…' }, { quien: 'nexo', gesto: 'pensativo', texto: 'Depende de cuántas veces vuelva a comprar. Calculemos su valor de vida: el LTV.' }],
    intro: 'Calcula el valor de vida de un cliente (LTV), lo que te cuesta conseguirlo (CAC) y en cuántos meses recuperas esa inversión.',
    formula: 'LTV = ticket medio × compras al año × años de relación × margen. Ratio LTV/CAC = LTV ÷ CAC. Recuperación (meses) = CAC ÷ (margen mensual por cliente).',
    example: 'Ticket de 40 €, 3 compras al año, 3 años de relación y un 30 % de margen: LTV = 40 × 3 × 3 × 0,30 = 108 €. Con un CAC de 36 €, el ratio es 3: se suele considerar saludable.',
    limits: ['Es una estimación: asume que el comportamiento del cliente se mantiene.', 'Incluye en el CAC todos los costes de captación (publicidad, comisiones, tiempo del equipo), no solo los anuncios.'],
    faq: [{ p: '¿Qué ratio LTV/CAC es bueno?', r: 'Como orientación se suele buscar 3 o más. Por debajo de 1 pierdes dinero con cada cliente.' }, { p: '¿Qué es el CAC?', r: 'El coste de adquisición de cliente: lo que gastas en marketing y ventas dividido entre los clientes nuevos que consigues.' }]
  },
  {
    slug: 'stock-y-punto-de-pedido', codigos: ['2.6'], name: 'Calculadora de stock y punto de pedido', area: 'Almacén y logística',
    short: 'Cuándo reponer el stock y cuántas veces rota al año.',
    dialogo: [{ quien: 'eco', gesto: 'sorpresa', texto: '¡Se ha agotado el producto estrella y el proveedor tarda dos semanas!' }, { quien: 'nexo', gesto: 'paciencia', texto: 'Por eso existe el punto de pedido: se pide antes de quedarse sin stock. Vamos a calcularlo.' }],
    intro: 'Calcula el punto de pedido (cuándo reponer) con tu demanda diaria, el plazo de entrega y un stock de seguridad, y la rotación de tu stock.',
    formula: 'Punto de pedido = demanda diaria × plazo de entrega + stock de seguridad. Rotación = coste de las ventas del año ÷ stock medio valorado. Días de stock = 365 ÷ rotación.',
    example: 'Vendes 8 unidades al día, el proveedor tarda 10 días y quieres 3 días de seguridad: punto de pedido = 8 × 10 + 24 = 104 unidades. Con 120.000 € de coste de ventas y 20.000 € de stock medio, rotación = 6 veces al año (61 días de stock).',
    limits: ['Supone una demanda estable: las campañas y la temporada la cambian.', 'El plazo de entrega real del proveedor puede variar.', 'Una rotación alta no siempre es buena: puede indicar roturas de stock.'],
    faq: [{ p: '¿Qué es el stock de seguridad?', r: 'Un colchón de unidades para cubrir imprevistos: retrasos del proveedor o ventas superiores a lo previsto.' }, { p: '¿Qué indica una rotación baja?', r: 'Que el dinero está parado en mercancía: stock excesivo, productos que no se venden o riesgo de obsolescencia.' }]
  },
  {
    slug: 'contador-seo-titulo-descripcion', codigos: ['1.6', '3.6'], name: 'Contador SEO: título y descripción', area: 'SEO',
    short: 'Comprueba la longitud de tu título y meta descripción y mira cómo se vería en Google.',
    dialogo: [{ quien: 'eco', gesto: 'hablando', texto: 'Mi título tiene 140 caracteres: ¡todas las palabras clave del mundo!' }, { quien: 'nexo', gesto: 'esceptico', texto: 'Google lo cortará hacia los 60. Escribe para quien busca, no para el robot.' }],
    intro: 'Escribe el título y la meta descripción de una página y comprueba si entran en la longitud recomendada y cómo se vería el resultado en Google.',
    formula: 'Títulos de hasta unos 60 caracteres y meta descripciones de hasta unos 155. Son referencias: Google corta por ancho en píxeles, no por número de caracteres.',
    example: 'Título: «Tienda de bicicletas en Vic · Reparación y venta» (49 caracteres). Descripción: una frase de 120–155 caracteres que diga qué ofreces y por qué elegirte.',
    limits: ['Es una guía orientativa: Google puede reescribir el título y la descripción.', 'Incluir la palabra clave ayuda, pero lo que mejora los clics es que el texto sea claro y atractivo.'],
    faq: [{ p: '¿Influye la meta descripción en el posicionamiento?', r: 'No directamente, pero un texto atractivo aumenta los clics, y eso sí te beneficia.' }, { p: '¿Cuántos caracteres debe tener un título SEO?', r: 'Alrededor de 50–60, para que no se corte en los resultados.' }]
  }
];

export const toolBySlug = (s: string) => TOOLS.find((t) => t.slug === s);
